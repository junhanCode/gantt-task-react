# 月份格式功能 - 快速参考

## 🎯 功能概述

在月视图模式下，时间轴上的月份显示格式支持自定义。默认格式为 **M1, M2, ..., M7, ..., M12**。

## 📦 默认配置

| 语言 | 默认格式 | 7月显示为 |
|------|---------|----------|
| 中文 (zh-TW) | `M${monthIndex + 1}` | **M7** |
| 英文 (en) | 英文缩写 | **Jul** |

## 🔧 如何修改

### 方法 1: 修改配置文件（推荐）

**文件位置**: `src/i18n/index.ts`

```typescript
const zhTW: I18nTexts = {
  // ...
  monthLabel: (monthIndex: number) => `M${monthIndex + 1}`,
  // 修改这里 ↑
};
```

### 方法 2: 快速格式切换

只需要修改一行代码，即可切换不同格式：

```typescript
// 格式 1: M + 数字 (M1, M2, M7, M12)
monthLabel: (monthIndex: number) => `M${monthIndex + 1}`

// 格式 2: Mon + 数字 (Mon 1, Mon 2, Mon 7, Mon 12)
monthLabel: (monthIndex: number) => `Mon ${monthIndex + 1}`

// 格式 3: 纯数字 (1, 2, 7, 12)
monthLabel: (monthIndex: number) => `${monthIndex + 1}`

// 格式 4: 中文 (1月, 2月, 7月, 12月)
monthLabel: (monthIndex: number) => `${monthIndex + 1}月`

// 格式 5: 英文缩写 (Jan, Feb, Jul, Dec)
monthLabel: (monthIndex: number) => 
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex]
```

## 📋 参数说明

- **monthIndex**: 月份索引 (0-11)
  - 0 = 一月, 6 = 七月, 11 = 十二月
- **返回值**: 字符串，显示在时间轴上

## ⚠️ 注意事项

1. ✅ monthIndex 从 0 开始（0=1月，6=7月）
2. ✅ 建议标签长度 3-8 个字符
3. ✅ 完全向后兼容，可选功能
4. ✅ 支持任意自定义格式

## 🚀 快速测试

1. 修改 `src/i18n/index.ts` 中的 `monthLabel` 函数
2. 运行 `npm run build` 重新编译
3. 切换到月视图模式查看效果
4. 检查时间轴上的月份显示

## 📚 相关文档

- **详细说明**: `docs/MONTH_LABEL_CUSTOMIZATION.md`
- **使用示例**: `docs/MONTH_LABEL_EXAMPLES.md`
- **完整总结**: `docs/MONTH_LABEL_SUMMARY.md`

## 💡 常见问题

**Q: 如何显示 "Mon 7" 格式？**  
A: 修改为 `monthLabel: (monthIndex) => `Mon ${monthIndex + 1}``

**Q: 如何显示 "7月" 格式？**  
A: 修改为 `monthLabel: (monthIndex) => `${monthIndex + 1}月``

**Q: 修改后没有生效？**  
A: 需要重新编译 (`npm run build`) 并刷新页面

**Q: 如何恢复默认？**  
A: 删除或注释掉 `monthLabel` 配置即可

## 🎨 效果预览

```
月视图时间轴示例：

格式: M + 数字
┌────┬────┬────┬────┬────┬────┬────┬────┬────┬─────┬─────┬─────┐
│ M1 │ M2 │ M3 │ M4 │ M5 │ M6 │ M7 │ M8 │ M9 │ M10 │ M11 │ M12 │
└────┴────┴────┴────┴────┴────┴────┴────┴────┴─────┴─────┴─────┘

格式: Mon + 数字
┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬───────┬───────┬───────┐
│Mon 1 │Mon 2 │Mon 3 │Mon 4 │Mon 5 │Mon 6 │Mon 7 │Mon 8 │Mon 9 │Mon 10 │Mon 11 │Mon 12 │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴───────┴───────┴───────┘

格式: 英文缩写
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Jan │ Feb │ Mar │ Apr │ May │ Jun │ Jul │ Aug │ Sep │ Oct │ Nov │ Dec │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

---

**更新日期**: 2026-02-08  
**适用版本**: v0.3.9+
