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
    actualStart?: string;
    actualEnd?: string;
  };
  timeColumnLabels?: {
    plannedStart?: string;
    plannedEnd?: string;
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
}) => {
  // 右键菜单状态
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [menuTask, setMenuTask] = useState<Task | null>(null);

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
      <div
        className={styles.taskListWrapper}
        style={{
          fontFamily: fontFamily,
          fontSize: fontSize,
        }}
      >
        {tasks.map((t) => {
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
            <div key={`${t.id}row`} onContextMenu={(e) => openContextMenu(e, t)}>
              <div
                className={styles.taskListTableRow}
                style={{ height: rowHeight }}
              >
                <div
                  className={styles.taskListCell}
                  style={{
                    minWidth: nameColumnWidth ?? rowWidth,
                    maxWidth: nameColumnWidth ?? rowWidth,
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
                <div
                  className={styles.taskListCell}
                  style={{
                    minWidth: timeColumnWidths?.plannedStart ?? rowWidth,
                    maxWidth: timeColumnWidths?.plannedStart ?? rowWidth,
                  }}
                >
                  &nbsp;{formatYmd(t.plannedStart ?? t.start)}
                </div>
                <div
                  className={styles.taskListCell}
                  style={{
                    minWidth: timeColumnWidths?.plannedEnd ?? rowWidth,
                    maxWidth: timeColumnWidths?.plannedEnd ?? rowWidth,
                  }}
                >
                  &nbsp;{formatYmd(t.plannedEnd ?? t.end)}
                </div>
                <div
                  className={styles.taskListCell}
                  style={{
                    minWidth: timeColumnWidths?.actualStart ?? rowWidth,
                    maxWidth: timeColumnWidths?.actualStart ?? rowWidth,
                  }}
                >
                  &nbsp;{formatYmd(t.actualStart ?? t.start)}
                </div>
                <div
                  className={styles.taskListCell}
                  style={{
                    minWidth: timeColumnWidths?.actualEnd ?? rowWidth,
                    maxWidth: timeColumnWidths?.actualEnd ?? rowWidth,
                  }}
                >
                  &nbsp;{formatYmd(t.actualEnd ?? t.end)}
                </div>
              </div>
            </div>
          );
        })}
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
    </div>
  );
};
