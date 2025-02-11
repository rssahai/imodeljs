/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

/** @packageDocumentation
 * @module Frontstage
 */
import "./Frontstage.scss";
import produce, { Draft } from "immer";
import * as React from "react";
import { StagePanelLocation, WidgetState } from "@bentley/ui-abstract";
import { UiSettingsResult, UiSettingsStatus } from "@bentley/ui-core";
import {
  addPanelWidget, addTab, assert, createNineZoneState, createTabsState, floatingWidgetBringToFront, FloatingWidgets, FloatingWidgetState,
  NineZone, NineZoneDispatch, NineZoneState, NineZoneStateReducer, PanelSide, panelSides, TabState, toolSettingsTabId,
  WidgetPanels, WidgetState as NZ_WidgetState,
} from "@bentley/ui-ninezone";
import { useActiveFrontstageDef } from "../frontstage/Frontstage";
import { FrontstageDef, FrontstageEventArgs, FrontstageNineZoneStateChangedEventArgs } from "../frontstage/FrontstageDef";
import { PanelSizeChangedEventArgs, StagePanelState, StagePanelZoneDefKeys } from "../stagepanels/StagePanelDef";
import { useUiSettingsContext } from "../uisettings/useUiSettings";
import { WidgetDef, WidgetEventArgs, WidgetStateChangedEventArgs } from "../widgets/WidgetDef";
import { ZoneState } from "../zones/ZoneDef";
import { WidgetContent } from "./Content";
import { WidgetPanelsFrontstageContent } from "./FrontstageContent";
import { ModalFrontstageComposer, useActiveModalFrontstageInfo } from "./ModalFrontstageComposer";
import { WidgetPanelsStatusBar } from "./StatusBar";
import { WidgetPanelsToolbars } from "./Toolbars";
import { ToolSettingsContent, WidgetPanelsToolSettings } from "./ToolSettings";
import { FrontstageManager } from "../frontstage/FrontstageManager";
import { Logger } from "@bentley/bentleyjs-core";
import { UiFramework } from "../UiFramework";

// istanbul ignore next
const WidgetPanelsFrontstageComponent = React.memo(function WidgetPanelsFrontstageComponent() { // tslint:disable-line: variable-name no-shadowed-variable
  const activeModalFrontstageInfo = useActiveModalFrontstageInfo();
  return (
    <>
      <ModalFrontstageComposer stageInfo={activeModalFrontstageInfo} />
      <WidgetPanels
        className="uifw-widgetPanels"
        centerContent={<WidgetPanelsToolbars />}
      >
        <WidgetPanelsFrontstageContent />
      </WidgetPanels>
      <WidgetPanelsToolSettings />
      <WidgetPanelsStatusBar className="uifw-statusBar" />
      <FloatingWidgets />
    </>
  );
});

const widgetContent = <WidgetContent />;
const toolSettingsContent = <ToolSettingsContent />;
const widgetPanelsFrontstage = <WidgetPanelsFrontstageComponent />;

/** @internal */
export function useNineZoneState(frontstageDef: FrontstageDef) {
  const [nineZone, setNineZone] = React.useState(frontstageDef.nineZoneState);
  React.useEffect(() => {
    setNineZone(frontstageDef.nineZoneState);
  }, [frontstageDef]);
  React.useEffect(() => {
    const listener = (args: FrontstageNineZoneStateChangedEventArgs) => {
      if (args.frontstageDef !== frontstageDef)
        return;
      setNineZone(args.state);
    };
    FrontstageManager.onFrontstageNineZoneStateChangedEvent.addListener(listener);
    return () => {
      FrontstageManager.onFrontstageNineZoneStateChangedEvent.removeListener(listener);
    };
  }, [frontstageDef]);
  return nineZone;
}

/** @internal */
export function useNineZoneDispatch(frontstageDef: FrontstageDef) {
  return React.useCallback<NineZoneDispatch>((action) => {
    if (!frontstageDef.nineZoneState)
      return;
    frontstageDef.nineZoneState = NineZoneStateReducer(frontstageDef.nineZoneState, action);
  }, [frontstageDef]);
}

/** @internal */
export const WidgetPanelsFrontstage = React.memo(function WidgetPanelsFrontstage() { // tslint:disable-line: variable-name no-shadowed-variable
  const frontstageDef = useActiveFrontstageDef();
  if (!frontstageDef)
    return null;
  return (
    <ActiveFrontstageDefProvider frontstageDef={frontstageDef} />
  );
});

const defaultNineZone = createNineZoneState();

/** @internal */
export function ActiveFrontstageDefProvider({ frontstageDef }: { frontstageDef: FrontstageDef }) {
  const nineZone = useNineZoneState(frontstageDef);
  const dispatch = useNineZoneDispatch(frontstageDef);
  useSavedFrontstageState(frontstageDef);
  useSaveFrontstageSettings(frontstageDef);
  useFrontstageManager(frontstageDef);
  useSyncDefinitions(frontstageDef);
  return (
    <div className="uifw-widgetPanels-frontstage">
      <NineZone
        dispatch={dispatch}
        state={nineZone || defaultNineZone}
        widgetContent={widgetContent}
        toolSettingsContent={toolSettingsContent}
      >
        {widgetPanelsFrontstage}
      </NineZone>
    </div>
  );
}

/** @internal */
export function addWidgets(state: NineZoneState, widgets: ReadonlyArray<WidgetDef>, side: PanelSide, widgetId: WidgetIdTypes): NineZoneState {
  if (widgets.length > 0) {
    const activeWidget = widgets.find((widget) => widget.isActive);
    const minimized = !activeWidget;
    state = addPanelWidget(state, side, widgetId, {
      activeTabId: activeWidget?.id,
      minimized,
    });
  }

  for (const widget of widgets) {
    const label = getWidgetLabel(widget.label);
    state = addTab(state, widgetId, widget.id, {
      label,
    });
  }
  return state;
}

function getWidgetLabel(label: string) {
  return label === "" ? "Widget" : label;
}

type FrontstagePanelDefs = Pick<FrontstageDef, "leftPanel" | "rightPanel" | "topPanel" | "bottomPanel">;
type FrontstagePanelDefKeys = keyof FrontstagePanelDefs;

type WidgetIdTypes = "leftStart" |
  "leftMiddle" |
  "leftEnd" |
  "rightStart" |
  "rightMiddle" |
  "rightEnd" |
  "topStart" |
  "topEnd" |
  "bottomStart" |
  "bottomEnd";

function getPanelDefKey(side: PanelSide): FrontstagePanelDefKeys {
  switch (side) {
    case "bottom":
      return "bottomPanel";
    case "left":
      return "leftPanel";
    case "right":
      return "rightPanel";
    case "top":
      return "topPanel";
  }
}

/** @internal */
export function getPanelSide(location: StagePanelLocation): PanelSide {
  switch (location) {
    case StagePanelLocation.Bottom:
    case StagePanelLocation.BottomMost:
      return "bottom";
    case StagePanelLocation.Left:
      return "left";
    case StagePanelLocation.Right:
      return "right";
    case StagePanelLocation.Top:
    case StagePanelLocation.TopMost:
      return "top";
  }
}

/** @internal */
export function getWidgetId(side: PanelSide, key: StagePanelZoneDefKeys): WidgetIdTypes {
  switch (side) {
    case "left": {
      if (key === "start") {
        return "leftStart";
      } else if (key === "middle") {
        return "leftMiddle";
      }
      return "leftEnd";
    }
    case "right": {
      if (key === "start") {
        return "rightStart";
      } else if (key === "middle") {
        return "rightMiddle";
      }
      return "rightEnd";
    }
    case "top": {
      if (key === "start") {
        return "topStart";
      }
      return "topEnd";
    }
    case "bottom": {
      if (key === "start")
        return "bottomStart";
      return "bottomEnd";
    }
  }
}

/** @internal */
export function addPanelWidgets(
  state: NineZoneState,
  frontstageDef: FrontstageDef,
  side: PanelSide,
): NineZoneState {
  const panelDefKey = getPanelDefKey(side);
  const panelDef = frontstageDef[panelDefKey];
  const panelZones = panelDef?.panelZones;
  if (!panelZones) {
    switch (side) {
      case "left": {
        state = addWidgets(state, frontstageDef.centerLeft?.widgetDefs || [], side, "leftStart");
        state = addWidgets(state, frontstageDef.bottomLeft?.widgetDefs || [], side, "leftMiddle");
        state = addWidgets(state, frontstageDef.leftPanel?.widgetDefs || [], side, "leftEnd");
        break;
      }
      case "right": {
        state = addWidgets(state, frontstageDef.centerRight?.widgetDefs || [], side, "rightStart");
        state = addWidgets(state, frontstageDef.bottomRight?.widgetDefs || [], side, "rightMiddle");
        state = addWidgets(state, frontstageDef.rightPanel?.widgetDefs || [], side, "rightEnd");
        break;
      }
      case "top": {
        state = addWidgets(state, frontstageDef.topPanel?.widgetDefs || [], side, "topStart");
        state = addWidgets(state, frontstageDef.topMostPanel?.widgetDefs || [], side, "topEnd"); // tslint:disable-line: deprecation
        break;
      }
      case "bottom": {
        state = addWidgets(state, frontstageDef.bottomPanel?.widgetDefs || [], side, "bottomStart");
        state = addWidgets(state, frontstageDef.bottomMostPanel?.widgetDefs || [], side, "bottomEnd"); // tslint:disable-line: deprecation
        break;
      }
    }
    return state;
  }

  for (const [key, panelZone] of panelZones) {
    const widgetId = getWidgetId(side, key);
    panelZone.widgetDefs;
    state = addWidgets(state, panelZone.widgetDefs, side, widgetId);
  }
  return state;
}

/** @internal */
export function isFrontstageStateSettingResult(settingsResult: UiSettingsResult): settingsResult is {
  status: UiSettingsStatus.Success;
  setting: FrontstageState;
} {
  if (settingsResult.status === UiSettingsStatus.Success)
    return true;
  return false;
}

const stateVersion = 4; // this needs to be bumped when NineZoneState is changed (to recreate layout).

/** @internal */
export function initializeNineZoneState(frontstageDef: FrontstageDef): NineZoneState {
  let nineZone = createNineZoneState();
  nineZone = addPanelWidgets(nineZone, frontstageDef, "left");
  nineZone = addPanelWidgets(nineZone, frontstageDef, "right");
  nineZone = addPanelWidgets(nineZone, frontstageDef, "top");
  nineZone = addPanelWidgets(nineZone, frontstageDef, "bottom");
  nineZone = produce(nineZone, (stateDraft) => {
    for (const [, panel] of Object.entries(stateDraft.panels)) {
      const widgetWithActiveTab = panel.widgets.find((widgetId) => stateDraft.widgets[widgetId].activeTabId !== undefined);
      const firstWidget = panel.widgets.length > 0 ? stateDraft.widgets[panel.widgets[0]] : undefined;
      if (!widgetWithActiveTab && firstWidget) {
        firstWidget.activeTabId = firstWidget.tabs[0];
        firstWidget.minimized = false;
      }
    }
    stateDraft.panels.left.collapsed = isPanelCollapsed([
      frontstageDef.centerLeft?.zoneState,
      frontstageDef.bottomLeft?.zoneState,
    ], [frontstageDef.leftPanel?.panelState]);
    stateDraft.panels.right.collapsed = isPanelCollapsed([
      frontstageDef.centerRight?.zoneState,
      frontstageDef.bottomRight?.zoneState,
    ], [frontstageDef.rightPanel?.panelState]);
    stateDraft.panels.top.collapsed = isPanelCollapsed([], [
      frontstageDef.topPanel?.panelState,
      frontstageDef.topMostPanel?.panelState, // tslint:disable-line: deprecation
    ]);
    stateDraft.panels.bottom.collapsed = isPanelCollapsed([], [
      frontstageDef.bottomPanel?.panelState,
      frontstageDef.bottomMostPanel?.panelState, // tslint:disable-line: deprecation
    ]);
    stateDraft.panels.left.size = frontstageDef.leftPanel?.size;
    stateDraft.panels.right.size = frontstageDef.rightPanel?.size;
    stateDraft.panels.top.size = frontstageDef.topPanel?.size;
    stateDraft.panels.bottom.size = frontstageDef.bottomPanel?.size;
  });
  return nineZone;
}

/** Converts from saved NineZoneState to NineZoneState.
 * @note Restores toolSettings tab.
 * @note Restores tab labels.
 * @internal
 */
export function restoreNineZoneState(frontstageDef: FrontstageDef, saved: SavedNineZoneState): NineZoneState {
  let restored: NineZoneState = {
    ...saved,
    tabs: createTabsState(),
  };
  restored = produce(restored, (draft) => {
    for (const [, tab] of Object.entries(saved.tabs)) {
      const widgetDef = frontstageDef.findWidgetDef(tab.id);
      if (!widgetDef) {
        Logger.logError(UiFramework.loggerCategory(restoreNineZoneState), "WidgetDef is not found for saved tab.", () => ({
          frontstageId: frontstageDef.id,
          tabId: tab.id,
        }));
      }
      draft.tabs[tab.id] = {
        ...tab,
        label: getWidgetLabel(widgetDef?.label || ""),
      };
    }
    return;
  });
  return restored;
}

/** Prepares NineZoneState to be saved.
 * @note Removes toolSettings tab.
 * @note Removes tab labels.
 * @internal
 */
export function packNineZoneState(state: NineZoneState): SavedNineZoneState {
  let packed: SavedNineZoneState = {
    ...state,
    tabs: {},
  };
  packed = produce(packed, (draft) => {
    for (const [, tab] of Object.entries(state.tabs)) {
      if (tab.id === toolSettingsTabId)
        continue;
      draft.tabs[tab.id] = {
        id: tab.id,
      };
    }
  });
  return packed;
}

/** @internal */
export function isPanelCollapsed(zoneStates: ReadonlyArray<ZoneState | undefined>, panelStates: ReadonlyArray<StagePanelState | undefined>) {
  const openZone = zoneStates.find((zoneState) => zoneState === ZoneState.Open);
  const openPanel = panelStates.find((panelState) => panelState === StagePanelState.Open);
  return !openZone && !openPanel;
}

// FrontstageState is saved in UiSettings.
interface FrontstageState {
  nineZone: SavedNineZoneState;
  id: FrontstageDef["id"];
  version: number;
  stateVersion: number;
}

// We don't save tab labels.
type SavedTabState = Omit<TabState, "label">;

interface SavedTabsState {
  readonly [id: string]: SavedTabState;
}

interface SavedNineZoneState extends Omit<NineZoneState, "tabs"> {
  readonly tabs: SavedTabsState;
}

/** @internal */
export const setPanelSize = produce((
  nineZone: Draft<NineZoneState>,
  side: PanelSide,
  size: number | undefined,
) => {
  const panel = nineZone.panels[side];
  panel.size = size === undefined ? size : Math.min(Math.max(size, panel.minSize), panel.maxSize);
});

/** @internal */
export const setWidgetState = produce((
  nineZone: Draft<NineZoneState>,
  id: TabState["id"],
  state: WidgetState,
) => {
  const location = findTab(nineZone, id);
  if (!location)
    return;
  const widget = nineZone.widgets[location.widgetId];
  if (state === WidgetState.Open) {
    widget.minimized = false;
    widget.activeTabId = id;
  } else if (state === WidgetState.Closed) {
    if (id !== widget.activeTabId)
      return;
    const minimized = widget.minimized;
    widget.minimized = true;
    if ("side" in location) {
      const panel = nineZone.panels[location.side];
      const maximized = panel.widgets.find((wId) => {
        const w = nineZone.widgets[wId];
        return !w.minimized;
      });
      if (maximized === undefined)
        widget.minimized = minimized;
      return;
    }
    return;
  }
});

/** @internal */
export const showWidget = produce((nineZone: Draft<NineZoneState>, id: TabState["id"]) => {
  const location = findTab(nineZone, id);
  if (!location)
    return;
  const widget = nineZone.widgets[location.widgetId];
  if ("side" in location) {
    const panel = nineZone.panels[location.side];
    panel.collapsed = false;
    widget.minimized = false;
    widget.activeTabId = id;
    return;
  }
  widget.minimized = false;
  floatingWidgetBringToFront(nineZone, location.floatingWidgetId);
});

/** @internal */
export const expandWidget = produce((nineZone: Draft<NineZoneState>, id: TabState["id"]) => {
  const location = findTab(nineZone, id);
  if (!location)
    return;
  const widget = nineZone.widgets[location.widgetId];
  if ("side" in location) {
    const panel = nineZone.panels[location.side];
    panel.widgets.forEach((wId) => {
      const w = nineZone.widgets[wId];
      w.minimized = true;
    });
    widget.minimized = false;
    return;
  }
  widget.minimized = false;
  return;
});

const sides: PanelSide[] = ["bottom", "left", "right", "top"];

type TabLocation =
  { widgetId: NZ_WidgetState["id"], side: PanelSide } |
  { widgetId: NZ_WidgetState["id"], floatingWidgetId: FloatingWidgetState["id"] };

/** @internal */
export function findTab(state: NineZoneState, id: TabState["id"]): TabLocation | undefined {
  let widgetId;
  for (const [, widget] of Object.entries(state.widgets)) {
    const index = widget.tabs.indexOf(id);
    if (index >= 0) {
      widgetId = widget.id;
    }
  }
  if (!widgetId)
    return undefined;
  const widgetLocation = findWidget(state, widgetId);
  return widgetLocation ? {
    ...widgetLocation,
    widgetId,
  } : undefined;
}

type WidgetLocation =
  { side: PanelSide } |
  { floatingWidgetId: FloatingWidgetState["id"] };

/** @internal */
export function findWidget(state: NineZoneState, id: NZ_WidgetState["id"]): WidgetLocation | undefined {
  if (id in state.floatingWidgets.byId) {
    return {
      floatingWidgetId: id,
    };
  }
  for (const side of sides) {
    const panel = state.panels[side];
    const index = panel.widgets.indexOf(id);
    if (index >= 0) {
      return {
        side,
      };
    }
  }
  return undefined;
}

/** @internal */
export function useSavedFrontstageState(frontstageDef: FrontstageDef) {
  const uiSettings = useUiSettingsContext();
  const uiSettingsRef = React.useRef(uiSettings);
  React.useEffect(() => {
    uiSettingsRef.current = uiSettings;
  }, [uiSettings]);
  React.useEffect(() => {
    async function fetchFrontstageState() {
      if (frontstageDef.nineZoneState)
        return;
      const id = frontstageDef.id;
      const version = frontstageDef.version;
      const settingsResult = await uiSettingsRef.current.getSetting(FRONTSTAGE_SETTINGS_NAMESPACE, getFrontstageStateSettingName(id));
      if (isFrontstageStateSettingResult(settingsResult) &&
        settingsResult.setting.version >= version &&
        settingsResult.setting.stateVersion >= stateVersion
      ) {
        frontstageDef.nineZoneState = restoreNineZoneState(frontstageDef, settingsResult.setting.nineZone);
        return;
      }
      frontstageDef.nineZoneState = initializeNineZoneState(frontstageDef);
    }
    fetchFrontstageState(); // tslint:disable-line: no-floating-promises
  }, [frontstageDef]);
}

/** @internal */
export function useSaveFrontstageSettings(frontstageDef: FrontstageDef) {
  const nineZone = useNineZoneState(frontstageDef);
  const uiSettings = useUiSettingsContext();
  const saveSetting = React.useCallback(debounce(async (id: string, version: number, state: NineZoneState) => {
    const setting: FrontstageState = {
      id,
      nineZone: packNineZoneState(state),
      stateVersion,
      version,
    };
    await uiSettings.saveSetting(FRONTSTAGE_SETTINGS_NAMESPACE, getFrontstageStateSettingName(id), setting);
  }, 1000), [uiSettings]);
  React.useEffect(() => {
    return () => {
      saveSetting.cancel();
    };
  }, [saveSetting]);
  React.useEffect(() => {
    if (!nineZone || nineZone.draggedTab)
      return;
    saveSetting(frontstageDef.id, frontstageDef.version, nineZone);
  }, [frontstageDef, nineZone, saveSetting]);
}

const FRONTSTAGE_SETTINGS_NAMESPACE = "uifw-frontstageSettings";

function getFrontstageStateSettingName(frontstageId: FrontstageState["id"]) {
  return `frontstageState[${frontstageId}]`;
}

// istanbul ignore next
function debounce<T extends (...args: any[]) => any>(func: T, duration: number) {
  let timeout: number | undefined;
  const debounced = (...args: Parameters<T>) => {
    const handler = () => {
      timeout = undefined;
      return func(...args);
    };
    window.clearTimeout(timeout);
    timeout = window.setTimeout(handler, duration);
  };
  debounced.cancel = () => {
    window.clearTimeout(timeout);
  };
  return debounced;
}

const createListener = <T extends (...args: any[]) => void>(frontstageDef: FrontstageDef, listener: T) => {
  return (...args: Parameters<T>) => {
    if (!frontstageDef.nineZoneState)
      return;
    listener(...args);
  };
};

/** @internal */
export function useFrontstageManager(frontstageDef: FrontstageDef) {
  React.useEffect(() => {
    const listener = createListener(frontstageDef, ({ panelDef, size }: PanelSizeChangedEventArgs) => {
      assert(frontstageDef.nineZoneState);
      const panel = getPanelSide(panelDef.location);
      frontstageDef.nineZoneState = setPanelSize(frontstageDef.nineZoneState, panel, size);
    });
    FrontstageManager.onPanelSizeChangedEvent.addListener(listener);
    return () => {
      FrontstageManager.onPanelSizeChangedEvent.removeListener(listener);
    };
  }, [frontstageDef]);
  React.useEffect(() => {
    const listener = createListener(frontstageDef, ({ widgetDef, widgetState }: WidgetStateChangedEventArgs) => {
      assert(frontstageDef.nineZoneState);
      frontstageDef.nineZoneState = setWidgetState(frontstageDef.nineZoneState, widgetDef.id, widgetState);
    });
    FrontstageManager.onWidgetStateChangedEvent.addListener(listener);
    return () => {
      FrontstageManager.onWidgetStateChangedEvent.removeListener(listener);
    };
  }, [frontstageDef]);
  React.useEffect(() => {
    const listener = createListener(frontstageDef, ({ widgetDef }: WidgetEventArgs) => {
      assert(frontstageDef.nineZoneState);
      frontstageDef.nineZoneState = showWidget(frontstageDef.nineZoneState, widgetDef.id);
    });
    FrontstageManager.onWidgetShowEvent.addListener(listener);
    return () => {
      FrontstageManager.onWidgetShowEvent.removeListener(listener);
    };
  }, [frontstageDef]);
  React.useEffect(() => {
    const listener = createListener(frontstageDef, ({ widgetDef }: WidgetEventArgs) => {
      assert(frontstageDef.nineZoneState);
      frontstageDef.nineZoneState = expandWidget(frontstageDef.nineZoneState, widgetDef.id);
    });
    FrontstageManager.onWidgetExpandEvent.addListener(listener);
    return () => {
      FrontstageManager.onWidgetExpandEvent.removeListener(listener);
    };
  }, [frontstageDef]);
  const uiSettings = useUiSettingsContext();
  React.useEffect(() => {
    const listener = (args: FrontstageEventArgs) => {
      // TODO: track restoring frontstages to support workflows:  i.e. prevent loading frontstage OR saving layout when delete is pending
      uiSettings.deleteSetting(FRONTSTAGE_SETTINGS_NAMESPACE, getFrontstageStateSettingName(args.frontstageDef.id)); // tslint:disable-line: no-floating-promises
      if (frontstageDef.id === args.frontstageDef.id) {
        args.frontstageDef.nineZoneState = initializeNineZoneState(frontstageDef);
      } else {
        args.frontstageDef.nineZoneState = undefined;
      }
    };
    FrontstageManager.onFrontstageRestoreLayoutEvent.addListener(listener);
    return () => {
      FrontstageManager.onFrontstageRestoreLayoutEvent.removeListener(listener);
    };
  }, [uiSettings, frontstageDef]);
}

/** @internal */
export function useSyncDefinitions(frontstageDef: FrontstageDef) {
  const nineZone = useNineZoneState(frontstageDef);
  React.useEffect(() => {
    if (!nineZone)
      return;
    for (const panelSide of panelSides) {
      const panel = nineZone.panels[panelSide];
      for (const widgetId of panel.widgets) {
        const widget = nineZone.widgets[widgetId];
        for (const tabId of widget.tabs) {
          const widgetDef = frontstageDef.findWidgetDef(tabId);
          let widgetState = WidgetState.Open;
          if (widget.minimized || tabId !== widget.activeTabId)
            widgetState = WidgetState.Closed;
          widgetDef && widgetDef.setWidgetState(widgetState);
        }
      }
    }
    for (const widgetId of nineZone.floatingWidgets.allIds) {
      const widget = nineZone.widgets[widgetId];
      for (const tabId of widget.tabs) {
        const widgetDef = frontstageDef.findWidgetDef(tabId);
        let widgetState = WidgetState.Open;
        if (widget.minimized || tabId !== widget.activeTabId)
          widgetState = WidgetState.Closed;
        widgetDef && widgetDef.setWidgetState(widgetState);
      }
    }
  }, [nineZone, frontstageDef]);
}
