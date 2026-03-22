export enum ViewMode {
  Day = "Day",
  /** 班次模式：每 6 小时一个刻度，D1(0:00) / D2(6:00) / N1(12:00) / N2(18:00) */
  DayShift = "DayShift",
  /** D/N 班次模式：每 12 小时一个刻度，D(0:00) / N(12:00) */
  DayShiftDN = "DayShiftDN",
  /** ISO-8601 week */
  Week = "Week",
  Month = "Month",
  QuarterYear = "QuarterYear",
  Year = "Year",
}
export type TaskType = "task" | "milestone" | "project";
export type TaskStatus = "待驗收" | "處理中" | "掛起中" | "待確認" | "已完成" | "已撤销";
export type StatusInfo = {
  code: number;
  description: string;
  color: string;
};
/**
 * 时间轴单位标签（直接配置周/月/季等显示单位，无需走 i18n 或 timelineHeaderCellRender）。
 * 例如：周显示为 "WK 01"、"Week 01"、"W 01"；月显示为 "M1"、"MON1"。
 */
export interface TimelineUnitLabels {
  /** 周：如 "周" | "Week" | "WK" | "W"，显示为 "{week} 01" */
  week?: string;
  /** 月：如 "月" | "Month" | "M" | "MON"，显示为 "M1"、"MON1" 等 */
  month?: string;
  /** 季：如 "季" | "Q"，显示为 "Q1"、"Q2" */
  quarter?: string;
  /** 日：如 "日" | "Day" | "D"（日模式子表头日期后的单位后缀，若需 "5日" 可设为 "日"） */
  day?: string;
  /** 年：如 "年" | "Year" | "Y"（当前年仅显示数字，此字段预留） */
  year?: string;
}
// 语言类型：繁体中文 / 英文
export type Language = 'zh-TW' | 'en';
export interface Task {
  id: string;
  type: TaskType;
  name: string;
  start: Date;
  end: Date;
  // 计划与实际时间（可选，兼容旧数据）
  /** 与 plannedEnd 同时存在时才会在时间轴上绘制条形 */
  plannedStart?: Date;
  /** 与 plannedStart 同时存在时才会在时间轴上绘制条形 */
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
  /**
   * 子任务列表（类似 Ant Design Table 的 children 字段）。
   * 传入此字段时，组件会自动将树形数据展平为平铺列表，
   * 并根据父子关系设置 project 字段，无需手动维护。
   */
  children?: Task[];
  // 新增字段
  /** 是否禁用拖拽 */
  disableDrag?: boolean;
  /** 任务状态（用于oaTask模式），可以是字符串或对象 */
  status?: TaskStatus | StatusInfo;
  /** 负责人（用于oaTask模式） */
  assignee?: string;
  /** 是否未读（用于oaTask模式） */
  unread?: boolean;
  /** 優先級（用於oaTask模式）：高 / 中 / 低 或自定義字串 */
  priority?: "高" | "中" | "低" | string;
  /** 創建時間（用於oaTask模式） */
  createdAt?: Date | string;
  /** 發起人（用於oaTask模式） */
  creator?: string;
  /**
   * 时间轴纯日期模式：
   * - 不传/false：OA 场景下延期与完成时间与任务状态联动（掛起/撤销/待驗收等）
   * - true：延期与条形图仅由 plannedStart / plannedEnd / actualStart / actualEnd（及今日）决定，不依赖任务状态
   */
  timelineUsesDatesOnly?: boolean;
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
  /**
   * Invokes when the Gantt chart has fully rendered (initial render and after data updates)
   * Useful for post-render operations like taking screenshots, exporting, or analytics
   */
  onRenderComplete?: () => void;
}

export interface DisplayOption {
  viewMode?: ViewMode;
  /** ref.switchViewMode 等场景下通知外部更新受控的 viewMode */
  onViewModeChange?: (mode: ViewMode) => void;
  viewDate?: Date;
  preStepsCount?: number;
  /**
   * Specifies the month name language. Able formats: ISO 639-2, Java Locale
   */
  locale?: string;
  rtl?: boolean;
  /** 初始加载时是否水平滚动到今天，默认 true */
  scrollToTodayOnLoad?: boolean;
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
  /** 左侧任务列表总宽度（如 "500px"），不传则根据列宽自动计算 */
  listWidth?: string;
  /**
   * @deprecated 请使用 `columns: [{ key: 'name', width: '...' }]` 代替
   * 独立配置名称列宽，不传则使用 listCellWidth
   */
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
  /** 是否隐藏条形图上的任务名文字，默认true（隐藏） */
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
  /** 今天的纵轴线宽度，默认1 */
  todayLineWidth?: number;
  /** 时间刻度边框宽度，默认1 */
  gridBorderWidth?: number;
  /** 时间刻度边框颜色，默认#e6e4e4 */
  gridBorderColor?: string;
  /**
   * @deprecated 请使用 `columns` 数组中对应列的 `title` 字段代替，例如：
   * `columns: [{ key: 'plannedStart', title: '计划开始' }, { key: 'plannedEnd', title: '计划截止' }]`
   * 左侧四个时间列标题自定义
   */
  timeColumnLabels?: {
    plannedStart?: string;
    plannedEnd?: string;
    plannedDuration?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  /**
   * @deprecated 请使用 `columns` 数组中对应列的 `width` 字段代替，例如：
   * `columns: [{ key: 'plannedStart', width: '170px' }, { key: 'plannedEnd', width: '170px' }]`
   * 左侧四个时间列列宽（例如 "155px"），不传则使用 listCellWidth
   */
  timeColumnWidths?: {
    plannedStart?: string;
    plannedEnd?: string;
    plannedDuration?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  /**
   * 是否允许通过拖拽调整左侧任务列表的列宽，默认 false。
   * 开启后，每个列表头右侧会出现拖拽手柄；关闭时行为与之前一致。
   */
  resizableColumns?: boolean;
  /** 表格样式配置 */
  tableStyles?: {
    /** 左侧表头高度（数字，如 50），不传则使用全局 headerHeight */
    headerHeight?: number;
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
    /** 表头单元格内边距，不传则使用 cellPadding */
    headerCellPadding?: string;
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

export interface GanttColumnConfig {
  /**
   * 列的唯一标识。内置列 key（见下方说明）会自动读取对应 Task 字段并提供默认渲染；
   * 其他任意 key 视为自定义列，需通过 render 提供单元格内容。
   *
   * 内置 key（default 视图）：name | plannedStart | plannedEnd | plannedDuration | actualStart | actualEnd | operations
   * 内置 key（oaTask 视图）：name | status | assignee | creator | operations
   */
  key: string;
  /** 列标题文字或节点 */
  title?: React.ReactNode;
  /** 列宽度，如 "150px"。不传时使用全局 listCellWidth */
  width?: string;
  /** 是否隐藏该列，默认 false */
  hidden?: boolean;
  /** 单元格对齐方式，默认 'left' */
  align?: 'left' | 'center' | 'right';
  /**
   * 自定义单元格渲染函数。
   * - value：该字段在 Task 上的原始值（内置列已自动提取，自定义列为 task[key]，不在 Task 类型上则为 undefined）
   * - task：完整 Task 对象
   * - index：行索引
   * 注意：name 列的树形展开/折叠图标始终保留，render 只替换文字部分。
   */
  render?: (value: any, task: Task, index: number) => React.ReactNode;
  /**
   * 自定义列头渲染，返回值完全替换默认列头内容（含 title 文字）。
   * 对于 oaTask 视图的 name 列，默认列头包含展开/折叠全部按钮，
   * 使用 renderTitle 后需自行处理该交互（可通过 columnHeaderRenderers.name 获得 expandCollapseNode）。
   */
  renderTitle?: () => React.ReactNode;
}

/** @deprecated 请使用 GanttColumnConfig */
export interface ColumnConfig {
  key: string;
  label: string;
  width?: string;
  visible?: boolean;
  renderHeader?: (props: { label: string; width?: string }) => React.ReactNode;
}

export interface GanttProps extends EventOption, DisplayOption, StylingOption {
  tasks: Task[];
  /** 语言设置，支持 'zh-TW'(繁体中文) 和 'en'(英文)，默认 'zh-TW' */
  language?: Language;
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
  /** @deprecated 请使用 `columns: [{ key: 'operations', width: '...' }]` 代替 */
  operationsColumnWidth?: string;
  /** @deprecated 请使用 `columns: [{ key: 'operations', title: '...' }]` 代替 */
  operationsColumnLabel?: string;
  /**
   * @deprecated 请使用 `columns: [{ key: 'operations', hidden: true }]` 代替
   * 是否显示操作列，默认 true
   */
  showOperationsColumn?: boolean;
  /**
   * @deprecated `name` / `status` / `assignee` / `operations` 字段请改用
   * `columns: [{ key: 'name', render: (value, task) => ... }]` 等方式代替。
   * 注意：`unread` 列暂未纳入 `columns` 系统，仍需通过此字段自定义。
   */
  columnRenderers?: Partial<{
    unread: (task: Task, meta: { value: boolean; displayValue: React.ReactNode }) => React.ReactNode;
    name: (task: Task, meta: { value: string; displayValue: string; isOverflow: boolean; maxLength: number }) => React.ReactNode;
    status: (task: Task, meta: { value?: string; displayValue: string; isOverflow: boolean; maxLength: number }) => React.ReactNode;
    assignee: (task: Task, meta: { value?: string; displayValue: string; isOverflow: boolean; maxLength: number }) => React.ReactNode;
    operations: (task: Task) => React.ReactNode;
  }>;
  /** 未读列配置 */
  unreadColumn?: {
    /** 是否显示未读列，默认false */
    show?: boolean;
    /** 未读列宽度，默认 "40px" */
    width?: string;
    /** 未读列标题，默认 "未读" */
    title?: string;
  };
  /** 每列的省略字符上限，超过则截断并省略号 */
  columnEllipsisMaxChars?: Partial<Record<"name" | "status" | "assignee" | "unread", number>>;
  /** 文本溢出时回调，便于调用方处理 */
  onCellOverflow?: (info: { column: "name" | "status" | "assignee" | "unread"; task: Task }) => void;
  // 自定义展开/折叠图标
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  /**
   * 列配置数组（仿 Ant Design Table columns）。
   * 传入后以此数组驱动左侧任务列表的列顺序、显示/隐藏、列宽、列头与单元格渲染，
   * 不传时保持原有列布局（向后兼容）。
   * 可混合内置列与完全自定义列，详见 GanttColumnConfig。
   */
  columns?: GanttColumnConfig[];
  /** 自定义判断任务是否可以拖动/调整的函数
   * @param task 任务对象
   * @param action 操作类型：'move' | 'start' | 'end' | 'actualStart' | 'actualEnd' | 'progress'
   * @returns 返回true表示允许该操作，false表示禁止
   */
  isTaskDraggable?: (task: Task, action?: 'move' | 'start' | 'end' | 'actualStart' | 'actualEnd' | 'progress') => boolean;
  /**
   * 自定义任务条形图基色回调。
   * 优先级高于内置状态色映射表，返回 null/undefined 则回退到默认逻辑。
   * 支持 hex / rgb / rgba 格式，例如 "#FF5733"、"rgb(255,87,51)"、"rgba(255,87,51,0.8)"。
   * @param task 完整任务对象
   * @returns 颜色字符串，或 null/undefined（使用默认色）
   */
  getTaskBarColor?: (task: Task) => string | null | undefined;
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
    /**
     * @deprecated 请使用 `columnHeaderRenderers.rowSelection` 代替，功能完全相同
     * 自定义多选列表头，支持 React 格式如 <div>全选</div>、字符串、或渲染函数 (props) => ReactNode
     */
    columnTitle?: React.ReactNode | ((props: { defaultLabel: string }) => React.ReactNode);
    /** 是否显示全选复选框，默认 true */
    showSelectAll?: boolean;
    /** 禁用的行，返回 true 表示禁用该行的复选框 */
    getCheckboxProps?: (record: Task) => { disabled?: boolean };
    /** 自定义复选框边框颜色 */
    checkboxBorderColor?: string;
  };
  /**
   * @deprecated 请使用 `columnHeaderRenderers.name` 代替，入参签名更统一：
   * `columnHeaderRenderers: { name: ({ expandCollapseNode, defaultLabel }) => ReactNode }`
   * 任务标题列的表头自定义渲染。
   */
  taskTitleHeaderRender?: (props: {
    expandCollapseNode: React.ReactNode;
    titleText: string;
  }) => React.ReactNode;
  /**
   * 表头列自定义渲染（类似 Ant Design Table columns[].title）。
   * 支持 ReactNode 或渲染函数，未指定的列使用默认标题。
   *
   * 说明：`name` / `status` / `assignee` / `operations` 字段可改用
   * `columns: [{ key: 'xxx', renderTitle: () => ... }]` 代替；
   * `name` 字段因需传入 `expandCollapseNode`，无法通过 `columns[].renderTitle` 获得，
   * 因此 `columnHeaderRenderers.name` 仍为自定义任务标题列头的推荐方式。
   * `rowSelection` / `unread` 字段暂无 columns 替代，保持不变。
   */
  columnHeaderRenderers?: Partial<{
    /** 多选列表头 */
    rowSelection: React.ReactNode | ((props: { defaultLabel: string }) => React.ReactNode);
    /** 未读列表头 */
    unread: React.ReactNode | ((props: { defaultLabel: string }) => React.ReactNode);
    /** 任务标题列表头（含展开/折叠节点）。推荐用此字段而非 taskTitleHeaderRender */
    name: React.ReactNode | ((props: { expandCollapseNode: React.ReactNode; defaultLabel: string }) => React.ReactNode);
    /**
     * @deprecated 请使用 `columns: [{ key: 'status', renderTitle: () => ... }]` 代替
     */
    status: React.ReactNode | ((props: { defaultLabel: string }) => React.ReactNode);
    /**
     * @deprecated 请使用 `columns: [{ key: 'assignee', renderTitle: () => ... }]` 代替
     */
    assignee: React.ReactNode | ((props: { defaultLabel: string }) => React.ReactNode);
    /**
     * @deprecated 请使用 `columns: [{ key: 'operations', renderTitle: () => ... }]` 代替
     */
    operations: React.ReactNode | ((props: { defaultLabel: string }) => React.ReactNode);
  }>;
  /**
   * 时间轴单位标签（直接配置周/月/季等，如 week: "WK", month: "M"）。
   * 与 timelineHeaderCellRender 二选一即可；若同时提供，先按单位生成 defaultLabel，再交给 timelineHeaderCellRender。
   */
  timelineUnitLabels?: TimelineUnitLabels;
  /**
   * 时间轴标题自定义渲染（类似 Ant Design 表头）。
   * 每个时间格会调用此函数，可返回 SVG 兼容的 ReactNode（如 text、g、tspan 等）。
   */
  timelineHeaderCellRender?: (props: {
    date: Date;
    index: number;
    columnWidth: number;
    headerHeight: number;
    /** 顶层/底层（多行表头时） */
    level: 'top' | 'bottom';
    defaultLabel: string;
    viewMode: ViewMode;
    locale: string;
    /** 用于定位的 x 坐标（列中心） */
    x: number;
    /** 用于定位的 y 坐标 */
    y: number;
    /** 是否为新组开始（如新周、新月的第一天） */
    isGroupStart?: boolean;
    /** 跨列数（合并单元格时） */
    colSpan?: number;
  }) => React.ReactNode;
}

/**
 * 滚动到今日的时间指向配置。
 * - `'now'`：指向当前时刻（默认）
 * - `'start'`：指向当天 00:00
 * - `'end'`：指向当天 23:59
 * - `{ hours, minutes }`：指向指定时刻，如 `{ hours: 9, minutes: 30 }`
 */
export type ScrollTodayTimeOfDay =
  | "now"
  | "start"
  | "end"
  | { hours: number; minutes: number };

export interface ScrollTodayOptions {
  /**
   * 时间指向配置，默认 `'now'`（当前时刻）。
   * 可设为 `'end'` 使时间轴定位到今天最末端（23:59），
   * 或 `{ hours, minutes }` 指向任意时刻。
   */
  timeOfDay?: ScrollTodayTimeOfDay;
  /** 视口对齐方式，默认 `'center'` */
  align?: "start" | "center" | "end";
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
   * 将时间轴滚动到今天。
   * 通过 `timeOfDay` 可配置时间指向：`'now'`（当前时刻）、`'start'`（00:00）、
   * `'end'`（23:59）或自定义 `{ hours, minutes }`。
   */
  scrollToToday: (options?: ScrollTodayOptions) => void;
  /**
   * 切换时间轴刻度模式（与 props.viewMode 一致）
   */
  switchViewMode?: (mode: ViewMode) => void;
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
