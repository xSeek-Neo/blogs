module.exports = [
  [
    'flowchart'
  ],
  [
    '@vuepress/google-analytics',
    {
      'ga': 'G-LGW9Z525J3' // UA-00000000-0
    }
  ],
  ['@vuepress/medium-zoom', {
    selector: 'img.zoom-imgs',
    options: {
      margin: 20
    }
  }],
  ['@vuepress/back-to-top'],
  ['@vuepress/last-updated',
    {
      transformer: (timestamp) => {
        const moment = require('moment')
        return moment(timestamp).format('MMMM Do YYYY, h:mm:ss a')
      }
    }
  ],
  ['@vuepress/active-header-links', {
    sidebarLinkSelector: '.sidebar-link',
    headerAnchorSelector: '.header-anchor'
  }],
  ['@vuepress/nprogress'],
  ['@vuepress/search', {
    searchMaxSuggestions: 10
  }],
  [
    '@vuepress/pwa', {
      serviceWorker: true,
      updatePopup: {
        message: '发现新内容可用',
        buttonText: '刷新'
      }
    }],
  ["vuepress-plugin-code-copy", {
    selector: 'div[class*="language-"] pre',
    align: 'bottom',
    color: '#27b1ff',
    backgroundTransition: true,
    backgroundColor: '#0075b9',
    successText: 'Success Copied!'
  }
  ]
]
