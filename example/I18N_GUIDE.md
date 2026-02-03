# 国际化标注指南

本文档标注了 demo 中需要国际化的文字位置，便于后续接入 i18n（如 react-i18next、react-intl 等）。

## 一、表头（通过 Gantt 组件 props 传入）

| 位置 | 当前文案 | 说明 |
|------|----------|------|
| `rowSelection.columnTitle` | "全选" | 多选列表头 |
| `columnHeaderRenderers.status` | defaultLabel: "狀態" | 状态列表头 |
| `columnHeaderRenderers.assignee` | defaultLabel: "負責人" | 负责人列表头 |
| `columnHeaderRenderers.operations` | defaultLabel: "操作" | 操作列表头 |
| `taskTitleHeaderRender` | titleText: "任務標題" | 任务标题列表头 |
| `unreadColumn.title` | " " | 未读列表头 |
| `operationsColumnLabel` | "操作" | 操作列标签 |
| `timeColumnLabels` | plannedStart, plannedEnd 等 | 时间列标题 |

**文件**: `example/src/App.tsx`，Gantt 组件 props 区域

---

## 二、库内部默认文案（需通过 props 覆盖）

| 位置 | 当前文案 | 覆盖方式 |
|------|----------|----------|
| `oa-task-list-header.tsx` | "任務標題"、"狀態"、"負責人"、"操作"、"選擇"、"未读" | 使用 `columnHeaderRenderers`、`rowSelection.columnTitle`、`unreadColumn.title` 等 |
| `oa-bar-display.tsx` | "延期{delayDays}天" | 暂无 prop，需库支持 `delayDaysFormat?: (days: number) => string` |

---

## 三、TitleCell 组件

| 位置 | 当前文案 | 文件 |
|------|----------|------|
| 延期标记 | "延期 {record.delayDays} 天" | `example/src/components/TitleCell/TitleCell.tsx` |
| 暂停标记 | "暂停 {record.suspendDays} 天" | 同上 |

---

## 四、App.tsx 中的 UI 文案

| 类型 | 文案示例 | 说明 |
|------|----------|------|
| 弹框标题 | "新增子任务"、"编辑任务" | AddTaskModal、EditTaskModal |
| 表单标签 | "任务名称"、"任务类型"、"计划开始"、"计划结束"等 | Form.Item label |
| 按钮/操作 | "确定"、"取消"、"编辑"、"新增子任务"、"删除" | 按钮文案 |
| 提示信息 | "已加载 X 个任务"、"请先选择要删除的任务"、"确定要删除..." | alert、Modal |
| 功能说明区 | "已选择：X 个任务"、"批量删除"、"全选"等 | 新功能展示说明区域 |

---

## 五、时间轴 timelineHeaderCellRender

| 位置 | 当前格式 | 说明 |
|------|----------|------|
| 日期格式 | `${date.getDate()}日` | 如 "5日" |
| 周格式 | defaultLabel 如 "第X周" | 顶层表头 |

---

## 六、单位类文案

| 文案 | 用途 |
|------|------|
| "天" | 延期X天、暂停X天、时长单位 |
| "日" | 时间轴日期后缀（5日、6日） |
| "周" | 第X周 |

---

## 建议接入步骤

1. 安装 i18n 库（如 `react-i18next`）
2. 创建语言包（zh、en 等）
3. 在 App 根组件包裹 `I18nextProvider`
4. 用 `useTranslation()` 的 `t()` 替换上述文案
5. 库内部文案通过 Gantt props 传入翻译后的字符串
