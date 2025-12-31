#!/usr/bin/env sh
eval $(ssh-agent)

# 脚本出错立即退出
set -e

# 生成静态文件，目录为 vuepress-docs/.vuepress/dist
yarn run docs:build

mv docs/.vuepress/dist dist

# rm -rf docs/.vuepress/dist
