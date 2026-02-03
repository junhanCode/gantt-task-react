import React, {
  useState,
  SyntheticEvent,
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ViewMode, GanttProps, Task, GanttRef, OATaskViewMode } from "../../types/public-types";
import { GridProps } from "../grid/grid";
import { ganttDateRange, seedDates } from "../../helpers/date-helper";
import { CalendarProps } from "../calendar/calendar";
import { TaskGanttContentProps } from "./task-gantt-content";
import { TaskListHeaderDefault } from "../task-list/task-list-header";
import { TaskListTableDefault } from "../task-list/task-list-table";
import { OATaskListHeader } from "../task-list/oa-task-list-header";
import { OATaskListTable } from "../task-list/oa-task-list-table";
import { StandardTooltipContent, Tooltip } from "../other/tooltip";
import { VerticalScroll } from "../other/vertical-scroll";
import { TaskListProps, TaskList } from "../task-list/task-list";
import { TaskGantt } from "./task-gantt";
import { BarTask } from "../../types/bar-task";
import { convertToBarTasks } from "../../helpers/bar-helper";
import { GanttEvent } from "../../types/gantt-task-actions";
import { DateSetup } from "../../types/date-setup";
import { HorizontalScroll } from "../other/horizontal-scroll";
import { removeHiddenTasks, sortTasks } from "../../helpers/other-helper";
import styles from "./gantt.module.css";

export const Gantt = forwardRef<GanttRef, GanttProps>(({ 
  tasks,
  headerHeight = 50,
  columnWidth = 60,
  listCellWidth = "155px",
  rowHeight = 50,
  ganttHeight = 0,
  viewMode = ViewMode.Day,
  preStepsCount = 1,
  locale = "en-GB",
  barFill = 60,
  barCornerRadius = 3,
  hideTaskName = true,
  barProgressColor = "#a3a3ff",
  barProgressSelectedColor = "#8282f5",
  barBackgroundColor = "#b8c2cc",
  barBackgroundSelectedColor = "#aeb8c2",
  barActualColor = "#4CAF50",
  barActualSelectedColor = "#45a049",
  barDelayColor = "#FF9800",
  projectProgressColor = "#7db59a",
  projectProgressSelectedColor = "#59a985",
  projectBackgroundColor = "#fac465",
  projectBackgroundSelectedColor = "#f7bb53",
  milestoneBackgroundColor = "#f1c453",
  milestoneBackgroundSelectedColor = "#f29e4c",
  rtl = false,
  handleWidth = 8,
  timeStep = 300000,
  arrowColor = "grey",
  fontFamily = "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue",
  fontSize = "14px",
  arrowIndent = 20,
  showArrows = true,
  showTooltip = true,
  todayColor = "rgba(252, 248, 227, 0.5)",
  viewDate,
  TooltipContent = StandardTooltipContent,
  TaskListHeader = TaskListHeaderDefault,
  TaskListTable = TaskListTableDefault,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onClick,
  onDelete,
  onSelect,
  onExpanderClick,
  onBatchExpanderClick,
  onAddTask,
  onEditTask,
  onDeleteTask,
  operationsColumnWidth,
  operationsColumnLabel,
  showOperationsColumn = true,
  expandIcon,
  collapseIcon,
  listWidth,
  nameColumnWidth,
  timeColumnLabels,
  timeColumnWidths,
  viewType = "default",
  oaTaskViewMode = "日",
  onOATaskViewModeChange,
  enableTaskDrag = false,
  enableTaskResize = true,
  onTaskDragEnd,
  onTaskDragComplete,
  // @ts-expect-error - Reserved for future column configuration feature
  columns,
  columnRenderers,
  columnEllipsisMaxChars,
  onCellOverflow,
  tableStyles,
  isTaskDraggable,
  rowSelection,
  unreadColumn,
  /** 任务标题列表头自定义渲染 */
  taskTitleHeaderRender,
}, ref) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const taskListRef = useRef<HTMLDivElement>(null);
  const ganttContainerRef = useRef<HTMLDivElement>(null);
  const [currentOATaskViewMode, setCurrentOATaskViewMode] = useState<OATaskViewMode>(oaTaskViewMode);
  // @ts-expect-error - Reserved for future fullscreen state tracking
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
    const [startDate, endDate] = ganttDateRange(tasks, viewMode, preStepsCount);
    return { viewMode, dates: seedDates(startDate, endDate, viewMode) };
  });

  // 同步外部传入的oaTaskViewMode
  useEffect(() => {
    if (viewType === "oaTask" && oaTaskViewMode !== currentOATaskViewMode) {
      setCurrentOATaskViewMode(oaTaskViewMode);
    }
  }, [oaTaskViewMode, viewType, currentOATaskViewMode]);
  const [currentViewDate, setCurrentViewDate] = useState<Date | undefined>(
    undefined
  );

  const [taskListWidth, setTaskListWidth] = useState(0);
  const [svgContainerWidth, setSvgContainerWidth] = useState(0);
  const [svgContainerHeight, setSvgContainerHeight] = useState(ganttHeight);
  const [barTasks, setBarTasks] = useState<BarTask[]>([]);
  const [ganttEvent, setGanttEvent] = useState<GanttEvent>({
    action: "",
  });
  const taskHeight = useMemo(
    () => (rowHeight * barFill) / 100,
    [rowHeight, barFill]
  );

  const [selectedTask, setSelectedTask] = useState<BarTask>();
  const [failedTask, setFailedTask] = useState<BarTask | null>(null);
  const [isTaskListCollapsed, setIsTaskListCollapsed] = useState(false);

  // 多选列状态管理
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(rowSelection?.selectedRowKeys || []);
  
  // 同步外部传入的 selectedRowKeys
  useEffect(() => {
    if (rowSelection?.selectedRowKeys) {
      setSelectedRowKeys(rowSelection.selectedRowKeys);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection?.selectedRowKeys]);

  // 获取行的 key
  const getRowKey = (task: Task): string => {
    if (!rowSelection?.rowKey) return task.id;
    if (typeof rowSelection.rowKey === 'function') {
      return rowSelection.rowKey(task);
    }
    return String(task[rowSelection.rowKey]);
  };

  // 处理多选变化
  const handleRowSelectionChange = (newSelectedKeys: string[], newSelectedRows: Task[]) => {
    setSelectedRowKeys(newSelectedKeys);
    if (rowSelection?.onChange) {
      rowSelection.onChange(newSelectedKeys, newSelectedRows);
    }
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (!rowSelection) return;
    
    const availableTasks = tasks.filter(t => {
      if (!rowSelection.getCheckboxProps) return true;
      const props = rowSelection.getCheckboxProps(t);
      return !props.disabled;
    });
    
    const newSelectedKeys = checked ? availableTasks.map(t => getRowKey(t)) : [];
    const newSelectedRows = checked ? availableTasks : [];
    
    handleRowSelectionChange(newSelectedKeys, newSelectedRows);
  };

  // 计算全选状态
  const allSelected = rowSelection ? (() => {
    const availableTasks = tasks.filter(t => {
      if (!rowSelection.getCheckboxProps) return true;
      const props = rowSelection.getCheckboxProps(t);
      return !props.disabled;
    });
    
    if (availableTasks.length === 0) return false;
    return availableTasks.every(t => selectedRowKeys.includes(getRowKey(t)));
  })() : false;

  const indeterminate = rowSelection ? (() => {
    const availableTasks = tasks.filter(t => {
      if (!rowSelection.getCheckboxProps) return true;
      const props = rowSelection.getCheckboxProps(t);
      return !props.disabled;
    });
    
    if (availableTasks.length === 0) return false;
    const selectedCount = availableTasks.filter(t => selectedRowKeys.includes(getRowKey(t))).length;
    return selectedCount > 0 && selectedCount < availableTasks.length;
  })() : false;

  const svgWidth = dateSetup.dates.length * columnWidth;
  const ganttFullHeight = barTasks.length * rowHeight;

  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(-1);
  const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false);

  // 暴露方法：滚动到指定日期、切换视图模式、全屏、导出图片
  useImperativeHandle(ref, () => ({
    scrollToDate: (date: Date, options?: { align?: "start" | "center" | "end" }) => {
      const dates = dateSetup.dates;
      if (!dates || dates.length < 2) return;
      // 找到 date 所在的刻度区间
      const idx = dates.findIndex((d, i) => date.valueOf() >= d.valueOf() && i + 1 < dates.length && date.valueOf() < dates[i + 1].valueOf());
      let x = 0;
      if (idx <= 0) {
        x = 0;
      } else if (idx >= dates.length - 1) {
        x = svgWidth;
      } else {
        const start = dates[idx].valueOf();
        const end = dates[idx + 1].valueOf();
        const ratio = (date.valueOf() - start) / (end - start);
        x = (idx + ratio) * columnWidth;
      }
      // 根据对齐方式调整 scrollX
      const visibleWidth = svgContainerWidth; // wrapper 可视宽度（去掉任务列表宽度）
      const align = options?.align || "start";
      let target = x;
      if (align === "center") {
        target = Math.max(0, x - visibleWidth / 2);
      } else if (align === "end") {
        target = Math.max(0, x - visibleWidth);
      }
      if (target > svgWidth) target = svgWidth;
      setScrollX(target);
      setIgnoreScrollEvent(true);
    },
    switchViewMode: (mode: OATaskViewMode) => {
      if (viewType === "oaTask") {
        setCurrentOATaskViewMode(mode);
        if (onOATaskViewModeChange) {
          onOATaskViewModeChange(mode);
        }
      }
    },
    enterFullscreen: () => {
      if (ganttContainerRef.current) {
        if (ganttContainerRef.current.requestFullscreen) {
          ganttContainerRef.current.requestFullscreen();
        } else if ((ganttContainerRef.current as any).webkitRequestFullscreen) {
          (ganttContainerRef.current as any).webkitRequestFullscreen();
        } else if ((ganttContainerRef.current as any).msRequestFullscreen) {
          (ganttContainerRef.current as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      }
    },
    exitFullscreen: () => {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    },
    exportImage: async (filename = "gantt-chart.png") => {
      if (!ganttContainerRef.current || !wrapperRef.current) {
        console.warn('Gantt container or wrapper ref not found');
        return;
      }
      
      try {
        // 动态导入html2canvas
        const html2canvas = (await import('html2canvas')).default;
        
        const container = ganttContainerRef.current;
        const wrapper = wrapperRef.current;
        
        // 保存当前状态
        const originalStyles: Array<{
          element: HTMLElement;
          overflow: string;
          overflowX: string;
          overflowY: string;
          height: string;
          maxHeight: string;
          minHeight: string;
        }> = [];
        
        // 临时移除所有滚动和高度限制，展开所有内容
        const allElements = container.querySelectorAll('*');
        allElements.forEach((el) => {
          const element = el as HTMLElement;
          const computedStyle = window.getComputedStyle(element);
          
          // 检查是否有滚动、固定高度或高度限制
          const hasScrollOrHeightLimit = 
            computedStyle.overflow === 'auto' ||
            computedStyle.overflow === 'scroll' ||
            computedStyle.overflow === 'hidden' ||
            computedStyle.overflowX === 'auto' ||
            computedStyle.overflowX === 'scroll' ||
            computedStyle.overflowX === 'hidden' ||
            computedStyle.overflowY === 'auto' ||
            computedStyle.overflowY === 'scroll' ||
            computedStyle.overflowY === 'hidden' ||
            (computedStyle.height && computedStyle.height !== 'auto' && !computedStyle.height.includes('%')) ||
            (computedStyle.maxHeight && computedStyle.maxHeight !== 'none');
          
          if (hasScrollOrHeightLimit) {
            // 保存原始样式
            originalStyles.push({
              element,
              overflow: element.style.overflow,
              overflowX: element.style.overflowX,
              overflowY: element.style.overflowY,
              height: element.style.height,
              maxHeight: element.style.maxHeight,
              minHeight: element.style.minHeight,
            });
            
            // 临时设置为可见和自动高度
            element.style.overflow = 'visible';
            element.style.overflowX = 'visible';
            element.style.overflowY = 'visible';
            element.style.height = 'auto';
            element.style.maxHeight = 'none';
            element.style.minHeight = '0';
          }
        });
        
        // 展开wrapper
        const wrapperOriginalStyles = {
          overflow: wrapper.style.overflow,
          overflowX: wrapper.style.overflowX,
          overflowY: wrapper.style.overflowY,
          height: wrapper.style.height,
          maxHeight: wrapper.style.maxHeight,
          minHeight: wrapper.style.minHeight,
        };
        
        wrapper.style.overflow = 'visible';
        wrapper.style.overflowX = 'visible';
        wrapper.style.overflowY = 'visible';
        wrapper.style.height = 'auto';
        wrapper.style.maxHeight = 'none';
        wrapper.style.minHeight = '0';
        
        // 等待DOM更新和重新渲染
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 使用html2canvas捕获整个容器
        const canvas = await html2canvas(container, {
          backgroundColor: '#ffffff',
          scale: 2, // 提高分辨率
          logging: false,
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: container.scrollWidth,
          windowHeight: container.scrollHeight,
        });
        
        // 恢复原始状态
        wrapper.style.overflow = wrapperOriginalStyles.overflow;
        wrapper.style.overflowX = wrapperOriginalStyles.overflowX;
        wrapper.style.overflowY = wrapperOriginalStyles.overflowY;
        wrapper.style.height = wrapperOriginalStyles.height;
        wrapper.style.maxHeight = wrapperOriginalStyles.maxHeight;
        wrapper.style.minHeight = wrapperOriginalStyles.minHeight;
        
        originalStyles.forEach(({ element, overflow, overflowX, overflowY, height, maxHeight, minHeight }) => {
          element.style.overflow = overflow;
          element.style.overflowX = overflowX;
          element.style.overflowY = overflowY;
          element.style.height = height;
          element.style.maxHeight = maxHeight;
          element.style.minHeight = minHeight;
        });
        
        // 转换为PNG并下载
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
        
      } catch (error) {
        console.error('导出图片失败:', error);
        alert('导出图片失败，请确保已安装 html2canvas 依赖');
      }
    },
  }));

  // task change events
  useEffect(() => {
    let filteredTasks: Task[];
    if (onExpanderClick) {
      filteredTasks = removeHiddenTasks(tasks);
    } else {
      filteredTasks = tasks;
    }
    filteredTasks = filteredTasks.sort(sortTasks);
    const [startDate, endDate] = ganttDateRange(
      filteredTasks,
      viewMode,
      preStepsCount
    );
    let newDates = seedDates(startDate, endDate, viewMode);
    if (rtl) {
      newDates = newDates.reverse();
      if (scrollX === -1) {
        setScrollX(newDates.length * columnWidth);
      }
    }
    setDateSetup({ dates: newDates, viewMode });
    setBarTasks(
      convertToBarTasks(
        filteredTasks,
        newDates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor,
        barActualColor,
        barActualSelectedColor,
        barDelayColor,
        projectProgressColor,
        projectProgressSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor
      )
    );
  }, [
    tasks,
    viewMode,
    preStepsCount,
    rowHeight,
    barCornerRadius,
    columnWidth,
    taskHeight,
    handleWidth,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
    barActualColor,
    barActualSelectedColor,
    barDelayColor,
    projectProgressColor,
    projectProgressSelectedColor,
    projectBackgroundColor,
    projectBackgroundSelectedColor,
    milestoneBackgroundColor,
    milestoneBackgroundSelectedColor,
    rtl,
    scrollX,
    onExpanderClick,
  ]);

  useEffect(() => {
    if (
      viewMode === dateSetup.viewMode &&
      ((viewDate && !currentViewDate) ||
        (viewDate && currentViewDate?.valueOf() !== viewDate.valueOf()))
    ) {
      const dates = dateSetup.dates;
      const index = dates.findIndex(
        (d, i) =>
          viewDate.valueOf() >= d.valueOf() &&
          i + 1 !== dates.length &&
          viewDate.valueOf() < dates[i + 1].valueOf()
      );
      if (index === -1) {
        return;
      }
      setCurrentViewDate(viewDate);
      setScrollX(columnWidth * index);
    }
  }, [
    viewDate,
    columnWidth,
    dateSetup.dates,
    dateSetup.viewMode,
    viewMode,
    currentViewDate,
    setCurrentViewDate,
  ]);

  useEffect(() => {
    const { changedTask, action } = ganttEvent;
    if (changedTask) {
      if (action === "delete") {
        setGanttEvent({ action: "" });
        setBarTasks(barTasks.filter(t => t.id !== changedTask.id));
      } else if (
        action === "move" ||
        action === "end" ||
        action === "start" ||
        action === "actualStart" ||
        action === "actualEnd" ||
        action === "progress"
      ) {
        const prevStateTask = barTasks.find(t => t.id === changedTask.id);
        if (
          prevStateTask &&
          (prevStateTask.start.getTime() !== changedTask.start.getTime() ||
            prevStateTask.end.getTime() !== changedTask.end.getTime() ||
            prevStateTask.progress !== changedTask.progress ||
            prevStateTask.actualX1 !== changedTask.actualX1 ||
            prevStateTask.actualX2 !== changedTask.actualX2)
        ) {
          // actions for change
          const newTaskList = barTasks.map(t =>
            t.id === changedTask.id ? changedTask : t
          );
          setBarTasks(newTaskList);
        }
      }
    }
  }, [ganttEvent, barTasks]);

  useEffect(() => {
    if (failedTask) {
      setBarTasks(barTasks.map(t => (t.id !== failedTask.id ? t : failedTask)));
      setFailedTask(null);
    }
  }, [failedTask, barTasks]);

  useEffect(() => {
    if (!listCellWidth || isTaskListCollapsed) {
      setTaskListWidth(0);
    } else if (taskListRef.current) {
      setTaskListWidth(taskListRef.current.offsetWidth);
    }
  }, [taskListRef, listCellWidth, listWidth, isTaskListCollapsed]);

  useEffect(() => {
    if (wrapperRef.current) {
      setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListWidth);
    }
  }, [wrapperRef, taskListWidth]);

  useEffect(() => {
    if (ganttHeight) {
      setSvgContainerHeight(ganttHeight + headerHeight);
    } else {
      setSvgContainerHeight(tasks.length * rowHeight + headerHeight);
    }
  }, [ganttHeight, tasks, headerHeight, rowHeight]);

  // scroll events
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.shiftKey || event.deltaX) {
        const scrollMove = event.deltaX ? event.deltaX : event.deltaY;
        let newScrollX = scrollX + scrollMove;
        if (newScrollX < 0) {
          newScrollX = 0;
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth;
        }
        setScrollX(newScrollX);
        event.preventDefault();
      } else if (ganttHeight) {
        let newScrollY = scrollY + event.deltaY;
        if (newScrollY < 0) {
          newScrollY = 0;
        } else if (newScrollY > ganttFullHeight - ganttHeight) {
          newScrollY = ganttFullHeight - ganttHeight;
        }
        if (newScrollY !== scrollY) {
          setScrollY(newScrollY);
          event.preventDefault();
        }
      }

      setIgnoreScrollEvent(true);
    };

    // subscribe if scroll is necessary
    const wrapperElement = wrapperRef.current;
    wrapperElement?.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    return () => {
      wrapperElement?.removeEventListener("wheel", handleWheel);
    };
  }, [
    wrapperRef,
    scrollY,
    scrollX,
    ganttHeight,
    svgWidth,
    rtl,
    ganttFullHeight,
  ]);

  const handleScrollY = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
      setScrollY(event.currentTarget.scrollTop);
      setIgnoreScrollEvent(true);
    } else {
      setIgnoreScrollEvent(false);
    }
  };

  const handleScrollX = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollX !== event.currentTarget.scrollLeft && !ignoreScrollEvent) {
      setScrollX(event.currentTarget.scrollLeft);
      setIgnoreScrollEvent(true);
    } else {
      setIgnoreScrollEvent(false);
    }
  };

  /**
   * Handles arrow keys events and transform it to new scroll
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    let newScrollY = scrollY;
    let newScrollX = scrollX;
    let isX = true;
    switch (event.key) {
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        newScrollY += rowHeight;
        isX = false;
        break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        newScrollY -= rowHeight;
        isX = false;
        break;
      case "Left":
      case "ArrowLeft":
        newScrollX -= columnWidth;
        break;
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        newScrollX += columnWidth;
        break;
    }
    if (isX) {
      if (newScrollX < 0) {
        newScrollX = 0;
      } else if (newScrollX > svgWidth) {
        newScrollX = svgWidth;
      }
      setScrollX(newScrollX);
    } else {
      if (newScrollY < 0) {
        newScrollY = 0;
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        newScrollY = ganttFullHeight - ganttHeight;
      }
      setScrollY(newScrollY);
    }
    setIgnoreScrollEvent(true);
  };

  /**
   * Task select event
   */
  const handleSelectedTask = (taskId: string) => {
    const newSelectedTask = barTasks.find(t => t.id === taskId);
    const oldSelectedTask = barTasks.find(
      t => !!selectedTask && t.id === selectedTask.id
    );
    if (onSelect) {
      if (oldSelectedTask) {
        onSelect(oldSelectedTask, false);
      }
      if (newSelectedTask) {
        onSelect(newSelectedTask, true);
      }
    }
    setSelectedTask(newSelectedTask);
  };
  const handleExpanderClick = (task: Task) => {
    // 默认未设置 hideChildren 时视为展开态
    const current = task.hideChildren ?? false;
    if (onExpanderClick) {
      onExpanderClick({ ...task, hideChildren: !current });
    }
  };

  const handleToggleTaskList = () => {
    setIsTaskListCollapsed(!isTaskListCollapsed);
  };
  const gridProps: GridProps = {
    columnWidth,
    svgWidth,
    tasks: tasks,
    rowHeight,
    dates: dateSetup.dates,
    todayColor,
    rtl,
    viewType,
  };
  const calendarProps: CalendarProps = {
    dateSetup,
    locale,
    viewMode,
    headerHeight,
    columnWidth,
    fontFamily,
    fontSize,
    rtl,
    viewType,
    oaTaskViewMode: currentOATaskViewMode,
  };
  const barProps: TaskGanttContentProps = {
    tasks: barTasks,
    dates: dateSetup.dates,
    ganttEvent,
    selectedTask,
    rowHeight,
    taskHeight,
    columnWidth,
    arrowColor,
    timeStep,
    fontFamily,
    fontSize,
    arrowIndent,
    showArrows,
    hideTaskName,
    svgWidth,
    rtl,
    viewType,
    enableTaskDrag,
    enableTaskResize,
    isTaskDraggable,
    setGanttEvent,
    setFailedTask,
    setSelectedTask: handleSelectedTask,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onClick,
    onDelete,
    onTaskDragEnd,
    onTaskDragComplete,
  };

  const [expandAllLeafTasks, setExpandAllLeafTasks] = useState(true);
  const handleToggleExpandAll = () => {
    const newValue = !expandAllLeafTasks;
    setExpandAllLeafTasks(newValue);
    // 展开/折叠所有任务（包括有子任务的任务）
    if (onBatchExpanderClick) {
      // 使用批量更新回调（推荐）
      const updatedTasks = tasks.map(t => {
        const hasChildren = tasks.some(child => child.project === t.id);
        if (hasChildren && t.hideChildren !== newValue) {
          return { ...t, hideChildren: newValue };
        }
        return t;
      });
      onBatchExpanderClick(updatedTasks);
    } else if (onExpanderClick) {
      // 兼容旧的方式（不推荐，因为在循环中多次调用setState可能导致问题）
      tasks.forEach(t => {
        const hasChildren = tasks.some(child => child.project === t.id);
        // 如果有子任务，则展开/折叠该任务
        if (hasChildren) {
          onExpanderClick({ ...t, hideChildren: newValue });
        }
      });
    }
  };

  const tableProps: TaskListProps = {
    rowHeight,
    rowWidth: listCellWidth,
    listWidth,
    fontFamily,
    fontSize,
    tasks: barTasks,
    locale,
    headerHeight,
    scrollY,
    ganttHeight,
    horizontalContainerClass: styles.horizontalContainer,
    selectedTask,
    taskListRef,
    setSelectedTask: handleSelectedTask,
    onExpanderClick: handleExpanderClick,
    onAddTask,
    onEditTask,
    onDeleteTask,
    operationsColumnWidth,
    operationsColumnLabel,
    isTaskListCollapsed,
    onToggleTaskList: handleToggleTaskList,
    expandIcon,
    collapseIcon,
    TaskListHeader: viewType === "oaTask" 
      ? (props: any) => {
          const headerProps = {
            ...props,
            expandAllLeafTasks,
            onToggleExpandAll: handleToggleExpandAll,
            operationsColumnWidth,
            operationsColumnLabel,
            showOperationsColumn,
            rowSelection,
            unreadColumn,
            allSelected,
            indeterminate,
            onSelectAll: handleSelectAll,
            taskTitleHeaderRender,
          };
          return <OATaskListHeader {...headerProps} />;
        }
      : TaskListHeader,
    TaskListTable: viewType === "oaTask" 
      ? (props: any) => {
          const tablePropsData = {
            ...props,
            allTasks: tasks,
            expandAllLeafTasks,
            onToggleExpandAll: handleToggleExpandAll,
            operationsColumnWidth,
            showOperationsColumn,
            onAddTask,
            onEditTask,
            onDeleteTask,
            columnRenderers,
            columnEllipsisMaxChars,
            onCellOverflow,
            rowSelection: rowSelection ? {
              ...rowSelection,
              selectedRowKeys,
              onChange: handleRowSelectionChange,
            } : undefined,
            unreadColumn,
          };
          return <OATaskListTable {...tablePropsData} />;
        }
      : TaskListTable,
    nameColumnWidth,
    timeColumnLabels,
    timeColumnWidths,
    onDateChange,
    tableStyles,
    // pass-through to task list header/table
    // Note: TaskListProps typing supports these via component prop types
  };
  return (
    <div ref={ganttContainerRef}>
      <div
        className={styles.wrapper}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={wrapperRef}
      >
        {listCellWidth && !isTaskListCollapsed && <TaskList {...tableProps} />}
        <TaskGantt
          gridProps={gridProps}
          calendarProps={calendarProps}
          barProps={barProps}
          ganttHeight={ganttHeight}
          scrollY={scrollY}
          scrollX={scrollX}
        />
        {showTooltip && ganttEvent.changedTask && (
          <Tooltip
            arrowIndent={arrowIndent}
            rowHeight={rowHeight}
            svgContainerHeight={svgContainerHeight}
            svgContainerWidth={svgContainerWidth}
            fontFamily={fontFamily}
            fontSize={fontSize}
            scrollX={scrollX}
            scrollY={scrollY}
            task={ganttEvent.changedTask}
            headerHeight={headerHeight}
            taskListWidth={taskListWidth}
            TooltipContent={TooltipContent}
            rtl={rtl}
            svgWidth={svgWidth}
          />
        )}
        <VerticalScroll
          ganttFullHeight={ganttFullHeight}
          ganttHeight={ganttHeight}
          headerHeight={headerHeight}
          scroll={scrollY}
          onScroll={handleScrollY}
          rtl={rtl}
        />
      </div>
      <HorizontalScroll
        svgWidth={svgWidth}
        taskListWidth={taskListWidth}
        scroll={scrollX}
        rtl={rtl}
        onScroll={handleScrollX}
      />
    </div>
  );
});
