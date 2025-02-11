# 2.2.0 Change Notes

## Cel-shaded display

[DisplayStyle]($backend)s now support displaying 3d models in a cel-shaded "comic book" style using the `numCels` property of [LightSettings]($common).

![cel-shaded display](./assets/cel-shaded.png)
<p align="center">Cel-shaded display</p>

## Changes in `@bentley/ui-framework`

### `LayoutManager` removed

`LayoutManager.restoreLayout()` is replaced by `FrontstageDef.restoreLayout()`
`LayoutManager.showWidget()` is replaced by `WidgetDef.show()`
`LayoutManager.expandWidget()` is replaced by `WidgetDef.expand()`

### `StagePanelDef` changes

`StagePanelDef.trySetCurrentSize()` is replaced by `StagePanelDef.size` setter.

## Changes in `@bentley/presentation-components`

### Breaking changes

- Changed `PresentationTreeNodeLoaderProps` to derive from `PresentationTreeDataProviderProps` interface. This changes the paging attribute name from `pageSize` to `pagingSize`.

## New *domain* packages

### Analytical

The `@bentley/analytical-backend` package contains the backend base classes that specialized Analytical domain schemas extend.
These classes were previously contained within the `@bentley/imodeljs-backend` package.
There were no API changes, but imports and dependencies will need to be adjusted if these classes were previously used.

> See: [AnalyticalSchema]($analytical-backend)

### Linear Referencing

The `@bentley/linear-referencing-backend` package contains classes for working with linear referencing on the backend.
These classes were previously contained within the `@bentley/imodeljs-backend` package.
There were no API changes, but imports and dependencies will need to be adjusted if these classes were previously used.

> See: [LinearReferencingSchema]($linear-referencing-backend)

The `@bentley/linear-referencing-common` package is new and contains classes for working with linear referencing on the frontend and backend.
These classes were previously contained within the `@bentley/imodeljs-common` package.
There were no API changes, but imports and dependencies will need to be adjusted if these classes were previously used.

> See: [LinearReferencingCommon]($linear-referencing-common)

### Physical Material

The `@bentley/physical-material-backend` package is new and contains classes for working with physical materials on the backend.

> See: [PhysicalMaterialSchema]($physical-material-backend)
