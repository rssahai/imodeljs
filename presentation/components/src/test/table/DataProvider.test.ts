/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/* tslint:disable:no-direct-imports */

import "@bentley/presentation-frontend/lib/test/_helpers/MockFrontendEnvironment";
import { expect } from "chai";
import * as faker from "faker";
import * as path from "path";
import * as sinon from "sinon";
import { BeEvent } from "@bentley/bentleyjs-core";
import { IModelConnection } from "@bentley/imodeljs-frontend";
import { I18N } from "@bentley/imodeljs-i18n";
import {
  Content, ContentUpdateInfo, DefaultContentDisplayTypes, Descriptor, Item, KeySet, PresentationError, Ruleset, SortDirection as ContentSortDirection,
  ValuesDictionary,
} from "@bentley/presentation-common";
import * as moq from "@bentley/presentation-common/lib/test/_helpers/Mocks";
import { PromiseContainer } from "@bentley/presentation-common/lib/test/_helpers/Promises";
import { createRandomDescriptor, createRandomECInstanceKey } from "@bentley/presentation-common/lib/test/_helpers/random";
import { Presentation, PresentationManager } from "@bentley/presentation-frontend";
import { RowItem } from "@bentley/ui-components";
import { SortDirection } from "@bentley/ui-core";
import { CacheInvalidationProps } from "../../presentation-components/common/ContentDataProvider";
import { initializeLocalization } from "../../presentation-components/common/Utils";
import { PresentationTableDataProvider, TABLE_DATA_PROVIDER_DEFAULT_PAGE_SIZE } from "../../presentation-components/table/DataProvider";

/**
 * This is just a helper class to provide public access to
 * protected methods of PresentationTableDataProvider
 */
class Provider extends PresentationTableDataProvider {
  public invalidateCache(props: CacheInvalidationProps) { super.invalidateCache(props); }
  public configureContentDescriptor(descriptor: Descriptor) { return super.configureContentDescriptor(descriptor); }
}

describe("TableDataProvider", () => {

  let rulesetId: string;
  let provider: Provider;
  let invalidateCacheSpy: sinon.SinonSpy<[CacheInvalidationProps], void>;
  let onContentUpdateEvent: BeEvent<(ruleset: Ruleset, info: ContentUpdateInfo) => void>;
  const presentationManagerMock = moq.Mock.ofType<PresentationManager>();
  const imodelMock = moq.Mock.ofType<IModelConnection>();

  before(async () => {
    rulesetId = faker.random.word();
    Presentation.setPresentationManager(presentationManagerMock.object);
    Presentation.setI18nManager(new I18N("", {
      urlTemplate: `file://${path.resolve("public/locales")}/{{lng}}/{{ns}}.json`,
    }));
    await initializeLocalization();
  });

  after(() => {
    Presentation.terminate();
  });

  beforeEach(() => {
    onContentUpdateEvent = new BeEvent();
    presentationManagerMock.reset();
    presentationManagerMock.setup((x) => x.onContentUpdate).returns(() => onContentUpdateEvent);
    provider = new Provider({ imodel: imodelMock.object, ruleset: rulesetId });
    provider.keys = new KeySet([createRandomECInstanceKey()]);
    invalidateCacheSpy = sinon.spy(provider, "invalidateCache");
  });

  const createEmptyContentItem = (): Item => {
    return new Item([createRandomECInstanceKey()], faker.random.words(),
      "", undefined, {}, {}, []);
  };
  const createContent = (recordsCount: number, itemsGenerator: () => Item = createEmptyContentItem): Content => {
    const descriptor = createRandomDescriptor();
    const records = new Array<Item>();
    while (recordsCount--) {
      records.push(itemsGenerator());
    }
    return new Content(descriptor, records);
  };
  const createSingleRecordContent = (itemsGenerator?: () => Item) => createContent(1, itemsGenerator);

  describe("constructor", () => {

    it("sets display type to GRID", () => {
      expect(provider.displayType).to.eq(DefaultContentDisplayTypes.Grid);
    });

    it("sets default sorting properties", () => {
      expect(provider.sortColumnKey).to.be.undefined;
      expect(provider.sortDirection).to.eq(SortDirection.NoSort);
    });

    it("sets default page size", () => {
      expect(provider.pagingSize).to.be.eq(TABLE_DATA_PROVIDER_DEFAULT_PAGE_SIZE);
    });

  });

  describe("getRowKey", () => {

    it("returns valid deserialized InstanceKey", () => {
      const key = createRandomECInstanceKey();
      const row: RowItem = {
        key: JSON.stringify(key),
        cells: [],
      };
      const result = provider.getRowKey(row);
      expect(result).to.deep.eq(key);
    });

  });

  describe("invalidateCache", () => {

    it("resets filtering, sorting, memoized columns and raises onColumnsChanged event when 'descriptor' flag is set", async () => {
      const onColumnsChangedSpy = sinon.spy(provider.onColumnsChanged, "raiseEvent");
      presentationManagerMock.setup(async (x) => x.getContentDescriptor({ imodel: imodelMock.object, rulesetOrId: rulesetId }, moq.It.isAny(), moq.It.isAny(), moq.It.isAny()))
        .returns(async () => createRandomDescriptor());

      provider.filterExpression = faker.random.words();
      await provider.sort(0, SortDirection.Descending);

      invalidateCacheSpy.resetHistory();
      onColumnsChangedSpy.resetHistory();

      provider.invalidateCache({ descriptor: true });

      expect(provider.filterExpression).to.be.undefined;
      expect(provider.sortColumnKey).to.be.undefined;
      expect(provider.sortDirection).to.eq(SortDirection.NoSort);
      expect(provider.getColumns.cache.keys).to.be.empty;
      expect(onColumnsChangedSpy).to.be.calledOnce;
    });

    it("resets memoized columns and raises onColumnsChanged event when 'descriptorConfiguration' flag is set", () => {
      const onColumnsChangedSpy = sinon.spy(provider.onColumnsChanged, "raiseEvent");

      provider.invalidateCache({ descriptorConfiguration: true });

      expect(provider.getColumns.cache.keys).to.be.empty;
      expect(onColumnsChangedSpy).to.be.calledOnce;
    });

    it("resets cached pages and raises onRowsChanged event when 'size' flag is set", async () => {
      const onRowsChangedSpy = sinon.spy(provider.onRowsChanged, "raiseEvent");

      const getContentMock = moq.Mock.ofInstance((provider as any).getContent);
      getContentMock.setup((x) => x(moq.It.isAny())).returns(async () => createSingleRecordContent());
      (provider as any).getContent = getContentMock.object;

      expect(await provider.getRow(0)).to.not.be.undefined;
      expect(provider.getLoadedRow(0)).to.not.be.undefined;

      provider.invalidateCache({ size: true });

      expect(provider.getLoadedRow(0)).to.be.undefined;
      expect(onRowsChangedSpy).to.be.calledOnce;
    });

    it("resets cached pages and raises onRowsChanged event when 'content' flag is set", async () => {
      const onRowsChangedSpy = sinon.spy(provider.onRowsChanged, "raiseEvent");

      const getContentMock = moq.Mock.ofInstance((provider as any).getContent);
      getContentMock.setup((x) => x(moq.It.isAny())).returns(async () => createSingleRecordContent());
      getContentMock.object.cache = { clear: () => { } };
      (provider as any).getContent = getContentMock.object;

      expect(await provider.getRow(0)).to.not.be.undefined;
      expect(provider.getLoadedRow(0)).to.not.be.undefined;

      provider.invalidateCache({ content: true });

      expect(provider.getLoadedRow(0)).to.be.undefined;
      expect(onRowsChangedSpy).to.be.calledOnce;
    });

  });

  describe("configureContentDescriptor", () => {

    it("sets sorting properties", async () => {
      const source = createRandomDescriptor();
      presentationManagerMock.setup(async (x) => x.getContentDescriptor({ imodel: imodelMock.object, rulesetOrId: rulesetId }, moq.It.isAny(), moq.It.isAny(), moq.It.isAny()))
        .returns(async () => source);

      await provider.sort(0, SortDirection.Descending);
      let result = provider.configureContentDescriptor(source);
      expect(source.sortingField).to.be.undefined;
      expect(source.sortDirection).to.be.undefined;
      expect(result.sortingField!.name).to.eq((await provider.getColumns())[0].key);
      expect(result.sortDirection).to.eq(ContentSortDirection.Descending);

      await provider.sort(0, SortDirection.Ascending);
      result = provider.configureContentDescriptor(source);
      expect(source.sortingField).to.be.undefined;
      expect(source.sortDirection).to.be.undefined;
      expect(result.sortingField!.name).to.eq((await provider.getColumns())[0].key);
      expect(result.sortDirection).to.eq(ContentSortDirection.Ascending);

      await provider.sort(0, SortDirection.NoSort);
      result = provider.configureContentDescriptor(source);
      expect(source.sortingField).to.be.undefined;
      expect(source.sortDirection).to.be.undefined;
      expect(result.sortingField!.name).to.eq((await provider.getColumns())[0].key);
      expect(result.sortDirection).to.be.undefined;
    });

    it("sets filterExpression", () => {
      const source = createRandomDescriptor();
      provider.filterExpression = "test";
      const result = provider.configureContentDescriptor(source);
      expect(source.filterExpression).to.be.undefined;
      expect(result.filterExpression).to.eq("test");
    });

  });

  describe("filterExpression", () => {

    it("sets a different filterExpression and clears caches", () => {
      provider.filterExpression = "test 1";
      expect(provider.filterExpression).to.eq("test 1");
      invalidateCacheSpy.resetHistory();

      provider.filterExpression = "test 2";
      expect(provider.filterExpression).to.eq("test 2");
      expect(invalidateCacheSpy).to.be.calledOnce;
    });

    it("doesn't clear caches if setting to the same filterExpression", () => {
      provider.filterExpression = "test";
      expect(provider.filterExpression).to.eq("test");
      invalidateCacheSpy.resetHistory();

      provider.filterExpression = "test";
      expect(provider.filterExpression).to.eq("test");
      expect(invalidateCacheSpy).to.not.be.called;
    });

  });

  describe("sort", () => {

    it("throws when trying to sort by invalid column", async () => {
      const source = createRandomDescriptor();
      source.fields = [];
      presentationManagerMock.setup(async (x) => x.getContentDescriptor({ imodel: imodelMock.object, rulesetOrId: rulesetId }, moq.It.isAny(), moq.It.isAny(), moq.It.isAny()))
        .returns(async () => source);
      await expect(provider.sort(0, SortDirection.NoSort)).to.eventually.be.rejectedWith(PresentationError);
    });

    it("invalidates descriptor configuration and content", async () => {
      const source = createRandomDescriptor();
      presentationManagerMock.setup(async (x) => x.getContentDescriptor({ imodel: imodelMock.object, rulesetOrId: rulesetId }, moq.It.isAny(), moq.It.isAny(), moq.It.isAny()))
        .returns(async () => source);
      const invalidateCacheMock = moq.Mock.ofInstance(provider.invalidateCache);
      provider.invalidateCache = invalidateCacheMock.object;
      await provider.sort(0, SortDirection.NoSort);
      invalidateCacheMock.verify((x) => x({ descriptorConfiguration: true, content: true }), moq.Times.once());
    });

    it("sets sorting properties", async () => {
      const source = createRandomDescriptor();
      presentationManagerMock.setup(async (x) => x.getContentDescriptor({ imodel: imodelMock.object, rulesetOrId: rulesetId }, moq.It.isAny(), moq.It.isAny(), moq.It.isAny()))
        .returns(async () => source);
      await provider.sort(0, SortDirection.Descending);
      expect(provider.sortColumnKey).to.eq((await provider.getColumns())[0].key);
      expect(provider.sortDirection).to.eq(SortDirection.Descending);
    });

  });

  describe("sortColumn", () => {

    it("returns undefined when no sorting column is set", async () => {
      expect(await provider.sortColumn).to.be.undefined;
    });

    it("returns valid sorting column", async () => {
      const source = createRandomDescriptor();
      presentationManagerMock.setup(async (x) => x.getContentDescriptor({ imodel: imodelMock.object, rulesetOrId: rulesetId }, moq.It.isAny(), moq.It.isAny(), moq.It.isAny()))
        .returns(async () => source);
      await provider.sort(0, SortDirection.Descending);
      const sortingColumn = await provider.sortColumn;
      expect(sortingColumn).to.eq((await provider.getColumns())[0]);
    });

  });

  describe("getColumns", () => {

    it("returns valid column descriptions", async () => {
      const descriptor = createRandomDescriptor();
      (provider as any).getContentDescriptor = () => descriptor;
      const cols = await provider.getColumns();
      expect(cols).to.matchSnapshot();
    });

    it("returns empty list when descriptor is undefined", async () => {
      (provider as any).getContentDescriptor = () => undefined;
      const cols = await provider.getColumns();
      expect(cols).to.deep.eq([]);
    });

    it("returns one column descriptor when display type is list", async () => {
      const descriptor = createRandomDescriptor();
      descriptor.displayType = DefaultContentDisplayTypes.List;
      (provider as any).getContentDescriptor = () => descriptor;
      const cols = await provider.getColumns();
      expect(cols.length).to.be.eq(1);
      expect(cols).to.matchSnapshot();
    });

    it("memoizes result", async () => {
      const descriptor = createRandomDescriptor();
      const resultPromiseContainer = new PromiseContainer<Descriptor>();
      const getContentDescriptorMock = moq.Mock.ofInstance(() => (provider as any).getContentDescriptor);
      getContentDescriptorMock.setup((x) => x()).returns(async () => resultPromiseContainer.promise).verifiable(moq.Times.once());
      getContentDescriptorMock.setup((x) => x()).verifiable(moq.Times.never());
      (provider as any).getContentDescriptor = getContentDescriptorMock.object;

      const requests = [1, 2].map(async () => provider.getColumns());
      resultPromiseContainer.resolve(descriptor);
      const response = await Promise.all(requests);
      expect(response[0]).to.deep.eq(response[1], "both responses should be equal");
      presentationManagerMock.verifyAll();
    });

  });

  describe("getRowsCount", () => {

    it("returns count from base class", async () => {
      const size = faker.random.number();
      (provider as any).getContentSetSize = () => size;
      const count = await provider.getRowsCount();
      expect(count).to.eq(size);
    });

  });

  describe("getRow", () => {

    it("returns undefined when content is undefined", async () => {
      (provider as any).getContent = async () => undefined;
      const row = await provider.getRow(0);
      expect(row).to.be.undefined;
    });

    it("returns undefined when content contains no records", async () => {
      (provider as any).getContent = async () => createContent(0);
      const row = await provider.getRow(0);
      expect(row).to.be.undefined;
    });

    it("throws when content record is invalid - contains invalid number of primary keys", async () => {
      const record = createEmptyContentItem();
      record.primaryKeys = [];
      (provider as any).getContent = async () => new Content(createRandomDescriptor(), [record]);
      await expect(provider.getRow(0)).to.eventually.be.rejectedWith(PresentationError);
    });

    it("requests content in pages", async () => {
      provider = new Provider({
        imodel: imodelMock.object,
        ruleset: rulesetId,
        pageSize: 2,
        cachedPagesCount: 10,
      });
      const contentResolver = [0, 1].map(() => new PromiseContainer<Content>());

      const getContentMock = moq.Mock.ofInstance((provider as any).getContent);
      (provider as any).getContent = getContentMock.object;
      getContentMock.setup((x) => x({ start: 0, size: 2 })).returns(async () => contentResolver[0].promise).verifiable(moq.Times.once());
      getContentMock.setup((x) => x({ start: 2, size: 2 })).returns(async () => contentResolver[1].promise).verifiable(moq.Times.once());

      // request rows without await to make sure paging is handled properly (new
      // pages are not created while other pages for the same position are being loaded)
      const requests = [0, 1, 2].map(async (index) => provider.getRow(index));
      contentResolver.forEach((resolver) => resolver.resolve(createContent(2)));
      const rows = await Promise.all(requests);
      rows.forEach((row) => expect(row).to.not.be.undefined);

      // verify the last row in second page is also loaded (even though we didn't request it)
      expect(provider.getLoadedRow(3)).to.not.be.undefined;

      // verify getContent was called once per page
      getContentMock.verifyAll();
    });

    it("returns valid row item", async () => {
      const descriptor = createRandomDescriptor();
      const values: ValuesDictionary<any> = {};
      const displayValues: ValuesDictionary<any> = {};
      descriptor.fields.forEach((field) => {
        values[field.name] = faker.random.word();
        displayValues[field.name] = faker.random.words();
      });
      const record = new Item([createRandomECInstanceKey()],
        faker.random.words(), faker.random.word(), undefined, values, displayValues, []);
      (provider as any).getContent = async () => new Content(descriptor, [record]);
      const row = await provider.getRow(0);
      expect(row).to.matchSnapshot();
    });

    it("returns valid row when display type is list", async () => {
      const descriptor = createRandomDescriptor();
      descriptor.displayType = DefaultContentDisplayTypes.List;
      const values: ValuesDictionary<any> = {};
      const displayValues: ValuesDictionary<any> = {};
      const record = new Item([createRandomECInstanceKey()],
        faker.random.words(), faker.random.word(), undefined, values, displayValues, []);
      (provider as any).getContent = async () => new Content(descriptor, [record]);
      const row = await provider.getRow(0);
      expect(row).to.matchSnapshot();
    });

  });

});
