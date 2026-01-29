# 多选列功能使用指南

## ✅ 功能概述

类似 Ant Design Table 的多选列功能已完整实现，支持：

- ✅ 表头全选复选框（支持半选状态 indeterminate）
- ✅ 每行复选框，可独立选择
- ✅ 自定义 rowKey 字段绑定
- ✅ 选中状态变化事件回调
- ✅ 禁用特定行的复选框
- ✅ 自定义列宽和标题
- ✅ Demo 完整演示

## 🎯 快速开始

### 1. 基本使用

```tsx
import { Gantt, Task } from 'gantt-task-react';
import { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([...]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  return (
    <Gantt
      tasks={tasks}
      viewType="oaTask"
      rowSelection={{
        selectedRowKeys,
        onChange: (keys, rows) => {
          console.log("选中的keys:", keys);
          console.log("选中的行:", rows);
          setSelectedRowKeys(keys);
        },
      }}
    />
  );
}
```

### 2. API 配置项

#### rowSelection 配置对象

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `selectedRowKeys` | `string[]` | `[]` | 指定选中项的 key 数组 |
| `onChange` | `(selectedRowKeys: string[], selectedRows: Task[]) => void` | - | 选中项发生变化时的回调 |
| `rowKey` | `keyof Task \| ((record: Task) => string)` | `'id'` | 表格行 key 的取值字段 |
| `columnWidth` | `string` | `'50px'` | 选择列的宽度 |
| `columnTitle` | `React.ReactNode` | `'選擇'` | 选择列的标题 |
| `showSelectAll` | `boolean` | `true` | 是否显示全选复选框 |
| `getCheckboxProps` | `(record: Task) => { disabled?: boolean }` | - | 选择框的禁用配置 |

## 📝 使用示例

### 示例 1：自定义 rowKey

```tsx
<Gantt
  tasks={tasks}
  rowSelection={{
    rowKey: "name", // 使用任务名称作为 key
    // 或使用函数
    rowKey: (record) => `task_${record.id}`,
    selectedRowKeys,
    onChange: (keys, rows) => setSelectedRowKeys(keys),
  }}
/>
```

### 示例 2：禁用特定行

```tsx
<Gantt
  tasks={tasks}
  rowSelection={{
    selectedRowKeys,
    onChange: (keys, rows) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      disabled: record.status === "已完成", // 已完成的任务禁用选择
    }),
  }}
/>
```

### 示例 3：批量操作

```tsx
function App() {
  const [tasks, setTasks] = useState<Task[]>([...]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      alert("请先选择要删除的任务");
      return;
    }
    
    const newTasks = tasks.filter(t => !selectedRowKeys.includes(t.id));
    setTasks(newTasks);
    setSelectedRowKeys([]);
    alert(`已删除 ${selectedRowKeys.length} 个任务`);
  };

  // 批量更新状态
  const handleBatchUpdateStatus = (newStatus: string) => {
    const updatedTasks = tasks.map(t => 
      selectedRowKeys.includes(t.id) ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={handleBatchDelete} disabled={selectedRowKeys.length === 0}>
          批量删除 ({selectedRowKeys.length})
        </Button>
        <Button onClick={() => handleBatchUpdateStatus("已完成")} disabled={selectedRowKeys.length === 0}>
          批量完成 ({selectedRowKeys.length})
        </Button>
        <span style={{ marginLeft: 16 }}>
          已选择 {selectedRowKeys.length} 个任务
        </span>
      </div>
      
      <Gantt
        tasks={tasks}
        viewType="oaTask"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys, rows) => {
            console.log("选中变化:", keys);
            setSelectedRowKeys(keys);
          },
          getCheckboxProps: (record) => ({
            disabled: record.type === "project", // 项目类型不可选
          }),
        }}
      />
    </div>
  );
}
```

### 示例 4：条件选择

```tsx
// 选择所有待处理的任务
const selectPendingTasks = () => {
  const pendingKeys = tasks
    .filter(t => t.status === "待確認")
    .map(t => t.id);
  setSelectedRowKeys(pendingKeys);
};

// 反选
const invertSelection = () => {
  const allKeys = tasks.map(t => t.id);
  const invertedKeys = allKeys.filter(k => !selectedRowKeys.includes(k));
  setSelectedRowKeys(invertedKeys);
};

// 清空选择
const clearSelection = () => {
  setSelectedRowKeys([]);
};
```

## 🎬 Demo 演示

在 `example/src/App.tsx` 中已经集成了完整的多选列功能演示，包括：

1. **显示/隐藏多选列开关**
2. **实时显示选中数量**
3. **批量删除功能**
4. **清空选择功能**
5. **显示选中的任务 IDs**

### 运行 Demo

```bash
# 在项目根目录构建库
npm run build

# 启动 example
cd example
npm install
npm start
```

访问 `http://localhost:3000` 即可看到多选列功能演示。

## 🔧 实现细节

### 1. 类型定义（public-types.ts）

```typescript
export interface GanttProps extends EventOption, DisplayOption, StylingOption {
  // ... 其他属性
  
  /** 多选列配置 */
  rowSelection?: {
    /** 指定选中项的 key 数组 */
    selectedRowKeys?: string[];
    /** 选中项发生变化时的回调 */
    onChange?: (selectedRowKeys: string[], selectedRows: Task[]) => void;
    /** 表格行 key 的取值字段，默认为 'id' */
    rowKey?: keyof Task | ((record: Task) => string);
    /** 自定义列表选择框宽度，默认 "50px" */
    columnWidth?: string;
    /** 自定义列表选择框标题 */
    columnTitle?: React.ReactNode;
    /** 是否显示全选复选框，默认 true */
    showSelectAll?: boolean;
    /** 禁用的行，返回 true 表示禁用该行的复选框 */
    getCheckboxProps?: (record: Task) => { disabled?: boolean };
  };
}
```

### 2. 表头组件（oa-task-list-header.tsx）

- 支持全选复选框
- 支持半选状态（indeterminate）
- 可自定义列标题

### 3. 表格组件（oa-task-list-table.tsx）

- 每行显示复选框
- 支持行级禁用
- 自动计算选中状态

### 4. 状态管理（gantt.tsx）

- 维护 `selectedRowKeys` 状态
- 计算全选和半选状态
- 处理选择变化事件

## ⚠️ 注意事项

1. **仅支持 OA 模式**：多选列功能目前仅在 `viewType="oaTask"` 模式下可用
2. **唯一键要求**：确保每个任务的 `rowKey` 字段值唯一
3. **受控组件**：选中状态是受控的，需要通过 `onChange` 回调更新 `selectedRowKeys`
4. **禁用行不参与全选**：通过 `getCheckboxProps` 禁用的行不会被全选功能选中
5. **字符串键值**：`selectedRowKeys` 必须是字符串数组，即使 `rowKey` 对应的字段是数字类型

## 💡 最佳实践

1. **使用 useCallback 优化性能**

```tsx
const handleRowSelectionChange = useCallback((keys: string[], rows: Task[]) => {
  setSelectedRowKeys(keys);
  // 其他处理逻辑
}, []);
```

2. **持久化选中状态**

```tsx
// 保存到 localStorage
useEffect(() => {
  localStorage.setItem('selectedTasks', JSON.stringify(selectedRowKeys));
}, [selectedRowKeys]);

// 从 localStorage 恢复
useEffect(() => {
  const saved = localStorage.getItem('selectedTasks');
  if (saved) {
    setSelectedRowKeys(JSON.parse(saved));
  }
}, []);
```

3. **批量操作前确认**

```tsx
const handleBatchOperation = () => {
  if (selectedRowKeys.length === 0) {
    message.warning("请先选择要操作的任务");
    return;
  }
  
  Modal.confirm({
    title: '确认操作',
    content: `确定要操作选中的 ${selectedRowKeys.length} 个任务吗？`,
    onOk: () => {
      // 执行批量操作
    },
  });
};
```

## 🎨 UI 定制

### 自定义复选框样式

```css
/* 在你的 CSS 文件中 */
input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #1890ff;
}

input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
```

### 自定义列宽和样式

```tsx
<Gantt
  rowSelection={{
    selectedRowKeys,
    onChange: handleRowSelectionChange,
    columnWidth: "60px",
    columnTitle: (
      <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
        ✓ 选择
      </span>
    ),
  }}
/>
```

## 🔍 故障排查

### 问题 1：复选框不显示

**原因**：未设置 `viewType="oaTask"`

**解决**：确保 Gantt 组件使用了 OA 模式

```tsx
<Gantt viewType="oaTask" rowSelection={{...}} />
```

### 问题 2：全选不工作

**原因**：禁用的行阻止了全选

**解决**：检查 `getCheckboxProps` 配置，确保逻辑正确

### 问题 3：选中状态不更新

**原因**：未正确更新 `selectedRowKeys` 状态

**解决**：在 `onChange` 回调中更新状态

```tsx
onChange: (keys, rows) => {
  setSelectedRowKeys(keys); // 必须调用
}
```

## 📦 完整代码文件

本功能涉及以下文件的修改：

1. `src/types/public-types.ts` - 类型定义
2. `src/components/task-list/oa-task-list-header.tsx` - 表头组件
3. `src/components/task-list/oa-task-list-table.tsx` - 表格组件
4. `src/components/gantt/gantt.tsx` - 主组件
5. `example/src/App.tsx` - Demo 演示

所有修改已完成，可以直接使用。

## 🎉 总结

多选列功能已完整实现，提供了类似 Ant Design Table 的用户体验，支持：

✅ 灵活的配置选项
✅ 完善的事件回调
✅ 强大的批量操作能力
✅ 友好的 Demo 演示

立即运行 Demo 查看效果！
