# Git 指令常用

## 清空未 git add/git commit

```sh
git checkout .
```

## 1. 统计 git 提交次数: 所有人的所有提交次数，会展示所有的提交人 提交次数详情

```shell
git log | grep "^Author: 川建国 " | awk '{print $2}' | sort | uniq -c | sort -k1,1nr
```

## 2. 统计所有人的提交次数

```shell
git log | grep "^Author: " | awk '{print $2}' | sort | uniq -c | sort -k1,1nr
```

## 3. 统计时间内提交次数

```shell
git log --author=川建国 --since="2017-08-01" --until=2024-05-06 --no-merges | grep -e 'commit [a-zA-Z0-9]*' | wc -l
```

## 统计提交行数：根据 1 展示出详情，可以填入 username。将展示该用户增加行数，删减行数，剩余行数

```shell
git log --since=2020-01-01 --until=2021-05-06 --author="川建国" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }'
```

## 查看某个时间段提交

```shell
git log --author="username"  --after="2018-05-21 00:00:00" --before="2021-05-25 23:59:59"
```

## git pull 和 git fetch 的区别

git fetch 只是将远程仓库的变化下载下来，并没有和本地分支合并。

git pull 会将远程仓库的变化下载下来，并和当前分支合并。
[详解 Git pull 和 Git fetch 区别](https://blog.csdn.net/weixin_41975655/article/details/82887273)

## git rebase 和 git merge 的区别

git merge 和 git rebase 都是用于分支合并，关键在 commit 记录的处理上不同。

git merge 会新建一个新的 commit 对象，然后两个分支以前的 commit 记录都指向这个新 commit 记录。这种方法会
保留之前每个分支的 commit 历史。

git rebase 会先找到两个分支的第一个共同的 commit 祖先记录，然后将提取当前分支这之后的所有 commit 记录，然后
将这个 commit 记录添加到目标分支的最新提交后面。经过这个合并后，两个分支合并后的 commit 记录就变为了线性的记
录了

[git rebase 和 git merge 的区别](https://www.jianshu.com/p/f23f72251abc) [git rebase 和 git merge 的区别](https://blog.csdn.net/liuxiaoheng1992/article/details/79108233)

## .gitignore 无效解决方案

```.gitignore
.idea
log/
target/
*.iml
```

若没有生效，是因为 gitignore 只能忽略那些原来没有被 track 的文件，如果某些文件已经被纳入了版本管理中，则修改 .gitignore 是无效的。
解决方法是先把本地缓存删除，然后再提交。

```shell
git rm -r --cached .
git add .
git commit -m "update .gitignore"
git push -u origin master
```

```shell
[alias]
    hide = update-index --assume-unchanged
    unhide = update-index --no-assume-unchanged
    unhide-all = ! git ls-files -v | grep '^[a-z]' | cut -c3- | xargs git unhide --
    hidden = ! git ls-files -v | grep '^[a-z]' | cut -c3- //查看隐藏文件
git ls-files -v|grep '^h'
git config --assume-unchanged <file>
git update-index --no-assume-unchanged <file>
```

[.gitignore 不生效的解决办法](https://blog.csdn.net/michizong9406/article/details/83029675?utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.vipsorttest&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.vipsorttest)

::: warning
原因是.gitignore 只能忽略未被 track 的文件，而 git 有本地缓存
如果本地想忽略远程仓库存在的文件 可能无法实现
:::

## git add . vs git add \*

git add . 会把本地所有 untrack 的文件都加入暂存区，并且会根据.gitignore 做过滤，但是 git add \* 会忽略.gitignore 把任何文件都加入

## 自定义一个 git-commit-msg hook 判断用户提交文件是否包含某个文件拒绝提交

```ts
#!/usr/bin/env node
const execSync = require('child_process').execSync
const fs = require('fs')
// 判断COMMIT_EDITMSG 是否存在
if (fs.existsSync('.git/COMMIT_EDITMSG')) {
 // 读取用户填写提交信息
 const msg = fs.readFileSync('.git/COMMIT_EDITMSG', 'utf-8')
 console.log(`commit-msg: ${msg}`)
 try {
  // results 为获取本次提交文件名的字符串
  const results = execSync(`git diff --cached --name-only`, {
   encoding: 'utf-8',
  })
  if (
   results.indexOf('application-dev.yml') > -1 &&
   msg.indexOf('.yml') > -1
  ) {
   console.log('application-dev.yml 在用户的确认下提交到版本仓库。')
   process.exit(0)
  } else {
   console.log(
    `如果想要提交application-dev.yml文件\n
请在commit-msg中任意位置添加\n
".yml"\n
字样\n
表示你确定要提交application-dev.yml文件。
`
   )
   process.exit(1)
  }
 } catch (e) {
  console.log('e', error)
  process.exit(1)
 }
}
```

![使用强制策略的一个例子 可以实现一个update hooks]("https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-%E4%BD%BF%E7%94%A8%E5%BC%BA%E5%88%B6%E7%AD%96%E7%95%A5%E7%9A%84%E4%B8%80%E4%B8%AA%E4%BE%8B%E5%AD%90#_an_example_git_enforced_policy")

```shell
# 获取提交文件的名称数组
files_modified = `git diff-index --cached --name-only HEAD`.split("\n")

missed_revs = `git rev-list #{$oldrev}..#{$newrev}`.split("\n")

message = `git cat-file commit #{rev} | sed '1,/^$/d'`
```

## 配置代码提交前检查

### 01.安装husky

```shell
yarn add husky --save-dev
npm pkg set scripts.postinstall="husky install" // 会在package.json script 增加 postinstall: "husky install"
husky install // 执行一次 husky hooks 才会生效

npx husky add .husky/pre-commit "echo husky hooks is work"

git add .husky/pre-commit // 增加到暂存区
git commit -m "Keep calm and commit" // 提交到本地版本库
```

> husky install

![husky install](~@imgs/husky_install.png)

### 02. 安装lint-staged (检测暂存区代码质量)

```js
yarn add lint-staged --save-dev
npm pkg set scripts.lint-staged="lint-staged"
```

> package.json增加如下配置

```json
  "lint-staged": {
    "src/**/*.{ts,tsx,vue,js,jsx}": [
      "prettier --write",
      "eslint --fix",
      "git add -n"
    ]
  }
```

> lint-staged
>
![pre-commit-hooks](~@imgs/pre-commit-hooks.png)

> pre-commit

```shell
#!/usr/bin/env sh

yarn run lint-staged
```

### 03.安装commitLint

```shell
yarn add --save-dev @commitlint/config-conventional @commitlint/cli
echo "module.exports = { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js
```

### 04.根目录增加 commitlint.config.js

```ts
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'Feat',
        'Fix',
        'Docs',
        'Style',
        'Refactor',
        'Perf',
        'Test',
        'Build',
        'Ci',
        'Chore',
        'Revert',
      ],
    ],
    'type-case': [0, 'always', ['lower-case']],
    'type-empty': [2, 'never'],
    'scope-empty': [0, 'never'],
    'scope-case': [
      2,
      'always',
      [
        'lower-case',
        'upper-case',
        'camel-case',
        'kebab-case',
        'pascal-case',
        'sentence-case',
        'snake-case',
        'start-case',
      ],
    ],
    'subject-case': [
      0,
      'always',
      [
        'lower-case',
        'upper-case',
        'camel-case',
        'kebab-case',
        'pascal-case',
        'sentence-case',
        'snake-case',
        'start-case',
      ],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never'],
    'header-max-length': [2, 'always', 72],
  },
}
```

### 05.修改pre-commit

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
// 安装commitLint后 node_modules bin目录下 会自动生成一个commitlint的可执行命令
npx commitlint --edit
```

![commitLint](@imgs/commitLint.png)

### 06.交互式

```shell
yarn add commitizen cz-conventional-changelog  --save-dev
npm pkg set scripts.commit="git-cz"
```

```json
"config":{
 "commitizen":{
  "path":"cz-conventional-changelog"
 }
}
```

```sh
yarn commit
```

![commitLint](@imgs/commitizen.png)

> z-customizable 可以配置 cz-conventional-changelog不可以配置
> <https://github.com/leoforfree/cz-customizable>
> "lint": "eslint src --fix --ext .ts,.tsx.,.js,.vue"

[cz-customizable](https://shivarajbakale.com/react/setting-up-commitlint-commitizen/)

## 修改git commit history message

### 修改最近一次提交 commit-msg

```sh
# 修改最近提交的 commit 信息
git commit --amend --message="Update Commit Message" --author="川建国 <xxoo@outlook.com>"

# 仅修改 message 信息
git commit --amend --message="Update Commit Message"

# 仅修改 author 信息
git commit --amend --author="川建国 <xxoo@outlook.com>"

# 使用vim修改
git commit --amend

# i - 进入插入模式 wq!  - 退出并保存
```

### 修改历史提交 commit 的信息

:::
操作步骤:
:::

- git rebase -i 列出 commit 列表
- 找到需要修改的 commit 记录，把 pick 修改为 edit 或 e，:wq 保存退出
- 修改 commit 的具体信息git commit --amend，保存并继续下一条git rebase --continue，直到全部完成
- 中间也可跳过或退出git rebase (--skip | --abort)

```shell
# 列出 rebase 的 commit 列表，不包含 <commit id>
git rebase -i <commit id>
# 最近 3 条
git rebase -i HEAD~3
# 本地仓库没 push 到远程仓库的 commit 信息
git rebase -i
# 列出所有commit 记录 包括第一条
git rebase --interactive --root

# vi 下，找到需要修改的 commit 记录，```pick``` 修改为 ```edit``` 或 ```e```，```:wq``` 保存退出
# 重复执行如下命令直到完成
git commit --amend --message="Update Commit message" --author="川建国 <xxoo@outlook.com>"
git rebase --continue

# 中间也可跳过或退出 rebase 模式
git rebase --skip
git rebase --abort
```

### 批量修改历史 commit 信息 作者和邮箱

创建批量脚本changeCommit.sh：

```shell
cat changeCommit.sh


#!/bin/sh
git filter-branch -f --env-filter '

# 之前的邮箱
# OLD_EMAIL="zhenfeng.wang01@lkcoffee.com"
OLD_EMAIL="xxoo@outlook.com"
# 修改后的用户名
CORRECT_NAME="拜振华"
# 修改后的邮箱
CORRECT_EMAIL="ams9527@outlook.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```

执行脚本成功后，强制推送到远程服务器：

```shell
git push --force --tags origin 'refs/heads/*'
```

## Git Rebase

```shell
git rebase --onto HEAD HEAD main
```

## modify branch name

```sh
git branch -m 'main'
```

## git cherry-pick

[git cherry-pick](https://git-scm.com/docs/git-cherry-pick)

## git formate-patch

```shell
# 把start_commit - end_commit 之间的变更(包括start_commit和end_commit) 提取到patch.diff
git diff <start_commit> <end_commit> > patch.diff

# 不包括commit <start_commit>, 会生成多个 patch.diff 文件
git format-patch <start_commit>..<end_commit>

# 包括 commit <start_commit>, 会生成多个 patch.diff 文件
git format-patch <start_commit>^..<end_commit>

```

## Soft Hard Mixed Keep Merge

### Soft

- ①移动本地库HEAD指针

- 意思就是，回滚后，仅仅是把本地库的指针移动了，而暂存区和你本地的代码是没有做任何改变的。而你上次改动已提交committed到本地库的代码显示是绿色即未提交

### mixed

- ①移动本地库HEAD指针

- ②重置暂存区

- 意思就是，回滚后，不仅移动了本地库的指针，同时暂存区的东西也没了，意思就是你上次添加到暂存区的文件没了

### hard

- ①移动本地库HEAD指针

- ②重置暂存区

- ③重置工作区

- 意思就是，回滚后，本地代码就是你回退版本的代码

### keep

- ①移动本地库HEAD指针

- ②暂存区不变

- ③重置工作区

- 意思就是，回滚后，本地代码就是你回退版本的代码,而暂存区是没有做任何改变的。

```shell
git diff --cached commitHash # 比较暂存区与指commitHash的差异
git diff --cached commitHashA commitHashB # 比较commitHashA 和 commitHashB的差异
git restore --cached [index.ts] # 把暂存区的重新保存到本地
```
