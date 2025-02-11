/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module Base
 */

import { castDraft, Draft, produce } from "immer";
import { Point, PointProps, Rectangle, RectangleProps, SizeProps } from "@bentley/ui-core";
import { HorizontalPanelSide, isHorizontalPanelSide, PanelSide, VerticalPanelSide } from "../widget-panels/Panel";
import { assert } from "./assert";

/** @internal future */
export interface TabState {
  readonly id: string;
  readonly label: string;
}

/** @internal future */
export interface TabsState { readonly [id: string]: TabState; }

/** @internal future */
export interface WidgetState {
  readonly activeTabId: TabState["id"] | undefined;
  readonly id: string;
  readonly minimized: boolean;
  readonly tabs: ReadonlyArray<TabState["id"]>;
}

/** @internal future */
export interface FloatingWidgetState {
  readonly bounds: RectangleProps;
  readonly id: WidgetState["id"];
}

/** @internal future */
export interface DraggedTabState {
  readonly tabId: TabState["id"];
  readonly position: PointProps;
}

/** @internal future */
export interface WidgetsState { readonly [id: string]: WidgetState; }

/** @internal future */
export interface FloatingWidgetsState {
  readonly byId: { readonly [id: string]: FloatingWidgetState };
  readonly allIds: ReadonlyArray<FloatingWidgetState["id"]>;
}

/** @internal future */
export interface TabTargetTabState {
  readonly widgetId: WidgetState["id"];
  readonly tabIndex: number;
  readonly type: "tab";
}

/** @internal future */
export interface TabTargetPanelState {
  readonly side: PanelSide;
  readonly newWidgetId: WidgetState["id"];
  readonly type: "panel";
}

/** @internal future */
export interface TabTargetWidgetState {
  readonly side: PanelSide;
  readonly newWidgetId: WidgetState["id"];
  readonly widgetIndex: number;
  readonly type: "widget";
}

/** @internal future */
export interface TabTargetFloatingWidgetState {
  readonly type: "floatingWidget";
  readonly newFloatingWidgetId: FloatingWidgetState["id"];
  readonly size: SizeProps;
}

/** @internal future */
export type TabTargetState = TabTargetPanelState | TabTargetWidgetState | TabTargetTabState | TabTargetFloatingWidgetState;

/** @internal future */
export type WidgetTargetPanelState = TabTargetPanelState;

/** @internal future */
export type WidgetTargetWidgetState = TabTargetWidgetState;

/** @internal future */
export type WidgetTargetTabState = TabTargetTabState;

/** @internal future */
export interface WidgetTargetFloatingWidgetState {
  readonly type: "floatingWidget";
}

/** @internal future */
export type WidgetTargetState = WidgetTargetPanelState | WidgetTargetWidgetState | WidgetTargetTabState | WidgetTargetFloatingWidgetState;

/** @internal future */
export interface PanelsState {
  readonly bottom: HorizontalPanelState;
  readonly left: VerticalPanelState;
  readonly right: VerticalPanelState;
  readonly top: HorizontalPanelState;
}

/** @internal future */
export interface PanelState {
  readonly collapseOffset: number;
  readonly collapsed: boolean;
  readonly maxSize: number;
  readonly minSize: number;
  readonly pinned: boolean;
  readonly side: PanelSide;
  readonly size: number | undefined;
  readonly widgets: ReadonlyArray<WidgetState["id"]>;
}

/** @internal future */
export interface HorizontalPanelState extends PanelState {
  readonly span: boolean;
  readonly side: HorizontalPanelSide;
}

/** @internal future */
export interface VerticalPanelState extends PanelState {
  readonly side: VerticalPanelSide;
}

/** @internal future */
export interface DockedToolSettingsState {
  readonly type: "docked";
}

/** @internal future */
export interface WidgetToolSettingsState {
  readonly type: "widget";
}

/** @internal future */
export type ToolSettingsState = DockedToolSettingsState | WidgetToolSettingsState;

/** @internal future */
export interface NineZoneState {
  readonly draggedTab: DraggedTabState | undefined;
  readonly floatingWidgets: FloatingWidgetsState;
  readonly panels: PanelsState;
  readonly tabs: TabsState;
  readonly toolSettings: ToolSettingsState;
  readonly widgets: WidgetsState;
  readonly size: SizeProps;
}

/** @internal future */
export interface ResizeAction {
  readonly type: "RESIZE";
  readonly size: SizeProps;
}

/** @internal future */
export interface PanelToggleCollapsedAction {
  readonly type: "PANEL_TOGGLE_COLLAPSED";
  readonly side: PanelSide;
}

/** @internal future */
export interface PanelToggleSpanAction {
  readonly type: "PANEL_TOGGLE_SPAN";
  readonly side: HorizontalPanelSide;
}

/** @internal future */
export interface PanelTogglePinnedAction {
  readonly type: "PANEL_TOGGLE_PINNED";
  readonly side: PanelSide;
}

/** @internal future */
export interface PanelResizeAction {
  readonly type: "PANEL_RESIZE";
  readonly side: PanelSide;
  readonly resizeBy: number;
}

/** @internal future */
export interface PanelInitializeAction {
  readonly type: "PANEL_INITIALIZE";
  readonly side: PanelSide;
  readonly size: number;
}

/** @internal future */
export interface FloatingWidgetResizeAction {
  readonly type: "FLOATING_WIDGET_RESIZE";
  readonly id: FloatingWidgetState["id"];
  readonly resizeBy: RectangleProps;
}

/** @internal future */
export interface FloatingWidgetBringToFrontAction {
  readonly type: "FLOATING_WIDGET_BRING_TO_FRONT";
  readonly id: FloatingWidgetState["id"];
}

/** @internal future */
export interface PanelWidgetDragStartAction {
  readonly type: "PANEL_WIDGET_DRAG_START";
  readonly newFloatingWidgetId: FloatingWidgetState["id"];
  readonly id: WidgetState["id"];
  readonly bounds: RectangleProps;
  readonly side: PanelSide;
}

/** @internal future */
export interface WidgetDragAction {
  readonly type: "WIDGET_DRAG";
  readonly dragBy: PointProps;
  readonly floatingWidgetId: FloatingWidgetState["id"];
}

/** @internal future */
export interface WidgetDragEndAction {
  readonly type: "WIDGET_DRAG_END";
  readonly floatingWidgetId: FloatingWidgetState["id"];
  readonly target: WidgetTargetState;
}

/** @internal future */
export interface WidgetSendBackAction {
  readonly type: "WIDGET_SEND_BACK";
  readonly floatingWidgetId: FloatingWidgetState["id"] | undefined;
  readonly side: PanelSide | undefined;
  readonly widgetId: WidgetState["id"];
}

/** @internal future */
export interface WidgetTabClickAction {
  readonly type: "WIDGET_TAB_CLICK";
  readonly side: PanelSide | undefined;
  readonly widgetId: WidgetState["id"];
  readonly id: TabState["id"];
}

/** @internal future */
export interface WidgetTabDoubleClickAction {
  readonly type: "WIDGET_TAB_DOUBLE_CLICK";
  readonly side: PanelSide | undefined;
  readonly widgetId: WidgetState["id"];
  readonly floatingWidgetId: FloatingWidgetState["id"] | undefined;
  readonly id: TabState["id"];
}

/** @internal future */
export interface WidgetTabDragStartAction {
  readonly type: "WIDGET_TAB_DRAG_START";
  readonly side: PanelSide | undefined;
  readonly widgetId: WidgetState["id"];
  readonly floatingWidgetId: FloatingWidgetState["id"] | undefined;
  readonly id: TabState["id"];
  readonly position: PointProps;
}

/** @internal future */
export interface WidgetTabDragAction {
  readonly type: "WIDGET_TAB_DRAG";
  readonly dragBy: PointProps;
}

/** @internal future */
export interface WidgetTabDragEndAction {
  readonly type: "WIDGET_TAB_DRAG_END";
  readonly id: TabState["id"];
  readonly target: TabTargetState;
}

/** @internal future */
export interface ToolSettingsDragStartAction {
  readonly type: "TOOL_SETTINGS_DRAG_START";
  readonly newFloatingWidgetId: FloatingWidgetState["id"];
}

/** @internal future */
export type NineZoneActionTypes =
  ResizeAction |
  PanelToggleCollapsedAction |
  PanelToggleSpanAction |
  PanelTogglePinnedAction |
  PanelResizeAction |
  PanelInitializeAction |
  FloatingWidgetResizeAction |
  FloatingWidgetBringToFrontAction |
  PanelWidgetDragStartAction |
  WidgetDragAction |
  WidgetDragEndAction |
  WidgetSendBackAction |
  WidgetTabClickAction |
  WidgetTabDoubleClickAction |
  WidgetTabDragStartAction |
  WidgetTabDragAction |
  WidgetTabDragEndAction |
  ToolSettingsDragStartAction;

/** @internal */
export const toolSettingsTabId = "nz-tool-settings-tab";

/** @internal future */
export const NineZoneStateReducer: (state: NineZoneState, action: NineZoneActionTypes) => NineZoneState = produce(( // tslint:disable-line: variable-name
  state: Draft<NineZoneState>,
  action: NineZoneActionTypes,
) => {
  switch (action.type) {
    case "RESIZE": {
      setSizeProps(state.size, action.size);
      const nzBounds = Rectangle.createFromSize(action.size);
      for (const id of state.floatingWidgets.allIds) {
        const floatingWidget = state.floatingWidgets.byId[id];
        const bounds = Rectangle.create(floatingWidget.bounds);
        const containedBounds = bounds.containIn(nzBounds);
        setRectangleProps(floatingWidget.bounds, containedBounds);
      }
      return;
    }
    case "PANEL_TOGGLE_COLLAPSED": {
      const panel = state.panels[action.side];
      state.panels[action.side].collapsed = !panel.collapsed;
      return;
    }
    case "PANEL_TOGGLE_SPAN": {
      const panel = state.panels[action.side];
      state.panels[action.side].span = !panel.span;
      return;
    }
    case "PANEL_TOGGLE_PINNED": {
      const panel = state.panels[action.side];
      state.panels[action.side].pinned = !panel.pinned;
      return;
    }
    case "PANEL_RESIZE": {
      const panel = state.panels[action.side];
      if (panel.size === undefined)
        return;

      const requestedSize = panel.size + action.resizeBy;
      if (panel.collapsed) {
        if (action.resizeBy >= panel.collapseOffset) {
          state.panels[action.side].collapsed = false;
          return;
        }
        return;
      }

      const collapseThreshold = Math.max(panel.minSize - panel.collapseOffset, 0);
      if (requestedSize <= collapseThreshold) {
        state.panels[action.side].collapsed = true;
        state.panels[action.side].size = panel.minSize;
        return;
      }

      const size = Math.min(Math.max(requestedSize, panel.minSize), panel.maxSize);
      state.panels[action.side].size = size;
      return;
    }
    case "PANEL_INITIALIZE": {
      const panel = state.panels[action.side];
      const newSize = Math.min(Math.max(action.size, panel.minSize), panel.maxSize);
      state.panels[action.side].size = newSize;
      return;
    }
    case "PANEL_WIDGET_DRAG_START": {
      state.floatingWidgets.allIds.push(action.newFloatingWidgetId);
      state.floatingWidgets.byId[action.newFloatingWidgetId] = {
        bounds: action.bounds,
        id: action.newFloatingWidgetId,
      };
      state.widgets[action.newFloatingWidgetId] = state.widgets[action.id];
      state.widgets[action.newFloatingWidgetId].id = action.newFloatingWidgetId;
      delete state.widgets[action.id];

      const panel = state.panels[action.side];
      const widgetIndex = panel.widgets.indexOf(action.id);
      panel.widgets.splice(widgetIndex, 1);

      const expandedWidget = panel.widgets.find((widgetId) => {
        return state.widgets[widgetId].minimized === false;
      });
      if (!expandedWidget && panel.widgets.length > 0) {
        const firstWidget = state.widgets[panel.widgets[0]];
        firstWidget.minimized = false;
      }
      return;
    }
    case "WIDGET_DRAG": {
      const floatingWidget = state.floatingWidgets.byId[action.floatingWidgetId];
      assert(floatingWidget);
      const newBounds = Rectangle.create(floatingWidget.bounds).offset(action.dragBy);
      setRectangleProps(floatingWidget.bounds, newBounds);
      return;
    }
    case "WIDGET_DRAG_END": {
      const target = action.target;
      const floatingWidget = state.floatingWidgets.byId[action.floatingWidgetId];
      if (isWidgetTargetFloatingWidgetState(target)) {
        const nzBounds = Rectangle.createFromSize(state.size);
        const containedBounds = Rectangle.create(floatingWidget.bounds).containIn(nzBounds);
        setRectangleProps(floatingWidget.bounds, containedBounds);
        floatingWidgetBringToFront(state, action.floatingWidgetId);
        return;
      }
      const draggedWidget = state.widgets[action.floatingWidgetId];
      if (isWidgetTargetTabState(target)) {
        const targetWidget = state.widgets[target.widgetId];
        targetWidget.tabs.splice(target.tabIndex, 0, ...draggedWidget.tabs);
      } else if (isWidgetTargetWidgetState(target)) {
        state.panels[target.side].widgets.splice(target.widgetIndex, 0, target.newWidgetId);
        state.widgets[target.newWidgetId] = {
          ...draggedWidget,
          id: target.newWidgetId,
        };
      } else {
        state.panels[target.side].widgets = [target.newWidgetId];
        state.widgets[target.newWidgetId] = {
          ...draggedWidget,
          id: target.newWidgetId,
        };
      }
      delete state.widgets[action.floatingWidgetId];
      delete state.floatingWidgets.byId[action.floatingWidgetId];
      const idIndex = state.floatingWidgets.allIds.indexOf(action.floatingWidgetId);
      state.floatingWidgets.allIds.splice(idIndex, 1);
      return;
    }
    case "WIDGET_SEND_BACK": {
      if (isWidgetToolSettingsState(state.toolSettings)) {
        removeWidgetTab(state, action.widgetId, action.floatingWidgetId, action.side, toolSettingsTabId);
        state.toolSettings = {
          type: "docked",
        };
      }
      return;
    }
    case "FLOATING_WIDGET_RESIZE": {
      const { resizeBy } = action;
      const floatingWidget = state.floatingWidgets.byId[action.id];
      assert(floatingWidget);
      const bounds = Rectangle.create(floatingWidget.bounds);
      const newBounds = bounds.inset(-resizeBy.left, -resizeBy.top, -resizeBy.right, -resizeBy.bottom);
      setRectangleProps(floatingWidget.bounds, newBounds);
      return;
    }
    case "FLOATING_WIDGET_BRING_TO_FRONT": {
      floatingWidgetBringToFront(state, action.id);
      return;
    }
    case "WIDGET_TAB_CLICK": {
      const panel = action.side ? state.panels[action.side] : undefined;
      const widget = state.widgets[action.widgetId];
      const active = action.id === widget.activeTabId;

      state.widgets[widget.id].activeTabId = action.id;
      if (widget.minimized) {
        widget.minimized = false;
        return;
      }

      if (active && panel) {
        for (const wId of panel.widgets) {
          const w = state.widgets[wId];
          w.minimized = true;
        }
        widget.minimized = false;
      }
      return;
    }
    case "WIDGET_TAB_DOUBLE_CLICK": {
      const panel = action.side ? state.panels[action.side] : undefined;
      const widget = state.widgets[action.widgetId];
      const active = action.id === widget.activeTabId;
      const panelWidgets = panel?.widgets || [];
      const maximized = panelWidgets.filter((wId) => {
        return !state.widgets[wId].minimized;
      }, 0);
      if (widget.minimized) {
        widget.activeTabId = action.id;
        for (const wId of panelWidgets) {
          const w = state.widgets[wId];
          w.minimized = w.id !== widget.id;
        }
        return;
      }
      if (!active) {
        widget.activeTabId = action.id;
        return;
      }
      if (maximized.length > 1)
        widget.minimized = true;
      if (action.floatingWidgetId !== undefined)
        widget.minimized = true;
      return;
    }
    case "WIDGET_TAB_DRAG_START": {
      const tabId = action.id;
      state.draggedTab = {
        tabId,
        position: action.position,
      };
      removeWidgetTab(state, action.widgetId, action.floatingWidgetId, action.side, action.id);
      return;
    }
    case "WIDGET_TAB_DRAG": {
      const draggedTab = state.draggedTab;
      assert(draggedTab);
      const newPosition = Point.create(draggedTab.position).offset(action.dragBy);
      setPointProps(draggedTab.position, newPosition);
      return;
    }
    case "WIDGET_TAB_DRAG_END": {
      assert(state.draggedTab);
      const target = action.target;
      if (isTabTargetTabState(target)) {
        state.widgets[target.widgetId].tabs.splice(target.tabIndex, 0, action.id);
      } else if (isTabTargetPanelState(target)) {
        state.panels[target.side].widgets.push(target.newWidgetId);
        state.widgets[target.newWidgetId] = {
          activeTabId: action.id,
          id: target.newWidgetId,
          minimized: false,
          tabs: [action.id],
        };
      } else if (isTabTargetWidgetState(target)) {
        state.panels[target.side].widgets.splice(target.widgetIndex, 0, target.newWidgetId);
        state.widgets[target.newWidgetId] = {
          activeTabId: action.id,
          id: target.newWidgetId,
          minimized: false,
          tabs: [action.id],
        };
      } else {
        const nzBounds = Rectangle.createFromSize(state.size);
        const bounds = Rectangle.createFromSize(target.size).offset(state.draggedTab.position);
        const containedBounds = bounds.containIn(nzBounds);
        state.floatingWidgets.byId[target.newFloatingWidgetId] = {
          bounds: containedBounds.toProps(),
          id: target.newFloatingWidgetId,
        };
        state.floatingWidgets.allIds.push(target.newFloatingWidgetId);
        state.widgets[target.newFloatingWidgetId] = {
          activeTabId: action.id,
          id: target.newFloatingWidgetId,
          minimized: false,
          tabs: [action.id],
        };
      }
      state.draggedTab = undefined;
      return;
    }
    case "TOOL_SETTINGS_DRAG_START": {
      if (isDockedToolSettingsState(state.toolSettings)) {
        state.toolSettings = {
          type: "widget",
        };
        state.widgets[action.newFloatingWidgetId] = {
          activeTabId: toolSettingsTabId,
          id: action.newFloatingWidgetId,
          minimized: false,
          tabs: [toolSettingsTabId],
        };
        state.floatingWidgets.byId[action.newFloatingWidgetId] = {
          bounds: Rectangle.createFromSize({ height: 200, width: 300 }).offset({ x: 0, y: 0 }).toProps(),
          id: action.newFloatingWidgetId,
        };
        state.floatingWidgets.allIds.push(action.newFloatingWidgetId);
      }
      return;
    }
  }
});

/** @internal */
export function floatingWidgetBringToFront(state: Draft<NineZoneState>, floatingWidgetId: FloatingWidgetState["id"]) {
  const idIndex = state.floatingWidgets.allIds.indexOf(floatingWidgetId);
  const spliced = state.floatingWidgets.allIds.splice(idIndex, 1);
  state.floatingWidgets.allIds.push(spliced[0]);
}

function removeWidgetTab(
  state: Draft<NineZoneState>,
  widgetId: WidgetState["id"],
  floatingWidgetId: FloatingWidgetState["id"] | undefined,
  side: PanelSide | undefined,
  tabId: TabState["id"],
) {
  const widget = state.widgets[widgetId];
  const tabs = widget.tabs;
  const tabIndex = tabs.indexOf(tabId);
  if (tabIndex < 0)
    return;

  tabs.splice(tabIndex, 1);
  if (tabId === widget.activeTabId) {
    widget.activeTabId = widget.tabs.length > 0 ? widget.tabs[0] : undefined;
  }

  if (tabs.length === 0) {
    if (floatingWidgetId !== undefined) {
      delete state.floatingWidgets.byId[floatingWidgetId];
      const idIndex = state.floatingWidgets.allIds.indexOf(floatingWidgetId);
      state.floatingWidgets.allIds.splice(idIndex, 1);
    }
    if (side) {
      const widgets = state.panels[side].widgets;
      const widgetIndex = widgets.indexOf(widgetId);
      widgets.splice(widgetIndex, 1);

      const expandedWidget = widgets.find((wId) => {
        return state.widgets[wId].minimized === false;
      });
      if (!expandedWidget && widgets.length > 0) {
        const firstWidget = state.widgets[widgets[0]];
        firstWidget.minimized = false;
      }
    }
  }
}

/** @internal */
export function createPanelsState(): PanelsState {
  return {
    bottom: createHorizontalPanelState("bottom"),
    left: createVerticalPanelState("left"),
    right: createVerticalPanelState("right"),
    top: createHorizontalPanelState("top"),
  };
}

/** @internal */
export function createTabsState(args?: Partial<TabsState>): TabsState {
  return {
    [toolSettingsTabId]: createTabState(toolSettingsTabId, {
      label: "Tool Settings",
    }),
    ...args,
  };
}

/** @internal future */
export function createNineZoneState(args?: Partial<NineZoneState>): NineZoneState {
  return {
    draggedTab: undefined,
    floatingWidgets: {
      byId: {},
      allIds: [],
    },
    panels: createPanelsState(),
    widgets: {},
    tabs: createTabsState(),
    toolSettings: {
      type: "docked",
    },
    size: {
      height: Number.NaN,
      width: Number.NaN,
    },
    ...args,
  };
}

/** @internal */
export function createWidgetState(id: WidgetState["id"], args?: Partial<WidgetState>): WidgetState {
  return {
    activeTabId: undefined,
    id,
    minimized: false,
    tabs: [],
    ...args,
  };
}

/** @internal */
export function createTabState(id: TabState["id"], args?: Partial<TabState>): TabState {
  return {
    id,
    label: "",
    ...args,
  };
}

/** @internal */
export function addPanelWidget(state: NineZoneState, side: PanelSide, id: WidgetState["id"], widgetArgs?: Partial<WidgetState>): NineZoneState {
  const widget = createWidgetState(id, widgetArgs);
  return produce(state, (stateDraft) => {
    stateDraft.widgets[widget.id] = castDraft(widget);
    stateDraft.panels[side].widgets.push(widget.id);
  });
}

/** @internal */
export function addFloatingWidget(state: NineZoneState, id: FloatingWidgetState["id"], floatingWidgetArgs?: Partial<FloatingWidgetState>,
  widgetArgs?: Partial<WidgetState>,
): NineZoneState {
  const floatingWidget: FloatingWidgetState = {
    bounds: new Rectangle(0, 100, 200, 400).toProps(),
    id,
    ...floatingWidgetArgs,
  };
  const widget = {
    ...createWidgetState(id),
    ...widgetArgs,
  };
  return produce(state, (stateDraft) => {
    stateDraft.floatingWidgets.byId[id] = floatingWidget;
    stateDraft.floatingWidgets.allIds.push(id);
    stateDraft.widgets[id] = castDraft(widget);
  });
}

/** @internal */
export function addTab(state: NineZoneState, widgetId: WidgetState["id"], id: TabState["id"], tabArgs?: Partial<TabState>): NineZoneState {
  const tab = {
    ...createTabState(id),
    ...tabArgs,
  };
  return produce(state, (stateDraft) => {
    stateDraft.widgets[widgetId].tabs.push(tab.id);
    stateDraft.tabs[id] = tab;
  });
}

/** @internal */
export function createPanelState(side: PanelSide): PanelState {
  return {
    collapseOffset: 100,
    collapsed: false,
    maxSize: 600,
    minSize: 200,
    pinned: true,
    side,
    size: undefined,
    widgets: [],
  };
}

/** @internal */
export function createVerticalPanelState(side: VerticalPanelSide): VerticalPanelState {
  return {
    ...createPanelState(side),
    side,
  };
}

/** @internal */
export function createHorizontalPanelState(side: HorizontalPanelSide): HorizontalPanelState {
  return {
    ...createPanelState(side),
    minSize: 100,
    side,
    span: true,
  };
}

/** @internal */
export function isHorizontalPanelState(state: PanelState): state is HorizontalPanelState {
  return isHorizontalPanelSide(state.side);
}

function isTabTargetTabState(state: TabTargetState): state is TabTargetTabState {
  return state.type === "tab";
}

function isTabTargetPanelState(state: TabTargetState): state is TabTargetPanelState {
  return state.type === "panel";
}

function isTabTargetWidgetState(state: TabTargetState): state is TabTargetWidgetState {
  return state.type === "widget";
}

function isWidgetTargetFloatingWidgetState(state: WidgetTargetState): state is WidgetTargetFloatingWidgetState {
  return state.type === "floatingWidget";
}

function isWidgetTargetTabState(state: WidgetTargetState): state is WidgetTargetTabState {
  return state.type === "tab";
}

function isWidgetTargetWidgetState(state: WidgetTargetState): state is WidgetTargetWidgetState {
  return state.type === "widget";
}

function isDockedToolSettingsState(state: ToolSettingsState): state is DockedToolSettingsState {
  return state.type === "docked";
}

function isWidgetToolSettingsState(state: ToolSettingsState): state is WidgetToolSettingsState {
  return state.type === "widget";
}

function setRectangleProps(props: Draft<RectangleProps>, bounds: RectangleProps) {
  props.left = bounds.left;
  props.right = bounds.right;
  props.top = bounds.top;
  props.bottom = bounds.bottom;
}

function setPointProps(props: Draft<PointProps>, point: PointProps) {
  props.x = point.x;
  props.y = point.y;
}

function setSizeProps(props: Draft<SizeProps>, size: SizeProps) {
  props.height = size.height;
  props.width = size.width;
}
