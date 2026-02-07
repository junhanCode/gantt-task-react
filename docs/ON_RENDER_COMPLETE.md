# 渲染完成事件 (onRenderComplete)

## 概述

`onRenderComplete` 是一个回调事件，在 Gantt 图表完全渲染完成后触发。这对于需要在渲染完成后执行操作的场景非常有用，比如截图、导出、数据分析等。

## 功能特性

### 触发时机

`onRenderComplete` 会在以下情况触发：
- ✅ 初始渲染完成
- ✅ 任务数据更新后重新渲染完成
- ✅ 视图模式切换后渲染完成
- ✅ 滚动位置变化后渲染完成
- ✅ 容器尺寸变化后渲染完成

### 实现机制

- 使用 `requestAnimationFrame` 确保在浏览器完成实际渲染后才触发回调
- 监听关键状态变化：`barTasks`、`svgContainerWidth`、`svgContainerHeight`、`scrollX`、`scrollY`
- 只有在任务列表非空且容器已初始化时才触发

## 使用方法

### 基本用法

```tsx
import { Gantt } from 'gantt-task-react';

function App() {
  const handleRenderComplete = () => {
    console.log('✅ Gantt 图表渲染完成！');
    // 在这里执行需要在渲染完成后的操作
  };

  return (
    <Gantt
      tasks={tasks}
      onRenderComplete={handleRenderComplete}
      // ... 其他属性
    />
  );
}
```

### 高级用法 - 带上下文信息

```tsx
import { Gantt } from 'gantt-task-react';
import { useCallback } from 'react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState('日');

  const handleRenderComplete = useCallback(() => {
    console.log('✅ Gantt 图表渲染完成！', {
      timestamp: new Date().toISOString(),
      taskCount: tasks.length,
      viewMode: viewMode,
    });
    
    // 可以在这里执行各种后续操作
    // 例如：通知父组件、更新加载状态、触发截图等
  }, [tasks.length, viewMode]);

  return (
    <Gantt
      tasks={tasks}
      oaTaskViewMode={viewMode}
      onRenderComplete={handleRenderComplete}
    />
  );
}
```

## 常见应用场景

### 1. 截图导出

```tsx
const handleRenderComplete = () => {
  // 等待渲染完成后再截图，确保图表完整
  setTimeout(() => {
    captureGanttChart();
  }, 100);
};
```

### 2. 加载状态管理

```tsx
const [isLoading, setIsLoading] = useState(true);

const handleRenderComplete = () => {
  setIsLoading(false);
};

return (
  <>
    {isLoading && <Spinner />}
    <Gantt
      tasks={tasks}
      onRenderComplete={handleRenderComplete}
    />
  </>
);
```

### 3. 性能监控

```tsx
const handleRenderComplete = () => {
  const renderTime = performance.now() - startTime;
  analytics.track('gantt_render_complete', {
    renderTime,
    taskCount: tasks.length,
  });
};
```

### 4. 自动滚动到特定位置

```tsx
const ganttRef = useRef<GanttRef>(null);

const handleRenderComplete = () => {
  // 渲染完成后自动滚动到今天
  ganttRef.current?.scrollToDate(new Date(), { align: 'center' });
};
```

### 5. 数据同步确认

```tsx
const handleRenderComplete = () => {
  // 通知服务器视图已更新
  notifyServer({
    type: 'gantt_rendered',
    viewState: getCurrentViewState(),
  });
};
```

## API 参考

### 属性定义

```typescript
interface GanttProps {
  /**
   * 在 Gantt 图表完全渲染完成后触发
   * 适用于截图、导出、分析等需要在渲染完成后执行的操作
   */
  onRenderComplete?: () => void;
}
```

### 类型签名

```typescript
type OnRenderComplete = () => void;
```

## 注意事项

### 1. 触发频率

⚠️ `onRenderComplete` 会在多个状态变化时触发，包括：
- 任务数据变化
- 视图模式切换
- 滚动位置变化
- 容器尺寸变化

如果需要避免频繁触发，建议使用防抖（debounce）或节流（throttle）：

```tsx
import { debounce } from 'lodash';

const handleRenderComplete = useMemo(
  () => debounce(() => {
    console.log('Render complete');
    // 执行操作
  }, 300),
  []
);
```

### 2. 内存泄漏

如果在回调中使用了定时器或异步操作，记得清理：

```tsx
const handleRenderComplete = () => {
  const timeoutId = setTimeout(() => {
    // 执行操作
  }, 100);
  
  // 如果组件卸载，需要清理定时器
  return () => clearTimeout(timeoutId);
};
```

### 3. 依赖项

在 `useCallback` 中使用时，注意添加正确的依赖项：

```tsx
const handleRenderComplete = useCallback(() => {
  console.log('Current tasks:', tasks.length);
}, [tasks.length]); // 添加依赖项
```

### 4. 性能考虑

- 避免在回调中执行耗时操作，这可能影响用户体验
- 如果需要执行重操作，考虑使用 `setTimeout` 延迟执行
- 对于频繁更新的场景，使用防抖或节流

## 示例代码

### 完整示例 - 带加载状态的 Gantt

```tsx
import React, { useState, useCallback, useRef } from 'react';
import { Gantt, GanttRef, Task } from 'gantt-task-react';
import { Spin } from 'antd';

function GanttWithLoading() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [renderCount, setRenderCount] = useState(0);
  const ganttRef = useRef<GanttRef>(null);
  const startTimeRef = useRef(Date.now());

  // 获取任务数据
  useEffect(() => {
    fetchTasks().then(data => {
      setTasks(data);
      startTimeRef.current = Date.now();
    });
  }, []);

  // 渲染完成回调
  const handleRenderComplete = useCallback(() => {
    const renderTime = Date.now() - startTimeRef.current;
    
    console.log('✅ Gantt 渲染完成', {
      timestamp: new Date().toISOString(),
      taskCount: tasks.length,
      renderTime: `${renderTime}ms`,
      renderCount: renderCount + 1,
    });
    
    setIsLoading(false);
    setRenderCount(prev => prev + 1);
    
    // 首次渲染完成后，滚动到今天
    if (renderCount === 0) {
      setTimeout(() => {
        ganttRef.current?.scrollToDate(new Date(), { align: 'center' });
      }, 100);
    }
  }, [tasks.length, renderCount]);

  return (
    <div style={{ position: 'relative' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}>
          <Spin size="large" tip="加载中..." />
        </div>
      )}
      
      <div style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
        <Gantt
          ref={ganttRef}
          tasks={tasks}
          onRenderComplete={handleRenderComplete}
          viewType="oaTask"
          oaTaskViewMode="日"
        />
      </div>
      
      <div style={{ marginTop: 16, color: '#666', fontSize: 12 }}>
        渲染次数: {renderCount}
      </div>
    </div>
  );
}
```

## 相关 API

- [`scrollToDate`](./API.md#scrollToDate) - 滚动到指定日期
- [`exportImage`](./API.md#exportImage) - 导出图片
- [`enterFullscreen`](./API.md#enterFullscreen) - 进入全屏

## 更新日志

- **v0.3.9** - 新增 `onRenderComplete` 事件
