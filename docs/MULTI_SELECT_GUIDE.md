# 多选功能完整指南

本文档整合了所有多选列和级联选择相关的功能说明。

---

## 📋 目录

1. [功能概述](#功能概述)
2. [快速开始](#快速开始)
3. [基础用法](#基础用法)
4. [级联选择](#级联选择)
5. [API 参考](#api-参考)
6. [示例代码](#示例代码)
7. [常见问题](#常见问题)

---

## 功能概述

### ✅ 核心功能

类似 Ant Design Table 的多选列功能已完整实现，支持：

- ✅ 表头全选复选框（支持半选状态 indeterminate）
- ✅ 每行复选框，可独立选择
- ✅ 自定义 rowKey 字段绑定
- ✅ 选中状态变化事件回调
- ✅ 禁用特定行的复选框
- ✅ 自定义列宽和标题
- ✅ **级联选择** - 选中父任务自动选中子任务
- ✅ **自定义复选框颜色** - 自定义边框颜色

---

## 快速开始

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

### 2. 启用级联选择

```tsx
function App() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  
  // 级联选择处理函数
  const handleRowSelectionChange = (selectedKeys: string[], selectedRows: Task[]) => {
    // 获取所有子任务（递归）
    const getAllChildren = (parentId: string): Task[] => {
      const children: Task[] = [];
      const directChildren = tasks.filter(t => t.project === parentId);
      
      directChildren.forEach(child => {
        children.push(child);
        children.push(...getAllChildren(child.id));
      });
      
      return children;
    };
    
    // 找出新增和移除的keys
    const previousKeys = new Set(selectedRowKeys);
    const newKeys = new Set(selectedKeys);
    const addedKeys = selectedKeys.filter(key => !previousKeys.has(key));
    const removedKeys = selectedRowKeys.filter(key => !newKeys.has(key));
    
    let finalKeys = [...selectedKeys];
    
    // 向下级联 - 选中父任务时自动选中所有子任务
    addedKeys.forEach(addedKey => {
      const children = getAllChildren(addedKey);
      const childrenKeys = children.map(c => c.id);
      childrenKeys.forEach(childKey => {
        if (!finalKeys.includes(childKey)) {
          finalKeys.push(childKey);
        }
      });
    });
    
    // 向下级联 - 取消父任务时自动取消所有子任务
    removedKeys.forEach(removedKey => {
      const children = getAllChildren(removedKey);
      const childrenKeys = children.map(c => c.id);
      finalKeys = finalKeys.filter(key => 
        key !== removedKey && !childrenKeys.includes(key)
      );
    });
    
    setSelectedRowKeys(finalKeys);
  };

  return (
    <Gantt
      tasks={tasks}
      viewType="oaTask"
      rowSelection={{
        selectedRowKeys,
        onChange: handleRowSelectionChange,
      }}
    />
  );
}
```

### 3. 自定义复选框颜色

```tsx
<Gantt
  tasks={tasks}
  viewType="oaTask"
  rowSelection={{
    selectedRowKeys,
    onChange: (keys, rows) => setSelectedRowKeys(keys),
    checkboxBorderColor: '#52c41a', // 自定义复选框颜色
  }}
/>
```

---

## 基础用法

### API 配置项

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
| `checkboxBorderColor` | `string` | `'#d9d9d9'` | 复选框边框颜色（CSS变量） |

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
          onChange: (keys, rows) => setSelectedRowKeys(keys),
        }}
      />
    </div>
  );
}
```

---

## 级联选择

### 🌲 功能特性

#### 1. 向下级联（父 → 子）

**选中父任务时**：
- ✅ 自动选中所有直接子任务
- ✅ 递归选中所有后代任务（孙子任务、曾孙任务等）
- ✅ 无论层级多深，都会完全选中

**示例**：
```
父任务 (选中)
├── 子任务1 (自动选中)
│   ├── 孙任务1-1 (自动选中)
│   └── 孙任务1-2 (自动选中)
└── 子任务2 (自动选中)
    └── 孙任务2-1 (自动选中)
```

#### 2. 向上级联（子 → 父）

**当所有子任务都被选中时**：
- ✅ 自动选中父任务
- ✅ 递归向上检查，多层级联
- ✅ 智能判断，只有所有子任务都选中才选中父任务

**示例**：
```
# 步骤1: 选中第一个子任务
父任务 (未选中)
├── 子任务1 (选中) ✓
└── 子任务2 (未选中)

# 步骤2: 选中第二个子任务
父任务 (自动选中) ✓
├── 子任务1 (选中) ✓
└── 子任务2 (选中) ✓
```

### 级联选择实现示例

```typescript
const handleRowSelectionChange = (selectedKeys: string[], selectedRows: Task[]) => {
  // 获取所有子任务（递归）
  const getAllChildren = (parentId: string): Task[] => {
    const children: Task[] = [];
    const directChildren = tasks.filter(t => t.project === parentId);
    
    directChildren.forEach(child => {
      children.push(child);
      const grandChildren = getAllChildren(child.id);
      children.push(...grandChildren);
    });
    
    return children;
  };

  // 获取直接子任务
  const getDirectChildren = (parentId: string): Task[] => {
    return tasks.filter(t => t.project === parentId);
  };

  // 找出新增和移除的keys
  const previousKeys = new Set(selectedRowKeys);
  const newKeys = new Set(selectedKeys);
  const addedKeys = selectedKeys.filter(key => !previousKeys.has(key));
  const removedKeys = selectedRowKeys.filter(key => !newKeys.has(key));
  
  let finalKeys = [...selectedKeys];
  
  // 向下级联 - 选中父任务时自动选中所有子任务
  addedKeys.forEach(addedKey => {
    const children = getAllChildren(addedKey);
    const childrenKeys = children.map(c => c.id);
    childrenKeys.forEach(childKey => {
      if (!finalKeys.includes(childKey)) {
        finalKeys.push(childKey);
      }
    });
  });
  
  // 向下级联 - 取消父任务时自动取消所有子任务
  removedKeys.forEach(removedKey => {
    const children = getAllChildren(removedKey);
    const childrenKeys = children.map(c => c.id);
    finalKeys = finalKeys.filter(key => 
      key !== removedKey && !childrenKeys.includes(key)
    );
  });
  
  // 向上级联 - 检查父任务
  const checkAndSelectParents = (keys: string[]): string[] => {
    let resultKeys = [...keys];
    const keysSet = new Set(resultKeys);
    
    // 获取所有可能的父任务
    const allParentIds = new Set(
      tasks
        .filter(t => t.project)
        .map(t => t.project!)
    );
    
    allParentIds.forEach(parentId => {
      if (keysSet.has(parentId)) return;
      
      const children = getDirectChildren(parentId);
      if (children.length === 0) return;
      
      const allChildrenSelected = children.every(child => keysSet.has(child.id));
      
      if (allChildrenSelected) {
        resultKeys.push(parentId);
        keysSet.add(parentId);
      }
    });
    
    return resultKeys;
  };
  
  // 递归检查并选中父任务（最多10层防止无限循环）
  let previousLength = 0;
  let currentKeys = finalKeys;
  
  for (let i = 0; i < 10; i++) {
    currentKeys = checkAndSelectParents(currentKeys);
    if (currentKeys.length === previousLength) break;
    previousLength = currentKeys.length;
  }
  
  console.log("级联后的任务 IDs:", currentKeys);
  setSelectedRowKeys(currentKeys);
};
```

### 何时启用级联选择

✅ **适合启用的场景**：
- 需要批量操作整个任务组
- 希望保持父子任务的一致性
- 用户通常会整体选择/操作任务树

❌ **不适合启用的场景**：
- 需要精确选择特定任务
- 父子任务需要独立操作
- 任务层级很深，级联会选中太多任务

---

## API 参考

### TypeScript 类型定义

```typescript
export interface GanttProps extends EventOption, DisplayOption, StylingOption {
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
    
    /** 复选框边框颜色，支持任意CSS颜色值 */
    checkboxBorderColor?: string;
  };
}
```

---

## 示例代码

### 完整示例：多选 + 级联 + 批量操作

```tsx
import React, { useState, useCallback } from 'react';
import { Gantt, Task } from 'gantt-task-react';
import { Button, Space } from 'antd';

function TaskGanttWithMultiSelect() {
  const [tasks, setTasks] = useState<Task[]>([...]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [enableCascade, setEnableCascade] = useState(true);

  // 获取所有子任务（递归）
  const getAllChildren = useCallback((parentId: string): Task[] => {
    const children: Task[] = [];
    const directChildren = tasks.filter(t => t.project === parentId);
    
    directChildren.forEach(child => {
      children.push(child);
      children.push(...getAllChildren(child.id));
    });
    
    return children;
  }, [tasks]);

  // 多选变化处理（带级联）
  const handleRowSelectionChange = useCallback((
    selectedKeys: string[], 
    selectedRows: Task[]
  ) => {
    if (!enableCascade) {
      setSelectedRowKeys(selectedKeys);
      return;
    }

    // 级联选择逻辑（参考上文）
    // ...
    
    setSelectedRowKeys(finalKeys);
  }, [tasks, selectedRowKeys, enableCascade]);

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      alert("请先选择要删除的任务");
      return;
    }
    
    const conf = window.confirm(`确定要删除选中的 ${selectedRowKeys.length} 个任务吗？`);
    if (conf) {
      const newTasks = tasks.filter(t => !selectedRowKeys.includes(t.id));
      setTasks(newTasks);
      setSelectedRowKeys([]);
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={enableCascade}
            onChange={e => setEnableCascade(e.target.checked)}
          />
          启用级联选择
        </label>
        <span>已选择：{selectedRowKeys.length} 个任务</span>
        <Button 
          type="primary" 
          danger
          onClick={handleBatchDelete}
          disabled={selectedRowKeys.length === 0}
        >
          批量删除 ({selectedRowKeys.length})
        </Button>
        <Button onClick={() => setSelectedRowKeys([])}>
          清空选择
        </Button>
      </Space>
      
      <Gantt
        tasks={tasks}
        viewType="oaTask"
        rowSelection={{
          selectedRowKeys,
          onChange: handleRowSelectionChange,
          checkboxBorderColor: '#1890ff',
        }}
      />
    </div>
  );
}
```

---

## 常见问题

### Q1: 复选框不显示？

**原因**：未设置 `viewType="oaTask"`

**解决**：
```tsx
<Gantt viewType="oaTask" rowSelection={{...}} />
```

### Q2: 全选不工作？

**原因**：禁用的行阻止了全选

**解决**：检查 `getCheckboxProps` 配置

### Q3: 选中状态不更新？

**原因**：未在 `onChange` 回调中更新状态

**解决**：
```tsx
onChange: (keys, rows) => {
  setSelectedRowKeys(keys); // 必须调用
}
```

### Q4: 级联选择选中了太多任务？

**原因**：级联会自动选中所有子任务

**解决**：
- 关闭级联选择功能
- 或者只选择叶子任务

### Q5: 父任务没有自动选中？

**原因**：可能还有未选中的子任务

**检查**：确保该父任务的**所有**直接子任务都已选中

---

## 🎬 Demo 演示

在 `example/src/App.tsx` 中已集成完整演示，包括：

1. 显示/隐藏多选列开关
2. 级联选择开关
3. 实时显示选中数量
4. 批量删除功能
5. 清空选择功能
6. 自定义复选框颜色

### 运行 Demo

```bash
# 在项目根目录构建库
npm run build

# 启动 example
cd example
npm install
npm start
```

访问 `http://localhost:3000` 体验完整功能。

---

## ⚠️ 注意事项

1. **仅支持 OA 模式**：多选列功能仅在 `viewType="oaTask"` 模式下可用
2. **唯一键要求**：确保每个任务的 `rowKey` 字段值唯一
3. **受控组件**：选中状态是受控的，需要通过 `onChange` 更新 `selectedRowKeys`
4. **递归深度**：级联选择限制最多10层递归，防止无限循环
5. **性能考虑**：大数据集时，级联计算可能较慢

---

## 💡 最佳实践

1. **使用 useCallback 优化**
```tsx
const handleChange = useCallback((keys, rows) => {
  setSelectedRowKeys(keys);
}, []);
```

2. **提供级联开关**
```tsx
<label>
  <input
    type="checkbox"
    checked={enableCascade}
    onChange={e => setEnableCascade(e.target.checked)}
  />
  启用级联选择
</label>
```

3. **批量操作前确认**
```tsx
const handleBatchOperation = () => {
  if (selectedRowKeys.length === 0) {
    message.warning("请先选择任务");
    return;
  }
  
  Modal.confirm({
    title: '确认操作',
    content: `确定要操作选中的 ${selectedRowKeys.length} 个任务吗？`,
    onOk: () => {
      // 执行操作
    },
  });
};
```

---

## 📦 涉及的文件

1. `src/types/public-types.ts` - 类型定义
2. `src/components/task-list/oa-task-list-header.tsx` - 表头组件
3. `src/components/task-list/oa-task-list-table.tsx` - 表格组件
4. `src/components/gantt/gantt.tsx` - 主组件
5. `example/src/App.tsx` - Demo 演示

---

## 🎉 总结

多选功能已完整实现，提供：

✅ 灵活的配置选项  
✅ 强大的级联选择  
✅ 自定义复选框样式  
✅ 完善的批量操作能力  
✅ 友好的 Demo 演示  

立即体验完整功能！
