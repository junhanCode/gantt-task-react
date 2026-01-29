# 多选列功能 - 完整实现文档

## ✅ 实现状态

**状态：已完成并可用** 🎉

- ✅ 核心功能实现
- ✅ 类型定义完整
- ✅ 打包构建成功
- ✅ Demo 演示完整
- ✅ 文档齐全

## 🎯 功能清单

### 1. 基础功能

- [x] 表头全选复选框
- [x] 表头半选状态（indeterminate）
- [x] 每行独立复选框
- [x] 选中状态管理
- [x] 全选/取消全选
- [x] 单行选中/取消选中

### 2. 高级配置

- [x] 自定义 rowKey 字段绑定
- [x] 支持函数式 rowKey
- [x] 自定义列宽
- [x] 自定义列标题
- [x] 显示/隐藏全选复选框
- [x] 禁用特定行（可选）

### 3. 事件回调

- [x] onChange 选择变化回调
- [x] 返回选中的 keys 数组
- [x] 返回选中的完整 Task 对象数组
- [x] 实时更新选中状态

### 4. Demo 演示

- [x] 显示/隐藏多选列开关
- [x] 实时显示选中数量
- [x] 批量删除功能
- [x] 清空选择功能
- [x] 显示选中的任务 IDs
- [x] 所有任务类型都可选中（包括项目）

## 📝 API 文档

### rowSelection 配置对象

```typescript
interface RowSelection {
  // 指定选中项的 key 数组（受控）
  selectedRowKeys?: string[];
  
  // 选中项发生变化时的回调
  onChange?: (
    selectedRowKeys: string[], 
    selectedRows: Task[]
  ) => void;
  
  // 表格行 key 的取值字段，默认为 'id'
  rowKey?: keyof Task | ((record: Task) => string);
  
  // 选择列的宽度，默认 "50px"
  columnWidth?: string;
  
  // 选择列的标题
  columnTitle?: React.ReactNode;
  
  // 是否显示全选复选框，默认 true
  showSelectAll?: boolean;
  
  // 选择框的禁用配置（可选）
  getCheckboxProps?: (record: Task) => { 
    disabled?: boolean 
  };
}
```

### 使用示例

#### 基础用法

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

#### 自定义 rowKey

```tsx
<Gantt
  tasks={tasks}
  rowSelection={{
    // 使用字段名
    rowKey: "name",
    
    // 或使用函数
    rowKey: (record) => `task_${record.id}`,
    
    selectedRowKeys,
    onChange: (keys, rows) => setSelectedRowKeys(keys),
  }}
/>
```

#### 禁用特定行

```tsx
<Gantt
  tasks={tasks}
  rowSelection={{
    selectedRowKeys,
    onChange: (keys, rows) => setSelectedRowKeys(keys),
    
    // 禁用已完成的任务
    getCheckboxProps: (record) => ({
      disabled: record.status === "已完成",
    }),
  }}
/>
```

#### 自定义样式

```tsx
<Gantt
  tasks={tasks}
  rowSelection={{
    selectedRowKeys,
    onChange: (keys, rows) => setSelectedRowKeys(keys),
    columnWidth: "60px",
    columnTitle: (
      <span style={{ color: '#1890ff' }}>✓ 选择</span>
    ),
    showSelectAll: true,
  }}
/>
```

## 🎬 Demo 使用指南

### 启动 Demo

```bash
# 1. 在项目根目录构建库
npm run build

# 2. 进入 example 目录
cd example

# 3. 启动开发服务器
npm start
```

### 访问 Demo

打开浏览器访问：http://localhost:3000

### Demo 功能说明

1. **多选列演示控制面板**（蓝色背景区域）
   - `显示多选列` 复选框：控制多选列的显示/隐藏
   - `已选择：X 个任务`：实时显示选中的任务数量
   - `批量删除 (X)` 按钮：批量删除选中的任务
   - `清空选择` 按钮：清除所有选中状态
   - `选中的任务 IDs`：显示当前选中的任务 ID 列表

2. **表格操作**
   - 点击表头复选框：全选/取消全选所有任务
   - 点击行复选框：选中/取消选中单个任务
   - 半选状态：当部分任务被选中时，表头复选框显示半选状态

3. **批量操作**
   - 选中多个任务后，点击"批量删除"按钮
   - 系统会提示确认，确认后删除选中的任务
   - 删除后自动清空选中状态

## 💡 使用场景

### 1. 批量删除

```tsx
const handleBatchDelete = () => {
  if (selectedRowKeys.length === 0) {
    alert("请先选择要删除的任务");
    return;
  }
  
  const newTasks = tasks.filter(t => !selectedRowKeys.includes(t.id));
  setTasks(newTasks);
  setSelectedRowKeys([]);
};
```

### 2. 批量更新状态

```tsx
const handleBatchUpdateStatus = (newStatus: string) => {
  const updatedTasks = tasks.map(t => 
    selectedRowKeys.includes(t.id) 
      ? { ...t, status: newStatus } 
      : t
  );
  setTasks(updatedTasks);
};
```

### 3. 批量导出

```tsx
const handleBatchExport = () => {
  const selectedTasks = tasks.filter(t => 
    selectedRowKeys.includes(t.id)
  );
  
  // 导出逻辑
  console.log("导出任务:", selectedTasks);
  downloadAsJSON(selectedTasks, "selected-tasks.json");
};
```

### 4. 条件选择

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
  const invertedKeys = allKeys.filter(k => 
    !selectedRowKeys.includes(k)
  );
  setSelectedRowKeys(invertedKeys);
};
```

## 🔧 技术实现

### 文件修改清单

1. **src/types/public-types.ts**
   - 添加 `rowSelection` 配置接口到 `GanttProps`

2. **src/components/task-list/oa-task-list-header.tsx**
   - 添加表头全选复选框
   - 实现半选状态（indeterminate）
   - 支持自定义列标题

3. **src/components/task-list/oa-task-list-table.tsx**
   - 添加多选列到表格
   - 实现每行复选框
   - 处理选择状态变化
   - 支持行级禁用

4. **src/components/gantt/gantt.tsx**
   - 管理 `selectedRowKeys` 状态
   - 实现全选逻辑
   - 计算全选和半选状态
   - 传递 props 到子组件

5. **example/src/App.tsx**
   - 添加多选状态管理
   - 实现批量操作功能
   - 创建演示 UI 控制面板

### 核心逻辑

#### 1. 获取行的 key

```typescript
const getRowKey = (task: Task): string => {
  if (!rowSelection?.rowKey) return task.id;
  if (typeof rowSelection.rowKey === 'function') {
    return rowSelection.rowKey(task);
  }
  return String(task[rowSelection.rowKey]);
};
```

#### 2. 全选逻辑

```typescript
const handleSelectAll = (checked: boolean) => {
  if (!rowSelection) return;
  
  // 过滤出可选的任务
  const availableTasks = tasks.filter(t => {
    if (!rowSelection.getCheckboxProps) return true;
    const props = rowSelection.getCheckboxProps(t);
    return !props.disabled;
  });
  
  // 全选或清空
  const newSelectedKeys = checked 
    ? availableTasks.map(t => getRowKey(t)) 
    : [];
  const newSelectedRows = checked ? availableTasks : [];
  
  handleRowSelectionChange(newSelectedKeys, newSelectedRows);
};
```

#### 3. 半选状态计算

```typescript
const indeterminate = (() => {
  const availableTasks = tasks.filter(t => {
    if (!rowSelection.getCheckboxProps) return true;
    const props = rowSelection.getCheckboxProps(t);
    return !props.disabled;
  });
  
  if (availableTasks.length === 0) return false;
  
  const selectedCount = availableTasks.filter(t => 
    selectedRowKeys.includes(getRowKey(t))
  ).length;
  
  return selectedCount > 0 && selectedCount < availableTasks.length;
})();
```

## ⚠️ 注意事项

1. **仅支持 OA 模式**
   - 多选列功能目前仅在 `viewType="oaTask"` 模式下可用
   - 默认模式不显示多选列

2. **受控组件**
   - 选中状态是受控的，必须通过 `selectedRowKeys` 和 `onChange` 管理
   - 不支持非受控模式

3. **唯一键要求**
   - 确保每个任务的 `rowKey` 字段值唯一
   - 默认使用 `id` 字段

4. **禁用行不参与全选**
   - 通过 `getCheckboxProps` 禁用的行不会被全选功能选中
   - 但可以通过程序手动设置这些行为选中状态

5. **字符串键值**
   - `selectedRowKeys` 必须是字符串数组
   - 即使 `rowKey` 对应的字段是数字类型，也会转换为字符串

## 🐛 故障排查

### 问题 1：复选框不显示

**原因**：未设置 `viewType="oaTask"`

**解决**：
```tsx
<Gantt viewType="oaTask" rowSelection={{...}} />
```

### 问题 2：全选不工作

**原因**：可能所有行都被禁用了

**解决**：检查 `getCheckboxProps` 配置

### 问题 3：选中状态不更新

**原因**：未在 `onChange` 中更新状态

**解决**：
```tsx
onChange: (keys, rows) => {
  setSelectedRowKeys(keys); // 必须调用
}
```

### 问题 4：构建错误

**常见错误**：JSX Fragment 不支持

**解决**：使用 `<React.Fragment>` 替代 `<>`

## 📦 构建结果

```
Build "ganttTaskReact" to dist:
      30.9 kB: index.js.gz
      25.2 kB: index.js.br
      30.6 kB: index.modern.js.gz
        25 kB: index.modern.js.br
```

✅ **构建成功，体积合理**

## 📚 相关文档

- `MULTI_SELECT_FEATURE.md` - 详细使用指南
- `MULTI_SELECT_SUMMARY.md` - 实现总结
- `ROW_SELECTION_GUIDE.md` - 功能说明

## 🎉 总结

多选列功能已完整实现，包括：

✅ **核心功能**
- 表头全选/半选
- 行级复选框
- 灵活的配置选项

✅ **高级特性**
- 自定义 rowKey
- 禁用特定行
- 事件回调

✅ **完整 Demo**
- 批量操作演示
- 实时状态显示
- 用户友好的 UI

✅ **技术质量**
- TypeScript 类型完整
- 无编译错误
- 无 linter 警告（核心库）

**现在可以直接使用多选列功能！** 🚀

访问 http://localhost:3000 查看完整演示效果。
