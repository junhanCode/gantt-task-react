# 今天纵轴线自定义功能

## 📋 功能概述

在 OA 任务模式下，当前时间纵轴线支持自定义宽度（默认 1px），并且不会穿过时间轴表头。

## 🎯 核心特性

### 1. 自定义线宽

通过 `todayLineWidth` 属性可以自定义当前时间纵轴线的宽度。

**默认值**: 1px

### 2. 不穿过表头

由于 Grid 组件和 Calendar 组件在独立的 SVG 中渲染：
- **Calendar SVG**: 渲染时间轴表头（独立的 SVG）
- **Grid SVG**: 渲染任务区域和当前时间线（独立的 SVG）

当前时间线在 Grid SVG 中从 y=0 开始绘制，因此自然地从任务区域顶部开始，不会穿过表头。

### 3. 避免重复绘制

**重要修复**：之前的实现中，Calendar 组件也绘制了一条当前时间线（固定 2px），导致：
1. **重复绘制**：Calendar 和 Grid 各绘制一条线，叠加产生"加粗"效果
2. **穿过表头**：Calendar 中的线从表头顶部绘制到底部，直接穿过了表头区域

**修复方案**：移除 Calendar 组件中的当前时间线绘制代码，只在 Grid 中绘制。

## 📝 使用方法

### 基本使用（默认 1px）

```tsx
import { Gantt } from 'gantt-task-react';

<Gantt
  tasks={tasks}
  viewType="oaTask"
  oaTaskViewMode="日"
  // todayLineWidth 默认为 1px，可省略
/>
```

### 自定义线宽

```tsx
// 默认细线（1px）
<Gantt
  tasks={tasks}
  viewType="oaTask"
  todayLineWidth={1}
/>

// 标准线（2px）
<Gantt
  tasks={tasks}
  viewType="oaTask"
  todayLineWidth={2}
/>

// 粗线（3px）
<Gantt
  tasks={tasks}
  viewType="oaTask"
  todayLineWidth={3}
/>

// 强调线（5px）
<Gantt
  tasks={tasks}
  viewType="oaTask"
  todayLineWidth={5}
/>
```

## 📊 视觉效果

### 架构说明

```
┌─────────────────────────────────┐
│  Calendar SVG (时间轴表头)      │ ← 独立 SVG
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  Grid SVG (任务区域)            │ ← 独立 SVG
│         ║  ← 当前时间线          │   从 y=0 开始
│  任务1  ║                       │   不穿过表头
│  任务2  ║                       │
└─────────║─────────────────────────┘
```

### 线宽对比

```
1px (默认):
│
│  任务1  │  ← 细线，不突兀
│  任务2  │
│

2px:
│
│  任务1  ┃  ← 标准线，清晰
│  任务2  ┃
│

3px:
│
│  任务1  ║  ← 粗线，明显
│  任务2  ║
│

5px:
│
│  任务1  ║  ← 更粗，强调
│  任务2  ║
│
```

## 🔧 技术细节

### 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `todayLineWidth` | number | 1 | 当前时间纵轴线的宽度（px） |

### SVG 架构（task-gantt.tsx）

```tsx
// SVG 1: 时间轴表头
<svg height={calendarProps.headerHeight}>
  <Calendar {...calendarProps} />
</svg>

// SVG 2: 任务区域（当前时间线在这里）
<svg height={barProps.rowHeight * barProps.tasks.length}>
  <Grid {...gridProps} />        ← 当前时间线在 Grid 中
  <TaskGanttContent {...newBarProps} />
</svg>
```

### 绘制逻辑（grid-body.tsx）

```typescript
// 当前时间线在 Grid SVG 中绘制
if (viewType === "oaTask" && currentTimeX >= 0) {
  currentTimeLine = (
    <line
      x1={currentTimeX}
      y1={0}                      // Grid SVG 的 y=0 = 任务区域顶部
      x2={currentTimeX}
      y2={totalHeight}            // 任务区域底部
      stroke="#FFB592"            // 橙色
      strokeWidth={todayLineWidth}  // 可自定义宽度（默认 1px）
    />
  );
}
```

## 📁 修改的文件

### 1. src/types/public-types.ts（第 191-192 行）

```typescript
/** 今天的纵轴线宽度，默认1 */
todayLineWidth?: number;
```

### 2. src/components/gantt/gantt.tsx（第 68 行）

```typescript
todayLineWidth = 1,  // 默认 1px
```

### 3. src/components/gantt/gantt.tsx（第 750-764 行）

```typescript
const gridProps: GridProps = {
  // ...
  todayLineWidth,
  // ...
};
```

### 4. src/components/grid/grid-body.tsx（第 7-20 行）

```typescript
export type GridBodyProps = {
  // ...
  todayLineWidth?: number;
};
```

### 5. src/components/grid/grid-body.tsx（第 21-35 行）

```typescript
export const GridBody: React.FC<GridBodyProps> = ({
  // ...
  todayLineWidth = 1,
  // ...
}) => {
```

### 5. src/components/grid/grid-body.tsx（第 167-179 行）

```typescript
// oaTask模式的当前时间轴（从任务区域顶部开始，不穿过表头）
if (viewType === "oaTask" && currentTimeX >= 0) {
  currentTimeLine = (
    <line
      key="currentTimeLine"
      x1={currentTimeX}
      y1={0}                      // 从任务区域顶部
      x2={currentTimeX}
      y2={totalHeight}            // 到任务区域底部
      stroke="#FFB592"
      strokeWidth={todayLineWidth}  // 自定义宽度
    />
  );
}
```

### 6. src/components/calendar/calendar.tsx（第 1274-1275 行）

```typescript
{bottomValues} {topValues}
{/* 当前时间轴已移至 Grid 组件，避免穿过表头 */}
```

**重要修复**：移除了 Calendar 组件中的当前时间线绘制代码（之前固定 2px 宽度），同时移除了相关的 `getCurrentTimeX()` 函数和 `currentTimeX` 变量，避免重复绘制和穿过表头的问题。

## ✅ 验证结果

### 编译测试
```bash
npm run build
# ✅ 编译成功
# 文件大小: 36.5 kB
```

### 功能验证
- ✅ 默认宽度: 1px（细线，不突兀）
- ✅ 自定义宽度: 支持任意数值（建议 1-5px）
- ✅ 绘制位置: 从任务区域顶部开始（y=0 在 Grid SVG 中）
- ✅ 不穿过表头: ✅ 正确（Grid 和 Calendar 在独立的 SVG 中）
- ✅ 无重复绘制: 已移除 Calendar 中的旧代码

## 💡 为什么不穿过表头？

**关键**: task-gantt.tsx 使用了两个独立的 SVG：

1. **第一个 SVG**: 只渲染时间轴表头（Calendar）
2. **第二个 SVG**: 只渲染任务区域（Grid + TaskGanttContent）

当前时间线在第二个 SVG 中，它的坐标系统独立，y=0 就是任务区域的顶部，因此天然不会穿过第一个 SVG（表头）。

**重要**：确保只在 Grid 中绘制当前时间线，Calendar 中不应该有任何绘制当前时间线的代码。

## 🎨 示例代码

```tsx
import React from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';

function App() {
  const [tasks, setTasks] = React.useState<Task[]>([...]);

  return (
    <Gantt
      tasks={tasks}
      viewType="oaTask"
      oaTaskViewMode="日"
      todayLineWidth={1}  // 细线，默认值
    />
  );
}
```

## ⚠️ 注意事项

1. **仅 OA 模式**: 只在 `viewType="oaTask"` 时显示当前时间线
2. **当前日期范围**: 当前日期必须在甘特图的日期范围内
3. **推荐范围**: 线宽建议 1-5px

## 🎉 总结

- ✅ 默认宽度: 1px
- ✅ 支持自定义宽度
- ✅ 不穿过表头（架构天然支持）
- ✅ 向后兼容

---

**更新日期**: 2026-02-08  
**版本**: v0.3.9+
