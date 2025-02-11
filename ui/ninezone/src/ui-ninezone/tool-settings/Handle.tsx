/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module ToolSettings
 */

import "./Handle.scss";
import classnames from "classnames";
import * as React from "react";
import { CommonProps, useRefs, useResizeObserver } from "@bentley/ui-core";
import { useDragToolSettings } from "../base/DragManager";
import { getUniqueId, NineZoneDispatchContext } from "../base/NineZone";
import { useDrag } from "../widget/TabBar";

/** Properties of [[DockedToolSettingsHandle]] component.
 * @internal
 */
export interface DockedToolSettingsHandleProps extends CommonProps {
  onResize?: (w: number) => void;
}

/** Component that displays tool settings as a bar across the top of the content view.
 * @internal
 */
export const DockedToolSettingsHandle = React.memo(function DockedToolSettingsHandle(props: DockedToolSettingsHandleProps) { // tslint:disable-line: variable-name no-shadowed-variable
  const dispatch = React.useContext(NineZoneDispatchContext);
  const resizeObserverRef = useResizeObserver<HTMLDivElement>(props.onResize);
  const newWidgetDragItemId = React.useMemo(() => getUniqueId(), []);
  const onDragStart = useDragToolSettings({ newWidgetDragItemId });
  const handleDragStart = React.useCallback((initialPointerPosition) => {
    onDragStart({
      initialPointerPosition,
    });
    dispatch({
      type: "TOOL_SETTINGS_DRAG_START",
      newFloatingWidgetId: newWidgetDragItemId,
    });
  }, [dispatch, newWidgetDragItemId, onDragStart]);
  const dragRef = useDrag(handleDragStart);
  const refs = useRefs(dragRef, resizeObserverRef);
  const className = classnames(
    "nz-toolSettings-handle",
    props.className,
  );
  return (
    <div
      className={className}
      ref={refs}
      style={props.style}
    >
      <div className="nz-row">
        <div className="nz-dot" />
        <div className="nz-dot" />
      </div>
      <div className="nz-row">
        <div className="nz-dot" />
        <div className="nz-dot" />
      </div>
      <div className="nz-row">
        <div className="nz-dot" />
        <div className="nz-dot" />
      </div>
    </div>
  );
});
