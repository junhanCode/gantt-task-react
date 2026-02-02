export enum ViewMode {
  Hour = "Hour",
  QuarterDay = "Quarter Day",
  HalfDay = "Half Day",
  Day = "Day",
  /** ISO-8601 week */
  Week = "Week",
  Month = "Month",
  QuarterYear = "QuarterYear",
  Year = "Year",
  DayShift = "DayShift",
}
export type TaskType = "task" | "milestone" | "project";
export type TaskStatus = "待驗收" | "處理中" | "掛起中" | "待確認" | "已完成" | "已撤銷";
export type StatusInfo = {
  code: number;
  description: string;
  color: string;
};
export type ViewType = "default" | "oaTask";
export type OATaskViewMode = "日" | "月" | "季";
export interface Task {
  id: string;
  type: TaskType;
  name: string;
  start: Date;
  end: Date;
  // 计划与实际时间（可选，兼容旧数据）
  plannedStart?: Date;
  plannedEnd?: Date;
  actualStart?: Date;
  actualEnd?: Date;
  /**
   * From 0 to 100
   */
  progress: number;
  styles?: {
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    progressColor?: string;
    progressSelectedColor?: string;
  };
  isDisabled?: boolean;
  project?: string;
  dependencies?: string[];
  hideChildren?: boolean;
  displayOrder?: number;
  // 新增字段
  /** 是否禁用拖拽 */
  disableDrag?: boolean;
  /** 任务状态（用于oaTask模式），可以是字符串或对象 */
  status?: TaskStatus | StatusInfo;
  /** 负责人（用于oaTask模式） */
  assignee?: string;
}

export interface EventOption {
  /**
   * Time step value for date changes.
   */
  timeStep?: number;
  /**
   * Invokes on bar select on unselect.
   */
  onSelect?: (task: Task, isSelected: boolean) => void;
  /**
   * Invokes on bar double click.
   */
  onDoubleClick?: (task: Task) => void;
  /**
   * Invokes on bar click.
   */
  onClick?: (task: Task) => void;
  /**
   * Invokes on end and start time change. Chart undoes operation if method return false or error.
   */
  onDateChange?: (
    task: Task,
    children: Task[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on progress change. Chart undoes operation if method return false or error.
   */
  onProgressChange?: (
    task: Task,
    children: Task[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on delete selected task. Chart undoes operation if method return false or error.
   */
  onDelete?: (task: Task) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on expander on task list
   */
  onExpanderClick?: (task: Task) => void;
  /**
   * Invokes when toggling expand/collapse all tasks in the header
   * @param tasks All updated tasks with new hideChildren state
   */
  onBatchExpanderClick?: (tasks: Task[]) => void;
  /**
   * Invokes when task drag/resize ends. Use this for async API calls to update task.
   * Return false or throw error to cancel the change.
   */
  onTaskDragEnd?: (
    task: Task,
    children: Task[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes after task drag/resize is completed and placed (mouse released).
   * This event fires after the drag operation is done, regardless of success or failure.
   * Use this for notifications or logging. Does not affect the drag operation result.
   */
  onTaskDragComplete?: (
    task: Task,
    children: Task[],
    action: 'move' | 'start' | 'end' | 'actualStart' | 'actualEnd' | 'progress'
  ) => void;
}

export interface DisplayOption {
  viewMode?: ViewMode;
  viewDate?: Date;
  preStepsCount?: number;
  /**
   * Specifies the month name language. Able formats: ISO 639-2, Java Locale
   */
  locale?: string;
  rtl?: boolean;
  /**
   * Enable task drag (move entire task). Default: false
   */
  enableTaskDrag?: boolean;
  /**
   * Enable task resize (change start/end time by dragging edges). Default: true
   */
  enableTaskResize?: boolean;
}

export interface StylingOption {
  headerHeight?: number;
  columnWidth?: number;
  listCellWidth?: string;
  /** 独立配置名称列宽，不传则使用 listCellWidth */
  nameColumnWidth?: string;
  rowHeight?: number;
  ganttHeight?: number;
  barCornerRadius?: number;
  handleWidth?: number;
  fontFamily?: string;
  fontSize?: string;
  /**
   * How many of row width can be taken by task.
   * From 0 to 100
   */
  barFill?: number;
  /** 是否隐藏条形图上的任务名文字，默认false */
  hideTaskName?: boolean;
  barProgressColor?: string;
  barProgressSelectedColor?: string;
  barBackgroundColor?: string;
  barBackgroundSelectedColor?: string;
  barActualColor?: string;
  barActualSelectedColor?: string;
  barDelayColor?: string;
  projectProgressColor?: string;
  projectProgressSelectedColor?: string;
  projectBackgroundColor?: string;
  projectBackgroundSelectedColor?: string;
  milestoneBackgroundColor?: string;
  milestoneBackgroundSelectedColor?: string;
  arrowColor?: string;
  arrowIndent?: number;
  /** 是否显示任务指向箭头，默认true */
  showArrows?: boolean;
  /** 是否显示悬浮信息框（tooltip），默认true */
  showTooltip?: boolean;
  todayColor?: string;
  /** 左侧四个时间列标题自定义 */
  timeColumnLabels?: {
    plannedStart?: string;
    plannedEnd?: string;
    plannedDuration?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  /** 左侧四个时间列列宽（例如 "155px"），不传则使用 listCellWidth */
  timeColumnWidths?: {
    plannedStart?: string;
    plannedEnd?: string;
    plannedDuration?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  /** 表格样式配置 */
  tableStyles?: {
    /** 表格容器高度（支持数字或字符串，如 500 或 "500px" 或 "100%"） */
    height?: number | string;
    /** 表格容器样式 */
    container?: React.CSSProperties;
    /** 表格行样式（支持函数，根据行索引返回样式） */
    row?: React.CSSProperties | ((rowIndex: number) => React.CSSProperties);
    /** 表格单元格样式 */
    cell?: React.CSSProperties;
    /** 表头样式 */
    header?: React.CSSProperties;
    /** 表头单元格样式 */
    headerCell?: React.CSSProperties;
    /** 表格边框颜色 */
    borderColor?: string;
    /** 表格行背景色（奇数行） */
    rowBackgroundColor?: string;
    /** 表格行背景色（偶数行） */
    rowEvenBackgroundColor?: string;
    /** 单元格内边距 */
    cellPadding?: string;
    /** 表头背景色 */
    headerBackgroundColor?: string;
    /** 表头文字颜色 */
    headerTextColor?: string;
  };
  TooltipContent?: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
  TaskListHeader?: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
  }>;
  TaskListTable?: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    /**
     * Sets selected task by id
     */
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
  }>;
}

export interface ColumnConfig {
  /** 列的唯一标识 */
  key: string;
  /** 列标题 */
  label: string;
  /** 列宽度 */
  width?: string;
  /** 是否显示 */
  visible?: boolean;
  /** 自定义标题渲染 */
  renderHeader?: (props: { label: string; width?: string }) => React.ReactNode;
}

export interface GanttProps extends EventOption, DisplayOption, StylingOption {
  tasks: Task[];
  onAddTask?: (task: Task) => void; // 修改这里：从 (parentTaskId: string) => void 改为 (task: Task) => void
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
  /** 是否显示操作列，默认true */
  showOperationsColumn?: boolean;
  /** 自定义列渲染（类似 antd columns.render） */
  columnRenderers?: Partial<{
    name: (task: Task, meta: { value: string; displayValue: string; isOverflow: boolean; maxLength: number }) => React.ReactNode;
    status: (task: Task, meta: { value?: string; displayValue: string; isOverflow: boolean; maxLength: number }) => React.ReactNode;
    assignee: (task: Task, meta: { value?: string; displayValue: string; isOverflow: boolean; maxLength: number }) => React.ReactNode;
    operations: (task: Task) => React.ReactNode;
  }>;
  /** 每列的省略字符上限，超过则截断并省略号 */
  columnEllipsisMaxChars?: Partial<Record<"name" | "status" | "assignee", number>>;
  /** 文本溢出时回调，便于调用方处理 */
  onCellOverflow?: (info: { column: "name" | "status" | "assignee"; task: Task }) => void;
  // 自定义展开/折叠图标
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  // 新增配置
  /** 视图类型，支持 "default" 和 "oaTask" */
  viewType?: ViewType;
  /** oaTask模式下的视图模式（日、月、季） */
  oaTaskViewMode?: OATaskViewMode;
  /** oaTask模式切换视图模式的回调 */
  onOATaskViewModeChange?: (mode: OATaskViewMode) => void;
  /** 列配置（用于显示/隐藏和自定义标题） */
  columns?: ColumnConfig[];
  /** 自定义判断任务是否可以拖动/调整的函数
   * @param task 任务对象
   * @param action 操作类型：'move' | 'start' | 'end' | 'actualStart' | 'actualEnd' | 'progress'
   * @returns 返回true表示允许该操作，false表示禁止
   */
  isTaskDraggable?: (task: Task, action?: 'move' | 'start' | 'end' | 'actualStart' | 'actualEnd' | 'progress') => boolean;
  /** 多选列配置 */
  rowSelection?: {
    /** 指定选中项的 key 数组，需要和 rowKey 配合使用 */
    selectedRowKeys?: string[];
    /** 选中项发生变化时的回调 */
    onChange?: (selectedRowKeys: string[], selectedRows: Task[]) => void;
    /** 表格行 key 的取值字段，默认为 'id' */
    rowKey?: keyof Task | ((record: Task) => string);
    /** 自定义列表选择框宽度，默认 "50px" */
    columnWidth?: string;
    /** 自定义列表选择框标题 */
    columnTitle?: React.ReactNode;
    /** 是否显示全选复选框，默认 true */
    showSelectAll?: boolean;
    /** 禁用的行，返回 true 表示禁用该行的复选框 */
    getCheckboxProps?: (record: Task) => { disabled?: boolean };
    /** 自定义复选框边框颜色 */
    checkboxBorderColor?: string;
  };
  /**
   * 任务标题列的表头自定义渲染。传入函数，返回表头内容（可包含图标，点击时自行处理如调接口）。
   * 入参提供默认的展开/折叠节点和标题文案，可自由排列并追加自己的图标等。
   */
  taskTitleHeaderRender?: (props: {
    expandCollapseNode: React.ReactNode;
    titleText: string;
  }) => React.ReactNode;
}

export interface GanttRef {
  /**
   * 将时间轴滚动到指定日期。
   * @param date 目标日期
   * @param options 对齐选项，默认 start
   */
  scrollToDate: (
    date: Date,
    options?: { align?: "start" | "center" | "end" }
  ) => void;
  /**
   * 切换时间轴模式（用于oaTask模式）
   */
  switchViewMode?: (mode: OATaskViewMode) => void;
  /**
   * 全屏查看
   */
  enterFullscreen?: () => void;
  /**
   * 退出全屏
   */
  exitFullscreen?: () => void;
  /**
   * 导出图片（当前甘特图视窗，格式为.jpg）
   */
  exportImage?: (filename?: string) => void;
}
