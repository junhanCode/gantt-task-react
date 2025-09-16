import React, { useState } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

// 统一显示为 YYYY/M/D，例如 2025/8/25
const formatYmd = (date: Date) => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
};

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
  onAddTask?: (parentTaskId: string) => void;
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
  AddTaskModal,
  onEditTask,
  EditTaskModal,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    task: Task | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    task: null,
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [parentTaskId, setParentTaskId] = useState<string>("");
  const [currentEditTask, setCurrentEditTask] = useState<Task | null>(null);

  const handleContextMenu = (e: React.MouseEvent, task: Task) => {
    e.preventDefault();
    console.log("Right click detected on task:", task.name);
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      task,
    });
  };

  const handleAddClick = (taskId: string) => {
    console.log("Add task clicked for:", taskId);
    setParentTaskId(taskId);
    setAddModalOpen(true);
    setContextMenu({ visible: false, x: 0, y: 0, task: null });
  };

  const handleEditClick = (task: Task) => {
    console.log("Edit task clicked for:", task.name);
    setCurrentEditTask(task);
    setEditModalOpen(true);
    setContextMenu({ visible: false, x: 0, y: 0, task: null });
  };

  const handleAddModalConfirm = () => {
    if (onAddTask) {
      onAddTask(parentTaskId);
    }
    setAddModalOpen(false);
  };

  const handleEditModalConfirm = (taskData: Partial<Task>) => {
    if (onEditTask && currentEditTask) {
      onEditTask({ ...currentEditTask, ...taskData });
    }
    setEditModalOpen(false);
    setCurrentEditTask(null);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setCurrentEditTask(null);
  };

  // 点击其他地方关闭右键菜单
  React.useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ visible: false, x: 0, y: 0, task: null });
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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
        {tasks.map(t => {
          let expanderSymbol = "";
          if (t.hideChildren === false) {
            expanderSymbol = "▼";
          } else if (t.hideChildren === true) {
            expanderSymbol = "▶";
          }

          return (
            <div
              className={styles.taskListTableRow}
              style={{ height: rowHeight }}
              key={`${t.id}row`}
              onContextMenu={(e) => handleContextMenu(e, t)}
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
                      expanderSymbol
                        ? styles.taskListExpander
                        : styles.taskListEmptyExpander
                    }
                    onClick={() => onExpanderClick(t)}
                  >
                    {expanderSymbol}
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
          );
        })}
      </div>
      
      {/* 右键菜单 */}
      {contextMenu.visible && contextMenu.task && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
            minWidth: "120px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
            onClick={() => handleAddClick(contextMenu.task!.id)}
          >
            新增子任务
          </div>
          <div
            style={{
              padding: "8px 12px",
              cursor: "pointer",
            }}
            onClick={() => handleEditClick(contextMenu.task!)}
          >
            编辑任务
          </div>
        </div>
      )}

      {/* 自定义弹框 */}
      {AddTaskModal && addModalOpen && (
        <AddTaskModal
          isOpen={addModalOpen}
          onClose={handleAddModalClose}
          parentTaskId={parentTaskId}
          onConfirm={handleAddModalConfirm}
        />
      )}
      {EditTaskModal && editModalOpen && currentEditTask && (
        <EditTaskModal
          isOpen={editModalOpen}
          onClose={handleEditModalClose}
          task={currentEditTask}
          onConfirm={handleEditModalConfirm}
        />
      )}
    </div>
  );
};
