# 拖动事件指南 (Drag Events Guide)

本组件提供了两个与拖动相关的事件回调，用于不同的场景。

## 事件类型

### 1. `onTaskDragEnd` - 拖动结束（带验证）

**触发时机**: 当用户松开鼠标，完成拖动操作时触发

**用途**: 用于异步 API 调用，验证并保存更改

**特点**:
- 可以返回 `boolean` 值来控制是否接受更改
- 返回 `false` 或抛出异常会撤销更改，恢复到原始状态
- 支持异步操作（Promise）
- 组件会等待此回调完成后才决定是否应用更改

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
    // 调用 API 保存数据
    const response = await api.updateTask(task.id, {
      plannedStart: task.plannedStart,
      plannedEnd: task.plannedEnd,
    });
    
    if (response.success) {
      console.log("✅ 保存成功");
      return true; // 接受更改
    } else {
      console.log("❌ 保存失败");
      return false; // 拒绝更改，恢复原状
    }
  } catch (error) {
    console.error("API 调用失败:", error);
    return false; // 拒绝更改，恢复原状
  }
};
```

---

### 2. `onTaskDragComplete` - 拖动完成（通知型）

**触发时机**: 在拖动操作完全结束后触发（在 `onTaskDragEnd` 之后）

**用途**: 用于通知、日志记录、统计等不影响拖动结果的操作

**特点**:
- 无需返回值
- 无论操作成功或失败都会触发
- 不影响拖动操作的结果
- 提供了操作类型 (action) 参数，便于区分具体操作

**签名**:
```typescript
onTaskDragComplete?: (
  task: Task,
  children: Task[],
  action: 'move' | 'start' | 'end' | 'actualStart' | 'actualEnd' | 'progress'
) => void;
```

**参数说明**:
- `task`: 最终的任务状态（如果操作成功）或原始状态（如果操作失败）
- `children`: 子任务列表
- `action`: 操作类型
  - `move`: 移动整个任务
  - `start`: 调整计划开始时间
  - `end`: 调整计划结束时间
  - `actualStart`: 调整实际开始时间
  - `actualEnd`: 调整实际结束时间
  - `progress`: 调整进度

**示例**:
```typescript
const handleTaskDragComplete = (
  task: Task, 
  children: Task[], 
  action: 'move' | 'start' | 'end' | 'actualStart' | 'actualEnd' | 'progress'
) => {
  console.log("🎯 拖动完成!");
  console.log("操作类型:", action);
  console.log("任务 ID:", task.id);
  console.log("任务名称:", task.name);
  
  // 发送统计数据
  analytics.track('task_drag_complete', {
    taskId: task.id,
    action: action,
    timestamp: new Date(),
  });
  
  // 显示提示信息
  if (action === 'end') {
    message.success(`已更新任务 "${task.name}" 的截止时间`);
  }
};
```

---

## 使用场景对比

| 场景 | 使用 `onTaskDragEnd` | 使用 `onTaskDragComplete` |
|------|---------------------|--------------------------|
| API 调用保存数据 | ✅ 推荐 | ❌ 不推荐 |
| 验证并控制是否接受更改 | ✅ 推荐 | ❌ 无法控制 |
| 日志记录 | ✅ 可以 | ✅ 推荐 |
| 统计分析 | ✅ 可以 | ✅ 推荐 |
| 显示通知消息 | ⚠️ 需要判断结果 | ✅ 推荐 |
| 区分操作类型 | ❌ 不支持 | ✅ 支持 |

---

## 完整示例

```typescript
import { Gantt, Task } from "gantt-task-react";

function MyGanttChart() {
  const [tasks, setTasks] = useState<Task[]>([...]);

  // 方式1: 使用 onTaskDragEnd 进行 API 调用和验证
  const handleTaskDragEnd = async (task: Task) => {
    try {
      // 调用后端 API
      const result = await fetch('/api/tasks/' + task.id, {
        method: 'PUT',
        body: JSON.stringify({
          plannedStart: task.plannedStart,
          plannedEnd: task.plannedEnd,
        }),
      });
      
      if (result.ok) {
        // 更新本地状态
        setTasks(prev => prev.map(t => t.id === task.id ? task : t));
        return true; // 接受更改
      } else {
        alert('保存失败，请重试');
        return false; // 拒绝更改
      }
    } catch (error) {
      console.error('保存失败:', error);
      return false; // 拒绝更改
    }
  };

  // 方式2: 使用 onTaskDragComplete 进行通知和记录
  const handleTaskDragComplete = (task, children, action) => {
    // 记录操作日志
    console.log(`用户${action}了任务: ${task.name}`);
    
    // 发送统计
    analytics.track('task_drag', { action, taskId: task.id });
    
    // 显示友好提示
    const actionText = {
      move: '移动',
      start: '调整开始时间',
      end: '调整截止时间',
      actualStart: '调整实际开始时间',
      actualEnd: '调整实际结束时间',
      progress: '调整进度',
    }[action];
    
    message.success(`已${actionText}: ${task.name}`);
  };

  return (
    <Gantt
      tasks={tasks}
      enableTaskResize={true}
      onTaskDragEnd={handleTaskDragEnd}
      onTaskDragComplete={handleTaskDragComplete}
    />
  );
}
```

---

## 执行顺序

1. 用户开始拖动任务
2. 拖动过程中实时更新视觉效果
3. 用户松开鼠标
4. 触发 `onTaskDragEnd`（如果有）
   - 如果返回 `false`，恢复原状
   - 如果返回 `true` 或无返回值，应用更改
5. 更新组件状态
6. 触发 `onTaskDragComplete`（如果有）

---

## 注意事项

1. **`onTaskDragEnd`**:
   - 此回调会阻塞 UI，建议快速完成
   - 如果需要长时间操作，考虑显示加载提示
   - 返回 `false` 会立即恢复到拖动前的状态

2. **`onTaskDragComplete`**:
   - 此回调不应进行耗时操作
   - 不要在此回调中进行 API 调用
   - 适合快速的通知、日志等操作

3. **两者配合使用**:
   - 推荐同时使用两个回调
   - `onTaskDragEnd` 负责数据保存
   - `onTaskDragComplete` 负责用户反馈
