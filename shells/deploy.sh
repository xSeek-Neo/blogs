#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY_REPO="xSeek-Neo/docs"
DEPLOY_BRANCH="main"
BUILD_DIR="dist"
SITE_URL="https://xseek-neo.github.io/docs/"

cd "$ROOT_DIR"

echo "→ Building site..."
pnpm build

if [ ! -d "$BUILD_DIR" ]; then
  echo "Error: $BUILD_DIR not found after build."
  exit 1
fi

cd "$BUILD_DIR"

rm -rf .git
git init -b "$DEPLOY_BRANCH"
git add .
git config user.email "${GIT_USER_EMAIL:-352671309@qq.com}"
git config user.name "${GIT_USER_NAME:-Ellis}"
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')"

TOKEN="${DEPLOY_TOKEN:-${GITHUB_TOKEN:-}}"

if [ -n "$TOKEN" ]; then
  REMOTE_URL="https://x-access-token:${TOKEN}@github.com/${DEPLOY_REPO}.git"
elif command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  REMOTE_URL="https://github.com/${DEPLOY_REPO}.git"
else
  REMOTE_URL="git@github.com:${DEPLOY_REPO}.git"
fi

git remote add origin "$REMOTE_URL"

echo "→ Pushing to github.com/${DEPLOY_REPO} (${DEPLOY_BRANCH})..."
git push -f origin "$DEPLOY_BRANCH"

echo "✓ Deployed to ${SITE_URL}"
