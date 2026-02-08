# 新版 OA 任务甘特图演示

## 功能说明

已成功创建新的甘特图演示组件 `GanttChartDemo.tsx`，完整实现了您提供的代码功能：

### ✅ 主要功能

1. **三种视图模式**
   - 日视图（Day）
   - 周视图（Week）- 新增
   - 月视图（Month）

2. **视图模式同步**
   - OA 视图模式与 ViewMode 双向同步
   - 周模式时间轴显示优化（显示"X周"）

3. **列宽配置优化**
   - 日模式：35px
   - 周模式：80px
   - 月模式：100px
   - 年模式：100px

4. **级联选择功能**
   - 正向级联：选中父任务自动选中所有子任务
   - 反向级联：取消父任务自动取消所有子任务
   - 智能父任务选择：所有子任务选中时自动选中父任务

5. **任务拖拽权限控制**
   - 仅当 `proposer.employeeNo` 匹配当前用户时可拖动
   - 已完成状态的任务禁止拖动
   - 异步保存模拟（90%成功率）

6. **自定义渲染**
   - 任务标题列：支持 TitleCell 组件
   - 状态列：带颜色显示
   - 负责人列：支持溢出提示
   - 未读列：红色 * 标记

7. **时间轴自定义**
   - 周模式底部显示"X周"
   - 垂直居中对齐优化
   - `dominantBaseline="central"` 确保精准居中

8. **其他功能**
   - 全屏切换
   - 定位到今天
   - 选择下拉菜单（选择当前页、全选、反选、清空）
   - 标记全部已读按钮

## 文件结构

```
example/src/
├── App.tsx                      # 主应用（新增演示模式切换）
├── GanttChartDemo.tsx           # 新版 OA 任务甘特图（您的代码）
├── GanttChartDemo.module.scss   # 样式文件（您提供的样式）
└── components/
    └── TitleCell/
        └── TitleCell.tsx        # 任务标题单元格组件
```

## 使用方式

### 1. 查看演示

打开浏览器访问 http://localhost:3000

在顶部会看到"演示模式切换"面板：
- **新版 OA 任务模式（推荐）** - 您的新代码
- **原始完整演示** - 原有的完整功能演示

### 2. 代码示例

```tsx
import GanttChartDemo from './GanttChartDemo';

// 使用默认假数据
<GanttChartDemo />

// 或传入真实数据
<GanttChartDemo
  dataSource={yourData}
  onGanttSelect={(keys) => console.log('选中:', keys)}
  onRead={(record) => console.log('已读:', record)}
  // ... 其他回调
/>
```

## 假数据说明

组件内置了 `generateMockData()` 函数，自动生成：
- 10个父任务
- 随机子任务（0-3个）
- 4种状态：进行中、未开始、已延期、已完成
- 5个负责人：张三、李四、王五、赵六、何聪
- 随机延期天数
- 随机未读状态

## 核心代码亮点

### 1. 周模式时间轴显示

```tsx
timelineHeaderCellRender={({ date, defaultLabel, level, oaTaskViewMode }: any) => {
  return (
    <text
      x={0}
      y={0}
      textAnchor="middle"
      dominantBaseline="central" // 精准垂直居中
      style={{ 
        fontSize: 12, 
        fill: "#333",
        transform: oaTaskViewMode === "日" ? "translateY(1px)" : "translateY(30px)"
      }}
    >
      {oaTaskViewMode === "周" && level === "bottom" 
        ? `${dayjs(date).week()}周` 
        : defaultLabel
      }
    </text>
  );
}}
```

### 2. 双向级联选择

```tsx
const handleRowSelectionChange = (selectedKeys, selectedRows) => {
  // 1. 正向级联：父→子
  addedKeys.forEach((addedKey) => {
    const children = getAllChildren(addedKey);
    // 自动选中所有子任务
  });

  // 2. 反向级联：子→父
  const updateParentSelection = (keys) => {
    // 所有子任务选中时，自动选中父任务
    const allChildrenSelected = parentDirectChildren.every(
      child => updatedKeys.has(child.id)
    );
    if (allChildrenSelected) {
      updatedKeys.add(parentId);
    }
  };
};
```

### 3. 拖拽权限控制

```tsx
const isTaskDraggable = useCallback((task, action) => {
  if (action === "end") {
    // 检查状态
    if (task.status.description === "已完成") {
      return false;
    }
    // 检查权限
    const isProposerMatch = task.proposer.employeeNo === currentUser;
    return isProposerMatch;
  }
  return true;
}, [currentUser]);
```

## 样式说明

样式文件 `GanttChartDemo.module.scss` 包含：

- 全屏样式支持
- 表格边框统一为 #f0f0f0
- 复选框样式定制
- 未读标记样式
- 任务标题样式
- 下拉菜单图标定位

## 注意事项

1. **dayjs 插件**：已添加 `weekOfYear` 插件支持周数计算
2. **TitleCell 组件**：需要确保组件存在且正确导出
3. **类型安全**：部分地方使用了 `any` 类型，建议根据实际数据类型优化
4. **i18n 支持**：代码中预留了国际化注释，可根据需要接入 `react-i18next`

## 下一步优化建议

1. 接入真实 API 数据
2. 完善 TypeScript 类型定义
3. 接入国际化框架
4. 添加单元测试
5. 优化性能（大数据量时使用虚拟滚动）

## 问题排查

如果遇到问题：

1. **端口被占用**：确保 3000 端口空闲，或修改 `package.json` 中的端口
2. **样式不生效**：确认 SCSS 编译配置正确
3. **组件报错**：检查 TitleCell 组件路径是否正确
4. **时间轴错误**：确保 dayjs 的 weekOfYear 插件已加载

---

**创建时间**: 2026-02-08
**版本**: 1.0.0
