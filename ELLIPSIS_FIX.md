# 任务名称省略号显示修复

## 问题描述
原本的任务列表使用 CSS `display: table` 模拟表格，导致任务名称超出时省略号显示不一致：
- 有些地方能正常显示省略号
- 有些地方无法显示省略号

## 解决方案
使用真正的 HTML `<table>` 元素替代 CSS 模拟表格，类似 Ant Design Table 的实现方式。

## 改动文件

### 1. `src/components/task-list/task-list-table.tsx`
- ✅ 从 `<div className={styles.taskListWrapper}>` 改为 `<table className={styles.taskListTable}>`
- ✅ 从 `<div className={styles.taskListTableRow}>` 改为 `<tr className={styles.taskListTableRow}>`
- ✅ 从 `<div className={styles.taskListCell}>` 改为 `<td className={styles.taskListCell}>`
- ✅ 添加 `<colgroup>` 定义列宽
- ✅ 使用 `<tbody>` 包裹行

### 2. `src/components/task-list/oa-task-list-table.tsx`
- ✅ 相同的 table 结构改造
- ✅ 保留了自定义渲染器和溢出处理逻辑

### 3. `src/components/task-list/task-list-table.module.css`
- ✅ `.taskListWrapper` → `.taskListTable`
- ✅ 移除 `display: table` 相关样式
- ✅ 添加 `max-width: 0` 让表格列宽固定生效
- ✅ 保留 `.taskListNameText` 的省略号样式

### 4. `src/components/task-item/task-item.tsx`
- ✅ SVG 文本溢出时自动截断并添加省略号
- ✅ 添加 `displayText` 状态管理截断后的文本
- ✅ 溢出时显示完整名称的 tooltip

### 5. `src/components/other/tooltip.tsx`
- ✅ 任务名称添加 `word-break` 和 `overflowWrap` 支持长文本换行

## 技术优势

### 使用真正的 HTML table 的好处：
1. **浏览器原生支持**：无需 CSS hack，省略号更可靠
2. **语义化**：更符合表格数据的语义
3. **可访问性**：屏幕阅读器能更好地理解表格结构
4. **固定列宽**：`<colgroup>` + `<col>` 让列宽控制更精确
5. **样式稳定**：不同浏览器表现更一致

### 省略号处理策略：
- **HTML 表格单元格**：使用标准的 CSS `text-overflow: ellipsis`
- **SVG 文本**：计算字符宽度并手动截断（SVG 不支持 CSS 省略号）
- **Tooltip**：长文本自动换行显示完整内容

## 测试结果
✅ 库构建成功
✅ 示例项目构建成功
✅ 所有任务名称超出时都能正确显示省略号

## 兼容性
- 完全向后兼容，API 没有变化
- 所有自定义样式、渲染器仍然有效
- 表格行为与之前完全一致
