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
export interface Task {
  id: string | number;
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
  /** 扁平数据模式下引用父节点 id；树形数据模式下由组件自动推导，无需手动设置 */
  project?: string | number;
  /** 扁平数据模式下使用；树形数据模式下父子关系由 children 字段表达，无需设置 */
  dependencies?: (string | number)[];
  hideChildren?: boolean;
  displayOrder?: number;
  /**
   * 子任务列表，用于树形数据格式（参照 antd Table）。
   * 当数据中存在该字段时，组件会自动将树形数据展平并以层级形式渲染。
   * 可通过 GanttProps.childrenColumnName 指定其他字段名。
   */
  children?: Task[];
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
    selectedTaskId: string | number;
    /**
     * Sets selected task by id
     */
    setSelectedTask: (taskId: string | number) => void;
    onExpanderClick: (task: Task) => void;
  }>;
}

export interface GanttProps extends EventOption, DisplayOption, StylingOption {
  tasks: Task[];
  /**
   * 指定树形数据中子节点所在的字段名，默认为 "children"。
   * 当 tasks 中任意节点含有该字段时，组件自动切换为树形数据模式，
   * 展开/折叠状态由组件内部管理，无需外部维护 hideChildren。
   */
  childrenColumnName?: string;
  onAddTask?: (task: Task) => void; // 修改这里：从 (parentTaskId: string) => void 改为 (task: Task) => void
  AddTaskModal?: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    parentTaskId: string | number;
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
  // 自定义展开/折叠图标
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
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
}
