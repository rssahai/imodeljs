/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as React from "react";
import { expect } from "chai";
import * as sinon from "sinon";
import * as moq from "typemoq";
import { Provider } from "react-redux";
import { cleanup, render } from "@testing-library/react";

import { Logger } from "@bentley/bentleyjs-core";
import { IModelApp, MockRender, ScreenViewport, SpatialViewState } from "@bentley/imodeljs-frontend";
import { WidgetState } from "@bentley/ui-abstract";
import { ConfigurableUiContent, CoreTools, FrontstageManager } from "../../ui-framework";
import TestUtils, { storageMock } from "../TestUtils";
import { TestFrontstage, TestFrontstage2, TestFrontstage3 } from "./FrontstageTestUtils";

const mySessionStorage = storageMock();

const propertyDescriptorToRestore = Object.getOwnPropertyDescriptor(window, "sessionStorage")!;

describe("FrontstageManager", () => {

  before(async () => {
    Object.defineProperty(window, "sessionStorage", {
      get: () => mySessionStorage,
    });

    await TestUtils.initializeUiFramework();

    await MockRender.App.startup();

    FrontstageManager.initialize();
    FrontstageManager.clearFrontstageDefs();
  });

  after(async () => {
    await MockRender.App.shutdown();
    TestUtils.terminateUiFramework();

    // restore the overriden property getter
    Object.defineProperty(window, "sessionStorage", propertyDescriptorToRestore);
  });

  it("initialized should return true", () => {
    expect(FrontstageManager.isInitialized).to.be.true;
  });

  it("findWidget should return undefined when no active frontstage", async () => {
    await FrontstageManager.setActiveFrontstageDef(undefined);
    expect(FrontstageManager.findWidget("xyz")).to.be.undefined;
  });

  it("setActiveFrontstage should set active frontstage", async () => {
    const frontstageProvider = new TestFrontstage();
    FrontstageManager.addFrontstageProvider(frontstageProvider);
    expect(frontstageProvider.frontstageDef).to.not.be.undefined;
    const frontstageDef = frontstageProvider.frontstageDef;
    if (frontstageDef) {
      await FrontstageManager.setActiveFrontstage(frontstageDef.id);
      expect(FrontstageManager.activeFrontstageId).to.eq(frontstageDef.id);
      expect(frontstageDef.applicationData).to.not.be.undefined;
    }
  });

  it("setActiveFrontstage should log Error on invalid id", async () => {
    const spyMethod = sinon.spy(Logger, "logError");
    await FrontstageManager.setActiveFrontstage("xyz");
    spyMethod.calledOnce.should.true;
    (Logger.logError as any).restore();
  });

  it("setWidgetState should find and set widget state", async () => {
    const frontstageProvider = new TestFrontstage();
    FrontstageManager.addFrontstageProvider(frontstageProvider);
    await FrontstageManager.setActiveFrontstageDef(frontstageProvider.frontstageDef);

    const widgetDef = FrontstageManager.findWidget("widget1");
    expect(widgetDef).to.not.be.undefined;

    if (widgetDef) {
      expect(widgetDef.isVisible).to.eq(true);
      expect(FrontstageManager.setWidgetState("widget1", WidgetState.Hidden)).to.be.true;
      expect(widgetDef.isVisible).to.eq(false);
    }
  });

  it("setActiveFrontstage should set active frontstage", async () => {
    const frontstageProvider = new TestFrontstage2();
    FrontstageManager.addFrontstageProvider(frontstageProvider);
    expect(frontstageProvider.frontstageDef).to.not.be.undefined;
    const frontstageDef = frontstageProvider.frontstageDef;
    if (frontstageDef) {
      // make sure zones defined by new names are properly placed into the proper spot in frontstageDef
      expect(frontstageDef.getZoneDef(1)).not.to.be.undefined;
      expect(frontstageDef.getZoneDef(2)).not.to.be.undefined;
      expect(frontstageDef.getZoneDef(8)).not.to.be.undefined;
      expect(frontstageDef.getZoneDef(3)).to.be.undefined;
      await FrontstageManager.setActiveFrontstage(frontstageDef.id);
      expect(FrontstageManager.activeFrontstageId).to.eq(frontstageDef.id);
    }
  });

  it("deactivateFrontstageDef should set active frontstage to undefined", async () => {
    const frontstageProvider = new TestFrontstage();
    FrontstageManager.addFrontstageProvider(frontstageProvider);
    await FrontstageManager.setActiveFrontstageDef(frontstageProvider.frontstageDef);
    expect(FrontstageManager.activeFrontstageDef).to.eq(frontstageProvider.frontstageDef);

    await FrontstageManager.deactivateFrontstageDef();
    expect(FrontstageManager.activeFrontstageDef).to.be.undefined;
  });

  it("setWidgetState returns false on invalid id", () => {
    expect(FrontstageManager.setWidgetState("xyz", WidgetState.Closed)).to.be.false;
  });

  it("findWidget returns undefined on invalid id", () => {
    expect(FrontstageManager.findWidget("xyz")).to.be.undefined;
  });

  describe("Executing a tool should set activeToolId", () => {
    const viewportMock = moq.Mock.ofType<ScreenViewport>();

    before(() => {
      const spatialViewStateMock = moq.Mock.ofType<SpatialViewState>();
      spatialViewStateMock.setup((view) => view.is3d()).returns(() => true);
      spatialViewStateMock.setup((view) => view.classFullName).returns(() => "BisCore:SpatialViewDefinition");
      viewportMock.reset();
      viewportMock.setup((viewport) => viewport.view).returns(() => spatialViewStateMock.object);

      FrontstageManager.isInitialized = false;
      FrontstageManager.initialize();
      IModelApp.viewManager.setSelectedView(viewportMock.object);
    });

    it("CoreTools.selectElementCommand", () => {
      const item = CoreTools.selectElementCommand;
      item.execute();
      expect(FrontstageManager.activeToolId).to.eq(item.toolId);
    });

  });

  describe("ConfigurableUiContent", () => {

    it("mouse moves should be handled for frontstage tracking", async () => {
      render(<Provider store={TestUtils.store} >
        <ConfigurableUiContent idleTimeout={100} intervalTimeout={100} />
      </Provider>);

      const divContainer = document.getElementById("uifw-configurableui-wrapper")!;

      const spyDeactivated = sinon.spy();
      FrontstageManager.onFrontstageDeactivatedEvent.addListener(spyDeactivated);

      const frontstageProvider = new TestFrontstage3();
      FrontstageManager.addFrontstageProvider(frontstageProvider);
      await FrontstageManager.setActiveFrontstageDef(frontstageProvider.frontstageDef);
      expect(FrontstageManager.activeFrontstageDef).to.eq(frontstageProvider.frontstageDef);

      await TestUtils.tick(200);

      divContainer.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, cancelable: true, view: window, buttons: 1 }));
      divContainer.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, cancelable: true, view: window, buttons: 1 }));

      await TestUtils.tick(200);

      divContainer.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, cancelable: true, view: window, buttons: 1 }));
      divContainer.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, cancelable: true, view: window, buttons: 1 }));

      await FrontstageManager.deactivateFrontstageDef();
      expect(FrontstageManager.activeFrontstageDef).to.be.undefined;
      spyDeactivated.calledOnce.should.true;

      cleanup();
    });

  });

});
