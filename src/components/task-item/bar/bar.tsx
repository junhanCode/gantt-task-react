import React from "react";
import { BarDisplay } from "./bar-display";
import { OABarDisplay } from "./oa-bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";

export const Bar: React.FC<TaskItemProps> = ({
  task,
  isDateChangeable,
  onEventStart,
  isSelected,
  viewType = "default",
  enableTaskDrag = false,
  enableTaskResize = true,
  isTaskDraggable,
}) => {
  // oaTask模式使用OABarDisplay（单条形图，基于plannedStart和plannedEnd）
  if (viewType === "oaTask") {
    const plannedStart = task.plannedStart || task.start;
    const plannedEnd = task.plannedEnd || task.end;
    return (
      <g className={styles.barWrapper} tabIndex={0}>
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
          actualEnd={task.actualEnd}
          isSelected={isSelected}
          onMouseDown={e => {
            isDateChangeable && enableTaskDrag && onEventStart("move", task, e);
          }}
        />
        <g className="handleGroup">
          {isDateChangeable && enableTaskResize && (
            <g className={styles.handleGroup}>
              {/* 左侧手柄 - 调整计划开始时间 - 已禁用，不允许拉伸 */}
              {/* {(!isTaskDraggable || isTaskDraggable(task, 'start')) && (
                <BarDateHandle
                  x={task.x1 - task.handleWidth / 2}
                  y={task.y}
                  width={task.handleWidth}
                  height={task.height}
                  barCornerRadius={task.barCornerRadius}
                  onMouseDown={e => {
                    e.stopPropagation();
                    onEventStart("start", task, e);
                  }}
                />
              )} */}
              {/* 右侧手柄 - 调整计划结束时间（plannedEnd，对应deadLine计划截止时间） */}
              {/* 只有当proposer包含登录用户时，才允许拖动计划结束时间 */}
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
  }
  
  // 默认模式使用BarDisplay
  return (
    <g className={styles.barWrapper} tabIndex={0}>
      <BarDisplay
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        barCornerRadius={task.barCornerRadius}
        actualX={task.actualX1}
        actualWidth={task.actualX2 - task.actualX1}
        styles={task.styles}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && enableTaskDrag && onEventStart("move", task, e);
        }}
      />
      <g className="handleGroup">
        {isDateChangeable && enableTaskResize && (
          <g>
            {/* 实际条左侧手柄 - 调整实际开始时间 */}
            {(!isTaskDraggable || isTaskDraggable(task, 'actualStart')) && (
              <BarDateHandle
                x={task.actualX1 - task.handleWidth / 2}
                y={task.y + task.height * 0.6}
                width={task.handleWidth}
                height={task.height * 0.3}
                barCornerRadius={task.barCornerRadius}
                onMouseDown={e => {
                  e.stopPropagation();
                  onEventStart("actualStart", task, e);
                }}
              />
            )}
            {/* 实际条右侧手柄 - 调整实际结束时间 */}
            {(!isTaskDraggable || isTaskDraggable(task, 'actualEnd')) && (
              <BarDateHandle
                x={task.actualX2 - task.handleWidth / 2}
                y={task.y + task.height * 0.6}
                width={task.handleWidth}
                height={task.height * 0.3}
                barCornerRadius={task.barCornerRadius}
                onMouseDown={e => {
                  e.stopPropagation();
                  onEventStart("actualEnd", task, e);
                }}
              />
            )}
            {/* 计划条左侧手柄 - 调整计划开始时间 */}
            {(!isTaskDraggable || isTaskDraggable(task, 'start')) && (
              <BarDateHandle
                x={task.x1 - task.handleWidth / 2}
                y={task.y + task.height * 0.1}
                width={task.handleWidth}
                height={task.height * 0.3}
                barCornerRadius={task.barCornerRadius}
                onMouseDown={e => {
                  e.stopPropagation();
                  onEventStart("start", task, e);
                }}
              />
            )}
            {/* 计划条右侧手柄 - 调整计划结束时间 */}
            {(!isTaskDraggable || isTaskDraggable(task, 'end')) && (
              <BarDateHandle
                x={task.x2 - task.handleWidth / 2}
                y={task.y + task.height * 0.1}
                width={task.handleWidth}
                height={task.height * 0.3}
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
