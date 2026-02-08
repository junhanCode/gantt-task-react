# 月份标签自定义说明 (Month Label Customization)

## 概述

在月视图模式下，时间轴上的月份显示格式支持通过国际化配置进行自定义。

## 默认配置

### 中文 (zh-TW)
- 默认格式：`M1`, `M2`, `M3`, ..., `M7`, ..., `M12`
- 配置位置：`src/i18n/index.ts`

```typescript
const zhTW: I18nTexts = {
  // ...
  monthLabel: (monthIndex: number) => `M${monthIndex + 1}`,
  // ...
};
```

### 英文 (en)
- 默认格式：`Jan`, `Feb`, `Mar`, ..., `Jul`, ..., `Dec`
- 配置位置：`src/i18n/index.ts`

```typescript
const en: I18nTexts = {
  // ...
  monthLabel: (monthIndex: number) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex],
  // ...
};
```

## 自定义示例

### 示例 1: 数字格式 (1, 2, 3, ...)
```typescript
monthLabel: (monthIndex: number) => `${monthIndex + 1}`
```
效果：`1`, `2`, `3`, ..., `7`, ..., `12`

### 示例 2: M + 数字格式 (M1, M2, M3, ...)
```typescript
monthLabel: (monthIndex: number) => `M${monthIndex + 1}`
```
效果：`M1`, `M2`, `M3`, ..., `M7`, ..., `M12`

### 示例 3: Mon + 数字格式 (Mon 1, Mon 2, ...)
```typescript
monthLabel: (monthIndex: number) => `Mon ${monthIndex + 1}`
```
效果：`Mon 1`, `Mon 2`, `Mon 3`, ..., `Mon 7`, ..., `Mon 12`

### 示例 4: 英文缩写 (Jan, Feb, Mar, ...)
```typescript
monthLabel: (monthIndex: number) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex]
```
效果：`Jan`, `Feb`, `Mar`, ..., `Jul`, ..., `Dec`

### 示例 5: 中文月份 (一月, 二月, ...)
```typescript
monthLabel: (monthIndex: number) => `${monthIndex + 1}月`
```
效果：`1月`, `2月`, `3月`, ..., `7月`, ..., `12月`

### 示例 6: 带前缀的格式 (2026-01, 2026-02, ...)
```typescript
monthLabel: (monthIndex: number) => {
  const year = new Date().getFullYear(); // 或从其他地方获取年份
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}
```
效果：`2026-01`, `2026-02`, ..., `2026-07`, ..., `2026-12`

## 如何修改

1. 打开文件：`src/i18n/index.ts`
2. 找到对应语言的配置（`zhTW` 或 `en`）
3. 修改 `monthLabel` 函数
4. 重新编译项目

```typescript
// 修改前
monthLabel: (monthIndex: number) => `M${monthIndex + 1}`,

// 修改后（例如改成 Mon 格式）
monthLabel: (monthIndex: number) => `Mon ${monthIndex + 1}`,
```

## 参数说明

- `monthIndex`: 月份索引，范围 0-11
  - `0` = 一月 (January)
  - `1` = 二月 (February)
  - ...
  - `6` = 七月 (July)
  - ...
  - `11` = 十二月 (December)

- 返回值：字符串，将显示在月视图的时间轴上

## 注意事项

1. `monthLabel` 是可选参数，如果不提供，将使用 `monthNamesShort` 数组中的值
2. 月份索引从 0 开始，所以实际月份 = `monthIndex + 1`
3. 建议保持标签简短，避免在时间轴上显示拥挤
4. 如果需要访问完整的日期信息（如年份），可能需要在渲染层传递额外的上下文

## 相关文件

- 国际化配置：`src/i18n/index.ts`
- 日历组件：`src/components/calendar/calendar.tsx` (第 881-898 行)
- 类型定义：`src/types/public-types.ts`
