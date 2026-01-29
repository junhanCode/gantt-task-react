# 多选列功能 - 快速开始

## 🚀 5分钟上手

### 1. 基本使用

```tsx
import { Gantt, Task } from 'gantt-task-react';
import { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([...your tasks...]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  return (
    <Gantt
      tasks={tasks}
      viewType="oaTask"  // 必须设置为 oaTask 模式
      rowSelection={{
        selectedRowKeys,
        onChange: (keys, rows) => {
          console.log("选中:", keys);
          setSelectedRowKeys(keys);
        },
      }}
    />
  );
}
```

### 2. 添加批量操作

```tsx
function App() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // 批量删除
  const handleBatchDelete = () => {
    const newTasks = tasks.filter(t => !selectedRowKeys.includes(t.id));
    setTasks(newTasks);
    setSelectedRowKeys([]);
  };

  return (
    <div>
      <button 
        onClick={handleBatchDelete}
        disabled={selectedRowKeys.length === 0}
      >
        批量删除 ({selectedRowKeys.length})
      </button>
      
      <Gantt
        tasks={tasks}
        viewType="oaTask"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys, rows) => setSelectedRowKeys(keys),
        }}
      />
    </div>
  );
}
```

### 3. 自定义配置

```tsx
<Gantt
  tasks={tasks}
  viewType="oaTask"
  rowSelection={{
    selectedRowKeys,
    onChange: (keys, rows) => setSelectedRowKeys(keys),
    
    // 自定义列宽
    columnWidth: "60px",
    
    // 自定义标题
    columnTitle: "选择",
    
    // 隐藏全选复选框
    showSelectAll: false,
    
    // 禁用特定行
    getCheckboxProps: (record) => ({
      disabled: record.status === "已完成",
    }),
  }}
/>
```

## 📝 配置项速查

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `selectedRowKeys` | `string[]` | `[]` | 选中的 keys |
| `onChange` | `function` | - | 选择变化回调 |
| `rowKey` | `string \| function` | `'id'` | key 字段名 |
| `columnWidth` | `string` | `'50px'` | 列宽 |
| `columnTitle` | `ReactNode` | `'選擇'` | 列标题 |
| `showSelectAll` | `boolean` | `true` | 显示全选 |
| `getCheckboxProps` | `function` | - | 禁用配置 |

## 🎯 常用场景

### 批量更新状态

```tsx
const updateSelected = (newStatus: string) => {
  setTasks(tasks.map(t => 
    selectedRowKeys.includes(t.id) 
      ? { ...t, status: newStatus } 
      : t
  ));
};
```

### 全选某类任务

```tsx
const selectPending = () => {
  const keys = tasks
    .filter(t => t.status === "待處理")
    .map(t => t.id);
  setSelectedRowKeys(keys);
};
```

### 反选

```tsx
const invertSelection = () => {
  const allKeys = tasks.map(t => t.id);
  const inverted = allKeys.filter(k => !selectedRowKeys.includes(k));
  setSelectedRowKeys(inverted);
};
```

## ✅ 完成！

现在访问 http://localhost:3000 查看完整 Demo 演示。

更多详细文档请查看 `MULTI_SELECT_COMPLETE.md`。
