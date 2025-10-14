import React from "react";
import style from "./bar.module.css";

type BarDisplayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  /* progress start point */
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  /* actual bar properties */
  actualX?: number;
  actualWidth?: number;
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
    actualColor: string;
    actualSelectedColor: string;
    delayColor: string;
  };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
export const BarDisplay: React.FC<BarDisplayProps> = ({
  x,
  y,
  width,
  height,
  isSelected,
  progressX,
  progressWidth,
  barCornerRadius,
  actualX,
  actualWidth,
  styles,
  onMouseDown,
}) => {
  const getProcessColor = () => {
    return isSelected ? styles.progressSelectedColor : styles.progressColor;
  };

  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  const getActualColor = () => {
    return isSelected ? styles.actualSelectedColor : styles.actualColor;
  };

  // 计算延误部分
  const getDelayParts = () => {
    if (!actualX || !actualWidth) return [];
    
    const plannedEnd = x + width;
    const actualStart = actualX;
    const actualEnd = actualX + actualWidth;
    
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
  const barHeight = height * 0.4; // 计划条高度
  const actualBarHeight = height * 0.4; // 实际条高度
  const barSpacing = height * 0.1; // 条形图间距
  const plannedBarY = y + barSpacing;
  const actualBarY = y + barHeight + barSpacing * 2;

  return (
    <g onMouseDown={onMouseDown}>
      {/* 计划条（背景条） */}
      <rect
        x={x}
        width={width}
        y={plannedBarY}
        height={barHeight}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getBarColor()}
        className={style.barBackground}
      />
      
      {/* 进度条（在计划条上） */}
      <rect
        x={progressX}
        width={progressWidth}
        y={plannedBarY}
        height={barHeight}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getProcessColor()}
      />
      
      {/* 实际条 */}
      {actualX !== undefined && actualWidth !== undefined && (
        <g>
          <rect
            x={actualX}
            width={actualWidth}
            y={actualBarY}
            height={actualBarHeight}
            ry={barCornerRadius}
            rx={barCornerRadius}
            fill={getActualColor()}
          />
          
          {/* 延误部分标记为橙色 */}
          {delayParts.map((part, index) => (
            <rect
              key={index}
              x={part.x}
              width={part.width}
              y={actualBarY}
              height={actualBarHeight}
              ry={barCornerRadius}
              rx={barCornerRadius}
              fill={styles.delayColor}
            />
          ))}
        </g>
      )}
    </g>
  );
};
