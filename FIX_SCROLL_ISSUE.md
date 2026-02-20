# 修复：快速左右滑动时间轴卡顿问题

## 问题描述
在demo中快速左右滑动时间轴时，有些时候会滑动不过去，有些时候又能滑动过去，就像卡在那里一样。

## 问题根本原因
`ignoreScrollEvent` 标志的管理逻辑存在缺陷：

### 原有逻辑问题：
1. **handleWheel** 函数在每次滚轮事件后**无条件**设置 `setIgnoreScrollEvent(true)`
2. **handleScrollX/handleScrollY** 函数检查这个标志，如果为 true 则跳过滚动处理
3. 这导致快速滚动时，某些滚动事件会被意外跳过

### 具体场景：
```
时间线：
1. 用户触发滚轮事件 A → handleWheel 设置 scrollX + setIgnoreScrollEvent(true)
2. DOM 滚动条触发 → handleScrollX 检测到 ignoreScrollEvent=true → 重置为 false，但不处理滚动
3. 用户快速触发滚轮事件 B → handleWheel 再次更新 scrollX + setIgnoreScrollEvent(true)
4. 如果事件 B 的 scrollX 值与上次相同，则不会触发状态更新
5. ignoreScrollEvent 保持为 true，导致后续滚动被阻塞
```

## 修复方案

### 修改 1: handleWheel 中只在实际更新时设置标志
**文件**: `src/components/gantt/gantt.tsx` (行 600-627)

```typescript
const handleWheel = (event: WheelEvent) => {
  if (event.shiftKey || event.deltaX) {
    const scrollMove = event.deltaX ? event.deltaX : event.deltaY;
    let newScrollX = scrollX + scrollMove;
    if (newScrollX < 0) {
      newScrollX = 0;
    } else if (newScrollX > svgWidth) {
      newScrollX = svgWidth;
    }
    // ✅ 修改：只有在实际更新 scrollX 时才设置标志
    if (newScrollX !== scrollX) {
      setScrollX(newScrollX);
      setIgnoreScrollEvent(true);
    }
    event.preventDefault();
  } else if (ganttHeight) {
    let newScrollY = scrollY + event.deltaY;
    if (newScrollY < 0) {
      newScrollY = 0;
    } else if (newScrollY > ganttFullHeight - ganttHeight) {
      newScrollY = ganttFullHeight - ganttHeight;
    }
    // ✅ 修改：只有在实际更新 scrollY 时才设置标志和阻止默认行为
    if (newScrollY !== scrollY) {
      setScrollY(newScrollY);
      setIgnoreScrollEvent(true);
      event.preventDefault();
    }
  }
};
```

**关键改进**：
- 水平滚动：只有当 `newScrollX !== scrollX` 时才设置标志
- 垂直滚动：只有当 `newScrollY !== scrollY` 时才设置标志和阻止默认行为
- 删除了无条件的 `setIgnoreScrollEvent(true)` 调用

### 修改 2: 添加自动重置标志的 useEffect
**文件**: `src/components/gantt/gantt.tsx` (行 647-656)

```typescript
// 当滚动位置更新后，重置 ignoreScrollEvent 标志
useEffect(() => {
  if (ignoreScrollEvent) {
    // 使用 setTimeout 确保 DOM 滚动已同步
    const timeoutId = setTimeout(() => {
      setIgnoreScrollEvent(false);
    }, 0);
    return () => clearTimeout(timeoutId);
  }
}, [scrollX, scrollY, ignoreScrollEvent]);
```

**关键改进**：
- 当 `scrollX` 或 `scrollY` 更新后，自动重置 `ignoreScrollEvent` 标志
- 使用 `setTimeout(..., 0)` 确保在下一个事件循环中执行，保证 DOM 更新已同步
- 避免了依赖下一次滚动事件来重置标志的不可靠方式

## 修复效果
1. ✅ 快速左右滑动时间轴不再卡顿
2. ✅ 滚动响应更加流畅和可预测
3. ✅ 消除了滚动事件丢失的问题
4. ✅ 水平和垂直滚动都得到改善

## 测试方法
1. 运行 `npm run build` 构建项目
2. 在 example 目录运行 `npm start` 启动demo
3. 快速左右滑动时间轴，验证滑动流畅性
4. 测试以下场景：
   - 快速左右拖动滚动条
   - 使用触控板/鼠标滚轮快速水平滚动
   - 在滚动边界（最左/最右）快速滑动
   - 混合垂直和水平滚动

## 技术细节
- **ignoreScrollEvent** 的作用：防止程序化滚动（setScrollX/setScrollY）触发 handleScrollX/handleScrollY，造成循环更新
- **修复策略**：将被动重置改为主动重置，确保标志及时清除
- **兼容性**：不影响现有功能，只是优化了滚动事件的处理时机

## 相关文件
- `src/components/gantt/gantt.tsx` - 主要修改文件
- `src/components/other/horizontal-scroll.tsx` - 水平滚动条组件
- `example/src/App.tsx` - demo应用

---
修复日期：2026-02-08
修复人：AI Assistant
