# timelineHeaderCellRender 使用指南

`timelineHeaderCellRender` 是一个强大的自定义渲染函数，允许你完全控制时间轴表头的显示方式。它支持所有视图模式（日、周、月、年等）。

## 基本用法

```tsx
<Gantt
  tasks={tasks}
  timelineHeaderCellRender={({ date, defaultLabel, level, viewMode }) => {
    // level: 'top' | 'bottom' - 区分上层和下层（多行表头）
    // viewMode: ViewMode 枚举（Day / Week / Month / QuarterYear / Year / DayShift / DayShiftDN）
    
    return (
      <text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: 12, fill: "#333" }}
      >
        {defaultLabel}
      </text>
    );
  }}
/>
```

## 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| `date` | `Date` | 当前单元格的日期 |
| `index` | `number` | 当前单元格的索引 |
| `columnWidth` | `number` | 列宽度（像素） |
| `headerHeight` | `number` | 表头高度（像素） |
| `level` | `'top' \| 'bottom'` | 表头层级：`top`=上层，`bottom`=下层 |
| `defaultLabel` | `string` | 默认显示的文本 |
| `viewMode` | `ViewMode` | 当前时间轴刻度模式 |
| `locale` | `string` | 语言环境 |
| `x` | `number` | X坐标（列中心） |
| `y` | `number` | Y坐标 |
| `isGroupStart` | `boolean?` | 是否为新组开始（如新周、新月的第一天） |
| `colSpan` | `number?` | 跨列数（合并单元格时） |

## 不同模式下的 level 含义

### 日模式（viewMode === ViewMode.Day）
- **top（上层）**: 周标签（如 "Week 01"）
- **bottom（下层）**: 日期（如 "5"）

### 周模式（viewMode === ViewMode.Week）
- **top（上层）**: 年月标签（如 "2026 11Mon"）
- **bottom（下层）**: 周标签（如 "Week 01"）

### 月模式（viewMode === ViewMode.Month）
- **top（上层）**: 年份标签（如 "2026"）
- **bottom（下层）**: 月份标签（如 "M1"）

### 季模式（viewMode === ViewMode.QuarterYear）
- **top（上层）**: 年份标签（如 "2026"）
- **bottom（下层）**: 季度标签（如 "Q1"）

## 示例：根据模式自定义显示

```tsx
import { ViewMode } from "gantt-task-react";

timelineHeaderCellRender={({ date, defaultLabel, level, viewMode }) => {
  let displayLabel = defaultLabel;
  let customStyle: React.CSSProperties = { fontSize: 12, fill: "#333" };
  
  if (viewMode === ViewMode.Day) {
    if (level === "bottom") {
      displayLabel = `${date.getDate()}`;
    }
  }
  else if (viewMode === ViewMode.Week) {
    if (level === "bottom") {
      const weekNum = getWeekNumber(date);
      displayLabel = `W${weekNum.padStart(2, '0')}`;
    } else {
      customStyle = { fontSize: 13, fill: "#1890ff", fontWeight: "bold" };
    }
  }
  else if (viewMode === ViewMode.Month) {
    if (level === "bottom") {
      displayLabel = `${date.getMonth() + 1}月`;
    } else {
      customStyle = { fontSize: 14, fill: "#52c41a", fontWeight: "bold" };
    }
  }
  else if (viewMode === ViewMode.QuarterYear) {
    if (level === "bottom") {
      // 自定义季度格式
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      displayLabel = `第${quarter}季度`;
    } else {
      // 年份用橙色加粗
      customStyle = { fontSize: 14, fill: "#fa8c16", fontWeight: "bold" };
    }
  }
  
  return (
    <text
      x={0}
      y={0}
      textAnchor="middle"
      dominantBaseline="middle"
      style={customStyle}
    >
      {displayLabel}
    </text>
  );
}}
```

## 示例：添加悬浮提示

```tsx
timelineHeaderCellRender={({ date, defaultLabel, level }) => {
  const fullDate = date.toLocaleDateString('zh-CN');
  
  return (
    <text
      x={0}
      y={0}
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ fontSize: 12, fill: "#333" }}
    >
      {/* 添加 title 元素显示悬浮提示 */}
      <title>{fullDate}</title>
      {defaultLabel}
    </text>
  );
}}
```

## 示例：根据日期类型添加特殊样式

```tsx
import { ViewMode } from "gantt-task-react";

timelineHeaderCellRender={({ date, defaultLabel, level, viewMode }) => {
  let color = "#333";
  
  if (viewMode === ViewMode.Day && level === "bottom") {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      color = "#ff4d4f";
    }
  }
  
  return (
    <text
      x={0}
      y={0}
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ fontSize: 12, fill: color }}
    >
      {defaultLabel}
    </text>
  );
}}
```

## 注意事项

1. **坐标系统**: 返回的元素会被包裹在 `<g transform={`translate(${x}, ${y})`}>` 中，所以你的自定义元素应该使用相对坐标 `x={0} y={0}`
2. **SVG 元素**: 只能返回 SVG 兼容的元素（如 `<text>`, `<tspan>`, `<g>` 等），不能返回 HTML 元素
3. **居中对齐**: 使用 `textAnchor="middle"` 和 `dominantBaseline="middle"` 实现文本居中
4. **性能**: 这个函数会为每个时间单元格调用，避免在函数中执行复杂计算

## 默认格式（通过 i18n 配置）

如果你只想修改默认的文本格式（不需要完全自定义渲染），可以使用 i18n 配置：

```tsx
<Gantt
  tasks={tasks}
  i18n={{
    monthLabel: (month) => `${month + 1}月`,
    weekLabel: (weekNum) => `第${weekNum}周`,
    yearMonthLabel: (year, month) => `${year}年${month + 1}月`,
  }}
/>
```

这样可以在不使用 `timelineHeaderCellRender` 的情况下修改文本格式。
