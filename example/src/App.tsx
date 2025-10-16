import React from "react";
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { getStartEndDateForProject, initTasks } from "./helper";
import "gantt-task-react/dist/index.css";
import { Modal, Input, Select, Button, DatePicker, InputNumber, Form } from "antd";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

// 新增任务弹框组件
const AddTaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  parentTaskId: string;
  onConfirm: (taskData: Partial<Task>) => void;
}> = ({ isOpen, onClose, parentTaskId, onConfirm }) => {
  const [form] = Form.useForm();

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
      onClose();
    });
  };

  // 当弹框关闭时重置表单
  React.useEffect(() => {
    if (!isOpen) {
      form.resetFields();
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
          <RangePicker showTime style={{ width: "100%" }} placeholder={["计划开始时间", "计划结束时间"]} />
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

  React.useEffect(() => {
    if (isOpen && task) {
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
      });
    }
  }, [isOpen, task, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const taskData: Partial<Task> = {
        id: task.id,
        name: values.name,
        type: values.type,
        plannedStart: values.plannedDateRange?.[0]?.toDate(),
        plannedEnd: values.plannedDateRange?.[1]?.toDate(),
        actualStart: values.actualDateRange?.[0]?.toDate(),
        actualEnd: values.actualDateRange?.[1]?.toDate(),
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
          <RangePicker showTime style={{ width: "100%" }} />
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
  const [view, setView] = React.useState<ViewMode>(ViewMode.DayShift);
  const [tasks, setTasks] = React.useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = React.useState(true);
  

  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
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


  return (
    <div className="Wrapper">
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <Gantt
        tasks={tasks}
        viewMode={view}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "140px" : ""}
        nameColumnWidth="200px"
        timeColumnLabels={{
          plannedStart: "计划开始时间",
          plannedEnd: "计划结束时间",
          actualStart: "实际开始时间",
          actualEnd: "实际结束时间",
        }}
        timeColumnWidths={{
          plannedStart: "180px",
          plannedEnd: "180px",
          actualStart: "180px",
          actualEnd: "180px",
        }}
        ganttHeight={300}
        columnWidth={columnWidth}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        operationsColumnWidth="120px"
        operationsColumnLabel="操作"
        // 自定义展开/折叠图标
        expandIcon={<PlusSquareOutlined style={{ fontSize: '14px' }} />}
        collapseIcon={<MinusSquareOutlined style={{ fontSize: '14px' }} />}
        // 双条形图样式配置
        barActualColor="#4CAF50"           // 实际条颜色 - 绿色
        barActualSelectedColor="#45a049"   // 选中状态实际条颜色
        barDelayColor="#FF9800"            // 延误部分颜色 - 橙色
        barBackgroundColor="#e0e0e0"       // 计划条背景颜色 - 灰色
        barBackgroundSelectedColor="#d0d0d0" // 选中状态计划条背景颜色
        barProgressColor="#2196F3"         // 进度条颜色 - 蓝色
        barProgressSelectedColor="#1976D2" // 选中状态进度条颜色
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
