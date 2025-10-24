import React from "react";
import { TaskItemProps } from "../task-item";
import { BarDateHandle } from "../bar/bar-date-handle";
import styles from "./project.module.css";

export const Project: React.FC<TaskItemProps> = ({ 
  task, 
  isSelected, 
  isDateChangeable, 
  onEventStart 
}) => {
  const barColor = isSelected
    ? task.styles.backgroundSelectedColor
    : task.styles.backgroundColor;
  const processColor = isSelected
    ? task.styles.progressSelectedColor
    : task.styles.progressColor;
  const actualColor = isSelected
    ? task.styles.actualSelectedColor
    : task.styles.actualColor;
  const delayColor = task.styles.delayColor;

  const projectWith = task.x2 - task.x1;
  const actualWidth = task.actualX2 - task.actualX1;

  // 计算延误部分
  const getDelayParts = () => {
    if (!task.actualX1 || !task.actualX2) return [];
    
    const plannedEnd = task.x2;
    const actualStart = task.actualX1;
    const actualEnd = task.actualX2;
    
    const delayParts = [];
    
    // 如果实际开始时间晚于计划结束时间（任务尚未开始就已延误）
    if (actualStart > plannedEnd) {
      delayParts.push({
        x: plannedEnd,
        width: actualStart - plannedEnd,
        isDelay: true
      });
    }
    
    // 如果实际结束时间晚于计划结束时间（任务耗时比计划长）
    if (actualEnd > plannedEnd && actualStart <= plannedEnd) {
      delayParts.push({
        x: Math.max(actualStart, plannedEnd),
        width: actualEnd - Math.max(actualStart, plannedEnd),
        isDelay: true
      });
    }
    
    return delayParts;
  };

  const delayParts = getDelayParts();
  const barHeight = task.height * 0.4; // 计划条高度
  const actualBarHeight = task.height * 0.4; // 实际条高度
  const barSpacing = task.height * 0.1; // 条形图间距
  const plannedBarY = task.y + barSpacing;
  const actualBarY = task.y + barHeight + barSpacing * 2;

  const projectLeftTriangle = [
    task.x1,
    task.y + task.height / 2 - 1,
    task.x1,
    task.y + task.height,
    task.x1 + 15,
    task.y + task.height / 2 - 1,
  ].join(",");
  const projectRightTriangle = [
    task.x2,
    task.y + task.height / 2 - 1,
    task.x2,
    task.y + task.height,
    task.x2 - 15,
    task.y + task.height / 2 - 1,
  ].join(",");

  return (
    <g tabIndex={0} className={styles.projectWrapper}>
      {/* 计划条（背景条） */}
      <rect
        fill={barColor}
        x={task.x1}
        width={projectWith}
        y={plannedBarY}
        height={barHeight}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        className={styles.projectBackground}
      />
      
      {/* 计划进度条 */}
      <rect
        x={task.progressX}
        width={task.progressWidth}
        y={plannedBarY}
        height={barHeight}
        ry={task.barCornerRadius}
        rx={task.barCornerRadius}
        fill={processColor}
      />
      
      {/* 实际条 */}
      {task.actualX1 !== undefined && task.actualX2 !== undefined && (
        <g>
          <rect
            x={task.actualX1}
            width={actualWidth}
            y={actualBarY}
            height={actualBarHeight}
            ry={task.barCornerRadius}
            rx={task.barCornerRadius}
            fill={actualColor}
          />
          
          {/* 延误部分标记为橙色 */}
          {delayParts.map((part, index) => (
            <rect
              key={index}
              x={part.x}
              width={part.width}
              y={actualBarY}
              height={actualBarHeight}
              ry={task.barCornerRadius}
              rx={task.barCornerRadius}
              fill={delayColor}
            />
          ))}
        </g>
      )}

      {/* 项目顶部装饰 */}
      <rect
        fill={barColor}
        x={task.x1}
        width={projectWith}
        y={task.y}
        height={task.height / 2}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        className={styles.projectTop}
      />
      <polygon
        className={styles.projectTop}
        points={projectLeftTriangle}
        fill={barColor}
      />
      <polygon
        className={styles.projectTop}
        points={projectRightTriangle}
        fill={barColor}
      />

      {/* 拖拽手柄 */}
      {isDateChangeable && (
        <g className="handleGroup">
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
    </g>
  );
};
