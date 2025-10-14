import React from "react";
import styles from "./bar.module.css";

type BarDateHandleProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  barCornerRadius: number;
  onMouseDown: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
};
export const BarDateHandle: React.FC<BarDateHandleProps> = ({
  x,
  y,
  width,
  height,
  barCornerRadius,
  onMouseDown,
}) => {
  return (
    <g>
      {/* 背景区域 - 更大的可点击区域 */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        className={styles.barHandle}
        ry={barCornerRadius}
        rx={barCornerRadius}
        onMouseDown={onMouseDown}
        fill="transparent"
        stroke="none"
        style={{ cursor: 'ew-resize' }}
      />
      {/* 可见的手柄指示器 - 更明显的视觉反馈 */}
      <rect
        x={x + width / 2 - 1.5}
        y={y + 1}
        width={3}
        height={height - 2}
        fill="#333"
        ry={1.5}
        rx={1.5}
        onMouseDown={onMouseDown}
        style={{ cursor: 'ew-resize' }}
      />
      {/* 手柄中心线 */}
      <line
        x1={x + width / 2}
        y1={y + 2}
        x2={x + width / 2}
        y2={y + height - 2}
        stroke="#fff"
        strokeWidth={1}
        onMouseDown={onMouseDown}
        style={{ cursor: 'ew-resize' }}
      />
    </g>
  );
};
