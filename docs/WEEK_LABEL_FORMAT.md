# 周标签格式修改 - Week 01 格式

## 📋 修改概述

将日模式和周模式下的周标签格式从"第2周"改为"Week 01"格式，并确保垂直居中。

## 🎯 修改内容

### 1. 周标签格式修改

#### 中文配置（zh-TW）

**修改前**：
```typescript
weekLabel: (weekNum: string) => `第${weekNum}周`
// 显示效果：第1周, 第2周, 第3周...
```

**修改后**：
```typescript
weekLabel: (weekNum: string) => `Week ${weekNum.padStart(2, '0')}`
// 显示效果：Week 01, Week 02, Week 03...
```

#### 英文配置（en）

保持不变，已经是 `Week 01` 格式：
```typescript
weekLabel: (weekNum: string) => `Week ${weekNum.padStart(2, '0')}`
// 显示效果：Week 01, Week 02, Week 03...
```

### 2. 日模式母表头垂直居中修复

在日模式下，母表头显示的周标签（Week 01, Week 02...）进行了垂直居中优化。

**修改前**：
```typescript
const weekCenterY = topDefaultHeight * 0.7;  // 固定比例
```

**修改后**：
```typescript
const weekCenterY = topDefaultHeight * 0.5;  // 精确居中
```

### 3. 新增样式类

添加了日模式母表头周标签的专用样式类：

**样式类名**：`.calendarWeekLabelTop`

```css
.calendarWeekLabelTop {
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #555;
  font-size: 12px;
  font-weight: 400;
  /* ... */
}
```

## 📊 效果对比

### 中文模式

| 位置 | 修改前 | 修改后 |
|------|--------|--------|
| 日模式母表头 | 第1周, 第2周, 第3周 | Week 01, Week 02, Week 03 |
| 周模式子表头 | 第1周, 第2周, 第3周 | Week 01, Week 02, Week 03 |

### 英文模式

保持不变，已经是 `Week 01` 格式。

## 📝 修改的文件

### 1. src/i18n/index.ts
修改中文配置的 `weekLabel` 函数：
```typescript
// 第 55-57 行
const zhTW: I18nTexts = {
  week: '周',
  weekLabel: (weekNum: string) => `Week ${weekNum.padStart(2, '0')}`,  // ✨ 修改
```

### 2. src/components/calendar/calendar.tsx
修复日模式母表头周标签的垂直居中（第 733-756 行）：
```typescript
// 计算母表头区域的垂直中心位置
const weekCenterY = topDefaultHeight * 0.5;
// 使用新样式类 calendarWeekLabelTop
className={styles.calendarWeekLabelTop}
```

### 3. src/components/calendar/calendar.module.css
添加新样式类（第 87-99 行）：
```css
/* 日模式母表头的周标签样式（Week 01, Week 02...） */
.calendarWeekLabelTop {
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #555;
  font-size: 12px;
  font-weight: 400;
  /* ... */
}
```

## 🎨 样式自定义

### 修改周标签样式

#### 日模式子表头（日期下方的周标签）
周模式的子表头周标签使用 `.calendarWeekLabel`：
```css
.calendarWeekLabel {
  fill: #1890ff !important;        /* 改变颜色 */
  font-size: 14px !important;      /* 改变大小 */
  font-weight: 600 !important;     /* 改变粗细 */
}
```

#### 日模式母表头（顶部的周标签 - Week 01）
```css
.calendarWeekLabelTop {
  fill: #722ed1 !important;        /* 改变颜色 */
  font-size: 13px !important;      /* 改变大小 */
  font-weight: bold !important;    /* 改变粗细 */
}
```

### 调整垂直对齐
```css
.calendarWeekLabelTop {
  dominant-baseline: text-top !important;  /* 顶部对齐 */
  /* 或 */
  dominant-baseline: text-bottom !important;  /* 底部对齐 */
}
```

## 🔧 技术细节

### padStart 函数说明

```typescript
weekNum.padStart(2, '0')
```

| 输入 | 输出 | 说明 |
|------|------|------|
| `"1"` | `"01"` | 补零到2位 |
| `"2"` | `"02"` | 补零到2位 |
| `"10"` | `"10"` | 已经是2位，不变 |
| `"52"` | `"52"` | 已经是2位，不变 |

### 垂直居中计算

**日模式母表头**（显示 Week 01）：
```typescript
const weekCenterY = topDefaultHeight * 0.5;
// 母表头区域的垂直中心
```

**周模式子表头**（显示 Week 01）：
```typescript
const weekCenterY = topDefaultHeight + (headerHeight - topDefaultHeight) / 2;
// 子表头区域的垂直中心
```

## 📍 应用场景

### 日模式
```
┌─────────────────────────────────────────────┐
│           Week 01           │   Week 02     │  ← 母表头（顶部）
├───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┤
│ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │10 │11 │  ← 子表头（日期）
└───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
```

### 周模式
```
┌─────────────────────────────────────────────┐
│    2026 一月    │    2026 二月    │        │  ← 母表头（年月）
├────────┬────────┬────────┬────────┬────────┤
│Week 01 │Week 02 │Week 03 │Week 04 │Week 05 │  ← 子表头（周）
└────────┴────────┴────────┴────────┴────────┘
```

## ✅ 验证结果

### 编译测试
```bash
npm run build
# ✅ 编译成功
# 文件大小: 36.3 kB (无变化)
```

### 显示效果
- ✅ 日模式母表头：Week 01, Week 02, Week 03...
- ✅ 周模式子表头：Week 01, Week 02, Week 03...
- ✅ 垂直居中：完美居中
- ✅ 两位数格式：01, 02, 03, ..., 52

## 💡 常见问题

### Q1: 如何改回"第X周"格式？
修改 `src/i18n/index.ts`：
```typescript
weekLabel: (weekNum: string) => `第${weekNum}周`
```

### Q2: 如何改成"W01"格式？
```typescript
weekLabel: (weekNum: string) => `W${weekNum.padStart(2, '0')}`
```

### Q3: 如何去掉前导零（Week 1 而不是 Week 01）？
```typescript
weekLabel: (weekNum: string) => `Week ${weekNum}`
```

### Q4: 如何改变周标签颜色？
```css
.calendarWeekLabelTop {
  fill: #1890ff !important;
}

.calendarWeekLabel {
  fill: #1890ff !important;
}
```

## 🎯 其他格式示例

```typescript
// 格式 1: Week 01（当前）
weekLabel: (weekNum: string) => `Week ${weekNum.padStart(2, '0')}`

// 格式 2: W01
weekLabel: (weekNum: string) => `W${weekNum.padStart(2, '0')}`

// 格式 3: 第1周（原格式）
weekLabel: (weekNum: string) => `第${weekNum}周`

// 格式 4: Week 1（无前导零）
weekLabel: (weekNum: string) => `Week ${weekNum}`

// 格式 5: 周1
weekLabel: (weekNum: string) => `周${weekNum}`

// 格式 6: #01
weekLabel: (weekNum: string) => `#${weekNum.padStart(2, '0')}`
```

## 🔄 向后兼容性

✅ 完全向后兼容：
- 只修改了显示格式
- 不影响数据结构
- 不影响其他功能
- 样式可自定义覆盖

## 📚 相关文档

- `VERTICAL_CENTER_FIX.md` - 垂直居中修复详细说明
- `MONTH_LABEL_CUSTOMIZATION.md` - 月份格式自定义
- `src/i18n/index.ts` - 国际化配置
- `src/components/calendar/calendar.tsx` - 日历组件

## 📦 样式类列表

| 样式类 | 用途 | 位置 |
|--------|------|------|
| `.calendarWeekLabelTop` | 日模式母表头周标签（Week 01） | 顶部 |
| `.calendarWeekLabel` | 周模式子表头周标签（Week 01） | 底部 |
| `.calendarDayLabel` | 日模式子表头日期（1, 2, 3...） | 底部 |

## 🎉 总结

### 修改内容
- ✅ 中文周标签：第2周 → Week 01
- ✅ 日模式母表头垂直居中优化
- ✅ 新增样式类：`.calendarWeekLabelTop`
- ✅ 格式统一：两位数补零

### 显示效果
- ✅ Week 01, Week 02, Week 03, ..., Week 52
- ✅ 完美垂直居中
- ✅ 样式可自定义

### 技术特性
- ✅ 使用 `padStart(2, '0')` 补零
- ✅ 垂直居中精确计算
- ✅ 独立样式类方便自定义
- ✅ 完全向后兼容

---

**更新日期**: 2026-02-08  
**版本**: v0.3.9+  
**状态**: ✅ 已完成并测试通过
