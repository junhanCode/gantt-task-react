import React, { useRef, useEffect, useState } from "react";
import { Task, TaskStatus, StatusInfo } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import styles from "./tooltip.module.css";

export type TooltipProps = {
  task: BarTask;
  arrowIndent: number;
  rtl: boolean;
  svgContainerHeight: number;
  svgContainerWidth: number;
  svgWidth: number;
  headerHeight: number;
  taskListWidth: number;
  scrollX: number;
  scrollY: number;
  rowHeight: number;
  fontSize: string;
  fontFamily: string;
  TooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
};
export const Tooltip: React.FC<TooltipProps> = ({
  task,
  rowHeight,
  rtl,
  svgContainerHeight,
  svgContainerWidth,
  scrollX,
  scrollY,
  arrowIndent,
  fontSize,
  fontFamily,
  headerHeight,
  taskListWidth,
  TooltipContent,
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [relatedY, setRelatedY] = useState(0);
  const [relatedX, setRelatedX] = useState(0);
  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
      const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;

      let newRelatedY = task.index * rowHeight - scrollY + headerHeight;
      let newRelatedX: number;
      if (rtl) {
        newRelatedX = task.x1 - arrowIndent * 1.5 - tooltipWidth - scrollX;
        if (newRelatedX < 0) {
          newRelatedX = task.x2 + arrowIndent * 1.5 - scrollX;
        }
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        if (tooltipLeftmostPoint > svgContainerWidth) {
          newRelatedX = svgContainerWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      } else {
        newRelatedX = task.x2 + arrowIndent * 1.5 + taskListWidth - scrollX;
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        const fullChartWidth = taskListWidth + svgContainerWidth;
        if (tooltipLeftmostPoint > fullChartWidth) {
          newRelatedX =
            task.x1 +
            taskListWidth -
            arrowIndent * 1.5 -
            scrollX -
            tooltipWidth;
        }
        if (newRelatedX < taskListWidth) {
          newRelatedX = svgContainerWidth + taskListWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      }

      const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
      if (tooltipLowerPoint > svgContainerHeight - scrollY) {
        newRelatedY = svgContainerHeight - tooltipHeight;
      }
      setRelatedY(newRelatedY);
      setRelatedX(newRelatedX);
    }
  }, [
    tooltipRef,
    task,
    arrowIndent,
    scrollX,
    scrollY,
    headerHeight,
    taskListWidth,
    rowHeight,
    svgContainerHeight,
    svgContainerWidth,
    rtl,
  ]);

  return (
    <div
      ref={tooltipRef}
      className={
        relatedX
          ? styles.tooltipDetailsContainer
          : styles.tooltipDetailsContainerHidden
      }
      style={{ left: relatedX, top: relatedY }}
    >
      <TooltipContent task={task} fontSize={fontSize} fontFamily={fontFamily} />
    </div>
  );
};

export const OATooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  const formatDate = (date?: Date | string | null) => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "-";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const statusColorMap: Record<TaskStatus, string> = {
    待驗收: "#A2EF4D",
    處理中: "#879FFA",
    掛起中: "#AAAAAA",
    待確認: "#FFD700",
    已完成: "#52C41A",
    已撤銷: "#CCCCCC",
  };

  const getStatusInfo = (s?: TaskStatus | StatusInfo) => {
    if (!s) return { text: "-", color: "#AAAAAA" };
    if (typeof s === "string") {
      return { text: s, color: statusColorMap[s as TaskStatus] ?? "#AAAAAA" };
    }
    return { text: s.description || "-", color: s.color || "#AAAAAA" };
  };

  const priorityColorMap: Record<string, string> = {
    高: "#FF4D4F",
    中: "#FA8C16",
    低: "#52C41A",
  };

  const { text: statusText, color: statusColor } = getStatusInfo(task.status);
  const priorityText = task.priority ?? "-";
  const priorityColor = priorityColorMap[priorityText] ?? "#AAAAAA";
  const progress = task.progress ?? 0;
  const deadline = task.plannedEnd || task.end;

  return (
    <div
      className={styles.oaTooltipContainer}
      style={{ fontSize, fontFamily }}
    >
      <div className={styles.oaTooltipTitle}>{task.name}</div>

      <div className={styles.oaTooltipDivider} />

      <div className={styles.oaTooltipRow}>
        <span className={styles.oaTooltipLabel}>狀態</span>
        <span className={styles.oaTooltipValue}>
          <span
            className={styles.oaTooltipBadge}
            style={{ backgroundColor: statusColor + "33", color: statusColor, borderColor: statusColor + "88" }}
          >
            {statusText}
          </span>
        </span>
      </div>

      <div className={styles.oaTooltipRow}>
        <span className={styles.oaTooltipLabel}>優先級</span>
        <span className={styles.oaTooltipValue}>
          <span
            className={styles.oaTooltipBadge}
            style={{ backgroundColor: priorityColor + "22", color: priorityColor, borderColor: priorityColor + "66" }}
          >
            {priorityText}
          </span>
        </span>
      </div>

      <div className={styles.oaTooltipRow}>
        <span className={styles.oaTooltipLabel}>創建時間</span>
        <span className={styles.oaTooltipValue}>{formatDate(task.createdAt)}</span>
      </div>

      <div className={styles.oaTooltipRow}>
        <span className={styles.oaTooltipLabel}>截止日期</span>
        <span className={styles.oaTooltipValue}>{formatDate(deadline)}</span>
      </div>

      <div className={styles.oaTooltipRow}>
        <span className={styles.oaTooltipLabel}>發起人</span>
        <span className={styles.oaTooltipValue}>{task.creator || "-"}</span>
      </div>

      <div className={styles.oaTooltipRow}>
        <span className={styles.oaTooltipLabel}>責任人</span>
        <span className={styles.oaTooltipValue}>{task.assignee || "-"}</span>
      </div>

      <div className={styles.oaTooltipDivider} />

      <div className={styles.oaTooltipRow}>
        <span className={styles.oaTooltipLabel}>處理進度</span>
        <span className={styles.oaTooltipValue}>{progress}%</span>
      </div>
      <div className={styles.oaTooltipProgressTrack}>
        <div
          className={styles.oaTooltipProgressBar}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export const StandardTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  const style = {
    fontSize,
    fontFamily,
  };

  // 格式化日期显示
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 计算时间跨度（天数）
  const calculateDuration = (start: Date, end: Date) => {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  // 获取计划时间
  const plannedStart = task.plannedStart || task.start;
  const plannedEnd = task.plannedEnd || task.end;
  const plannedDuration = calculateDuration(plannedStart, plannedEnd);

  // 获取实际时间
  const actualStart = task.actualStart || task.start;
  const actualEnd = task.actualEnd || task.end;
  const actualDuration = calculateDuration(actualStart, actualEnd);

  return (
    <div className={styles.tooltipDefaultContainer} style={style}>
      {/* 任务名称 */}
      <div style={{ 
        fontSize: fontSize + 6, 
        fontWeight: 'bold', 
        marginBottom: '8px',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
      }}>
        {task.name}
      </div>
      
      {/* 计划时间 */}
      <div className={styles.tooltipDefaultContainerParagraph}>
        <strong>计划时间：</strong>
        {formatDate(plannedStart)} 至 {formatDate(plannedEnd)}
        <span style={{ marginLeft: '8px', color: '#666' }}>
          ({plannedDuration} 天)
        </span>
      </div>
      
      {/* 实际时间 */}
      <div className={styles.tooltipDefaultContainerParagraph}>
        <strong>实际时间：</strong>
        {formatDate(actualStart)} 至 {formatDate(actualEnd)}
        <span style={{ marginLeft: '8px', color: '#666' }}>
          ({actualDuration} 天)
        </span>
      </div>
      
      {/* 时间跨度对比 */}
      {plannedDuration !== actualDuration && (
        <div className={styles.tooltipDefaultContainerParagraph}>
          <strong>时间差异：</strong>
          <span style={{ 
            color: actualDuration > plannedDuration ? '#ff6b6b' : '#51cf66',
            fontWeight: 'bold'
          }}>
            {actualDuration > plannedDuration ? '+' : ''}{actualDuration - plannedDuration} 天
          </span>
        </div>
      )}
    </div>
  );
};
