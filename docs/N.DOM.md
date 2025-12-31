## 操作dom 的方式

操作 DOM（文件物件模型）是網頁開發的核心，主要分為選取、修改、增刪以及效能優化四類方式

0. 创建原始

```
document.createDocumentFragment()
document.createElement(tagName)
document.createTextNode(text)
// 复制
const temp = document.querySelector('.id')
const clone = temp.content.cloneNode(true)
el.appendChild(clone)
```

1. 選取元素 (Selecting)
   在使用 JavaScript 操作 DOM 之前，必須先獲取目標元素

| 方法 | 返回 | 特点 |
|------|------|------|
| getElementById | 单个元素 | 最快 |
| getElementsByClassName | HTMLCollection | 动态集合 |
| getElementsByTagName | HTMLCollection | 动态 |
| querySelector | 单个 | CSS 选择器 |
| querySelectorAll | NodeList | 静态 |
 
 还有 parentElement / children / childNodes firstChild / lastChild /nextElementSibling / previousElementSibling / el.closest('.wrapper')

2. 修改內容與屬性 (Modifying)
   * 內容修改：
     - textContent：修改或獲取純文字內容（較安全）
     - innerHTML：解析並插入 HTML 結構
     - innerText 满
   * 屬性操作：
     - setAttribute(name, value) 與 getAttribute(name)：管理自定義或標準屬性
     - removeAttribute
     - element.style：直接修改行內樣式
     - classList：透過 add、remove、toggle 管理 CSS 類別，這是目前推薦的樣式控制方式

3. 新增與刪除節點 (Creating & Deleting)

* 新增：先用 document.createElement(tag) 創建，再用以下方法插入：
  - appendChild(node)：作為最後一個子節點加入
  - prepend(node)：作為第一個子節點加入
  - after(node) 或 before(node)：在元素前後插入兄弟節點
  - insertBefore
  - insertAdjacentHTML
  - insertAdjacentText
* 刪除：直接呼叫 element.remove() 或是透過父節點執行 removeChild(child)
