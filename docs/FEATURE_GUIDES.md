# 功能指南合集

本文档整合了甘特图组件的各种功能指南。

---

## 📋 目录

1. [操作列功能](#操作列功能)
2. [拖动事件处理](#拖动事件处理)
3. [性能优化与测试](#性能优化与测试)
4. [文本溢出处理](#文本溢出处理)
5. [TitleCell 自定义渲染](#titlecell-自定义渲染)

---

## 操作列功能

### 功能概述

在任务列表的最后一列提供了新增、编辑、删除三个操作按钮。

**核心功能**:
- ✅ **新增任务** - 支持弹框形式添加子任务
- ✅ **编辑任务** - 支持弹框形式编辑任务信息
- ✅ **删除任务** - 支持确认删除任务
- ✅ **自定义弹框** - 完全支持自定义 Antd 弹框组件
- ✅ **响应式设计** - 操作按钮支持悬停效果

### 新增的属性

```typescript
interface GanttProps {
  onAddTask?: (task: Task) => void;       // 新增任务回调
  onEditTask?: (task: Task) => void;      // 编辑任务回调
  onDeleteTask?: (task: Task) => void;    // 删除任务回调
  operationsColumnWidth?: string;         // 操作列宽度，默认 "120px"
  operationsColumnLabel?: string;         // 操作列标题，默认 "操作"
  showOperationsColumn?: boolean;         // 是否显示操作列，默认 true
}
```

### 基本使用

```tsx
import { Gantt, Task } from 'gantt-task-react';

const MyGanttComponent = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = (parentTask: Task) => {
    console.log('新增子任务，父任务:', parentTask);
    // 实现新增逻辑
  };

  const handleEditTask = (task: Task) => {
    console.log('编辑任务:', task);
    // 实现编辑逻辑
  };

  const handleDeleteTask = (task: Task) => {
    const confirmed = window.confirm(`确定要删除 "${task.name}" 吗？`);
    if (confirmed) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
  };

  return (
    <Gantt
      tasks={tasks}
      onAddTask={handleAddTask}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
      operationsColumnWidth="150px"
      operationsColumnLabel="操作"
    />
  );
};
```

### 操作按钮说明

| 按钮 | 图标 | 功能 | 回调函数 |
|------|------|------|---------|
| 新增 | + (绿色) | 为当前任务添加子任务 | `onAddTask(task)` |
| 编辑 | ✏️ (蓝色) | 编辑当前任务 | `onEditTask(task)` |
| 删除 | × (红色) | 删除当前任务 | `onDeleteTask(task)` |

---

## 拖动事件处理

### 事件类型

组件提供了两个拖动相关的事件回调：

#### 1. `onTaskDragEnd` - 拖动结束（带验证）

**触发时机**: 用户松开鼠标完成拖动时

**用途**: 用于异步 API 调用，验证并保存更改

**特点**:
- 可以返回 `boolean` 控制是否接受更改
- 返回 `false` 会撤销更改，恢复原始状态
- 支持异步操作（Promise）

**签名**:
```typescript
onTaskDragEnd?: (
  task: Task,
  children: Task[]
) => void | boolean | Promise<void> | Promise<boolean>;
```

**示例**:
```typescript
const handleTaskDragEnd = async (task: Task) => {
  console.log("拖动结束，准备保存:", task);
  
  try {
    // 模拟异步 API 调用
    const response = await fetch('/api/tasks/update', {
      method: 'POST',
      body: JSON.stringify(task)
    });
    
    if (response.ok) {
      console.log("✅ 保存成功");
      return true; // 接受更改
    } else {
      console.log("❌ 保存失败");
      alert("保存失败，已恢复原始状态");
      return false; // 撤销更改
    }
  } catch (error) {
    console.error("API 调用失败:", error);
    return false;
  }
};
```

#### 2. `onTaskDragComplete` - 拖动完成（纯通知）

**触发时机**: 拖动操作完全结束后触发（无论成功或失败）

**用途**: 纯通知性回调，用于日志、统计等

**特点**:
- 不能阻止或撤销操作
- 总是在最后执行
- 提供拖动操作类型参数

**签名**:
```typescript
onTaskDragComplete?: (
  task: Task,
  children: Task[],
  action: 'move' | 'start' | 'end' | 'actualStart' | 'actualEnd' | 'progress'
) => void;
```

**示例**:
```typescript
const handleTaskDragComplete = (
  task: Task, 
  children: Task[], 
  action: string
) => {
  console.log("🎯 拖动完成!");
  console.log("  操作类型:", action);
  console.log("  任务:", task.name);
  console.log("  影响的子任务:", children.length);
  
  // 记录日志或统计
  trackEvent('task_drag_complete', {
    taskId: task.id,
    action: action,
    childrenCount: children.length
  });
};
```

### 两个事件的区别

| 特性 | onTaskDragEnd | onTaskDragComplete |
|------|---------------|-------------------|
| **触发时机** | 拖动松开时 | 操作完全结束后 |
| **可以阻止** | ✅ 可以 | ❌ 不可以 |
| **异步支持** | ✅ 支持 | ❌ 同步 |
| **返回值** | boolean/Promise | void |
| **用途** | 验证、保存 | 日志、通知 |

### 使用建议

1. **验证和保存** - 使用 `onTaskDragEnd`
2. **日志和通知** - 使用 `onTaskDragComplete`
3. **两者结合** - 完整的拖动生命周期

```tsx
<Gantt
  tasks={tasks}
  onTaskDragEnd={async (task) => {
    // 验证并保存
    const success = await saveToBackend(task);
    return success; // 失败时撤销
  }}
  onTaskDragComplete={(task, children, action) => {
    // 记录日志
    console.log(`操作完成: ${action}`);
  }}
/>
```

---

## 性能优化与测试

### 性能测试功能

Demo 中已添加性能测试数据生成功能，可以快速生成大量数据测试组件性能。

### 使用方法

在 Demo 应用中找到"🚀 性能测试数据配置"面板：

1. **勾选"使用大量测试数据"**
2. **设置父任务数**（1-1000）
3. **设置每个父任务的子任务数**（0-50）
4. **点击"重新加载数据"**

### 测试场景

#### 小规模测试（100个任务）
```
- 父任务数: 10
- 每个父任务的子任务数: 10
- 总任务数: 110
- 预期性能: 流畅
```

#### 中规模测试（1000个任务）
```
- 父任务数: 100
- 每个父任务的子任务数: 10
- 总任务数: 1100
- 预期性能: 正常
```

#### 大规模测试（5000个任务）
```
- 父任务数: 500
- 每个父任务的子任务数: 10
- 总任务数: 5500
- 预期性能: 可能有轻微延迟
```

### 性能优化建议

1. **虚拟滚动**: 任务数超过1000时建议启用
2. **懒加载子任务**: 仅在展开时加载子任务
3. **React.memo**: 组件已使用 memo 优化
4. **useCallback**: 事件处理函数使用 useCallback

### 监控性能

```typescript
// 开发环境下启用性能监控
const handleReloadData = () => {
  console.time('数据加载时间');
  const newTasks = initTasks(true, 100, 10);
  setTasks(newTasks);
  console.timeEnd('数据加载时间');
  
  console.log(`✅ 已加载 ${newTasks.length} 个任务`);
};
```

---

## 文本溢出处理

### 功能说明

当列内容超过设定的最大字符数时，自动截断并显示省略号（...）。

### 配置

```typescript
interface GanttProps {
  // 设置各列的最大字符数
  columnEllipsisMaxChars?: Partial<Record<"name" | "status" | "assignee", number>>;
  
  // 溢出时的回调
  onCellOverflow?: (info: {
    column: "name" | "status" | "assignee";
    task: Task;
  }) => void;
}
```

### 使用示例

```tsx
<Gantt
  tasks={tasks}
  columnEllipsisMaxChars={{
    name: 20,      // 任务名最多20个字符
    status: 8,     // 状态最多8个字符
    assignee: 12,  // 负责人最多12个字符
  }}
  onCellOverflow={({ column, task }) => {
    console.log(`列 ${column} 内容溢出:`, task.name);
  }}
/>
```

### 自定义渲染

可以通过 `columnRenderers` 完全自定义列的渲染：

```tsx
<Gantt
  tasks={tasks}
  columnRenderers={{
    name: (task, meta) => (
      <span
        style={{
          color: "#1677ff",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
        title={task.name}
      >
        {meta.displayValue}
      </span>
    ),
  }}
/>
```

---

## TitleCell 自定义渲染

### 功能概述

TitleCell 是一个功能丰富的任务名列自定义渲染组件，支持：

- **未读标记**: 红色 `*` 表示未读任务
- **展开/折叠图标**: 控制子任务显示
- **任务编号**: 显示任务序号
- **项目标签**: 显示项目信息（如【系統開發】）
- **关注标记**: ⭐ 黄色星星
- **隐藏标记**: 👁️ 灰色眼睛
- **跟进标记**: ⚠️ 红色警告
- **延期标记**: 显示延期天数（粉色背景）
- **暂停标记**: 显示暂停天数（灰色背景）
- **会议决议**: 特殊标记

### 使用方法

#### 1. 导入组件

```tsx
import TitleCell from './components/TitleCell';
```

#### 2. 在 columnRenderers 中使用

```tsx
<Gantt
  tasks={tasks}
  viewType="oaTask"
  columnRenderers={{
    name: (task: Task) => {
      const record = {
        ...(task as any),
        id: task.id,
      };
      return (
        <TitleCell
          value={task.name}
          record={record}
          expandedRowKeys={expandedTaskKeys}
          onRead={handleTaskRead}
          onAdd={handleTaskAdd}
          onCheck={handleTaskCheck}
          onExpand={handleTaskExpand}
        />
      );
    }
  }}
/>
```

#### 3. Props 说明

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | string | 是 | 任务名称 |
| record | any | 是 | 任务记录对象 |
| expandedRowKeys | any[] | 是 | 已展开的任务ID数组 |
| onRead | (record) => void | 否 | 标记已读的回调 |
| onAdd | (taskID) => void | 否 | 新增任务的回调 |
| onCheck | (record, operate) => void | 否 | 查看任务的回调 |
| onExpand | (expanded, record) => void | 是 | 展开/折叠回调 |

#### 4. Record 对象字段

```typescript
{
  id: string;                    // 任务ID
  name: string;                  // 任务名称
  read?: boolean;                // 是否已读
  focus?: boolean;               // 是否关注
  hidden?: boolean;              // 是否隐藏
  follow?: boolean;              // 是否跟进
  delayDays?: number;            // 延期天数
  suspend?: boolean;             // 是否暂停
  suspendDays?: number;          // 暂停天数
  hasChildren?: boolean;         // 是否有子任务
  layer?: number;                // 层级（1为父，2为子）
  number?: number;               // 任务编号
  parentId?: number;             // 父任务ID
  projectTags?: string[];        // 项目标签数组
  category?: string;             // 任务分类
  statusInfoVo?: {               // 状态信息
    description: string;
    color: string;
  };
}
```

### 完整文档

更多详细信息请查看：
- `example/TitleCell-README.md` - API 完整文档
- `example/TitleCell-QuickStart.md` - 快速开始指南

---

## 📚 总结

本文档涵盖了以下功能：

1. ✅ **操作列** - 新增、编辑、删除功能
2. ✅ **拖动事件** - 完整的拖动生命周期
3. ✅ **性能测试** - 大数据场景测试
4. ✅ **文本溢出** - 自动截断和省略
5. ✅ **TitleCell** - 丰富的任务名列渲染

所有功能都在 Demo 中有完整演示，立即运行查看效果！

```bash
# 启动 Demo
cd example
npm start
```
