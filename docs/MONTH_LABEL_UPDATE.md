# 月份显示格式扩展功能

## 功能说明

本次更新为月视图模式添加了可扩展的月份显示格式功能。用户可以通过修改国际化配置来自定义月份在时间轴上的显示格式。

## 修改内容

### 1. 国际化配置 (`src/i18n/index.ts`)

#### 添加了新的配置项
```typescript
export interface I18nTexts {
  // ...其他配置...
  
  // 新增：月份标签函数（可自定义格式）
  monthLabel?: (monthIndex: number) => string;
}
```

#### 默认配置

**中文 (zh-TW)**
```typescript
monthLabel: (monthIndex: number) => `M${monthIndex + 1}`
// 效果：M1, M2, M3, ..., M7, ..., M12
```

**英文 (en)**
```typescript
monthLabel: (monthIndex: number) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex]
// 效果：Jan, Feb, Mar, ..., Jul, ..., Dec
```

### 2. 日历组件 (`src/components/calendar/calendar.tsx`)

修改了月份标签的渲染逻辑，优先使用 `monthLabel` 函数：

```typescript
const monthLabel = i18n?.monthLabel 
  ? i18n.monthLabel(month) 
  : (i18n ? i18n.monthNamesShort[month] : getLocaleMonth(date, locale));
```

### 3. 文档 (`docs/MONTH_LABEL_CUSTOMIZATION.md`)

创建了详细的月份格式自定义文档，包含：
- 默认配置说明
- 6 种自定义示例
- 修改方法
- 参数说明
- 注意事项

## 使用示例

### 示例 1: M + 数字格式（当前默认）
```typescript
monthLabel: (monthIndex: number) => `M${monthIndex + 1}`
```
**效果**：M1, M2, M3, M4, M5, M6, **M7**, M8, M9, M10, M11, M12

### 示例 2: Mon + 数字格式
```typescript
monthLabel: (monthIndex: number) => `Mon ${monthIndex + 1}`
```
**效果**：Mon 1, Mon 2, Mon 3, Mon 4, Mon 5, Mon 6, **Mon 7**, Mon 8, Mon 9, Mon 10, Mon 11, Mon 12

### 示例 3: 纯数字格式
```typescript
monthLabel: (monthIndex: number) => `${monthIndex + 1}`
```
**效果**：1, 2, 3, 4, 5, 6, **7**, 8, 9, 10, 11, 12

### 示例 4: 中文月份
```typescript
monthLabel: (monthIndex: number) => `${monthIndex + 1}月`
```
**效果**：1月, 2月, 3月, 4月, 5月, 6月, **7月**, 8月, 9月, 10月, 11月, 12月

## 扩展性

1. **类型安全**：`monthLabel` 是可选参数，向后兼容
2. **灵活配置**：支持任意自定义格式
3. **国际化支持**：每种语言可以有独立的格式
4. **回退机制**：如果不提供 `monthLabel`，会使用 `monthNamesShort` 数组

## 技术细节

- `monthIndex` 参数范围：0-11（0=一月，6=七月，11=十二月）
- 优先级：`monthLabel` > `monthNamesShort` > `getLocaleMonth`
- 显示位置：月视图子表头中央

## 测试建议

1. 切换到月视图模式
2. 检查时间轴上的月份显示格式
3. 测试中文和英文语言切换
4. 验证自定义格式是否正常显示

## 相关文件

- `src/i18n/index.ts` - 国际化配置
- `src/components/calendar/calendar.tsx` - 日历组件（第 881-898 行）
- `docs/MONTH_LABEL_CUSTOMIZATION.md` - 详细文档
- `src/types/public-types.ts` - 类型定义

## 向后兼容性

✅ 完全向后兼容，不会影响现有功能。如果不提供 `monthLabel`，将使用原有的 `monthNamesShort` 数组。
