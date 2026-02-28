import React from "react";
import GanttChartDemo from "./GanttChartDemo";
import OAGanttDemo from "./OAGanttDemo";
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { getStartEndDateForProject, initTasks } from "./helper";
import "gantt-task-react/dist/index.css";
import { Modal, Input, Select, Button, DatePicker, InputNumber, Form } from "antd";
import { CaretRightOutlined, CaretDownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import TitleCell from "./components/TitleCell";

const { Option } = Select;
const { RangePicker } = DatePicker;

// 规范化时间：如果开始和结束为同一天，开始时间设为00:00:00，结束时间设为23:59:59 
const normalizeTimeForSameDay = (start: Date, end: Date): [Date, Date] => {
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  if (startDay.getTime() === endDay.getTime()) {
    const newStart = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0);
    const newEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);
    return [newStart, newEnd];
  }
  return [start, end];
};

// 新增任务弹框组件
const AddTaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  parentTaskId: string;
  onConfirm: (taskData: Partial<Task>) => void;
}> = ({ isOpen, onClose, parentTaskId, onConfirm }) => {
  const [form] = Form.useForm();
  const [plannedDuration, setPlannedDuration] = React.useState<number>(1);

  // 计算时间跨度（天数）
  const calculateDuration = (start: Date, end: Date): number => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 当计划时间范围改变时，更新时间跨度
  const handlePlannedDateRangeChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      const duration = calculateDuration(dates[0].toDate(), dates[1].toDate());
      setPlannedDuration(duration);
    }
  };

  // 当时间跨度改变时，更新计划结束时间
  const handleDurationChange = (value: number | null) => {
    if (value && value > 0) {
      setPlannedDuration(value);
      const plannedDateRange = form.getFieldValue('plannedDateRange');
      if (plannedDateRange && plannedDateRange[0]) {
        const plannedStart = plannedDateRange[0];
        const newPlannedEnd = dayjs(plannedStart).add(value, 'day');
        form.setFieldsValue({
          plannedDateRange: [plannedStart, newPlannedEnd]
        });
      }
    }
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const baseStart = values.dateRange[0].toDate();
      const baseEnd = values.dateRange[1].toDate();
      const [normalizedBaseStart, normalizedBaseEnd] = normalizeTimeForSameDay(baseStart, baseEnd);

      let plannedStart = values.plannedDateRange ? values.plannedDateRange[0].toDate() : normalizedBaseStart;
      let plannedEnd = values.plannedDateRange ? values.plannedDateRange[1].toDate() : normalizedBaseEnd;
      [plannedStart, plannedEnd] = normalizeTimeForSameDay(plannedStart, plannedEnd);

      let actualStart = values.actualDateRange ? values.actualDateRange[0].toDate() : normalizedBaseStart;
      let actualEnd = values.actualDateRange ? values.actualDateRange[1].toDate() : normalizedBaseEnd;
      [actualStart, actualEnd] = normalizeTimeForSameDay(actualStart, actualEnd);

      const taskData: Partial<Task> = {
        name: values.name,
        type: values.type,
        start: normalizedBaseStart,
        end: normalizedBaseEnd,
        plannedStart,
        plannedEnd,
        actualStart,
        actualEnd,
        progress: values.progress || 0,
        project: parentTaskId,
      };
      onConfirm(taskData);
      form.resetFields();
      setPlannedDuration(1);
      onClose();
    });
  };

  // 当弹框关闭时重置表单
  React.useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setPlannedDuration(1);
    }
  }, [isOpen, form]);

  return (
    <Modal
      title="新增子任务"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          确定
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="任务名称"
          rules={[{ required: true, message: "请输入任务名称" }]}
        >
          <Input placeholder="请输入任务名称" />
        </Form.Item>
        
        <Form.Item
          name="type"
          label="任务类型"
          initialValue="task"
          rules={[{ required: true, message: "请选择任务类型" }]}
        >
          <Select>
            <Option value="task">任务</Option>
            <Option value="milestone">里程碑</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="dateRange"
          label="基础时间范围"
          rules={[{ required: true, message: "请选择时间范围" }]}
        >
          <RangePicker showTime style={{ width: "100%" }} />
        </Form.Item>
        
        <Form.Item
          name="plannedDateRange"
          label="计划时间范围（可选）"
        >
          <RangePicker 
            showTime 
            style={{ width: "100%" }} 
            placeholder={["计划开始时间", "计划结束时间"]} 
            onChange={handlePlannedDateRangeChange}
          />
        </Form.Item>
        
        <Form.Item
          name="plannedDuration"
          label="计划时间跨度（天）"
        >
          <InputNumber 
            min={1} 
            value={plannedDuration}
            onChange={handleDurationChange}
            style={{ width: "100%" }} 
            placeholder="输入天数"
          />
        </Form.Item>
        
        <Form.Item
          name="actualDateRange"
          label="实际时间范围（可选）"
        >
          <RangePicker showTime style={{ width: "100%" }} placeholder={["实际开始时间", "实际结束时间"]} />
        </Form.Item>
        
        <Form.Item
          name="progress"
          label="进度 (%)"
          initialValue={0}
        >
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// 编辑任务弹框组件
const EditTaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onConfirm: (taskData: Partial<Task>) => void;
}> = ({ isOpen, onClose, task, onConfirm }) => {
  const [form] = Form.useForm();
  const [plannedDuration, setPlannedDuration] = React.useState<number>(1);

  // 计算时间跨度（天数）
  const calculateDuration = (start: Date, end: Date): number => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  React.useEffect(() => {
    if (isOpen && task) {
      const plannedStart = task.plannedStart || task.start;
      const plannedEnd = task.plannedEnd || task.end;
      const duration = calculateDuration(plannedStart, plannedEnd);
      
      form.setFieldsValue({
        name: task.name,
        type: task.type,
        plannedDateRange: task.plannedStart && task.plannedEnd ? [
          dayjs(task.plannedStart),
          dayjs(task.plannedEnd)
        ] : undefined,
        actualDateRange: task.actualStart && task.actualEnd ? [
          dayjs(task.actualStart),
          dayjs(task.actualEnd)
        ] : undefined,
        progress: task.progress,
        plannedDuration: duration,
      });
      setPlannedDuration(duration);
    }
  }, [isOpen, task, form]);

  // 当计划时间范围改变时，更新时间跨度
  const handlePlannedDateRangeChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      const duration = calculateDuration(dates[0].toDate(), dates[1].toDate());
      setPlannedDuration(duration);
      form.setFieldsValue({ plannedDuration: duration });
    }
  };

  // 当时间跨度改变时，更新计划结束时间
  const handleDurationChange = (value: number | null) => {
    if (value && value > 0) {
      setPlannedDuration(value);
      const plannedDateRange = form.getFieldValue('plannedDateRange');
      if (plannedDateRange && plannedDateRange[0]) {
        const plannedStart = plannedDateRange[0];
        const newPlannedEnd = dayjs(plannedStart).add(value, 'day');
        form.setFieldsValue({
          plannedDateRange: [plannedStart, newPlannedEnd]
        });
      }
    }
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      let plannedStart: Date | undefined;
      let plannedEnd: Date | undefined;
      let actualStart: Date | undefined;
      let actualEnd: Date | undefined;

      if (values.plannedDateRange?.[0] && values.plannedDateRange?.[1]) {
        [plannedStart, plannedEnd] = normalizeTimeForSameDay(
          values.plannedDateRange[0].toDate(),
          values.plannedDateRange[1].toDate()
        );
      }

      if (values.actualDateRange?.[0] && values.actualDateRange?.[1]) {
        [actualStart, actualEnd] = normalizeTimeForSameDay(
          values.actualDateRange[0].toDate(),
          values.actualDateRange[1].toDate()
        );
      }

      const taskData: Partial<Task> = {
        id: task.id,
        name: values.name,
        type: values.type,
        plannedStart,
        plannedEnd,
        actualStart,
        actualEnd,
        progress: values.progress || 0,
      };
      onConfirm(taskData);
      onClose();
    });
  };

  return (
    <Modal
      title="编辑任务"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          确定
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="任务名称"
          rules={[{ required: true, message: "请输入任务名称" }]}
        >
          <Input placeholder="请输入任务名称" />
        </Form.Item>
        
        <Form.Item
          name="type"
          label="任务类型"
          rules={[{ required: true, message: "请选择任务类型" }]}
        >
          <Select>
            <Option value="task">任务</Option>
            <Option value="milestone">里程碑</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="plannedDateRange"
          label="计划时间范围"
        >
          <RangePicker 
            showTime 
            style={{ width: "100%" }} 
            onChange={handlePlannedDateRangeChange}
          />
        </Form.Item>
        
        <Form.Item
          name="plannedDuration"
          label="计划时间跨度（天）"
        >
          <InputNumber 
            min={1} 
            value={plannedDuration}
            onChange={handleDurationChange}
            style={{ width: "100%" }} 
          />
        </Form.Item>
        
        <Form.Item
          name="actualDateRange"
          label="实际时间范围"
        >
          <RangePicker showTime style={{ width: "100%" }} />
        </Form.Item>
        
        <Form.Item
          name="progress"
          label="进度 (%)"
        >
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Init
const App = () => {
  const ganttRef = React.useRef<any>(null);
  const [viewType] = React.useState<"default" | "oaTask">("oaTask");
  // 在 demo 中放宽类型，支持自定义扩展的视图模式（"日" | "周" | "月" | "年"）
  const [oaTaskViewMode, setOATaskViewMode] = React.useState<string>("日");
  // 时间轴单位预设：默认(走 i18n) / 短标签(WK,M) / 英文(Week,MON) / 极简(W,M)
  const [timelineUnitPreset, setTimelineUnitPreset] = React.useState<"default" | "short" | "en" | "minimal">("default"); // eslint-disable-line @typescript-eslint/no-unused-vars
  const timelineUnitLabelsPresets = React.useMemo(() => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
    default: undefined as any,
    short: { week: "WK", month: "M", quarter: "Q", day: "日" },
    en: { week: "Week", month: "MON", quarter: "Q", day: "Day" },
    minimal: { week: "W", month: "M", quarter: "Q", day: "日" },
  }), []);
  
  // 性能测试相关状态（默认启用大量数据以展示虚拟列表优化）
  const [useLargeData, setUseLargeData] = React.useState(true);
  const [parentCount, setParentCount] = React.useState(100);
  const [childrenPerParent, setChildrenPerParent] = React.useState(10);
  
  // 根据oaTaskViewMode设置viewMode
  const getViewMode = React.useCallback((): ViewMode => {
    if (viewType === "oaTask") {
      switch (oaTaskViewMode) {
        case "日":
          // 日模式：按天显示
          return ViewMode.Day;
        case "周":
          // 周模式：每列一周
          return ViewMode.Week;
        case "月":
          // 月模式：每列一月
          return ViewMode.Month;
        case "年":
          // 年模式：按季度显示（Q1-Q4）
          return ViewMode.QuarterYear;
        default:
          return ViewMode.Day;
      }
    }
    return ViewMode.Day;
  }, [oaTaskViewMode, viewType]);
  
  const [view, setView] = React.useState<ViewMode>(getViewMode());
  const [tasks, setTasks] = React.useState<Task[]>(initTasks(useLargeData, parentCount, childrenPerParent));
  const [isChecked, setIsChecked] = React.useState(true);
  const [showArrows, setShowArrows] = React.useState<boolean>(true);
  const [showTooltip, setShowTooltip] = React.useState<boolean>(true);
  const [enableTaskDrag, setEnableTaskDrag] = React.useState<boolean>(false);
  const [enableTaskResize, setEnableTaskResize] = React.useState<boolean>(true);
  const [hideTaskName, setHideTaskName] = React.useState<boolean>(true);
  const [nameColumnWidth, setNameColumnWidth] = React.useState<number>(190);
  
  // 多选列状态
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);
  const [showRowSelection, setShowRowSelection] = React.useState<boolean>(true);
  const [enableCascade, setEnableCascade] = React.useState<boolean>(true); // 是否启用级联选择
  const [checkboxBorderColor, setCheckboxBorderColor] = React.useState<string>('#1890ff'); // 新功能1：复选框边框颜色
  
  // 语言切换状态
  const [language, setLanguage] = React.useState<'zh-TW' | 'en'>('zh-TW');
  
  // 渲染完成事件状态
  const [renderCount, setRenderCount] = React.useState(0);
  const [lastRenderTime, setLastRenderTime] = React.useState<string>('');
  const [showRenderInfo, setShowRenderInfo] = React.useState(true);
  const [enableRenderCallback, setEnableRenderCallback] = React.useState(true);
  const [isRendering, setIsRendering] = React.useState(false);
  
  // 渲染完成回调
  const handleRenderComplete = React.useCallback(() => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('zh-CN', { hour12: false });
    
    setRenderCount(prev => prev + 1);
    setLastRenderTime(timestamp);
    
    // 触发动画效果
    setIsRendering(true);
    setTimeout(() => setIsRendering(false), 600);
    
    console.log('✅ Gantt 图表渲染完成！', {
      timestamp: now.toISOString(),
      taskCount: tasks.length,
      viewMode: oaTaskViewMode,
      renderCount: renderCount + 1,
    });
  }, [tasks.length, oaTaskViewMode, renderCount]);
  
  // 时间轴格式演示（当前配置的格式）
  const timelineFormatDemo = React.useMemo(() => ({
    monthFormat: 'M7',      // M7 | Mon 7 | 7月
    weekFormat: 'Week 01',  // Week 01 | W01 | 第1周
    yearMonthFormat: '2026 11Mon',  // 2026 11Mon | 2026 11M | 2026-11
  }), []);
  
  // 模拟当前登录用户（用于演示isTaskDraggable功能）
  // 注意：第一个mock数据的proposer是"张三"，其他是"何聪"
  // 所以只有proposer为"何聪"的任务才能拖动计划结束时间，第一个任务（proposer为"张三"）的右侧手柄应该被禁用
  const currentUser = React.useMemo(() => "何聪", []);

  // 自定义判断任务是否可以拖动/调整的函数
  // 只有当proposer包含当前登录用户时才可以拖动计划结束时间（plannedEnd，对应deadLine计划截止时间）
  // 如果状态是"已完成"，则不可拉伸计划结束时间
  const isTaskDraggable = React.useCallback((task: Task, action?: 'move' | 'start' | 'end' | 'actualStart' | 'actualEnd' | 'progress') => {
    const taskAny = task as any;
    let canDrag = true;
    
    // 对于"end"操作（拖动右侧手柄调整计划结束时间plannedEnd，对应deadLine计划截止时间）
    if (action === 'end') {
      // 检查状态是否为"已完成"，如果是则不允许拉伸
      let isCompleted = false;
      if (task.status) {
        if (typeof task.status === 'string') {
          isCompleted = task.status === '已完成';
        } else if (typeof task.status === 'object' && task.status.description) {
          isCompleted = task.status.description === '已完成';
        }
      }
      
      // 如果状态是"已完成"，则不允许拉伸计划结束时间
      if (isCompleted) {
        // console.log(`[isTaskDraggable] task: ${task.name}, action: ${action}, status: 已完成, result: false (已完成状态不允许拉伸)`);
        return false;
      }
      
      // 检查proposer是否包含当前登录用户
      let isProposerMatch = false;
      if (taskAny.proposer) {
        if (typeof taskAny.proposer === 'object' && taskAny.proposer.name) {
          isProposerMatch = taskAny.proposer.name === currentUser;
        } else if (typeof taskAny.proposer === 'string') {
          isProposerMatch = taskAny.proposer === currentUser;
        }
      }
      // 如果没有proposer字段，检查assignee
      if (!isProposerMatch && task.assignee) {
        isProposerMatch = task.assignee === currentUser;
      }
      
      // 只有当proposer包含当前登录用户时才允许
      const result = isProposerMatch;
      // console.log(`[isTaskDraggable] task: ${task.name}, action: ${action}, proposer: ${taskAny.proposer?.name}, currentUser: ${currentUser}, result: ${result}`);
      return result;
    }
    
    // 对于其他操作，默认允许（可以根据需要调整）
    return canDrag;
  }, [currentUser]);
  
  // 测试空数组功能
  const [testEmptyArray, setTestEmptyArray] = React.useState(false);
  
  // TitleCell 相关状态
  const [expandedTaskKeys, setExpandedTaskKeys] = React.useState<string[]>([]);
  const [useTitleCell, setUseTitleCell] = React.useState(true);
  
  // 未读列状态
  const [showUnreadColumn, setShowUnreadColumn] = React.useState(true);
  
  // 重新加载数据
  const handleReloadData = () => {
    console.time('数据加载时间');
    const newTasks = initTasks(useLargeData, parentCount, childrenPerParent);
    setTasks(newTasks);
    console.timeEnd('数据加载时间');
    alert(`已加载 ${newTasks.length} 个任务`);
  };
  
  // TitleCell 回调函数
  const handleTaskRead = (record: any) => {
    setTasks(tasks.map(t => 
      t.id === record.id ? { ...t, read: true, unread: false } as any : t
    ));
  };
  
  // 未读列点击回调
  const handleUnreadClick = (task: Task) => {
    setTasks(tasks.map(t => 
      t.id === task.id ? { ...t, unread: false, read: true } as any : t
    ));
  };
  
  const handleTaskExpand = (expanded: boolean, record: any) => {
    if (expanded) {
      setExpandedTaskKeys([...expandedTaskKeys, record.id]);
    } else {
      setExpandedTaskKeys(expandedTaskKeys.filter(key => key !== record.id));
    }
    // 同时触发甘特图的展开/折叠
    handleExpanderClick({ ...record, hideChildren: !expanded });
  };

  // 为了在 demo 中方便使用最新扩展 props，这里对 Gantt 做一次 any 断言
  
  // 当oaTaskViewMode改变时，更新viewMode
  React.useEffect(() => {
    if (viewType === "oaTask") {
      setView(getViewMode());
    }
  }, [oaTaskViewMode, viewType, getViewMode]);

  let columnWidth = 65;
  if (view === ViewMode.Year || view === ViewMode.QuarterYear) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  } else if (view === ViewMode.Day) {
    columnWidth = 80; // 日模式使用80px列宽
  } else if (view === ViewMode.DayShift) {
    columnWidth = 20; // DayShift模式（4个班次）使用较小的列宽
  }

  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map(t => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project = newTasks[newTasks.findIndex(t => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map(t =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    // console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    console.log("On Click event Id:" + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    // console.log("On expander click Id:" + task.id);
  };

  // 批量展开/折叠所有任务
  const handleBatchExpanderClick = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  // 弹框状态管理
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedParentTask, setSelectedParentTask] = React.useState<Task | null>(null);
  const [selectedEditTask, setSelectedEditTask] = React.useState<Task | null>(null);

  const handleAddTask = (parentTask: Task) => {
    // console.log("=== handleAddTask called ===");
    // console.log("Add task clicked for parent:", parentTask);
    // console.log("Current showAddModal state:", showAddModal);
    setSelectedParentTask(parentTask);
    setShowAddModal(true);
    // console.log("Set showAddModal to true");
  };

  const handleEditTask = (task: Task) => {
    console.log("Edit task clicked:", task);
    setSelectedEditTask(task);
    setShowEditModal(true);
  };

  const handleDeleteTask = (task: Task) => {
    console.log("Deleting task:", task.id);
    const conf = window.confirm(`确定要删除任务 "${task.name}" 吗？`);
    if (conf) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
  };

  // 弹框处理函数
  const handleAddModalConfirm = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `Task_${Date.now()}`,
      name: taskData.name || "新任务",
      type: taskData.type || "task",
      start: taskData.start || new Date(),
      end: taskData.end || new Date(),
      progress: taskData.progress || 0,
      project: selectedParentTask?.id,
      displayOrder: tasks.length + 1,
    };
    setTasks([...tasks, newTask]);
    setShowAddModal(false);
    setSelectedParentTask(null);
  };

  const handleEditModalConfirm = (taskData: Partial<Task>) => {
    setTasks(tasks.map(t => 
      t.id === taskData.id ? { ...t, ...taskData } : t
    ));
    setShowEditModal(false);
    setSelectedEditTask(null);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    setSelectedParentTask(null);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedEditTask(null);
  };

  // 拖动结束事件处理器 - 模拟异步API调用
  const handleTaskDragEnd = async (task: Task) => {
    console.log("Task drag ended:", task);
    
    // 模拟异步API调用
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // 模拟API调用
        console.log("Simulating API call to update task:", task.id);
        console.log("  Planned Start:", task.plannedStart);
        console.log("  Planned End:", task.plannedEnd);
        
        // 模拟90%成功率
        const success = Math.random() > 0.1;
        
        if (success) {
          console.log("✅ API call successful - task updated");
          // 成功后更新本地状态
          setTasks(prevTasks => 
            prevTasks.map(t => t.id === task.id ? task : t)
          );
          resolve(true);
        } else {
          console.log("❌ API call failed - reverting changes");
          alert("保存失败，已恢复原始状态");
          resolve(false);
        }
      }, 1000); // 模拟1秒的网络延迟
    });
  };

  // 拖动完成事件处理器 - 在拖动操作完全结束后触发（无论成功或失败）
  const handleTaskDragComplete = (task: Task, children: Task[], action: 'move' | 'start' | 'end' | 'actualStart' | 'actualEnd' | 'progress') => {
    console.log("🎯 Task drag complete! Action:", action);
    console.log("  Task ID:", task.id);
    console.log("  Task Name:", task.name);
    console.log("  Children count:", children.length);
    console.log("  Final state:", {
      plannedStart: task.plannedStart,
      plannedEnd: task.plannedEnd,
      actualStart: task.actualStart,
      actualEnd: task.actualEnd,
      progress: task.progress,
    });
  };

  // 获取某个任务的所有子任务（递归）
  const getAllChildren = (parentId: string): Task[] => {
    const children: Task[] = [];
    const directChildren = tasks.filter(t => t.project === parentId);
    
    directChildren.forEach(child => {
      children.push(child);
      // 递归获取子任务的子任务
      const grandChildren = getAllChildren(child.id);
      children.push(...grandChildren);
    });
    
    return children;
  };

  // 获取某个任务的直接子任务
  const getDirectChildren = (parentId: string): Task[] => {
    return tasks.filter(t => t.project === parentId);
  };

  // 多选列变化处理（支持级联选择）
  const handleRowSelectionChange = (selectedKeys: string[], selectedRows: Task[]) => {
    console.log("原始选中的任务 IDs:", selectedKeys);
    console.log("原始选中的任务:", selectedRows);
    
    // 如果未启用级联选择，直接设置
    if (!enableCascade) {
      setSelectedRowKeys(selectedKeys);
      return;
    }
    
    // 计算应该添加或移除的 keys
    const previousKeys = new Set(selectedRowKeys);
    const newKeys = new Set(selectedKeys);
    
    // 找出新增的和移除的 keys
    const addedKeys = selectedKeys.filter(key => !previousKeys.has(key));
    const removedKeys = selectedRowKeys.filter(key => !newKeys.has(key));
    
    let finalKeys = [...selectedKeys];
    
    // 处理新增的任务 - 自动选中所有子任务
    addedKeys.forEach(addedKey => {
      const children = getAllChildren(addedKey);
      const childrenKeys = children.map(c => c.id);
      // 添加所有子任务的 keys
      childrenKeys.forEach(childKey => {
        if (!finalKeys.includes(childKey)) {
          finalKeys.push(childKey);
        }
      });
    });
    
    // 处理移除的任务 - 自动取消所有子任务
    removedKeys.forEach(removedKey => {
      const children = getAllChildren(removedKey);
      const childrenKeys = children.map(c => c.id);
      // 移除所有子任务的 keys
      finalKeys = finalKeys.filter(key => 
        key !== removedKey && !childrenKeys.includes(key)
      );
    });
    
    // 反向级联：检查父任务 - 如果所有子任务都被选中，自动选中父任务
    const checkAndSelectParents = (keys: string[]): string[] => {
      let resultKeys = [...keys];
      const keysSet = new Set(resultKeys);
      
      // 获取所有可能的父任务
      const allParentIds = new Set(
        tasks
          .filter(t => t.project)
          .map(t => t.project!)
      );
      
      allParentIds.forEach(parentId => {
        // 如果父任务已经被选中，跳过
        if (keysSet.has(parentId)) return;
        
        // 获取该父任务的所有直接子任务
        const children = getDirectChildren(parentId);
        if (children.length === 0) return;
        
        // 检查是否所有子任务都被选中
        const allChildrenSelected = children.every(child => keysSet.has(child.id));
        
        if (allChildrenSelected) {
          // 所有子任务都被选中，自动选中父任务
          resultKeys.push(parentId);
          keysSet.add(parentId);
        }
      });
      
      return resultKeys;
    };
    
    // 递归检查并选中父任务（可能需要多层级联）
    let previousLength = 0;
    let currentKeys = finalKeys;
    
    // 最多递归10层，防止无限循环
    for (let i = 0; i < 10; i++) {
      currentKeys = checkAndSelectParents(currentKeys);
      if (currentKeys.length === previousLength) break;
      previousLength = currentKeys.length;
    }
    
    console.log("级联后的任务 IDs:", currentKeys);
    setSelectedRowKeys(currentKeys);
  };

  // 批量删除选中的任务
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      alert("请先选择要删除的任务");
      return;
    }
    
    const conf = window.confirm(`确定要删除选中的 ${selectedRowKeys.length} 个任务吗？`);
    if (conf) {
      const newTasks = tasks.filter(t => !selectedRowKeys.includes(t.id));
      setTasks(newTasks);
      setSelectedRowKeys([]);
      alert(`已删除 ${selectedRowKeys.length} 个任务`);
    }
  };

  // 添加演示模式切换
  const [demoMode, setDemoMode] = React.useState<'original' | 'new' | 'oa'>('oa');

  return (
    <div className="Wrapper">
      {/* 演示模式切换 */}
      <div style={{ 
        marginBottom: 16, 
        padding: '12px', 
        backgroundColor: '#fff7e6', 
        borderRadius: '4px',
        border: '1px solid #ffd591'
      }}>
        <div style={{ marginBottom: 8, fontWeight: 'bold', fontSize: '14px', color: '#d46b08' }}>
          🎯 演示模式切换
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button 
            type={demoMode === 'oa' ? 'primary' : 'default'}
            onClick={() => setDemoMode('oa')}
          >
            OA任务模式（接口模拟）
          </Button>
          <Button 
            type={demoMode === 'new' ? 'primary' : 'default'}
            onClick={() => setDemoMode('new')}
          >
            新版 OA 任务模式（推荐）
          </Button>
          <Button 
            type={demoMode === 'original' ? 'primary' : 'default'}
            onClick={() => setDemoMode('original')}
          >
            原始完整演示
          </Button>
          <span style={{ color: '#666', fontSize: '12px' }}>
            当前模式：{demoMode === 'oa' ? 'OA任务模式（接口模拟）' : demoMode === 'new' ? '新版 OA 任务模式（带周视图）' : '原始完整演示'}
          </span>
        </div>
      </div>

      {demoMode === 'oa' ? (
        <OAGanttDemo />
      ) : demoMode === 'new' ? (
        <GanttChartDemo />
      ) : (
        <>
          {/* 渲染完成事件演示面板 */}
      {showRenderInfo && (
        <div style={{ 
          marginBottom: 16, 
          padding: '12px', 
          backgroundColor: isRendering ? '#e6fffb' : '#f6ffed', 
          borderRadius: '4px',
          border: isRendering ? '2px solid #13c2c2' : '1px solid #b7eb8f',
          position: 'relative',
          transition: 'all 0.3s ease',
          boxShadow: isRendering ? '0 0 12px rgba(19, 194, 194, 0.4)' : 'none'
        }}>
          <button
            onClick={() => setShowRenderInfo(false)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#52c41a',
              padding: '0 4px',
            }}
            title="关闭"
          >
            ×
          </button>
          <div style={{ marginBottom: 8, fontWeight: 'bold', fontSize: '14px', color: isRendering ? '#13c2c2' : '#52c41a', transition: 'color 0.3s ease' }}>
            {isRendering ? '⚡' : '🎯'} 渲染完成事件 (onRenderComplete) 演示
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="checkbox"
                checked={enableRenderCallback}
                onChange={e => setEnableRenderCallback(e.target.checked)}
              />
              启用渲染完成回调
            </label>
            
            <div style={{ 
              padding: '4px 12px', 
              backgroundColor: '#fff', 
              borderRadius: '4px',
              border: '1px solid #d9d9d9',
              fontSize: '13px',
              transition: 'transform 0.3s ease',
              transform: isRendering ? 'scale(1.1)' : 'scale(1)'
            }}>
              <span style={{ color: '#666' }}>渲染次数：</span>
              <span style={{ 
                color: '#52c41a', 
                fontWeight: 'bold',
                fontSize: '16px',
                marginLeft: '4px'
              }}>
                {renderCount}
              </span>
            </div>
            
            {lastRenderTime && (
              <div style={{ 
                padding: '4px 12px', 
                backgroundColor: isRendering ? '#e6fffb' : '#fff', 
                borderRadius: '4px',
                border: isRendering ? '1px solid #13c2c2' : '1px solid #d9d9d9',
                fontSize: '13px',
                transition: 'all 0.3s ease'
              }}>
                <span style={{ color: '#666' }}>最后渲染：</span>
                <span style={{ 
                  color: isRendering ? '#13c2c2' : '#1890ff', 
                  fontWeight: 'bold',
                  marginLeft: '4px'
                }}>
                  {lastRenderTime}
                </span>
              </div>
            )}
            
            {isRendering && (
              <div style={{ 
                padding: '4px 12px', 
                backgroundColor: '#fff1f0', 
                borderRadius: '4px',
                border: '1px solid #ffccc7',
                fontSize: '13px',
                color: '#cf1322',
                fontWeight: 'bold',
                animation: 'pulse 0.6s ease'
              }}>
                ⚡ 正在渲染...
              </div>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}>
            💡 提示：切换视图模式、滚动、加载数据时，会触发 <code style={{ 
              backgroundColor: '#fff1f0', 
              border: '1px solid #ffccc7', 
              padding: '2px 6px', 
              borderRadius: '3px',
              color: '#cf1322',
              fontFamily: 'monospace'
            }}>onRenderComplete</code> 事件。<br/>
            可在控制台查看详细日志信息。
          </div>
        </div>
      )}
      
      {/* 时间轴格式演示面板 */}
      <div style={{ 
        marginBottom: 16, 
        padding: '12px', 
        backgroundColor: '#fff7e6', 
        borderRadius: '4px',
        border: '1px solid #ffd591'
      }}>
        <div style={{ marginBottom: 8, fontWeight: 'bold', fontSize: '14px', color: '#d46b08' }}>
          🎨 时间轴格式演示（可配置）
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: 12, lineHeight: '1.6' }}>
          💡 提示：切换不同视图模式查看效果。格式可在 <code style={{ 
            backgroundColor: '#fff1f0', 
            border: '1px solid #ffccc7', 
            padding: '2px 6px', 
            borderRadius: '3px',
            color: '#cf1322'
          }}>src/i18n/index.ts</code> 中自定义。
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
          {/* 月份格式 */}
          <div style={{ 
            padding: '8px', 
            backgroundColor: '#fff', 
            borderRadius: '4px',
            border: '1px solid #ffd591'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#d46b08' }}>
              📅 月模式 - 月份格式
            </div>
            <div style={{ fontSize: '11px', color: '#999', marginBottom: 6 }}>
              当前：<span style={{ color: '#fa8c16', fontWeight: 'bold' }}>{timelineFormatDemo.monthFormat}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              示例：M1, M2, M7, M12<br/>
              配置：<code>monthLabel: (m) =&gt; `M${'{'}m+1{'}'}`</code>
            </div>
          </div>
          
          {/* 周标签格式 */}
          <div style={{ 
            padding: '8px', 
            backgroundColor: '#fff', 
            borderRadius: '4px',
            border: '1px solid #ffd591'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#d46b08' }}>
              📆 日/周模式 - 周标签格式
            </div>
            <div style={{ fontSize: '11px', color: '#999', marginBottom: 6 }}>
              当前：<span style={{ color: '#fa8c16', fontWeight: 'bold' }}>{timelineFormatDemo.weekFormat}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              示例：Week 01, Week 02, Week 52<br/>
              配置：<code>weekLabel: (w) =&gt; `Week ${'{'}w.padStart(2,'0'){'}'}`</code>
            </div>
          </div>
          
          {/* 年月格式 */}
          <div style={{ 
            padding: '8px', 
            backgroundColor: '#fff', 
            borderRadius: '4px',
            border: '1px solid #ffd591'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#d46b08' }}>
              🗓️ 周模式 - 年月格式
            </div>
            <div style={{ fontSize: '11px', color: '#999', marginBottom: 6 }}>
              当前：<span style={{ color: '#fa8c16', fontWeight: 'bold' }}>{timelineFormatDemo.yearMonthFormat}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              示例：2026 01Mon, 2026 11Mon<br/>
              配置：<code>yearMonthLabel: (y,m) =&gt; `${'{'}y{'}'} ${'{'}m+1{'}'}Mon`</code>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: 12, padding: '8px', backgroundColor: '#fffbe6', borderRadius: '4px', fontSize: '11px' }}>
          <strong>其他可用格式：</strong><br/>
          • 月份：Mon 7, 7月, 07<br/>
          • 周：W01, 第1周, #01<br/>
          • 年月：2026 11M, 2026-11, 2026/11
        </div>
      </div>
      
      {/* 多选列演示控制面板 */}
      <div style={{ 
        marginBottom: 16, 
        padding: '12px', 
        backgroundColor: '#e6f7ff', 
        borderRadius: '4px',
        border: '1px solid #91d5ff'
      }}>
        <div style={{ marginBottom: 8, fontWeight: 'bold', fontSize: '14px' }}>
          ✅ 多选列功能演示 + ✨ 新功能
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="checkbox"
              checked={showRowSelection}
              onChange={e => setShowRowSelection(e.target.checked)}
            />
            显示多选列
          </label>
          
          {/* 新功能1：复选框颜色自定义 */}
          {showRowSelection && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>复选框颜色：</span>
              <input
                type="color"
                value={checkboxBorderColor}
                onChange={e => setCheckboxBorderColor(e.target.value)}
                style={{ width: '40px', height: '24px', cursor: 'pointer', border: '1px solid #d9d9d9', borderRadius: '4px' }}
              />
              <span style={{ fontSize: '12px', color: '#666' }}>{checkboxBorderColor}</span>
            </label>
          )}
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="checkbox"
              checked={enableCascade}
              onChange={e => setEnableCascade(e.target.checked)}
              disabled={!showRowSelection}
            />
            启用级联选择
          </label>
          
          <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
            已选择：{selectedRowKeys.length} 个任务
          </span>
          
          <Button 
            type="primary" 
            danger
            size="small" 
            onClick={handleBatchDelete}
            disabled={selectedRowKeys.length === 0}
          >
            批量删除 ({selectedRowKeys.length})
          </Button>
          
          <Button 
            size="small" 
            onClick={() => setSelectedRowKeys([])}
            disabled={selectedRowKeys.length === 0}
          >
            清空选择
          </Button>
        </div>
        {enableCascade && (
          <div style={{ marginTop: 8, fontSize: '12px', color: '#52c41a', fontStyle: 'italic' }}>
            💡 级联选择已启用：选中父任务会自动选中所有子任务
          </div>
        )}
        {selectedRowKeys.length > 0 && (
          <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
            选中的任务 IDs: {selectedRowKeys.join(", ")}
          </div>
        )}
      </div>
      
      {/* 新功能说明 */}
      <div style={{ 
        margin: '12px 0', 
        padding: '12px', 
        backgroundColor: '#f0f9ff', 
        borderRadius: '4px',
        border: '1px solid #91caff',
        fontSize: '12px',
        lineHeight: '1.8'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#0958d9', fontSize: '14px' }}>
          ✨ 新功能展示说明
        </div>
        <div><strong>1️⃣ 复选框颜色自定义：</strong> 使用上方的颜色选择器可以自定义多选框的颜色（当前：{checkboxBorderColor}）</div>
        <div><strong>2️⃣ 时间自动规范化：</strong> 任务的结束时间会自动设为当天23:59:59，条形图占满整格（无需配置，自动生效）</div>
        <div><strong>3️⃣ 任务标题列表头：</strong> 通过 taskTitleHeaderRender 自定义表头内容（可加图标），点击表头 ℹ️ 可调接口等</div>
        <div><strong>4️⃣ TitleCell 自定义渲染：</strong> 
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: 8 }}>
            <input
              type="checkbox"
              checked={useTitleCell}
              onChange={e => setUseTitleCell(e.target.checked)}
            />
            启用自定义任务名列（包含未读标记、关注、跟进、延期等功能）
          </label>
        </div>
        <div><strong>5️⃣ 未读列功能：</strong> 
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: 8 }}>
            <input
              type="checkbox"
              checked={showUnreadColumn}
              onChange={e => setShowUnreadColumn(e.target.checked)}
            />
            显示未读列（在任务名左侧，用红色 * 表示未读）
          </label>
        </div>
        <div><strong>6️⃣ 表头自定义渲染 columnHeaderRenderers：</strong> 类似 Ant Design 表格，可自定义状态/负责人/操作等列表头（如状态列带 ⓘ 图标）</div>
        <div><strong>7️⃣ 时间轴标题自定义 timelineHeaderCellRender：</strong> 可自定义时间轴每个格子的渲染（支持日/周/月模式，通过 level 参数区分上下层）</div>
        <div><strong>8️⃣ 多选列自定义 columnTitle：</strong> rowSelection.columnTitle 可自定义多选列表头（如「全选」）</div>
        <div><strong>9️⃣ 水平滚动修复：</strong> 滚动水平滚动条时，起始时间轴不再跳动（内部修复）</div>
        <div><strong>🔟 拖动后 delayDays 同步：</strong> 拖动任务条后，返回的 task.delayDays 与条形图显示的延期天数一致（内部修复）</div>
        <div><strong>1️⃣1️⃣ 渲染完成事件：</strong> onRenderComplete 回调，在图表完全渲染后触发（可用于截图、导出、性能监控等）</div>
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #91caff' }}>
          <strong>🎨 时间轴格式自定义（最新）：</strong>
          <div style={{ marginLeft: '16px', marginTop: '4px' }}>
            • <strong>月份格式：</strong>月模式下显示 M1, M2, M7（可配置为 Mon 7, 7月等）<br/>
            • <strong>周标签格式：</strong>日/周模式下显示 Week 01, Week 02（可配置为 W01, 第1周等）<br/>
            • <strong>年月格式：</strong>周模式母表头显示 2026 11Mon（可配置为 2026 11M, 2026-11等）<br/>
            • <strong>垂直居中：</strong>所有时间轴标签完美垂直居中，并暴露独立CSS类可自定义样式
          </div>
        </div>
      </div>
      
      {/* 性能测试数据控制面板 */}
      <div style={{ 
        marginBottom: 16, 
        padding: '12px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '4px',
        border: '1px solid #d9d9d9'
      }}>
        <div style={{ marginBottom: 8, fontWeight: 'bold', fontSize: '14px' }}>
          🚀 性能测试数据配置 (当前任务数: {tasks.length})
          {tasks.length > 50 && (
            <span style={{ marginLeft: 8, color: '#52c41a', fontSize: '12px', fontWeight: 'normal' }}>
              ✓ 虚拟列表已启用（仅渲染可见行，提升滚动性能）
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="checkbox"
              checked={useLargeData}
              onChange={e => setUseLargeData(e.target.checked)}
            />
            使用大量测试数据
          </label>
          
          {useLargeData && (
            <>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                父任务数:
                <InputNumber
                  size="small"
                  min={1}
                  max={1000}
                  value={parentCount}
                  onChange={(value) => setParentCount(value || 100)}
                  style={{ width: '80px' }}
                />
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                每个父任务的子任务数:
                <InputNumber
                  size="small"
                  min={0}
                  max={50}
                  value={childrenPerParent}
                  onChange={(value) => setChildrenPerParent(value || 10)}
                  style={{ width: '80px' }}
                />
              </label>
              
              <span style={{ color: '#666', fontSize: '12px' }}>
                = {parentCount + parentCount * childrenPerParent} 个任务
              </span>
            </>
          )}
          
          <Button 
            type="primary" 
            size="small" 
            onClick={handleReloadData}
          >
            重新加载数据
          </Button>
        </div>
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <Button size="small" onClick={() => ganttRef.current?.scrollToDate(new Date(), { align: "center" })}>滚动到今天(居中)</Button>
        <Button size="small" style={{ marginLeft: 8 }} onClick={() => ganttRef.current?.scrollToDate(new Date(new Date().getTime() - 24*3600*1000), { align: "start" })}>滚到昨天(开始)</Button>
        <Button size="small" style={{ marginLeft: 8 }} onClick={() => ganttRef.current?.scrollToDate(new Date(new Date().getTime() + 24*3600*1000), { align: "end" })}>滚到明天(末尾)</Button>
        {viewType === "oaTask" && (
        <>
            <Button 
            size="small" 
            style={{ marginLeft: 8 }} 
            type={oaTaskViewMode === "日" ? "primary" : "default"}
            onClick={() => setOATaskViewMode("日")}
            >
            日
            </Button>
            <Button 
            size="small" 
            style={{ marginLeft: 8 }} 
            type={oaTaskViewMode === "周" ? "primary" : "default"}
            onClick={() => setOATaskViewMode("周")}
            >
            周
            </Button>
            <Button 
            size="small" 
            style={{ marginLeft: 8 }} 
            type={oaTaskViewMode === "月" ? "primary" : "default"}
            onClick={() => setOATaskViewMode("月")}
            >
            月
            </Button>
            <Button 
            size="small" 
            style={{ marginLeft: 8 }} 
            type={oaTaskViewMode === "年" ? "primary" : "default"}
            onClick={() => setOATaskViewMode("年")}
            >
            年
            </Button>
            <Button 
              size="small" 
              style={{ marginLeft: 8 }} 
              onClick={() => ganttRef.current?.enterFullscreen?.()}
            >
              全屏
            </Button>
            <Button 
              size="small" 
              style={{ marginLeft: 8 }} 
              onClick={() => ganttRef.current?.exportImage?.("gantt-chart.png")}
            >
              导出PNG
            </Button>
            <span style={{ marginLeft: 16, marginRight: 6 }}>时间轴单位：</span>
            <Button size="small" type={timelineUnitPreset === "default" ? "primary" : "default"} onClick={() => setTimelineUnitPreset("default")}>默认</Button>
            <Button size="small" style={{ marginLeft: 4 }} type={timelineUnitPreset === "short" ? "primary" : "default"} onClick={() => setTimelineUnitPreset("short")}>WK / M</Button>
            <Button size="small" style={{ marginLeft: 4 }} type={timelineUnitPreset === "en" ? "primary" : "default"} onClick={() => setTimelineUnitPreset("en")}>Week / MON</Button>
            <Button size="small" style={{ marginLeft: 4 }} type={timelineUnitPreset === "minimal" ? "primary" : "default"} onClick={() => setTimelineUnitPreset("minimal")}>W / M</Button>
            <Button 
              size="small" 
              style={{ marginLeft: 16 }} 
              type={language === 'zh-TW' ? "primary" : "default"}
              onClick={() => setLanguage('zh-TW')}
            >
              繁體中文
            </Button>
            <Button 
              size="small" 
              style={{ marginLeft: 8 }} 
              type={language === 'en' ? "primary" : "default"}
              onClick={() => setLanguage('en')}
            >
              English
            </Button>
          </>
        )}
      </div>
      {viewType === "default" && (
        <ViewSwitcher
          onViewModeChange={viewMode => setView(viewMode)}
          onViewListChange={setIsChecked}
          isChecked={isChecked}
        />
      )}
      {/* 箭头开关示例 */}
      <div style={{ margin: "8px 0" }}>
        <label style={{ marginRight: 8 }}>显示任务依赖箭头：</label>
        <input
          type="checkbox"
          checked={showArrows}
          onChange={e => setShowArrows(e.target.checked)}
        />
        <label style={{ marginLeft: 16, marginRight: 8 }}>显示悬浮信息框：</label>
        <input
          type="checkbox"
          checked={showTooltip}
          onChange={e => setShowTooltip(e.target.checked)}
        />
      </div>
      {/* 拖动和拉伸控制 */}
      <div style={{ margin: "8px 0" }}>
        <label style={{ marginRight: 8 }}>允许整体拖动：</label>
        <input
          type="checkbox"
          checked={enableTaskDrag}
          onChange={e => setEnableTaskDrag(e.target.checked)}
        />
        <label style={{ marginLeft: 16, marginRight: 8 }}>允许拉伸调整时间：</label>
        <input
          type="checkbox"
          checked={enableTaskResize}
          onChange={e => setEnableTaskResize(e.target.checked)}
        />
        <label style={{ marginLeft: 16, marginRight: 8 }}>隐藏条形图任务名：</label>
        <input
          type="checkbox"
          checked={hideTaskName}
          onChange={e => setHideTaskName(e.target.checked)}
        />
        <label style={{ marginLeft: 16, marginRight: 8 }}>测试空数组：</label>
        <input
          type="checkbox"
          checked={testEmptyArray}
          onChange={e => setTestEmptyArray(e.target.checked)}
        />
      </div>
      {/* 任务名列宽控制 */}
      <div style={{ margin: "8px 0", display: "flex", alignItems: "center", gap: "12px" }}>
        <label>任务名列宽度：</label>
        <InputNumber
          size="small"
          min={100}
          max={500}
          value={nameColumnWidth}
          onChange={(value) => setNameColumnWidth(value || 190)}
          style={{ width: '100px' }}
          addonAfter="px"
        />
        <Button 
          size="small" 
          onClick={() => setNameColumnWidth(190)}
        >
          重置为默认(190px)
        </Button>
        <span style={{ color: '#666', fontSize: '12px' }}>
          当前宽度: {nameColumnWidth}px（适用于OA模式的任务标题列）
        </span>
      </div>
      <Gantt
        // 需要依赖库版本包含 forwardRef 才可生效
        // @ts-ignore
        ref={ganttRef}
        tasks={testEmptyArray ? [] : tasks}
        viewMode={view}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        onBatchExpanderClick={handleBatchExpanderClick}
        listCellWidth={isChecked ? "140px" : ""}
        nameColumnWidth={`${nameColumnWidth}px`}
        // 自定义时间刻度边框
        gridBorderWidth={1}
        gridBorderColor="#f0f0f0"
        // 语言设置
        language={language}
        timeColumnLabels={{  // [i18n] 时间列标题
          plannedStart: "Planned Start",
          plannedEnd: "Planned End",
          plannedDuration: "Duration (Days)",
          actualStart: "Actual Start",
          actualEnd: "Actual End",
        }}
        timeColumnWidths={{
          plannedStart: "170px",
          plannedEnd: "170px",
          plannedDuration: "120px",
          actualStart: "170px",
          actualEnd: "170px",
        }}
        ganttHeight={298}
        columnWidth={columnWidth}
        // 自定义左侧表头高度：42px
        tableStyles={{
          headerHeight: 42,
        }}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        // 演示操作列默认渲染，及自定义渲染能力
        operationsColumnWidth="140px"
        operationsColumnLabel="操作"  // [i18n]
        showOperationsColumn={true}
        // 演示箭头开关
        showArrows={showArrows}
        // 显示悬浮信息框开关
        showTooltip={showTooltip}
        // 拖动和拉伸控制
        enableTaskDrag={enableTaskDrag}
        enableTaskResize={enableTaskResize}
        // 隐藏条形图任务名
        hideTaskName={hideTaskName}
        onTaskDragEnd={handleTaskDragEnd}
        onTaskDragComplete={handleTaskDragComplete}
        // 渲染完成回调（根据开关控制是否启用）
        onRenderComplete={enableRenderCallback ? handleRenderComplete : undefined}
        // 自定义禁用规则：只有当proposer包含当前登录用户时才可以拖动
        isTaskDraggable={isTaskDraggable}
        // 自定义展开/折叠图标：折叠状态显示向右▶，展开状态显示向下▼
        expandIcon={<CaretDownOutlined style={{ fontSize: '14px' }} />}
        collapseIcon={<CaretRightOutlined style={{ fontSize: '14px' }} />}
        // 演示自定义列渲染 + 溢出信息
        columnEllipsisMaxChars={{
          name: 12,
          status: 6,
          assignee: 8,
        }}
        columnRenderers={{
          unread: (task: Task, meta: { value: boolean; displayValue: React.ReactNode }) => {
            if (!meta.value) return null;
            return (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnreadClick(task);
                }}
                style={{ 
                  color: 'red', 
                  fontWeight: 'bold', 
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'inline-block',
                  lineHeight: 1
                }}
                title="点击标记为已读"
              >
                *
              </span>
            );
          },
          name: useTitleCell 
            ? (task: Task) => {
                // 将 Task 转换为 TitleCell 需要的 record 格式
                const record = {
                  ...(task as any),
                  id: task.id,
                };
                return (
                  <TitleCell
                    value={task.name}
                    record={record}
                    expandedRowKeys={expandedTaskKeys}
                    onRead={handleTaskRead}
                    onAdd={(taskId) => {
                      const taskToAdd = tasks.find(t => t.id === taskId);
                      if (taskToAdd) handleAddTask(taskToAdd);
                    }}
                    onCheck={(rec, operate) => {
                      console.log("查看任务:", rec, operate);
                      handleEditTask(rec);
                    }}
                    onExpand={handleTaskExpand}
                  />
                );
              }
            : (task: Task, meta: { value: string; displayValue: string; isOverflow: boolean; maxLength: number }) => (
                <span
                  style={{ 
                    color: "#1677ff",
                    display: "inline-block",
                    maxWidth: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                  title={task.name}
                >
                  {meta.displayValue}
                </span>
              ),
          status: (task: Task) => {
            // 如果 status 是对象，渲染带颜色的文本
            if (task.status && typeof task.status === 'object') {
              const statusObj = task.status as { color: string; description: string };
              return (
                <span style={{ color: statusObj.color }}>
                  {statusObj.description}
                </span>
              );
            }
            // 否则直接返回状态文本
            return <span>{String(task.status || '')}</span>;
          },
          operations: (task: Task) => (
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleEditTask(task);
                }}
              >
                编辑
              </a>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleAddTask(task);
                }}
              >
                新增子任务
              </a>
            </div>
          ),
        }}
        // onCellOverflow={({ column, task }: { column: "name" | "status" | "assignee"; task: Task }) => {
        //   console.log("列内容溢出:", column, "任务:", task.name);
        // }}
        viewType={viewType}
        oaTaskViewMode={oaTaskViewMode as any}
        {...(timelineUnitLabelsPresets[timelineUnitPreset] && {
          timelineUnitLabels: timelineUnitLabelsPresets[timelineUnitPreset],
        } as any)}
        onOATaskViewModeChange={(mode) => {
          setOATaskViewMode(mode as any);
        }}
        // [i18n] 多选列：columnTitle "全选"
        rowSelection={
          showRowSelection
            ? ({
                selectedRowKeys,
                onChange: handleRowSelectionChange,
                rowKey: "id",
                columnWidth: "50px",
                columnTitle: <div>全选</div>,
                showSelectAll: true,
                checkboxBorderColor,
              } as any)
            : undefined
        }
        // [i18n] 表头：status/assignee/operations 的 defaultLabel（狀態、負責人、操作）
        columnHeaderRenderers={{
          status: ({ defaultLabel }) => (
            <span title="任务状态列">
              {defaultLabel}
              <span style={{ marginLeft: 4, color: '#1890ff', cursor: 'pointer' }}>ⓘ</span>
            </span>
          ),
          assignee: ({ defaultLabel }) => (
            <span title="负责人列">{defaultLabel}</span>
          ),
          operations: ({ defaultLabel }) => (
            <span title="操作列">{defaultLabel}</span>
          ),
        }}
        // [i18n] 时间轴：日期格式 "X日"、周格式 defaultLabel "第X周"
        // 日模式下，悬浮底部日期刻度时，显示完整日期，如“2026年2月3日”
        // [i18n] 时间轴：日期格式 "X日"、周格式 defaultLabel "第X周"
        // 当选择了「时间轴单位」预设(非默认)时，直接显示 defaultLabel，便于查看 timelineUnitLabels 效果
        timelineHeaderCellRender={({ date, defaultLabel, level, oaTaskViewMode }) => {
          const fullDateLabel = dayjs(date).format("YYYY/M/D");
          let displayLabel = defaultLabel;
          const customStyle: React.CSSProperties = { fontSize: 12, fill: "#333", fontWeight: 400 };
          // 使用时间轴单位预设时，直接显示 defaultLabel（已由 timelineUnitLabels 生成）
          if (timelineUnitPreset !== "default") {
            return (
              <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" style={customStyle}>
                {oaTaskViewMode === "日" && level === "bottom" && <title>{fullDateLabel}</title>}
                {defaultLabel}
              </text>
            );
          }
          // 根据模式和层级自定义显示内容（默认预设）
          if (oaTaskViewMode === "日") {
            if (level === "bottom") {
              // 日模式底部：仅显示日期数字
              displayLabel = `${date.getDate()}`;
            } else {
              // 日模式顶部：周标签，自定义格式为 "WK23"
              // defaultLabel 格式为 "Week 23" 或 "第23周"，提取数字部分
              const weekNum = defaultLabel.match(/\d+/)?.[0] || "01";
              displayLabel = `WK${weekNum.padStart(2, '0')}`;
            }
          } else if (oaTaskViewMode === "周") {
            if (level === "bottom") {
              // 周模式底部：周标签，自定义格式为 "WK01"
              // defaultLabel 格式为 "Week 01" 或 "第01周"，提取数字部分
              const weekNum = defaultLabel.match(/\d+/)?.[0] || "01";
              displayLabel = `WK${weekNum.padStart(2, '0')}`;
            } else {
              // 周模式顶部：年月标签，自定义格式为 "2025 06M"
              // defaultLabel 格式为 "2025 06Mon"，将 "Mon" 替换为 "M"
              displayLabel = defaultLabel.replace(/Mon$/, 'M');
            }
          } else if (oaTaskViewMode === "月") {
            if (level === "bottom") {
              // 月模式底部：月份标签，可以自定义格式
              displayLabel = defaultLabel; // 默认是 "M1"，可改为 "1月" 等
            } else {
              // 月模式顶部：年份标签
              displayLabel = defaultLabel; // 默认是年份数字
            }
          }
          
          return (
            <text
              x={0}
              y={0}
              textAnchor="middle"
              dominantBaseline="middle"
              style={customStyle}
            >
              {/* 仅在日视图底部刻度上添加悬浮提示 */}
              {oaTaskViewMode === "日" && level === "bottom" && (
                <title>{fullDateLabel}</title>
              )}
              {displayLabel}
            </text>
          );
        }}
        // [i18n] 任务标题列表头：titleText "任務標題"
        taskTitleHeaderRender={({ expandCollapseNode, titleText }) => (
          <>
            {expandCollapseNode}
            <span>{titleText}</span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                Modal.info({
                  title: '任务标题列表头图标',
                  content: '点击了表头图标，可在此处调接口或执行其他操作。',
                });
              }}
              style={{ marginLeft: 8, cursor: 'pointer', color: '#1890ff', display: 'inline-flex', alignItems: 'center' }}
              title="点击调接口"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 5 L8 9 M8 11 L8 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </>
        )}
        // [i18n] 未读列：title
        unreadColumn={{
          show: showUnreadColumn,
          width: "20px",
          title: " ",
        }}
      />
      
      {/* 新增任务弹框 */}
      {showAddModal && selectedParentTask && (
        <AddTaskModal
          isOpen={showAddModal}
          onClose={handleAddModalClose}
          parentTaskId={selectedParentTask.id}
          onConfirm={handleAddModalConfirm}
        />
      )}
      
      {/* 编辑任务弹框 */}
      {showEditModal && selectedEditTask && (
        <EditTaskModal
          isOpen={showEditModal}
          onClose={handleEditModalClose}
          task={selectedEditTask}
          onConfirm={handleEditModalConfirm}
        />
      )}
        </>
      )}
    </div>
  );
};

export default App;
