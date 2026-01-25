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
  allTasks?: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  /** 是否展开所有叶子任务 */
  expandAllLeafTasks?: boolean;
  onToggleExpandAll?: () => void;
  operationsColumnWidth?: string;
  showOperationsColumn?: boolean;
  columnRenderers?: Partial<{
    name: (task: Task, meta: { value: string; displayValue: string; isOverflow: boolean; maxLength: number }) => React.ReactNode;
    status: (task: Task, meta: { value?: string; displayValue: string; isOverflow: boolean; maxLength: number }) => React.ReactNode;
    assignee: (task: Task, meta: { value?: string; displayValue: string; isOverflow: boolean; maxLength: number }) => React.ReactNode;
    operations: (task: Task) => React.ReactNode;
  }>;
  columnEllipsisMaxChars?: Partial<Record<"name" | "status" | "assignee", number>>;
  onCellOverflow?: (info: { column: "name" | "status" | "assignee"; task: Task }) => void;
  onAddTask?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  tableStyles?: {
    height?: number | string;
    container?: React.CSSProperties;
    row?: React.CSSProperties | ((rowIndex: number) => React.CSSProperties);
    cell?: React.CSSProperties;
    header?: React.CSSProperties;
    headerCell?: React.CSSProperties;
    borderColor?: string;
    rowBackgroundColor?: string;
    rowEvenBackgroundColor?: string;
    cellPadding?: string;
    headerBackgroundColor?: string;
    headerTextColor?: string;
  };
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  allTasks,
  fontFamily,
  fontSize,
  onExpanderClick,
  expandIcon,
  collapseIcon,
  // @ts-expect-error - Reserved for future expandAllLeafTasks feature
  expandAllLeafTasks = true,
  // @ts-expect-error - Reserved for future onToggleExpandAll feature
  onToggleExpandAll,
  operationsColumnWidth,
  showOperationsColumn = true,
  columnRenderers,
  columnEllipsisMaxChars,
  onCellOverflow,
  onAddTask,
  onEditTask,
  onDeleteTask,
  tableStyles,
}) => {
  // 狀態顏色映射
  const statusColors: Record<string, string> = {
    "待驗收": "#A2EF4D",
    "處理中": "#0F40F5",
    "掛起中": "#E6E6E6",
  };

  // 判斷任務是否有子任務
  const hasChildren = (task: Task): boolean => {
    // 優先使用 barChildren（來自內部計算的依賴關係），不受折疊影響
    const anyTask = task as any;
    if (Array.isArray(anyTask.barChildren) && anyTask.barChildren.length > 0) {
      return true;
    }
    // 兜底：根據 project 字段判斷，使用原始的 allTasks 列表（包含被隱藏的任務）
    const taskList = allTasks || tasks;
    return taskList.some(t => t.project === task.id);
  };

  const getEllipsisData = (column: "name" | "status" | "assignee", rawValue?: string | any) => {
    // 处理 status 可能是 StatusInfo 对象的情况
    let value = "";
    if (typeof rawValue === "string") {
      value = rawValue;
    } else if (rawValue && typeof rawValue === "object" && "description" in rawValue) {
      value = rawValue.description || "";
    } else {
      value = rawValue ?? "";
    }
    
    const max =
      columnEllipsisMaxChars?.[column] ??
      (column === "name" ? 20 : column === "status" ? 8 : 12);
    const isOverflow = value.length > max;
    const displayValue = isOverflow
      ? `${value.slice(0, Math.max(1, max - 1))}…`
      : value;
    // 溢出時通知調用方
    // 具體任務在調用方外層循環裡傳入
    return { value, displayValue, isOverflow, maxLength: max };
  };


  return (
    <table
      className={styles.taskListTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        ...(tableStyles?.borderColor ? {
          borderColor: tableStyles.borderColor,
        } : {}),
        ...(tableStyles?.container || {}),
      }}
    >
      <colgroup>
        <col style={{ width: rowWidth }} />
        <col style={{ width: "100px" }} />
        <col style={{ width: "100px" }} />
        {showOperationsColumn && <col style={{ width: operationsColumnWidth ?? "120px" }} />}
      </colgroup>
      <tbody>
      {tasks.map((t, index) => {
        const hasChild = hasChildren(t);
        const isCollapsed = t.hideChildren ?? false;
        let expanderContent: React.ReactNode = null;
        
        if (hasChild) {
          expanderContent = isCollapsed
            ? (expandIcon ?? <span style={{ fontSize: 12 }}>+</span>)
            : (collapseIcon ?? <span style={{ fontSize: 12 }}>−</span>);
        }

        return (
          <tr 
            key={`${t.id}row`}
            className={styles.taskListTableRow}
            style={{
              height: rowHeight,
              ...(tableStyles?.rowBackgroundColor && index % 2 === 0
                ? { backgroundColor: tableStyles.rowBackgroundColor }
                : {}),
              ...(tableStyles?.rowEvenBackgroundColor && index % 2 === 1
                ? { backgroundColor: tableStyles.rowEvenBackgroundColor }
                : {}),
              ...(typeof tableStyles?.row === 'function'
                ? tableStyles.row(index)
                : tableStyles?.row || {}),
            }}
          >
            {/* 任務標題列 */}
            {(() => {
              const meta = getEllipsisData("name", t.name);
              if (meta.isOverflow && onCellOverflow) {
                onCellOverflow({ column: "name", task: t });
              }
              const content = columnRenderers?.name
                ? columnRenderers.name(t, meta)
                : (
                  <span
                    title={meta.isOverflow ? t.name : undefined}
                    style={{ display: "inline-block", maxWidth: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {meta.displayValue}
                  </span>
                );
              return (
                <td
                  className={styles.taskListCell}
                  style={{
                    ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
                    ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
                    ...(tableStyles?.cell || {}),
                  }}
                  title={meta.isOverflow ? t.name : undefined}
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
                    <div className={styles.taskListNameText}>{content}</div>
                  </div>
                </td>
              );
            })()}
            
            {/* 狀態列 */}
            {(() => {
                const meta = getEllipsisData("status", t.status);
                if (meta.isOverflow && onCellOverflow) {
                  onCellOverflow({ column: "status", task: t });
                }
                // 獲取狀態的字符串表示和顏色
                const statusText = typeof t.status === "string" 
                  ? t.status 
                  : t.status && typeof t.status === "object" 
                    ? t.status.description 
                    : "";
                const statusColor = typeof t.status === "string"
                  ? statusColors[t.status] || "#E6E6E6"
                  : t.status && typeof t.status === "object" && t.status.color
                    ? t.status.color
                    : "#E6E6E6";
                    
                const defaultNode = statusText && (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      backgroundColor: statusColor,
                      color: statusText === "掛起中" ? "#666" : "#000",
                      fontSize: "12px",
                      maxWidth: "100%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={meta.isOverflow ? statusText : undefined}
                  >
                    {meta.displayValue}
                  </span>
                );
              const content = columnRenderers?.status
                ? columnRenderers.status(t, meta)
                : defaultNode;
              return (
                <td
                  className={styles.taskListCell}
                  style={{
                    textAlign: "center",
                    ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
                    ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
                    ...(tableStyles?.cell || {}),
                  }}
                >
                  {content}
                </td>
              );
            })()}
            
            {/* 負責人列 */}
            {(() => {
                const meta = getEllipsisData("assignee", t.assignee || "-");
                if (meta.isOverflow && onCellOverflow) {
                  onCellOverflow({ column: "assignee", task: t });
                }
              const content = columnRenderers?.assignee
                ? columnRenderers.assignee(t, meta)
                : (
                  <span
                    style={{ display: "inline-block", maxWidth: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                    title={meta.isOverflow ? meta.value : undefined}
                  >
                    {meta.displayValue || "-"}
                  </span>
                );
              return (
                <td
                  className={styles.taskListCell}
                  style={{
                    textAlign: "center",
                    ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
                    ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
                    ...(tableStyles?.cell || {}),
                  }}
                >
                  {content}
                </td>
              );
            })()}
            
            {/* 操作列 */}
            {showOperationsColumn && (
              <td
                className={styles.taskListCell}
                style={{
                  textAlign: "center",
                  ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
                  ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
                  ...(tableStyles?.cell || {}),
                }}
              >
                {columnRenderers?.operations ? (
                  columnRenderers.operations(t)
                ) : (
                  <div className={styles.operationsContainer}>
                    {onAddTask && (
                      <span
                        className={styles.addIcon}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddTask(t);
                        }}
                        title="新增子任務"
                      >
                        +
                      </span>
                    )}
                    {onEditTask && (
                      <span
                        className={styles.actionIcon}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(t);
                        }}
                        title="編輯"
                      >
                        ✎
                      </span>
                    )}
                    {onDeleteTask && (
                      <span
                        className={styles.actionIcon}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(t);
                        }}
                        title="刪除"
                      >
                        ×
                      </span>
                    )}
                  </div>
                )}
              </td>
            )}
          </tr>
        );
      })}
      </tbody>
    </table>
  );
};
