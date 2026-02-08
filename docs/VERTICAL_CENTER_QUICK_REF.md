# 时间轴标签垂直居中及样式自定义 - 快速参考

## 🎯 问题
月模式下，7月等月份标签没有垂直居中

## ✅ 解决方案
1. 修复了垂直居中算法，使用精确的中心位置计算
2. 为每种模式暴露了独立的 CSS 样式类

## 📋 新增样式类

| 模式 | 样式类名 | 控制内容 |
|------|---------|---------|
| 日模式 | `.calendarDayLabel` | 日期（1, 2, 3...） |
| 周模式 | `.calendarWeekLabel` | 周（第1周, 第2周...） |
| 月模式 | `.calendarMonthLabel` | 月份（M1, M2, M7...） |
| 季模式 | `.calendarQuarterLabel` | 季度（Q1, Q2, Q3, Q4） |

## 🎨 如何自定义

### 修改月份标签样式
在你的 CSS 文件中添加：

```css
.calendarMonthLabel {
  fill: #1890ff !important;        /* 文字颜色 */
  font-size: 14px !important;      /* 字体大小 */
  font-weight: 600 !important;     /* 字体粗细 */
}
```

### 调整垂直对齐
```css
.calendarMonthLabel {
  /* middle: 居中（默认） */
  /* text-top: 顶部对齐 */
  /* text-bottom: 底部对齐 */
  dominant-baseline: middle !important;
}
```

### 为不同模式设置不同颜色
```css
.calendarDayLabel {
  fill: #52c41a !important;      /* 日期 - 绿色 */
}

.calendarWeekLabel {
  fill: #722ed1 !important;      /* 周 - 紫色 */
}

.calendarMonthLabel {
  fill: #1890ff !important;      /* 月份 - 蓝色 */
}

.calendarQuarterLabel {
  fill: #fa541c !important;      /* 季度 - 橙色 */
}
```

## 🔧 修改的文件

1. **calendar.tsx** - 修复了垂直居中计算
2. **calendar.module.css** - 添加了 4 个新样式类

## ⚙️ 技术细节

**垂直居中计算公式**：
```typescript
// 之前：使用固定比例（不够精确）
const y = headerHeight * 0.75;

// 之后：计算精确中心位置
const centerY = topDefaultHeight + (headerHeight - topDefaultHeight) / 2;
```

## 📝 可用的 SVG 文本属性

| 属性 | 说明 | 示例值 |
|------|------|--------|
| `fill` | 文字颜色 | `#1890ff`, `red` |
| `font-size` | 字体大小 | `12px`, `14px` |
| `font-weight` | 字体粗细 | `400`, `600`, `bold` |
| `text-anchor` | 水平对齐 | `middle`, `start`, `end` |
| `dominant-baseline` | 垂直对齐 | `middle`, `text-top`, `text-bottom` |

## 💡 常见用法

### 1. 增大月份标签
```css
.calendarMonthLabel {
  font-size: 16px !important;
  font-weight: bold !important;
}
```

### 2. 改变颜色
```css
.calendarMonthLabel {
  fill: #ff4d4f !important;
}
```

### 3. 顶部对齐
```css
.calendarMonthLabel {
  dominant-baseline: text-top !important;
}
```

## ✅ 验证

编译测试：
```bash
npm run build
# ✅ 编译成功
```

## 📚 详细文档

查看 `VERTICAL_CENTER_FIX.md` 了解更多详情

---

**更新**: 2026-02-08  
**状态**: ✅ 已完成
