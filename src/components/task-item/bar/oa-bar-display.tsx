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
  /** 延期天数文案格式化，如 (days) => `延期${days}天` */
  delayDaysFormat?: (days: number) => string;
};

/** 延期使用统一红色 */
const DELAY_COLOR = "#FF4D4F";
const DAY_MS = 1000 * 60 * 60 * 24;

export const OABarDisplay: React.FC<OABarDisplayProps> = ({
  x,
  y,
  width,
  height,
  // @ts-expect-error - Reserved for future selected state styling
  isSelected,
  barCornerRadius,
  status,
  // @ts-expect-error - progress field reserved for future use
  progress,
  plannedStart,
  plannedEnd,
  // @ts-expect-error - actualStart reserved for future use
  actualStart,
  actualEnd,
  onMouseDown,
  delayDaysFormat,
}) => {
  const safeWidth = Math.max(0, width || 0);

  if (!plannedStart || !plannedEnd || isNaN(plannedStart.getTime()) || isNaN(plannedEnd.getTime())) {
    console.error("Invalid dates provided to OABarDisplay:", { plannedStart, plannedEnd });
    return null;
  }

  // 提取状态描述文本
  const getStatusDescription = (s?: TaskStatus | StatusInfo): TaskStatus | undefined => {
    if (!s) return undefined;
    if (typeof s === "string") return s;
    return s.description as TaskStatus;
  };

  const statusDescription = getStatusDescription(status);

  // 状态颜色映射（仅保留 bg 颜色，延期统一用红色）
  const statusColors: Record<TaskStatus, string> = {
    "待驗收": "#A2EF4D",
    "處理中": "#879FFA",
    "掛起中": "#E6E6E6",
    "待確認": "#FFD700",
    "已完成": "#A2EF4D",
    "已撤銷": "#CCCCCC",
  };

  const baseColor =
    (statusDescription && statusColors[statusDescription as TaskStatus]) || "#E6E6E6";

  // 计算延期
  // finishDate = actualEnd（已完成）或当前时间（进行中）
  const now = new Date();
  const effectiveActualEnd = actualEnd || now;
  const isDelayed = effectiveActualEnd > plannedEnd;
  const delayDays = isDelayed
    ? Math.ceil((effectiveActualEnd.getTime() - plannedEnd.getTime()) / DAY_MS)
    : 0;

  // actualEnd 相对于 plannedStart 的像素偏移量
  // 当 actualEnd > plannedEnd 时，offset > safeWidth，即超出计划区域
  const plannedDuration = plannedEnd.getTime() - plannedStart.getTime();
  const actualEndOffset =
    plannedDuration > 0
      ? Math.max(0, ((effectiveActualEnd.getTime() - plannedStart.getTime()) / plannedDuration) * safeWidth)
      : safeWidth;

  // 延期部分的像素宽度（从 plannedEnd 到 actualEnd）
  const delayWidth = isDelayed ? Math.max(0, actualEndOffset - safeWidth) : 0;

  const delayLabel = delayDaysFormat
    ? delayDaysFormat(delayDays)
    : `延期${delayDays}天`;

  return (
    <g onMouseDown={onMouseDown}>
      {/* 基础条：createDate → deadLine（计划开始 → 计划结束），本身颜色 */}
      <rect
        x={x}
        width={safeWidth}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={baseColor}
        className={style.barBackground}
      />

      {/* 延期条：deadLine → finishDate（计划结束 → 实际完成），红色 */}
      {isDelayed && delayWidth > 0 && (
        <g>
          <rect
            x={x + safeWidth}
            width={delayWidth}
            y={y}
            height={height}
            ry={barCornerRadius}
            rx={barCornerRadius}
            fill={DELAY_COLOR}
          />
          {delayWidth > 30 && (
            <text
              x={x + safeWidth + delayWidth / 2}
              y={y + height / 2}
              fill="#FFFFFF"
              fontSize="12"
              textAnchor="middle"
              dominantBaseline="central"
              style={{ pointerEvents: "none" }}
            >
              {delayLabel}
            </text>
          )}
        </g>
      )}
    </g>
  );
};
