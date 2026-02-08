# 周模式年月标签格式自定义

## 📋 功能概述

在周模式下，母表头显示的"年份 + 月份"格式支持自定义配置，可以从"2026 一月"改为"2026 11Mon"或"2026 11M"等格式。

## 🎯 修改内容

### 默认显示效果

| 语言 | 修改前 | 修改后 |
|------|--------|--------|
| 中文 | 2026 一月 | **2026 11Mon** |
| 英文 | 2026 January | **2026 11Jan** |

## 🔧 配置方法

### 1. 国际化配置新增

在 `I18nTexts` 接口中添加了新的配置函数：

```typescript
export interface I18nTexts {
  // ...其他配置...
  
  // 周模式母表头的年月标签函数（可自定义格式）
  yearMonthLabel?: (year: number, monthIndex: number) => string;
}
```

### 2. 默认配置

#### 中文（zh-TW）
```typescript
yearMonthLabel: (year: number, monthIndex: number) => 
  `${year} ${String(monthIndex + 1).padStart(2, '0')}Mon`
```
**效果**：2026 01Mon, 2026 02Mon, ..., 2026 11Mon, 2026 12Mon

#### 英文（en）
```typescript
yearMonthLabel: (year: number, monthIndex: number) => {
  const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
  return `${year} ${String(monthIndex + 1).padStart(2, '0')}${monthShort}`;
}
```
**效果**：2026 01Jan, 2026 02Feb, ..., 2026 11Nov, 2026 12Dec

## 📝 自定义格式示例

### 格式 1: 2026 11Mon（当前默认）
```typescript
yearMonthLabel: (year, monthIndex) => 
  `${year} ${String(monthIndex + 1).padStart(2, '0')}Mon`
```

### 格式 2: 2026 11M
```typescript
yearMonthLabel: (year, monthIndex) => 
  `${year} ${String(monthIndex + 1).padStart(2, '0')}M`
```

### 格式 3: 2026-11
```typescript
yearMonthLabel: (year, monthIndex) => 
  `${year}-${String(monthIndex + 1).padStart(2, '0')}`
```

### 格式 4: 2026/11
```typescript
yearMonthLabel: (year, monthIndex) => 
  `${year}/${String(monthIndex + 1).padStart(2, '0')}`
```

### 格式 5: 26年11月
```typescript
yearMonthLabel: (year, monthIndex) => 
  `${year % 100}年${monthIndex + 1}月`
```

### 格式 6: 2026.11
```typescript
yearMonthLabel: (year, monthIndex) => 
  `${year}.${String(monthIndex + 1).padStart(2, '0')}`
```

### 格式 7: 2026 Nov（英文月份简称）
```typescript
yearMonthLabel: (year, monthIndex) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${year} ${months[monthIndex]}`;
}
```

### 格式 8: 2026 一月（原格式）
```typescript
yearMonthLabel: (year, monthIndex) => {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月',
                  '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return `${year} ${months[monthIndex]}`;
}
```

## 📊 显示效果对比

### 周模式时间轴

```
修改前：
┌────────────────────────────────────────────────┐
│     2026 一月     │     2026 二月     │        │  ← 母表头
├────────┬──────────┬──────────┬────────┬────────┤
│Week 01 │ Week 02  │ Week 03  │Week 04 │Week 05 │  ← 子表头
└────────┴──────────┴──────────┴────────┴────────┘

修改后：
┌────────────────────────────────────────────────┐
│   2026 01Mon   │   2026 02Mon   │   2026 03Mon │  ← 母表头（新格式）
├────────┬───────┬──────────┬─────────┬─────────┤
│Week 01 │Week 02│ Week 03  │ Week 04 │ Week 05 │  ← 子表头
└────────┴───────┴──────────┴─────────┴─────────┘
```

## 🔧 如何修改

### 方法 1: 修改源码配置

**文件位置**: `src/i18n/index.ts`

找到对应语言的配置（`zhTW` 或 `en`），修改 `yearMonthLabel` 函数：

```typescript
const zhTW: I18nTexts = {
  // ...其他配置...
  
  // 修改这里
  yearMonthLabel: (year: number, monthIndex: number) => 
    `${year} ${String(monthIndex + 1).padStart(2, '0')}Mon`,
  
  // 或者改成其他格式：
  // yearMonthLabel: (year, monthIndex) => `${year} ${monthIndex + 1}M`,
  // yearMonthLabel: (year, monthIndex) => `${year}-${String(monthIndex + 1).padStart(2, '0')}`,
};
```

### 方法 2: 扩展配置（未来支持）

```typescript
import { getI18nTexts, I18nTexts } from 'gantt-task-react';

const customI18n: I18nTexts = {
  ...getI18nTexts('zh-TW'),
  yearMonthLabel: (year, monthIndex) => `${year} ${monthIndex + 1}M`,
};
```

## 📐 技术细节

### 参数说明

**yearMonthLabel 函数签名**：
```typescript
(year: number, monthIndex: number) => string
```

| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `year` | number | 年份 | 2026 |
| `monthIndex` | number | 月份索引（0-11） | 0=1月, 10=11月 |
| 返回值 | string | 显示的标签文本 | "2026 11Mon" |

### padStart 使用

```typescript
String(monthIndex + 1).padStart(2, '0')
```

| monthIndex | monthIndex + 1 | padStart(2, '0') | 说明 |
|------------|----------------|------------------|------|
| 0 | 1 | "01" | 一月 |
| 10 | 11 | "11" | 十一月 |
| 11 | 12 | "12" | 十二月 |

## 📁 修改的文件

### 1. src/i18n/index.ts

#### 接口定义（第 49-51 行）
```typescript
// 周模式母表头的年月标签函数（可自定义格式）
yearMonthLabel?: (year: number, monthIndex: number) => string;
```

#### 中文配置（第 91-93 行）
```typescript
// 周模式母表头年月标签：2026 11Mon（可自定义）
yearMonthLabel: (year: number, monthIndex: number) => 
  `${year} ${String(monthIndex + 1).padStart(2, '0')}Mon`,
```

#### 英文配置（第 131-136 行）
```typescript
// 周模式母表头年月标签：2026 11Jan（可自定义）
yearMonthLabel: (year: number, monthIndex: number) => {
  const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
  return `${year} ${String(monthIndex + 1).padStart(2, '0')}${monthShort}`;
},
```

### 2. src/components/calendar/calendar.tsx

修改周模式母表头渲染逻辑（第 1181-1205 行）：

```typescript
// 使用国际化年月标签函数
let yearMonthLabel: string;
if (i18n?.yearMonthLabel) {
  yearMonthLabel = i18n.yearMonthLabel(year, month);
} else {
  const monthName = i18n ? i18n.monthNames[month] : getLocaleMonth(date, locale);
  yearMonthLabel = `${year} ${monthName}`;
}
```

## 🎨 完整示例代码

### 示例配置文件

```typescript
// src/i18n/custom.ts
import { I18nTexts } from './index';

// 配置 1: 2026 11Mon
export const config1: Partial<I18nTexts> = {
  yearMonthLabel: (year, monthIndex) => 
    `${year} ${String(monthIndex + 1).padStart(2, '0')}Mon`,
};

// 配置 2: 2026 11M
export const config2: Partial<I18nTexts> = {
  yearMonthLabel: (year, monthIndex) => 
    `${year} ${String(monthIndex + 1).padStart(2, '0')}M`,
};

// 配置 3: 2026-11
export const config3: Partial<I18nTexts> = {
  yearMonthLabel: (year, monthIndex) => 
    `${year}-${String(monthIndex + 1).padStart(2, '0')}`,
};

// 配置 4: 2026/11
export const config4: Partial<I18nTexts> = {
  yearMonthLabel: (year, monthIndex) => 
    `${year}/${String(monthIndex + 1).padStart(2, '0')}`,
};
```

## ✅ 验证结果

### 编译测试
```bash
npm run build
# ✅ 编译成功
# 文件大小: 36.4 kB (+0.1 kB)
```

### 显示效果
- ✅ 中文：2026 01Mon, 2026 02Mon, ..., 2026 11Mon
- ✅ 英文：2026 01Jan, 2026 02Feb, ..., 2026 11Nov
- ✅ 垂直居中：完美居中
- ✅ 向后兼容：如果不提供 `yearMonthLabel`，使用原格式

## 💡 常见问题

### Q1: 如何改成"2026 11M"格式？
修改 `src/i18n/index.ts`：
```typescript
yearMonthLabel: (year, monthIndex) => 
  `${year} ${String(monthIndex + 1).padStart(2, '0')}M`
```

### Q2: 如何去掉前导零（2026 11 而不是 2026 11Mon）？
```typescript
yearMonthLabel: (year, monthIndex) => `${year} ${monthIndex + 1}`
```

### Q3: 如何改回原来的"2026 一月"格式？
```typescript
yearMonthLabel: (year, monthIndex) => {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月',
                  '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return `${year} ${months[monthIndex]}`;
}
```

### Q4: 如何使用英文月份全称（2026 November）？
```typescript
yearMonthLabel: (year, monthIndex) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return `${year} ${months[monthIndex]}`;
}
```

## 🔄 向后兼容性

✅ 完全向后兼容：
- `yearMonthLabel` 是可选参数
- 如果不提供，使用原有逻辑（`year + monthNames[month]`）
- 不影响其他模式（日模式、月模式、季模式）

## 🎯 相关配置

| 配置项 | 用途 | 应用场景 |
|--------|------|---------|
| `monthLabel` | 月视图子表头月份标签 | 月模式：M1, M2, M7 |
| `weekLabel` | 周标签 | 日/周模式：Week 01 |
| `yearMonthLabel` | 周模式母表头年月标签 | 周模式：2026 11Mon |
| `quarterLabel` | 季度标签 | 季模式：Q1, Q2 |

## 📚 相关文档

- `MONTH_LABEL_CUSTOMIZATION.md` - 月份标签自定义
- `WEEK_LABEL_FORMAT.md` - 周标签格式修改
- `VERTICAL_CENTER_FIX.md` - 垂直居中修复
- `src/i18n/index.ts` - 国际化配置源码

## 🎉 总结

### 新增功能
- ✅ 支持自定义周模式年月标签格式
- ✅ 默认格式：2026 11Mon（中文）、2026 11Jan（英文）
- ✅ 支持多种格式配置（11Mon, 11M, 2026-11 等）

### 技术特性
- ✅ 可选配置，向后兼容
- ✅ 灵活的函数接口
- ✅ TypeScript 类型安全
- ✅ 完整的国际化支持

---

**更新日期**: 2026-02-08  
**版本**: v0.3.9+  
**状态**: ✅ 已完成并测试通过
