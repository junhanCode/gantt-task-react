# 新功能使用示例

本文档展示如何在 Example 应用中使用新增的三个功能。

## 示例代码片段

在 `example/src/App.tsx` 中添加以下代码来测试新功能：

```tsx
import React, { useState } from "react";
import { Task, Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: '测试任务1',
      start: new Date('2024-01-15'),
      end: new Date('2024-01-20'),
      progress: 30,
      type: 'task',
      status: '處理中',
      assignee: '张三',
    },
    {
      id: '2',
      name: '测试任务2',
      start: new Date('2024-01-16'),
      end: new Date('2024-01-18'),
      progress: 60,
      type: 'task',
      status: '待驗收',
      assignee: '李四',
    },
  ]);

  // 功能1: 多选框状态
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>甘特图新功能测试</h1>
      
      {/* 显示选中的任务 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>已选中的任务: {selectedKeys.join(', ')}</h3>
      </div>

      <Gantt
        tasks={tasks}
        viewType="oaTask"
        
        // 功能1: 自定义多选框边框颜色
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (keys, rows) => {
            setSelectedKeys(keys);
            console.log('选中的任务:', rows);
          },
          checkboxBorderColor: '#1890ff', // 蓝色复选框
          showSelectAll: true,
        }}
        
        // 功能3: 自定义任务标题旁边的按钮
        onTaskTitleAction={(task) => {
          alert(`点击了任务: ${task.name}\n\n这里可以调用接口获取详情...`);
          // 实际使用时可以调用接口
          // fetch(`/api/tasks/${task.id}/details`)
          //   .then(res => res.json())
          //   .then(data => console.log(data));
        }}
        
        // 自定义图标（可选）
        taskTitleActionIcon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#1890ff">
            <circle cx="8" cy="8" r="2" />
            <path d="M8 2v4M8 10v4M2 8h4M10 8h4" stroke="#1890ff" strokeWidth="1.5"/>
          </svg>
        }
        
        // 功能2: 结束时间自动放到当天最右边（无需配置，自动生效）
        
        // 其他配置...
        onDateChange={(task) => {
          const updatedTasks = tasks.map(t => 
            t.id === task.id ? task : t
          );
          setTasks(updatedTasks);
        }}
      />
    </div>
  );
}

export default App;
```

## 测试步骤

### 测试功能1: 自定义多选框边框颜色

1. 启动应用: `cd example && npm start`
2. 查看任务列表左侧的复选框
3. 验证复选框颜色是否为蓝色 (#1890ff)
4. 点击复选框，查看控制台输出
5. 点击表头的全选复选框，验证全选/取消全选功能

### 测试功能2: 结束时间默认放到当天最右边

1. 查看甘特图中的任务条形图
2. 对于同一天开始和结束的任务，条形图应该占据完整的格子宽度
3. 创建一个新任务，设置开始和结束为同一天
4. 验证条形图是否显示完整

测试用例：
```tsx
{
  id: 'test-same-day',
  name: '同天任务',
  start: new Date('2024-01-15 14:30:00'),
  end: new Date('2024-01-15 16:45:00'),
  progress: 50,
  type: 'task',
}
```

预期结果：
- 开始时间会被规范化为 `2024-01-15 00:00:00`
- 结束时间会被规范化为 `2024-01-15 23:59:59`
- 条形图占据完整的一个格子

### 测试功能3: 自定义任务标题旁边的按钮

1. 查看任务列表中任务名称旁边是否有自定义图标
2. 点击图标，验证是否触发 `onTaskTitleAction` 回调
3. 查看弹出的提示信息或控制台输出
4. 可以修改 `taskTitleActionIcon` 查看不同的图标效果

## 高级用法

### 结合多个功能使用

```tsx
<Gantt
  tasks={tasks}
  viewType="oaTask"
  
  // 多选功能
  rowSelection={{
    selectedRowKeys: selectedKeys,
    onChange: (keys, rows) => {
      setSelectedKeys(keys);
    },
    checkboxBorderColor: '#52c41a', // 绿色
    getCheckboxProps: (record) => ({
      disabled: record.progress === 100, // 已完成的任务禁用选择
    }),
  }}
  
  // 自定义按钮功能
  onTaskTitleAction={(task) => {
    // 根据任务状态显示不同的操作
    if (task.status === '處理中') {
      // 调用接口更新进度
      updateTaskProgress(task.id);
    } else {
      // 显示任务详情
      showTaskDetails(task);
    }
  }}
  
  // 使用图标库（如 antd icons）
  taskTitleActionIcon={<InfoCircleOutlined style={{ color: '#1890ff' }} />}
/>
```

### 自定义复选框样式

除了边框颜色，还可以通过 CSS 进一步自定义复选框：

```css
/* 在你的样式文件中 */
.gantt-task-list input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.gantt-task-list input[type="checkbox"]:checked {
  background-color: #1890ff;
}
```

## 故障排查

### 问题1: 复选框颜色不生效

**原因**: 浏览器不支持 `accent-color` 属性

**解决方案**: 
- 升级浏览器到最新版本
- 或使用 CSS 自定义样式

### 问题2: 自定义按钮不显示

**原因**: `viewType` 不是 "oaTask"

**解决方案**: 
- 设置 `viewType="oaTask"`
- 或使用 `columnRenderers` 自定义列渲染

### 问题3: 时间显示不正确

**原因**: 时间规范化可能与预期不符

**解决方案**: 
- 检查传入的时间是否正确
- 时间会自动规范化为当天的 00:00:00 和 23:59:59
