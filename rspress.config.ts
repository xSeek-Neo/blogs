import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  outDir: 'dist',
  lang: 'zh',
  title: '葵花寶典',
  description: '业精于勤荒于嬉，行成于思毁于随',
  base: '/docs/', // 若继续部署到 GitHub Pages 子路径
  icon: '/favicon.ico',
  logo: '/favicon.ico',
  logoText: '葵花寶典',
  head: [
    [
      'meta',
      {
        name: 'robots',
        content: 'noindex, nofollow, noarchive, nosnippet',
      },
    ],
    ['meta', { name: 'googlebot', content: 'noindex, nofollow' }],
  ],
  themeConfig: {
    socialLinks: [{ icon: 'github', mode: 'link', content: 'https://github.com/xSeek-Neo' }],
  },
  builderConfig: {
    dev: {
      lazyCompilation: false,
    },
    server: {
      port: 5200,
      host: true,
    },
    tools: {
      rspack(config) {
        if (
          config.cache &&
          typeof config.cache === 'object' &&
          config.cache.type === 'persistent'
        ) {
          config.cache.storage = {
            type: 'filesystem',
            directory: path.join(__dirname, 'node_modules/.cache/rspack-blog'),
          };
        }
        return config;
      },
    },
  },
});
