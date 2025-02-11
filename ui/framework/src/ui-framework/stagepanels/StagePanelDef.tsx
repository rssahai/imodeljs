/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Frontstage
 */

import { StagePanelLocation } from "@bentley/ui-abstract";
import { UiEvent } from "@bentley/ui-core";
import { FrontstageManager } from "../frontstage/FrontstageManager";
import { WidgetDef } from "../widgets/WidgetDef";
import { WidgetHost } from "../widgets/WidgetHost";
import { StagePanelProps, StagePanelZoneProps, StagePanelZonesProps } from "./StagePanel";
import { getStableWidgetProps } from "../zones/Zone";

/** Enum for StagePanel state.
 * @beta
 */
export enum StagePanelState {
  Off,
  Minimized,
  Open,
  Popup,
}

/** Panel State Changed Event Args interface.
 * @beta
 */
export interface PanelStateChangedEventArgs {
  panelDef: StagePanelDef;
  panelState: StagePanelState;
}

/** Widget State Changed Event class.
 * @beta
 */
export class PanelStateChangedEvent extends UiEvent<PanelStateChangedEventArgs> { }

/** @internal */
export interface PanelSizeChangedEventArgs {
  panelDef: StagePanelDef;
  size: number | undefined;
}

/** @internal */
export class PanelSizeChangedEvent extends UiEvent<PanelSizeChangedEventArgs> { }

/**
 * A StagePanelDef represents each Stage Panel within a Frontstage.
 * @beta
 */
export class StagePanelDef extends WidgetHost {
  private _panelState = StagePanelState.Open;
  private _size: number | undefined = undefined;
  private _resizable: boolean = false;
  private _applicationData?: any;
  private _location: StagePanelLocation = StagePanelLocation.Left;
  private _panelZones: StagePanelZonesDef | undefined;

  /** Constructor for PanelDef.
   */
  constructor() {
    super();
  }

  /** Default size of the panel */
  public get size(): number | undefined { return this._size; }

  public set size(size: number | undefined) {
    // istanbul ignore if
    if (this._size === size)
      return;
    this._size = size;
    FrontstageManager.onPanelSizeChangedEvent.emit({
      panelDef: this,
      size,
    });
  }
  /** Indicates whether the panel is resizable. */
  // istanbul ignore next
  public get resizable(): boolean { return this._resizable; }
  /** Any application data to attach to this Panel. */
  public get applicationData(): any | undefined { return this._applicationData; }
  /** Location of panel. */
  public get location(): StagePanelLocation { return this._location; }

  /** Panel state.  Defaults to PanelState.Open. */
  public get panelState() {
    return this._panelState;
  }

  public set panelState(panelState: StagePanelState) {
    if (panelState === this._panelState)
      return;
    this._panelState = panelState;
    FrontstageManager.onPanelStateChangedEvent.emit({
      panelDef: this,
      panelState,
    });
  }

  /** Panel zones.
   * @internal
   */
  public get panelZones() {
    return this._panelZones;
  }

  /** @internal */
  public initializePanelState(panelState: StagePanelState) {
    this._panelState = panelState;
  }

  /** @internal */
  public initializeFromProps(props: StagePanelProps, panelLocation?: StagePanelLocation): void {
    this._size = props.size;
    if (panelLocation !== undefined)
      this._location = panelLocation;
    if (props.defaultState !== undefined)
      this.initializePanelState(props.defaultState);
    this._resizable = props.resizable;
    if (props.applicationData !== undefined)
      this._applicationData = props.applicationData;
    if (props.panelZones) {
      this._panelZones = new StagePanelZonesDef();
      this._panelZones.initializeFromProps(props.panelZones, this._location);
    }

    if (props.widgets) {
      props.widgets.forEach((widgetNode, index) => {
        const stableId = `uifw-sp-${StagePanelLocation[this._location]}-${index}`;
        const stableProps = getStableWidgetProps(widgetNode.props, stableId);
        const widgetDef = new WidgetDef(stableProps);
        this.addWidgetDef(widgetDef);
      });
    }
  }

  /** Finds a [[WidgetDef]] based on a given id */
  public findWidgetDef(id: string): WidgetDef | undefined {
    // istanbul ignore if
    if (this.panelZones) {
      for (const [, panelZone] of this.panelZones) {
        const widgetDef = panelZone.findWidgetDef(id);
        if (widgetDef)
          return widgetDef;
      }
    }

    return super.findWidgetDef(id);
  }
}

/** @internal */
export type StagePanelZoneDefKeys = keyof Pick<StagePanelZonesDef, "start" | "middle" | "end">;

const stagePanelZoneDefKeys: StagePanelZoneDefKeys[] = ["start", "middle", "end"];

/** @internal */
export class StagePanelZonesDef {
  private _start: StagePanelZoneDef | undefined;
  private _middle: StagePanelZoneDef | undefined;
  private _end: StagePanelZoneDef | undefined;

  public get start() {
    return this._start;
  }

  public get middle() {
    return this._middle;
  }

  public get end() {
    return this._end;
  }

  /** @internal */
  public initializeFromProps(props: StagePanelZonesProps, panelLocation: StagePanelLocation): void {
    if (props.start) {
      this._start = new StagePanelZoneDef();
      this._start.initializeFromProps(props.start, panelLocation, "start");
    }
    if (props.middle) {
      this._middle = new StagePanelZoneDef();
      this._middle.initializeFromProps(props.middle, panelLocation, "middle");
    }
    if (props.end) {
      this._end = new StagePanelZoneDef();
      this._end.initializeFromProps(props.end, panelLocation, "end");
    }
  }

  /** @internal */
  public [Symbol.iterator](): Iterator<[StagePanelZoneDefKeys, StagePanelZoneDef]> {
    return definedStagePaneZoneDefs(this);
  }
}

function* definedStagePaneZoneDefs(stagePanelZonesDef: StagePanelZonesDef): Generator<[StagePanelZoneDefKeys, StagePanelZoneDef]> {
  for (const key of stagePanelZoneDefKeys) {
    const value = stagePanelZonesDef[key];
    if (value) {
      yield [key, value];
    }
  }
  return undefined;
}

/** @internal */
export class StagePanelZoneDef extends WidgetHost {
  /** @internal */
  public initializeFromProps(props: StagePanelZoneProps, panelLocation: StagePanelLocation, panelZone: StagePanelZoneDefKeys): void {
    props.widgets.forEach((widgetNode, index) => {
      const stableId = `uifw-spz-${StagePanelLocation[panelLocation]}-${panelZone}-${index}`;
      const stableProps = getStableWidgetProps(widgetNode.props, stableId);
      const widgetDef = new WidgetDef(stableProps);
      this.addWidgetDef(widgetDef);
    });
  }
}
