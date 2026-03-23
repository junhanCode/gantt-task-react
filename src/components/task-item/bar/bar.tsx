import React from "react";
import { OABarDisplay } from "./oa-bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { TaskItemProps } from "../task-item";
import { TaskBarColorResult } from "../../../types/public-types";
import styles from "./bar.module.css";

function parseTaskBarColorResult(
  v: TaskBarColorResult | undefined
): { color?: string; lightColor?: string } {
  if (v == null) return {};
  if (typeof v === "object") {
    const c = v.color != null && String(v.color).trim() !== "" ? String(v.color).trim() : undefined;
    const l =
      v.lightColor != null && String(v.lightColor).trim() !== ""
        ? String(v.lightColor).trim()
        : undefined;
    return { color: c, lightColor: l };
  }
  if (typeof v === "string" && v.trim() !== "") return { color: v.trim() };
  return {};
}

export const Bar: React.FC<TaskItemProps> = ({
  task,
  isDateChangeable,
  onEventStart,
  isSelected,
  enableTaskDrag = false,
  enableTaskResize = true,
  isTaskDraggable,
  getTaskBarColor,
}) => {
  // 无明确计划起止则不画条（仍保留左侧表格行）
  if (task.plannedStart == null || task.plannedEnd == null) {
    return null;
  }

  const plannedStart = task.plannedStart || task.start;
  const plannedEnd = task.plannedEnd || task.end;
  const actualStart = task.actualStart || task.start;
  const isDraggable = isDateChangeable && enableTaskDrag;
  const fromCallback = getTaskBarColor ? parseTaskBarColorResult(getTaskBarColor(task)) : {};
  const customBarColor =
    fromCallback.color ??
    (task.barColor != null && String(task.barColor).trim() !== ""
      ? String(task.barColor).trim()
      : undefined);
  const customBarLightColor =
    fromCallback.lightColor ??
    (task.barLightColor != null && String(task.barLightColor).trim() !== ""
      ? String(task.barLightColor).trim()
      : undefined);
  const useDatesOnlyHandles = !!task.timelineUsesDatesOnly;
  /** 纯日期四手柄：整条加少量上下外延，更好点中 */
  const handleVPad = Math.max(3, Math.min(10, Math.round(task.height * 0.22)));
  const datesOnlyHandleY = task.y - handleVPad;
  const datesOnlyHandleHeight = task.height + 2 * handleVPad;
  const hw = task.handleWidth;
  /** 实际边与计划边太近时水平错开，避免两条「半高手柄」叠在一起难拖 */
  const edgeSep = Math.max(hw, 14);
  let actualStartHandleX = task.actualX1;
  let actualEndHandleX = task.actualX2;
  if (useDatesOnlyHandles) {
    if (Math.abs(actualStartHandleX - task.x1) < edgeSep) {
      actualStartHandleX = task.x1 + edgeSep;
    }
    if (Math.abs(actualEndHandleX - task.x2) < edgeSep) {
      actualEndHandleX = task.x2 - edgeSep;
    }
    if (actualStartHandleX > actualEndHandleX - hw) {
      actualStartHandleX = task.actualX1;
      actualEndHandleX = task.actualX2;
    }
  }

  const canDragByAction = (
    action: "start" | "end" | "actualStart" | "actualEnd"
  ) => !isTaskDraggable || isTaskDraggable(task, action);

  return (
    <g className={`${styles.barWrapper} ${isDraggable ? styles.draggable : ''}`} tabIndex={0}>
      <OABarDisplay
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        barCornerRadius={task.barCornerRadius}
        status={task.status}
        progress={task.progress}
        plannedStart={plannedStart}
        plannedEnd={plannedEnd}
        actualStart={actualStart}
        actualEnd={task.actualEnd}
        actualEndX={task.actualX2}
        todayX={task.todayX}
        isSelected={isSelected}
        delayColor={task.styles?.delayColor}
        customBarColor={customBarColor}
        customBarLightColor={customBarLightColor}
        timelineUsesDatesOnly={task.timelineUsesDatesOnly}
        onMouseDown={e => {
          isDateChangeable && enableTaskDrag && onEventStart("move", task, e);
        }}
      />
      <g className="handleGroup">
        {isDateChangeable && enableTaskResize && (
          <g className={styles.handleGroup}>
            {!useDatesOnlyHandles && canDragByAction("end") && (
              <BarDateHandle
                x={task.x2 - task.handleWidth / 2}
                y={task.y}
                width={task.handleWidth}
                height={task.height}
                barCornerRadius={task.barCornerRadius}
                onMouseDown={e => {
                  e.stopPropagation();
                  onEventStart("end", task, e);
                }}
              />
            )}

            {useDatesOnlyHandles && canDragByAction("start") && (
              <BarDateHandle
                x={task.x1 - task.handleWidth / 2}
                y={datesOnlyHandleY}
                width={task.handleWidth}
                height={datesOnlyHandleHeight}
                barCornerRadius={task.barCornerRadius}
                onMouseDown={e => {
                  e.stopPropagation();
                  onEventStart("start", task, e);
                }}
              />
            )}
            {useDatesOnlyHandles && canDragByAction("end") && (
              <BarDateHandle
                x={task.x2 - task.handleWidth / 2}
                y={datesOnlyHandleY}
                width={task.handleWidth}
                height={datesOnlyHandleHeight}
                barCornerRadius={task.barCornerRadius}
                onMouseDown={e => {
                  e.stopPropagation();
                  onEventStart("end", task, e);
                }}
              />
            )}
            {useDatesOnlyHandles && canDragByAction("actualStart") && (
              <BarDateHandle
                x={actualStartHandleX - task.handleWidth / 2}
                y={datesOnlyHandleY}
                width={task.handleWidth}
                height={datesOnlyHandleHeight}
                barCornerRadius={task.barCornerRadius}
                onMouseDown={e => {
                  e.stopPropagation();
                  onEventStart("actualStart", task, e);
                }}
              />
            )}
            {useDatesOnlyHandles && canDragByAction("actualEnd") && (
              <BarDateHandle
                x={actualEndHandleX - task.handleWidth / 2}
                y={datesOnlyHandleY}
                width={task.handleWidth}
                height={datesOnlyHandleHeight}
                barCornerRadius={task.barCornerRadius}
                onMouseDown={e => {
                  e.stopPropagation();
                  onEventStart("actualEnd", task, e);
                }}
              />
            )}
          </g>
        )}
      </g>
    </g>
  );
};
