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
    <g className={styles.handleGroup}>
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
      {/* 可见的手柄指示器 - 悬浮时显示，宽度4px，样式优化 */}
      <rect
        x={x + width / 2 - 2}
        y={y + 2}
        width={4}
        height={height - 4}
        className={styles.barHandleVisible}
        fill="#4a90e2"
        ry={2}
        rx={2}
        onMouseDown={onMouseDown}
        style={{ cursor: 'ew-resize' }}
      />
      {/* 手柄中心线 - 更明显的视觉反馈 */}
      <line
        x1={x + width / 2}
        y1={y + 3}
        x2={x + width / 2}
        y2={y + height - 3}
        stroke="#fff"
        strokeWidth={1}
        className={styles.barHandleVisible}
        onMouseDown={onMouseDown}
        style={{ cursor: 'ew-resize' }}
      />
    </g>
  );
};
