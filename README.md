# Gantt Task React - 增强版

基于 [MaTeMaTuK/gantt-task-react](https://github.com/MaTeMaTuK/gantt-task-react) 的增强版本，添加了操作列功能，支持新增、编辑、删除任务。

## 🚀 新增功能

- ✅ **操作列** - 在任务列表最后一列添加操作按钮
- ✅ **新增任务** - 支持弹框形式添加子任务
- ✅ **编辑任务** - 支持弹框形式编辑任务信息
- ✅ **删除任务** - 支持确认删除任务
- ✅ **自定义弹框** - 完全支持自定义 Antd 弹框组件
- ✅ **响应式设计** - 操作按钮支持悬停效果

## 📦 安装

```bash
npm install gantt-task-react
```

## 🎯 快速开始

### 基本使用

```tsx
import React, { useState } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import { Modal, Input, Select, Button, DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import 'gantt-task-react/dist/index.css';

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
        progress: values.progress || 0,
        project: parentTaskId,
      };
      onConfirm(taskData);
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="新增子任务"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>取消</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>确定</Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="任务名称" rules={[{ required: true, message: "请输入任务名称" }]}>
          <Input placeholder="请输入任务名称" />
        </Form.Item>
        <Form.Item name="type" label="任务类型" initialValue="task">
          <Select>
            <Option value="task">任务</Option>
            <Option value="milestone">里程碑</Option>
          </Select>
        </Form.Item>
        <Form.Item name="dateRange" label="时间范围" rules={[{ required: true, message: "请选择时间范围" }]}>
          <RangePicker showTime style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="progress" label="进度 (%)" initialValue={0}>
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
        <Button key="back" onClick={onClose}>取消</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>确定</Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="任务名称" rules={[{ required: true, message: "请输入任务名称" }]}>
          <Input placeholder="请输入任务名称" />
        </Form.Item>
        <Form.Item name="type" label="任务类型" rules={[{ required: true, message: "请选择任务类型" }]}>
          <Select>
            <Option value="task">任务</Option>
            <Option value="milestone">里程碑</Option>
          </Select>
        </Form.Item>
        <Form.Item name="plannedDateRange" label="计划时间范围">
          <RangePicker showTime style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="actualDateRange" label="实际时间范围">
          <RangePicker showTime style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="progress" label="进度 (%)">
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const MyGanttComponent = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 15),
      name: '示例项目',
      id: 'ProjectSample',
      type: 'project',
      progress: 25,
    },
    {
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 5),
      name: '任务 1',
      id: 'Task1',
      type: 'task',
      progress: 50,
      project: 'ProjectSample',
    }
  ]);

  // 弹框状态管理
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedParentTask, setSelectedParentTask] = useState<Task | null>(null);
  const [selectedEditTask, setSelectedEditTask] = useState<Task | null>(null);

  // 处理新增任务
  const handleAddTask = (parentTask: Task) => {
    console.log('新增子任务，父任务:', parentTask);
    setSelectedParentTask(parentTask);
    setShowAddModal(true);
  };

  // 处理编辑任务
  const handleEditTask = (task: Task) => {
    console.log('编辑任务:', task);
    setSelectedEditTask(task);
    setShowEditModal(true);
  };

  // 处理删除任务
  const handleDeleteTask = (task: Task) => {
    const confirmed = window.confirm(`确定要删除任务 "${task.name}" 吗？`);
    if (confirmed) {
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

  return (
    <div>
      <Gantt
        tasks={tasks}
        viewMode={ViewMode.Day}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        operationsColumnWidth="120px"
        operationsColumnLabel="操作"
        listCellWidth="200px"
        ganttHeight={400}
        columnWidth={65}
      />
      
      {/* 新增任务弹框 */}
      {showAddModal && selectedParentTask && (
        <AddTaskModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedParentTask(null);
          }}
          parentTaskId={selectedParentTask.id}
          onConfirm={handleAddModalConfirm}
        />
      )}
      
      {/* 编辑任务弹框 */}
      {showEditModal && selectedEditTask && (
        <EditTaskModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEditTask(null);
          }}
          task={selectedEditTask}
          onConfirm={handleEditModalConfirm}
        />
      )}
    </div>
  );
};

export default MyGanttComponent;
```

## 🔧 API 参考

### 新增属性

#### GanttProps 新增属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `onAddTask` | `(task: Task) => void` | - | 新增任务回调函数 |
| `onEditTask` | `(task: Task) => void` | - | 编辑任务回调函数 |
| `onDeleteTask` | `(task: Task) => void` | - | 删除任务回调函数 |
| `operationsColumnWidth` | `string` | `"120px"` | 操作列宽度 |
| `operationsColumnLabel` | `string` | `"操作"` | 操作列标题 |

### 操作按钮说明

| 按钮 | 图标 | 功能 | 回调 |
|------|------|------|------|
| 新增 | 🟢 + | 为当前任务添加子任务 | `onAddTask(task)` |
| 编辑 | 🔵 ✏️ | 编辑当前任务 | `onEditTask(task)` |
| 删除 | 🔴 🗑️ | 删除当前任务 | `onDeleteTask(task)` |

## 🎨 自定义样式

### CSS 类名

```css
/* 操作列容器 */
.operationsContainer {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
  flex-wrap: nowrap;
}

/* 操作按钮 */
.actionIcon {
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: 0.7;
}

.actionIcon:hover {
  transform: scale(1.2);
  opacity: 1;
}
```

## 🚀 运行示例

```bash
# 克隆项目
git clone <your-repo-url>
cd gantt-task-react

# 安装依赖
npm install

# 运行示例
cd example
npm install
npm start
```

访问 `http://localhost:3000` 查看示例。

## 📝 更新日志

### v0.3.9+ (增强版)

- ✅ 添加操作列功能
- ✅ 支持新增、编辑、删除任务
- ✅ 支持自定义弹框组件
- ✅ 优化用户体验和视觉效果
- ✅ 完整的 TypeScript 类型支持

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- 基于 [MaTeMaTuK/gantt-task-react](https://github.com/MaTeMaTuK/gantt-task-react) 开发
- 感谢原作者的优秀工作