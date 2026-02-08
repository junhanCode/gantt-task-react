# 月份格式扩展功能 - 修改总结

## 概述

本次更新为甘特图的月视图模式添加了灵活的月份显示格式自定义功能。用户可以通过修改国际化配置来自定义月份在时间轴上的显示格式，例如将"7月"改为"M7"或"Mon 7"等格式。

## 需求

- 原始需求：月模式下，"7月"要改成"Mon 7"
- 扩展需求：支持改成"M7"，并支持扩展自定义

## 实现方案

### 1. 添加可选的 `monthLabel` 函数

在 `I18nTexts` 接口中添加了可选的 `monthLabel` 函数，允许用户自定义月份标签的生成逻辑。

**优点**：
- 灵活性高，支持任意自定义格式
- 向后兼容，不影响现有功能
- 每种语言可以有独立的格式

### 2. 修改渲染逻辑

在日历组件中修改了月份标签的渲染逻辑，优先使用 `monthLabel` 函数，如果未定义则回退到 `monthNamesShort` 数组。

## 修改文件清单

### 核心代码修改

1. **src/i18n/index.ts**
   - 在 `I18nTexts` 接口中添加 `monthLabel?: (monthIndex: number) => string`
   - 为 `zhTW` 配置添加 `monthLabel: (monthIndex) => `M${monthIndex + 1}``（M1, M2, M7, M12）
   - 为 `en` 配置添加 `monthLabel: (monthIndex) => ['Jan', 'Feb', ...][monthIndex]`

2. **src/components/calendar/calendar.tsx**（第 881-898 行）
   - 修改月份标签的渲染逻辑，优先使用 `i18n.monthLabel`
   - 添加回退机制：`monthLabel` → `monthNamesShort` → `getLocaleMonth`

3. **src/index.tsx**
   - 导出 `getI18nTexts` 函数
   - 导出 `I18nTexts` 类型

### 文档文件

4. **docs/MONTH_LABEL_CUSTOMIZATION.md**
   - 详细的功能说明文档
   - 包含 6 种自定义示例
   - 参数说明和注意事项

5. **docs/MONTH_LABEL_UPDATE.md**
   - 本次更新的总结文档
   - 技术细节说明
   - 向后兼容性说明

6. **docs/MONTH_LABEL_EXAMPLES.md**
   - 实际使用示例代码
   - 8 种常见格式示例
   - React 组件中的使用方法
   - 调试技巧和性能考虑

7. **docs/MONTH_LABEL_SUMMARY.md**（本文件）
   - 完整的修改总结

## 代码变更对比

### I18nTexts 接口变更

```typescript
// 之前
export interface I18nTexts {
  // ...
  monthNames: string[];
  monthNamesShort: string[];
  quarterLabel: (quarter: number) => string;
}

// 之后
export interface I18nTexts {
  // ...
  monthNames: string[];
  monthNamesShort: string[];
  monthLabel?: (monthIndex: number) => string; // ✨ 新增
  quarterLabel: (quarter: number) => string;
}
```

### 中文配置变更

```typescript
// 之前
const zhTW: I18nTexts = {
  // ...
  monthNamesShort: ['1月', '2月', '3月', ..., '7月', ..., '12月'],
  quarterLabel: (quarter: number) => `Q${quarter}`,
};

// 之后
const zhTW: I18nTexts = {
  // ...
  monthNamesShort: ['1月', '2月', '3月', ..., '7月', ..., '12月'],
  monthLabel: (monthIndex: number) => `M${monthIndex + 1}`, // ✨ 新增
  quarterLabel: (quarter: number) => `Q${quarter}`,
};
```

### 日历组件渲染逻辑变更

```typescript
// 之前
if (isMonthStart) {
  const monthLabel = i18n ? i18n.monthNamesShort[month] : getLocaleMonth(date, locale);
  // ...
}

// 之后
if (isMonthStart) {
  const monthLabel = i18n?.monthLabel 
    ? i18n.monthLabel(month)  // ✨ 优先使用 monthLabel
    : (i18n ? i18n.monthNamesShort[month] : getLocaleMonth(date, locale));
  // ...
}
```

## 使用示例

### 默认效果（M + 数字）

```typescript
// src/i18n/index.ts
monthLabel: (monthIndex: number) => `M${monthIndex + 1}`
```
**显示效果**：M1, M2, M3, M4, M5, M6, **M7**, M8, M9, M10, M11, M12

### Mon + 数字格式

```typescript
// src/i18n/index.ts
monthLabel: (monthIndex: number) => `Mon ${monthIndex + 1}`
```
**显示效果**：Mon 1, Mon 2, Mon 3, Mon 4, Mon 5, Mon 6, **Mon 7**, Mon 8, Mon 9, Mon 10, Mon 11, Mon 12

### 其他格式

参见 `docs/MONTH_LABEL_EXAMPLES.md` 了解更多示例。

## 技术特性

### 类型安全
- `monthLabel` 是可选参数，TypeScript 会进行类型检查
- `monthIndex` 参数类型为 `number`，范围 0-11
- 返回值类型为 `string`

### 向后兼容
- 完全向后兼容，不会破坏现有功能
- 如果不提供 `monthLabel`，将使用原有的 `monthNamesShort` 数组
- 不需要修改现有代码即可正常工作

### 扩展性
- 支持任意自定义格式
- 每种语言可以有独立的格式配置
- 可以通过函数实现复杂的格式化逻辑

### 性能
- `monthLabel` 函数只在渲染时调用，不会影响性能
- 建议保持函数简单快速，避免复杂计算

## 测试建议

### 手动测试

1. **基本功能测试**
   - 切换到月视图模式（`viewMode="月"`）
   - 检查时间轴上的月份显示格式是否为"M1, M2, ..., M7, ..., M12"
   - 验证所有月份都显示正确

2. **语言切换测试**
   - 切换到中文（`language="zh-TW"`），验证显示"M1, M2, M7"等
   - 切换到英文（`language="en"`），验证显示"Jan, Feb, Jul"等

3. **自定义格式测试**
   - 修改 `monthLabel` 函数为不同格式
   - 验证显示结果符合预期

4. **回退机制测试**
   - 临时移除 `monthLabel` 配置
   - 验证是否正确使用 `monthNamesShort` 作为回退

### 单元测试（建议添加）

```typescript
// 测试 monthLabel 函数
describe('I18n monthLabel', () => {
  it('should format month as M1, M2, etc.', () => {
    const i18n = getI18nTexts('zh-TW');
    expect(i18n.monthLabel!(0)).toBe('M1');
    expect(i18n.monthLabel!(6)).toBe('M7');
    expect(i18n.monthLabel!(11)).toBe('M12');
  });

  it('should format month as Jan, Feb, etc. for English', () => {
    const i18n = getI18nTexts('en');
    expect(i18n.monthLabel!(0)).toBe('Jan');
    expect(i18n.monthLabel!(6)).toBe('Jul');
    expect(i18n.monthLabel!(11)).toBe('Dec');
  });
});
```

## 兼容性说明

### 浏览器兼容性
- 所有现代浏览器（Chrome, Firefox, Safari, Edge）
- IE11+（如果项目支持）

### TypeScript 版本
- TypeScript 3.8+
- 支持可选链操作符（`?.`）

### React 版本
- React 16.8+（使用 Hooks）
- React 17+
- React 18+

## 已知限制

1. **年份信息**：`monthLabel` 函数只接收月份索引（0-11），不包含年份信息。如果需要显示年份，需要在渲染层传递额外的上下文。

2. **动态切换**：当前实现不支持在运行时动态切换 `monthLabel` 格式，需要重新编译或重新渲染。

3. **标签长度**：建议保持标签简短（3-8 个字符），过长的标签可能导致显示拥挤。

## 未来改进建议

1. **支持自定义 i18n 对象**
   - 允许用户在 Gantt 组件中直接传递自定义的 `i18n` 对象
   - 不需要修改库源码即可自定义配置

2. **支持年份信息**
   - 修改 `monthLabel` 函数签名，添加年份参数
   - `monthLabel: (monthIndex: number, year: number) => string`

3. **添加更多预设格式**
   - 提供常用格式的预设配置
   - 用户可以通过配置项直接选择，无需自定义函数

4. **支持动态切换**
   - 支持在运行时动态切换月份格式
   - 不需要重新编译或重新渲染

## 相关资源

- **详细文档**：`docs/MONTH_LABEL_CUSTOMIZATION.md`
- **使用示例**：`docs/MONTH_LABEL_EXAMPLES.md`
- **更新说明**：`docs/MONTH_LABEL_UPDATE.md`
- **源码位置**：
  - 国际化配置：`src/i18n/index.ts`
  - 日历组件：`src/components/calendar/calendar.tsx`（第 881-898 行）
  - 导出配置：`src/index.tsx`

## 总结

本次更新成功实现了月份显示格式的可扩展功能，满足了用户的需求（将"7月"改为"M7"或"Mon 7"等格式），并提供了灵活的自定义能力。实现方式简洁、类型安全、向后兼容，为未来的扩展预留了空间。

---

**修改日期**：2026-02-08  
**修改人**：AI Assistant  
**版本**：v1.0.0
