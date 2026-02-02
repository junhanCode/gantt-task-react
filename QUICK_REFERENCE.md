# 🚀 新功能快速参考

## 快速导航
- [自定义复选框颜色](#1-自定义复选框颜色)
- [时间规范化](#2-时间自动规范化)
- [任务标题按钮](#3-任务标题自定义按钮)

---

## 1️⃣ 自定义复选框颜色

### 一行代码搞定
```tsx
rowSelection={{ checkboxBorderColor: '#1890ff' }}
```

### 完整示例
```tsx
<Gantt
  tasks={tasks}
  rowSelection={{
    selectedRowKeys: selectedKeys,
    onChange: (keys) => setSelectedKeys(keys),
    checkboxBorderColor: '#1890ff',  // 👈 就是这里
  }}
/>
```

### 常用颜色
```tsx
checkboxBorderColor: '#1890ff'  // 蓝色
checkboxBorderColor: '#52c41a'  // 绿色
checkboxBorderColor: '#fa8c16'  // 橙色
checkboxBorderColor: '#f5222d'  // 红色
```

---

## 2️⃣ 时间自动规范化

### ✨ 无需配置，自动生效！

**效果：**
```tsx
// 你传入的
start: new Date('2024-01-15 14:30:00')
end:   new Date('2024-01-15 16:45:00')

// 自动变成
start: new Date('2024-01-15 00:00:00')  // 👈 当天开始
end:   new Date('2024-01-15 23:59:59')  // 👈 当天结束
```

**好处：**
- ✅ 条形图占据完整格子
- ✅ 显示更加直观
- ✅ 无需手动处理

---

## 3️⃣ 任务标题自定义按钮

### 基础用法
```tsx
<Gantt
  tasks={tasks}
  viewType="oaTask"
  onTaskTitleAction={(task) => {
    console.log('点击了:', task.name);
  }}
/>
```

### 自定义图标
```tsx
<Gantt
  tasks={tasks}
  viewType="oaTask"
  onTaskTitleAction={(task) => {
    // 调用接口
    fetch(`/api/tasks/${task.id}`)
      .then(res => res.json())
      .then(data => alert(JSON.stringify(data)));
  }}
  taskTitleActionIcon={
    <span style={{ color: '#1890ff' }}>ℹ️</span>
  }}
/>
```

### 常见用法
```tsx
// 显示详情
onTaskTitleAction={(task) => {
  showModal(task);
}}

// 调用接口
onTaskTitleAction={async (task) => {
  const res = await fetch(`/api/tasks/${task.id}`);
  const data = await res.json();
  console.log(data);
}}

// 打开新页面
onTaskTitleAction={(task) => {
  window.open(`/tasks/${task.id}`, '_blank');
}}
```

---

## 📝 完整示例

```tsx
import { Gantt, Task } from 'gantt-task-react';
import { useState } from 'react';
import 'gantt-task-react/dist/index.css';

function MyGanttChart() {
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      name: '任务1',
      start: new Date('2024-01-15'),
      end: new Date('2024-01-20'),
      progress: 30,
      type: 'task',
      status: '處理中',
    },
  ]);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  return (
    <Gantt
      tasks={tasks}
      viewType="oaTask"
      
      {/* 功能1: 自定义复选框颜色 */}
      rowSelection={{
        selectedRowKeys: selectedKeys,
        onChange: setSelectedKeys,
        checkboxBorderColor: '#1890ff',
      }}
      
      {/* 功能3: 任务标题按钮 */}
      onTaskTitleAction={(task) => {
        alert(`任务: ${task.name}`);
      }}
      taskTitleActionIcon={
        <span>ℹ️</span>
      }
    />
  );
}
```

---

## 🎨 样式自定义

### 复选框样式
```css
/* 自定义复选框大小 */
.gantt-task-list input[type="checkbox"] {
  width: 18px;
  height: 18px;
}
```

### 按钮样式
按钮会自动使用任务行的样式，你也可以通过图标自带的样式来控制：

```tsx
taskTitleActionIcon={
  <div style={{
    color: '#1890ff',
    fontSize: '16px',
    transition: 'all 0.3s',
  }}>
    🔍
  </div>
}
```

---

## 🐛 常见问题

### Q: 复选框颜色不生效？
**A:** 检查浏览器版本，需要 Chrome 93+ 或 Firefox 93+

### Q: 任务标题按钮不显示？
**A:** 确保设置了 `viewType="oaTask"`

### Q: 时间显示不正确？
**A:** 时间会自动规范化，这是正常行为

---

## 📚 更多文档

- 📖 [详细功能说明](./FEATURE_UPDATES.md)
- 💻 [使用示例和测试](./example/USAGE_EXAMPLES.md)
- 📝 [实现总结](./IMPLEMENTATION_SUMMARY.md)
- 📋 [更新日志](./CHANGELOG_NEW_FEATURES.md)

---

## 🔗 快速链接

| 功能 | 属性名 | 类型 | 必需 |
|------|--------|------|------|
| 复选框颜色 | `rowSelection.checkboxBorderColor` | `string` | ❌ |
| 时间规范化 | 无（自动） | - | - |
| 标题按钮 | `onTaskTitleAction` | `(task: Task) => void` | ❌ |
| 自定义图标 | `taskTitleActionIcon` | `React.ReactNode` | ❌ |

---

## 💡 小贴士

1. **复选框颜色** 建议使用主题色，保持视觉统一
2. **时间规范化** 是全局的，会影响所有任务显示
3. **标题按钮** 可以用来触发任何异步操作
4. 所有功能都是 **可选的**，不影响现有代码

---

## ✨ 开始使用

```bash
# 安装最新版本
npm install gantt-task-react@latest

# 或更新到最新版本
npm update gantt-task-react
```

祝你使用愉快！ 🎉
