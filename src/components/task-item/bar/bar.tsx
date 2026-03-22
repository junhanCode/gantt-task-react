import React from "react";
import { OABarDisplay } from "./oa-bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";

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
  const customBarColor = getTaskBarColor ? getTaskBarColor(task) : undefined;
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
        timelineUsesDatesOnly={task.timelineUsesDatesOnly}
        onMouseDown={e => {
          isDateChangeable && enableTaskDrag && onEventStart("move", task, e);
        }}
      />
      <g className="handleGroup">
        {isDateChangeable && enableTaskResize && (
          <g className={styles.handleGroup}>
            {(!isTaskDraggable || isTaskDraggable(task, 'end')) && (
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
          </g>
        )}
      </g>
    </g>
  );
};
