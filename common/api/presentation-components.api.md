## API Report File for "@bentley/presentation-components"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { AbstractTreeNodeLoaderWithProvider } from '@bentley/ui-components';
import { ActiveMatchInfo } from '@bentley/ui-components';
import { CategoryDescription } from '@bentley/presentation-common';
import { ColumnDescription } from '@bentley/ui-components';
import { Content } from '@bentley/presentation-common';
import { ControlledTreeProps } from '@bentley/ui-components';
import { DelayLoadedTreeNodeItem } from '@bentley/ui-components';
import { Descriptor } from '@bentley/presentation-common';
import { DescriptorOverrides } from '@bentley/presentation-common';
import { Field } from '@bentley/presentation-common';
import { HighlightableTreeProps } from '@bentley/ui-components';
import { Id64Arg } from '@bentley/bentleyjs-core';
import { IDisposable } from '@bentley/bentleyjs-core';
import { IModelConnection } from '@bentley/imodeljs-frontend';
import { InstanceKey } from '@bentley/presentation-common';
import { IPropertyDataProvider } from '@bentley/ui-components';
import { Item } from '@bentley/presentation-common';
import { ITreeDataProvider } from '@bentley/ui-components';
import { Keys } from '@bentley/presentation-common';
import { KeySet } from '@bentley/presentation-common';
import { NodeKey } from '@bentley/presentation-common';
import { NodePathElement } from '@bentley/presentation-common';
import { Omit } from '@bentley/presentation-common';
import { PagedTreeNodeLoader } from '@bentley/ui-components';
import { PageOptions } from '@bentley/presentation-common';
import { PageOptions as PageOptions_2 } from '@bentley/ui-components';
import { PropertyData } from '@bentley/ui-components';
import { PropertyDataChangeEvent } from '@bentley/ui-components';
import { PropertyDescription } from '@bentley/ui-abstract';
import { PropertyGridProps } from '@bentley/ui-components';
import { PropertyRecord } from '@bentley/ui-abstract';
import * as React from 'react';
import { RowItem } from '@bentley/ui-components';
import { Ruleset } from '@bentley/presentation-common';
import { RulesetsFactory } from '@bentley/presentation-common';
import { SelectionChangeType } from '@bentley/presentation-frontend';
import { SelectionHandler } from '@bentley/presentation-frontend';
import { SelectionInfo } from '@bentley/presentation-common';
import { SortDirection } from '@bentley/ui-core';
import { TableDataChangeEvent } from '@bentley/ui-components';
import { TableDataProvider } from '@bentley/ui-components';
import { TableProps } from '@bentley/ui-components';
import { TreeEditingParams } from '@bentley/ui-components';
import { TreeEventHandler } from '@bentley/ui-components';
import { TreeModelChanges } from '@bentley/ui-components';
import { TreeModelSource } from '@bentley/ui-components';
import { TreeNodeItem } from '@bentley/ui-components';
import { TreeProps } from '@bentley/ui-components';
import { TreeSelectionModificationEventArgs } from '@bentley/ui-components';
import { TreeSelectionReplacementEventArgs } from '@bentley/ui-components';
import { ViewportProps } from '@bentley/ui-components';

// @public
export interface CacheInvalidationProps {
    content?: boolean;
    descriptor?: boolean;
    descriptorConfiguration?: boolean;
    size?: boolean;
}

// @public (undocumented)
export namespace CacheInvalidationProps {
    const full: () => CacheInvalidationProps;
}

// @internal
export class ContentBuilder {
    static createPropertyDescription(field: Field, props?: PropertyDescriptionCreationProps): PropertyDescription;
    static createPropertyRecord(field: Field, item: Item, props?: NestedContentCreationProps & PropertyDescriptionCreationProps): PropertyRecord;
}

// @public
export class ContentDataProvider implements IContentDataProvider {
    constructor(props: ContentDataProviderProps);
    protected configureContentDescriptor(descriptor: Readonly<Descriptor>): Descriptor;
    get displayType(): string;
    dispose(): void;
    getContent(pageOptions?: PageOptions): Promise<Content | undefined>;
    getContentDescriptor: import("micro-memoize").MicroMemoize.Memoized<() => Promise<Descriptor | undefined>>;
    getContentSetSize(): Promise<number>;
    protected getDescriptorOverrides(): DescriptorOverrides;
    getFieldByPropertyRecord(propertyRecord: PropertyRecord): Promise<Field | undefined>;
    get imodel(): IModelConnection;
    set imodel(imodel: IModelConnection);
    protected invalidateCache(props: CacheInvalidationProps): void;
    protected isFieldHidden(_field: Field): boolean;
    get keys(): KeySet;
    set keys(keys: KeySet);
    get pagingSize(): number | undefined;
    set pagingSize(value: number | undefined);
    get rulesetId(): string;
    set rulesetId(value: string);
    get selectionInfo(): SelectionInfo | undefined;
    set selectionInfo(info: SelectionInfo | undefined);
    protected shouldConfigureContentDescriptor(): boolean;
    protected shouldExcludeFromDescriptor(field: Field): boolean;
    protected shouldRequestContentForEmptyKeyset(): boolean;
}

// @public
export interface ContentDataProviderProps {
    displayType: string;
    // @internal
    doNotListenForPresentationUpdates?: boolean;
    imodel: IModelConnection;
    pagingSize?: number;
    ruleset: string | Ruleset;
}

// @beta
export interface ControlledTreeFilteringProps {
    // (undocumented)
    activeMatchIndex?: number;
    // (undocumented)
    filter?: string;
    // (undocumented)
    nodeLoader: AbstractTreeNodeLoaderWithProvider<IPresentationTreeDataProvider>;
}

// @beta @deprecated
export interface ControlledTreeWithFilteringSupportProps {
    activeMatchIndex?: number;
    filter?: string;
    nodeLoader: AbstractTreeNodeLoaderWithProvider<IPresentationTreeDataProvider>;
    onFilterApplied?: (filter: string) => void;
    onMatchesCounted?: (count: number) => void;
    onNodeLoaderChanged?: (nodeLoader: AbstractTreeNodeLoaderWithProvider<IPresentationTreeDataProvider> | undefined) => void;
}

// @beta @deprecated
export interface ControlledTreeWithVisibleNodesProps extends Omit<ControlledTreeProps, "visibleNodes"> {
    nodeLoader: AbstractTreeNodeLoaderWithProvider<IPresentationTreeDataProvider>;
}

// @public
export class DataProvidersFactory {
    constructor(props?: DataProvidersFactoryProps);
    createSimilarInstancesTableDataProvider(propertiesProvider: IPresentationPropertyDataProvider, record: PropertyRecord, props: Omit<PresentationTableDataProviderProps, "imodel" | "ruleset">): Promise<IPresentationTableDataProvider & {
        description: string;
    }>;
    }

// @public
export interface DataProvidersFactoryProps {
    rulesetsFactory?: RulesetsFactory;
}

// @beta @deprecated
export function DEPRECATED_controlledTreeWithFilteringSupport<P extends ControlledTreeWithVisibleNodesProps>(TreeComponent: React.FC<P>): React.FC<Pick<P & ControlledTreeWithFilteringSupportProps, "filter" | "onFilterApplied" | "onMatchesCounted" | "activeMatchIndex" | "nodeLoader" | "onNodeLoaderChanged" | Exclude<keyof P, "visibleNodes">>>;

// @beta @deprecated
export function DEPRECATED_controlledTreeWithVisibleNodes<P extends ControlledTreeProps>(TreeComponent: React.FC<P>): React.FC<Pick<P & ControlledTreeWithVisibleNodesProps, "style" | "className" | "selectionMode" | "nodeHighlightingProps" | "nodeLoader" | "treeEvents" | "descriptionsEnabled" | "iconsEnabled" | "treeRenderer" | "spinnerRenderer" | "noDataRenderer" | Exclude<keyof P, "visibleNodes">>>;

// @public @deprecated
export function DEPRECATED_treeWithFilteringSupport<P extends TreeProps>(TreeComponent: React.ComponentType<P>): React.ComponentType<P & TreeWithFilteringSupportProps>;

// @public @deprecated
export function DEPRECATED_treeWithUnifiedSelection<P extends TreeProps>(TreeComponent: React.ComponentClass<P>): React.ForwardRefExoticComponent<React.PropsWithoutRef<P & TreeWithUnifiedSelectionProps> & React.RefAttributes<React.Component<P, any, any>>>;

// @beta
export class FavoritePropertiesDataProvider implements IFavoritePropertiesDataProvider {
    constructor(props?: FavoritePropertiesDataProviderProps);
    getData(imodel: IModelConnection, elementIds: Id64Arg | KeySet): Promise<PropertyData>;
    includeFieldsWithCompositeValues: boolean;
    includeFieldsWithNoValues: boolean;
    }

// @beta (undocumented)
export interface FavoritePropertiesDataProviderProps {
    // @internal (undocumented)
    propertyDataProviderFactory?: (imodel: IModelConnection, ruleset?: Ruleset | string) => PresentationPropertyDataProvider;
    ruleset?: Ruleset | string;
}

// @public
export interface IContentDataProvider extends IPresentationDataProvider {
    readonly displayType: string;
    getContent: (pageOptions?: PageOptions) => Promise<Content | undefined>;
    getContentDescriptor: () => Promise<Descriptor | undefined>;
    getContentSetSize: () => Promise<number>;
    keys: KeySet;
    selectionInfo: SelectionInfo | undefined;
}

// @public
export interface IPresentationDataProvider extends IDisposable {
    readonly imodel: IModelConnection;
    readonly rulesetId: string;
}

// @public
export interface IPresentationLabelsProvider {
    getLabel(key: InstanceKey): Promise<string>;
    getLabels(keys: InstanceKey[]): Promise<string[]>;
    readonly imodel: IModelConnection;
}

// @public
export type IPresentationPropertyDataProvider = IPropertyDataProvider & IContentDataProvider;

// @public
export type IPresentationTableDataProvider = TableDataProvider & IContentDataProvider & {
    getRowKey: (row: RowItem) => InstanceKey;
};

// @public
export interface IPresentationTreeDataProvider extends ITreeDataProvider, IPresentationDataProvider {
    getFilteredNodePaths(filter: string): Promise<NodePathElement[]>;
    getNodeKey(node: TreeNodeItem): NodeKey;
    // @alpha
    loadHierarchy?(): Promise<void>;
}

// @public
export interface IUnifiedSelectionComponent {
    readonly imodel: IModelConnection;
    readonly selectionHandler?: SelectionHandler;
}

// @public
export class PresentationLabelsProvider implements IPresentationLabelsProvider {
    constructor(props: PresentationLabelsProviderProps);
    getLabel(key: InstanceKey): Promise<string>;
    getLabels(keys: InstanceKey[]): Promise<string[]>;
    // (undocumented)
    readonly imodel: IModelConnection;
}

// @public
export interface PresentationLabelsProviderProps {
    imodel: IModelConnection;
}

// @public
export class PresentationPropertyDataProvider extends ContentDataProvider implements IPresentationPropertyDataProvider {
    constructor(props: PresentationPropertyDataProviderProps);
    dispose(): void;
    getData(): Promise<PropertyData>;
    protected getDescriptorOverrides(): DescriptorOverrides;
    protected getMemoizedData: import("micro-memoize").MicroMemoize.Memoized<() => Promise<PropertyData>>;
    get includeFieldsWithCompositeValues(): boolean;
    set includeFieldsWithCompositeValues(value: boolean);
    get includeFieldsWithNoValues(): boolean;
    set includeFieldsWithNoValues(value: boolean);
    protected invalidateCache(props: CacheInvalidationProps): void;
    protected isFieldFavorite: (field: Field) => boolean;
    protected isFieldHidden(field: Field): boolean;
    // (undocumented)
    onDataChanged: PropertyDataChangeEvent;
    protected shouldConfigureContentDescriptor(): boolean;
    protected sortCategories(categories: CategoryDescription[]): void;
    protected sortFields: (category: CategoryDescription, fields: Field[]) => void;
    }

// @public
export interface PresentationPropertyDataProviderProps {
    imodel: IModelConnection;
    ruleset?: string | Ruleset;
}

// @public
export class PresentationTableDataProvider extends ContentDataProvider implements IPresentationTableDataProvider {
    constructor(props: PresentationTableDataProviderProps);
    protected configureContentDescriptor(descriptor: Readonly<Descriptor>): Descriptor;
    get filterExpression(): string | undefined;
    set filterExpression(value: string | undefined);
    getColumns: import("micro-memoize").MicroMemoize.Memoized<() => Promise<ColumnDescription[]>>;
    getLoadedRow(rowIndex: number): Readonly<RowItem> | undefined;
    getRow(rowIndex: number): Promise<RowItem>;
    getRowKey(row: RowItem): InstanceKey;
    getRowsCount(): Promise<number>;
    // (undocumented)
    protected invalidateCache(props: CacheInvalidationProps): void;
    // (undocumented)
    onColumnsChanged: TableDataChangeEvent;
    // (undocumented)
    onRowsChanged: TableDataChangeEvent;
    sort(columnIndex: number, sortDirection: SortDirection): Promise<void>;
    get sortColumn(): Promise<ColumnDescription | undefined>;
    get sortColumnKey(): string | undefined;
    get sortDirection(): SortDirection;
    }

// @public
export interface PresentationTableDataProviderProps {
    cachedPagesCount?: number;
    displayType?: string;
    // @internal
    doNotListenForPresentationUpdates?: boolean;
    imodel: IModelConnection;
    pageSize?: number;
    ruleset: string | Ruleset;
}

// @public
export class PresentationTreeDataProvider implements IPresentationTreeDataProvider, IDisposable {
    constructor(props: PresentationTreeDataProviderProps);
    dispose(): void;
    getFilteredNodePaths: (filter: string) => Promise<NodePathElement[]>;
    getNodeKey(node: TreeNodeItem): NodeKey;
    getNodes(parentNode?: TreeNodeItem, pageOptions?: PageOptions_2): Promise<DelayLoadedTreeNodeItem[]>;
    getNodesCount(parentNode?: TreeNodeItem): Promise<number>;
    get imodel(): IModelConnection;
    // @alpha
    loadHierarchy(): Promise<void>;
    get pagingSize(): number | undefined;
    set pagingSize(value: number | undefined);
    get rulesetId(): string;
    }

// @public
export interface PresentationTreeDataProviderProps {
    // @beta (undocumented)
    appendChildrenCountForGroupingNodes?: boolean;
    imodel: IModelConnection;
    pagingSize?: number;
    ruleset: string | Ruleset;
}

// @beta
export interface PresentationTreeNodeLoaderProps extends PresentationTreeDataProviderProps {
    // @internal
    dataProvider?: IPresentationTreeDataProvider;
    pagingSize: number;
    // @alpha
    preloadingEnabled?: boolean;
}

// @public
export function propertyGridWithUnifiedSelection<P extends PropertyGridProps>(PropertyGridComponent: React.ComponentType<P>): React.ComponentType<P & PropertyGridWithUnifiedSelectionProps>;

// @public
export interface PropertyGridWithUnifiedSelectionProps {
    dataProvider: IPresentationPropertyDataProvider;
    requestedContentInstancesLimit?: number;
    // @internal (undocumented)
    selectionHandler?: SelectionHandler;
}

// @public
export function tableWithUnifiedSelection<P extends TableProps>(TableComponent: React.ComponentType<P>): React.ComponentType<P & TableWithUnifiedSelectionProps>;

// @public
export interface TableWithUnifiedSelectionProps {
    dataProvider: IPresentationTableDataProvider;
    // @internal (undocumented)
    selectionHandler?: SelectionHandler;
    selectionLevel?: number;
}

// @public @deprecated
export interface TreeWithFilteringSupportProps {
    activeMatchIndex?: number;
    dataProvider: IPresentationTreeDataProvider;
    filter?: string;
    onFilterApplied?: (filter: string, filteredProvider: IPresentationTreeDataProvider) => void;
    onMatchesCounted?: (count: number) => void;
}

// @public @deprecated
export interface TreeWithUnifiedSelectionProps {
    dataProvider: IPresentationTreeDataProvider;
    onNodesDeselected?: (items: TreeNodeItem[]) => boolean;
    onNodesSelected?: (items: TreeNodeItem[], replace: boolean) => boolean;
    // @internal (undocumented)
    selectionHandler?: SelectionHandler;
}

// @beta
export class UnifiedSelectionTreeEventHandler extends TreeEventHandler implements IDisposable {
    constructor(params: UnifiedSelectionTreeEventHandlerParams);
    protected createKeysForSelection(nodes: TreeNodeItem[], _selectionType: SelectionChangeType): Keys;
    // (undocumented)
    dispose(): void;
    // (undocumented)
    protected getKeys(nodes: TreeNodeItem[]): Keys;
    // (undocumented)
    protected getNodeKey(node: TreeNodeItem): NodeKey;
    // (undocumented)
    get modelSource(): TreeModelSource;
    // (undocumented)
    onSelectionModified({ modifications }: TreeSelectionModificationEventArgs): import("@bentley/ui-components").Subscription | undefined;
    // (undocumented)
    onSelectionReplaced({ replacements }: TreeSelectionReplacementEventArgs): import("@bentley/ui-components").Subscription | undefined;
    // (undocumented)
    selectNodes(modelChange?: TreeModelChanges): void;
    protected shouldSelectNode(node: TreeNodeItem, selection: Readonly<KeySet>): boolean;
    }

// @beta
export interface UnifiedSelectionTreeEventHandlerParams {
    collapsedChildrenDisposalEnabled?: boolean;
    editingParams?: TreeEditingParams;
    name?: string;
    nodeLoader: AbstractTreeNodeLoaderWithProvider<IPresentationTreeDataProvider>;
    // @internal
    selectionHandler?: SelectionHandler;
}

// @beta
export function useControlledTreeFiltering(props: ControlledTreeFilteringProps): {
    nodeHighlightingProps: HighlightableTreeProps | undefined;
    filteredNodeLoader: AbstractTreeNodeLoaderWithProvider<IPresentationTreeDataProvider> | AbstractTreeNodeLoaderWithProvider<FilteredPresentationTreeDataProvider>;
    filteredModelSource: TreeModelSource;
    isFiltering: boolean;
    matchesCount: number | undefined;
};

// @beta
export function usePresentationTreeNodeLoader(props: PresentationTreeNodeLoaderProps): PagedTreeNodeLoader<IPresentationTreeDataProvider>;

// @public
export function useRulesetRegistration(ruleset: Ruleset): void;

// @beta
export function useUnifiedSelectionTreeEventHandler(props: UnifiedSelectionTreeEventHandlerParams): UnifiedSelectionTreeEventHandler;

// @public
export function viewWithUnifiedSelection<P extends ViewportProps>(ViewportComponent: React.ComponentType<P>): React.ComponentType<P & ViewWithUnifiedSelectionProps>;

// @public
export interface ViewWithUnifiedSelectionProps {
    // @internal (undocumented)
    selectionHandler?: ViewportSelectionHandler;
}


// (No @packageDocumentation comment for this package)

```
