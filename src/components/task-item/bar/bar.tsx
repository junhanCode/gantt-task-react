import React from "react";
import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";

export const Bar: React.FC<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  rtl,
  onEventStart,
  isSelected,
}) => {
  const progressPoint = getProgressPoint(
    +!rtl * task.progressWidth + task.progressX,
    task.y,
    task.height
  );
  return (
    <g className={styles.barWrapper} tabIndex={0}>
      <BarDisplay
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        progressX={task.progressX}
        progressWidth={task.progressWidth}
        barCornerRadius={task.barCornerRadius}
        actualX={task.actualX1}
        actualWidth={task.actualX2 - task.actualX1}
        styles={task.styles}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
      <g className="handleGroup">
        {isDateChangeable && (
          <g>
            {/* 实际条左侧手柄 - 调整实际开始时间 */}
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
            {/* 实际条右侧手柄 - 调整实际结束时间 */}
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
            {/* 计划条左侧手柄 - 调整计划开始时间 */}
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
            {/* 计划条右侧手柄 - 调整计划结束时间 */}
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
          </g>
        )}
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              onEventStart("progress", task, e);
            }}
          />
        )}
      </g>
    </g>
  );
};
