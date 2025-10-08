import React from "react";
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

// 编辑图标组件
const EditIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <svg
    className={styles.actionIcon}
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    onClick={onClick}
  >
    <path
      d="M832 512c0-176-144-320-320-320S192 336 192 512s144 320 320 320 320-144 320-320z m-320 256c-141.4 0-256-114.6-256-256s114.6-256 256-256 256 114.6 256 256-114.6 256-256 256z"
      fill="#1890ff"
    />
    <path
      d="M512 256c-141.4 0-256 114.6-256 256s114.6 256 256 256 256-114.6 256-256-114.6-256-256-256z m0 448c-106 0-192-86-192-192s86-192 192-192 192 86 192 192-86 192-192 192z"
      fill="#1890ff"
    />
    <path
      d="M512 384c-70.7 0-128 57.3-128 128s57.3 128 128 128 128-57.3 128-128-57.3-128-128-128z m0 192c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z"
      fill="#1890ff"
    />
  </svg>
);

// 删除图标组件
const DeleteIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <svg
    className={styles.actionIcon}
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    onClick={onClick}
  >
    <path
      d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
      fill="#ff4d4f"
    />
    <path
      d="M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372z m0 680c-170.1 0-308-137.9-308-308s137.9-308 308-308 308 137.9 308 308-137.9 308-308 308z"
      fill="#ff4d4f"
    />
    <path
      d="M512 256c-141.4 0-256 114.6-256 256s114.6 256 256 256 256-114.6 256-256-114.6-256-256-256z m0 448c-106 0-192-86-192-192s86-192 192-192 192 86 192 192-86 192-192 192z"
      fill="#ff4d4f"
    />
    <path
      d="M512 320c-106 0-192 86-192 192s86 192 192 192 192-86 192-192-86-192-192-192z m0 320c-70.7 0-128-57.3-128-128s57.3-128 128-128 128 57.3 128 128-57.3 128-128 128z"
      fill="#ff4d4f"
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
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  onExpanderClick,
  nameColumnWidth,
  timeColumnWidths,
  operationsColumnWidth,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
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
                <div
                  className={styles.taskListCell}
                  style={{
                    minWidth: operationsColumnWidth ?? "120px",
                    maxWidth: operationsColumnWidth ?? "120px",
                  }}
                >
                  <div className={styles.operationsContainer}>
                    <AddIcon onClick={() => handleAddClick(t)} />
                    <EditIcon onClick={() => handleEditClick(t)} />
                    <DeleteIcon onClick={() => handleDeleteClick(t)} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
