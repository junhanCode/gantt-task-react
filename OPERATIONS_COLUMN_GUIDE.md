# 甘特图操作列功能使用指南

## 功能概述

基于 [MaTeMaTuK/gantt-task-react](https://github.com/MaTeMaTuK/gantt-task-react) 的增强版本，我们为甘特图组件添加了操作列功能，在任务列表的最后一列提供了新增、编辑、删除三个操作按钮。

## 🆕 新增功能

- ✅ **操作列** - 在任务列表最后一列添加操作按钮
- ✅ **新增任务** - 支持弹框形式添加子任务
- ✅ **编辑任务** - 支持弹框形式编辑任务信息
- ✅ **删除任务** - 支持确认删除任务
- ✅ **自定义弹框** - 完全支持自定义 Antd 弹框组件
- ✅ **响应式设计** - 操作按钮支持悬停效果

## 新增的属性

### GanttProps 新增属性

```typescript
interface GanttProps {
  // ... 其他现有属性
  
  // 操作列相关属性
  onDeleteTask?: (task: Task) => void;           // 删除任务回调函数
  operationsColumnWidth?: string;                // 操作列宽度，默认为 "120px"
  operationsColumnLabel?: string;                // 操作列标题，默认为 "操作"
}
```

## 使用方法

### 1. 基本使用（带弹框）

```tsx
import { Gantt, Task } from 'gantt-task-react';
import { Modal, Input, Select, Button, DatePicker, Form } from 'antd';
import dayjs from 'dayjs';

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

const MyGanttComponent = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedParentTask, setSelectedParentTask] = useState<Task | null>(null);

  // 处理新增任务
  const handleAddTask = (parentTask: Task) => {
    console.log('新增子任务，父任务:', parentTask);
    setSelectedParentTask(parentTask);
    setShowAddModal(true);
  };

  // 处理编辑任务
  const handleEditTask = (task: Task) => {
    console.log('编辑任务:', task);
    // 在这里实现编辑逻辑
  };

  // 处理删除任务
  const handleDeleteTask = (task: Task) => {
    const confirmed = window.confirm(`确定要删除任务 "${task.name}" 吗？`);
    if (confirmed) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
  };

  // 处理新增弹框确认
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

  return (
    <div>
      <Gantt
        tasks={tasks}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        operationsColumnWidth="120px"
        operationsColumnLabel="操作"
        // ... 其他属性
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
    </div>
  );
};
```

### 2. 自定义操作列样式

```tsx
<Gantt
  tasks={tasks}
  onAddTask={handleAddTask}
  onEditTask={handleEditTask}
  onDeleteTask={handleDeleteTask}
  operationsColumnWidth="150px"  // 自定义宽度
  operationsColumnLabel="Actions" // 自定义标题
  // ... 其他属性
/>
```

## 操作按钮说明

### 新增按钮 (+)
- **图标**: 绿色圆形加号图标
- **功能**: 为当前任务添加子任务
- **回调**: `onAddTask(task: Task)`

### 编辑按钮 (✏️)
- **图标**: 蓝色编辑图标
- **功能**: 编辑当前任务
- **回调**: `onEditTask(task: Task)`

### 删除按钮 (🗑️)
- **图标**: 红色删除图标
- **功能**: 删除当前任务
- **回调**: `onDeleteTask(task: Task)`

## 样式自定义

操作列的样式可以通过CSS模块进行自定义：

```css
/* 操作列容器样式 */
.operationsContainer {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
  flex-wrap: nowrap;
}

/* 操作图标样式 */
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

## 注意事项

1. **操作列宽度**: 默认宽度为120px，可根据需要调整
2. **按钮间距**: 按钮之间的间距为6px，确保不会过于拥挤
3. **响应式设计**: 操作列会根据内容自动调整高度
4. **事件处理**: 所有操作按钮都会触发相应的回调函数，需要在父组件中实现具体逻辑

## 完整示例

参考 `example/src/App.tsx` 文件中的完整实现示例，包括：
- 新增任务弹框
- 编辑任务弹框
- 删除确认对话框
- 任务状态管理

## 🔄 与原版的差异

### 新增文件
- `OPERATIONS_COLUMN_GUIDE.md` - 操作列功能使用指南

### 修改的文件
1. **核心组件**
   - `src/components/task-list/task-list-header.tsx` - 添加操作列头部
   - `src/components/task-list/task-list-table.tsx` - 添加操作按钮和回调处理
   - `src/components/task-list/task-list-table.module.css` - 添加操作按钮样式
   - `src/components/task-list/task-list.tsx` - 更新属性传递
   - `src/components/gantt/gantt.tsx` - 添加新属性支持
   - `src/types/public-types.ts` - 更新类型定义

2. **示例项目**
   - `example/src/App.tsx` - 完整的弹框功能示例

### 主要功能改动
- 在任务列表最后一列添加操作列
- 支持新增、编辑、删除三个操作
- 完全支持自定义弹框组件
- 保持与原版 API 的完全兼容

## 📝 更新日志

### v0.3.9+ (增强版)
- ✅ 添加操作列功能，支持新增、编辑、删除操作
- ✅ 新增 `onAddTask`、`onEditTask`、`onDeleteTask` 回调函数
- ✅ 新增 `operationsColumnWidth` 和 `operationsColumnLabel` 属性
- ✅ 优化操作按钮的视觉效果和交互体验
- ✅ 完整的 TypeScript 类型支持
- ✅ 支持自定义 Antd 弹框组件
