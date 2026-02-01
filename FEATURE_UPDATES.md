# 甘特图新功能更新说明

## 更新内容

本次更新为甘特图组件添加了三个新功能：

### 1. 自定义多选框边框颜色

现在可以通过 `rowSelection.checkboxBorderColor` 属性自定义复选框的边框颜色。

#### 使用示例：

```tsx
<Gantt
  tasks={tasks}
  rowSelection={{
    selectedRowKeys: selectedKeys,
    onChange: (keys, rows) => {
      setSelectedKeys(keys);
      console.log('选中的任务:', rows);
    },
    checkboxBorderColor: '#1890ff', // 自定义复选框颜色
  }}
/>
```

### 2. 结束时间默认放到当天最右边

修改了时间计算逻辑，现在任务的结束时间会自动设置为当天的最后一秒（23:59:59），确保任务条形图在甘特图中占据完整的天数显示。

#### 变更说明：

- **之前**: 结束时间可能是当天的任意时刻，导致条形图显示不完整
- **现在**: 
  - 开始时间自动设置为当天的 00:00:00
  - 结束时间自动设置为当天的 23:59:59
  - 条形图会占据完整的格子宽度

#### 示例：

```tsx
const tasks = [
  {
    id: '1',
    name: '任务1',
    start: new Date('2024-01-15 14:30:00'), // 会被规范化为 2024-01-15 00:00:00
    end: new Date('2024-01-15 16:45:00'),   // 会被规范化为 2024-01-15 23:59:59
    progress: 50,
    type: 'task',
  }
];
```

### 3. 自定义任务标题旁边的按钮图标

新增了在任务标题旁边显示自定义按钮/图标的功能，点击后可以触发自定义事件（如调用接口）。

#### 使用示例：

```tsx
<Gantt
  tasks={tasks}
  viewType="oaTask"
  // 自定义按钮点击事件
  onTaskTitleAction={(task) => {
    console.log('点击了任务:', task);
    // 在这里调用接口
    fetch(`/api/tasks/${task.id}/details`)
      .then(res => res.json())
      .then(data => console.log(data));
  }}
  // 自定义按钮图标（可选，不传则使用默认图标）
  taskTitleActionIcon={
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 2v4M8 10v4M2 8h4M10 8h4" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  }
/>
```

#### 默认图标：

如果不提供 `taskTitleActionIcon`，会使用默认的信息图标（圆圈加感叹号）。

## 完整示例

```tsx
import { Gantt, Task } from 'gantt-task-react';
import { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: '项目任务',
      start: new Date('2024-01-15'),
      end: new Date('2024-01-20'),
      progress: 30,
      type: 'task',
      status: '處理中',
      assignee: '张三',
    },
  ]);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  return (
    <Gantt
      tasks={tasks}
      viewType="oaTask"
      // 功能1: 多选框配置
      rowSelection={{
        selectedRowKeys: selectedKeys,
        onChange: (keys, rows) => {
          setSelectedKeys(keys);
          console.log('选中的任务:', rows);
        },
        checkboxBorderColor: '#1890ff', // 自定义复选框颜色
      }}
      // 功能3: 自定义任务标题按钮
      onTaskTitleAction={(task) => {
        console.log('点击了任务:', task);
        // 调用接口获取任务详情
        fetch(`/api/tasks/${task.id}/details`)
          .then(res => res.json())
          .then(data => {
            alert(`任务详情: ${JSON.stringify(data)}`);
          });
      }}
      taskTitleActionIcon={
        <span style={{ fontSize: '16px', color: '#1890ff' }}>ℹ️</span>
      }
    />
  );
}

export default App;
```

## TypeScript 类型定义

新增的类型定义：

```typescript
interface GanttProps {
  // ... 其他属性
  
  /** 多选列配置 */
  rowSelection?: {
    selectedRowKeys?: string[];
    onChange?: (selectedRowKeys: string[], selectedRows: Task[]) => void;
    rowKey?: keyof Task | ((record: Task) => string);
    columnWidth?: string;
    columnTitle?: React.ReactNode;
    showSelectAll?: boolean;
    getCheckboxProps?: (record: Task) => { disabled?: boolean };
    checkboxBorderColor?: string; // 新增
  };
  
  /** 自定义任务标题旁边的操作按钮/图标点击事件 */
  onTaskTitleAction?: (task: Task) => void; // 新增
  
  /** 自定义任务标题旁边的按钮图标 */
  taskTitleActionIcon?: React.ReactNode; // 新增
}
```

## 注意事项

1. **多选框颜色**: `checkboxBorderColor` 使用的是 CSS 的 `accent-color` 属性，部分旧浏览器可能不支持。
2. **时间规范化**: 时间规范化是自动的，不需要手动设置，但要注意这会改变传入的 `start` 和 `end` 时间。
3. **自定义按钮**: 按钮只在 `viewType="oaTask"` 模式下显示，如需在其他模式使用，可以通过 `columnRenderers` 自定义列渲染。

## 浏览器兼容性

- Chrome 93+
- Firefox 93+
- Safari 15.4+
- Edge 93+

对于不支持 `accent-color` 的浏览器，复选框会使用浏览器默认样式。
