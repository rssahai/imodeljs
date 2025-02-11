/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Tiles
 */

import { BeTimePoint } from "@bentley/bentleyjs-core";
import { ClipVector, Map4d, Point3d, Range3d, Transform } from "@bentley/geometry-core";
import { FrustumPlanes, ViewFlagOverrides } from "@bentley/imodeljs-common";
import { FeatureSymbology } from "../render/FeatureSymbology";
import { GraphicBranch } from "../render/GraphicBranch";
import { RenderClipVolume } from "../render/RenderClipVolume";
import { RenderGraphic } from "../render/RenderGraphic";
import { RenderPlanarClassifier } from "../render/RenderPlanarClassifier";
import { RenderTextureDrape } from "../render/RenderSystem";
import { SceneContext } from "../ViewContext";
import { ViewingSpace } from "../ViewingSpace";
import { CoordSystem } from "../Viewport";
import { Tile, TileGraphicType, TileTree } from "./internal";

const scratchRange = new Range3d();
const scratchPoint = Point3d.create();

/**
 * Arguments used when selecting and drawing [[Tile]]s.
 * @see [[TileTree.selectTiles]]
 * @see [[TileTree.draw]]
 * @beta
 */
export class TileDrawArgs {
  /** Transform to the location in iModel coordinates at which the tiles are to be drawn. */
  public readonly location: Transform;
  /** The tile tree being drawn. */
  public readonly tree: TileTree;
  /** Optional clip volume applied to the tiles. */
  public clipVolume?: RenderClipVolume;
  /** The context in which the tiles will be drawn, exposing, e.g., the [[Viewport]] and accepting [[RenderGraphic]]s to be drawn. */
  public readonly context: SceneContext;
  /** Describes the viewed volume. */
  public viewingSpace: ViewingSpace;
  /** Holds the tile graphics to be drawn. */
  public readonly graphics: GraphicBranch = new GraphicBranch();
  /** @internal */
  public readonly now: BeTimePoint;
  /** The planes of the viewing frustum, used for frustum culling. */
  protected _frustumPlanes?: FrustumPlanes;
  /** @internal */
  public planarClassifier?: RenderPlanarClassifier;
  /** @internal */
  public drape?: RenderTextureDrape;
  /** Optional clip volume applied to all tiles in the view. */
  public readonly viewClip?: ClipVector;
  /** @internal */
  public parentsAndChildrenExclusive: boolean;
  /** Tiles that we want to draw and that are ready to draw. May not actually be selected, e.g. if sibling tiles are not yet ready. */
  public readonly readyTiles = new Set<Tile>();
  /** For perspective views, the view-Z of the near plane. */
  private readonly _nearViewZ?: number;

  /** Compute the size of this tile on screen in pixels. */
  public getPixelSize(tile: Tile): number {
    const radius = this.getTileRadius(tile); // use a sphere to test pixel size. We don't know the orientation of the image within the bounding box.
    const center = this.getTileCenter(tile);

    if (this.context.viewport.view.isCameraEnabled()) {
      // Find point on tile bounding sphere closest to eye.
      const toEye = center.unitVectorTo(this.context.viewport.view.camera.eye);
      if (toEye) {
        toEye.scaleInPlace(radius);
        center.addInPlace(toEye);
      }
    }

    const viewPt = this.worldToViewMap.transform0.multiplyPoint3dQuietNormalize(center);
    if (undefined !== this._nearViewZ && viewPt.z > this._nearViewZ) {
      // Limit closest point on tile bounding sphere to the near plane.
      viewPt.z = this._nearViewZ;
    }

    const viewPt2 = new Point3d(viewPt.x + 1.0, viewPt.y, viewPt.z);
    const pixelSizeAtPt = this.worldToViewMap.transform1.multiplyPoint3dQuietNormalize(viewPt).distance(this.worldToViewMap.transform1.multiplyPoint3dQuietNormalize(viewPt2));
    return 0 !== pixelSizeAtPt ? radius / pixelSizeAtPt : 1.0e-3;
  }

  /** Compute this size of a sphere on screen in pixels */
  public getRangePixelSize(range: Range3d): number {
    const transformedRange = this.location.multiplyRange(range, scratchRange);
    const center = transformedRange.localXYZToWorld(.5, .5, .5, scratchPoint)!;
    const radius = transformedRange.diagonal().magnitude();

    const viewPt = this.worldToViewMap.transform0.multiplyPoint3dQuietNormalize(center);
    const viewPt2 = new Point3d(viewPt.x + 1.0, viewPt.y, viewPt.z);
    const pixelSizeAtPt = this.worldToViewMap.transform1.multiplyPoint3dQuietNormalize(viewPt).distance(this.worldToViewMap.transform1.multiplyPoint3dQuietNormalize(viewPt2));
    return 0 !== pixelSizeAtPt ? radius / pixelSizeAtPt : 1.0e-3;
  }

  /** @internal */
  public getTileGraphics(tile: Tile) {
    return tile.produceGraphics();
  }

  /** The planes of the viewing frustum, used for frustum culling. */
  public get frustumPlanes(): FrustumPlanes {
    return this._frustumPlanes !== undefined ? this._frustumPlanes : this.context.frustumPlanes;
  }

  /** @internal */
  public get worldToViewMap(): Map4d {
    return this.viewingSpace.worldToViewMap;
  }

  /** @internal */
  public static fromTileTree(context: SceneContext, location: Transform, tree: TileTree, viewFlagOverrides: ViewFlagOverrides, clip?: RenderClipVolume, parentsAndChildrenExclusive = false, symbologyOverrides?: FeatureSymbology.Overrides) {
    const now = BeTimePoint.now();
    return new TileDrawArgs(context, location, tree, now, viewFlagOverrides, clip, parentsAndChildrenExclusive, symbologyOverrides);
  }

  /** Constructor */
  public constructor(context: SceneContext, location: Transform, tree: TileTree, now: BeTimePoint, viewFlagOverrides: ViewFlagOverrides, clip?: RenderClipVolume, parentsAndChildrenExclusive = true, symbologyOverrides?: FeatureSymbology.Overrides) {
    this.location = location;
    this.tree = tree;
    this.context = context;
    this.now = now;

    if (undefined !== clip && !clip.hasOutsideClipColor)
      this.clipVolume = clip;

    this.graphics.setViewFlagOverrides(viewFlagOverrides);
    this.graphics.symbologyOverrides = symbologyOverrides;
    this.graphics.animationId = tree.modelId;

    this.viewingSpace = context.viewingSpace;
    this._frustumPlanes = new FrustumPlanes(this.viewingSpace.getFrustum());

    this.planarClassifier = context.getPlanarClassifierForModel(tree.modelId);
    this.drape = context.getTextureDrapeForModel(tree.modelId);

    // NB: If the tile tree has its own clip, do not also apply the view's clip.
    if (context.viewFlags.clipVolume && false !== viewFlagOverrides.clipVolumeOverride && undefined === clip)
      this.viewClip = undefined === context.viewport.outsideClipColor ? context.viewport.view.getViewClip() : undefined;

    this.parentsAndChildrenExclusive = parentsAndChildrenExclusive;
    if (context.viewport.view.isCameraEnabled())
      this._nearViewZ = context.viewport.getFrustum(CoordSystem.View).frontCenter.z;
  }

  /** A multiplier applied to a [[Tile]]'s `maximumSize` property to adjust level of detail.
   * @see [[Viewport.tileSizeModifier]].
   * @alpha
   */
  public get tileSizeModifier(): number { return this.context.viewport.tileSizeModifier; }

  /** @internal */
  public getTileCenter(tile: Tile): Point3d { return this.location.multiplyPoint3d(tile.center); }

  /** @internal */
  public getTileRadius(tile: Tile): number {
    let range: Range3d = tile.range.clone(scratchRange);
    if (tile.tree.is2d) {
      // 2d tiles have a fixed Z range of [-1, 1]. Sometimes (e.g., hypermodeling) we draw them within a 3d view. Prevent Z from artificially expanding the radius.
      range.low.z = range.high.z = 0;
    }

    range = this.location.multiplyRange(range, range);
    return 0.5 * range.low.distance(range.high);
  }

  /** @internal */
  public get clip(): ClipVector | undefined {
    return undefined !== this.clipVolume ? this.clipVolume.clipVector : undefined;
  }

  /** @internal */
  public produceGraphics(): RenderGraphic | undefined {
    return this._produceGraphicBranch(this.graphics);
  }

  /** @internal */
  private _produceGraphicBranch(graphics: GraphicBranch): RenderGraphic | undefined {
    if (graphics.isEmpty)
      return undefined;

    const classifierOrDrape = undefined !== this.planarClassifier ? this.planarClassifier : this.drape;
    const opts = { iModel: this.tree.iModel, clipVolume: this.clipVolume, classifierOrDrape };
    return this.context.createGraphicBranch(graphics, this.location, opts);
  }

  /** @internal */
  public drawGraphics(): void {
    const graphics = this.produceGraphics();
    if (undefined !== graphics)
      this.context.outputGraphic(graphics);
  }

  /** @internal */
  public drawGraphicsWithType(graphicType: TileGraphicType, graphics: GraphicBranch): void {
    const branch = this._produceGraphicBranch(graphics);
    if (undefined !== branch)
      this.context.withGraphicType(graphicType, () => this.context.outputGraphic(branch));
  }

  /** Indicate that graphics for the specified tile are desired but not yet available. Subsequently a request will be enqueued to load the tile's graphics. */
  public insertMissing(tile: Tile): void {
    this.context.insertMissingTile(tile);
  }

  /** @internal */
  public markChildrenLoading(): void {
    this.context.markChildrenLoading();
  }

  /** Indicate that the specified tile is being used for some purpose by the [[SceneContext]]'s [[Viewport]]. Typically "used" means "displayed", but the exact meaning is up to the [[TileTree]] - for example, "used" might also mean that the tile's children are being used. A tile that is "in use" by any [[Viewport]] will not be discarded. */
  public markUsed(tile: Tile): void {
    tile.usageMarker.mark(this.context.viewport, this.now);
  }

  /** Indicate that the specified tile should be displayed and that its graphics are ready to be displayed. The number of "ready" tiles is used in conjunction with the number of "missing" tiles to convey to the user how complete the current view is.
   * @see [[insertMissing]]
   */
  public markReady(tile: Tile): void {
    this.readyTiles.add(tile);
  }
}
