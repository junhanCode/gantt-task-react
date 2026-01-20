import React from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

export const OATaskListTable: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  /** 是否展开所有叶子任务 */
  expandAllLeafTasks?: boolean;
  onToggleExpandAll?: () => void;
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  onExpanderClick,
  expandIcon,
  collapseIcon,
  // @ts-expect-error - Reserved for future expandAllLeafTasks feature
  expandAllLeafTasks = true,
  // @ts-expect-error - Reserved for future onToggleExpandAll feature
  onToggleExpandAll,
}) => {
  // 状态颜色映射
  const statusColors: Record<string, string> = {
    "待验收": "#A2EF4D",
    "处理中": "#0F40F5",
    "挂起中": "#E6E6E6",
  };

  // 判断任务是否有子任务
  const hasChildren = (task: Task): boolean => {
    return tasks.some(t => t.project === task.id);
  };


  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map((t) => {
        const hasChild = hasChildren(t);
        let expanderContent: React.ReactNode = null;
        
        if (hasChild) {
          if (t.hideChildren === false) {
            expanderContent = collapseIcon ?? (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="2" width="12" height="2" rx="1" />
                <rect x="2" y="7" width="12" height="2" rx="1" />
                <rect x="2" y="12" width="12" height="2" rx="1" />
              </svg>
            );
          } else if (t.hideChildren === true) {
            expanderContent = expandIcon ?? (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="2" width="4" height="4" rx="1" />
                <rect x="10" y="2" width="4" height="4" rx="1" />
                <rect x="2" y="10" width="4" height="4" rx="1" />
                <rect x="10" y="10" width="4" height="4" rx="1" />
              </svg>
            );
          }
        }

        return (
          <div key={`${t.id}row`}>
            <div
              className={styles.taskListTableRow}
              style={{ height: rowHeight }}
            >
              {/* 任务标题列 */}
              <div
                className={styles.taskListCell}
                style={{
                  minWidth: rowWidth,
                  maxWidth: rowWidth,
                }}
                title={t.name}
              >
                <div className={styles.taskListNameWrapper}>
                  <div
                    className={
                      expanderContent
                        ? styles.taskListExpander
                        : styles.taskListEmptyExpander
                    }
                    onClick={() => onExpanderClick(t)}
                  >
                    {expanderContent}
                  </div>
                  <div>{t.name}</div>
                </div>
              </div>
              
              {/* 状态列 */}
              <div
                className={styles.taskListCell}
                style={{
                  minWidth: "100px",
                  maxWidth: "100px",
                  textAlign: "center",
                }}
              >
                {t.status && (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      backgroundColor: statusColors[t.status] || "#E6E6E6",
                      color: t.status === "挂起中" ? "#666" : "#000",
                      fontSize: "12px",
                    }}
                  >
                    {t.status}
                  </span>
                )}
              </div>
              
              {/* 负责人列 */}
              <div
                className={styles.taskListCell}
                style={{
                  minWidth: "100px",
                  maxWidth: "100px",
                  textAlign: "center",
                }}
              >
                {t.assignee || "-"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
