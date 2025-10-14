import React from "react";
import { BarTask } from "../../types/bar-task";

type ArrowProps = {
  taskFrom: BarTask;
  taskTo: BarTask;
  rowHeight: number;
  taskHeight: number;
  arrowIndent: number;
  rtl: boolean;
};
export const Arrow: React.FC<ArrowProps> = ({
  taskFrom,
  taskTo,
  rowHeight,
  taskHeight,
  arrowIndent,
  rtl,
}) => {
  let path: string;
  let trianglePoints: string;
  if (rtl) {
    [path, trianglePoints] = drownPathAndTriangleRTL(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent
    );
  } else {
    [path, trianglePoints] = drownPathAndTriangle(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent
    );
  }

  return (
    <g className="arrow">
      <path strokeWidth="1.5" d={path} fill="none" />
      <polygon points={trianglePoints} />
    </g>
  );
};

const drownPathAndTriangle = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const taskToEndPosition = taskTo.y + taskHeight / 2;
  
  // 计算四个时间点：计划开始、计划结束、实际开始、实际结束
  const fromTimes = [
    taskFrom.x1, // 计划开始
    taskFrom.x2, // 计划结束
    taskFrom.actualX1, // 实际开始
    taskFrom.actualX2  // 实际结束
  ].filter(x => x !== undefined);
  
  const toTimes = [
    taskTo.x1, // 计划开始
    taskTo.x2, // 计划结束
    taskTo.actualX1, // 实际开始
    taskTo.actualX2  // 实际结束
  ].filter(x => x !== undefined);
  
  // 找到最早和最晚的时间
  const fromEarliest = Math.min(...fromTimes);
  const toLatest = Math.max(...toTimes);
  
  // 箭头从最早时间开始，到最晚时间结束
  const taskFromStartPosition = fromEarliest;
  const taskToEndPositionX = toLatest;
  
  const taskFromEndPosition = taskFromStartPosition + arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    taskFromEndPosition < taskToEndPositionX ? "" : `H ${taskToEndPositionX - arrowIndent}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition > taskToEndPositionX
      ? arrowIndent
      : taskToEndPositionX - taskFromStartPosition - arrowIndent;

  const path = `M ${taskFromStartPosition} ${taskFrom.y + taskHeight / 2} 
  h ${arrowIndent} 
  v ${(indexCompare * rowHeight) / 2} 
  ${taskFromHorizontalOffsetValue}
  V ${taskToEndPosition} 
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${taskToEndPositionX},${taskToEndPosition} 
  ${taskToEndPositionX - 5},${taskToEndPosition - 5} 
  ${taskToEndPositionX - 5},${taskToEndPosition + 5}`;
  return [path, trianglePoints];
};

const drownPathAndTriangleRTL = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const taskToEndPosition = taskTo.y + taskHeight / 2;
  
  // 计算四个时间点：计划开始、计划结束、实际开始、实际结束
  const fromTimes = [
    taskFrom.x1, // 计划开始
    taskFrom.x2, // 计划结束
    taskFrom.actualX1, // 实际开始
    taskFrom.actualX2  // 实际结束
  ].filter(x => x !== undefined);
  
  const toTimes = [
    taskTo.x1, // 计划开始
    taskTo.x2, // 计划结束
    taskTo.actualX1, // 实际开始
    taskTo.actualX2  // 实际结束
  ].filter(x => x !== undefined);
  
  // 找到最早和最晚的时间
  const fromEarliest = Math.min(...fromTimes);
  const toLatest = Math.max(...toTimes);
  
  // 箭头从最早时间开始，到最晚时间结束
  const taskFromStartPosition = fromEarliest;
  const taskToEndPositionX = toLatest;
  
  const taskFromEndPosition = taskFromStartPosition - arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    taskFromEndPosition > taskToEndPositionX ? "" : `H ${taskToEndPositionX + arrowIndent}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition < taskToEndPositionX
      ? -arrowIndent
      : taskToEndPositionX - taskFromStartPosition + arrowIndent;

  const path = `M ${taskFromStartPosition} ${taskFrom.y + taskHeight / 2} 
  h ${-arrowIndent} 
  v ${(indexCompare * rowHeight) / 2} 
  ${taskFromHorizontalOffsetValue}
  V ${taskToEndPosition} 
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${taskToEndPositionX},${taskToEndPosition} 
  ${taskToEndPositionX + 5},${taskToEndPosition + 5} 
  ${taskToEndPositionX + 5},${taskToEndPosition - 5}`;
  return [path, trianglePoints];
};
