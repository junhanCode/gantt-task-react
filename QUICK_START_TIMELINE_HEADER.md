# timelineHeaderCellRender 快速开始

## 简介

`timelineHeaderCellRender` 允许你完全自定义时间轴表头的显示方式。现在已支持所有视图模式。

## 基本用法

```tsx
<Gantt
  tasks={tasks}
  timelineHeaderCellRender={({ date, defaultLabel, level }) => {
    // 自定义渲染逻辑
    return (
      <text x={0} y={0} textAnchor="middle" dominantBaseline="middle">
        {defaultLabel}
      </text>
    );
  }}
/>
```

## 参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| `level` | 表头层级 | `'top'` 或 `'bottom'` |
| `oaTaskViewMode` | OA视图模式 | `'日'` / `'周'` / `'月'` / `'季'` |
| `date` | 当前日期 | `new Date(2026, 1, 5)` |
| `defaultLabel` | 默认文本 | `"Week 01"`, `"M1"`, `"5"` |

## 常见场景

### 场景1: 自定义日期格式

```tsx
timelineHeaderCellRender={({ date, level, oaTaskViewMode }) => {
  if (oaTaskViewMode === "月" && level === "bottom") {
    // 显示为 "1月" 而不是 "M1"
    return <text x={0} y={0} textAnchor="middle">{date.getMonth() + 1}月</text>;
  }
  return <text x={0} y={0} textAnchor="middle">{defaultLabel}</text>;
}}
```

### 场景2: 添加样式

```tsx
timelineHeaderCellRender={({ defaultLabel, level }) => {
  const color = level === "top" ? "#1890ff" : "#333";
  return (
    <text 
      x={0} 
      y={0} 
      textAnchor="middle" 
      style={{ fill: color, fontWeight: "bold" }}
    >
      {defaultLabel}
    </text>
  );
}}
```

### 场景3: 周末高亮

```tsx
timelineHeaderCellRender={({ date, defaultLabel, level, oaTaskViewMode }) => {
  if (oaTaskViewMode === "日" && level === "bottom") {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    return (
      <text 
        x={0} 
        y={0} 
        textAnchor="middle"
        style={{ fill: isWeekend ? "#ff4d4f" : "#333" }}
      >
        {date.getDate()}
      </text>
    );
  }
  return <text x={0} y={0} textAnchor="middle">{defaultLabel}</text>;
}}
```

## 不同模式下的 level 含义

| 模式 | top (上层) | bottom (下层) |
|------|-----------|--------------|
| 日 | 周标签 ("Week 01") | 日期 ("5") |
| 周 | 年月 ("2026 11Mon") | 周标签 ("Week 01") |
| 月 | 年份 ("2026") | 月份 ("M1") |
| 季 | 年份 ("2026") | 季度 ("Q1") |

## 完整文档

查看 [TIMELINE_HEADER_RENDER.md](./TIMELINE_HEADER_RENDER.md) 获取更多详细信息和高级用法。

## 注意事项

1. 返回的元素必须是 SVG 元素（如 `<text>`），不能是 HTML 元素
2. 使用 `x={0} y={0}` 相对坐标（已自动处理偏移）
3. 使用 `textAnchor="middle"` 和 `dominantBaseline="middle"` 实现居中

## 示例项目

参考 `example/src/TimelineHeaderExample.tsx` 查看完整示例代码。
