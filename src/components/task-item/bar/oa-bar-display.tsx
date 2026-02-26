import React from "react";
import style from "./bar.module.css";
import { TaskStatus, StatusInfo } from "../../../types/public-types";

type OABarDisplayProps = {
  x: number;
  y: number;
  /** createDate → deadLine 的像素宽度 */
  width: number;
  height: number;
  isSelected: boolean;
  barCornerRadius: number;
  status?: TaskStatus | StatusInfo;
  progress: number;
  /** createDate */
  plannedStart: Date;
  /** deadLine */
  plannedEnd: Date;
  actualStart?: Date;
  /** finishDate，为空表示尚未完成 */
  actualEnd?: Date;
  /** finishDate（或延期到今日）的像素 x 坐标，由 bar-helper 通过 taskXCoordinate 计算 */
  actualEndX: number;
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  delayDaysFormat?: (days: number) => string;
};

const DELAY_COLOR = "#FF4D4F";
const DAY_MS = 1000 * 60 * 60 * 24;

/**
 * OA 任务条形图。
 *
 * 未延期（finishDate <= deadLine）：
 *   createDate ═══ finishDate ─── deadLine
 *   [  实色(已完成)  |  浅色(剩余)  ]
 *
 * 延期（finishDate > deadLine，或无 finishDate 且今日 > deadLine）：
 *   createDate ═══ deadLine ████ finishDate / 今日
 *   [  状态色(正常)  | 红色(延期)  ]
 *
 * 进行中未超期（无 finishDate 且今日 <= deadLine）：
 *   createDate ═══════════════ deadLine
 *   [         状态色(整条)         ]
 */
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
  actualEndX,
  onMouseDown,
  delayDaysFormat,
}) => {
  const safeWidth = Math.max(0, width || 0);

  if (
    !plannedStart ||
    !plannedEnd ||
    isNaN(plannedStart.getTime()) ||
    isNaN(plannedEnd.getTime())
  ) {
    return null;
  }

  const getStatusDescription = (
    s?: TaskStatus | StatusInfo
  ): TaskStatus | undefined => {
    if (!s) return undefined;
    if (typeof s === "string") return s;
    return s.description as TaskStatus;
  };

  const statusDescription = getStatusDescription(status);

  const statusColors: Record<TaskStatus, string> = {
    待驗收: "#A2EF4D",
    處理中: "#879FFA",
    掛起中: "#E6E6E6",
    待確認: "#FFD700",
    已完成: "#A2EF4D",
    已撤銷: "#CCCCCC",
  };

  const baseColor =
    (statusDescription && statusColors[statusDescription as TaskStatus]) ||
    "#E6E6E6";

  const now = new Date();
  const deadLineMs = plannedEnd.getTime();
  const finishDateMs = actualEnd ? actualEnd.getTime() : null;

  // 延期判定：有 finishDate → finishDate > deadLine；无 finishDate → 今日 > deadLine
  const isDelayed =
    finishDateMs !== null
      ? finishDateMs > deadLineMs
      : now.getTime() > deadLineMs;

  // actualEndX 是 finishDate（或今日）在甘特图中的精确像素位置（由 bar-helper 用 taskXCoordinate 计算）
  // x 是 createDate 的像素位置，x + safeWidth 是 deadLine 的像素位置

  // ── 未延期 ──────────────────────────────────────────────────────────
  if (!isDelayed) {
    if (actualEnd) {
      // finishDate 在 deadLine 之前：已完成段 + 剩余段
      const completedWidth = Math.max(0, Math.min(safeWidth, actualEndX - x));
      const remainingWidth = safeWidth - completedWidth;

      return (
        <g onMouseDown={onMouseDown}>
          {completedWidth > 0 && (
            <rect
              x={x}
              y={y}
              width={completedWidth}
              height={height}
              rx={barCornerRadius}
              ry={barCornerRadius}
              fill={baseColor}
              className={style.barBackground}
            />
          )}
          {remainingWidth > 0 && (
            <rect
              x={x + completedWidth}
              y={y}
              width={remainingWidth}
              height={height}
              rx={barCornerRadius}
              ry={barCornerRadius}
              fill={baseColor}
              opacity={0.35}
            />
          )}
        </g>
      );
    }

    // 进行中且未超期：整条状态色
    return (
      <g onMouseDown={onMouseDown}>
        <rect
          x={x}
          y={y}
          width={safeWidth}
          height={height}
          rx={barCornerRadius}
          ry={barCornerRadius}
          fill={baseColor}
          className={style.barBackground}
        />
      </g>
    );
  }

  // ── 延期 ────────────────────────────────────────────────────────────
  // 延期段像素宽度 = actualEndX（finishDate/今日位置）- (x + safeWidth)（deadLine 位置）
  const delayWidth = Math.max(0, actualEndX - (x + safeWidth));

  const effectiveEnd = actualEnd || now;
  const delayDays = Math.ceil(
    (effectiveEnd.getTime() - deadLineMs) / DAY_MS
  );
  const delayLabel = delayDaysFormat
    ? delayDaysFormat(delayDays)
    : `延期${delayDays}天`;

  return (
    <g onMouseDown={onMouseDown}>
      {/* 正常段：createDate → deadLine */}
      <rect
        x={x}
        y={y}
        width={safeWidth}
        height={height}
        rx={barCornerRadius}
        ry={barCornerRadius}
        fill={baseColor}
        className={style.barBackground}
      />

      {/* 延期段：deadLine → finishDate / 今日 */}
      {delayWidth > 0 && (
        <g>
          <rect
            x={x + safeWidth}
            y={y}
            width={delayWidth}
            height={height}
            rx={barCornerRadius}
            ry={barCornerRadius}
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
