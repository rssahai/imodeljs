# Change Log - @bentley/geometry-core

This log was last generated on Fri, 19 Jun 2020 14:10:03 GMT and should not be manually modified.

## 2.2.0
Fri, 19 Jun 2020 14:10:03 GMT

### Updates

- ClipUtilities.createXYOffsetClipFromLineString
- Bug in region booleans: Loops within parity region were not being simplified by ConsidateAdjacentPrimitives.

## 2.1.0
Thu, 28 May 2020 22:48:59 GMT

### Updates

- Fixed ClipVector.performTransformTo/FromClip() failing to transform the input.
- (1) In xy region booleans, support curved edges; (2) ExportGraphicsMeshVisitor class
- (alpha) boolean operations among regions with curved boundaries.
- Correct IModelJson.Reader error which lost normals.
- In region booleans, create bridge edges to link islands to surroundings.
- New methods for chaining curves.   First use of KaTeX in docs
- Fix PolyfaceData.compress to handle normals and params

## 2.0.0
Wed, 06 May 2020 13:17:49 GMT

### Updates

- freeze methods return Readonly<this>
- Show min/max window error for mouse wheel zoom.
- Show min/max window error for mouse wheel zoom.
- Methods to create mitered pipe sequences; improve chainCollector sort for full-chain reorder.
- handle simple wraparound in consolidateAdjacentPrimitives (for sandy Bugai)
- Fix z bug in Arc3d cloneAtZ()
- CurveFactory and RegionOps support for pipe construction and finding loops in unstructured curve sets
- BUG 273249
- PolyfaceClip for plane, convex, union clippers.  Prevent small fragment construction in curve clip.
- docs for PolyfaceClip.clipPolyfaceInsideOutside
- modernize cubic root finder
- geometry coverage.   Logic bugs in ChainCollectorContext.needBreakBetweenPrimitives
- ChainCollector support for DesignReview; Bspline through points for futureOnBridge
- In earcut triangulation, test for bowtie point.
- v2.0 API cleanup -- Ellipsoid use LongitudeLatitudeNumber instead of Point2d for angle return
- imjs importer; move curve context classes to separate files
- Remove deprecated APIs; see NextVersion.md for details.
- Upgrade to Rush 5.23.2
- Remove support for the iModel.js module system by no longer delivering modules.

## 1.14.1
Wed, 22 Apr 2020 19:04:00 GMT

*Version update only*

## 1.14.0
Tue, 31 Mar 2020 15:44:19 GMT

*Version update only*

## 1.13.0
Wed, 04 Mar 2020 16:16:31 GMT

### Updates

- Polyface clip to union of convex sets

## 1.12.0
Wed, 12 Feb 2020 17:45:50 GMT

### Updates

- Implement generic boolean tree of `Clipper` objects (for Feature 269514)
- Arc3d precise range; BSpline1dNd interval recursion bug; BooleanClip unit tests
- MomentData quantity sign controls principal direction orientation.
- BooleanClipFactory enhancements
- New method ellipsoide.silhouette (eyePoint: Point4d):Arc3d
- Correct extended geometry handling in LineString3d.closestPoint
- (a) Control Triangulation of area booleans, (b) methods to find and purge duplicate facets
- Improve error handling for triangulation and merge of bad input"
- iModel write API development

## 1.11.0
Wed, 22 Jan 2020 19:24:12 GMT

### Updates

- Detect "end to end" connection of colinear line segments during curve-curve intersection methods.
- RegionOps planar subdivision support.
- #1.11.0-dev.5_4384: XY linework and Region cleanup methods
- Upgrade to TypeScript 3.7.2.

## 1.10.0
Tue, 07 Jan 2020 19:44:01 GMT

### Updates

- `CurveCurve.intersectionPairsXY` returns details of line-line and arc-arc coincident geometry
- Add method for mesh orientation fixup.
- Path-on-Ellipsoid support
- New method RegionOps.sortOuterAndHoleLoopsXY
- BUG: Fix inverseState management in MatrixMatrix multliplies with preallocated result and/or aliasing
- Added Matrix4d.isExactEqual()

## 1.9.0
Tue, 10 Dec 2019 18:08:56 GMT

### Updates

- EllipsoidPatch support:  patch.projectPointToSurface, ellipsoid.constantLatitudeArc, ellipsoid.constantLongitudeArc
- Great Circle extraction on Ellipsoid
- Correct bug in z part of Vector3d spherical construction.  New method to split mesh by eyevector
- linearSystem3d z term
- Code cleanup from codeQL hits
- Ellipsoid and EllipsoidPatch classes with range and intersectRay support

## 1.8.0
Fri, 22 Nov 2019 14:03:34 GMT

### Updates

- PolyfaceQuery services: PolyfaceQuery.markAllEdgeVisibility PolyfaceQuery.markPairedEdgesInvisible PolyfaceQuery.setSingleEdgeVisibility PolyfaceQuery.computeFacetUnitNormal 
- Correct sectioning of meshes with (a) nonconvex facets and (b) multicomponent plane intersections
- Intersect Ray with Sphere
- Spherical patch range; optional result in range3d.corners()
- Refactor analysis of range of a+b sin(theta) + c sin(theta)
- Added missing topic descriptions
- Added earthRadiusWGS84 constants

## 1.7.0
Fri, 01 Nov 2019 13:28:37 GMT

### Updates

- Fix bugs in PolygonOffsetContext
- Mesh support: TVertexFixup and ColinearEdgeFixup
- Lightweight iterator over Point3ds contained in an IndexedXYZCollection; Transform.multiplyRange() returns a null range if input is a null range.

## 1.6.0
Wed, 09 Oct 2019 20:28:42 GMT

### Updates

- Triangulate between linestrings; consolidateAdjacentPrimitives; Test if points are a rectangle
- General matrix4d inverse

## 1.5.0
Mon, 30 Sep 2019 22:28:48 GMT

### Updates

- Eliminate use of Math.hypot
- Polyface mesh "split to components"
- Fast range filtering for cutFill (and other) searches
- Incremental Edge Flipping, optimize Delauney circle test
- Explicit undefined initialization for HalfEdge
- Upgrade to TypeScript 3.6.2

## 1.4.0
Tue, 10 Sep 2019 12:09:49 GMT

### Updates

- Region "in/on/out" tests
- Triangulation of isolated point array
- RegionOps methods to split curve sets
- PolyfaceClip.computeCutFill method
- New method ray3d.intersectionWithRange3d
- Added AnyGeometryQuery and AnySolidPrimitive union types; added type discriminator fields to GeometryQuery, SolidPrimitive, CurvePrimitive, and CurveCollection; tightened `any` return types for IModelJson.Reader methods.

## 1.3.0
Tue, 13 Aug 2019 20:25:53 GMT

### Updates

- WireMoment computation; polyline filters for short edge, small triangle, perpendicular projection
- Triangulate cut faces in polyface clip.  Variant point data parse.  Bilinear Patch ray intersection"
- Construct offset from path with curves.
- Mesh principal axis computation.
- Document unit length rows/cols requirement of Matrix3d.toQuaternion
- Correct point4d normalization to handle small w values (NPC)
- Improved grid display performance.

## 1.2.0
Wed, 24 Jul 2019 11:47:26 GMT

### Updates

- When compressing linestrings, detect first/last segment colinear case.
- Consistent stroke counts on BezierCurve3d, BezierCurve3dH
- Full 3d intersection CurveCurve.intersectionXYZ (no bsplines)
- New method for polyline wire offset.
- WIP (1) improve duplicated edge handling in polygon booleans (2) improve variant point array handling
- Polyline simplification by Puecker-Douglas (chord distance)

## 1.1.0
Mon, 01 Jul 2019 19:04:29 GMT

### Updates

- Export bilinear patch (used by bing elevation)
- Removed missing group descriptions
- Add "extend" support to various CurvePrimitive.closestPoint methods.
- Add PolyfaceQuery methods to drape linestring to facets
- Priority queue sweep logic in HalfEdgeGraph
- PolarData class for x-y-r-theta constraint solve.   CurvePathWithDistanceIndex expose path with getter.
- Region centroid and polygon boolean methods
- TransitionSpiral bug fixes in transform, use of active interval
- Prevent triangle flip hang
- Bspline Curve chord tolerance
- Add quick-exit completion tests in earcut triangulation
- Update to TypeScript 3.5

## 1.0.0
Mon, 03 Jun 2019 18:09:39 GMT

### Updates

- PolyfaceQuery::sweepLinestringToFacetsXYreturnSweptFacets
- Correct (undocumented) methods
- PolyfaceClip class with plane, convex set clips.
- point/vector coverage
- Detect high-multiplicity knots when saturating a bspline. Skip those intervals in stroking.

## 0.191.0
Mon, 13 May 2019 15:52:05 GMT

### Updates

- Adds parameter for api-extractor to validate missing release tags
- Fix for PolygonOps.centroidAreaNormal.
- View clip fixes and start of tools.
- Range1dArray coverage
- Coverage; enable public/internal verification.
- Add doc to many methods.  Modernize ray intersect clip plane logic and methods.
- closestApproachRay3dRay3d.  centroid bugs
- ClipPlane enhancements;  method to compute clip faces for convex set intersection with range
- ClipPrimitive modernization
- Debug json clip plane usage
- add docs for methods in Arc3d, CurvePrimitive, Newton
- Add comments to (undocumented) methods
- LineString3d code coverage
- public and internal doc markup
- @public markup
- In FrustumAnimation, detect true center of rotationn
- Reduce memory allocations in clipping.
- Method docs, ConvexClipPlaneSetIntersectRange enhancements
- new method to check of clipper intersects range, with quick exit
- ClipVector and ClipUtilities test and enhancements
- Triangulation bug (multiple holes not linked correctly)
- Fix broken links
- Put sourcemap in npm package.
- Setup a generic context for tracking client requests, and made various related enhancements to logging, usage tracking and authorization. 
- New code for regularizing a single face.
- Upgrade TypeDoc dependency to 0.14.2

## 0.190.0
Thu, 14 Mar 2019 14:26:49 GMT

### Updates

- Rename/Refactor triangulation

## 0.189.0
Wed, 06 Mar 2019 15:41:22 GMT

### Updates

- geometry-core camel case
- Allow subclasses of Range to use static methods
- Changes package.json to include api-extractor and adds api-extractor.json
- Use new buildIModelJsBuild script
- AxisAlignedBox and ElementAlignedBox are now typed to Range3d rather than classes
- clone methods are no longer generic
- Remove unneeded typedoc plugin dependency
- PolyfaceBuilder solid primitive improvements
- PolyfaceBuilder improvements.  Construct normals for sweeps.  Mesh pairing closure test.
- PolyfaceBuilder creates params and normals for all Solid types
- Mesh Normal bugs, some @internal markup
- Consistent naming of "get" methods in Growable arrays.
- Distribute .test.ts files to subdirectories
- Improve polygon triangulations quality by early flipping behind the earcut front
- Added freeze methods to Angle and Point2d
- Bug fixes in PolyfaceBuilder
- Update for geometry GrowableXYArray usage
- New class SmoothTransformBetweenFrusta for smooth frustum animation
- Save BUILD_SEMVER to globally accessible map
- add optional argument to SmoothTransformBetweenFrusta
- Upgrade to TypeScript 3.2.2

## 0.188.0
Wed, 16 Jan 2019 16:36:09 GMT

*Version update only*

## 0.187.0
Tue, 15 Jan 2019 15:18:59 GMT

*Version update only*

## 0.186.0
Mon, 14 Jan 2019 23:09:10 GMT

*Version update only*

## 0.185.0
Fri, 11 Jan 2019 18:29:00 GMT

*Version update only*

## 0.184.0
Thu, 10 Jan 2019 22:46:17 GMT

### Updates

- Code coverage.  sphere and torus derivative errors. solids reject singular transforms.
- Add to quaternion tests

## 0.183.0
Mon, 07 Jan 2019 21:49:21 GMT

*Version update only*

## 0.182.0
Mon, 07 Jan 2019 13:31:34 GMT

*Version update only*

## 0.181.0
Fri, 04 Jan 2019 13:02:40 GMT

### Updates

- Suppress geometry test console output (except performance)

## 0.180.0
Wed, 02 Jan 2019 15:18:23 GMT

### Updates

- Special case logic for opening bspline arcs (which are pre-saturated in bezier form)
- Add quaternion methods
- Add quaternion tests - fix transpose

## 0.179.0
Wed, 19 Dec 2018 18:26:14 GMT

*Version update only*

## 0.178.0
Thu, 13 Dec 2018 22:06:10 GMT

*Version update only*

## 0.177.0
Wed, 12 Dec 2018 17:21:31 GMT

*Version update only*

## 0.176.0
Mon, 10 Dec 2018 21:19:45 GMT

*Version update only*

## 0.175.0
Mon, 10 Dec 2018 17:08:55 GMT

*Version update only*

## 0.174.0
Mon, 10 Dec 2018 13:24:09 GMT

*Version update only*

## 0.173.0
Thu, 06 Dec 2018 22:03:29 GMT

### Updates

- Custom imodelJs noDirectImport lint rule implemented, noDuplicateImport lint rule turned on.

## 0.172.0
Tue, 04 Dec 2018 17:24:39 GMT

*Version update only*

## 0.171.0
Mon, 03 Dec 2018 18:52:58 GMT

*Version update only*

## 0.170.0
Mon, 26 Nov 2018 19:38:42 GMT

*Version update only*

## 0.169.0
Tue, 20 Nov 2018 16:17:15 GMT

*Version update only*

## 0.168.0
Sat, 17 Nov 2018 14:20:11 GMT

*Version update only*

## 0.167.0
Fri, 16 Nov 2018 21:45:44 GMT

*Version update only*

## 0.166.0
Mon, 12 Nov 2018 16:42:10 GMT

*Version update only*

## 0.165.0
Mon, 12 Nov 2018 15:47:00 GMT

### Updates

- bspline docs.  Add bezier curve left and right subdivision methods"
- Correct return value (undefined is right!) for LineString3d.pointAt (index)

## 0.164.0
Thu, 08 Nov 2018 17:59:20 GMT

### Updates

- Complete analysis import test application
- Add support for PolyfaceAuxData to PolyfaceVisitor
- Implement curve method "moveSignedDistanceFromFraction"
- polyface.compress performance problem -- extraneous reallocations
- CurveChainWithDistanceIndex derivative and distance methods
- PolyfaceAuxData documentation
- Updated to TypeScript 3.1

## 0.163.0
Wed, 31 Oct 2018 20:55:37 GMT

### Updates

- CurveChainWithDistanceIndex WIP
- fromJSON tests.  Geometry.isAlmostEqualNumber uses smallAngleRadians as absolute minimum tolerance.
- Add tests for fromJSON methods (small classes)
- Expand test coverage.  Use small absolute tolerance in Geometry.isAlmostEqualNumber.  "w" component of BezierCurve3d.getPolePoint4d.

## 0.162.0
Wed, 24 Oct 2018 19:20:06 GMT

### Updates

- Merge
- fromJSON tests.  Geometry.isAlmostEqualNumber uses smallAngleRadians as absolute minimum tolerance.
- Rename PNG files as png

## 0.161.0
Fri, 19 Oct 2018 13:04:14 GMT

*Version update only*

## 0.160.0
Wed, 17 Oct 2018 18:18:38 GMT

*Version update only*

## 0.159.0
Tue, 16 Oct 2018 14:09:09 GMT

*Version update only*

## 0.158.0
Mon, 15 Oct 2018 19:36:09 GMT

*Version update only*

## 0.157.0
Sun, 14 Oct 2018 17:20:06 GMT

*Version update only*

## 0.156.0
Fri, 12 Oct 2018 23:00:10 GMT

### Updates

- Initial release

