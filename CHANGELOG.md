## 更新记录（自定义功能改造）

### 2026-02-02 - 新功能更新

#### 1. 多选列功能增强
- ✅ 添加 `checkboxBorderColor` 属性，支持自定义复选框边框颜色
- ✅ 支持级联选择：选中父任务自动选中所有子任务
- ✅ 支持向上级联：所有子任务选中时自动选中父任务
- ✅ 完整的批量操作支持

#### 2. 时间规范化
- ✅ 自动规范化同一天任务的时间
- ✅ 开始时间自动设为 00:00:00
- ✅ 结束时间自动设为 23:59:59
- ✅ 条形图占据完整格子，解决同一天任务不显示的问题

#### 3. 任务标题列增强
- ✅ 添加 `taskTitleHeaderRender` 属性，支持自定义表头渲染
- ✅ 支持在表头添加自定义按钮和图标
- ✅ 支持点击事件回调

#### 4. TitleCell 自定义渲染
- ✅ 丰富的任务名列渲染组件
- ✅ 支持未读标记、关注、跟进、延期等状态显示
- ✅ 支持项目标签、会议决议等特殊标记
- ✅ 完整的 Demo 演示

#### 相关文档
- 多选功能：[docs/MULTI_SELECT_GUIDE.md](./docs/MULTI_SELECT_GUIDE.md)
- 其他功能：[docs/FEATURE_GUIDES.md](./docs/FEATURE_GUIDES.md)

---

### 2025-09-16

- 新增 ViewMode：`DayShift`
  - 表头三层：
    - 第一层：日期（YYYY/M/D），按天分组
    - 第二层：星期（Sun/Mon/...），每天仅渲染一次并跨 4 列居中
    - 第三层：班次（D1 / D2 / N1 / N2），每列一个班次
  - 视觉规则：
    - 周日整天底色：红色（`calendarSunBg`）
    - 夜班 N1/N2：深灰底（`calendarShiftNightBg`）、白字（`calendarShiftNightText`）
    - 分隔线：
      - 三层之间横向分隔线 2 条（`calendarTopTick`）
      - 班次列底部区域垂直分隔线逐列绘制
      - 每天开始列（每 4 列）绘制贯穿三层的垂直分隔线，避免中层出现 4 条边框

- 日期范围与步进
  - `ganttDateRange` 与 `seedDates` 支持 `DayShift`：按天范围、6 小时步进（对应 4 个班次）

- 左侧任务列表扩展为 4 个时间列
  - 任务类型 `Task` 新增可选字段：`plannedStart`、`plannedEnd`、`actualStart`、`actualEnd`
  - 表头与表格渲染 4 列：计划开始、计划结束、实际开始、实际结束
  - 显示格式：统一为 `YYYY/M/D`（如：2025/8/25）
  - 可配置项（在 `Gantt` 组件传入）：
    - `nameColumnWidth?: string` 名称列列宽（默认使用 `listCellWidth`）
    - `timeColumnLabels?: { plannedStart?; plannedEnd?; actualStart?; actualEnd? }` 四列标题自定义
    - `timeColumnWidths?: { plannedStart?; plannedEnd?; actualStart?; actualEnd? }` 四列各自列宽（默认 `listCellWidth`）

- 示例（example）更新
  - `example/src/App.tsx`：传入 `nameColumnWidth`、`timeColumnLabels`、`timeColumnWidths` 展示四列时间与自定义标题/列宽
  - 示例引入保持使用 `gantt-task-react` 包（`file:..` 链接），避免 CRA 的越界导入报错

- 代码清理
  - 去除左侧列表中未使用的本地化日期缓存/`useMemo`，避免打包时的未使用代码告警

### 主要变更文件

- `src/types/public-types.ts`
- `src/helpers/date-helper.ts`
- `src/components/calendar/calendar.tsx`
- `src/components/calendar/calendar.module.css`
- `src/components/task-list/task-list-header.tsx`
- `src/components/task-list/task-list-table.tsx`
- `src/components/task-list/task-list.tsx`
- `src/components/gantt/gantt.tsx`
- `example/src/components/view-switcher.tsx`
- `example/src/App.tsx`

### 使用说明（片段）

```tsx
<Gantt
  tasks={tasks}
  viewMode={ViewMode.DayShift}
  listCellWidth="140px"
  nameColumnWidth="200px"
  timeColumnLabels={{
    plannedStart: "计划开始时间",
    plannedEnd: "计划结束时间",
    actualStart: "实际开始时间",
    actualEnd: "实际结束时间",
  }}
  timeColumnWidths={{
    plannedStart: "180px",
    plannedEnd: "180px",
    actualStart: "180px",
    actualEnd: "180px",
  }}
/>
```

备注：未提供计划/实际时间时，列表会回退显示 `start`/`end`。


