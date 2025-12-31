const moment = require('moment')
const headConf = require('./conf/headConf')
const pluginsConf = require('./conf/pluginsConf')
const navConf = require('./conf/navConf')
const sideBarConf = require('./conf/sideBarConf')
const markdownConf = require('./conf/markdownConf')
const webPackConf = require('./conf/webPackConf')
moment.locale('zh-cn')
module.exports = {
  title: '葵花寶典',
  base: '/docs/', // 这是部署到github相关的配置
  // base: '/', // 自定义域名的时候使用
  port: 5200,
  description: '业精于勤荒于嬉，行成于思毁于随',
  // 注入到当前页面的 HTML <head> 中的标签
  head: headConf,
  markdown: markdownConf,
  configureWebpack: webPackConf,
  plugins: pluginsConf,
  themeConfig: {
    sidebarDepth: 3, // 将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    lastUpdated: '上次更新', // 文档更新时间：每个文件git最后提交的时间
    nav: navConf,
    sidebar: sideBarConf,
    smoothScroll: true,
    logo: '/logo.png',
  },
}

