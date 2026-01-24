import React from "react";
import style from "./bar.module.css";
import { TaskStatus, StatusInfo } from "../../../types/public-types";

type OABarDisplayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  barCornerRadius: number;
  status?: TaskStatus | StatusInfo;
  progress: number;
  plannedStart: Date;
  plannedEnd: Date;
  actualStart?: Date;
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
  // @ts-expect-error - Reserved for future actualStart usage
  actualStart,
  actualEnd,
  onMouseDown,
}) => {
  // 提取状态描述文本
  const getStatusDescription = (status?: TaskStatus | StatusInfo): TaskStatus | undefined => {
    if (!status) return undefined;
    if (typeof status === 'string') return status;
    return status.description as TaskStatus;
  };

  const statusDescription = getStatusDescription(status);

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
    "待確認": {
      bg: "#FFD700",
      progress: "#FFD700",
      delay: "#FFD700",
    },
    "已完成": {
      bg: "#A2EF4D",
      progress: "#A2EF4D",
      delay: "#A2EF4D",
    },
    "掛起中": {
      bg: "#E6E6E6",
      progress: "#E6E6E6",
      delay: "#E6E6E6",
    },
    "待驗收": {
      bg: "#A2EF4D",
      progress: "#A2EF4D",
      delay: "#A2EF4D",
    },
    "處理中": {
      bg: "#879FFA",
      progress: "#0F40F5",
      delay: "#D87882",
    },
    "已撤销": {
      bg: "#CCCCCC",
      progress: "#CCCCCC",
      delay: "#CCCCCC",
    },
  };

  // 计算延期：优先使用 actualEnd（如果任务已完成），否则使用当前时间（任务进行中）
  const now = new Date();
  const endTimeForDelay = actualEnd || now;
  const isDelayed = endTimeForDelay > plannedEnd;
  const delayDays = isDelayed 
    ? Math.ceil((endTimeForDelay.getTime() - plannedEnd.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const colors = statusDescription ? statusColors[statusDescription] : { bg: "#E6E6E6", progress: "#E6E6E6", delay: "#E6E6E6" };
  
  // 对于"處理中"任务，计算实际时间段
  const plannedDuration = plannedEnd.getTime() - plannedStart.getTime();
  const effectiveActualEnd = actualEnd || now;
  
  // 计算实际结束时间在计划时间段中的位置（相对于x的偏移）
  // 如果实际结束时间超过计划结束时间，actualEndOffset会超过width，这是延期部分
  const actualEndOffset = plannedDuration > 0 
    ? ((effectiveActualEnd.getTime() - plannedStart.getTime()) / plannedDuration) * width
    : width;
  
  // 判断是否延期完成
  const isDelayedCompletion = effectiveActualEnd > plannedEnd;

  if (statusDescription === "待验收" || statusDescription === "待驗收" || statusDescription === "已完成") {
    // 待验收/待驗收/已完成：条形图颜色为A2EF4D
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
  } else if (statusDescription === "处理中" || statusDescription === "處理中") {
    // 对于"處理中"任务：
    // 如果延期完成：显示计划开始到实际结束（深蓝色占比progress%，浅蓝色占比100-progress%），然后实际结束到计划结束（延期部分）
    // 如果没有延期：显示计划开始到实际结束（深蓝色）
    if (isDelayedCompletion) {
      // 延期完成的情况
      // 总长度 = 从计划开始到实际结束
      const totalActualWidth = actualEndOffset;
      // 深蓝色部分 = progress% 的总长度
      const progressPartWidth = (totalActualWidth * progress) / 100;
      // 浅蓝色部分 = (100 - progress)% 的总长度
      const remainingPartWidth = totalActualWidth - progressPartWidth;
      // 延期部分 = 从实际结束到计划结束
      const delayPartWidth = actualEndOffset - width; // actualEndOffset > width，所以这是延期部分
      
      return (
        <g onMouseDown={onMouseDown}>
          {/* 深蓝色部分（已完成部分） */}
          {progressPartWidth > 0 && (
            <rect
              x={x}
              width={progressPartWidth}
              y={y}
              height={height}
              ry={barCornerRadius}
              rx={barCornerRadius}
              fill={colors.progress}
            />
          )}
          {/* 浅蓝色部分（未完成部分） */}
          {remainingPartWidth > 0 && (
            <rect
              x={x + progressPartWidth}
              width={remainingPartWidth}
              y={y}
              height={height}
              ry={barCornerRadius}
              rx={barCornerRadius}
              fill={colors.bg}
            />
          )}
          {/* 延期部分（从计划结束到实际结束） */}
          {delayPartWidth > 0 && (
            <g>
              <rect
                x={x + width}
                width={delayPartWidth}
                y={y}
                height={height}
                ry={barCornerRadius}
                rx={barCornerRadius}
                fill={colors.delay}
              />
              {/* 延期文字 */}
              {delayPartWidth > 30 && (
                <text
                  x={x + width + delayPartWidth / 2}
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
    } else {
      // 没有延期的情况：只显示计划开始到实际结束（深蓝色）
      const actualWidth = actualEndOffset;
      return (
        <g onMouseDown={onMouseDown}>
          <rect
            x={x}
            width={actualWidth}
            y={y}
            height={height}
            ry={barCornerRadius}
            rx={barCornerRadius}
            fill={colors.progress}
          />
        </g>
      );
    }
  } else if (statusDescription === "挂起中" || statusDescription === "掛起中") {
    // 挂起中/掛起中：颜色E6E6E6的条形图，从计划开始时间到计划结束时间
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
