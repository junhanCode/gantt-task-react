# README 更新建议

以下是建议添加到主 README.md 的内容，展示新功能。

---

## 建议添加的章节

### 📦 新功能 (v0.3.10)

#### 1. 自定义复选框颜色

支持通过 `rowSelection.checkboxBorderColor` 自定义复选框的边框颜色：

```tsx
<Gantt
  tasks={tasks}
  rowSelection={{
    selectedRowKeys: selectedKeys,
    onChange: (keys) => setSelectedKeys(keys),
    checkboxBorderColor: '#1890ff', // 自定义颜色
  }}
/>
```

#### 2. 智能时间规范化

任务的开始和结束时间会自动规范化，确保条形图在甘特图中占据完整的格子显示：

- 开始时间：自动设置为当天 00:00:00
- 结束时间：自动设置为当天 23:59:59

这是自动行为，无需额外配置。

#### 3. 任务标题自定义按钮

在任务标题旁边添加可点击的按钮/图标，用于触发自定义操作（如调用接口、显示详情等）：

```tsx
<Gantt
  tasks={tasks}
  viewType="oaTask"
  onTaskTitleAction={(task) => {
    // 点击按钮后的操作
    fetch(`/api/tasks/${task.id}/details`)
      .then(res => res.json())
      .then(data => console.log(data));
  }}
  taskTitleActionIcon={
    <YourCustomIcon />  // 可选，不传则使用默认图标
  }
/>
```

---

## 完整的 Props 表格更新

建议在现有的 Props 表格中添加以下行：

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `rowSelection.checkboxBorderColor` | `string` | No | 自定义复选框的边框颜色（使用 CSS 颜色值） |
| `onTaskTitleAction` | `(task: Task) => void` | No | 任务标题旁按钮的点击回调函数 |
| `taskTitleActionIcon` | `React.ReactNode` | No | 自定义任务标题旁的按钮图标 |

---

## 示例代码更新

建议添加一个"高级用法"示例：

### 高级用法示例

```tsx
import { Gantt, Task } from 'gantt-task-react';
import { useState } from 'react';
import 'gantt-task-react/dist/index.css';

function AdvancedGanttExample() {
  const [tasks, setTasks] = useState<Task[]>([...]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  return (
    <Gantt
      tasks={tasks}
      viewType="oaTask"
      
      // 多选配置（含自定义颜色）
      rowSelection={{
        selectedRowKeys: selectedKeys,
        onChange: (keys, rows) => {
          setSelectedKeys(keys);
          console.log('选中的任务:', rows);
        },
        checkboxBorderColor: '#1890ff',  // 新功能：自定义颜色
        showSelectAll: true,
        getCheckboxProps: (record) => ({
          disabled: record.progress === 100,  // 已完成的任务不可选
        }),
      }}
      
      // 自定义任务标题按钮（新功能）
      onTaskTitleAction={(task) => {
        // 调用接口获取任务详情
        fetchTaskDetails(task.id);
      }}
      taskTitleActionIcon={
        <InfoCircleOutlined style={{ color: '#1890ff' }} />
      }
      
      // 其他配置...
      onDateChange={handleDateChange}
      onProgressChange={handleProgressChange}
    />
  );
}
```

---

## Features 列表更新

建议在 Features 列表中添加：

- ✅ **自定义复选框颜色** - 支持通过配置自定义多选框的边框颜色
- ✅ **智能时间规范化** - 自动调整任务时间，确保条形图显示完整
- ✅ **任务标题操作按钮** - 支持在任务标题旁添加自定义按钮，触发自定义操作

---

## TypeScript 类型定义更新

建议在 TypeScript 使用说明中添加：

```typescript
import { Gantt, Task, GanttProps } from 'gantt-task-react';

// 新增的类型定义
interface GanttProps {
  // ... 现有属性
  
  // 新增：复选框颜色
  rowSelection?: {
    checkboxBorderColor?: string;
    // ... 其他 rowSelection 属性
  };
  
  // 新增：任务标题按钮
  onTaskTitleAction?: (task: Task) => void;
  taskTitleActionIcon?: React.ReactNode;
}
```

---

## 浏览器兼容性说明

建议添加或更新浏览器兼容性部分：

### 浏览器兼容性

基本功能支持所有现代浏览器。以下功能有特定要求：

- **自定义复选框颜色** (使用 `accent-color`)：
  - Chrome 93+
  - Firefox 93+
  - Safari 15.4+
  - Edge 93+
  
  不支持的浏览器会使用默认复选框样式，不影响功能使用。

---

## 迁移指南

建议添加一个迁移说明：

### 从旧版本升级

新功能完全向后兼容，无需修改现有代码。如需使用新功能：

1. **自定义复选框颜色**：在现有的 `rowSelection` 配置中添加 `checkboxBorderColor`
2. **时间规范化**：自动生效，无需修改代码
3. **任务标题按钮**：添加 `onTaskTitleAction` 和可选的 `taskTitleActionIcon`

```tsx
// 旧代码 - 仍然有效
<Gantt
  tasks={tasks}
  rowSelection={{
    selectedRowKeys: selectedKeys,
    onChange: setSelectedKeys,
  }}
/>

// 新代码 - 添加了新功能
<Gantt
  tasks={tasks}
  rowSelection={{
    selectedRowKeys: selectedKeys,
    onChange: setSelectedKeys,
    checkboxBorderColor: '#1890ff',  // 新增
  }}
  onTaskTitleAction={handleAction}   // 新增
  taskTitleActionIcon={<Icon />}      // 新增
/>
```

---

## 文档链接

建议在 README 中添加文档链接部分：

### 📚 文档

- [快速参考](./QUICK_REFERENCE.md) - 新功能快速查阅
- [功能更新详解](./FEATURE_UPDATES.md) - 详细的功能说明和使用指南
- [使用示例](./example/USAGE_EXAMPLES.md) - 完整的示例代码和测试步骤
- [更新日志](./CHANGELOG_NEW_FEATURES.md) - 版本更新记录
- [实现总结](./IMPLEMENTATION_SUMMARY.md) - 技术实现细节

---

## Badge 建议

可以考虑在 README 顶部添加一些 badges：

```markdown
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![React 18](https://img.shields.io/badge/React-18-blue)
![New Features](https://img.shields.io/badge/New%20Features-3-green)
```

---

以上是建议添加到主 README.md 的内容。你可以根据现有 README 的结构和风格进行调整。
