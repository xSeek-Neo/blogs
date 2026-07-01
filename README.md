# 葵花寶典

基于 [Rspress](https://rspress.rs/) 2.x 构建的个人技术笔记站点，内容涵盖前端、浏览器、性能优化等主题。

线上地址：<https://xseek-neo.github.io/docs/>

## 环境要求

- Node.js >= 24（推荐使用 `.nvmrc` 中的版本）
- [pnpm](https://pnpm.io/) 10+（项目通过 `packageManager` 字段锁定版本，推荐启用 [Corepack](https://nodejs.org/api/corepack.html)：`corepack enable`）

## 快速开始

安装依赖：

```bash
pnpm install
```

启动开发服务器（默认端口 `5200`）：

```bash
pnpm dev
```

构建生产版本：

```bash
pnpm build
```

本地预览构建产物：

```bash
pnpm preview
```

## 代码质量

```bash
pnpm lint          # 检查代码
pnpm lint:fix      # 自动修复 lint 问题
pnpm format        # 格式化代码
pnpm format:check  # 检查格式（CI 用）
```

## 部署

推送到 `main` 分支后，GitHub Actions 会自动构建并部署到 [xSeek-Neo/docs](https://github.com/xSeek-Neo/docs) 仓库。

也可在本地手动部署（需配置 `GITHUB_TOKEN` 或 `DEPLOY_TOKEN`，或已登录 `gh` CLI）：

```bash
pnpm deploy
```

## 项目结构

```text
├── docs/              # 文档内容
│   └── public/        # 静态资源
├── theme/             # 自定义主题（首页、登录等）
├── scripts/deploy.sh  # 本地部署脚本
└── rspress.config.ts  # Rspress 配置
```

## 其他命令

```bash
pnpm clean:cache   # 清理 Rspack / Rspress 构建缓存
```
