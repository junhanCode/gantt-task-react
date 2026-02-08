# 周标签格式修改 - 快速参考

## 🎯 修改内容

将周标签从"第2周"改为"Week 01"格式，并确保垂直居中。

## ✅ 显示效果

| 位置 | 修改前 | 修改后 |
|------|--------|--------|
| 日模式母表头 | 第1周, 第2周 | **Week 01, Week 02** |
| 周模式子表头 | 第1周, 第2周 | **Week 01, Week 02** |

## 📝 修改的文件

1. **`src/i18n/index.ts`** - 修改周标签格式
2. **`src/components/calendar/calendar.tsx`** - 修复垂直居中
3. **`src/components/calendar/calendar.module.css`** - 添加样式类

## 🎨 新增样式类

**`.calendarWeekLabelTop`** - 日模式母表头周标签（顶部的 Week 01）

```css
.calendarWeekLabelTop {
  fill: #555;                      /* 文字颜色 */
  font-size: 12px;                 /* 字体大小 */
  dominant-baseline: middle;       /* 垂直居中 */
}
```

## 🔧 如何自定义

### 改变周标签颜色
```css
/* 日模式母表头（顶部） */
.calendarWeekLabelTop {
  fill: #1890ff !important;
}

/* 周模式子表头（底部） */
.calendarWeekLabel {
  fill: #722ed1 !important;
}
```

### 改变字体大小
```css
.calendarWeekLabelTop {
  font-size: 14px !important;
  font-weight: 600 !important;
}
```

## 💡 其他格式

只需修改 `src/i18n/index.ts` 中的 `weekLabel` 函数：

```typescript
// Week 01（当前）
weekLabel: (weekNum: string) => `Week ${weekNum.padStart(2, '0')}`

// W01
weekLabel: (weekNum: string) => `W${weekNum.padStart(2, '0')}`

// Week 1（无前导零）
weekLabel: (weekNum: string) => `Week ${weekNum}`

// 第1周（原格式）
weekLabel: (weekNum: string) => `第${weekNum}周`
```

## ✅ 验证

```bash
npm run build
# ✅ 编译成功
```

## 📚 详细文档

查看 `WEEK_LABEL_FORMAT.md` 了解更多

---

**更新**: 2026-02-08  
**状态**: ✅ 完成
