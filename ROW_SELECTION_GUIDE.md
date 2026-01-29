# 多选列功能使用指南

## 功能介绍

本功能实现了类似 Ant Design Table 的多选列，支持在甘特图左侧任务列表中显示复选框，允许用户进行多选操作。

## 功能特点

1. **通用配置型**: 通过配置对象轻松启用/禁用多选功能
2. **灵活的 key 绑定**: 支持指定任何字段作为选中项的唯一标识
3. **全选/取消全选**: 表头提供全选复选框，支持半选状态
4. **事件暴露**: 提供 `onChange` 回调，实时获取选中的行信息
5. **自定义渲染**: 支持自定义复选框的渲染方式
6. **列宽可配置**: 可自定义多选列的宽度

## 配置说明

### RowSelectionConfig 接口

```typescript
export interface RowSelectionConfig {
  /** 是否显示多选列，默认false */
  enabled?: boolean;
  /** 多选列宽度，默认 "60px" */
  columnWidth?: string;
  /** 指定选中项的 key，对应 Task 中的字段，默认 "id" */
  rowKey?: string;
  /** 已选中的行的 key 数组 */
  selectedRowKeys?: string[];
  /** 选中项发生变化时的回调 */
  onChange?: (selectedRowKeys: string[], selectedRows: Task[]) => void;
  /** 自定义复选框渲染（可选） */
  renderCheckbox?: (checked: boolean, task: Task, onChange: (checked: boolean) => void) => React.ReactNode;
}
```

### GanttProps 新增属性

```typescript
export interface GanttProps {
  // ... 其他属性
  /** 行选择配置（多选列） */
  rowSelection?: RowSelectionConfig;
}
```

## 使用示例

### 基础使用

```tsx
import React, { useState } from 'react';
import { Gantt, Task } from 'gantt-task-react';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([...]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<Task[]>([]);

  const handleRowSelectionChange = (keys: string[], rows: Task[]) => {
    console.log("选中的行Keys:", keys);
    console.log("选中的行数据:", rows);
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
  };

  return (
    <div>
      <Gantt
        tasks={tasks}
        // 启用多选列
        rowSelection={{
          enabled: true,
          selectedRowKeys: selectedRowKeys,
          onChange: handleRowSelectionChange,
        }}
      />
      
      {/* 显示选中结果 */}
      <div>
        <h3>已选中 {selectedRowKeys.length} 项</h3>
        <div>选中的任务: {selectedRows.map(row => row.name).join(", ")}</div>
      </div>
    </div>
  );
};
```

### 自定义 rowKey

如果你的任务对象使用的不是 `id` 字段作为唯一标识，可以通过 `rowKey` 指定：

```tsx
<Gantt
  tasks={tasks}
  rowSelection={{
    enabled: true,
    rowKey: "taskId",  // 使用自定义的字段名
    selectedRowKeys: selectedRowKeys,
    onChange: handleRowSelectionChange,
  }}
/>
```

### 自定义列宽

```tsx
<Gantt
  tasks={tasks}
  rowSelection={{
    enabled: true,
    columnWidth: "80px",  // 自定义多选列宽度
    selectedRowKeys: selectedRowKeys,
    onChange: handleRowSelectionChange,
  }}
/>
```

### 自定义复选框渲染

```tsx
<Gantt
  tasks={tasks}
  rowSelection={{
    enabled: true,
    selectedRowKeys: selectedRowKeys,
    onChange: handleRowSelectionChange,
    renderCheckbox: (checked, task, onChange) => (
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ 
          cursor: 'pointer',
          width: '16px',
          height: '16px',
        }}
      />
    ),
  }}
/>
```

### 动态启用/禁用

```tsx
const [enableSelection, setEnableSelection] = useState(true);

<div>
  <label>
    <input
      type="checkbox"
      checked={enableSelection}
      onChange={(e) => setEnableSelection(e.target.checked)}
    />
    显示多选列
  </label>
  
  <Gantt
    tasks={tasks}
    rowSelection={enableSelection ? {
      enabled: true,
      selectedRowKeys: selectedRowKeys,
      onChange: handleRowSelectionChange,
    } : undefined}
  />
</div>
```

## Demo 示例

在 `example/src/App.tsx` 中已经集成了完整的多选列功能演示：

1. 通过复选框控制是否显示多选列
2. 实时显示选中的任务数量和名称
3. 展示如何处理选择变化事件

运行示例：

```bash
# 在项目根目录
npm run start

# 在另一个终端窗口，启动 example
cd example
npm start
```

访问 `http://localhost:3000` 即可看到多选列功能。

## API 参考

### onChange 回调参数

```typescript
onChange?: (selectedRowKeys: string[], selectedRows: Task[]) => void;
```

- `selectedRowKeys`: 选中行的 key 数组
- `selectedRows`: 选中行的完整 Task 对象数组

### 全选逻辑

- 点击表头复选框时：
  - 如果当前未全选，则全选所有任务
  - 如果当前已全选，则取消所有选择
- 半选状态：当部分任务被选中时，表头复选框显示为半选状态

### 选中状态管理

选中状态由父组件通过 `selectedRowKeys` 和 `onChange` 进行控制（受控组件模式）。

## 注意事项

1. 多选列功能需要 `rowSelection.enabled` 设置为 `true` 才会显示
2. `selectedRowKeys` 必须是字符串数组，即使 `rowKey` 对应的字段是数字类型
3. 建议使用 `React.useCallback` 包裹 `onChange` 回调，避免不必要的重渲染
4. 自定义 `renderCheckbox` 时，确保正确处理 `onChange` 回调

## 更新日志

### v1.0.0
- ✅ 实现基础多选列功能
- ✅ 支持全选/取消全选
- ✅ 支持半选状态
- ✅ 支持自定义 rowKey
- ✅ 支持自定义列宽
- ✅ 支持自定义复选框渲染
- ✅ 在 example 中提供完整演示
