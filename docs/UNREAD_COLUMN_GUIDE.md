# 未读列功能使用指南

## ✨ 功能概述

未读列功能允许在任务名列的左侧显示一个未读标记列，用红色 `*` 表示未读任务。

### 核心功能

- ✅ 在任务名列左侧添加未读列
- ✅ 可配置显示/隐藏
- ✅ 支持自定义渲染（通过 columnRenderers）
- ✅ 支持自定义列宽和标题
- ✅ 点击未读标记可标记为已读

---

## 🚀 快速开始

### 1. 基本使用

```tsx
import { Gantt, Task } from 'gantt-task-react';
import { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "任务1",
      start: new Date(),
      end: new Date(),
      progress: 0,
      type: "task",
      unread: true, // 标记为未读
    },
    // ... 更多任务
  ]);

  return (
    <Gantt
      tasks={tasks}
      viewType="oaTask"
      unreadColumn={{
        show: true,        // 显示未读列
        width: "40px",     // 列宽
        title: "未读",     // 列标题
      }}
    />
  );
}
```

### 2. 自定义渲染

```tsx
<Gantt
  tasks={tasks}
  viewType="oaTask"
  unreadColumn={{
    show: true,
    width: "50px",
    title: "",
  }}
  columnRenderers={{
    unread: (task, meta) => {
      if (!meta.value) return null; // 已读任务不显示
      
      return (
        <span
          onClick={(e) => {
            e.stopPropagation();
            // 点击标记为已读
            handleMarkAsRead(task);
          }}
          style={{ 
            color: 'red', 
            fontWeight: 'bold', 
            fontSize: '18px',
            cursor: 'pointer'
          }}
          title="点击标记为已读"
        >
          *
        </span>
      );
    },
  }}
/>
```

### 3. 标记已读功能

```tsx
function App() {
  const [tasks, setTasks] = useState<Task[]>([...]);

  // 标记任务为已读
  const handleMarkAsRead = (task: Task) => {
    setTasks(tasks.map(t => 
      t.id === task.id 
        ? { ...t, unread: false, read: true } 
        : t
    ));
  };

  return (
    <Gantt
      tasks={tasks}
      viewType="oaTask"
      unreadColumn={{ show: true }}
      columnRenderers={{
        unread: (task, meta) => {
          if (!meta.value) return null;
          return (
            <span
              onClick={() => handleMarkAsRead(task)}
              style={{ color: 'red', cursor: 'pointer' }}
            >
              *
            </span>
          );
        },
      }}
    />
  );
}
```

---

## 📋 API 参考

### Task 类型扩展

```typescript
interface Task {
  // ... 其他字段
  
  /** 是否未读（用于oaTask模式） */
  unread?: boolean;
}
```

### unreadColumn 配置

```typescript
unreadColumn?: {
  /** 是否显示未读列，默认 false */
  show?: boolean;
  
  /** 未读列宽度，默认 "40px" */
  width?: string;
  
  /** 未读列标题，默认 "未读" */
  title?: string;
}
```

### columnRenderers.unread

```typescript
columnRenderers?: {
  unread?: (
    task: Task, 
    meta: { 
      value: boolean;              // 未读状态值
      displayValue: React.ReactNode // 默认显示内容（红色*）
    }
  ) => React.ReactNode;
  
  // ... 其他列渲染器
}
```

---

## 💡 使用示例

### 示例 1：默认红色星号

```tsx
<Gantt
  tasks={tasks}
  viewType="oaTask"
  unreadColumn={{
    show: true,
  }}
/>
```

**效果**：未读任务显示红色 `*`，已读任务不显示

### 示例 2：自定义图标

```tsx
import { BellOutlined } from '@ant-design/icons';

<Gantt
  tasks={tasks}
  viewType="oaTask"
  unreadColumn={{
    show: true,
    width: "50px",
  }}
  columnRenderers={{
    unread: (task, meta) => {
      if (!meta.value) return null;
      return <BellOutlined style={{ color: 'orange', fontSize: 16 }} />;
    },
  }}
/>
```

**效果**：使用铃铛图标表示未读

### 示例 3：显示未读数量

```tsx
<Gantt
  tasks={tasks}
  viewType="oaTask"
  unreadColumn={{
    show: true,
    width: "60px",
    title: "消息",
  }}
  columnRenderers={{
    unread: (task, meta) => {
      const unreadCount = (task as any).unreadCount || 0;
      if (unreadCount === 0) return null;
      
      return (
        <span
          style={{
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '10px',
            padding: '2px 6px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          {unreadCount}
        </span>
      );
    },
  }}
/>
```

**效果**：显示未读消息数量（如：`3`）

### 示例 4：动态显示/隐藏

```tsx
function App() {
  const [showUnread, setShowUnread] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([...]);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={showUnread}
            onChange={e => setShowUnread(e.target.checked)}
          />
          显示未读列
        </label>
      </div>
      
      <Gantt
        tasks={tasks}
        viewType="oaTask"
        unreadColumn={{
          show: showUnread,
        }}
      />
    </div>
  );
}
```

---

## 🎨 样式定制

### 自定义未读标记样式

```tsx
columnRenderers={{
  unread: (task, meta) => {
    if (!meta.value) return null;
    
    return (
      <span
        style={{
          color: '#ff4d4f',           // 自定义颜色
          fontWeight: 'bold',
          fontSize: '20px',            // 自定义大小
          textShadow: '0 0 3px rgba(255,77,79,0.5)', // 发光效果
          cursor: 'pointer',
        }}
        onClick={() => handleMarkAsRead(task)}
      >
        ●
      </span>
    );
  },
}}
```

### 使用 Tooltip 提示

```tsx
import { Tooltip } from 'antd';

columnRenderers={{
  unread: (task, meta) => {
    if (!meta.value) return null;
    
    return (
      <Tooltip title="点击标记为已读">
        <span
          style={{ color: 'red', cursor: 'pointer' }}
          onClick={() => handleMarkAsRead(task)}
        >
          *
        </span>
      </Tooltip>
    );
  },
}}
```

---

## 🔄 完整示例

### 结合多选列和 TitleCell

```tsx
import React, { useState } from 'react';
import { Gantt, Task } from 'gantt-task-react';
import TitleCell from './components/TitleCell';

function App() {
  const [tasks, setTasks] = useState<Task[]>([...]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [showUnreadColumn, setShowUnreadColumn] = useState(true);

  const handleMarkAsRead = (task: Task) => {
    setTasks(tasks.map(t => 
      t.id === task.id 
        ? { ...t, unread: false, read: true } 
        : t
    ));
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={showUnreadColumn}
            onChange={e => setShowUnreadColumn(e.target.checked)}
          />
          显示未读列
        </label>
      </div>
      
      <Gantt
        tasks={tasks}
        viewType="oaTask"
        
        // 多选列
        rowSelection={{
          selectedRowKeys,
          onChange: (keys, rows) => setSelectedRowKeys(keys),
        }}
        
        // 未读列
        unreadColumn={{
          show: showUnreadColumn,
          width: "40px",
        }}
        
        // 自定义渲染
        columnRenderers={{
          unread: (task, meta) => {
            if (!meta.value) return null;
            return (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsRead(task);
                }}
                style={{ 
                  color: 'red', 
                  fontWeight: 'bold', 
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
                title="点击标记为已读"
              >
                *
              </span>
            );
          },
          name: (task) => (
            <TitleCell
              value={task.name}
              record={task}
              // ... 其他 props
            />
          ),
        }}
      />
    </div>
  );
}
```

---

## 📊 列顺序

启用所有列后的显示顺序（从左到右）：

```
┌────────┬────────┬──────────────┬────────┬────────┬────────┐
│ 多选列 │ 未读列 │  任务名列    │ 状态列 │负责人列│ 操作列 │
├────────┼────────┼──────────────┼────────┼────────┼────────┤
│   ☑    │   *    │ 【项目】任务1│ 处理中 │ 张三   │ + ✏ × │
│   ☐    │        │ 【项目】任务2│ 已完成 │ 李四   │ + ✏ × │
│   ☑    │   *    │ 【项目】任务3│ 待确认 │ 王五   │ + ✏ × │
└────────┴────────┴──────────────┴────────┴────────┴────────┘
```

---

## ⚠️ 注意事项

1. **仅支持 OA 模式**
   - 未读列功能仅在 `viewType="oaTask"` 模式下可用

2. **Task 对象需要包含 unread 字段**
   ```tsx
   const task: Task = {
     // ... 其他字段
     unread: true, // 或 false
   };
   ```

3. **默认不显示**
   - 默认情况下未读列是隐藏的
   - 需要设置 `unreadColumn.show = true` 才显示

4. **列宽建议**
   - 默认 40px 适合显示 `*` 符号
   - 如果使用图标，建议 50-60px

---

## 💡 最佳实践

### 1. 结合 API 调用

```tsx
const handleMarkAsRead = async (task: Task) => {
  try {
    // 调用后端 API
    await fetch(`/api/tasks/${task.id}/mark-read`, {
      method: 'POST'
    });
    
    // 更新本地状态
    setTasks(tasks.map(t => 
      t.id === task.id ? { ...t, unread: false } : t
    ));
  } catch (error) {
    console.error('标记已读失败:', error);
  }
};
```

### 2. 批量标记已读

```tsx
const handleMarkAllAsRead = () => {
  const updatedTasks = tasks.map(t => ({ ...t, unread: false }));
  setTasks(updatedTasks);
  
  // 调用后端 API
  fetch('/api/tasks/mark-all-read', { method: 'POST' });
};

<Button onClick={handleMarkAllAsRead}>
  全部标记为已读
</Button>
```

### 3. 统计未读数量

```tsx
const unreadCount = tasks.filter(t => t.unread).length;

<span>未读任务: {unreadCount} 个</span>
```

---

## 🎬 Demo 演示

在 Demo 应用中：

1. 找到"✨ 新功能展示说明"区域
2. 勾选"5️⃣ 未读列功能"复选框
3. 观察任务名列左侧出现未读列
4. 点击红色 `*` 标记任务为已读

### 运行 Demo

```bash
# 在项目根目录构建库
npm run build

# 启动 example
cd example
npm install
npm start
```

访问 `http://localhost:3000` 查看效果。

---

## 🔍 故障排查

### Q1: 未读列不显示？

**检查**：
1. 确认 `viewType="oaTask"`
2. 确认 `unreadColumn.show = true`

### Q2: 所有任务都没有未读标记？

**检查**：
1. 确认 Task 对象包含 `unread: true` 字段
2. 查看控制台是否有错误

### Q3: 点击未读标记没反应？

**检查**：
1. 确认在 `columnRenderers.unread` 中添加了 `onClick` 事件
2. 确认事件处理函数正确

---

## 📦 涉及的文件

1. `src/types/public-types.ts` - 类型定义
2. `src/components/task-list/oa-task-list-header.tsx` - 表头组件
3. `src/components/task-list/oa-task-list-table.tsx` - 表格组件
4. `src/components/gantt/gantt.tsx` - 主组件
5. `example/src/App.tsx` - Demo 演示

---

## 🎉 总结

未读列功能提供了：

✅ 简洁的未读标记显示  
✅ 灵活的配置选项  
✅ 自定义渲染能力  
✅ 完整的交互支持  

立即体验！
