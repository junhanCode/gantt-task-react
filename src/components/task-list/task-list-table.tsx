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

// 加号图标组件
const AddIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <svg
    className={styles.addIcon}
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    onClick={onClick}
  >
    <path
      d="M512 909.061224c-218.906122 0-397.061224-178.155102-397.061224-397.061224s178.155102-397.061224 397.061224-397.061224 397.061224 178.155102 397.061224 397.061224-178.155102 397.061224-397.061224 397.061224z"
      fill="#16C4AF"
    />
    <path
      d="M660.897959 531.853061h-297.795918c-10.971429 0-19.853061-8.881633-19.853061-19.853061s8.881633-19.853061 19.853061-19.853061h297.795918c10.971429 0 19.853061 8.881633 19.853061 19.853061s-8.881633 19.853061-19.853061 19.853061z"
      fill="#DCFFFA"
    />
    <path
      d="M512 680.75102c-10.971429 0-19.853061-8.881633-19.853061-19.853061v-297.795918c0-10.971429 8.881633-19.853061 19.853061-19.853061s19.853061 8.881633 19.853061 19.853061v297.795918c0 10.971429-8.881633 19.853061-19.853061 19.853061z"
      fill="#DCFFFA"
    />
  </svg>
);

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
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [parentTaskId, setParentTaskId] = useState<string>("");
  const [currentEditTask, setCurrentEditTask] = useState<Task | null>(null);

  const handleAddClick = (taskId: string) => {
    console.log("Add task clicked for:", taskId);
    setParentTaskId(taskId);
    setAddModalOpen(true);
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
          let expanderSymbol = "";
          if (t.hideChildren === false) {
            expanderSymbol = "▼";
          } else if (t.hideChildren === true) {
            expanderSymbol = "▶";
          }

          return (
            <div key={`${t.id}row`}>
              <div
                className={styles.taskListTableRow}
                style={{ height: rowHeight }}
                onMouseEnter={() => setHoveredTaskId(t.id)}
                onMouseLeave={() => setHoveredTaskId(null)}
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
              
              {/* 悬浮时显示的加号图标 */}
              {hoveredTaskId === t.id && (
                <div 
                  className={styles.addIconContainer}
                  onMouseEnter={() => setHoveredTaskId(t.id)} // 鼠标进入图标时保持显示
                  onMouseLeave={() => setHoveredTaskId(null)} // 鼠标离开图标时隐藏
                >
                  <AddIcon onClick={() => handleAddClick(t.id)} />
                </div>
              )}
            </div>
          );
        })}
      </div>

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
