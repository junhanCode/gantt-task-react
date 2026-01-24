import React from "react";
import { Task, ViewMode, Gantt, OATaskViewMode } from "gantt-task-react";
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
  const [oaTaskViewMode, setOATaskViewMode] = React.useState<OATaskViewMode>("日");
  
  // 根据oaTaskViewMode设置viewMode
  const getViewMode = React.useCallback((): ViewMode => {
    if (viewType === "oaTask") {
      switch (oaTaskViewMode) {
        case "日":
          return ViewMode.Day; // 日模式使用Day，不是DayShift（DayShift会将一天分成4个班次）
        case "月":
          return ViewMode.Month;
        case "季":
          return ViewMode.QuarterYear;
        default:
          return ViewMode.Day;
      }
    }
    return ViewMode.Day;
  }, [oaTaskViewMode, viewType]);
  
  const [view, setView] = React.useState<ViewMode>(getViewMode());
  const [tasks, setTasks] = React.useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = React.useState(true);
  const [showArrows, setShowArrows] = React.useState<boolean>(true);
  const [enableTaskDrag, setEnableTaskDrag] = React.useState<boolean>(false);
  const [enableTaskResize, setEnableTaskResize] = React.useState<boolean>(true);
  
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
        console.log(`[isTaskDraggable] task: ${task.name}, action: ${action}, status: 已完成, result: false (已完成状态不允许拉伸)`);
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
      console.log(`[isTaskDraggable] task: ${task.name}, action: ${action}, proposer: ${taskAny.proposer?.name}, currentUser: ${currentUser}, result: ${result}`);
      return result;
    }
    
    // 对于其他操作，默认允许（可以根据需要调整）
    return canDrag;
  }, [currentUser]);
  
  // 测试空数组功能
  const [testEmptyArray, setTestEmptyArray] = React.useState(false);

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

  return (
    <div className="Wrapper">
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
              type={oaTaskViewMode === "月" ? "primary" : "default"}
              onClick={() => setOATaskViewMode("月")}
            >
              月
            </Button>
            <Button 
              size="small" 
              style={{ marginLeft: 8 }} 
              type={oaTaskViewMode === "季" ? "primary" : "default"}
              onClick={() => setOATaskViewMode("季")}
            >
              季
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
        <label style={{ marginLeft: 16, marginRight: 8 }}>测试空数组：</label>
        <input
          type="checkbox"
          checked={testEmptyArray}
          onChange={e => setTestEmptyArray(e.target.checked)}
        />
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
        listCellWidth={isChecked ? "140px" : ""}
        nameColumnWidth="190px"  
        timeColumnLabels={{
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
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        // 演示操作列默认渲染，及自定义渲染能力
        operationsColumnWidth="140px"
        operationsColumnLabel="操作"
        showOperationsColumn={true}
        // 演示箭头开关
        showArrows={showArrows}
        // 拖动和拉伸控制
        enableTaskDrag={enableTaskDrag}
        enableTaskResize={enableTaskResize}
        onTaskDragEnd={handleTaskDragEnd}
        // 自定义禁用规则：只有当proposer包含当前登录用户时才可以拖动
        isTaskDraggable={isTaskDraggable}
        // 自定义展开/折叠图标：与表头保持一致
        expandIcon={<PlusSquareOutlined style={{ fontSize: '14px' }} />}
        collapseIcon={<MinusSquareOutlined style={{ fontSize: '14px' }} />}
        // 演示自定义列渲染 + 溢出信息
        columnEllipsisMaxChars={{
          name: 12,
          status: 6,
          assignee: 8,
        }}
        columnRenderers={{
          name: (task: Task, meta: { value: string; displayValue: string; isOverflow: boolean; maxLength: number }) => (
            <span
              style={{ color: "#1677ff" }}
              title={meta.isOverflow ? task.name : undefined}
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
        onCellOverflow={({ column, task }: { column: "name" | "status" | "assignee"; task: Task }) => {
          console.log("列内容溢出:", column, "任务:", task.name);
        }}
        viewType={viewType}
        oaTaskViewMode={oaTaskViewMode}
        onOATaskViewModeChange={(mode) => {
          setOATaskViewMode(mode);
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
    </div>
  );
};

export default App;
