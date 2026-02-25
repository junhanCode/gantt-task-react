import React, { useEffect, useRef, useState } from "react";
import { BarTask } from "../../types/bar-task";
import { Task } from "../../types/public-types";

export type TaskListProps = {
  headerHeight: number;
  rowWidth: string;
  /** 左侧任务列表总宽度（如 "500px"），不传则根据列宽自动计算 */
  listWidth?: string;
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
    plannedDuration?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  timeColumnWidths?: {
    plannedStart?: string;
    plannedEnd?: string;
    plannedDuration?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  onAddTask?: (task: Task) => void; // Change from (parentTaskId: string) => void
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
  operationsColumnWidth?: string;
  operationsColumnLabel?: string;
  isTaskListCollapsed?: boolean;
  onToggleTaskList?: () => void;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  onDateChange?: (task: Task, children: Task[]) => void | boolean | Promise<void> | Promise<boolean>;
  /** 表格样式配置 */
  tableStyles?: {
    headerHeight?: number;
    height?: number | string;
    container?: React.CSSProperties;
    row?: React.CSSProperties | ((rowIndex: number) => React.CSSProperties);
    cell?: React.CSSProperties;
    header?: React.CSSProperties;
    headerCell?: React.CSSProperties;
    headerCellPadding?: string;
    borderColor?: string;
    rowBackgroundColor?: string;
    rowEvenBackgroundColor?: string;
    cellPadding?: string;
    headerBackgroundColor?: string;
    headerTextColor?: string;
  };
  TaskListHeader: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    /** 头部右侧预留空白（用于对齐垂直滚动条宽度） */
    headerGutterRight?: number;
    nameColumnWidth?: string;
    timeColumnLabels?: {
      plannedStart?: string;
      plannedEnd?: string;
      plannedDuration?: string;
      actualStart?: string;
      actualEnd?: string;
    };
    timeColumnWidths?: {
      plannedStart?: string;
      plannedEnd?: string;
      plannedDuration?: string;
      actualStart?: string;
      actualEnd?: string;
    };
    operationsColumnWidth?: string;
    operationsColumnLabel?: string;
    isTaskListCollapsed?: boolean;
    onToggleTaskList?: () => void;
    expandIcon?: React.ReactNode;
    collapseIcon?: React.ReactNode;
    /** 列宽拖拽回调，列 key + 新宽度(px) */
    onColumnResize?: (colKey: string, newWidthPx: number) => void;
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
    /** 虛擬滾動：當前滾動位置 */
    scrollY?: number;
    /** 虛擬滾動：可見區域高度 */
    containerHeight?: number;
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
    onAddTask?: (task: Task) => void; // 修改为接收完整的Task对象
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
    operationsColumnWidth?: string;
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
  }>;
};

/** 将 CSS 宽度字符串解析为像素数值（如 "155px" → 155） */
const parseWidthPx = (w: string | undefined, fallback: number): number => {
  if (!w) return fallback;
  const n = parseFloat(w);
  return isNaN(n) ? fallback : n;
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
  listWidth,
  nameColumnWidth,
  timeColumnLabels,
  timeColumnWidths,
  onAddTask,
  onEditTask,
  onDeleteTask,
  operationsColumnWidth,
  operationsColumnLabel,
  isTaskListCollapsed = false,
  onToggleTaskList,
  expandIcon,
  collapseIcon,
  TaskListHeader,
  TaskListTable,
  onDateChange,
  tableStyles,
}) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  // 列宽状态（由 props 初始化，之后由拖拽更新）
  const defaultPx = parseWidthPx(rowWidth, 155);
  const [colWidths, setColWidths] = useState(() => ({
    name: parseWidthPx(nameColumnWidth ?? rowWidth, defaultPx),
    plannedStart: parseWidthPx(timeColumnWidths?.plannedStart ?? rowWidth, defaultPx),
    plannedEnd: parseWidthPx(timeColumnWidths?.plannedEnd ?? rowWidth, defaultPx),
    plannedDuration: parseWidthPx(timeColumnWidths?.plannedDuration, 100),
    actualStart: parseWidthPx(timeColumnWidths?.actualStart ?? rowWidth, defaultPx),
    actualEnd: parseWidthPx(timeColumnWidths?.actualEnd ?? rowWidth, defaultPx),
    operations: parseWidthPx(operationsColumnWidth, 120),
  }));

  const handleColumnResize = (colKey: string, newWidthPx: number) => {
    setColWidths(prev => ({ ...prev, [colKey]: Math.max(50, newWidthPx) }));
  };

  const resolvedNameWidth = `${colWidths.name}px`;
  const resolvedTimeWidths = {
    plannedStart: `${colWidths.plannedStart}px`,
    plannedEnd: `${colWidths.plannedEnd}px`,
    plannedDuration: `${colWidths.plannedDuration}px`,
    actualStart: `${colWidths.actualStart}px`,
    actualEnd: `${colWidths.actualEnd}px`,
  };
  const resolvedOperationsWidth = `${colWidths.operations}px`;

  const headerProps = {
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
    headerGutterRight: (() => {
      if (!ganttHeight) return 0;
      const contentHeight = tasks.length * rowHeight;
      const needScrollbar = contentHeight > ganttHeight;
      // 近似的滚动条宽度（Windows 常见为 16px，macOS 叠加滚动条通常为 0）
      return needScrollbar ? 16 : 0;
    })(),
    nameColumnWidth: resolvedNameWidth,
    timeColumnLabels,
    timeColumnWidths: resolvedTimeWidths,
    operationsColumnWidth: resolvedOperationsWidth,
    operationsColumnLabel,
    isTaskListCollapsed,
    onToggleTaskList,
    expandIcon,
    collapseIcon,
    onColumnResize: handleColumnResize,
    tableStyles,
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
    nameColumnWidth: resolvedNameWidth,
    timeColumnWidths: resolvedTimeWidths,
    timeColumnLabels,
    operationsColumnWidth: resolvedOperationsWidth,
    onAddTask,
    onEditTask,
    onDeleteTask,
    expandIcon,
    collapseIcon,
    onDateChange,
    tableStyles,
    scrollY,
    containerHeight: ganttHeight || undefined,
  };

  return (
    <div
      ref={taskListRef}
      style={listWidth ? { width: listWidth, minWidth: listWidth } : undefined}
    >
      <TaskListHeader {...headerProps} />
      <div
        ref={horizontalContainerRef}
        className={horizontalContainerClass}
        style={{
          ...(tableStyles?.height !== undefined 
            ? { height: typeof tableStyles.height === 'number' ? `${tableStyles.height}px` : tableStyles.height }
            : ganttHeight ? { height: ganttHeight } : {}),
          display: isTaskListCollapsed ? 'none' : 'block',
          ...(tableStyles?.container || {})
        }}
      >
        <TaskListTable {...tableProps} />
      </div>
    </div>
  );
};
