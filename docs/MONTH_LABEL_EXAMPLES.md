# 月份格式自定义使用示例

## 基础使用

### 方式 1: 修改源码配置（推荐用于库开发者）

直接修改 `src/i18n/index.ts` 文件：

```typescript
const zhTW: I18nTexts = {
  // ...其他配置...
  
  // 修改这里的 monthLabel 函数
  monthLabel: (monthIndex: number) => `M${monthIndex + 1}`,
  // 或者改成其他格式：
  // monthLabel: (monthIndex: number) => `Mon ${monthIndex + 1}`,
  // monthLabel: (monthIndex: number) => `${monthIndex + 1}月`,
};
```

### 方式 2: 扩展国际化配置（推荐用于使用者）

如果你想在不修改库源码的情况下自定义月份格式，可以通过扩展国际化配置来实现：

```typescript
import { getI18nTexts, I18nTexts } from 'gantt-task-react';

// 获取默认配置
const defaultI18n = getI18nTexts('zh-TW');

// 扩展配置，自定义 monthLabel
const customI18n: I18nTexts = {
  ...defaultI18n,
  monthLabel: (monthIndex: number) => `Mon ${monthIndex + 1}`,
};

// 然后将 customI18n 传递给需要的组件
// 注意：当前版本 Gantt 组件接受 language 参数，未来可能会支持直接传递 i18n 对象
```

## 在 React 组件中使用

```tsx
import React from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

function App() {
  const [tasks, setTasks] = React.useState<Task[]>([
    // 你的任务数据
  ]);

  return (
    <Gantt
      tasks={tasks}
      viewMode={ViewMode.Month}
      viewType="oaTask"
      oaTaskViewMode="月"
      language="zh-TW"  // 使用中文，月份将显示为 M1, M2, ..., M7, ..., M12
      // 或
      // language="en"  // 使用英文，月份将显示为 Jan, Feb, ..., Jul, ..., Dec
    />
  );
}

export default App;
```

## 常见格式示例

### 1. M + 数字（M1, M2, M7, M12）
```typescript
monthLabel: (monthIndex: number) => `M${monthIndex + 1}`
```

### 2. Mon + 空格 + 数字（Mon 1, Mon 2, Mon 7, Mon 12）
```typescript
monthLabel: (monthIndex: number) => `Mon ${monthIndex + 1}`
```

### 3. 纯数字（1, 2, 7, 12）
```typescript
monthLabel: (monthIndex: number) => `${monthIndex + 1}`
```

### 4. 两位数格式（01, 02, 07, 12）
```typescript
monthLabel: (monthIndex: number) => String(monthIndex + 1).padStart(2, '0')
```

### 5. 中文月份（1月, 2月, 7月, 12月）
```typescript
monthLabel: (monthIndex: number) => `${monthIndex + 1}月`
```

### 6. 英文缩写（Jan, Feb, Jul, Dec）
```typescript
monthLabel: (monthIndex: number) => 
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex]
```

### 7. 英文全称（January, February, July, December）
```typescript
monthLabel: (monthIndex: number) => 
  ['January', 'February', 'March', 'April', 'May', 'June',
   'July', 'August', 'September', 'October', 'November', 'December'][monthIndex]
```

### 8. 自定义缩写（一, 二, 七, 十二）
```typescript
monthLabel: (monthIndex: number) => 
  ['一', '二', '三', '四', '五', '六',
   '七', '八', '九', '十', '十一', '十二'][monthIndex]
```

## 动态切换示例

```tsx
import React from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';

type MonthFormat = 'M' | 'Mon' | 'number' | 'chinese';

function App() {
  const [monthFormat, setMonthFormat] = React.useState<MonthFormat>('M');

  // 根据选择的格式更新配置
  React.useEffect(() => {
    // 这里需要修改 i18n 配置
    // 实际实现取决于你的应用架构
  }, [monthFormat]);

  return (
    <div>
      {/* 格式选择器 */}
      <div style={{ marginBottom: 16 }}>
        <label>月份格式：</label>
        <select 
          value={monthFormat} 
          onChange={(e) => setMonthFormat(e.target.value as MonthFormat)}
        >
          <option value="M">M1, M2, M7</option>
          <option value="Mon">Mon 1, Mon 2, Mon 7</option>
          <option value="number">1, 2, 7</option>
          <option value="chinese">1月, 2月, 7月</option>
        </select>
      </div>

      <Gantt
        tasks={tasks}
        viewMode={ViewMode.Month}
        viewType="oaTask"
        oaTaskViewMode="月"
        language="zh-TW"
      />
    </div>
  );
}
```

## 注意事项

1. **monthIndex 从 0 开始**：0 表示一月，6 表示七月，11 表示十二月
2. **字符串长度**：建议保持标签简短（3-8 个字符），避免时间轴显示拥挤
3. **国际化**：不同语言可以配置不同的格式
4. **向后兼容**：如果不提供 `monthLabel`，将使用 `monthNamesShort` 数组

## 调试技巧

如果月份格式没有生效，检查以下几点：

1. 确认已切换到月视图模式：`viewMode={ViewMode.Month}` 且 `oaTaskViewMode="月"`
2. 确认 `monthLabel` 函数返回的是字符串
3. 检查浏览器控制台是否有错误信息
4. 验证 `monthIndex` 参数是否在 0-11 范围内

## 性能考虑

`monthLabel` 函数会在渲染月视图时被调用多次（每个月一次），建议：

1. 保持函数简单快速
2. 避免复杂的计算或异步操作
3. 如果使用数组映射，可以将数组定义为常量以避免重复创建

```typescript
// 推荐：使用常量数组
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
monthLabel: (monthIndex: number) => MONTH_LABELS[monthIndex]

// 不推荐：每次都创建新数组
monthLabel: (monthIndex: number) => ['Jan', 'Feb', ...][monthIndex]
```
