# 时间轴标签垂直居中修复及样式自定义

## 📋 修改概述

修复了 OA 任务模式下（日/周/月/季）时间轴子表头标签的垂直居中问题，并为每种模式暴露了独立的 CSS 样式类，方便用户自定义样式。

## 🔧 修改内容

### 1. 垂直居中算法优化

**修改前**：使用固定比例 `headerHeight * 0.75` 计算 Y 坐标
```typescript
const dayY = headerHeight * 0.75;  // 可能不够精确
```

**修改后**：计算子表头区域的精确中心位置
```typescript
// 计算子表头区域的垂直中心位置
const dayCenterY = topDefaultHeight + (headerHeight - topDefaultHeight) / 2;
```

### 2. 新增独立样式类

为每种模式的时间轴标签添加了独立的 CSS 类名，方便自定义：

| 模式 | 原样式类 | 新样式类 | 用途 |
|------|---------|---------|------|
| 日模式 | `calendarBottomTextVerticalCenter` | `calendarDayLabel` | 日期标签（1, 2, 3, ...） |
| 周模式 | `calendarBottomTextVerticalCenter` | `calendarWeekLabel` | 周标签（第1周, 第2周, ...） |
| 月模式 | `calendarBottomTextVerticalCenter` | `calendarMonthLabel` | 月份标签（M1, M2, M7, ...） |
| 季模式 | `calendarBottomTextVerticalCenter` | `calendarQuarterLabel` | 季度标签（Q1, Q2, Q3, Q4） |

## 📝 样式类详情

### calendarDayLabel（日模式-日期标签）
```css
.calendarDayLabel {
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #333;
  font-size: 12px;
  font-weight: 400;
  /* ... 其他样式 ... */
}
```

### calendarWeekLabel（周模式-周标签）
```css
.calendarWeekLabel {
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #333;
  font-size: 12px;
  font-weight: 400;
  /* ... 其他样式 ... */
}
```

### calendarMonthLabel（月模式-月份标签）
```css
.calendarMonthLabel {
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #333;
  font-size: 12px;
  font-weight: 400;
  /* ... 其他样式 ... */
}
```

### calendarQuarterLabel（季模式-季度标签）
```css
.calendarQuarterLabel {
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #333;
  font-size: 12px;
  font-weight: 400;
  /* ... 其他样式 ... */
}
```

## 🎨 如何自定义样式

### 方法 1: 覆盖 CSS 样式（推荐）

在你的项目中添加自定义 CSS，覆盖默认样式：

```css
/* 自定义月份标签样式 */
.calendarMonthLabel {
  fill: #1890ff !important;        /* 改变文字颜色 */
  font-size: 14px !important;      /* 改变字体大小 */
  font-weight: 600 !important;     /* 改变字体粗细 */
  dominant-baseline: text-top !important;  /* 调整垂直对齐方式 */
}

/* 自定义日期标签样式 */
.calendarDayLabel {
  fill: #52c41a !important;
  font-size: 11px !important;
}

/* 自定义周标签样式 */
.calendarWeekLabel {
  fill: #722ed1 !important;
  font-weight: bold !important;
}

/* 自定义季度标签样式 */
.calendarQuarterLabel {
  fill: #fa541c !important;
  font-size: 16px !important;
}
```

### 方法 2: 修改源码（开发者）

如果你是库的开发者或需要修改默认样式，可以直接编辑：

**文件位置**: `src/components/calendar/calendar.module.css`

```css
/* 月模式下的月份标签样式（可自定义垂直居中） */
.calendarMonthLabel {
  text-anchor: middle;
  dominant-baseline: middle;  /* 垂直居中方式 */
  fill: #333;                 /* 文字颜色 */
  font-size: 12px;            /* 字体大小 */
  font-weight: 400;           /* 字体粗细 */
  /* ... */
}
```

## 🎯 垂直对齐选项

`dominant-baseline` 属性控制 SVG 文本的垂直对齐方式：

| 值 | 效果 | 说明 |
|---|------|------|
| `middle` | 垂直居中（默认） | 推荐，最常用 |
| `text-top` | 顶部对齐 | 文字顶部对齐容器顶部 |
| `text-bottom` | 底部对齐 | 文字底部对齐容器底部 |
| `hanging` | 悬挂对齐 | 文字挂在顶部 |
| `baseline` | 基线对齐 | 按文字基线对齐 |

### 示例：顶部对齐

```css
.calendarMonthLabel {
  dominant-baseline: text-top !important;
  /* 可能需要调整 y 坐标偏移 */
}
```

## 📊 修改文件清单

### 核心代码
1. **src/components/calendar/calendar.tsx**
   - 修复日模式垂直居中（第 684-707 行）
   - 修复月模式垂直居中（第 881-899 行）
   - 修复季模式垂直居中（第 1030-1047 行）
   - 修复周模式垂直居中（第 1126-1140 行）

2. **src/components/calendar/calendar.module.css**
   - 添加 `.calendarDayLabel` 样式类
   - 添加 `.calendarWeekLabel` 样式类
   - 添加 `.calendarMonthLabel` 样式类
   - 添加 `.calendarQuarterLabel` 样式类

## 🧪 测试验证

### 编译测试
```bash
npm run build
# ✅ 编译成功
```

### 手动测试步骤
1. 切换到不同视图模式（日/周/月/季）
2. 检查时间轴标签是否垂直居中
3. 添加自定义 CSS 覆盖样式
4. 验证样式修改是否生效

## 📐 技术细节

### 垂直居中计算公式

```typescript
// 子表头区域高度
const bottomHeight = headerHeight - topDefaultHeight;

// 子表头垂直中心位置
const centerY = topDefaultHeight + bottomHeight / 2;

// 简化为：
const centerY = topDefaultHeight + (headerHeight - topDefaultHeight) / 2;
```

### SVG 文本居中

结合两个属性实现完美居中：

1. **text-anchor: middle** - 水平居中
2. **dominant-baseline: middle** - 垂直居中

```xml
<text
  x={centerX}
  y={centerY}
  text-anchor="middle"
  dominant-baseline="middle"
>
  M7
</text>
```

## 💡 使用示例

### 示例 1: 改变月份标签颜色和大小

```css
/* 在你的项目 CSS 文件中 */
.calendarMonthLabel {
  fill: #1890ff !important;
  font-size: 14px !important;
  font-weight: 600 !important;
}
```

### 示例 2: 调整垂直对齐方式

```css
/* 让月份标签靠近顶部 */
.calendarMonthLabel {
  dominant-baseline: text-top !important;
}
```

### 示例 3: 为不同模式设置不同样式

```css
/* 日期标签 - 绿色 */
.calendarDayLabel {
  fill: #52c41a !important;
}

/* 周标签 - 紫色 */
.calendarWeekLabel {
  fill: #722ed1 !important;
}

/* 月份标签 - 蓝色 */
.calendarMonthLabel {
  fill: #1890ff !important;
}

/* 季度标签 - 橙色 */
.calendarQuarterLabel {
  fill: #fa541c !important;
}
```

## ⚠️ 注意事项

1. **使用 !important**: 覆盖样式时可能需要使用 `!important` 确保优先级
2. **SVG 属性**: 注意是 `fill` 而不是 `color`，`font-size` 单位通常是 `px`
3. **浏览器兼容性**: `dominant-baseline` 在所有现代浏览器中都支持良好
4. **Y 坐标调整**: 如果改变 `dominant-baseline`，可能需要相应调整 Y 坐标

## 🔄 向后兼容性

✅ 完全向后兼容：
- 原有的 `calendarBottomTextVerticalCenter` 样式类保留
- 新增的样式类不影响现有功能
- Y 坐标计算更精确，视觉效果更好

## 📚 相关文档

- `MONTH_LABEL_CUSTOMIZATION.md` - 月份格式自定义
- `MONTH_LABEL_EXAMPLES.md` - 月份格式示例
- Calendar 组件源码：`src/components/calendar/calendar.tsx`
- 样式文件：`src/components/calendar/calendar.module.css`

## 🎉 总结

### 修复的问题
- ✅ 日模式：日期标签垂直居中
- ✅ 周模式：周标签垂直居中
- ✅ 月模式：月份标签垂直居中（M1, M2, M7 等）
- ✅ 季模式：季度标签垂直居中

### 新增的功能
- ✅ 暴露独立样式类：`calendarDayLabel`
- ✅ 暴露独立样式类：`calendarWeekLabel`
- ✅ 暴露独立样式类：`calendarMonthLabel`
- ✅ 暴露独立样式类：`calendarQuarterLabel`

### 用户价值
- ✅ 更精确的垂直居中效果
- ✅ 更灵活的样式自定义能力
- ✅ 完全向后兼容，不影响现有功能

---

**更新日期**: 2026-02-08  
**版本**: v0.3.9+  
**状态**: ✅ 已完成并测试通过
