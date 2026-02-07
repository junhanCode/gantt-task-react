# 时间轴国际化更新

## 更新内容

### 1. 悬浮日期格式变更

**日模式下悬浮提示格式**：
- **之前**：`2026年2月3日`
- **现在**：`2026/2/3`

### 2. 时间轴文本完整国际化

所有时间轴显示的文本都支持繁体中文和英文切换。

## 国际化对照表

### 周模式（日视图的母表头）

| 语言 | 显示格式 | 示例 |
|------|---------|------|
| 繁体中文 | `第X周` | 第01周, 第02周, 第52周 |
| English | `Week XX` | Week 01, Week 02, Week 52 |

**说明**：英文模式下周数会补零，如 `Week 02`

### 周视图模式（独立周视图）

| 语言 | 显示格式 | 示例 |
|------|---------|------|
| 繁体中文 | `第X周` | 第01周, 第02周 |
| English | `Week XX` | Week 01, Week 02 |

### 月模式

| 语言 | 月份显示 |
|------|---------|
| 繁体中文 | 1月, 2月, 3月, 4月, 5月, 6月, 7月, 8月, 9月, 10月, 11月, 12月 |
| English | Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec |

### 年模式（季度）

| 语言 | 季度显示 |
|------|---------|
| 繁体中文 | Q1, Q2, Q3, Q4 |
| English | Q1, Q2, Q3, Q4 |

**说明**：季度标签在两种语言下格式相同

## 实现细节

### I18n 接口扩展

在 `src/i18n/index.ts` 中添加了新的字段：

```typescript
export interface I18nTexts {
  // ... 其他字段
  
  // 月份名称
  monthNames: string[]; // 完整月份名称
  monthNamesShort: string[]; // 短月份名称
  
  // 季度标签
  quarterLabel: (quarter: number) => string;
}
```

### 繁体中文配置

```typescript
const zhTW: I18nTexts = {
  weekLabel: (weekNum: string) => `第${weekNum}周`,
  monthNames: ['一月', '二月', '三月', ...],
  monthNamesShort: ['1月', '2月', '3月', ...],
  quarterLabel: (quarter: number) => `Q${quarter}`,
};
```

### 英文配置

```typescript
const en: I18nTexts = {
  weekLabel: (weekNum: string) => `Week ${weekNum.padStart(2, '0')}`,
  monthNames: ['January', 'February', 'March', ...],
  monthNamesShort: ['Jan', 'Feb', 'Mar', ...],
  quarterLabel: (quarter: number) => `Q${quarter}`,
};
```

## Calendar 组件更新

### 周模式

```typescript
// 使用国际化文本
const weekLabel = i18n ? i18n.weekLabel(weekNum) : `第${weekNum}周`;
```

### 月模式

```typescript
// 使用国际化月份名称
const monthLabel = i18n 
  ? i18n.monthNamesShort[month]
  : getLocaleMonth(date, locale);
```

### 年模式（季度）

```typescript
// 使用国际化季度标签
const quarterLabel = i18n ? i18n.quarterLabel(quarter) : `Q${quarter}`;
```

## 使用示例

### 繁体中文

```tsx
<Gantt
  tasks={tasks}
  language="zh-TW"
  viewType="oaTask"
  oaTaskViewMode="周"
/>
```

显示效果：
- 母表头：2026
- 子表头：第01周, 第02周, 第03周...

### 英文

```tsx
<Gantt
  tasks={tasks}
  language="en"
  viewType="oaTask"
  oaTaskViewMode="周"
/>
```

显示效果：
- 母表头：2026
- 子表头：Week 01, Week 02, Week 03...

## 完整对比示例

### 日模式

| 项目 | 繁体中文 | English |
|------|---------|---------|
| 母表头 | 第01周, 第02周 | Week 01, Week 02 |
| 子表头 | 1, 2, 3, 4... | 1, 2, 3, 4... |
| 悬浮提示 | 2026/2/3 | 2026/2/3 |

### 周模式

| 项目 | 繁体中文 | English |
|------|---------|---------|
| 母表头 | 2026 | 2026 |
| 子表头 | 第01周, 第02周 | Week 01, Week 02 |

### 月模式

| 项目 | 繁体中文 | English |
|------|---------|---------|
| 母表头 | 2026 | 2026 |
| 子表头 | 1月, 2月, 3月 | Jan, Feb, Mar |

### 年模式

| 项目 | 繁体中文 | English |
|------|---------|---------|
| 母表头 | 2026 | 2026 |
| 子表头 | Q1, Q2, Q3, Q4 | Q1, Q2, Q3, Q4 |

## 向后兼容

- 如果没有传入 `language` 属性，默认使用繁体中文
- 如果没有传入 `i18n` 对象给 Calendar 组件，会使用原有的格式化逻辑
- 所有国际化都是可选的，不会影响现有代码

## 测试方法

1. 启动 Demo 应用
2. 点击"繁體中文"和"English"按钮切换语言
3. 切换不同视图模式（日/周/月/年）
4. 观察时间轴母表头和子表头的文本变化

## 注意事项

1. **周数补零**：英文模式下周数会自动补零（Week 02），但繁体中文保持原样（第2周）
2. **月份格式**：月模式使用短月份名称（Jan, Feb 等），完整月份名称保留用于其他场景
3. **季度格式**：两种语言的季度格式相同（Q1, Q2, Q3, Q4）
4. **年份显示**：年份在两种语言下都显示数字，不做翻译

## 文件变更

- `src/i18n/index.ts` - 添加月份和季度的国际化配置
- `src/components/calendar/calendar.tsx` - 更新周/月/年模式的文本显示逻辑
- `example/src/App.tsx` - 更新悬浮日期格式
