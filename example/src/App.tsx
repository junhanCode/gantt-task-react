import React from "react";
import { Task, Gantt } from "gantt-task-react";
import {
  GanttConfigurator,
  GanttConfig,
  DEFAULT_GANTT_CONFIG,
  getTimeColumnWidths,
} from "./components/gantt-configurator";
import { getStartEndDateForProject, initTasks } from "./helper";
import "gantt-task-react/dist/index.css";
import { Modal, Input, Select, Button, DatePicker, InputNumber, Form, message } from "antd";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

// 新增任务弹框组件
const AddTaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  parentTaskId: string | number;
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
      const taskData: Partial<Task> = {
        name: values.name,
        type: values.type,
        start: values.dateRange[0].toDate(),
        end: values.dateRange[1].toDate(),
        // 计划时间
        plannedStart: values.plannedDateRange ? values.plannedDateRange[0].toDate() : values.dateRange[0].toDate(),
        plannedEnd: values.plannedDateRange ? values.plannedDateRange[1].toDate() : values.dateRange[1].toDate(),
        // 实际时间
        actualStart: values.actualDateRange ? values.actualDateRange[0].toDate() : values.dateRange[0].toDate(),
        actualEnd: values.actualDateRange ? values.actualDateRange[1].toDate() : values.dateRange[1].toDate(),
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
  onConfirm: (taskData: Partial<Task>) => boolean | void;
}> = ({ isOpen, onClose, task, onConfirm }) => {
  // 计算时间跨度（天数）
  const calcDuration = (start: Date, end: Date) =>
    Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const initDuration = calcDuration(
    task.plannedStart ?? task.start,
    task.plannedEnd ?? task.end
  );

  const [form] = Form.useForm();
  const [plannedDuration, setPlannedDuration] = React.useState<number>(initDuration);

  // 文本/数字字段用 initialValues 同步初始化
  const initialValues = {
    name: task.name,
    type: task.type,
    progress: task.progress,
    plannedDuration: initDuration,
  };

  // 日期选择器字段在挂载后用 setFieldsValue 回填，否则 RangePicker 不响应 initialValues
  React.useEffect(() => {
    form.setFieldsValue({
      plannedDateRange: task.plannedStart && task.plannedEnd
        ? [dayjs(task.plannedStart), dayjs(task.plannedEnd)]
        : undefined,
      actualDateRange: task.actualStart && task.actualEnd
        ? [dayjs(task.actualStart), dayjs(task.actualEnd)]
        : undefined,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当计划时间范围改变时，更新时间跨度
  const handlePlannedDateRangeChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      const duration = calcDuration(dates[0].toDate(), dates[1].toDate());
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
      const plannedStart = values.plannedDateRange?.[0]?.toDate();
      const plannedEnd   = values.plannedDateRange?.[1]?.toDate();
      const taskData: Partial<Task> = {
        id: task.id,
        name: values.name,
        type: values.type,
        // 同步 start/end，使甘特条联动
        start: plannedStart ?? task.start,
        end:   plannedEnd   ?? task.end,
        plannedStart,
        plannedEnd,
        actualStart: values.actualDateRange?.[0]?.toDate(),
        actualEnd:   values.actualDateRange?.[1]?.toDate(),
        progress: values.progress || 0,
      };
      // onConfirm 返回 false 时保持弹框开启（校验失败）
      if (onConfirm(taskData) !== false) {
        onClose();
      }
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
      <Form form={form} layout="vertical" initialValues={initialValues}>
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
            <Option value="project">项目</Option>
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
  const [tasks, setTasks] = React.useState<Task[]>(initTasks());
  const [config, setConfig] = React.useState<GanttConfig>(DEFAULT_GANTT_CONFIG);

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
    console.log("On progress change Id:" + task.id);
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
    console.log("On expander click Id:" + task.id);
  };

  // 弹框状态管理
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedParentTask, setSelectedParentTask] = React.useState<Task | null>(null);
  const [selectedEditTask, setSelectedEditTask] = React.useState<Task | null>(null);

  const handleAddTask = (parentTask: Task) => {
    console.log("=== handleAddTask called ===");
    console.log("Add task clicked for parent:", parentTask);
    console.log("Current showAddModal state:", showAddModal);
    setSelectedParentTask(parentTask);
    setShowAddModal(true);
    console.log("Set showAddModal to true");
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

  const handleEditModalConfirm = (taskData: Partial<Task>): boolean | void => {
    // ── 父子时间约束校验 ────────────────────────────────────────────────
    const editedTask = tasks.find(t => t.id === taskData.id);
    const parentId = editedTask?.project;
    if (parentId) {
      const parent = tasks.find(t => t.id === parentId);
      if (parent) {
        const parentStart = parent.plannedStart ?? parent.start;
        const parentEnd   = parent.plannedEnd   ?? parent.end;
        const childStart  = taskData.plannedStart ?? taskData.start;
        const childEnd    = taskData.plannedEnd   ?? taskData.end;
        const fmt = (d: Date) =>
          `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
        if (childStart && childStart < parentStart) {
          message.error(`子任务开始时间不能早于父任务开始时间（${fmt(parentStart)}）`);
          return false;
        }
        if (childEnd && childEnd > parentEnd) {
          message.error(`子任务结束时间不能晚于父任务结束时间（${fmt(parentEnd)}）`);
          return false;
        }
      }
    }

    // ── 更新任务列表 ────────────────────────────────────────────────────
    let newTasks = tasks.map(t =>
      t.id === taskData.id ? { ...t, ...taskData } : t
    );

    // 若编辑的是子任务，同步扩展/收缩父任务时间范围（与拖拽逻辑一致）
    if (parentId) {
      const [start, end] = getStartEndDateForProject(newTasks, parentId);
      const parent = newTasks.find(t => t.id === parentId)!;
      if (parent.start.getTime() !== start.getTime() ||
          parent.end.getTime()   !== end.getTime()) {
        newTasks = newTasks.map(t =>
          t.id === parentId ? { ...t, start, end } : t
        );
      }
    }

    setTasks(newTasks);
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


  return (
    <div className="Wrapper">
      <div style={{ marginBottom: 12 }}>
        <Button size="small" onClick={() => ganttRef.current?.scrollToDate(new Date(), { align: "center" })}>滚动到今天(居中)</Button>
        <Button size="small" style={{ marginLeft: 8 }} onClick={() => ganttRef.current?.scrollToDate(new Date(new Date().getTime() - 24*3600*1000), { align: "start" })}>滚到昨天(开始)</Button>
        <Button size="small" style={{ marginLeft: 8 }} onClick={() => ganttRef.current?.scrollToDate(new Date(new Date().getTime() + 24*3600*1000), { align: "end" })}>滚到明天(末尾)</Button>
      </div>
      <GanttConfigurator config={config} onChange={setConfig} />
      <Gantt
        // @ts-ignore
        ref={ganttRef}
        tasks={tasks}
        viewMode={config.viewMode}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={config.showTaskList ? "140px" : ""}
        nameColumnWidth="190px"
        timeColumnLabels={{
          plannedStart: "计划开始",
          plannedEnd: "计划结束",
          plannedDuration: "工期(天)",
          actualStart: "实际开始",
          actualEnd: "实际结束",
        }}
        timeColumnWidths={getTimeColumnWidths(config)}
        ganttHeight={config.ganttHeight}
        columnWidth={config.columnWidth}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        expandIcon={<PlusSquareOutlined style={{ fontSize: '14px' }} />}
        collapseIcon={<MinusSquareOutlined style={{ fontSize: '14px' }} />}
        barActualColor={config.barActualColor}
        barActualSelectedColor={config.barActualSelectedColor}
        barDelayColor={config.barDelayColor}
        barBackgroundColor={config.barBackgroundColor}
        barBackgroundSelectedColor={config.barBackgroundSelectedColor}
        barProgressColor={config.barProgressColor}
        barProgressSelectedColor={config.barProgressSelectedColor}
        projectBackgroundColor={config.projectBackgroundColor}
        projectBackgroundSelectedColor={config.projectBackgroundSelectedColor}
        projectProgressColor={config.projectProgressColor}
        projectProgressSelectedColor={config.projectProgressSelectedColor}
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
    </div>
  );
};

export default App;
