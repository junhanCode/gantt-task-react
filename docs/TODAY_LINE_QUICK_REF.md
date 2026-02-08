# 今天纵轴线 - 快速参考

## 🎯 功能

支持自定义当前时间纵轴线宽度，默认 1px，不穿过表头。

## ✅ 使用

```tsx
<Gantt
  tasks={tasks}
  viewType="oaTask"
  todayLineWidth={1}  // 默认 1px
/>
```

## 📝 自定义宽度

```tsx
todayLineWidth={1}  // 细线（默认）
todayLineWidth={2}  // 标准线
todayLineWidth={3}  // 粗线
todayLineWidth={5}  // 强调线
```

## 📊 效果

```
时间轴表头（独立SVG）
┌──────────────┐
│   表头内容    │
└──────────────┘

任务区域（独立SVG）
┌──────────────┐
│      ║       │ ← 当前时间线（1px）
│ 任务 ║       │   从这里开始，不穿过表头
└──────║───────┘
```

## 💡 为什么不穿过表头？

Calendar 和 Grid 在**两个独立的 SVG** 中：
- Calendar SVG = 表头
- Grid SVG = 任务区域 + 当前时间线

## ⚠️ 注意

- 仅在 `viewType="oaTask"` 时生效
- 推荐范围: 1-5px

---

**默认**: 1px  
**状态**: ✅ 完成
