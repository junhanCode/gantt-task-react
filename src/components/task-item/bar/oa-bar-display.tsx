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
  // 驗證並修正輸入參數
  const safeWidth = Math.max(0, width || 0);
  const safeProgress = Math.max(0, Math.min(100, progress || 0));
  
  // 驗證日期
  if (!plannedStart || !plannedEnd || isNaN(plannedStart.getTime()) || isNaN(plannedEnd.getTime())) {
    console.error('Invalid dates provided to OABarDisplay:', { plannedStart, plannedEnd });
    return null;
  }

  // 提取状态描述文本
  const getStatusDescription = (status?: TaskStatus | StatusInfo): TaskStatus | undefined => {
    if (!status) return undefined;
    if (typeof status === 'string') return status;
    return status.description as TaskStatus;
  };

  const statusDescription = getStatusDescription(status);

  // 狀態顏色映射
  const statusColors: Record<TaskStatus, { bg: string; progress: string; delay: string }> = {
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
    "掛起中": {
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
    "已撤銷": {
      bg: "#CCCCCC",
      progress: "#CCCCCC",
      delay: "#CCCCCC",
    },
  };

  // 計算延期：優先使用 actualEnd（如果任務已完成），否則使用當前時間（任務進行中）
  const now = new Date();
  const endTimeForDelay = actualEnd || now;
  const isDelayed = endTimeForDelay > plannedEnd;
  const delayDays = isDelayed 
    ? Math.ceil((endTimeForDelay.getTime() - plannedEnd.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // 獲取顏色配置，確保始終有默認值
  const colors = (statusDescription && statusColors[statusDescription as TaskStatus]) || { bg: "#E6E6E6", progress: "#E6E6E6", delay: "#E6E6E6" };
  
  // 對於"處理中"任務，計算實際時間段
  const plannedDuration = plannedEnd.getTime() - plannedStart.getTime();
  const effectiveActualEnd = actualEnd || now;
  
  // 計算實際結束時間在計劃時間段中的位置（相對於x的偏移）
  // 如果實際結束時間超過計劃結束時間，actualEndOffset會超過width，這是延期部分
  // 確保 actualEndOffset 不會是負數
  const actualEndOffset = plannedDuration > 0 
    ? Math.max(0, ((effectiveActualEnd.getTime() - plannedStart.getTime()) / plannedDuration) * safeWidth)
    : safeWidth;
  
  // 判斷是否延期完成
  const isDelayedCompletion = effectiveActualEnd > plannedEnd;

  if (statusDescription === "待驗收" || statusDescription === "已完成") {
    // 待驗收/已完成：條形圖顏色為A2EF4D
    return (
      <g onMouseDown={onMouseDown}>
        <rect
          x={x}
          width={safeWidth}
          y={y}
          height={height}
          ry={barCornerRadius}
          rx={barCornerRadius}
          fill={colors.bg}
          className={style.barBackground}
        />
      </g>
    );
  } else if (statusDescription === "處理中") {
    // 對於"處理中"任務：
    // 如果延期完成：顯示計劃開始到實際結束（深藍色占比progress%，淺藍色占比100-progress%），然後實際結束到計劃結束（延期部分）
    // 如果沒有延期：顯示計劃開始到實際結束（深藍色）
    if (isDelayedCompletion) {
      // 延期完成的情況
      // 總長度 = 從計劃開始到實際結束
      const totalActualWidth = Math.max(0, actualEndOffset);
      // 深藍色部分 = progress% 的總長度
      const progressPartWidth = Math.max(0, (totalActualWidth * safeProgress) / 100);
      // 淺藍色部分 = (100 - progress)% 的總長度
      const remainingPartWidth = Math.max(0, totalActualWidth - progressPartWidth);
      // 延期部分 = 從實際結束到計劃結束
      const delayPartWidth = Math.max(0, actualEndOffset - safeWidth); // actualEndOffset > width，所以這是延期部分
      
      return (
        <g onMouseDown={onMouseDown}>
          {/* 深藍色部分（已完成部分） */}
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
          {/* 淺藍色部分（未完成部分） */}
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
          {/* 延期部分（從計劃結束到實際結束） */}
          {delayPartWidth > 0 && (
            <g>
              <rect
                x={x + safeWidth}
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
                  x={x + safeWidth + delayPartWidth / 2}
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
      // 沒有延期的情況：只顯示計劃開始到實際結束（深藍色）
      const actualWidth = Math.max(0, actualEndOffset);
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
  } else if (statusDescription === "掛起中") {
    // 掛起中：顏色E6E6E6的條形圖，從計劃開始時間到計劃結束時間
    return (
      <g onMouseDown={onMouseDown}>
        <rect
          x={x}
          width={safeWidth}
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

  // 默認樣式
  return (
    <g onMouseDown={onMouseDown}>
      <rect
        x={x}
        width={safeWidth}
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
