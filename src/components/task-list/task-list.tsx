import React, { useEffect, useRef } from "react";
import { BarTask } from "../../types/bar-task";
import { Task } from "../../types/public-types";

export type TaskListProps = {
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  rowHeight: number;
  ganttHeight: number;
  scrollY: number;
  locale: string;
  tasks: Task[];
  taskListRef: React.RefObject<HTMLDivElement>;
  horizontalContainerClass?: string;
  selectedTask: BarTask | undefined;
  setSelectedTask: (task: string) => void;
  onExpanderClick: (task: Task) => void;
  // 新增：名称列宽、时间列标题与列宽（若未传则组件内部回退到 rowWidth）
  nameColumnWidth?: string;
  timeColumnLabels?: {
    plannedStart?: string;
    plannedEnd?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  timeColumnWidths?: {
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
  TaskListHeader: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    nameColumnWidth?: string;
    timeColumnLabels?: {
      plannedStart?: string;
      plannedEnd?: string;
      actualStart?: string;
      actualEnd?: string;
    };
    timeColumnWidths?: {
      plannedStart?: string;
      plannedEnd?: string;
      actualStart?: string;
      actualEnd?: string;
    };
  }>;
  TaskListTable: React.FC<{
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
  }>;
};

export const TaskList: React.FC<TaskListProps> = ({
  headerHeight,
  fontFamily,
  fontSize,
  rowWidth,
  rowHeight,
  scrollY,
  tasks,
  selectedTask,
  setSelectedTask,
  onExpanderClick,
  locale,
  ganttHeight,
  taskListRef,
  horizontalContainerClass,
  nameColumnWidth,
  timeColumnLabels,
  timeColumnWidths,
  onAddTask,
  AddTaskModal,
  onEditTask,
  EditTaskModal,
  TaskListHeader,
  TaskListTable,
}) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  const headerProps = {
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
    nameColumnWidth,
    timeColumnLabels,
    timeColumnWidths,
  };
  const selectedTaskId = selectedTask ? selectedTask.id : "";
  const tableProps = {
    rowHeight,
    rowWidth,
    fontFamily,
    fontSize,
    tasks,
    locale,
    selectedTaskId: selectedTaskId,
    setSelectedTask,
    onExpanderClick,
    nameColumnWidth,
    timeColumnWidths,
    timeColumnLabels,
    onAddTask,
    AddTaskModal,
    onEditTask,
    EditTaskModal,
  };

  return (
    <div ref={taskListRef}>
      <TaskListHeader {...headerProps} />
      <div
        ref={horizontalContainerRef}
        className={horizontalContainerClass}
        style={ganttHeight ? { height: ganttHeight } : {}}
      >
        <TaskListTable {...tableProps} />
      </div>
    </div>
  );
};
