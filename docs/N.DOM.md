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

---

## DOM 事件机制（捕获 / 目标 / 冒泡）

### addEventListener 的第三个参数

`addEventListener(type, handler, options)` 的 `options` 决定监听器挂在哪个阶段。

- **默认（冒泡）**：`false` 或 `{ capture: false }`
  - 事件从目标往上“冒泡”时触发，最常用于**事件委托**。
- **捕获**：`true` 或 `{ capture: true }`
  - 事件从上往下“捕获”时触发，适合做**拦截/优先处理**。
- **常用扩展**：
  - `{ once: true }`：只触发一次
  - `{ passive: true }`：告诉浏览器不会 `preventDefault()`（滚动/触摸场景常用）

### 事件流的三个阶段

一次 DOM 事件会在 DOM 树里走一个来回：

1. **捕获阶段**：`window → ... → 目标元素的父级`
2. **目标阶段**：到达 `e.target`（真正触发的元素）
3. **冒泡阶段**：`目标元素 → ... → window`

补充：

- **`e.target`**：事件源（最深处被点到的那个）
- **`e.currentTarget`**：当前正在执行监听器的那个元素

---

## CustomEvent 自定义事件（创建 → 监听 → 派发）

自定义事件本质是“手动制造一条事件流”，是否能让父级收到，核心看 `bubbles`。

### 1）创建事件对象

```js
const evt = new CustomEvent('user:action', {
  detail: { id: 123 },
  bubbles: true,
  cancelable: true,
})
```

- **type**：事件名字符串
- **detail**：自定义数据载体（最常用）
- **bubbles**：是否冒泡（决定父级冒泡监听能否收到）
- **cancelable**：是否允许 `preventDefault()` 否决

### 2）绑定监听器

```js
document.addEventListener('user:action', (e) => {
  console.log('收到数据:', e.detail)
})
```

### 3）派发事件

```js
el.dispatchEvent(evt)
```

如果 `cancelable: true`，`dispatchEvent()` 的返回值会反映是否被否决：

```js
const ok = el.dispatchEvent(evt) // true 表示未被 preventDefault 否决
```

---

## 联动速记（参数 ↔ 阶段 ↔ 影响）

| 点 | 关联 | 影响 |
| :--- | :--- | :--- |
| `bubbles` | 冒泡阶段 | 为 `false` 时，挂在父级（冒泡阶段）的监听器不会触发 |
| `cancelable` | `preventDefault()` | 为 `true` 时，监听器可以否决，进而影响 `dispatchEvent()` 返回值 |
| `capture` | 捕获阶段 | 即使 `bubbles: false`，捕获监听器也能在“下行路径”截获 |

---

## 常见坑

- **dispatchEvent 不能传字符串**：必须传 `new Event(...) / new CustomEvent(...)` 产生的事件对象
- **节点不在 DOM 树里就无法“冒泡到 document/window”**：仅 `createElement` 但没插入页面，事件最多在它自己的树里传播；要让 `document` 级别监听收到，通常需要把节点挂进文档（或把事件派发到 `document` 上）
