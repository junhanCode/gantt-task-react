# 月份格式自定义功能

## 🎯 一句话说明

在月视图中，您可以自定义月份显示格式，例如将 "7月" 改为 "M7" 或 "Mon 7"。

## 🚀 快速开始

### 步骤 1: 打开配置文件
打开文件：`src/i18n/index.ts`

### 步骤 2: 找到语言配置
找到 `zhTW` 或 `en` 配置部分

### 步骤 3: 修改 monthLabel
```typescript
const zhTW: I18nTexts = {
  // ...其他配置...
  
  // 修改这里，选择你想要的格式：
  monthLabel: (monthIndex: number) => `M${monthIndex + 1}`,  // M1, M2, M7, M12
  // monthLabel: (monthIndex: number) => `Mon ${monthIndex + 1}`,  // Mon 1, Mon 2, Mon 7
  // monthLabel: (monthIndex: number) => `${monthIndex + 1}月`,  // 1月, 2月, 7月
};
```

### 步骤 4: 重新编译
```bash
npm run build
```

### 步骤 5: 查看效果
切换到月视图，查看时间轴上的月份显示

## 📖 常用格式

| 格式代码 | 效果示例 | 说明 |
|---------|---------|------|
| `M${monthIndex + 1}` | M1, M2, M7, M12 | M + 数字 |
| `Mon ${monthIndex + 1}` | Mon 1, Mon 2, Mon 7 | Mon + 数字 |
| `${monthIndex + 1}` | 1, 2, 7, 12 | 纯数字 |
| `${monthIndex + 1}月` | 1月, 2月, 7月 | 中文月份 |

更多格式请查看：`docs/MONTH_LABEL_EXAMPLES.md`

## 📚 详细文档

| 文档 | 说明 |
|------|------|
| `MONTH_LABEL_QUICK_REF.md` | 快速参考（推荐） |
| `MONTH_LABEL_EXAMPLES.md` | 使用示例 |
| `MONTH_LABEL_CUSTOMIZATION.md` | 详细说明 |
| `MONTH_LABEL_CHANGELOG.md` | 修改记录 |

## ❓ 常见问题

**Q: monthIndex 是什么？**  
A: 月份索引，0-11，0代表1月，6代表7月，11代表12月

**Q: 修改后没生效？**  
A: 需要运行 `npm run build` 重新编译

**Q: 如何恢复默认？**  
A: 删除或注释掉 `monthLabel` 配置

## ⚙️ 技术细节

- **类型**: 可选函数 `(monthIndex: number) => string`
- **参数**: monthIndex (0-11)
- **返回**: 字符串，显示在时间轴
- **兼容**: 完全向后兼容

---

📅 更新时间：2026-02-08  
📦 适用版本：v0.3.9+
