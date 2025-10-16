# Gantt Task React - 双条形图增强版

基于 [MaTeMaTuK/gantt-task-react](https://github.com/MaTeMaTuK/gantt-task-react) 的增强版本，实现了水平重叠双条形图设计，支持计划vs实际时间对比，延误状态可视化。

## 🚀 核心功能

### 📊 双条形图设计
- **计划条（基线）**：灰色背景条，显示原始计划时间
- **实际条（进度条）**：绿色条，显示实际执行时间
- **延误标记**：橙色标记，自动标识超出计划时间的延误部分
- **独立拖动**：计划条和实际条可以独立调整，互不影响

### 🎯 视觉偏差识别
- **准时**：实际条与计划条完全对齐
- **延误**：实际条超出计划条的部分用橙色标记
- **提前**：实际条在计划条之前开始或结束
- **进行中**：实际条已开始但未完成

### 🔧 操作功能
- ✅ **新增任务** - 支持弹框形式添加子任务
- ✅ **编辑任务** - 支持弹框形式编辑任务信息
- ✅ **删除任务** - 支持确认删除任务
- ✅ **拖动调整** - 支持拖动调整计划时间和实际时间
- ✅ **实时同步** - 拖动过程中左侧任务列表实时更新

## 📦 本地打包和引入

### 1. 打包插件

```bash
# 克隆项目
git clone <your-repo-url>
cd gantt-task-react

# 安装依赖
npm install

# 构建插件
npm run build
```

构建完成后，会在 `dist` 目录生成以下文件：
- `index.js` - CommonJS 格式
- `index.modern.js` - ES Module 格式
- `index.d.ts` - TypeScript 类型定义

### 2. 在 React TypeScript 项目中引入

#### 方法一：直接复制文件（推荐）

1. **复制构建文件到你的项目**：
```bash
# 在你的 React 项目中创建 libs 目录
mkdir src/libs/gantt-task-react

# 复制构建文件
cp dist/index.js src/libs/gantt-task-react/
cp dist/index.modern.js src/libs/gantt-task-react/
cp dist/index.d.ts src/libs/gantt-task-react/
cp dist/index.css src/libs/gantt-task-react/  # 如果有的话
```

2. **在你的组件中引入**：
```tsx
// 引入组件和类型
import { Gantt, Task, ViewMode } from './libs/gantt-task-react/index.modern.js';
import './libs/gantt-task-react/index.css'; // 引入样式

// 或者使用 CommonJS 格式
// const { Gantt, Task, ViewMode } = require('./libs/gantt-task-react/index.js');
```

#### 方法二：使用 file:// 协议

1. **在 package.json 中添加依赖**：
```json
{
  "dependencies": {
    "gantt-task-react": "file:../path/to/gantt-task-react"
  }
}
```

2. **安装依赖**：
```bash
npm install
```

3. **在组件中引入**：
```tsx
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
```

### 3. 完整使用示例

```tsx
import React, { useState } from 'react';
import { Gantt, Task, ViewMode } from './libs/gantt-task-react/index.modern.js';
import { Modal, Input, Select, Button, DatePicker, Form, InputNumber } from 'antd';
import dayjs from 'dayjs';
import './libs/gantt-task-react/index.css';

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
        <Form.Item name="dateRange" label="基础时间范围" rules={[{ required: true, message: "请选择时间范围" }]}>
          <RangePicker showTime style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="plannedDateRange" label="计划时间范围（可选）">
          <RangePicker showTime style={{ width: "100%" }} placeholder={["计划开始时间", "计划结束时间"]} />
        </Form.Item>
        <Form.Item name="actualDateRange" label="实际时间范围（可选）">
          <RangePicker showTime style={{ width: "100%" }} placeholder={["实际开始时间", "实际结束时间"]} />
        </Form.Item>
        <Form.Item name="progress" label="进度 (%)" initialValue={0}>
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
      // 计划时间
      plannedStart: new Date(2024, 0, 1),
      plannedEnd: new Date(2024, 0, 15),
      // 实际时间 - 准时完成
      actualStart: new Date(2024, 0, 1),
      actualEnd: new Date(2024, 0, 15),
    },
    {
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 5),
      name: '任务 1',
      id: 'Task1',
      type: 'task',
      progress: 50,
      project: 'ProjectSample',
      // 计划时间
      plannedStart: new Date(2024, 0, 1),
      plannedEnd: new Date(2024, 0, 5),
      // 实际时间 - 延误完成
      actualStart: new Date(2024, 0, 2),
      actualEnd: new Date(2024, 0, 7),
    }
  ]);

  // 弹框状态管理
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedParentTask, setSelectedParentTask] = useState<Task | null>(null);

  // 处理新增任务
  const handleAddTask = (parentTask: Task) => {
    setSelectedParentTask(parentTask);
    setShowAddModal(true);
  };

  // 处理任务变化
  const handleTaskChange = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
  };

  return (
    <div>
      <Gantt
        tasks={tasks}
        viewMode={ViewMode.Day}
        onDateChange={handleTaskChange}
        onAddTask={handleAddTask}
        listCellWidth="140px"
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
        ganttHeight={400}
        columnWidth={65}
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
          onConfirm={(taskData) => {
            const newTask: Task = {
              id: `Task_${Date.now()}`,
              name: taskData.name || "新任务",
              type: taskData.type || "task",
              start: taskData.start || new Date(),
              end: taskData.end || new Date(),
              progress: taskData.progress || 0,
              project: selectedParentTask?.id,
              displayOrder: tasks.length + 1,
              plannedStart: taskData.plannedStart,
              plannedEnd: taskData.plannedEnd,
              actualStart: taskData.actualStart,
              actualEnd: taskData.actualEnd,
            };
            setTasks([...tasks, newTask]);
            setShowAddModal(false);
            setSelectedParentTask(null);
          }}
        />
      )}
    </div>
  );
};

export default MyGanttComponent;
```

## 🎨 颜色配置

| 颜色 | 值 | 代表含义 |
|------|-----|----------|
| 灰色 | `#e0e0e0` | 计划条（基线） |
| 绿色 | `#4CAF50` | 实际条 |
| 橙色 | `#FF9800` | 延误部分 |

## 🔧 API 参考

### Task 接口新增字段

```typescript
interface Task {
  // ... 原有字段
  // 计划时间（可选，兼容旧数据）
  plannedStart?: Date;
  plannedEnd?: Date;
  // 实际时间（可选，兼容旧数据）
  actualStart?: Date;
  actualEnd?: Date;
}
```

### GanttProps 新增属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `barActualColor` | `string` | `"#4CAF50"` | 实际条颜色 |
| `barActualSelectedColor` | `string` | `"#45a049"` | 选中状态实际条颜色 |
| `barDelayColor` | `string` | `"#FF9800"` | 延误部分颜色 |
| `timeColumnLabels` | `object` | - | 时间列标题自定义 |
| `timeColumnWidths` | `object` | - | 时间列宽度自定义 |
| `expandIcon` | `React.ReactNode` | 默认田字形图标 | 展开状态图标 |
| `collapseIcon` | `React.ReactNode` | 默认日字形图标 | 折叠状态图标 |

## 🎨 自定义图标

### 使用 Antd 图标

```tsx
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";

<Gantt
  tasks={tasks}
  // 自定义展开/折叠图标
  expandIcon={<PlusSquareOutlined style={{ fontSize: '14px' }} />}
  collapseIcon={<MinusSquareOutlined style={{ fontSize: '14px' }} />}
  // ... 其他属性
/>
```

### 使用自定义 SVG 图标

```tsx
const CustomExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="2" width="4" height="4" rx="1" />
    <rect x="10" y="2" width="4" height="4" rx="1" />
    <rect x="2" y="10" width="4" height="4" rx="1" />
    <rect x="10" y="10" width="4" height="4" rx="1" />
  </svg>
);

const CustomCollapseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="2" width="12" height="2" rx="1" />
    <rect x="2" y="7" width="12" height="2" rx="1" />
    <rect x="2" y="12" width="12" height="2" rx="1" />
  </svg>
);

<Gantt
  tasks={tasks}
  expandIcon={<CustomExpandIcon />}
  collapseIcon={<CustomCollapseIcon />}
  // ... 其他属性
/>
```

### 使用 Emoji 图标

```tsx
<Gantt
  tasks={tasks}
  expandIcon={<span style={{ fontSize: '14px' }}>📋</span>}
  collapseIcon={<span style={{ fontSize: '14px' }}>📄</span>}
  // ... 其他属性
/>
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

### v0.3.9+ (双条形图增强版)

- ✅ 实现水平重叠双条形图设计
- ✅ 支持计划vs实际时间对比
- ✅ 自动延误状态可视化
- ✅ 独立拖动计划条和实际条
- ✅ 实时同步左侧任务列表
- ✅ 支持四个时间列显示
- ✅ 完整的 TypeScript 类型支持

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- 基于 [MaTeMaTuK/gantt-task-react](https://github.com/MaTeMaTuK/gantt-task-react) 开发
- 感谢原作者的优秀工作