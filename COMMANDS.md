# 命令行使用指南

## 🚀 快速开始

### 安装依赖

```bash
# 安装主项目依赖
npm install

# 安装示例项目依赖
cd example
npm install
```

### 开发模式

```bash
# 启动主项目开发模式（监听文件变化）
npm start

# 启动示例项目开发模式
cd example
npm start
```

### 构建项目

```bash
# 构建主项目
npm run build

# 构建示例项目
cd example
npm run build
```

### 测试

```bash
# 运行测试
npm test

# 运行示例项目测试
cd example
npm test
```

## 📦 发布流程

### 1. 更新版本号

```bash
# 更新 package.json 中的版本号
npm version patch  # 补丁版本 (1.0.0 -> 1.0.1)
npm version minor  # 次版本 (1.0.0 -> 1.1.0)
npm version major  # 主版本 (1.0.0 -> 2.0.0)
```

### 2. 构建发布版本

```bash
# 构建生产版本
npm run build

# 验证构建结果
ls dist/
```

### 3. 发布到 npm

```bash
# 登录 npm
npm login

# 发布包
npm publish
```

## 🔧 开发工具

### 代码格式化

```bash
# 使用 Prettier 格式化代码
npx prettier --write "src/**/*.{ts,tsx,js,jsx}"

# 使用 ESLint 检查代码
npx eslint "src/**/*.{ts,tsx,js,jsx}"
```

### 类型检查

```bash
# 运行 TypeScript 类型检查
npx tsc --noEmit

# 检查示例项目类型
cd example
npx tsc --noEmit
```

## 🐛 调试

### 开发服务器

```bash
# 启动主项目开发服务器
npm start

# 启动示例项目开发服务器
cd example
npm start
```

### 构建调试

```bash
# 构建并查看详细信息
npm run build -- --verbose

# 构建示例项目
cd example
npm run build
```

## 📁 项目结构

```
gantt-task-react/
├── src/                    # 源代码
│   ├── components/         # React 组件
│   ├── types/             # TypeScript 类型定义
│   ├── helpers/           # 工具函数
│   └── index.tsx          # 入口文件
├── example/               # 示例项目
│   ├── src/              # 示例源代码
│   ├── public/           # 静态资源
│   └── package.json      # 示例项目配置
├── dist/                 # 构建输出
├── package.json          # 主项目配置
├── tsconfig.json         # TypeScript 配置
└── README.md            # 项目说明
```

## 🔍 常用命令

### 清理

```bash
# 清理 node_modules
rm -rf node_modules
rm -rf example/node_modules

# 重新安装依赖
npm install
cd example && npm install
```

### 查看包信息

```bash
# 查看包信息
npm info gantt-task-react

# 查看本地包信息
npm list gantt-task-react
```

### 链接本地包

```bash
# 在项目根目录创建全局链接
npm link

# 在示例项目中链接本地包
cd example
npm link gantt-task-react
```

## 🚨 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清理并重新构建
   rm -rf dist/
   npm run build
   ```

2. **类型错误**
   ```bash
   # 检查类型定义
   npx tsc --noEmit
   ```

3. **依赖冲突**
   ```bash
   # 清理并重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **示例项目无法启动**
   ```bash
   # 检查端口占用
   netstat -ano | findstr :3000
   
   # 使用不同端口启动
   cd example
   PORT=3001 npm start
   ```

### 调试技巧

1. **启用详细日志**
   ```bash
   # 启用详细构建日志
   DEBUG=* npm run build
   ```

2. **检查包大小**
   ```bash
   # 分析包大小
   npx bundle-analyzer dist/index.js
   ```

3. **性能分析**
   ```bash
   # 启动性能分析
   cd example
   npm start -- --analyze
   ```
