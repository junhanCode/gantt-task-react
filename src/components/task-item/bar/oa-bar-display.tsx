import React from "react";
import style from "./bar.module.css";
import { TaskStatus } from "../../../types/public-types";

type OABarDisplayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  barCornerRadius: number;
  status?: TaskStatus;
  progress: number;
  plannedStart: Date;
  plannedEnd: Date;
  actualEnd?: Date;
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};

export const OABarDisplay: React.FC<OABarDisplayProps> = ({
  x,
  y,
  width,
  height,
  // @ts-expect-error - Reserved for future selected state styling
  isSelected,
  barCornerRadius,
  status,
  progress,
  plannedStart,
  plannedEnd,
  actualEnd,
  onMouseDown,
}) => {
  // 状态颜色映射
  const statusColors: Record<TaskStatus, { bg: string; progress: string; delay: string }> = {
    "待验收": {
      bg: "#A2EF4D",
      progress: "#A2EF4D",
      delay: "#A2EF4D",
    },
    "处理中": {
      bg: "#879FFA",
      progress: "#0F40F5",
      delay: "#D87882",
    },
    "挂起中": {
      bg: "#E6E6E6",
      progress: "#E6E6E6",
      delay: "#E6E6E6",
    },
  };

  // 计算延期：优先使用 actualEnd（如果任务已完成），否则使用当前时间（任务进行中）
  const now = new Date();
  const endTimeForDelay = actualEnd || now;
  const isDelayed = endTimeForDelay > plannedEnd;
  const delayDays = isDelayed 
    ? Math.ceil((endTimeForDelay.getTime() - plannedEnd.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const colors = status ? statusColors[status] : { bg: "#E6E6E6", progress: "#E6E6E6", delay: "#E6E6E6" };
  
  // 计算进度宽度
  const progressWidth = (width * progress) / 100;
  
  // 计算延期部分（从计划结束时间到目前时间）
  const delayWidth = isDelayed && status === "处理中" 
    ? Math.min(width * (delayDays / ((plannedEnd.getTime() - plannedStart.getTime()) / (1000 * 60 * 60 * 24))), width * 0.3) // 限制延期部分最大宽度
    : 0;

  if (status === "待验收") {
    // 待验收：条形图颜色为A2EF4D
    return (
      <g onMouseDown={onMouseDown}>
        <rect
          x={x}
          width={width}
          y={y}
          height={height}
          ry={barCornerRadius}
          rx={barCornerRadius}
          fill={colors.bg}
          className={style.barBackground}
        />
      </g>
    );
  } else if (status === "处理中") {
    // 处理中：条形图颜色为879FFA，从计划开始时间到计划结束时间
    // 上面有进度覆盖，颜色为0F40F5
    // 延期条形段从计划结束时间到目前时间，颜色是D87882
    return (
      <g onMouseDown={onMouseDown}>
        {/* 背景条（计划开始到计划结束） */}
        <rect
          x={x}
          width={width}
          y={y}
          height={height}
          ry={barCornerRadius}
          rx={barCornerRadius}
          fill={colors.bg}
          className={style.barBackground}
        />
        {/* 进度覆盖 */}
        {progressWidth > 0 && (
          <rect
            x={x}
            width={progressWidth}
            y={y}
            height={height}
            ry={barCornerRadius}
            rx={barCornerRadius}
            fill={colors.progress}
          />
        )}
        {/* 延期部分 */}
        {delayWidth > 0 && (
          <g>
            <rect
              x={x + width}
              width={delayWidth}
              y={y}
              height={height}
              ry={barCornerRadius}
              rx={barCornerRadius}
              fill={colors.delay}
            />
            {/* 延期文字：延期xx天，白色字体，文字水平垂直居中显示，文字超出则省略号且悬浮出现文字 */}
            {delayWidth > 30 && (
              <text
                x={x + width + delayWidth / 2}
                y={y + height / 2}
                fill="#FFFFFF"
                fontSize="12"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  pointerEvents: "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                延期{delayDays}天
              </text>
            )}
          </g>
        )}
      </g>
    );
  } else if (status === "挂起中") {
    // 挂起中：颜色E6E6E6的条形图，从计划开始时间到计划结束时间
    return (
      <g onMouseDown={onMouseDown}>
        <rect
          x={x}
          width={width}
          y={y}
          height={height}
          ry={barCornerRadius}
          rx={barCornerRadius}
          fill={colors.bg}
          className={style.barBackground}
        />
      </g>
    );
  }

  // 默认样式
  return (
    <g onMouseDown={onMouseDown}>
      <rect
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={colors.bg}
        className={style.barBackground}
      />
    </g>
  );
};
