/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Utilities
 */

import { Store } from "redux";
import { Logger } from "@bentley/bentleyjs-core";
import { isFrontendAuthorizationClient } from "@bentley/frontend-authorization-client";
import { MobileRpcConfiguration } from "@bentley/imodeljs-common";
import { IModelApp, IModelConnection, SnapMode, ViewState } from "@bentley/imodeljs-frontend";
import { I18N } from "@bentley/imodeljs-i18n";
import { AccessToken, UserInfo } from "@bentley/itwin-client";
import { Presentation } from "@bentley/presentation-frontend";
import { getClassName, UiError } from "@bentley/ui-abstract";
import { UiComponents } from "@bentley/ui-components";
import { UiEvent } from "@bentley/ui-core";
import { BackstageManager } from "./backstage/BackstageManager";
import { DefaultIModelServices } from "./clientservices/DefaultIModelServices";
import { DefaultProjectServices } from "./clientservices/DefaultProjectServices";
import { IModelServices } from "./clientservices/IModelServices";
import { ProjectServices } from "./clientservices/ProjectServices";
import { ConfigurableUiActionId } from "./configurableui/state";
import { FrameworkState } from "./redux/FrameworkState";
import { CursorMenuData, PresentationSelectionScope, SessionStateActionId } from "./redux/SessionState";
import { StateManager } from "./redux/StateManager";
import { SyncUiEventDispatcher } from "./syncui/SyncUiEventDispatcher";
import { COLOR_THEME_DEFAULT, WIDGET_OPACITY_DEFAULT } from "./theme/ThemeManager";
import { UiShowHideManager } from "./utils/UiShowHideManager";
import { WidgetManager } from "./widgets/WidgetManager";
import { ConfigurableUiManager } from "./configurableui/ConfigurableUiManager";
import { HideIsolateEmphasizeActionHandler, HideIsolateEmphasizeManager } from "./selection/HideIsolateEmphasizeManager";

// cSpell:ignore Mobi

/** UiVisibility Event Args interface.
 * @public
 */
export interface UiVisibilityEventArgs {
  visible: boolean;
}

/** UiVisibility Event class.
 * @public
 */
export class UiVisibilityChangedEvent extends UiEvent<UiVisibilityEventArgs> { }

/** FrameworkVersion Changed Event Args interface.
 * @internal
 */
export interface FrameworkVersionChangedEventArgs {
  oldVersion: string;
  version: string;
}

/** FrameworkVersion Changed Event class.
 * @internal
 */
export class FrameworkVersionChangedEvent extends UiEvent<FrameworkVersionChangedEventArgs> { }

/**
 * Manages the Redux store, I18N service and iModel, Project and Login services for the ui-framework package.
 * @public
 */
export class UiFramework {
  private static _initialized = false;
  private static _projectServices?: ProjectServices;
  private static _iModelServices?: IModelServices;
  private static _i18n?: I18N;
  private static _store?: Store<any>;
  private static _complaint = "UiFramework not initialized";
  private static _frameworkStateKeyInStore: string = "frameworkState";  // default name
  private static _backstageManager?: BackstageManager;
  private static _widgetManager?: WidgetManager;
  private static _version1WidgetOpacity: number = WIDGET_OPACITY_DEFAULT;
  private static _uiVersion = "";
  private static _hideIsolateEmphasizeActionHandler?: HideIsolateEmphasizeActionHandler;

  /** Get Show Ui event.
   * @public
   */
  public static readonly onUiVisibilityChanged = new UiVisibilityChangedEvent();

  /** Get FrameworkVersion Changed event.
   * @internal
   */
  public static readonly onFrameworkVersionChangedEvent = new FrameworkVersionChangedEvent();

  /**
   * Called by the application to initialize the UiFramework. Also initializes UiComponents, UiCore and UiAbstract.
   * @param store The single Redux store created by the host application. If this is `undefined` then it is assumed that the [[StateManager]] is being used to provide the Redux store.
   * @param i18n The internationalization service created by the application. Defaults to IModelApp.i18n.
   * @param frameworkStateKey The name of the key used by the app when adding the UiFramework state into the Redux store. If not defined "frameworkState" is assumed. This value is ignored if [[StateManager]] is being used. The StateManager use "frameworkState".
   */
  public static async initialize(store: Store<any> | undefined, i18n?: I18N, frameworkStateKey?: string): Promise<void> {
    return this.initializeEx(store, i18n, frameworkStateKey);
  }

  /**
   * Called by the application to initialize the UiFramework. Also initializes UiComponents, UiCore and UiAbstract.
   * @param store The single Redux store created by the host application. If this is `undefined` then it is assumed that the [[StateManager]] is being used to provide the Redux store.
   * @param i18n The internationalization service created by the application. Defaults to IModelApp.i18n.
   * @param frameworkStateKey The name of the key used by the app when adding the UiFramework state into the Redux store. If not defined "frameworkState" is assumed. This value is ignored if [[StateManager]] is being used. The StateManager use "frameworkState".
   * @param projectServices Optional app defined projectServices. If not specified DefaultProjectServices will be used.
   * @param iModelServices Optional app defined iModelServices. If not specified DefaultIModelServices will be used.
   *
   * @internal
   */
  public static async initializeEx(store: Store<any> | undefined, i18n?: I18N, frameworkStateKey?: string, projectServices?: ProjectServices, iModelServices?: IModelServices): Promise<void> {
    if (UiFramework._initialized) {
      Logger.logInfo(UiFramework.loggerCategory(UiFramework), `UiFramework.initialize already called`);
      return;
    }

    // if store is undefined then the StateManager class should have been initialized by parent app and the apps default set of reducer registered with it.
    UiFramework._store = store;
    UiFramework._i18n = i18n || IModelApp.i18n;
    // ignore setting _frameworkStateKeyInStore if not using store
    if (frameworkStateKey && store)
      UiFramework._frameworkStateKeyInStore = frameworkStateKey;

    const frameworkNamespace = UiFramework._i18n.registerNamespace(UiFramework.i18nNamespace);
    const readFinishedPromise = frameworkNamespace.readFinished;

    UiFramework._projectServices = projectServices ? /* istanbul ignore next */ projectServices : new DefaultProjectServices();
    UiFramework._iModelServices = iModelServices ? /* istanbul ignore next */ iModelServices : new DefaultIModelServices();
    UiFramework._backstageManager = new BackstageManager();
    UiFramework._hideIsolateEmphasizeActionHandler = new HideIsolateEmphasizeManager();  // this allows user to override the default HideIsolateEmphasizeManager implementation.
    UiFramework._widgetManager = new WidgetManager();

    UiFramework.onFrameworkVersionChangedEvent.addListener(UiFramework._handleFrameworkVersionChangedEvent);

    const oidcClient = IModelApp.authorizationClient;
    // istanbul ignore next
    if (isFrontendAuthorizationClient(oidcClient)) {
      const authorized = IModelApp.authorizationClient && IModelApp.authorizationClient.isAuthorized;
      if (authorized) {
        const accessToken = await oidcClient.getAccessToken();
        UiFramework.setUserInfo(accessToken !== undefined ? accessToken.getUserInfo() : undefined);
      }
      oidcClient.onUserStateChanged.addListener(UiFramework._handleUserStateChanged);
    }

    // Initialize ui-components, ui-core & ui-abstract
    await UiComponents.initialize(UiFramework._i18n);

    UiFramework._initialized = true;

    return readFinishedPromise;
  }

  /** Unregisters the UiFramework internationalization service namespace */
  public static terminate() {
    UiFramework._store = undefined;
    UiFramework._frameworkStateKeyInStore = "frameworkState";

    if (UiFramework._i18n)
      UiFramework._i18n.unregisterNamespace(UiFramework.i18nNamespace);
    UiFramework._i18n = undefined;
    UiFramework._projectServices = undefined;
    UiFramework._iModelServices = undefined;
    UiFramework._backstageManager = undefined;
    UiFramework._widgetManager = undefined;
    UiFramework._hideIsolateEmphasizeActionHandler = undefined;

    UiFramework.onFrameworkVersionChangedEvent.removeListener(UiFramework._handleFrameworkVersionChangedEvent);

    UiComponents.terminate();
    UiFramework._initialized = false;
  }

  /** Determines if UiFramework has been initialized */
  public static get initialized(): boolean { return UiFramework._initialized; }

  /** @beta */
  public static get frameworkStateKey(): string {
    return UiFramework._frameworkStateKeyInStore;
  }

  /** The UiFramework state maintained by Redux
   * @beta
   */
  public static get frameworkState(): FrameworkState | undefined {
    // tslint:disable-next-line:no-string-literal
    return UiFramework.store.getState()[UiFramework.frameworkStateKey];
  }

  /** The Redux store */
  public static get store(): Store<any> {
    if (UiFramework._store)
      return UiFramework._store;

    // istanbul ignore else
    if (!StateManager.isInitialized(true))
      throw new UiError(UiFramework.loggerCategory(this), UiFramework._complaint);

    // istanbul ignore next
    return StateManager.store;
  }

  /** The internationalization service created by the app. */
  public static get i18n(): I18N {
    if (!UiFramework._i18n)
      throw new UiError(UiFramework.loggerCategory(this), UiFramework._complaint);
    return UiFramework._i18n;
  }

  /** The internationalization service namespace. */
  public static get i18nNamespace(): string {
    return "UiFramework";
  }

  /** @beta */
  public static get backstageManager(): BackstageManager {
    // istanbul ignore next
    if (!UiFramework._backstageManager)
      throw new UiError(UiFramework.loggerCategory(this), UiFramework._complaint);
    return UiFramework._backstageManager;
  }

  /** @alpha */
  public static get hideIsolateEmphasizeActionHandler(): HideIsolateEmphasizeActionHandler {
    // istanbul ignore next
    if (!UiFramework._hideIsolateEmphasizeActionHandler)
      throw new UiError(UiFramework.loggerCategory(this), UiFramework._complaint);
    return UiFramework._hideIsolateEmphasizeActionHandler;
  }

  /** @alpha */
  public static setHideIsolateEmphasizeActionHandler(handler: HideIsolateEmphasizeActionHandler | undefined) {
    // istanbul ignore else
    if (handler)
      UiFramework._hideIsolateEmphasizeActionHandler = handler;
    else
      UiFramework._hideIsolateEmphasizeActionHandler = new HideIsolateEmphasizeManager();
  }

  /** @alpha */
  public static get widgetManager(): WidgetManager {
    // istanbul ignore next
    if (!UiFramework._widgetManager)
      throw new UiError(UiFramework.loggerCategory(this), UiFramework._complaint);
    return UiFramework._widgetManager;
  }

  /** Calls i18n.translateWithNamespace with the "UiFramework" namespace. Do NOT include the namespace in the key.
   * @internal
   */
  public static translate(key: string | string[]): string {
    return UiFramework.i18n.translateWithNamespace(UiFramework.i18nNamespace, key);
  }

  /** @internal */
  public static get packageName(): string {
    return "ui-framework";
  }

  /** @internal */
  public static loggerCategory(obj: any): string {
    const className = getClassName(obj);
    const category = UiFramework.packageName + (className ? `.${className}` : "");
    return category;
  }

  /** @internal */
  public static get projectServices(): ProjectServices {
    if (!UiFramework._projectServices)
      throw new UiError(UiFramework.loggerCategory(this), UiFramework._complaint);
    return UiFramework._projectServices!;
  }

  /** @internal */
  public static get iModelServices(): IModelServices {
    if (!UiFramework._iModelServices)
      throw new UiError(UiFramework.loggerCategory(this), UiFramework._complaint);
    return UiFramework._iModelServices!;
  }

  public static dispatchActionToStore(type: string, payload: any, immediateSync = false) {
    UiFramework.store.dispatch({ type, payload });
    if (immediateSync)
      SyncUiEventDispatcher.dispatchImmediateSyncUiEvent(type);
    else
      SyncUiEventDispatcher.dispatchSyncUiEvent(type);
  }

  public static setAccudrawSnapMode(snapMode: SnapMode) {
    UiFramework.store.dispatch({ type: ConfigurableUiActionId.SetSnapMode, payload: snapMode });
  }

  public static getAccudrawSnapMode(): SnapMode {
    return UiFramework.frameworkState ? UiFramework.frameworkState.configurableUiState.snapMode : /* istanbul ignore next */ SnapMode.NearestKeypoint;
  }

  public static getActiveSelectionScope(): string {
    return UiFramework.frameworkState ? UiFramework.frameworkState.sessionState.activeSelectionScope : /* istanbul ignore next */ "element";
  }

  public static setActiveSelectionScope(selectionScopeId: string): void {
    // istanbul ignore else
    if (UiFramework.frameworkState) {
      const foundIndex = UiFramework.frameworkState.sessionState.availableSelectionScopes.findIndex((selectionScope: PresentationSelectionScope) => selectionScope.id === selectionScopeId);
      if (-1 !== foundIndex) {
        const scope = UiFramework.frameworkState.sessionState.availableSelectionScopes[foundIndex];
        UiFramework.dispatchActionToStore(SessionStateActionId.SetSelectionScope, scope.id);
        Presentation.selection.scopes.activeScope = scope.id;
      }
    }
  }

  /** @beta */
  public static openCursorMenu(menuData: CursorMenuData | undefined): void {
    UiFramework.dispatchActionToStore(SessionStateActionId.UpdateCursorMenu, menuData);
  }

  /** @beta */
  public static closeCursorMenu(): void {
    UiFramework.dispatchActionToStore(SessionStateActionId.UpdateCursorMenu, undefined);
  }

  /** @beta */
  public static getCursorMenuData(): CursorMenuData | undefined {
    return UiFramework.frameworkState ? UiFramework.frameworkState.sessionState.cursorMenuData : /* istanbul ignore next */ undefined;
  }

  public static getActiveIModelId(): string {
    return UiFramework.frameworkState ? UiFramework.frameworkState.sessionState.iModelId : /* istanbul ignore next */  "";
  }

  public static setActiveIModelId(iModelId: string): void {
    UiFramework.dispatchActionToStore(SessionStateActionId.SetActiveIModelId, iModelId);
  }

  public static setIModelConnection(iModelConnection: IModelConnection | undefined, immediateSync = false) {
    UiFramework.dispatchActionToStore(SessionStateActionId.SetIModelConnection, iModelConnection, immediateSync);
  }

  public static getIModelConnection(): IModelConnection | undefined {
    return UiFramework.frameworkState ? UiFramework.frameworkState.sessionState.iModelConnection : /* istanbul ignore next */  undefined;
  }

  /** @beta */
  public static setUserInfo(userInfo: UserInfo | undefined, immediateSync = false) {
    UiFramework.dispatchActionToStore(SessionStateActionId.SetUserInfo, userInfo, immediateSync);
  }

  /** @beta */
  public static getUserInfo(): UserInfo | undefined {
    return UiFramework.frameworkState ? UiFramework.frameworkState.sessionState.userInfo : /* istanbul ignore next */  undefined;
  }

  public static setDefaultIModelViewportControlId(iModelViewportControlId: string, immediateSync = false) {
    UiFramework.dispatchActionToStore(SessionStateActionId.SetDefaultIModelViewportControlId, iModelViewportControlId, immediateSync);
  }

  public static getDefaultIModelViewportControlId(): string | undefined {
    return UiFramework.frameworkState ? UiFramework.frameworkState.sessionState.defaultIModelViewportControlId : /* istanbul ignore next */  undefined;
  }

  public static setDefaultViewId(viewId: string, immediateSync = false) {
    UiFramework.dispatchActionToStore(SessionStateActionId.SetDefaultViewId, viewId, immediateSync);
  }

  public static getDefaultViewId(): string | undefined {
    return UiFramework.frameworkState ? UiFramework.frameworkState.sessionState.defaultViewId : /* istanbul ignore next */  undefined;
  }

  public static setDefaultViewState(viewState: ViewState, immediateSync = false) {
    UiFramework.dispatchActionToStore(SessionStateActionId.SetDefaultViewState, viewState, immediateSync);
  }
  public static getDefaultViewState(): ViewState | undefined {
    return UiFramework.frameworkState ? UiFramework.frameworkState.sessionState.defaultViewState : /* istanbul ignore next */  undefined;
  }

  /** @beta */
  public static getAvailableSelectionScopes(): PresentationSelectionScope[] {
    return UiFramework.frameworkState ?
      UiFramework.frameworkState.sessionState.availableSelectionScopes :
      /* istanbul ignore next */
      [{ id: "element", label: "Element" } as PresentationSelectionScope];
  }

  /** @public */
  public static getIsUiVisible() {
    return UiShowHideManager.isUiVisible;
  }

  /** @public */
  public static setIsUiVisible(visible: boolean) {
    if (UiShowHideManager.isUiVisible !== visible) {
      UiShowHideManager.isUiVisible = visible;
      UiFramework.onUiVisibilityChanged.emit({ visible });
    }
  }

  /** @public */
  public static setColorTheme(theme: string) {
    UiFramework.store.dispatch({ type: ConfigurableUiActionId.SetTheme, payload: theme });
  }

  /** @public */
  public static getColorTheme(): string {
    return UiFramework.frameworkState ? UiFramework.frameworkState.configurableUiState.theme : /* istanbul ignore next */ COLOR_THEME_DEFAULT;
  }

  /** @public */
  public static setWidgetOpacity(opacity: number) {
    UiFramework.store.dispatch({ type: ConfigurableUiActionId.SetWidgetOpacity, payload: opacity });
  }

  /** @public */
  public static getWidgetOpacity(): number {
    return UiFramework.frameworkState ? UiFramework.frameworkState.configurableUiState.widgetOpacity : /* istanbul ignore next */ WIDGET_OPACITY_DEFAULT;
  }

  /** @public */
  public static isMobile() {  // tslint:disable-line: prefer-get
    let mobile = false;
    // istanbul ignore if
    if ((/Mobi|Android/i.test(navigator.userAgent))) {
      mobile = true;
    } else /* istanbul ignore next */ if (/Mobi|iPad|iPhone|iPod/i.test(navigator.userAgent)) {
      mobile = true;
    } else {
      mobile = MobileRpcConfiguration.isMobileFrontend;
    }
    return mobile;
  }

  /** Returns the Ui Version.
   * @beta
   */
  // istanbul ignore next
  public static get uiVersion(): string {
    return UiFramework._uiVersion;
  }

  private static _handleFrameworkVersionChangedEvent = (args: FrameworkVersionChangedEventArgs) => {
    // Log Ui Version used
    Logger.logInfo(UiFramework.loggerCategory(UiFramework), `Ui Version changed to ${args.version} `);
    UiFramework._uiVersion = args.version;

    // If Ui Version 1, save widget opacity
    // istanbul ignore if
    if (args.oldVersion === "1")
      UiFramework._version1WidgetOpacity = UiFramework.getWidgetOpacity();

    // If Ui Version 1, restore widget opacity; otherwise, set widget opacity to 1.0 to basically turn the feature off.
    // This fixes use of "backdrop-filter: blur(10px)"" CSS.
    UiFramework.setWidgetOpacity(args.version === "1" ? UiFramework._version1WidgetOpacity : 1.0);
  }

  // istanbul ignore next
  private static _handleUserStateChanged = (accessToken: AccessToken | undefined) => {
    UiFramework.setUserInfo(accessToken !== undefined ? accessToken.getUserInfo() : undefined);

    if (accessToken === undefined) {
      ConfigurableUiManager.closeUi();
    }
  }

}
