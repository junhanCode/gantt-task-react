# 更新日志 (Changelog)

## [未发布版本] - 2026-01-31

### 新增功能 (Added)

#### 1. 自定义多选框边框颜色
- 在 `rowSelection` 配置中新增 `checkboxBorderColor` 属性
- 支持自定义复选框的颜色，提升UI定制性
- 类型定义: `checkboxBorderColor?: string`
- 相关文件:
  - `src/types/public-types.ts`
  - `src/components/task-list/oa-task-list-header.tsx`
  - `src/components/task-list/oa-task-list-table.tsx`

#### 2. 结束时间默认放到当天最右边
- 修改时间计算逻辑，自动规范化任务时间
- 开始时间设置为当天的 00:00:00
- 结束时间设置为当天的 23:59:59
- 确保任务条形图在甘特图中占据完整的天数显示
- 相关文件:
  - `src/helpers/bar-helper.ts` (normalizeTimeForSameDay 函数)

#### 3. 支持自定义任务标题按钮
- 新增 `onTaskTitleAction` 回调，在任务标题旁边添加可点击的按钮/图标
- 新增 `taskTitleActionIcon` 属性，支持自定义按钮图标
- 点击按钮后可调用接口或执行自定义逻辑
- 类型定义:
  ```typescript
  onTaskTitleAction?: (task: Task) => void;
  taskTitleActionIcon?: React.ReactNode;
  ```
- 相关文件:
  - `src/types/public-types.ts`
  - `src/components/task-list/oa-task-list-table.tsx`
  - `src/components/gantt/gantt.tsx`

### 技术改进 (Improved)

- 优化了时间处理逻辑，统一规范化所有任务的开始和结束时间
- 改进了复选框的样式支持，使用 CSS `accent-color` 属性
- 增强了任务列表的交互性，支持更多的自定义操作

### 文档 (Documentation)

- 新增 `FEATURE_UPDATES.md` - 功能更新详细说明
- 新增 `example/USAGE_EXAMPLES.md` - 使用示例和测试指南
- 包含完整的 TypeScript 类型定义和使用示例

### 兼容性 (Compatibility)

- 完全向后兼容，不影响现有代码
- 所有新功能都是可选的
- 浏览器要求（`accent-color` 支持）:
  - Chrome 93+
  - Firefox 93+
  - Safari 15.4+
  - Edge 93+

### 使用示例

```tsx
import { Gantt, Task } from 'gantt-task-react';
import { useState } from 'react';

function App() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  
  return (
    <Gantt
      tasks={tasks}
      viewType="oaTask"
      
      // 功能1: 自定义多选框颜色
      rowSelection={{
        selectedRowKeys: selectedKeys,
        onChange: setSelectedKeys,
        checkboxBorderColor: '#1890ff',
      }}
      
      // 功能3: 任务标题按钮
      onTaskTitleAction={(task) => {
        console.log('点击任务:', task);
        // 调用接口...
      }}
      taskTitleActionIcon={<YourCustomIcon />}
    />
  );
}
```

---

## 之前的版本

查看 [package.json](./package.json) 了解当前版本信息。
