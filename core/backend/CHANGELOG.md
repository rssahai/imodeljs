# Change Log - @bentley/imodeljs-backend

This log was last generated on Fri, 19 Jun 2020 14:10:03 GMT and should not be manually modified.

## 2.2.0
Fri, 19 Jun 2020 14:10:03 GMT

### Updates

- Update to imodeljs-native 2.2.4
- Move analytical domain classes out to new package.
- close file on error in StandaloneDb.openFile
- Add DefinitionContainer, DefinitionSet
- Add missing properties to UrlLink and RepositoryLink
- Bump tile version
- Add IModelExporter.wantGeometry to optimize cases where geometry is not required
- Move linear referencing domain types out to new @bentley/linear-referencing-backend package.
- Added test for null string access via ECSqlStatement
- Add PhysicalElement.physicalMaterial
- Add PhysicalMaterial
- Add PhysicalMaterial.createCode, PhysicalMaterial.create
- Remove IOS Azure downloader
- reactivate native ULAS tests
- Update to BisCore.01.00.11: Add new SectionDrawing properties, deprecate SectionLocation in favor of SectionDrawingLocation.
- Switching from JSC to V8

## 2.1.0
Thu, 28 May 2020 22:48:59 GMT

### Updates

- Add a new BackendLoggerCategory for usage logging, 'BackendLoggerCategory.UsageLogging'.
- Update to imodeljs-native 2.1.0
- Support for finding an ExternalSourceAspect given scope, id, and kind/hash.
- ApplyChangeset perf tests updated
- Fixed token expiry check for desktop authorization. 
- Download ChangeSets in chunks
- (1) In xy region booleans, support curved edges; (2) ExportGraphicsMeshVisitor class
- Add ability to convert ExportGraphicsMesh to Polyface
- Fixed validation of Guids (ContextId, IModelId) cached within a briefcase.
- Moved iModelBridgeFwk to a separate package
- Simplified logging for monitoring briefcase operations. 
- Fix transforms for creating and querying part instance geometry in world coordinate.
- Fix and improvement to performance tests
- Added support for schema XML import to iModelJs backend via the IModelDb.importSchemaStrings method.
- channel rules
- Fixed logging usage when opening connections. 

## 2.0.0
Wed, 06 May 2020 13:17:49 GMT

### Updates

- Fixed setup of UserInfo from browser clients, and more cleanups to AccessToken API. 
- Added RivisionUtility class for debug/testing
- node addon 2.0.18
- addon 2.0.25
- Update to addon 2.0.5
- imodeljs-addon 2.0.6
- New IModelJS Node Addon 2.0.8
- Update to imodeljs-native 2.0.24
- Accusnap: improve performance and accuracy.
- BriefcaseIModelDb.pushChanges now requires a description
- Performance tests for Applying Changesets
- `IModelHost.startup` is now async.
- `IModelHost.shutdown` is now async.
- Refined checks for briefcase id, and fixed failing integration tests. 
- Product Backlog Item 276268: Deleting the briefcase cache if the cache version is incorrect should not attempt to delete the root directory.
- Setup initialization of briefcase cache for offline workflows. (VSTS#286489)
- Monitor progress of downloading briefcases, ability to cancel download of briefcases. 
- Move briefcase-specific events into BriefcaseIModelDb subclass
- Fixed param when calling logger so that it is a function as the logger expects
- Setup a common cache locaton for iModel.js, with briefcases taking up a sub-folder. 
- Changed ChangeSets download API
- Added unlink for file handler
- Update UlasClient tests to send more detailed feature log data
- react to renaming of imodeljs-clients-backend to backend-itwin-client
- apply changeset performance tests with local datasets
- BriefcaseManager.delete should work in offline scenarios. 
- Remove deprecated members of SectionLocation and downgrade to alpha pending refactor.
- Support for progress/cancel from ios
- Remove deprecated ExportGraphics types etc for 2.0
- Updated docs. 
- IModelDb.findByKey replaces IModelDb.find
- Include model extents with ViewStateProps for drawing views.
- Remove deprecated APIs; see NextVersion.md for details.
- Entity.forEachProperty has moved from beta to public. Please note that the default value of includeCustom has changed to better match typical use.
- Removed/moved some properties from AuthorizationClient interf
- Add IModelDb.Elements.getAspect method
- txn.hasPendingTxns returns false if all local changes have been undone
- Adding a new method setFirstSchemaLocater to ECSchemaXMLContext to allow control over the first locater used to locate schemas.
- IModelDb.containsClass now supports schema aliases
- react to changes in imodeljs-clients
- Promote properties from IModelToken onto IModelDb
- IModelTransformer now processes RepositoryLinks
- Update minimum Node version to 10.16.0
- test
-  Logging fixes, separated open/download of briefcases a little more.
- Fix issue when initialize briefcase cache from disk and cache folder does not exist
- openBriefcase RPC method now find the cached briefcase before opening it.
- Introduce the BriefcaseIModelDb class, make IModelDb abstract.
- Cleaned up unused async-s in BriefcaseManager
- Avoided casting of BriefcaseProps to IModelRpcProps.
- Added NativeApp.deleteBriefcase, avoided authorization exceptions when offline. 
- Move briefcase property from IModelDb --> BriefcaseIModelDb
- BriefcaseId is now an enum instead of a class
- Rename BriefcaseId --> ReservedBriefcaseId, introduce BriefcaseId type
- VSTS#297017: Update cached briefcase information if changes were applied. 
- Refactored NativeApp API and RPC interfaces. This continues to be WIP. 
- Removed the call to simultaneously download and open the briefcase at the backend. This should be done in two separate steps henceforth. The download must be done with BriefcaseManager, and the open is now a synchronous call in BriefcaseDb. 
- Added DownloadBriefcaseOptions and OpenBriefcaseOptions as parameters to the download/open calls for a briefcase. 
- Removed BriefcaseDb.create
- Setup ability to use NativeApp.openBriefcase() in offline scenarios. 
- fixed flaky test
- VSTS#217447, 162382: Cleanups to implementation of downloading/opening/discovering briefcases in native applications (WIP). 
- do not throw exception in NativeAppBackend.startup()
- VSTS#296110: Setup a way to close briefcases when the native application is offline. 
- Move concurrencyControl from IModelDb to BriefcaseIModelDb
- Renamed OIDC constructs for consistency; Removed SAML support.
- Add support for password-protecting snapshot iModels
- Fixed typo for ElementAspect perf tests
- VSTS#217447, VSTS#162382: Reinstated option to open briefcases with SyncMode = PullOnly. 
- Add purge dir method to iModelJsFs
- react to creation of new clients packages from imodeljs-clients
- ; substitute current date for feature usage without any set start/end dates
- Removed deprecated utilities. 
- enforce opening Snapshots readonly through StandaloneDb
- Remove the deprecated Entity.clone method
- Adjusted calls to some node addon changes (ECUtils removed)
- Upgrade to Rush 5.23.2
- support for editing
- The API for snapshot iModels is now public.
- When creating a snapshot iModel, there is now an option to create class views for interoperability.
- Add IModelHost.snapshotFileNameResolver
- Add FileNameResolver class
- Move snapshot methods out of IModelDb and into new SnapshotIModelDb class.
- Add TemplateModelCloner to place instances of a template model
- Renamed TestOidcClient and related constructs for consistency. 
- Add IModelDb.tryPrepareStatement
- Fixed usage logging. 
- fix failing ulas tests due to invalid featureId
- update ULAS test logging & feedback
- Update UlasUtilities to support exception-throwing native functions
- Use standalone briefcases for PullOnly cases. 

## 1.14.1
Wed, 22 Apr 2020 19:04:00 GMT

### Updates

- Documentation

## 1.14.0
Tue, 31 Mar 2020 15:44:19 GMT

### Updates

- Update to addon 1.14.1
- Fixed downloading of files using https/streaming to resolve when the filestream is closed instead of when the input stream is exhausted. 
- Add handling for invalid predecessor ids to IModelTransformer
- Accomodate updated imodeljs-native ULAS functions

## 1.13.0
Wed, 04 Mar 2020 16:16:31 GMT

*Version update only*

## 1.12.0
Wed, 12 Feb 2020 17:45:50 GMT

### Updates

- Fix IGeometry roundtripping issue through ECSql.  Fix insert/update binary properties for Element Aspect.
- Separated out routines to download and open briefcases. 
- bulk mode
- Consolidated sign-in for integration tests
- bulkmode
- iModel write API development
- Prevent reuse of cached tiles after project extents change.
- A new optional dependency, ecschema-metadata, allows for retrieval of full Schema information from an iModel using the new IModelSchemaLoader utility class.
- Added parameters for ruleset directory and temp cache location for version compare processing
- Add ViewDefinition.getAuxiliaryCoordinateSystemId and ViewDefinition.setAuxiliaryCoordinateSystemId methods
- Add SpatialLocationModel.insert
- Add optional isPlantProjection parameter to PhysicalModel.insert
- VSTS#256133: Fixed issue with reopening connections if the backend crashes. Fixes to integration tests. 
- Better documentation of OidcDesktopClient
- Fixed changeset perf test by using another iModel on Hub
- Add ViewDetails to ViewDefinition.
- Add support for plan projection models with 3d display priority.
- UlasUtilities exported as an module.

## 1.11.0
Wed, 22 Jan 2020 19:24:12 GMT

### Updates

- Native apps can now cancel tile requests in progress on the backend.
- Remove echo test function from devTools
- Allow outline fill to be specified by subcategory appearance.
- Upgrade to TypeScript 3.7.2.
- Added TypeScript wrapper over the native SaaSClient.

## 1.10.0
Tue, 07 Jan 2020 19:44:01 GMT

### Updates

- Typescript code for the classes in the Analytical schema.
- Return error message from concurrent query manager
- Added support for embedding images in a GeometryStream.
- IModelExporter, IModelTransformer, and IModelImporter are now beta and provide low-level functionality needed for iModel transformation and data exchange.
- Added IModelDb.isBriefcase() getter.
- Implementing LinearlyLocatedBase interface by base LR abstract element-classes.
- Moving data-holder structures used during the LinearElement.queryLinearLocations API to imodeljs-common.
- Allow events to be sent from backend to frontend
- Add tryGetInstance / tryGetInstanceProps methods to the Relationship class which return undefined rather than throwing an exception when a relationship is not found.
- Fix webpack for ios test that were failing due to new dependencies
- VSTS#225894 - Allowed agents to bypass usage logging calls. These cause usage logging errors. 
- Add tryGetElement / tryGetElementProps which return undefined rather than throwing an exception when an element is not found.
- Add tryGetModel, tryGetModelProps, tryGetSubModel which return undefined instead of throwing exceptions when the model is not found.

## 1.9.0
Tue, 10 Dec 2019 18:08:56 GMT

### Updates

- Updated to addon 9.1.3
- Added AliCloud tile cache service
- Added framework to run imodeljs-backend test on ios using appcenter
- Setup OidcDesktopClient for Electron use cases. 
- fix warnings from static analysis
- Enabling testing code for updating LR aspects after fix in native side.
- Addressing typo in a couple of members, making them match the schema properly.
- Avoid concurrent tile uploads

## 1.8.0
Fri, 22 Nov 2019 14:03:34 GMT

### Updates

- Option to include part references in GeometrySummary output.
- Expose isTwoSided flag on ExportGraphicsMesh
- SchemaDesignPerf import tests
- Added missing topic descriptions
- Add experimental Node 12 support
- Change SectionLocationProps.clipGeometry type to string. Add get/set ClipVector methods on SectionLocation.
- Add support for view-independent display of geometry streams.

## 1.7.0
Fri, 01 Nov 2019 13:28:37 GMT

### Updates

- Add TypeScript wrapper class for BisCore:ElementOwnsExternalSourceAspects
- New wip plugin for hypermodeling support.
- Calling IModelDb.pushChanges is now a no-op if there are no changes
- Adding accessor for LinearElementId from LinearlyLocated. Adding convenience APIs to manipulate LinearReferencing data stored in multi-aspects.
- Add TypeScript wrappers for GeometricElement2dHasTypeDefinition and GeometricElement3dHasTypeDefinition navigation relationships
- Tests for Mixin impact on CRUD
- Add and fix npm script to create backend test for mobile.
- Schema Design Perf tests for Polymorphic queries
- Add IModelDb.querySchemaVersion
- Schema Design Perf tests for relationships
- Resurrected the old way of doing agent registrations

## 1.6.0
Wed, 09 Oct 2019 20:28:42 GMT

### Updates

- Add isNotSpatiallyLocated and isPlanProjection to GeometricModel3d
- Add SectionLocation
- Add GraphicalPartition3d and GraphicalModel3d
- Schema perf tests
- Addressing bug while querying for linearLocations filtering on more than 1 classes.
- Addressing rush lint issues.
- Addressing issues while returning LinearLocationReferences.
- Deprecating importSchema on the LinearReferencing domain in favor of its bulk-version.

## 1.5.0
Mon, 30 Sep 2019 22:28:48 GMT

### Updates

- added support for blank IModelConnections
- Setup a way to supply authorization through the backend for frontend requests. 
- Error log when downloading change sets should include iModelId for context. 
- Fixed the iModelHub client to properly dispose a file handle after upload to the iModelHub. 
- Add IModelDb.Elements.hasSubModel
- Make ExternalSourceAspect.checksum optional
- Clear statement cache after schema import
- Added utility to summarize geometry
- filter redundant hub requests
- Removed the `[propName: string]: any` indexed from Entity. It prevented the compiler from catching many basic errors.
- briefcase editing and undo/redo
- upgrade to TypeScript 3.6.2

## 1.4.0
Tue, 10 Sep 2019 12:09:49 GMT

### Updates

- Setup a way to supply authorization through the backend for frontend requests. 
- Allow attaching change cache file before change summary extraction. 
- Added change summary test, and improved doc a little. 
- Add minimum brep size option to IModelDb.exportGraphics
- FunctionalSchema.importSchema is now deprecated.
- Add support for GeometricModel.geometryGuid for detecting whether tiles for a model can be reused across versions
- Added performance logging for tile upload
- IModelConnection.close() for read-only connections should not close the Db at the backend; Opening an iModel with SyncModel.PullAndPush() multiple times (without disposing it) must reuse the briefcase. 
- Add method to create view with camera
- Fixed misleading logging output in tile upload

## 1.3.0
Tue, 13 Aug 2019 20:25:53 GMT

### Updates

- Allow custom tile cache services.
- Always acquire a briefcase when creating a new backend instance for PullAndPush workflows. 
- Added Change Summary integration test, and fixed documentation. 
- Trial code for tile upload errors
- Fixed changeset performance tests
- Tile upload logging.
- Mark ExportGraphics API as public
- Support for gzip compression of tiles
- Fixed issue with opening iModels with names that are invalid on Unix or Windows. 
- Add IModelDb.isSnapshot
- Tile upload error catching.
- Azure tile upload logging
- Upgrade azure storage library.

## 1.2.0
Wed, 24 Jul 2019 11:47:26 GMT

### Updates

- Added option to restrict tile cache URLs by client IP address.
- Apply change sets at the backend in a non-blocking worker thread. 
- Add ElementAspect handler methods
- When deleting a parent element, make sure there are onDelete/onDeleted callbacks for child elements
- Add support for linework to IModelDb.exportGraphics
- The className parameter to IModelDb.Element.getAspects is now optional to allow all aspects to be returned
- Deprecate IModelDb.importSchema in favor of IModelDb.importSchemas
- Added method to get element mass properties.
- Add exportPartGraphics and accompanying interfaces
- Capture tile upload errors using JSON.stringify.
- Fallback to toString for Error derivative errors in tile upload
- Always report tile upload response on failure
- Discover properties of azure 'error' object

## 1.1.0
Mon, 01 Jul 2019 19:04:29 GMT

### Updates

- Open fixes when briefcase requires merges. 
- Catch tile upload errors.
- Setting up briefcase is always from an older checkpoint. 
- Add materialId, subCategory to ExportGraphicsInfo
- Fix crash in getViewThumbnail for odd number of bytes 
- Adding relationship class for GraphicalElement3dRepresentsElement.
- Initial implementation of the LinearReferencing typescript domain
- Adding domain classes for all relatinships in the LinearReferencing schema.
- Exporting relationships module.
- Fixes to opening iModel-s ReadWrite from mutiple IModelConnection-s. 
- Fixed issues with deleting briefcases if there were errors with preparing briefcases. 
- Add a new method `forceLoadSchemas` to `IModelJsNative.ECPresentationManager`.
- Introduced AsyncMutex - a utility to run async blocks of code in sequence. 
- Properly document ModelSelector.models and CategorySelector.categories as Id64String arrays
- Made `insertElement` not return Id64.invalid, throws error instead
- Update to TypeScript 3.5
- Update property referenced in ULAS error message

## 1.0.0
Mon, 03 Jun 2019 18:09:39 GMT

### Updates

- Migrated agent applications to the newer client 
- RPC system now accepts only basic values (primitives, "interface" objects, and binary).
- Switched from iModelHub Project API to Context API
- Fix bug in IModelDb.createSnapshotFromSeed
- Add BriefcaseId.Snapshot
- Improve reading and binding binary blob using concurrent query manager
- Modified ElementAspect Performance tests
- Add options to IModelHost for logging large tile sizes and long tile load times.
- Add TypeScript wrapper for BisCore:ExternalSourceAspect
- Made poll interval configurable for concurrent query manager.
- Updated code to use new ownedByMe option when quering briefcases
- Logging changes.
- Refactored and simplified implementation of IModelDb.open
- IModelDb.openSnapshot cannot open a briefcase copy of an iModel managed by iModelHub
- The IModelDb.createSnapshot instance method replaces the IModelDb.createSnapshotFromSeed static method
- Crash reporting, node-report opt-in
- Throw IModelError if an IModelDb query would return too many rows
- Retire some tile-related feature gates.
- Introduced tile format v4.0
- Improve ulas error message logs
- Catch tile upload errors.

## 0.191.0
Mon, 13 May 2019 15:52:05 GMT

### Updates

- Support spatial classification of context reality models.
- Fix incorrect elevation for background map display.
- Adds parameter for api-extractor to validate missing release tags
- Remove requirement that JavaScript classnames match BIS classnames
- Avoided iModelHub calls when opening iModels for Design Review.
- Fixed reinitializing briefcase cache when there are .tiles files.
- Enabled use of checkpoint service.
- Added option to use azure-based tile caching
- Added a utility to diagnose backends
- Improved backend diagnostic utility.
- Adapt to Range2d name change
- Allow a view to define a set of elements which should never be drawn in that view.
- Added texture support to exportGraphics
- Fixes for file-based tile caching
- Catch tile upload errors
- Fix for release tags
- Fix broken links
- LoggerCategory -> BackendLoggerCategory
- Cleanup old imodelbank references
- Add InformationRecordModel.insert, GroupModel.insert
- Introduce LoggerCategory enum to advertise logger categories used by this package.
- Limited maximum cache size of the backend PromiseMemoizer. 
- Missing dependency on node-report
- Fixed memoization problem that caused an endless stream of 404 NotFound errors. 
- Reinstated old version of OidcAgentClient
- Unauthorized open requests should cause a more obvious error. 
- Improved performance logging, especially of IModelDb open operations; ChangeSets are merged one-by-one to prevent hogging the event loop. 
- Memoization fix when opening iModels in shared, read-only mode .
- Fixed setup of application version.
- Updated Element CRUD perf tests
- Added tile generation perf test
- QueryPage use memoization/pending pattern
- Remove IModelDb.createStandalone, use IModelDb.createSnapshot instead.
- Remove ElementPropertyFormatter, IModelDb.getElementPropertiesForDisplay (use presentation rules instead)
- Remove StandaloneIModelRpcImpl
- Fix for Render Gradient.Symb test
- Setup a generic context for tracking client requests, and made various related enhancements to logging, usage tracking and authorization. 
- Add IModelDb.createSnapshot/openSnapshot/closeSnapshot, deprecate IModelDb.createStandalone/openStandalone/closeStandalone
- Moved IModelJsExpressServer class into a new package (@bentley/express-server).
- Simplified tile caching IModelHost config and removed dev flags. Allow
- Typo in documentation
- Fix missing ULAS client request data
- ExportGraphicsFunction return type is now void
- Upgrade TypeDoc dependency to 0.14.2
- Add usage logging tests
- Edit usage logging tests to support revised usage logging syntax

## 0.190.0
Thu, 14 Mar 2019 14:26:49 GMT

### Updates

- Added IModelDb.exportGraphics
- Fix issue for ios

## 0.189.0
Wed, 06 Mar 2019 15:41:22 GMT

### Updates

- Changes package.json to include api-extractor and adds api-extractor.json
- Use new buildIModelJsBuild script
- AxisAlignedBox and ElementAlignedBox are now typed to Range3d rather than classes
- Moved AzureFileHandler, IOSAzureFileHandler, UrlFileHandler and the iModelHub tests to the imodeljs-clients-backend package. This removes the dependency of imodeljs-clients on the "fs" module, and turns it into a browser only package. 
- Clone methods are no longer generic
- Remove unneeded typedoc plugin dependency
- Added spatial <-> cartographic methods that check/use the geographic coordinate system before using ecef location.
- Added async method for ECSqlStatement and SqliteStatement for step and stepAndInsert
- Create iModel from empty template if seed file path not defined.
- Add IModelImporter for importing data between iModels
- Enable IModelWriteTest create/delete iModels on per user-machine basis
- Enable IModelWriteTest create/delete iModels on per user-machine basis
- Validated size of change sets before applying them.
- Codespec lock example
- Add backend Material API
- Validated version of Node.js in IModelHost.startup()
- Save BUILD_SEMVER to globally accessible map
- Fixed resolution of queryable promises.
- Added queryModelRange
- IModelConnection.close() always disposes the briefcase held at the backend in the case of ReadWrite connections.
- Move the IModelUnitTestRpcImpl into the testbed and out of the public API and marked nativeDb as hidden
- Remove loadNativeAsset and formatElements RPC calls from the IModelReadRpcInterface
- Removed IModelConnection.connectionId, added IModelApp.sessionId
- Tile requests can optionally specify a retryInterval.
- Improve tile request logging and make timeout configurable.
- Prevent tile generation from interfering with other asynchronous requests.
- Handled error with fetching host information on deployed machines.
- Quick fix to ULAS failures.
- WIP fixes to Usage Logging.
- Upgrade to TypeScript 3.2.2

## 0.188.0
Wed, 16 Jan 2019 16:36:09 GMT

### Updates

- Changed Elements Db class for backend processing

## 0.187.0
Tue, 15 Jan 2019 15:18:59 GMT

*Version update only*

## 0.186.0
Mon, 14 Jan 2019 23:09:10 GMT

### Updates

- More logging of HTTP requests, and enabled use of fiddler for backend diagnostics. 
- Removed IModelDb's cache of accessToken. For long running operations like AutoPush, the user must explicitly supply an IAccessTokenManager to keep the token current. 
- Renamed RequestProxy->RequestHost. Allowed applications to configure proxy server with HTTPS_PROXY env.
- Add backend TextureAPI and accompanying test

## 0.185.0
Fri, 11 Jan 2019 18:29:00 GMT

*Version update only*

## 0.184.0
Thu, 10 Jan 2019 22:46:17 GMT

### Updates

- Generalize create method for display styles
- Property Changeset.Author in IModelChange ECSchema was renamed UserCreated. It holds the user ID instead of the user e-mail.

## 0.183.0
Mon, 07 Jan 2019 21:49:21 GMT

### Updates

- Moved electron utilities into a separate "@bentley/electron-manager" package.

## 0.182.0
Mon, 07 Jan 2019 13:31:34 GMT

### Updates

- Implement the typescript side for new Geocoordinate services in the native iModel.js addon
- Upgrade to Node 10. There is no longer separate packages for Node and Electron.

## 0.181.0
Fri, 04 Jan 2019 13:02:40 GMT

### Updates

- Upgrade to Node 10. There is no longer separate packages for Node and Electron.

## 0.180.0
Wed, 02 Jan 2019 15:18:23 GMT

*Version update only*

## 0.179.0
Wed, 19 Dec 2018 18:26:14 GMT

### Updates

- Fix CodeSpecs.load
- Add CodeSpecs.hasId, CodeSpecs.hasName

## 0.178.0
Thu, 13 Dec 2018 22:06:10 GMT

### Updates

- Temporarily disable TxnManager events.

## 0.177.0
Wed, 12 Dec 2018 17:21:31 GMT

*Version update only*

## 0.176.0
Mon, 10 Dec 2018 21:19:45 GMT

### Updates

- Fix for timing problem in TxnManager test
- Add IModelDb.Elements.updateAspect

## 0.175.0
Mon, 10 Dec 2018 17:08:55 GMT

*Version update only*

## 0.174.0
Mon, 10 Dec 2018 13:24:09 GMT

### Updates

- Add static create methods for certain Element classes

## 0.173.0
Thu, 06 Dec 2018 22:03:29 GMT

### Updates

- Use IOSAzureFileHandler when on mobile
- Added IModelConnection.findClassFor
- Custom imodelJs noDirectImport lint rule implemented, noDuplicateImport lint rule turned on.

## 0.172.0
Tue, 04 Dec 2018 17:24:39 GMT

### Updates

- Don't register testing domain multiple times

## 0.171.0
Mon, 03 Dec 2018 18:52:58 GMT

### Updates

- More information logged from BriefcaseManager.\nFixed deletion/cleanup of invalid briefcases.\nAdded OIDC support for simpleviewtest application. 
- Add ElementRefersToElements.insert
- Fixed front end integration tests.
- Document the intended purpose of IModelJsExpressServer within a deployment environment.
- Fixed integration tests.
- added tests for ElementDrivesElement handlers
- Fixes to integration tests.
- Add OrthographicViewDefinition.setRange
- Cleaned up use of mocks in core tests.
- Enable test now that addon was updated.
- Fix Subject.insert to set parent

## 0.170.0
Mon, 26 Nov 2018 19:38:42 GMT

### Updates

- Add DrawingViewDefinition.insert
- Fix GeometryParams constructor. Added test to ensure subcategory id set correctly.
- Rename LinkTableRelationship to just Relationship. Work on adding callbacks for dependency propagation.

## 0.169.0
Tue, 20 Nov 2018 16:17:15 GMT

*Version update only*

## 0.168.0
Sat, 17 Nov 2018 14:20:11 GMT

*Version update only*

## 0.167.0
Fri, 16 Nov 2018 21:45:44 GMT

### Updates

- Add IModelDb.CodeSpecs.insert overload
- Add SubCategory.insert
- Add missing createCode methods
- Changes to debug utilities.
- Added IModelHubClient.IModel, removed IModelQuery.primary(), use IModelHubClient.IModel.Get instead
- Add IModelDb.Views.setDefaultViewId
- Add OrthographicViewDefinition.insert

## 0.166.0
Mon, 12 Nov 2018 16:42:10 GMT

### Updates

- Hydrated briefcases for ReadOnly cases from the latest checkpoint, rather than the seed files. This significantly improves performance of IModelDb/IModelConnection.open() for typical cases.

## 0.165.0
Mon, 12 Nov 2018 15:47:00 GMT

### Updates

- Clean up IModelImporter
- Add static insert methods to many classes to simplify iModel creation.
- Add more TypeScript wrapper classes for BisCore relationships
- Add Subject.createCode and Subject.insert methods
- Add FunctionalModel.insert method

## 0.164.0
Thu, 08 Nov 2018 17:59:20 GMT

### Updates

- Fix JSON representation of DisplayStyle.
- Add IModelImporter as a base class for utility methods needed by all importers
- Removed assertion when deleting a memoized open call. 
- Add more methods to IModelImporter
- Fix snapping test
- OIDC related enhancments (WIP).
- Re-enabled several backend integration tests. 
- Refactor analysis-importer to use IModelImporter
- Updated to TypeScript 3.1

## 0.163.0
Wed, 31 Oct 2018 20:55:37 GMT

### Updates

- Guids can now be bound as strings to ECSQL. BLOBs in ECSQL and SQLite are now mapped to UInt8Array instead of ArrayBuffer (as only the former can be marshaled between backend and frontend).
- Fully support mixed binary and JSON content in both directions in RPC la
- Remove obsolete script

## 0.162.0
Wed, 24 Oct 2018 19:20:06 GMT

### Updates

- Removed uncessary comments
- Breaking changes to optimize usage of 64-bit IDs.
- Ids and date times can now be directly bound as hex strings or date time ISO strings respectively in ECSQL statements.
- Remove unused createAndInsert methods from IModelWriteRpcInterface
- Added classes to reduce electron and express boilerplate in sample apps.

## 0.161.0
Fri, 19 Oct 2018 13:04:14 GMT

### Updates

- Update native-platform version to 0.64.2, which now includes a new package to handle electron for linux.
- Update iModel.js native platform to version 0.64.3

## 0.160.0
Wed, 17 Oct 2018 18:18:38 GMT

### Updates

- Fix for incorrect conversion in ConcurrencyControl

## 0.159.0
Tue, 16 Oct 2018 14:09:09 GMT

### Updates

- Move up to new version of addon (updated electron dependency to 2.0.8)
- Removed KnownRegions Enum

## 0.158.0
Mon, 15 Oct 2018 19:36:09 GMT

*Version update only*

## 0.157.0
Sun, 14 Oct 2018 17:20:06 GMT

### Updates

- Fixing scripts for linux

## 0.156.0
Fri, 12 Oct 2018 23:00:10 GMT

### Updates

- Initial release

