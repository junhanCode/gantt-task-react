# 级联选择功能说明

## 🌲 功能概述

级联选择功能允许在选择父任务时自动选中其所有子任务，提供类似树形结构的选择体验，类似 Ant Design Tree 的行为。

## ✨ 主要特性

### 1. 向下级联（父 → 子）

**选中父任务时**：
- ✅ 自动选中所有直接子任务
- ✅ 递归选中所有后代任务（孙子任务、曾孙任务等）
- ✅ 无论层级多深，都会完全选中

**示例**：
```
父任务 (选中)
├── 子任务1 (自动选中)
│   ├── 孙任务1-1 (自动选中)
│   └── 孙任务1-2 (自动选中)
└── 子任务2 (自动选中)
    └── 孙任务2-1 (自动选中)
```

### 2. 向下取消（父 → 子）

**取消父任务时**：
- ✅ 自动取消所有直接子任务
- ✅ 递归取消所有后代任务
- ✅ 保证取消是完整的

**示例**：
```
父任务 (取消选中)
├── 子任务1 (自动取消)
│   ├── 孙任务1-1 (自动取消)
│   └── 孙任务1-2 (自动取消)
└── 子任务2 (自动取消)
    └── 孙任务2-1 (自动取消)
```

### 3. 向上级联（子 → 父）

**当所有子任务都被选中时**：
- ✅ 自动选中父任务
- ✅ 递归向上检查，多层级联
- ✅ 智能判断，只有所有子任务都选中才选中父任务

**示例**：
```
# 步骤1: 选中第一个子任务
父任务 (未选中)
├── 子任务1 (选中) ✓
└── 子任务2 (未选中)

# 步骤2: 选中第二个子任务
父任务 (自动选中) ✓
├── 子任务1 (选中) ✓
└── 子任务2 (选中) ✓
```

## 🎮 Demo 演示

### 启用级联选择

在 Demo 中，你可以通过以下方式控制级联选择：

1. **显示多选列** - 启用多选功能
2. **启用级联选择** - 开关级联行为

### 测试场景

#### 场景 1：选中有子任务的任务

1. 找到一个有子任务的父任务（通常显示为展开/折叠图标）
2. 点击父任务的复选框
3. 观察：所有子任务的复选框会自动被选中
4. 查看下方的"已选择：X 个任务"，数量会包含父任务和所有子任务

#### 场景 2：取消父任务

1. 点击父任务的复选框取消选中
2. 观察：所有子任务的复选框会自动取消选中
3. 选中数量会相应减少

#### 场景 3：逐个选中子任务

1. 不选父任务，先选中第一个子任务
2. 再选中第二个子任务
3. ...继续选中其他子任务
4. 当最后一个子任务被选中时，父任务会自动被选中

#### 场景 4：关闭级联选择

1. 取消"启用级联选择"复选框
2. 现在选中父任务时，子任务不会自动选中
3. 需要手动逐个选择

## 💻 代码实现

### 在项目中使用

级联选择功能已经集成在 Demo 中，核心逻辑包含：

1. **获取所有子任务（递归）**
```typescript
const getAllChildren = (parentId: string): Task[] => {
  const children: Task[] = [];
  const directChildren = tasks.filter(t => t.project === parentId);
  
  directChildren.forEach(child => {
    children.push(child);
    const grandChildren = getAllChildren(child.id);
    children.push(...grandChildren);
  });
  
  return children;
};
```

2. **向下级联**
```typescript
// 处理新增的任务 - 自动选中所有子任务
addedKeys.forEach(addedKey => {
  const children = getAllChildren(addedKey);
  const childrenKeys = children.map(c => c.id);
  childrenKeys.forEach(childKey => {
    if (!finalKeys.includes(childKey)) {
      finalKeys.push(childKey);
    }
  });
});
```

3. **向上级联**
```typescript
// 检查父任务 - 如果所有子任务都被选中，自动选中父任务
const checkAndSelectParents = (keys: string[]): string[] => {
  let resultKeys = [...keys];
  const keysSet = new Set(resultKeys);
  
  allParentIds.forEach(parentId => {
    if (keysSet.has(parentId)) return;
    
    const children = getDirectChildren(parentId);
    if (children.length === 0) return;
    
    const allChildrenSelected = children.every(child => 
      keysSet.has(child.id)
    );
    
    if (allChildrenSelected) {
      resultKeys.push(parentId);
      keysSet.add(parentId);
    }
  });
  
  return resultKeys;
};
```

### 自定义实现

如果你想在自己的项目中实现级联选择，可以参考 Demo 中的 `handleRowSelectionChange` 函数：

```typescript
const handleRowSelectionChange = (selectedKeys: string[], selectedRows: Task[]) => {
  // 如果未启用级联选择，直接设置
  if (!enableCascade) {
    setSelectedRowKeys(selectedKeys);
    return;
  }
  
  // 级联选择逻辑
  // 1. 找出新增和移除的keys
  // 2. 向下级联（选中/取消子任务）
  // 3. 向上级联（自动选中父任务）
  // 4. 设置最终的selectedRowKeys
};
```

## 📝 使用建议

### 何时启用级联选择

✅ **适合启用的场景**：
- 需要批量操作整个任务组
- 希望保持父子任务的一致性
- 用户通常会整体选择/操作任务树

❌ **不适合启用的场景**：
- 需要精确选择特定任务
- 父子任务需要独立操作
- 任务层级很深，级联会选中太多任务

### 最佳实践

1. **提供开关**
   - 让用户可以控制是否启用级联选择
   - Demo 中已经实现了这个功能

2. **清晰的提示**
   - 告诉用户级联选择已启用
   - 解释选择行为（如 Demo 中的提示文字）

3. **控制台日志**
   - 在开发时打印级联前后的选择状态
   - 方便调试和理解行为

4. **性能考虑**
   - 递归深度限制（Demo 中最多10层）
   - 避免无限循环

## ⚠️ 注意事项

1. **递归深度**
   - 当前实现限制最多10层递归
   - 防止意外的无限循环

2. **性能影响**
   - 任务数量很多时，级联计算可能较慢
   - 建议在大数据集时测试性能

3. **用户体验**
   - 级联选择可能会选中比预期更多的任务
   - 确保有清晰的视觉反馈

4. **与其他功能的配合**
   - 批量删除会删除所有选中的任务（包括级联选中的）
   - 注意提示用户将要操作的任务数量

## 🎯 示例场景

### 场景：批量更新项目状态

```typescript
// 用户想把整个项目组的所有任务都标记为"进行中"

// 1. 启用级联选择
setEnableCascade(true);

// 2. 选中项目根任务
// (级联选择会自动选中所有子任务)

// 3. 批量更新状态
const updateStatus = () => {
  const updatedTasks = tasks.map(t => 
    selectedRowKeys.includes(t.id)
      ? { ...t, status: "進行中" }
      : t
  );
  setTasks(updatedTasks);
};
```

### 场景：精确选择特定任务

```typescript
// 用户只想选择几个特定的任务，不需要级联

// 1. 关闭级联选择
setEnableCascade(false);

// 2. 手动选择需要的任务
// (不会自动选中子任务)

// 3. 执行批量操作
```

## 🔍 故障排查

### 问题 1：级联选择不工作

**检查**：
- 确认"启用级联选择"复选框已选中
- 查看控制台日志，确认逻辑执行

### 问题 2：选中了太多任务

**原因**：级联选择会自动选中所有子任务

**解决**：
- 关闭级联选择功能
- 或者只选择叶子任务（没有子任务的任务）

### 问题 3：父任务没有自动选中

**原因**：可能还有未选中的子任务

**检查**：
- 确保该父任务的**所有**直接子任务都已选中
- 查看控制台日志了解选择状态

## 📚 相关文档

- `MULTI_SELECT_COMPLETE.md` - 多选列完整文档
- `QUICK_START_MULTI_SELECT.md` - 快速开始指南
- `MULTI_SELECT_FEATURE.md` - 功能详细说明

## 🎉 总结

级联选择功能提供了强大的树形结构选择能力：

✅ **向下级联** - 选中父任务自动选中所有子任务
✅ **向上级联** - 所有子任务选中时自动选中父任务
✅ **可控开关** - 用户可以自由启用/禁用
✅ **智能判断** - 避免重复选择和无限循环

现在访问 http://localhost:3000 体验完整的级联选择功能！
