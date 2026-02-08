# timelineHeaderCellRender 支持周和月模式

## 问题描述

之前 `timelineHeaderCellRender` 只能控制日模式下的日期单元格渲染，不能控制周模式和月模式的表头渲染。

## 解决方案

### 修改的文件

1. **src/components/calendar/calendar.tsx**
   - 在月模式的子表头（月份标签）渲染中添加了 `renderTimelineCell` 调用
   - 在月模式的母表头（年份标签）渲染中添加了 `renderTimelineCell` 调用
   - 在周模式的子表头（周标签）渲染中添加了 `renderTimelineCell` 调用
   - 在周模式的母表头（年月标签）渲染中添加了 `renderTimelineCell` 调用

### 修改详情

#### 月模式（oaTaskViewMode === "月"）

**之前**：直接渲染 `<text>` 元素，无法自定义
```tsx
bottomValues.push(
  <text key={`month-${monthKey}`} y={monthCenterY} x={monthCenterX} className={styles.calendarMonthLabel}>
    {monthLabel}
  </text>
);
```

**现在**：先调用 `renderTimelineCell`，支持自定义渲染
```tsx
const customMonth = renderTimelineCell(
  date, monthInfo.startIdx, 'bottom', monthLabel, monthCenterX, monthCenterY,
  { isGroupStart: true, colSpan: monthSpan }
);
if (customMonth) {
  bottomValues.push(
    <g key={`month-${monthKey}`} transform={`translate(${monthCenterX}, ${monthCenterY})`}>
      {customMonth}
    </g>
  );
} else {
  bottomValues.push(
    <text key={`month-${monthKey}`} y={monthCenterY} x={monthCenterX} className={styles.calendarMonthLabel}>
      {monthLabel}
    </text>
  );
}
```

类似的修改也应用到了：
- 月模式的年份标签（顶层）
- 周模式的周标签（底层）
- 周模式的年月标签（顶层）

### 使用方式

现在 `timelineHeaderCellRender` 可以通过 `level` 参数区分上下层，支持所有模式：

```tsx
<Gantt
  tasks={tasks}
  timelineHeaderCellRender={({ date, defaultLabel, level, oaTaskViewMode }) => {
    // level: 'top' | 'bottom'
    // oaTaskViewMode: '日' | '周' | '月' | '年'
    
    if (oaTaskViewMode === "周") {
      if (level === "bottom") {
        // 自定义周标签显示
        return <text x={0} y={0} textAnchor="middle" dominantBaseline="middle">
          W{weekNum}
        </text>;
      } else {
        // 自定义年月标签显示
        return <text x={0} y={0} textAnchor="middle" dominantBaseline="middle">
          {year}年{month}月
        </text>;
      }
    }
    
    // 其他模式...
    return <text x={0} y={0} textAnchor="middle" dominantBaseline="middle">
      {defaultLabel}
    </text>;
  }}
/>
```

### 不同模式下的 level 含义

#### 日模式（oaTaskViewMode === "日"）
- **top（上层）**: 周标签（如 "Week 01"）
- **bottom（下层）**: 日期（如 "5"）

#### 周模式（oaTaskViewMode === "周"）
- **top（上层）**: 年月标签（如 "2026 11Mon"）
- **bottom（下层）**: 周标签（如 "Week 01"）

#### 月模式（oaTaskViewMode === "月"）
- **top（上层）**: 年份标签（如 "2026"）
- **bottom（下层）**: 月份标签（如 "M1"）

#### 季模式（oaTaskViewMode === "季"）
- **top（上层）**: 年份标签（如 "2026"）
- **bottom（下层）**: 季度标签（如 "Q1"）

## 示例文件

1. **TIMELINE_HEADER_RENDER.md** - 详细的使用指南和示例
2. **example/src/TimelineHeaderExample.tsx** - 完整的示例组件
3. **example/src/App.tsx** - 更新了示例代码，展示了如何在不同模式下自定义渲染

## 测试

编译成功，无错误：
```bash
npm run build
# Build "ganttTaskReact" to dist:
#   36.7 kB: index.js.gz
#   36.2 kB: index.modern.js.gz
```

## 向后兼容

此修改完全向后兼容。如果不提供 `timelineHeaderCellRender`，将使用默认渲染方式，与之前的行为一致。
