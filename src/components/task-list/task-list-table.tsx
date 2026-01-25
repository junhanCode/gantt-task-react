import React, { useEffect, useState } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

// 统一显示为 YYYY/M/D，例如 2025/8/25
const formatYmd = (date: Date) => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
};

// 右键菜单替代了操作图标，去除未使用图标组件

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
  nameColumnWidth?: string;
  timeColumnWidths?: {
    plannedStart?: string;
    plannedEnd?: string;
    plannedDuration?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  timeColumnLabels?: {
    plannedStart?: string;
    plannedEnd?: string;
    plannedDuration?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  operationsColumnWidth?: string;
  onAddTask?: (task: Task) => void;
  AddTaskModal?: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    parentTaskId: string;
    onConfirm: (taskData: Partial<Task>) => void;
  }>;
  onEditTask?: (task: Task) => void;
  EditTaskModal?: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    task: Task;
    onConfirm: (taskData: Partial<Task>) => void;
  }>;
  onDeleteTask?: (task: Task) => void;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  onDateChange?: (task: Task, children: Task[]) => void | boolean | Promise<void> | Promise<boolean>;
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
  fontFamily,
  fontSize,
  onExpanderClick,
  nameColumnWidth,
  timeColumnWidths,
  onAddTask,
  onEditTask,
  onDeleteTask,
  expandIcon,
  collapseIcon,
  onDateChange,
  tableStyles,
}) => {
  // 右键菜单状态
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [menuTask, setMenuTask] = useState<Task | null>(null);

  // 编辑时间跨度状态
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingDuration, setEditingDuration] = useState<string>("");

  // 计算时间跨度（天数）
  const calculateDuration = (start: Date, end: Date): number => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddClick = (task: Task) => {
    console.log("=== handleAddClick called ===");
    console.log("Add task clicked for:", task);
    console.log("onAddTask available:", !!onAddTask);
    if (onAddTask) {
      console.log("Calling onAddTask...");
      onAddTask(task);
    } else {
      console.log("onAddTask is not available!");
    }
  };

  const handleEditClick = (task: Task) => {
    console.log("Edit task clicked for:", task);
    if (onEditTask) {
      onEditTask(task);
    }
  };

  const handleDeleteClick = (task: Task) => {
    console.log("Delete task clicked for:", task);
    if (onDeleteTask) {
      onDeleteTask(task);
    }
  };

  // 打开右键菜单
  const openContextMenu = (event: React.MouseEvent, task: Task) => {
    event.preventDefault();
    setMenuTask(task);
    setMenuPos({ x: event.clientX, y: event.clientY });
    setMenuVisible(true);
  };

  // 关闭菜单
  const closeMenu = () => setMenuVisible(false);

  // 开始编辑时间跨度
  const startEditDuration = (task: Task) => {
    const duration = calculateDuration(task.plannedStart ?? task.start, task.plannedEnd ?? task.end);
    setEditingTaskId(task.id);
    setEditingDuration(duration.toString());
  };

  // 保存时间跨度修改
  const saveDuration = (task: Task) => {
    const newDuration = parseInt(editingDuration, 10);
    if (!isNaN(newDuration) && newDuration > 0 && onDateChange) {
      const plannedStart = task.plannedStart ?? task.start;
      const newPlannedEnd = new Date(plannedStart.getTime() + (newDuration * 24 * 60 * 60 * 1000));
      
      const updatedTask = {
        ...task,
        plannedEnd: newPlannedEnd,
      };
      
      onDateChange(updatedTask, []);
    }
    setEditingTaskId(null);
    setEditingDuration("");
  };

  // 取消编辑
  const cancelEditDuration = () => {
    setEditingTaskId(null);
    setEditingDuration("");
  };

  useEffect(() => {
    const onDocClick = () => setMenuVisible(false);
    const onScroll = () => setMenuVisible(false);
    document.addEventListener("click", onDocClick);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("click", onDocClick);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, []);





  return (
    <div>
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
          <col style={{ width: nameColumnWidth ?? rowWidth }} />
          <col style={{ width: timeColumnWidths?.plannedStart ?? rowWidth }} />
          <col style={{ width: timeColumnWidths?.plannedEnd ?? rowWidth }} />
          <col style={{ width: timeColumnWidths?.plannedDuration ?? "100px" }} />
          <col style={{ width: timeColumnWidths?.actualStart ?? rowWidth }} />
          <col style={{ width: timeColumnWidths?.actualEnd ?? rowWidth }} />
        </colgroup>
        <tbody>
        {tasks.map((t, index) => {
          let expanderContent: React.ReactNode = null;
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
          // if task has no children info, show nothing

          return (
            <tr 
              key={`${t.id}row`} 
              className={styles.taskListTableRow}
              onContextMenu={(e) => openContextMenu(e, t)}
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
              <td
                className={styles.taskListCell}
                style={{
                  ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
                  ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
                  ...(tableStyles?.cell || {}),
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
                  <div className={styles.taskListNameText}>{t.name}</div>
                </div>
              </td>
              <td
                className={styles.taskListCell}
                style={{
                  ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
                  ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
                  ...(tableStyles?.cell || {}),
                }}
              >
                &nbsp;{formatYmd(t.plannedStart ?? t.start)}
              </td>
              <td
                className={styles.taskListCell}
                style={{
                  ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
                  ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
                  ...(tableStyles?.cell || {}),
                }}
              >
                &nbsp;{formatYmd(t.plannedEnd ?? t.end)}
              </td>
              <td
                className={styles.taskListCell}
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
                  ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
                  ...(tableStyles?.cell || {}),
                }}
                onDoubleClick={() => startEditDuration(t)}
              >
                {editingTaskId === t.id ? (
                  <input
                    type="number"
                    min="1"
                    value={editingDuration}
                    onChange={(e) => setEditingDuration(e.target.value)}
                    onBlur={() => saveDuration(t)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveDuration(t);
                      } else if (e.key === "Escape") {
                        cancelEditDuration();
                      }
                    }}
                    autoFocus
                    style={{
                      width: "80%",
                      padding: "2px 4px",
                      textAlign: "center",
                    }}
                  />
                ) : (
                  <span>{calculateDuration(t.plannedStart ?? t.start, t.plannedEnd ?? t.end)}</span>
                )}
              </td>
              <td
                className={styles.taskListCell}
                style={{
                  ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
                  ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
                  ...(tableStyles?.cell || {}),
                }}
              >
                &nbsp;{formatYmd(t.actualStart ?? t.start)}
              </td>
              <td
                className={styles.taskListCell}
                style={{
                  ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
                  ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
                  ...(tableStyles?.cell || {}),
                }}
              >
                &nbsp;{formatYmd(t.actualEnd ?? t.end)}
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
      {/* 右键菜单 */}
      {menuVisible && menuTask && (
        <div
          className={styles.contextMenu}
          style={{ left: menuPos.x, top: menuPos.y }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            className={styles.contextMenuItem}
            onClick={() => {
              closeMenu();
              handleAddClick(menuTask);
            }}
          >
            新增子任务
          </div>
          <div
            className={styles.contextMenuItem}
            onClick={() => {
              closeMenu();
              handleEditClick(menuTask);
            }}
          >
            编辑
          </div>
          <div
            className={styles.contextMenuItem}
            onClick={() => {
              closeMenu();
              handleDeleteClick(menuTask);
            }}
          >
            删除
          </div>
        </div>
      )}
    </div>
  );
};
