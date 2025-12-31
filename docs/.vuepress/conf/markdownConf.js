module.exports = {
	lineNumbers: true, // 代码块显示行号
	anchor: { permalink: false, permalinkBefore: true, permalinkSymbol: '#' },
	markdown: {
		extendMarkdown: (md) => {
			md.use(require('markdown-it-disable-url-encode'))
		},
	},
}
