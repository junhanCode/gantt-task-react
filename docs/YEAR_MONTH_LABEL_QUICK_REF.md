# 周模式年月标签格式 - 快速参考

## 🎯 功能

在周模式下，自定义母表头的"年月"显示格式。

## ✅ 显示效果

| 语言 | 修改前 | 修改后 |
|------|--------|--------|
| 中文 | 2026 一月 | **2026 11Mon** |
| 英文 | 2026 January | **2026 11Jan** |

## 🔧 如何修改

**文件**: `src/i18n/index.ts`

```typescript
const zhTW: I18nTexts = {
  // ...
  yearMonthLabel: (year, monthIndex) => 
    `${year} ${String(monthIndex + 1).padStart(2, '0')}Mon`,
};
```

## 📝 常用格式

```typescript
// 2026 11Mon（当前）
yearMonthLabel: (year, m) => `${year} ${String(m + 1).padStart(2, '0')}Mon`

// 2026 11M
yearMonthLabel: (year, m) => `${year} ${String(m + 1).padStart(2, '0')}M`

// 2026-11
yearMonthLabel: (year, m) => `${year}-${String(m + 1).padStart(2, '0')}`

// 2026/11
yearMonthLabel: (year, m) => `${year}/${String(m + 1).padStart(2, '0')}`

// 2026.11
yearMonthLabel: (year, m) => `${year}.${String(m + 1).padStart(2, '0')}`

// 2026 一月（原格式）
yearMonthLabel: (year, m) => {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月',
                  '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return `${year} ${months[m]}`;
}
```

## 💡 参数说明

| 参数 | 类型 | 说明 | 范围 |
|------|------|------|------|
| year | number | 年份 | 如 2026 |
| monthIndex | number | 月份索引 | 0-11（0=1月，10=11月） |

## 📊 示例

```typescript
// 调用
yearMonthLabel(2026, 0)   // 1月
yearMonthLabel(2026, 10)  // 11月

// 输出（2026 11Mon 格式）
"2026 01Mon"
"2026 11Mon"
```

## ✅ 验证

```bash
npm run build
# ✅ 编译成功
```

## 📚 详细文档

查看 `YEAR_MONTH_LABEL_FORMAT.md` 了解更多格式和示例

---

**更新**: 2026-02-08  
**状态**: ✅ 完成
