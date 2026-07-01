import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  lang: 'zh',
  title: '葵花寶典',
  description: '业精于勤荒于嬉，行成于思毁于随',
  base: '/docs/',  // 若继续部署到 GitHub Pages 子路径
  icon: '/favicon.ico',
  logo: '/favicon.ico',
  logoText: '葵花寶典',
  themeConfig: {
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/xSeek-Neo' },
    ],
  },
  builderConfig: {
    server: {
      port: 5200,
      host: true,
    },
  },
});