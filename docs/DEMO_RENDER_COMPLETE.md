# Demo 中 onRenderComplete 的演示说明

## 演示界面

在 Demo 应用的顶部，新增了一个**绿色面板**展示 `onRenderComplete` 事件的效果：

![渲染完成事件演示面板](./images/render-complete-demo.png)

### 面板功能

#### 1. **启用/禁用渲染完成回调**
- 复选框控制是否启用 `onRenderComplete` 回调
- 取消勾选后，事件将不再触发

#### 2. **渲染次数计数器**
- 实时显示 `onRenderComplete` 被触发的次数
- 每次图表完成渲染都会自动增加

#### 3. **最后渲染时间**
- 显示最近一次渲染完成的时间（格式：HH:MM:SS）
- 帮助了解渲染的即时性

#### 4. **提示信息**
- 说明哪些操作会触发渲染完成事件
- 提示查看浏览器控制台获取详细日志

### 触发渲染完成事件的操作

以下操作都会触发 `onRenderComplete` 事件，你可以在 Demo 中测试：

1. **切换视图模式** - 点击"日/周/月/年"按钮
2. **滚动图表** - 水平或垂直滚动
3. **加载数据** - 点击"重新加载数据"按钮
4. **滚动到特定日期** - 点击"滚动到今天"等按钮
5. **拖动任务** - 拖动任务条形图
6. **切换语言** - 点击"繁體中文/English"按钮

## 控制台日志

每次触发 `onRenderComplete` 时，都会在浏览器控制台输出详细信息：

```javascript
✅ Gantt 图表渲染完成！ {
  timestamp: "2026-02-07T10:30:45.123Z",
  taskCount: 1100,
  viewMode: "日",
  renderCount: 5
}
```

包含以下信息：
- **timestamp**: ISO 格式的时间戳
- **taskCount**: 当前任务总数
- **viewMode**: 当前视图模式（日/周/月/年）
- **renderCount**: 渲染次数

## 实际应用示例

### 在 Demo 中的实现

```tsx
// 状态管理
const [renderCount, setRenderCount] = React.useState(0);
const [lastRenderTime, setLastRenderTime] = React.useState<string>('');
const [enableRenderCallback, setEnableRenderCallback] = React.useState(true);

// 渲染完成回调
const handleRenderComplete = React.useCallback(() => {
  const now = new Date();
  const timestamp = now.toLocaleTimeString('zh-CN', { hour12: false });
  
  setRenderCount(prev => prev + 1);
  setLastRenderTime(timestamp);
  
  console.log('✅ Gantt 图表渲染完成！', {
    timestamp: now.toISOString(),
    taskCount: tasks.length,
    viewMode: oaTaskViewMode,
    renderCount: renderCount + 1,
  });
}, [tasks.length, oaTaskViewMode, renderCount]);

// 在 Gantt 组件中使用
<Gantt
  tasks={tasks}
  onRenderComplete={enableRenderCallback ? handleRenderComplete : undefined}
  // ... 其他属性
/>
```

## 如何测试

1. **启动 Demo 应用**
   ```bash
   cd example
   npm start
   ```

2. **打开浏览器控制台**
   - Chrome/Edge: `F12` 或 `Ctrl+Shift+I`
   - 切换到 Console 标签页

3. **观察面板变化**
   - 查看"渲染次数"和"最后渲染时间"
   - 尝试各种操作触发渲染事件

4. **查看控制台日志**
   - 每次渲染完成都会有详细日志
   - 包含时间戳、任务数量、视图模式等信息

## 实际应用场景演示

### 场景 1: 加载状态管理
Demo 中展示了如何使用渲染计数器来跟踪加载状态

### 场景 2: 性能监控
通过时间戳可以计算渲染耗时

### 场景 3: 自动化操作
首次渲染完成后可以自动滚动到特定日期

## 关闭演示面板

点击面板右上角的 `×` 按钮可以关闭演示面板，不影响功能正常使用。

---

**提示**：这个演示展示了 `onRenderComplete` 的基本用法和效果。在实际项目中，你可以根据需求扩展更多功能，如：
- 截图导出
- 数据统计
- 性能分析
- 状态同步
- 自动化测试
