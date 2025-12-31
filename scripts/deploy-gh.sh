#!/usr/bin/env sh

# abort on errors
set -e
# 修复权限权限问题
ssh-add --apple-use-keychain ~/.ssh/id_rsa

# build
yarn run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

# if you are deploying to a custom domain
# echo 'blog.scott8013.cn' > CNAME

git init
git add .
git commit -am 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:xsSeek/docs.git main:main
#git remote remove docs
cd -