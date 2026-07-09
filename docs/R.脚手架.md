# TypeScript 脚手架（CLI）开发指南

从零构建一个 TypeScript 命令行工具，在本地调试，并发布到 npm 供他人通过 `npx` 使用。

---

## 1. 初始化项目

```bash
mkdir test-cli
cd test-cli
npm init -y
pnpm install commander inquirer fs-extra chalk ora
# 若模板放在远程 Git 仓库，再安装：
pnpm install download-git-repo
pnpm install -D typescript @types/node tsx
npx tsc --init
```

在 `package.json` 中配置 `bin` 字段与构建脚本：

```json
{
  "name": "test-cli",
  "version": "1.0.0",
  "bin": {
    "test-cli": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsx bin/index.ts"
  }
}
```

### `name`、`bin`、命令名的关系

三者职责不同，容易混淆：

| 字段           | 示例                | 作用                                                                  |
| -------------- | ------------------- | --------------------------------------------------------------------- |
| 项目目录名     | `test-cli/`         | 本地文件夹名，可随意取名，与 npm 无强制关联                           |
| `name`         | `"test-cli"`        | npm **包名**，全局唯一标识；`npm link` / `npm unlink -g` 都认这个名字 |
| `bin` 的 key   | `"test-cli"`        | 终端里输入的**命令名**，执行时运行 value 指向的文件                   |
| `bin` 的 value | `"./dist/index.js"` | 命令实际执行的入口文件（需先 `build` 生成）                           |

关系可以概括为：

```
项目目录 test-cli/          ← 只是放代码的文件夹
    └── package.json
          name: "test-cli"  ← npm 包名，link / unlink 用它
          bin: {
            "test-cli": "./dist/index.js"
          }
            ↑ 命令名          ↑ 执行这个文件
```

- `name` 和 `bin` 的 key **可以不同**。例如 `name` 写成 `@my-scope/test-cli`，`bin` 的 key 仍可设为 `testcli`，终端运行 `testcli` 即可。
- 本示例三者同名，只是为了好记；并非必须一致。

`tsconfig.json` 中开启输出目录：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

---

## 2. 编写入口文件

创建 `src/index.ts`：

```typescript
#!/usr/bin/env node

console.log('欢迎使用 test-cli 脚手架！')
```

入口文件首行的 `#!/usr/bin/env node`（Shebang）告诉操作系统用 `node` 执行编译后的 `dist/index.js`。使用 `/usr/bin/env node` 而非写死路径，可兼容 NVM 等不同安装方式。

---

## 3. 常用依赖

| 库 | 用途 |
| --- | --- |
| commander | 解析命令行指令与参数 |
| inquirer | 终端交互式问答 |
| fs-extra | 文件操作，拷贝**本地模板** |
| download-git-repo | 从 **远程 Git 仓库** 拉取模板 |
| chalk | 终端输出着色 |
| ora | Loading 动画 |

### 模板放在哪？决定用哪个库

脚手架的核心是「把模板落到用户目录」，模板来源不同，依赖也不同：

| 模板来源 | 做法 | 依赖 |
| -------- | ---- | ---- |
| 打包在 CLI 里（`templates/` 目录随 npm 发布） | `fs-extra.copy()` 拷到目标路径 | `fs-extra` |
| 放在 GitHub / GitLab 等远程仓库 | 先下载仓库，再处理文件 | `download-git-repo` 或 `degit` |

**本地模板**适合体积小、版本跟 CLI 强绑定的场景；改模板要重新发 CLI 包。

**远程 Git 模板**适合模板独立演进、体积大、或多套模板分仓库维护的场景；用户执行 CLI 时实时拉取（可指定 branch / tag）。

`download-git-repo` 示例：

```typescript
import download from 'download-git-repo'
import { promisify } from 'node:util'

const downloadRepo = promisify(download)

await downloadRepo('direct:https://github.com/user/template.git#main', 'my-app', {
  clone: true,
})
```

- 地址格式支持 `direct:https://...`、`github:user/repo#branch` 等。
- 需要用户机器上有 `git`（`clone: true` 时走 git clone）。

若只想拿文件、不要 `.git` 历史，可用更轻的 [`degit`](https://github.com/Rich-Harris/degit)（`npx degit user/repo my-app` 的同款逻辑）。

**结论：** 不是每个脚手架都需要 `download-git-repo`；模板在本地用 `fs-extra` 就够，模板在远程 Git 才需要它（或同类方案）。

---

## 4. 本地调试与 `npm link`

### 链接

开发时无需每次发布到 npm。先构建，再在项目根目录执行：

```bash
pnpm run build
npm link
```

`npm link` 会做两件事：

1. 在全局 `node_modules` 下为 `name`（`test-cli`）创建指向当前项目目录的软链接
2. 根据 `bin` 配置，在全局可执行路径（如 `~/.nvm/versions/node/.../bin/`）下创建名为 `test-cli` 的命令软链接，指向 `./dist/index.js`

因为是软链接，改源码后重新 `build`，终端再运行 `test-cli` 就会生效，无需重新 link。

开发阶段可直接用 `tsx` 跳过编译：

```bash
pnpm run dev
```

### 查看 link 状态

```bash
# 命令是否存在，以及软链接指向哪里
which test-cli
ls -l $(which test-cli)

# 查看全局已 link 的包
npm ls -g --depth=0
npm ls -g test-cli

# 解析软链接最终指向的本地目录
readlink -f $(which test-cli)
```

`ls -l` 输出若包含 `->`，说明是软链接。例如：

```text
/Users/x/.nvm/versions/node/v24.16.0/bin/test-cli -> ../lib/node_modules/test-cli/dist/index.js
```

表示全局命令 `test-cli` 最终执行的是当前 link 项目里的 `dist/index.js`。

### 取消链接

```bash
# 在项目根目录：断开全局 link（推荐）
npm unlink

# 在任意目录：按包名全局卸载
npm unlink -g test-cli
# 等价于
npm uninstall -g test-cli
```

验证是否清理干净：

```bash
which test-cli   # 无输出即已移除
```

### `unlink` 会删掉箭头后面的文件吗？

不会。`unlink` 或 `rm` 只删除符号链接本身（`bin/test-cli`），不会删除它指向的目标文件。

| 操作 | 结果 |
| ---- | ---- |
| `bin/test-cli` 软链接 | 被删除 |
| `lib/node_modules/.../dist/index.js` | **仍在** |
| 整个 `test-cli` 包目录 | **仍在** |

因此：

- 手动 `unlink $(which test-cli)` 只是拆掉 `bin/` 里的快捷方式，`lib/node_modules` 里的包还在。
- 要彻底清理，应使用 `npm unlink` 或 `npm uninstall -g test-cli`，会同时移除软链接和全局安装的包。
- 若直接删除 `dist/index.js` 或包目录，链接可能还在，但会变成**断链**，执行命令会报错。

---

## 5. 发布到 npm 与 `npx` 执行

本地 `npm link` 验证通过后，把包发布到 npm registry，其他人无需全局安装即可通过 `npx` 运行。

### 发布前检查

发布的是**构建产物**，不是 TypeScript 源码。确保 `dist/` 会随包一起上传：

```json
{
  "files": ["dist"],
  "scripts": {
    "prepublishOnly": "pnpm run build"
  }
}
```

- `files`：白名单，只把列出的目录/文件打进包里；未列入的（如 `src/`）不会发布。
- `prepublishOnly`：执行 `npm publish` 前自动构建，避免忘记 `build` 就发布空包。

登录并发布：

```bash
npm login          # 首次需要，按提示输入 npm 账号
npm publish        # 作用域包如 @u8/test-cli 需加 --access public
```

每次发新版本前记得改 `package.json` 里的 `version`，或用 `npm version patch` / `minor` / `major` 自动 bump 并打 git tag。

### `npx` 如何执行 CLI

用户安装 Node.js 后自带 `npx`（npm 7+ 已内置）。执行：

```bash
npx test-cli
# 作用域包
npx @u8/test-cli
```

`npx` 的流程大致如下：

```
npx test-cli
    ↓
从 npm registry 拉取 test-cli 包（或使用本地缓存）
    ↓
解压到临时目录（如 ~/.npm/_npx/...）
    ↓
读取 package.json 的 bin 字段，找到 "test-cli" → "./dist/index.js"
    ↓
用 node 执行 dist/index.js（依赖入口文件的 #!/usr/bin/env node）
```

与 `npm link` / 全局安装的对比：

| 方式 | 是否需要提前安装 | 命令留在 PATH | 典型场景 |
| ---- | ---------------- | ------------- | -------- |
| `npm link` | 开发者本地 link | 是（`which test-cli` 有输出） | 本地开发调试 |
| `npm i -g test-cli` | 需全局安装 | 是 | 高频使用的 CLI |
| `npx test-cli` | 不需要全局安装 | 否（一次性执行） | 脚手架、偶尔用的工具 |

`npx` 适合脚手架类工具：用户不必 `npm i -g`，直接 `npx your-cli my-project` 即可。

### 常用 `npx` 写法

```bash
# 最新版
npx test-cli

# 指定版本
npx test-cli@1.0.0

# 显式使用 latest tag
npx test-cli@latest

# 带参数传给 CLI（npx 参数与 CLI 参数用 -- 分隔，多数情况可省略）
npx test-cli init my-app
```

若本机已全局安装同名命令，`npx` 可能优先用全局版本；想强制拉远程最新包，可加：

```bash
npx --ignore-existing test-cli
```

### 与 `name`、`bin` 的对应关系

发布到 npm 后，规则与本地一致：

| 用户输入 | npm 查找 | 实际执行 |
| -------- | -------- | -------- |
| `npx test-cli` | `name`: `test-cli` | `bin["test-cli"]` → `dist/index.js` |
| `npx @u8/test-cli` | `name`: `@u8/test-cli` | 同上（`bin` 的 key 仍可以是 `test-cli`） |

`npx` 后面跟的是 **包名**（`name`），不是 `bin` 的 key。两者通常相同；若 `name` 为 `@u8/test-cli` 而 `bin` key 为 `testcli`，用户应执行 `npx @u8/test-cli`，终端里出现的命令名仍是 `testcli`。

### pnpm 等价命令

使用 pnpm 的环境可用 `dlx`（download and execute），行为类似 `npx`：

```bash
pnpm dlx test-cli
pnpm dlx test-cli@1.0.0
```

### 发布与执行的完整链路

```
开发机                          npm registry                    用户机器
────────                        ────────────                    ────────
pnpm build
npm publish  ──────────────►   test-cli@1.0.0 存盘
                                （含 dist/、package.json）
                                                                npx test-cli
                                                                    ↓
                                                                下载 → 执行 bin
```

验证发布是否成功：

```bash
# 查看 registry 上的包信息
npm view test-cli

# 在未 link 的环境或加 --ignore-existing 试跑
npx --ignore-existing test-cli
```
