import React from "react";
import type { Task, TaskStatus } from "gantt-task-react";
import styles from "./ConfigurableOATooltipContent.module.css";

/** 与库内 Task.status 对象形态一致（gantt-task-react 包入口未导出 StatusInfo） */
type StatusInfoLike = { description?: string; color?: string };

/** 可单独开关的 OA 风格悬浮层区块（未写明的项默认为 true） */
export type OATooltipFieldKey =
  | "title"
  | "status"
  | "priority"
  | "createdAt"
  | "deadline"
  | "actualEnd"
  | "creator"
  | "assignee"
  | "progress";

export type OATooltipFieldVisibility = Partial<Record<OATooltipFieldKey, boolean>>;

const ALL_TRUE: Record<OATooltipFieldKey, boolean> = {
  title: true,
  status: true,
  priority: true,
  createdAt: true,
  deadline: true,
  actualEnd: true,
  creator: true,
  assignee: true,
  progress: true,
};

function mergeVisibility(v: OATooltipFieldVisibility): Record<OATooltipFieldKey, boolean> {
  return { ...ALL_TRUE, ...v };
}

/**
 * 方案一：生成传入 Gantt 的 TooltipContent，按 visibility 控制各字段显隐。
 *
 * @example
 * const TooltipContent = useMemo(
 *   () => createConfigurableOATooltipContent({ priority: false, creator: false }),
 *   []
 * );
 * <Gantt TooltipContent={TooltipContent} ... />
 */
export function createConfigurableOATooltipContent(
  visibility: OATooltipFieldVisibility = {}
): React.FC<{ task: Task; fontSize: string; fontFamily: string }> {
  const v = mergeVisibility(visibility);

  return function ConfigurableOATooltipContent({
    task,
    fontSize,
    fontFamily,
  }: {
    task: Task;
    fontSize: string;
    fontFamily: string;
  }) {
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
      已撤销: "#CCCCCC",
    };

    const getStatusInfo = (s?: TaskStatus | StatusInfoLike) => {
      if (!s) return { text: "-", color: "#AAAAAA" };
      if (typeof s === "string") {
        return { text: s, color: statusColorMap[s as TaskStatus] ?? "#AAAAAA" };
      }
      const text = s.description || "-";
      const color = statusColorMap[text as TaskStatus] ?? s.color ?? "#AAAAAA";
      return { text, color };
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

    const middleAny =
      v.status ||
      v.priority ||
      v.createdAt ||
      v.deadline ||
      v.actualEnd ||
      v.creator ||
      v.assignee;

    const showDividerAfterTitle = v.title && (middleAny || v.progress);
    const showDividerBeforeProgress = v.progress && middleAny;

    return (
      <div className={styles.oaTooltipContainer} style={{ fontSize, fontFamily }}>
        {v.title && <div className={styles.oaTooltipTitle}>{task.name}</div>}

        {showDividerAfterTitle && <div className={styles.oaTooltipDivider} />}

        {v.status && (
          <div className={styles.oaTooltipRow}>
            <span className={styles.oaTooltipLabel}>狀態</span>
            <span className={styles.oaTooltipValue}>
              <span
                className={styles.oaTooltipBadge}
                style={{
                  backgroundColor: statusColor + "33",
                  color: statusColor,
                  borderColor: statusColor + "88",
                }}
              >
                {statusText}
              </span>
            </span>
          </div>
        )}

        {v.priority && (
          <div className={styles.oaTooltipRow}>
            <span className={styles.oaTooltipLabel}>優先級</span>
            <span className={styles.oaTooltipValue}>
              <span
                className={styles.oaTooltipBadge}
                style={{
                  backgroundColor: priorityColor + "22",
                  color: priorityColor,
                  borderColor: priorityColor + "66",
                }}
              >
                {priorityText}
              </span>
            </span>
          </div>
        )}

        {v.createdAt && (
          <div className={styles.oaTooltipRow}>
            <span className={styles.oaTooltipLabel}>創建時間</span>
            <span className={styles.oaTooltipValue}>{formatDate(task.createdAt)}</span>
          </div>
        )}

        {v.deadline && (
          <div className={styles.oaTooltipRow}>
            <span className={styles.oaTooltipLabel}>截止日期</span>
            <span className={styles.oaTooltipValue}>{formatDate(deadline)}</span>
          </div>
        )}

        {v.actualEnd && (
          <div className={styles.oaTooltipRow}>
            <span className={styles.oaTooltipLabel}>完成時間</span>
            <span className={styles.oaTooltipValue}>{formatDate(task.actualEnd)}</span>
          </div>
        )}

        {v.creator && (
          <div className={styles.oaTooltipRow}>
            <span className={styles.oaTooltipLabel}>發起人</span>
            <span
              className={styles.oaTooltipValueEllipsis}
              title={task.creator || undefined}
            >
              {task.creator || "-"}
            </span>
          </div>
        )}

        {v.assignee && (
          <div className={styles.oaTooltipRow}>
            <span className={styles.oaTooltipLabel}>責任人</span>
            <span
              className={styles.oaTooltipValueEllipsis}
              title={task.assignee || undefined}
            >
              {task.assignee || "-"}
            </span>
          </div>
        )}

        {showDividerBeforeProgress && <div className={styles.oaTooltipDivider} />}

        {v.progress && (
          <>
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
          </>
        )}
      </div>
    );
  };
}
