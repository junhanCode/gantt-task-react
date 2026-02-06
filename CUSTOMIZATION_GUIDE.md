# Gantt Chart Customization Guide

## 实现的自定义功能

### 1. 自定义左侧标题头高度（默认 50px）

通过 `tableStyles.headerHeight` 属性来自定义左侧表头的高度。

**重要说明：**
- 表格容器有上下边框各 1px，因此视觉高度 = `headerHeight + 2px`
- 例如：设置 `headerHeight: 42`，实际视觉高度为 44px（42 + 1上边框 + 1下边框）
- 如果想要视觉高度为 42px，请设置 `headerHeight: 40`

**使用示例：**
```tsx
<Gantt
  tasks={tasks}
  tableStyles={{
    headerHeight: 40, // 内容高度 40px，加上边框后视觉高度为 42px
  }}
  // ... 其他属性
/>
```

**如果需要独立设置右侧时间轴的高度，可以同时设置 `headerHeight` 属性：**
```tsx
<Gantt
  tasks={tasks}
  headerHeight={50}  // 右侧时间轴高度
  tableStyles={{
    headerHeight: 40, // 左侧表头高度（视觉高度 42px）
  }}
/>
```

### 2. 折叠图标垂直居中

折叠图标已自动垂直居中，通过 CSS 的 flexbox 布局实现。

**实现细节：**
- 修改了 `.taskListExpander` 样式
- 使用 `display: inline-flex` 和 `align-items: center` 实现垂直居中
- 统一了上下内边距

### 3. 自定义右侧时间刻度的边框

新增两个属性来自定义时间刻度的边框样式：

**属性：**
- `gridBorderWidth`: 边框宽度（默认：1）
- `gridBorderColor`: 边框颜色（默认：#e6e4e4）

**使用示例：**
```tsx
<Gantt
  tasks={tasks}
  gridBorderWidth={1}
  gridBorderColor="#f0f0f0"
  // ... 其他属性
/>
```

## 完整示例

```tsx
import { Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

function App() {
  return (
    <Gantt
      tasks={tasks}
      // 1. 自定义左侧表头高度为 42px（不再减去2px，设置多少就是多少）
      tableStyles={{
        headerHeight: 42,
      }}
      // 2. 折叠图标已自动垂直居中（无需配置）
      // 3. 自定义时间刻度边框
      gridBorderWidth={1}
      gridBorderColor="#f0f0f0"
    />
  );
}
```

## 修复说明

### 表头高度计算修正

之前的版本中，表头高度会自动减去 2px（`height: headerHeight - 2`），这导致计算混乱。

**现已修复：**
- 移除了高度计算中的 `-2` 偏移
- 调整了分隔线的高度比例（从 0.6/0.2 改为 0.5/0.25），使其更加合理
- 现在 `headerHeight` 表示的是内容区域高度（不含边框）

**关于边框：**
- 表格容器 `.ganttTable` 有 `border-top: 1px` 和 `border-bottom: 1px`
- 因此最终视觉高度 = `headerHeight + 2px`
- 这是标准的 CSS 盒模型行为

## 修改的文件

1. **src/components/task-list/task-list-table.module.css**
   - 修改 `.taskListExpander` 样式，实现折叠图标垂直居中

2. **src/types/public-types.ts**
   - 新增 `gridBorderWidth` 和 `gridBorderColor` 属性定义

3. **src/components/grid/grid-body.tsx**
   - 接受并应用 `gridBorderWidth` 和 `gridBorderColor` 属性到网格线

4. **src/components/calendar/calendar.tsx**
   - 接受并应用 `gridBorderWidth` 和 `gridBorderColor` 属性到时间轴分隔线

5. **src/components/gantt/gantt.tsx**
   - 传递 `gridBorderWidth` 和 `gridBorderColor` 属性到子组件

6. **example/src/App.tsx**
   - 添加使用示例，展示如何使用这些新功能

## 兼容性

- 所有新增的属性都是可选的，具有合理的默认值
- 不会影响现有代码的使用
- 向后兼容
