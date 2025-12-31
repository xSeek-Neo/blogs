## js中变量提升 和 函数声明提升优先级

在JavaScript中，**函数提升的优先级高于变量提升**。当同一作用域内存在同名的函数声明和变量声明时，函数声明会首先被提升，随后变量声明会被提升但不会覆盖函数声明（除非变量被赋值）。以下是详细解释：

---

### 1. **提升机制**

- **函数声明**：整体提升（包括函数体），在作用域顶部可用。
- **变量声明（`var`）**：仅声明被提升，初始化（赋值）留在原地。

---

### 2. **同名情况下的覆盖规则**

- **函数声明优先**：若存在同名函数和变量声明，函数声明会覆盖变量声明。
- **变量赋值会覆盖函数**：后续的变量赋值操作会覆盖已提升的函数值。

---

### 3. **示例分析**

#### 示例1：函数声明 vs 变量声明

```javascript
console.log(foo); // 输出函数体
var foo = 5;

function foo() {
}
```

- **提升后的等效代码**：
  ```javascript
  function foo() {} // 函数提升优先
  var foo; // 变量声明被忽略（因同名函数已存在）
  console.log(foo); // 输出函数
  foo = 5; // 赋值操作在执行阶段覆盖函数
  ```

#### 示例2：变量赋值覆盖函数

```javascript
function foo() {
}

var foo = 5;
console.log(foo); // 输出5
```

- **执行过程**：
    1. 函数`foo`被提升。
    2. 变量`foo`声明被忽略。
    3. 赋值`foo = 5`覆盖函数。

---

### 4. **注意事项**

- **函数表达式不会提升**：如`var foo = function() {}`，此时变量`foo`提升，但函数体在赋值前不可用。
- **ES6的`let`/`const`**：存在暂时性死区，无法在声明前访问，不参与传统提升机制。

---

### 总结

- **函数提升 > 变量提升**：同名时函数声明优先。
- **赋值操作最终生效**：变量赋值或后续函数声明会覆盖初始提升的值。

理解这一机制有助于避免因提升导致的意外行为，尤其是在处理复杂作用域时。

## promise的内部原理是什么 它的优缺点是什么

    Promise对象，封装了一个异步操作并且还可以获取成功或失败的结果
    Promise主要就是解决回调地狱的问题，之前如果异步任务比较多，同时他们之间有相互依赖的关系，
    就只能使用回调函数处理，这样就容易形成回调地狱，代码的可读性差，可维护性也很差
    有三种状态：pending初始状态  fulfilled成功状态  rejected失败状态
    状态改变只会有两种情况，
        pending -> fulfilled; pending -> rejected 一旦发生，状态就会凝固，不会再变
    首先就是我们无法取消promise，一旦创建它就会立即执行，不能中途取消
    如果不设置回调，promise内部抛出的错误就无法反馈到外面
    若当前处于pending状态时，无法得知目前在哪个阶段
    原理：
        构造一个Promise实例，实例需要传递函数的参数，这个函数有两个形参，分别都是函数类型，一个是resolve一个是reject
        promise上还有then方法，这个方法就是来指定状态改变时的确定操作，resolve是执行第一个函数，reject是执行第二个函数

## promise和async await的区别是什么

* 1.都是处理异步请求的方式
* 2.promise是ES6，async await 是ES7的语法
* 3.async await是基于promise实现的，他和promise都是非阻塞性的

### 优缺点：

* 1.promise是返回对象我们要用then，catch方法去处理和捕获异常，并且书写方式是链式，容易造成代码重叠，不好维护，async await
  是通过try catch进行捕获异常
* 2.async await最大的优点就是能让代码看起来像同步一样，只要遇到await就会立刻返回结果，然后再执行后面的操作
  promise.then()的方式返回，会出现请求还没返回，就执行了后面的操作

## JavaScript 事件循环 (Event Loop) 详解

JavaScript 是一门 单线程 语言，这意味着它一次只能执行一个任务。事件循环是 JavaScript 实现 非阻塞异步操作 的核心机制。

`事件循环按照以下步骤循环执行：`

### 1. 核心运行流程

* 1.执行同步代码：首先执行调用栈（Call Stack）中的同步任务，直到栈清空。
* 2.清空微任务队列：一旦同步代码执行完毕，立即依次执行所有待处理的微任务。
* 3.执行一个宏任务：从宏任务队列中取出一个最早的任务放入执行栈运行。
* 4.UI 渲染（可选）：如果是在浏览器环境下，可能会在此阶段进行 UI 渲染更新。
* 5.重复循环：回到步骤 2，继续检查微任务并处理下一个宏任务。

### 2. 任务分类

JavaScript 将异步任务分为两类，其执行优先级不同：

#### 微任务 (Microtask) —— 优先级高

* Promise.then() / .catch() / .finally()
* Async/Await (本质是 Promise)
* MutationObserver (浏览器环境)
* queueMicrotask()
* process.nextTick() (Node.js 环境，优先级高于普通微任务)

#### 宏任务 (Macrotask / Task) —— 优先级低

* 整个 script 脚本块
* setTimeout() / setInterval()
* setImmediate() (Node.js 环境)
* DOM 事件（如 click）、I/O 操作、网络请求 (Ajax/Fetch)

### 3. 示例代码演示

```js
console.log('1'); // 同步

setTimeout(() => {
    console.log('2'); // 宏任务
}, 0);

Promise.resolve().then(() => {
    console.log('3'); // 微任务
});

console.log('4'); // 同步

// 执行结果顺序：1 -> 4 -> 3 -> 2

```

解析:

* 1.执行同步代码 1 和 4。
* 2.同步任务结束，检查微任务队列，执行 Promise.then 打印 3
* 3.进入下一轮事件循环，执行宏任务队列中的 setTimeout 打印 2

### 4. 关键点总结

* 非阻塞：JavaScript 虽然是单线程，但通过将耗时任务（如定时器、请求）交给环境（浏览器 Web API 或 Node.js）处理，避免了主线程卡死
* 微任务插队：在一个宏任务执行完后，必须清空所有微任务，才能开始下一个宏任务。这意味着如果在微任务中不断产生新的微任务，宏任务将被推迟

## JS由哪三部分组成

:::warning
ECMAScript：JS的核心内容，描述了语言的基础语法，比如var,for，数据类型（数组、字符串），
文档对象模型（DOM）：DOM把整个HTML页面规划为元素构成的文档
浏览器对象模型（BOM）：对浏览器窗口进行访问和操作
:::

## JS对数据类的检测方式有哪些

:::warning
typeof()
instanceof()
constructor
Object.prototype.toString.call()
:::

## js内置对象

> Number/String/Boolean/Math/Date/Array/Object/Function/RegExp/Error/JSON
> /[Promise, Generator, Symbol, Set, Map, WeakMap, WeakSet, Reflect、Proxy]

## 转 Boolean

在条件判断时，除了 undefined， null， false， NaN， ''， 0， -0，其他所有值都转为 true，包括所有对象。

## typeof 使用

[typeof MDN 地址详解]('https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof')

```js
typeof undefined // undefined
typeof 0 // number
typeof 's' // string
typeof true // boolean
typeof function () {
} // function
typeof BigInt(666) // bigint
typeof Symbol('s') // symbol
typeof o // b 没有声明，但是还会显示 undefined
typeof Infinity // 'number'
typeof 42 === 'number'
typeof NaN // number
typeof [] // 'object'
typeof {} // 'object'
typeof null // 'object'
```

## 基本数据类型和引用数据类型的区别

> 基本数据类型: number string boolean undefined null symbol bigint
>
:::warning

- 1.基本数据类型保存在栈内存当中，保存就是一个具体的值
  :::

> 引用数据类型: Object (包括 Object 、Array 、Function)

:::warning

- 1.引用数据类型保存在堆内存当中，声明一个引用类型的变量，它保存的是引用类型数据的地址
- 2.假如声明两个引用类型并同时指向了一个地址的时候，修改其中一个另一个也会改变
  :::

## js对数据类型检测有哪些方法

-
    1. typeof 用于返回变量的基本类型，但无法区分对象的具体类型（如数组、日期等）

```js
typeof 's' // string

typeof 0 // number
typeof 42 // number
typeof Infinity // number
typeof NaN // number

typeof true // boolean

typeof undefined // undefined
typeof o // b 没有声明，但是还会显示 undefined

typeof null // object

typeof function () {
} // function

typeof BigInt(666) // bigint

typeof Symbol('s') // symbol

typeof [] // 'object'
typeof {} // 'object'
```

-
    2. instanceof 用于检查对象是否为某个构造函数的实例，适用于自定义对象和内置对象

```js
console.log({} instanceof Object) // true
console.log([] instanceof Array) // true
console.log('abc' instanceof String) // true

const obj = {}
// 强行把对象的隐式原型(__proto__) 指向数组的原型
obj.__proto__ = Array.prototype

console.log(obj instanceof Array) // true
```

-
    3. 通过 constructor 属性可以获取对象的构造函数，但可能被修改

```js
console.log("abc".constructor === String)

const str = new String('abc')
str.constructor = function Dog() {
}
console.dir(str.constructor) // Dog
```

-
    4. Object.prototype.toString 可以返回更精确的类型信息，适用于所有内置对象

```js
Object.prototype.toString.call(Symbol()) // ['object', 'Symbol']
Object.prototype.toString.call(Symbol()).slice(8, -1).toLowerCase() // symbol
```

## 前端内存泄漏的理解

> js已经分配内存地址的对象，但是由于长时间没有释放或没办法清除，造成长期占用内存的情况，会让内存资源大幅浪费，最终导致运行速度慢，甚至崩溃的情况。
> 内存回收机制
> 因素：一些未声明直接赋值的变量；一些未清空的定时器；过度使用的闭包；一些引用元素没有被清除；

## 原型

[原型](https://github.com/KieSun/Dream/issues/2)

![原型链](~@imgs/prototype.png)

## 关于 new 操作符

- a.new 执行的构造函数，函数内部默认生成了一个对象

- b.把**空对象**和**构造函数**通过原型链进行连接

- c.把构造函数内部的 this 绑定到新的空对象身上

- d.根据构造函数返回类型进行判断，如果是值类型则返回对象，如果是引用类型，直接返回引用类型

## “ ===”、“ ==”的区别

> ==，当且仅当两个运算数相等时，它返回 true，即不检查数据类型
> ===，只有在无需类型转换运算数就相等的情况下，才返回 true，需要检查数据类型

## null 和 undefined 区别

undefined 表示一个变量声明了没有初始化(赋值)

```js
let a
console.log(a) // undefinded

const obj = {a: 1}
console.log(obj.b) // undefinded

console.log(function () {
    // undefinded
    console.log('函数没有返回值')
})

function a(b) {
    console.log(b) // undefinded
}

a() // 不传参数b是undefinded
```

null 表示一个对象是“没有值”的值，也就是值为“空”

undefined 和 null 在 if 语句中，都会被自动转为 false

undefined 不是一个有效的 JSON，而 null 是

undefined 的类型(typeof)是 undefined

null 的类型(typeof)是 object

Javascript 将未赋值的变量默认值设为 undefined

Javascript 从来不会将变量设为 null。 它是用来让程序员表明某个用 var 声明的变量时没有值的

在 JavaScript 中，`null` 和 `undefined` 都表示“无”或“空”的概念，但它们的含义和使用场景有本质区别：

---

### **1. 基本定义**

- **`undefined`**  
  表示 **变量已声明但未赋值** 的默认值，或 **对象属性不存在** 的默认值。  
  它是 JavaScript 引擎自动赋予的“空值”，表示“未定义”。

  ```javascript
  let a;
  console.log(a); // undefined（变量未赋值）

  const obj = {};
  console.log(obj.name); // undefined（属性不存在）
  ```

- **`null`**  
  表示 **开发者显式赋予的“空值”**，通常用于主动清空变量或标记一个“无对象”的状态。  
  它是一个 **明确的空值**，表示“此处应没有值”。

  ```javascript
  let b = null; // 开发者主动设置空值
  ```

---

### **2. 类型检查**

- **`typeof` 运算符**
    - `typeof undefined` → `"undefined"`
    - `typeof null` → `"object"`（历史遗留 Bug，但结果无法修改）

  ```javascript
  console.log(typeof undefined); // "undefined"
  console.log(typeof null);      // "object"
  ```

---

### **3. 相等性比较**

- **松散相等（`==`）**  
  `null == undefined` → `true`（设计上允许等价）
- **严格相等（`===`）**  
  `null === undefined` → `false`（类型不同）

  ```javascript
  console.log(null == undefined);  // true
  console.log(null === undefined); // false
  ```

---

### **4. 应用场景**

- **`undefined` 的典型场景**
    - 变量未初始化。
    - 函数未传递参数时的默认值。
    - 对象未定义的属性。
    - 函数没有返回值时默认返回 `undefined`。

  ```javascript
  function test(x) {
    console.log(x); // 参数未传递 → undefined
  }
  test();
  ```

- **`null` 的典型场景**
    - 开发者主动清空变量（如释放对象引用）。
    - 作为函数的返回值，明确表示“无结果”。
    - 在 API 设计中，显式标记某个值应为空。

  ```javascript
  const data = fetchData(); // 假设返回数据或 null
  if (data === null) {
    console.log("No data found.");
  }
  ```

---

### **5. JSON 序列化**

- `undefined` → 在 JSON 中会被 **忽略**。
- `null` → 在 JSON 中会被保留为 `null`。

  ```javascript
  JSON.stringify({ a: undefined, b: null }); // '{"b":null}'
  ```

---

### **总结**

| 特性       | `undefined`                 | `null`             |
|----------|-----------------------------|--------------------|
| **来源**   | 系统默认赋值（未初始化）                | 开发者显式赋值            |
| **类型**   | `"undefined"`               | `"object"`（历史 Bug） |
| **用途**   | 表示“未定义”                     | 表示“有意的空值”          |
| **严格相等** | `undefined === undefined` ✅ | `null === null` ✅  |
| **JSON** | 被忽略                         | 保留为 `null`         |

**简单记忆**：

- 未定义的值 → `undefined`（被动出现）
- 主动清空的值 → `null`（主动设置）

## var、let、const 区别

> var 存在变量提升。
> let 只能在块级作用域内访问。
> const 用来定义常量，必须初始化，不能修改（对象特殊）

## 说一下闭包，闭包有什么特点

:::warning
什么是闭包？函数嵌套函数，内部函数被外部函数返回并保存下来时，就会产生闭包
特点：可以重复利用变量，并且这个变量不会污染全局的一种机制；这个变量是一直保存再内存中，不会被垃圾回收机制回收
缺点：闭包较多的时候，会消耗内存，导致页面的性能下降，在IE浏览器中才会导致内存泄漏
使用场景：防抖，节流，函数嵌套函数避免全局污染的时候
:::

## 事件委托是什么

:::success
又叫事件代理，原理就是利用了事件冒泡的机制来实现，也就是说把子元素的事件绑定到了父元素的身上
如果子元素组织了事件冒泡，那么委托也就不成立
组织事件冒泡：event.stopPropagation()
addEventListener('click',函数名，true/false) 默认是false（事件冒泡），true（事件捕获）
好处：提高性能，减少事件的绑定，也就减少了内存的占用。
:::

## 基本数据类型和引用数据类型的区别

:::success
基本数据类型：String Number Boolean undefined null
基本数据类型保存在栈内存当中，保存的就是一个具体的值
引用数据类型（复杂数据类型）：Object Function Array
保存在堆内存当中，声明一个引用类型的变量，它保存的是引用类型数据的地址
假如声明两个引用类型同时指向了一个地址的时候，修改其中一个那么另外一个也会改变
:::

## 前端的内存泄漏怎么理解

`
JS里已经分配内存地址的对象，但是由于长时间没有释放或者没办法清除，造成长期占用内存的现象，会让内存资源大幅浪费，最终导致运行速度慢，甚至崩溃的情况。
垃圾回收机制
因素：一些为生命直接赋值的变量；一些未清空的定时器；过度的闭包；一些引用元素没有被清除。
`

## 内存(垃圾)回收机制

- 垃圾回收器会每隔一段时间找出那些不再使用的内存，然后为其释放内存
  一般使用标记清除方法(mark and sweep), 当变量进入环境标记为进入环境，离开环境标记为离开环境

- 垃圾回收器会在运行的时候给存储在内存中的所有变量加上标记，然后去掉环境中的变量以及被环境中变量所引用的变量（闭包），在这些完成之后仍存在标记的就是要删除的
  变量了

- 还有引用计数方法(reference counting), 在低版本 IE 中经常会出现内存泄露，很多时候就是因为其采用引用计数方式进行垃圾回收。引用计数的策略是跟踪记录每个值
  被使用的次数，当声明了一个 变量并将一个引用类型赋值给该变量的时候这个值的引用次数就加 1，如果该变量的值变成了另外一个，则这个值得引用次数减
  1，当这个值的引 用次数变为 0 的时 候，说明没有变量在使用，这个值没法被访问了，因此可以将其占用的空间回收，这样垃圾回收器会在运行的时候清理掉引用次数为
  0 的值占用的空间。

- 在 IE 中虽然 JavaScript 对象通过标记清除的方式进行垃圾回收，但 BOM 与 DOM 对象却是通过引用计数回收垃圾的， 也就是说只要涉及
  BOM 及 DOM 就会出现循环引用问题。
- [内存泄漏](https://www.zhihu.com/question/40560123)

## 原型 与原型链

1．原型：函数都有prototype属性，称之为原型，也称为原型对象
原型可以放一些属性和方法，共享给实例对象使用
原型可以做继承
2．原型链：
对象都有_proto_属性,这个属性指向它的原型对象,原型对象也是对象,也有_proto_属性,指向原型对象的原型对象,这样一层一层
形成的链式结构称为原型链，最顶层找不到则返回null

## 说一下闭包 有什么特点？

> 什么是闭包？ 函数嵌套函数，内层函数被外层函数返回并保存下来， 就会产生闭包
> 特点：可以重复利用变量，并且这个变量不会污染全局的一种机制，这个变量始终保存在内存中 不会被垃圾回收机制回收
> 缺点：闭包较多的时候，会消耗内存，导致页面性能下降，在IE浏览器中才会导致内存泄露
> 使用场景：防抖、节流、函数嵌套函数避免全局污染的时候就可以使用闭包

> 阮一峰老师理解的闭包

- 1.我的理解是，闭包就是能够读取其他函数内部变量的函数。
- 2.由于在 Javascript 语言中，只有函数内部的子函数才能读取局部变量，因此可以把闭包简单理解成"定义在一个函数内部的函数"。
- 3.闭包可以用在许多地方。它的最大用处有两个，一个是前面提到的可以读取函数内部的变量，另一个就是让这些变量的值始终保持在内存中。

## JS是如何实现继承的

`
1.原型链继承
2.借用构造函数继承
3.组合式继承
4.ES6的class类继承
`

## JS的设计原理是什么

`
JS引擎 运行上下文 调用栈 事件循环 回调
`

## 同源策略

> 概念:同源策略是客户端脚本（尤其是 Netscape Navigator2.0，其目的是防止某个文档或脚本从多个不同源装载。
> 这里的同源策略指的是：协议，域名，端口相同，同源策略是一种安全协议。
> 指一段脚本只能读取来自同一来源的窗口和文档的属性。

## 箭头函数和普通函数有什么区别

- 函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象，用 call apply bind 也不能改变 this 指向
- 不可以当作构造函数，也就是说，不可以使用 new 命令，否则会抛出一个错误。
- 不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
- 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。
- 箭头函数没有原型对象 prototype

## ES6 的新特性有哪些

### 1. 新增块级作用域（let / const）

- 不存在变量提升
- 存在暂时性死区（TDZ）
- 只在块级作用域内生效
- 不能在同一个作用域内重复声明

### 2. 新增定义类的语法糖（class）

### 3. 新增了一种基本数据类型（Symbol）

### 4. 新增了解构赋值

- 从数组或对象中取值，然后赋值给变量

### 5. 新增了函数参数的默认值

### 6. 给数组新增了 API

### 7. 对象和数组新增了扩展运算符（...）

### 8. Promise

- 解决回调地狱的问题
- 自身有 `all`、`reject`、`resolve`、`race` 方法
- 原型上有 `then`、`catch`
- 把异步操作队列化
- 三种状态：
    - `pending`（初始状态）
    - `fulfilled`（操作成功）
    - `rejected`（操作失败）
- 状态一旦改变就不可逆：
    - `pending → fulfilled`
    - `pending → rejected`

#### async / await

- 用同步写法执行异步操作（必须搭配使用）
- `async` 表示函数内部有异步操作，返回一个 Promise
- `await` 是一个表达式
    - 如果后面是 Promise，则返回其结果
    - 如果是普通值，则直接返回
- `await` 后的 Promise 如果是 `reject`，整个 `async` 函数会中断执行

### 9. 新增模块化（import / export）

### 10. 新增 Set 和 Map 数据结构

- `Set`：成员唯一，不重复
- `Map`：key 的类型不受限制

### 11. 新增 Generator（生成器）

### 12. 新增箭头函数

- 不能作为构造函数，不能使用 `new`
- 没有 `prototype`
- 没有 `arguments`
- 不能使用 `call / apply / bind` 改变 `this`
- `this` 指向外层最近一层普通函数的 `this`

## call,aply,bind三者有什么区别

:::success
都是改变this指向和函数的调用，call和apply的功能类似，只是传参的方法不同
call方法传的是一个参数列表
apply传递的是一个数组
bind传参后不会立刻执行，会返回一个改变了this指向的函数，这个函数还是可以传参的，bind()()
call方法的性能要比apply好一些，所以call用的更多一点
:::

## 用递归的时候有没有遇到什么问题

:::success
如果一个函数内可以调用函数本身，那么这个就是递归函数
函数内部调用自己
特别注意：写递归必须要有退出条件return
:::

## JS 常见设计模式

[JavaScript 中常见的十五种设计模式](https://www.cnblogs.com/imwtr/p/9451129.html#o1)

## 箭头函数和普通函数的区别

## 防抖和节流是什么

都是应对页面中频繁触发事件的优化方案

* 防抖:避免事件重复触发
    - 使用场景:1.频繁和服务端交互 2.输入框的自动保存事件
* 节流:把频繁触发的事件减少,每隔一段时间执行
    - 使用场景:scroll事件****

## 防抖和节流

### 防抖 (debounce)

防抖和节流：[限制函数的执行次数](https://juejin.cn/post/7021517013893775367)
什么是防抖：定义 高频事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。

简版：

```js{1,4,6-7}
function debounce(fn, timing) {
  let timer = null
  return function() {
    if(timer) {
      clearTimeout(timer)
    }
    let firstClick =!timer

    if(firstClick) {
        fn()
    }
    timer = setTimeout(() => {
      timer = null
    }, timing)
  }
}
```

- func:事件的回调函数
- wait:每次执行回调需要等待的时间
- flag(布尔值):是否需要第一次触发事件立即执行(不传入flag则默认为false,不会立即执行第一次)

```js
function debounce(callback, wait, immedite = false) {
    let timer, args, self;
    return function () {
        args = arguments;
        self = this;
        let now = immedite && !timer
        if (now) callback.apply(this, args)
        clearTimeout(timer)
        timer = setTimeout(() => {
            timer = null
            callback.apply(this, args)
        }, wait);
    }
}
```

完整版：

```js
// 这个是用来获取当前时间戳的
function now() {
    return +new Date()
}

/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
function debounce(func, wait = 50, immediate = true) {
    let timer, context, args

    // 延迟执行函数
    const later = () =>
        setTimeout(() => {
            // 延迟函数执行完毕，清空缓存的定时器序号
            timer = null
            // 延迟执行的情况下，函数会在延迟函数中执行
            // 使用到之前缓存的参数和上下文
            if (!immediate) {
                func.apply(context, args)
                context = args = null
            }
        }, wait)

    // 这里返回的函数是每次实际调用的函数
    return function (...params) {
        // 如果没有创建延迟执行函数（later），就创建一个
        if (!timer) {
            timer = later()
            // 如果是立即执行，调用函数
            // 否则缓存参数和调用上下文
            if (immediate) {
                func.apply(this, params)
            } else {
                context = this
                args = params
            }
            // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
            // 这样做延迟函数会重新计时
        } else {
            clearTimeout(timer)
            timer = later()
        }
    }
}
```

### 节流

规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。

简版：

```js
function throttle(fn, timing) {
    let flag = true
    return function () {
        if (flag) {
            setTimeout(() => {
                fn.call(this)
                flag = true
            }, timing)
        }
        flag = false
    }
}

// 事件第一次触发立即执行一次func 后续在wait时间内只执行一次
function throttle(callback, wait) {
    let args, self
    let oldTime = 0 // 上次执行回调函数的时间戳
    return function () {
        self = this
        args = arguments
        let now = new Date() * 1 // 当前的出发回调的时间戳
        if (now - oldTime >= wait) {
            callback.apply(self, args)
            oldTime = now
        }
    }
}
```

完整版：

```js
/**
 * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      回调函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始函数的的调用，传入{leading: false}。
 *                                如果想忽略结尾函数的调用，传入{trailing: false}
 *                                两者不能共存，否则函数不能执行
 * @return {function}             返回客户调用函数
 */
_.throttle = function (func, wait, options) {
    var context, args, result
    var timeout = null
    // 之前的时间戳
    var previous = 0
    // 如果 options 没传则设为空对象
    if (!options) options = {}
    // 定时器回调函数
    var later = function () {
        // 如果设置了 leading，就将 previous 设为 0
        // 用于下面函数的第一个 if 判断
        previous = options.leading === false ? 0 : _.now()
        // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
        timeout = null
        result = func.apply(context, args)
        if (!timeout) context = args = null
    }
    return function () {
        // 获得当前时间戳
        var now = _.now()
        // 首次进入前者肯定为 true
        // 如果需要第一次不执行函数
        // 就将上次时间戳设为当前的
        // 这样在接下来计算 remaining 的值时会大于0
        if (!previous && options.leading === false) previous = now
        // 计算剩余时间
        var remaining = wait - (now - previous)
        context = this
        args = arguments
        // 如果当前调用已经大于上次调用时间 + wait
        // 或者用户手动调了时间
        // 如果设置了 trailing，只会进入这个条件
        // 如果没有设置 leading，那么第一次会进入这个条件
        // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
        // 其实还是会进入的，因为定时器的延时
        // 并不是准确的时间，很可能你设置了2秒
        // 但是他需要2.2秒才触发，这时候就会进入这个条件
        if (remaining <= 0 || remaining > wait) {
            // 如果存在定时器就清理掉否则会调用二次回调
            if (timeout) {
                clearTimeout(timeout)
                timeout = null
            }
            previous = now
            result = func.apply(context, args)
            if (!timeout) context = args = null
        } else if (!timeout && options.trailing !== false) {
            // 判断是否设置了定时器和 trailing
            // 没有的话就开启一个定时器
            // 并且不能不能同时设置 leading 和 trailing
            timeout = setTimeout(later, remaining)
        }
        return result
    }
}
```

:::tip 我记这个很容易把两者弄混，总结了个口诀，就是 DTTV（Debounce Timer Throttle Variable - 防抖靠定时器控制，节流靠变量控制）。
:::

## 深拷贝 与 浅拷贝

### 浅拷贝

概念: 对于基本数据类型，浅拷贝是对值的复制； 对于对象来说，浅拷贝是对对象地址的复制, 也就是拷贝的结果是两个对象指向同一个地址

### 深拷贝

概念: 深拷贝开辟一个新的堆空间，两个对象对应两个不同的地址，修改一个对象的属性，不会改变另一个对象的属性

### 方法一

```js
function deepClone(obj) {
    let newObj = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] =
                    obj && typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
            }
        }
    }
    return newObj
}

const newObj = deepClone(oldObj)
```

### 方法二

```js
const newObj = JSON.parse(JSON.stringify(oldObj))
```

:::warning 1.如果 obj 里面有时间对象，则 JSON.stringify 后再 JSON.parse 的结果，时间将只是字符串的形式。而不是时间对象

2.如果 obj 里有 RegExp、Error 对象，则序列化的结果将只得到空对象

3.如果 obj 里有 function，Symbol 类型，undefined，则序列化的结果会把函数或 undefined 丢失

4.如果 obj 里有 NaN、Infinity 和-Infinity，则序列化的结果会变成 null

5.JSON.stringify()只能序列化对象的可枚举的自有属性，例如 如果 obj 中的对象是有构造函数生成的， 则使用 JSON.parse(
JSON.stringify(obj))深拷贝后，会丢弃对象的 constructor
:::

## JSON.stringify

```js
const test = {
    name: 'Dendi',
    // 1.如果obj里面有Date对象，则JSON.stringify后再JSON.parse的结果，时间将只是字符串的形式，而不是对象的形式
    date: [new Date(1536627600000), new Date(1540047600000)],
    // 2.如果obj里有RegExp(正则表达式的缩写)、Error对象，则序列化的结果将只得到空对象
    reg: new RegExp('\\w+'),
    err: new Error('出错了'),
    // 3、如果obj里有function，undefined，symbol则序列化的结果会把函数或 undefined丢失
    c: undefined,
    f() {
        console.log('这里是个函数')
    },
    // 4、如果obj里有NaN、Infinity和-Infinity，则序列化的结果会变成null
    n: NaN,
    n1: Infinity,
    n2: -Infinity,
}

// const b = JSON.parse(JSON.stringify(test))
// console.log(b)

// 5、JSON.stringify()只能序列化对象的可枚举的自有属性，例如 如果obj中的对象是有构造函数生成的， 则使用JSON.parse(JSON.stringify(obj))深拷贝后，会丢弃对象的constructor

// 6.无法拷贝对象的循环应用，即对象成环 (obj[key] = obj)
function Person(name) {
    this.name = name
    console.log(name)
}

const liai = new Person('liai')

const test02 = {
    name: 'a',
    date: liai,
}
// debugger
const copyed = JSON.parse(JSON.stringify(test02))
test02.name = 'test'
console.error('ddd', test02, copyed)

```

## 深拷贝 与 浅拷贝

### 浅拷贝

概念: 对于基本数据类型，浅拷贝是对值的复制； 对于对象来说，浅拷贝是对对象地址的复制, 也就是拷贝的结果是两个对象指向同一个地址

### 深拷贝

概念: 深拷贝开辟一个新的堆空间，两个对象对应两个不同的地址，修改一个对象的属性，不会改变另一个对象的属性

### 方法一

```js
function deepClone(obj) {
    let newObj = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] =
                    obj && typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
            }
        }
    }
    return newObj
}

const newObj = deepClone(oldObj)
```

### 方法二

```js
const newObj = JSON.parse(JSON.stringify(oldObj))
```

:::warning 1.如果 obj 里面有时间对象，则 JSON.stringify 后再 JSON.parse 的结果，时间将只是字符串的形式。而不是时间对象

2.如果 obj 里有 RegExp、Error 对象，则序列化的结果将只得到空对象

3.如果 obj 里有 function，Symbol 类型，undefined，则序列化的结果会把函数或 undefined 丢失

4.如果 obj 里有 NaN、Infinity 和-Infinity，则序列化的结果会变成 null

5.JSON.stringify()只能序列化对象的可枚举的自有属性，例如 如果 obj 中的对象是有构造函数生成的， 则使用 JSON.parse(
JSON.stringify(obj))深拷贝后，会丢弃对象的 constructor
:::

## JSON.stringify

```js
const test = {
    name: 'Dendi',
    // 1.如果obj里面有Date对象，则JSON.stringify后再JSON.parse的结果，时间将只是字符串的形式，而不是对象的形式
    date: [new Date(1536627600000), new Date(1540047600000)],
    // 2.如果obj里有RegExp(正则表达式的缩写)、Error对象，则序列化的结果将只得到空对象
    reg: new RegExp('\\w+'),
    err: new Error('出错了'),
    // 3、如果obj里有function，undefined，symbol则序列化的结果会把函数或 undefined丢失
    c: undefined,
    f() {
        console.log('这里是个函数')
    },
    // 4、如果obj里有NaN、Infinity和-Infinity，则序列化的结果会变成null
    n: NaN,
    n1: Infinity,
    n2: -Infinity,
}

// const b = JSON.parse(JSON.stringify(test))
// console.log(b)

// 5、JSON.stringify()只能序列化对象的可枚举的自有属性，例如 如果obj中的对象是有构造函数生成的， 则使用JSON.parse(JSON.stringify(obj))深拷贝后，会丢弃对象的constructor

// 6.无法拷贝对象的循环应用，即对象成环 (obj[key] = obj)
function Person(name) {
    this.name = name
    console.log(name)
}

const liai = new Person('liai')

const test02 = {
    name: 'a',
    date: liai,
}
// debugger
const copyed = JSON.parse(JSON.stringify(test02))
test02.name = 'test'
console.error('ddd', test02, copyed)

```

### 基本类型

基本类型就是值类型, 存放在栈（stack）内存中的简单数据段， 数据大小确定， 内存空间大小可以分配

### 引用类型

引用类型，栈内存存的是该对象在栈中的引用， 真实的数据存在堆（heap）内存里

### 浏览器中的事件循环

JavaScript 的主要用途是与用户互动, 以及操作 DOM。
如果它是多线程的会有很多复杂的问题要处理, 比如有两个线程同时操作 DOM, 一个线程删除了当前的 DOM 节点, 一个线程是要操作当前的DOM,
这样就会有冲突. 为了避免这种, 所以 JS 是单线程的。
即使 H5 提出了 web worker 标准, 它有很多限制, 受主线程控制, 是主线程的子线程, 也是不允许操作DOM.

单线程就意味着所有的任务都需要排队, 后面的任务需要等前面的任务执行完才能执行, 如果前面的任务耗时过长, 后面的任务就需要一直等,
一些从用户角度上不需要等待的任务就会一直等待, 这个从体验角度上来讲是不可接受的, 所以JS中就出现了异步的概念。

JavaScript 代码的执行过程中, 除了依靠函数调用栈来搞定函数的执行顺序外, 还依靠任务队列(task queue)来搞定另外一些代码的执行。一个线程中,
事件循环是唯一的, 但是任务队列可以拥有多个。任务队列又分为 macro-task（宏任务）与 micro-task（微任务）, 在最新标准中, 它们被分别称为
task与jobs。

#### 同步任务

代码从上到下按顺序执行

#### 异步任务

macro-task 大概包括：

- script(整体代码)
- setTimeout
- setInterval
- setImmediate
- UI交互事件(click, doubleClick)
- postMessage
- Ajax

micro-task 大概包括:

- process.nextTick(Node.js 环境)
- Promise.then catch finally
- Async/Await(实际就是 promise)
- MutationObserver(html5 新特性)

#### 运行机制

所有的同步任务都是在主进程执行的形成一个执行栈, 主线程之外, 还存在一个"任务队列[task queue]", 异步任务执行队列中先执行宏任务,
然后清空当次宏任务中的所有微任务, 然后进行下一个tick如此形成循环。

[事件循环机制](https://segmentfault.com/a/1190000022805523)
[事件循环机制](https://cloud.tencent.com/developer/article/1601176)

## NodeJs 事件循环机制（Event loop）

## 定时器原理 (答案待完善)

javascript 引擎只有一个线程，迫使异步事件只能加入队列去等待执行。 在执行异步代码的时候，setTimeout 和 setInterval 是有着本质区别的。
如果计时器被正在执行的代码阻塞了，它将会进入队列的尾部去等待执行直到下一次可能执行的时间出现（可能超过设定的延时时间）。 如果
interval 回调函数执行需要花很长时间的话(比指定的延时长)，interval 有可能没有延迟背靠背地执行。
上述这一切对于理解 js 引擎是如果工作的无疑是很重要的知识，尤其是大量的典型的异步事件发生时，对于构建一个高效的应用代码片段来说是一个非常有利的基础。
[定时器原理](https://segmentfault.com/a/1190000002633108)

## 异步转同步

promise 、async/await 、callback 、generator function

> 同步转为异步 new Promise().then(() => { // 异步代码})

### 回调函数

优点：解决了同步的问题（整体任务执行时长）

缺点：回调地狱，不能用 try catch 捕获错误，不能 return

### Promise

优点：解决了回调地狱的问题

缺点：无法取消 Promise，错误需要通过回调函数来捕获

### Generator

特点：可以控制函数的执行。

### Async/Await

优点：代码清晰，不用像 Promise 写一大堆 then 链，处理了回调地狱的问题

缺点：await 将异步代码改造成同步代码，如果多个异步操作没有依赖性而使用 await 会导致性能上的降低

## es6 新增数组方法

```
1.push 2.pop 3.shift 4.unshift 5.splice 6.concat 7.flat 8.reverse 9.slice 10.forEach 11.map 12.filter 13.every 14.some 15.sort 16.reduce 17.reduceRight 18. indexOf 19.arr.lastIndexOf()  20.Array.from 21. Array.of 22.copyWith 23.find 24.findIndexOf 25.fill 26.includs 27.kyes 28.values 29.entries 30.flatMap 31.join
```

### 1.扩展运算符的使用方法

### 2.reduce

### 3.Array.from() 将类数组对象和可遍历对象转为真正的数组

```js
let arrayLike = {
    0: 'ciel',
    1: 'frank',
    length: 2,
}
//es5
var arr1 = [].slice.call(arrayLike)
console.log('arr1', arr1) //["ciel", "frank"]
var arr2 = Array.prototype.slice.call(arrayLike)
console.log('arr2', arr2) //["ciel", "frank"]

//es6
let arr3 = Array.from(arrayLike)
console.log('arr3', arr3) //["ciel", "frank"]
```

### 4.Array.of

方法用于将一组值，转换为数组。这个方法的主要目的，是弥补数组构造函数 Array()的不足。因为参数个数的不同，会导致 Array()的行为有差异。
5.数组实例的 find() 和 findIndex()

### 6.includes()

### 7.数组实例的 flat()，flatMap()

flat()用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响。flat()默认只会“拉平”一层，如果想要“拉平”多层的嵌套数组，可以将
flat()方法的参数写成一个整数，表示想要拉平的层数，默认为 1。

```js
console.log([1, 2, [3, 4], 5].flat()) //[1, 2, 3, 4, 5]
console.log([1, 2, [3, [4]], 5].flat()) //[1, 2, 3, [4], 5]
console.log([1, 2, [3, [4]], 5].flat(2)) //[1, 2, 3, 4, 5]
// 如果不管有多少层嵌套，都要转成一维数组，可以用Infinity关键字作为参数。
```

```js
console.log([1, 2, [3, [4]], 5].flat(Infinity)) //[1, 2, 3, 4, 5]
//如果原数组有空位，flat()方法会跳过空位。
```

```js
console.log([1, 2, , 4, 5].flat()) //[1, 2, 4, 5]
// flatMap()方法对原数组的每个成员执行一个函数（相当于执行Array.prototype.map()），然后对返回值组成的数组执行flat()方法。该方法返回一个新数组，不改变原数组。
```

```
console.log([1, 2, 3].flatMap((x) => [x, x * 2])) //[1, 2, 2, 4, 3, 6]
//flatMap()只能展开一层数组。 console.log([1, 2, 3].flatMap((x) => [x, [x * 2]])) //[1, [2], 2, [4], 3, [6]]
flatMap() // 方法的参数是一个遍历函数，该函数可以接受三个参数，分别是当前数组成员、当前数组成员的位置（从零开始）、原数组。该方法还可以有第二个参数，用来绑定遍历函数里面的this。
```

```
arr.flatMap(function callback(currentValue[, index[, array]) { ... }[, thisArg])

```

### 9.数组实例的 fill()

fill 方法使用给定值，填充一个数组。

### 10.数组实例的 entries()，keys() 和 values()

entries()，keys()和 values()用于遍历数组。
它们都返回一个遍历器对象，可以用 for...of 循环进行遍历，唯一的区别是 keys()是对键名的遍历、values()是对键值的遍历，entries()
是对键值对的遍历。

```js
for (let index of ['a', 'b'].keys()) {
    console.log(index)
}
//0
//1
```

```js
for (let item of ['a', 'b'].values()) {
    console.log(item)
}
//a
//b
```

```js
for (let [index, item] of ['a', 'b'].entries()) {
    console.log(index, item)
}
//0 "a"
//1 "b"
```

```js
console.log(['a', 'b', 'c'].fill(1)) //[1, 1, 1]
console.log(new Array(3).fill(1)) //[1, 1, 1]

//fill方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。

console.log(['a', 'b', 'c'].fill(1, 0, 1)) //) [1, "b", "c"]
// 如果填充的类型为对象，那么被赋值的是同一个内存地址的对象，而不是深拷贝对象。 数组实例的 entries()，keys() 和 values()
// entries()，keys()和values()用于遍历数组。它们都返回一个遍历器对象，可以用for...of循环进行遍历，唯一的区别是keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。

for (let index of ['a', 'b'].keys()) {
    console.log(index)
} //0 //1

for (let item of ['a', 'b'].values()) {
    console.log(item)
} //a //b

for (let [index, item] of ['a', 'b'].entries()) {
    console.log(index, item)
} //0 "a"
//1 "b"
```

[数组方法](https://www.cnblogs.com/sqh17/p/8529401.html)

## 数组便利方法

### 1.for 循环

```js
var arr = [1, 2, 3, 4, 5]
for (var len = arr.length, i = 0; i < len; i++) {
    console.log(i, arr[i])
}
//  0 1
//  1 2
//  2 3
//  3 4
//  4 5
```

### 2.for...in

可以正确响应 break、continue 和 return 语句

```js
for (var j = 0; j < arr.length; j++) {
    //执行代码
}
```

### 3. for...of

可以正确响应 break、continue 和 return 语句

```js
for (var value of myArray) {
    console.log(value)
}
```

### 4.forEach

遍历数组中的每一项，没有返回值，对原数组没有影响，不支持 IE

```js
arr.forEach((item, index, array) => {
    //执行代码
})
//参数：value数组中的当前项, index当前项的索引, array原始数组；
//数组中有几项，那么传递进去的匿名回调函数就需要执行几次；
```

### 5.map

有返回值，可以 return 出来 map 的回调函数中支持 return 返回值；return
的是啥，相当于把数组中的这一项变为啥（并不影响原来的数组，只是相当于把原数组克隆一份，把克隆的这一份的数组中的对应项改变了)

```js
arr.map(function (value, index, array) {
    //do something
    return XXX
})
var ary = [12, 23, 24, 42, 1]
var res = ary.map(function (item, index, ary) {
    return item * 10
})
console.log(res) //-->[120,230,240,420,10]  原数组拷贝了一份，并进行了修改
console.log(ary) //-->[12,23,24,42,1]；  原数组并未发生变化
```

### 6.filter

不会改不原数组， 返回新数组

```js
var arr = [
    {id: 1, text: 'aa', done: true},
    {id: 2, text: 'bb', done: false},
]
console.log(arr.filter((item) => item.done))
// 转为ES5
arr.filter(function (item) {
    return item.done
})
var arr = [73, 84, 56, 22, 100]
var newArr = arr.filter((item) => item > 80) //得到新数组 [84, 100]
console.log(newArr, arr)
```

### 7.every

every()是对数组中的每一项运行给定函数，如果该函数对每一项返回 true,则返回 true。

```js
var arr = [1, 2, 3, 4, 5, 6]
console.log(
    arr.every(function (item, index, array) {
        return item > 3
    })
)
// false
```

### 8. some

some()是对数组中每一项运行指定函数，如果该函数对任一项返回 true，则返回 true。

```js
var arr = [1, 2, 3, 4, 5, 6]
console.log(
    arr.some(function (item, index, array) {
        return item > 3
    })
)
// true
```

### 9. reduce

方法接收一个函数作为累加器（accumulator），数组中的每个值（从左到右）开始缩减，最终为一个值。

```js
var total = [0, 1, 2, 3, 4]
    .reduce((a, b) => a + b) //10
    [
    // reduce接受一个函数，函数有四个参数，分别是：上一次的值，当前值，当前值的索引，数组

    (0, 1, 2, 3, 4)
    ].reduce(function (previousValue, currentValue, index, array) {
    return previousValue + currentValue
})
```

### 10. reduceRight

reduceRight()方法的功能和 reduce()功能是一样的，不同的是 reduceRight()从数组的末尾向前将数组中的数组项做累加。
reduceRight()首次调用回调函数 callbackfn 时，prevValue 和
curValue 可以是两个值之一。如果调用 reduceRight() 时提供了 initialValue 参数，则 prevValue 等于 initialValue，curValue 等于
数组中的最后一个值。如果没有提供
initialValue 参数，则 prevValue 等于数组最后一个值， curValue 等于数组中倒数第二个值

```js
var arr = [0, 1, 2, 3, 4]
arr.reduceRight(function (preValue, curValue, index, array) {
    return preValue + curValue
}) // 10
```

### 11. find

find()方法返回数组中符合测试函数条件的第一个元素。否则返回 undefined

```js
var stu = [
    {
        name: '张三',
        gender: '男',
        age: 20,
    },
    {
        name: '王小毛',
        gender: '男',
        age: 20,
    },
    {
        name: '李四',
        gender: '男',
        age: 20,
    },
]

function getStu(element) {
    return element.name == '李四'
}

stu.find(getStu)
//返回结果为
//{name: "李四", gender: "男", age: 20}

// ES6方法

stu.find((element) => element.name == '李四')
```

### 12. findIndex

对于数组中的每个元素，findIndex 方法都会调用一次回调函数（采用升序索引顺序），直到有元素返回 true。只要有一个元素返回
true，findIndex 立即返回该返回 true 的元素的索引值。如果数组中没有任何元素返回
true，则 findIndex 返回 -1。 findIndex 不会改变数组对象。

```js
;[1, 2, 3]
    .findIndex(function (x) {
        x == 2
    })
    [
    // 返回索引值1

    (1, 2, 3)
    ].findIndex((x) => x == 4)
// 返回索引值 -1.
```

### 13. keys，values，entries

ES6 提供三个新的方法 —— entries()，keys()和 values() —— 用于遍历数组。它们都返回一个遍历器对象，可以用 for...of
循环进行遍历，唯一的区别是 keys()是对键名的遍历、values()
是对键值的遍历，entries()是对键值对的遍历

```js
for (let index of ['a', 'b'].keys()) {
    console.log(index)
}
// 0
// 1
for (let elem of ['a', 'b'].values()) {
    console.log(elem)
}
// 'a'
// 'b'
for (let [index, elem] of ['a', 'b'].entries()) {
    console.log(index, elem)
}
// 0 "a"
// 1 "b"
```

## 便利对象

### 1. for...in

循环遍历对象自身的和继承的可枚举属性(循环遍历对象自身的和继承的可枚举属性(不含 Symbol 属性).)

```js
var obj = {0: 'a', 1: 'b', 2: 'c'}
for (var i in obj) {
    console.log(i, obj[i])
}
// 0 a
// 1 b
// 2 c
```

### 2.Object.keys()

返回一个数组,包括对象自身的(不含继承的)所有可枚举属性(不含 Symbol 属性)

```js
var obj = {0: 'a', 1: 'b', 2: 'c'}
Object.keys(obj).forEach((key) => {
    console.log(key, obj[k])
})
// 0 a
// 1 b
// 2 c
```

### 3.Object.values

方法对象中属性值的数组

### 4.Object.getOwnPropertyNames(obj)

返回一个数组,包含对象自身的所有属性(不含 Symbol 属性,但是包括不可枚举属性)

```js
var obj = {0: 'a', 1: 'b', 2: 'c'}

Object.getOwnPropertyNames(obj).forEach(function (key) {
    console.log(key, obj[key])
})
```

### 5.Reflect.ownKeys(obj)

返回一个数组,包含对象自身的所有属性,不管属性名是 Symbol 或字符串,也不管是否可枚举

```js
var obj = {0: 'a', 1: 'b', 2: 'c'}
Reflect.ownKeys(obj).forEach(function (key) {
    console.log(key, obj[key])
})
```

### 6.Object.entries

Object.entries()方法返回一个给定对象自身可枚举属性的键值对数组，其排列与使用 for...in 循环遍历该对象时返回的顺序一致（区别在于
for-in 循环还会枚举原型链中的属性）。
可以返回其可枚举属性的键值对的对象。给定对象自身可枚举属性的键值对数组。

```js
const obj = {foo: 'bar', baz: 42}
console.log(Object.entries(obj)) // [ ['foo', 'bar'], ['baz', 42] ]

// array like object
const obj = {0: 'a', 1: 'b', 2: 'c'}
console.log(Object.entries(obj)) // [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ]

// array like object with random key ordering
const anObj = {100: 'a', 2: 'b', 7: 'c'}
console.log(Object.entries(anObj)) // [ ['2', 'b'], ['7', 'c'], ['100', 'a'] ]

// getFoo is property which isn't enumerable
const myObj = Object.create(
    {},
    {
        getFoo: {
            value() {
                return this.foo
            },
        },
    }
)
myObj.foo = 'bar'
console.log(Object.entries(myObj)) // [ ['foo', 'bar'] ]

// non-object argument will be coerced to an object
console.log(Object.entries('foo')) // [ ['0', 'f'], ['1', 'o'], ['2', 'o'] ]

// iterate through key-value gracefully
const obj = {a: 5, b: 7, c: 9}
for (const [key, value] of Object.entries(obj)) {
    console.log(`${key} ${value}`) // "a 5", "b 7", "c 9"
}

// Or, using array extras
Object.entries(obj).forEach(([key, value]) => {
    console.log(`${key} ${value}`) // "a 5", "b 7", "c 9"
})
```

## map 和 forEach 方法区别

- forEach(): 针对每一个元素执行提供的函数(executes a provided function once for each array element)。
- map(): 创建一个新的数组，其中每一个元素由调用数组中的每一个元素执行提供的函数得来(creates a new array with the results
  of calling a provided function on
  every element in the calling array)。

## 事件委托是什么

> 事件委托也叫事件代理，原理就是利用事件冒泡机制实现，也就是把子元素的事件绑定到父元素上。

> 如果子元素阻止了事件冒泡，那么委托也就不成立

> 阻止事件冒泡：e.stopPropagation()

> addEventListener('click', 函数名, true/false)

> 提高性能：减少事件的绑定，也就减少了内存的占用

## 图片懒加载考虑哪些问题，实现的大概逻辑

懒加载也叫延迟加载，指的是在长网页中延迟加载图像，是一种很好优化网页性能的方式。

懒加载的优点：

提升用户体验，加快首屏渲染速度； 减少无效资源的加载； 防止并发加载的资源过多会阻塞 js 的加载； 懒加载的原理：

首先将页面上的图片的 src 属性设为空字符串，而图片的真实路径则设置在 data-original 属性中，当页面滚动的时候需要去监听
scroll 事件，在 scroll
事件的回调中，判断我们的懒加载的图片是否进入可视区域，如果图片在可视区内则将图片的 src 属性设置为 data-original
的值，这样就可以实现延迟加载。

## 统计用户停留时长

统计用户访问时长，如何优雅地发送统计数据到服务器（答：提到在路由里实现， 要提到防抖节流，回答防抖和节流的原理）

- 1.监听路由变化监听事件

```
beforeRouteEnter(to, from, next) {
// 在渲染该组件的对应路由被 confirm 前调用
// 不！能！获取组件实例 `this`
// 因为当守卫执行前，组件实例还没被创建
},
beforeRouteLeave(to, from, next) {
// 导航离开该组件的对应路由时调用
// 可以访问组件实例 `this`
}
```

- 2.页面切换

```js
document.addEventListener('visibilitychange', function (event) {
    console.log(document.hidden, document.visibilityState)
})
```

[精确统计页面停留时长](https://cloud.tencent.com/developer/article/1408482)

[统计用户停留时长](https://blog.csdn.net/weixin_45731450/article/details/114746433)

- 上传数据 对于单页内部跳转是即时上报

## CommonJS 和 ES6 module 的区别是什么

[CommonJS 和 ES6 module 的区别是什么](https://www.zhihu.com/question/62791509)

## exports 和 module.exports 的区别

[exports 和 module.exports 的区别](https://blog.csdn.net/fhjdzkp/article/details/109384991)

## Symbol 有什么用

### 作为对象的属性值

[作为对象的属性值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
symbol 是一种基本数据类型 （primitive data type）。Symbol()函数会返回 symbol
类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的 symbol
注册，且类似于内建对象类，但作为构造函数来说它并不完整，因为它不支持语法："new Symbol()"。

每个从 Symbol()返回的 symbol 值都是唯一的。一个 symbol 值能作为对象属性的标识符；这是该数据类型仅有的目的

## Map 和 WeakMap

## Set 和 weakSet

[区别](https://segmentfault.com/a/1190000023291620)

## ES5 实现 ES6 的 let

也就是说，var 声明的变量由于不存在块级作用域所以可以在全局环境中调用，而 let 声明的变量由于存在块级作用域所以不能在全局环境中调用。

由以上的分析可知，我们可以通过模拟块级作用域来实现 let。

```js
function outputNum(count) {
    //块级作用域
    ;(function () {
        for (var i = 0; i < count; i++) {
            console.log(i)
        }
    })()
    console.log(i)
}

outputNum(5)
```

## 数组转对象方法

### 创建新对象 循环复制

```js
var test = ['a', 'b', 'c']

function toObj(arr) {
    var result = {}
    for (var i = 0; i < arr.length; i++) {
        result[i] = arr[i]
    }
    return result
}

console.log(toObj(test)) //{0: "a", 1: "b", 2: "c"}
```

```js
var test = ['a', 'b', 'c']
Object.assign({}, test)
console.log(Object.assign({}, test)) //{0: "a", 1: "b", 2: "c"}
```

```js
var test = ['a', 'b', 'c']
console.log({...test})
```

## 对象转数组方法

## 实现 (5).add(3).minus(2) 功能

```js
Number.prototype.add = function (n) {
    return this + n
}

Number.prototype.minus = function (n) {
    return this - n
}
```

## bind、call、apply 的区别

都是改变this指向和函数的调用，call和apply的功能类似，只是传参的方法不同

call方法传的是一个参数列表

apply传递的是一个数组

bind传参后不会立刻执行，会返回一个改变了this指向的函数，这个函数还是可以传参的，bind()()

call方法的性能要比apply好一些，所以call用的更多一点

```js
let name = 'Jack'
const obj = {name: 'Tom'}

function sayHi() {
    console.log('Hi! ' + this.name)
}

sayHi() // Hi! Jack
sayHi.call(obj) // Hi! Tom

// bind也是改变this指向，不过不是在调用时生效，而是返回一个新函数。

const newFunc = sayHi.bind(obj)
newFunc() // Hi! Tom
```

## 自执行函数 用于什么场景

好处
::: tip
自执行函数:

1、声明一个匿名函数

2、马上调用这个匿名函数。

作用：创建一个独立的作用域。

好处：防止变量弥散到全局，以免各种 js 库冲突。隔离作用域避免污染，或者截断作用域链，避免闭包造成引用变量无法释放。利用立即执行特性，返回需要的业务函数或对象，避免每次通过条件判断来处理

场景：一般用于框架、插件等场景
:::

## promise 原理 手写 Promise

## toLocalString 使用

> 1.toLocaleString（） 数字分割 会改变原数据 重新生成一个新数据

```js
const numOne = 123456.123
const n2 = numOne.toLocaleString()
console.log(n2, numOne) // 123,456.123 123456.123
console.log(n2 === numOne) // false
console.log(Number(numOne.toFixed(2)).toLocaleString()) // 123,456.12
```

> 2.toLocaleString() 数据转为百分比 // 12%

```js
const numTwo = 0.12
console.log(numTwo.toLocaleString('zh', {style: 'percent'})) // 12%
```

> 3.toLocaleString() 数字转换为货币表示法 // ¥1,000,000.00

```js
const numThree = 1000000
console.log(
    numThree.toLocaleString('zh', {style: 'currency', currency: 'cny'})
) // ¥1,000,000.00
```

## 前端性能优化

[前端性能优化](https://segmentfault.com/a/1190000041753539)

## 考察对象转字符串 a 是什么值得时候执行 if 里边的语句

```js
let a = {
    valueOf() {
        return 0
    },
}
if (++a === 1 && ++a === 2 && ++a === 3) {
    console.log(4)
}
```

> 当然你也可以重写 Symbol.toPrimitive ，该方法在转基本类型时调用优先级最高。

```js
let a = {
    valueOf() {
        return 0
    },
    toString() {
        return '1'
    },
    [Symbol.toPrimitive]() {
        return 2
    },
}
1 + a // => 3
'1' + a // => '12'
```

[对象转基本类型](https://www.jianshu.com/p/c1872ec363cb)

## [] == ![] 是否相等

[为何返回 false](https://segmentfault.com/a/1190000008594792)

## 谈谈对事件代理的理解

- js 的事件流

> 事件冒泡: 当子元素触发某个事件的时候, 该元素会依次向上触发父元素的同类事件

> 事件捕获: 和冒泡类似, 只不过事件的顺序相反, 即从上级节点传送到下级节点

- 事件代理的概念

> 事件代理也称事件委托, 是把原本需要绑定在子元素上的事件委托给它的父元素, 让父元素来监听子元素的冒泡事件,
> 并在子元素触发事件时找到这个子元素.(e.targets)

     - 事件代理实现步骤:

      - 明确要添加事件元素的父级元素
      - 给父元素定义事件, 监听子元素的冒泡事件
      - 使用event.target来定位出发事件冒泡的的子元素

- 事件代理的优点

  > 减少事件的定义, 减少内存消耗

  > 可以为 DOM 操作的元素动态绑定事件

> 使用场景: 与用户交互的时候使用

## DOM 的概念

> DOM (Document Object Model), 是 js 为了操作 html 和 css 提供的 api 接口

> 注意: HTML 中的每个标签元素, 属性, 文本都能看作是一个 DOM 的节点, 构成了 DOM 树

- DOM 的常用操作:

    - 获取节点:

  document.getElementById, document.getElementsByName, document.getElementsByClassName, document.getElementsByTagName
  querySelector(), querySelectorAll(),

    - 获取/设置属性值

      getAttribute(key)
      setAttribute(key, value)

    - 创建节点

      createElement()
      createTextNode()
      createAttribute()

    - 增加节点

      appendChild()
      insertBefore()

    - 删除节点

      removeChild()

    - 其他常用方法

      parentNode() // 返回父节点

      children() // 返回所有子节点 只返回 html

      childNodes // 返回所有子节点, 包括文本, HTML, 属性节点

      firstNode/lastNode

      nextSibling // 下一个兄弟节点

      previousSibling // 上一个兄弟节点

    - 样式

  document.style.display = "none"

      document.style.cssText = "color: red; background: blue"

## 前端继承方案

- 继承的概念:

  > 父类的属性和方法可以被子类继承, 子类可以调用子类的属性和方法

- 前端常用继承方式:

```js
function Parent() {
    this.name = name
}

function Child() {
}
```

### 1.原型链继承

> 让一个构造函数的原型，是另一个类型的实例。那么这个构造函数new出来的实例就具有该实例的属性。

```js
Child.prototype = new Parent()
```

:::warning
优点：写法简单 容易理解

缺点:

- 01.不能给父构造函数传参

- 02.对象实例共享所有继承的属性和方法
  :::

### 2.构造函数继承

> 在子构造函数内部调用父构造函数；使用call() 和 apply() 方法将父对象构造函数绑定到子类身上；

```js
function Child(name) {
    Parent.call(this, name)
}
```

:::warning
缺点:

-
    1. 方法都在构造函数中定义, 因此无法实现函数复用
-
    2. 在父类原型中定义的属性和方法，对子类而言也是不可见的，结果所有类型都只能使用构造函数模式

优点:

- 解决了原型链继承不能传参的问题 和 父类的原型共享的问题。
  :::

例子:

```js
function Parent(age) {
    this.names = ['tom', 'jack']
    this.age = age
}

function Child(age) {
    Parent.call(this, age)
}

var child1 = new Child(18)
child1.names.push('mike')

console.log(child1.names, child1.age) // ["tom", "jack", "mike"] 18

var child2 = new Child(20)

console.log(child2.names, child2.age) //["tom", "jack"] 20
```

### 3.组合继承(常用)

> 原型链继承和构造函数式继承组合到一块。 使用原型链实现对原型属性和方法的继承，而通过借用构造函数继承来实现实例属性的继承。
> 这样既通过原型链上的方法实现了函数的复用。
> 又能保证每个实例都有自己的属性

```js
 function Person(gender) {
    console.log('执行次数');
    this.info = {
        name: "yyy",
        age: 19,
        gender: gender
    }
}

Person.prototype.getInfo = function () {   // 使用原型链继承原型上的属性和方法
    console.log(this.info.name, this.info.age)
}


function Child(gender) {
    Person.call(this, gender) // 使用构造函数法传递参数
}

Child.prototype = new Person()
Child.prototype.constructor = Child

let child1 = new Child('男');
child1.info.nickname = 'xxx'
child1.getInfo()
console.log(child1.info); // {age: 19, gender: "男", name: "yyy", nickname: "xxx"}

let child2 = new Child('女');
console.log(child2.info); // {age: 19, gender: "女", name: "yyy"}
```

:::warning

优点：融合原型链继承和构造函数式继承的优点。

缺点：父类的构造函数执行了两遍：一次在子类的构造函数中 call 方法执行一遍，一次在子类原型实例化父类的时候执行一遍。
:::

### 4.寄生组合式继承 通过Object.create()避免重复调用父类构造函数，高效且无副作用

```js

function Parent(name) {
    this.name = name;
}

Parent.prototype.sayName = function () {
    console.log(this.name)
};

function Child(name) {
    Parent.call(this, name); // 继承属性
}

Child.prototype = Object.create(Parent.prototype); // 继承方法
Child.prototype.constructor = Child;

const child = new Child('Child');
child.sayName(); // 输出 "Child"
```

### 5.ES6 extends 继承

> Class通过extends关键字实现继承，其实质是先创造出父类的this对象， 然后用子类的构造函数修改this
> 子类的构造方法中必须调用super方法，且只有在调用了super()之后才能使用this，
> 因为子类的this对象是继承父类的this对象，然后对其进行加工，
> 而super方法表示的是父类的构造函数，用来新建父类的this对象

```javascript
    class Animal {
    constructor(kind) {
        this.kind = kind
    }

    getKind() {
        return this.kind
    }
}

// 继承Animal
class Cat extends Animal {
    constructor(name) {
        // 子类的构造方法中必须先调用super方法
        super('cat');
        this.name = name;
    }

    getCatInfo() {
        console.log(this.name + '：' + super.getKind())
    }
}

const cat1 = new Cat('buding');
cat1.getCatInfo(); // buding：cat
```

:::warning
优点：语法简单易懂,操作更方便。
缺点：并不是所有的浏览器都支持class关键字
:::

## 设计模式的概念

> 设计模式: 一套反复使用的、 多数人知晓的、 经过分类编目的、 代码设计经验的总结, 是解决软件设计常见的可复用方案. 一种有 23
> 种设计模式.

### 前端常见的设计模式

- 单例模式: 一个类只能有一个实例, 并提供一个访问它的全局访问点. 应用: 弹框, ajax 封装等
- 工厂模式: 用固定的方式批量创建对象, 应用: 后台登录健全, 用工厂模式判断用户的角色和权限列表
- 观察者模式: 设立观察者方法, 观察是否有值更新, 通过 Object.defineProperty, 修改其他对象的属性
- 订阅模式: 发布者内容变化, 通过中间层接受并通知订阅者, 订阅者收到通知, 更新对应的属性 以及其他模式, 应用于: vue2 中的
  v-model 双向绑定

### 判断对象是否为空

```javascript
// 判断对象是否为空

const isEmpty = (obj) => {
    return Reflect.ownKeys(obj).length === 0
}

const isEmpty1 = (obj) => {
    return JSON.stringify(obj) === '{}'
}

const isEmpty2 = (obj) => {
    return Object.keys(obj).length === 0
}

const isEmpty3 = (obj) => {
    return Object.getOwnPropertyNames(obj).length === 0
}

const isEmpty4 = (obj) => {
    let bool = true
    for (let key in obj) {
        if (key) {
            bool = false
            break
        }
    }
    return bool
}
const s = Symbol('sss')
const obj = {
    [s]: 1,
}

console.log(isEmpty(obj))
console.log(isEmpty1(obj))
console.log(isEmpty2(obj))
console.log(isEmpty3(obj))
console.log(isEmpty4(obj))
```

---

## **作用域链核心概念**

1. **作用域（Scope）**  
   作用域是变量和函数的可访问范围。JavaScript 中有：

- **全局作用域**：最外层，任何地方都可访问。
- **函数作用域**：函数内部定义的变量。
- **块级作用域**（ES6+）：由 `let`/`const` 在 `{}` 内定义的变量。

2. **词法作用域（Lexical Scope）**  
   JavaScript 的作用域是静态的（词法作用域），即作用域在代码**书写时**确定，而非运行时。

---

### **作用域链的生成**

- 当函数被调用时，会创建一个**执行上下文（Execution Context）**，其中包含：
    - **活动对象（也叫变量对象）（VO/AO）**：存储当前上下文的变量和函数声明。
    - **作用域链（Scope Chain）**：由当前变量对象 + 所有父级作用域的变量对象组成。
    - `this` 指向。

- **链的形成**  
  作用域链按函数**定义时的嵌套关系**逐级向上链接，形成一条链。例如：
  ```javascript
  function outer() {
    const a = 1;
    function inner() {
      console.log(a); // 通过作用域链找到 outer 中的 a
    }
    inner();
  }
  ```
  `inner` 的作用域链：`inner AO → outer AO → 全局 VO`。

---

### **变量查找规则**

- 当访问变量时，JavaScript 会**沿作用域链逐级向上查找**：
    1. 先在当前作用域的变量对象中查找。
    2. 找不到则向父级作用域查找。
    3. 直到全局作用域，若仍找不到，则报错（如 `ReferenceError`）。

---

### **闭包与作用域链**

闭包是函数与其词法作用域的结合。**内部函数保留对外部作用域的引用**，即使外部函数已执行完毕：

```javascript
function createCounter() {
    let count = 0;
    return function () {
        count++; // 通过作用域链访问外部函数的 count
        return count;
    };
}

const counter = createCounter();
console.log(counter()); // 1
```

- `counter` 函数的作用域链保留了 `createCounter` 的变量对象，因此能持续访问 `count`。

---

### **关键点总结**

1. **静态性**：作用域链在函数定义时确定，与调用位置无关。
2. **链式结构**：由当前作用域到全局作用域的层级链接。
3. **闭包的本质**：通过作用域链保留对父级变量的引用。

## setTimeout最小执行时间是多少？

> HTML5规定的内容： setTimeout最小执行时间是4ms setInterval最小执行时间是10ms

## ES6和ES5有什么区别？

JS的组成：ECMAScript BOM DOM

ES5:ECMAScript5,2009年ECMAScript的第五次修订，ECMAScript2009

ES6:ECMAScript6,2015年ECMAScript的第六次修订，ECMAScript2015，是JS的下一个版本标准

## ES6的新特性有哪些？

1.新增块级作用域（let,const）
不存在变量提升
存在暂时性死区的问题
块级作用域的内容
不能在同一个作用域内重复声明

2.新增了定义类的语法糖（class）

3.新增了一种基本数据类型（symbol）

4.新增了解构赋值
从数组或者对象中取值，然后给变量赋值

5.新增了函数参数的默认值

6.给数组新增了API

7.对象和数组新增了扩展运算符

8.Promise
解决回调地狱的问题。
自身有all,reject,resolve,race方法
原型上有then,catch
把异步操作队列化
三种状态：pending初始状态,fulfilled操作成功,rejected操作失败
状态：pending -> fulfilled;pending -> rejected 一旦发生，状态就会凝固，不会再变
async await
同步代码做异步的操作，两者必须搭配使用
async表明函数内有异步操作，调用函数会返回promise
await是组成async的表达式，结果是取决于它等待的内容，如果是promise那就是promise的结果，如果是普通函数就进行链式调用
await后的promise如果是reject状态，那么整个async函数都会中断，后面的代码不执行

9.新增了模块化（import,export）

10.新增了set和map数据结构
set就是不重复
map的key的类型不受限制

11.新增了generator

12.新增了箭头函数
不能作为构造函数使用，不能用new
箭头函数就没有原型
箭头函数没有arguments
箭头函数不能用call,apply,bind去改变this的执行
this指向外层第一个函数的this

## 用递归的时候有没有遇到什么问题

如果一个函数内可以调用函数本身，那么这个就是递归函数
函数内部调用自己
特别注意：写递归必须要有退出条件return

### 解释一下什么是json

JSON是一种纯字符串形式的数据，它本身不提供任何方法，适合在网络中进行传输
JSON数据存储在.json文件中，也可以把JSON数据以字符串的形式保存在数据库、Cookies中
JS提供了JSON.parse() JSON.stringify()
什么时候使用json：定义接口；序列化；生成token；配置文件package.json

### 有没有做过无感登录？

1.在相应其中拦截，判断token返回过期后，调用刷新token的接口
2.后端返回过期时间，前端判断token的过期时间，去调用刷新token的接口
3.写定时器，定时刷新token接口
流程：
1.登录成功后保存token 和 refresh_token
2.在响应拦截器中对401状态码引入刷新token的api方法调用
3.替换保存本地新的token
4.把错误对象里的token替换
5.再次发送未完成的请求
6.如果refresh_token过期了，判断是否过期，过期了就清楚所有token重新登录

### 大文件上传是怎么做的

分片上传：
1.把需要上传的文件按照一定的规则，分割成相同大小的数据块
2.初始化一个分片上传任务，返回本次分片上传的唯一标识
3.按照一定的规则把各个数据块上传
4.发送完成后，服务端会判断数据上传的完整性，如果完整，那么就会把数据库合并成原始文件
断点续传：
服务端返回，从哪里开始 浏览器自己处理

## 字符串API

## 属性 length

```js
const str = 'abc'
str.length // 3
```

## 迭代器

```js
const str = 'The quick red fox jumped over the lazy dog\'s back.'

const iterator = str[Symbol.iterator]()
let theChar = iterator.next()
while (!theChar.done && theChar.value !== ' ') {
    console.log(theChar.value)
    theChar = iterator.next()
}
// expected output: "T"
//                  "h"
//                  "e"l,mn b
```

## charAt

```js
const str = 'The quick red fox jumped over the lazy dog\'s back.'

for (let i = 0; i < str.length; i++) {
    console.log(str.charAt(i))
}
```

## charCodeAt

> charCodeAt() 方法返回 0 到 65535 之间的整数，表示给定索引处的 UTF-16 代码单元

```js
const sentence = 'The quick brown fox jumps over the lazy dog.'

const index = 4

console.log(`The character code ${sentence.charCodeAt(index)} is equal to ${sentence.charAt(index)}`)
// expected output: "The character code 113 is equal to q"
```

## charPointAt

> codePointAt() 方法返回 一个 Unicode 编码点值的非负整数

```js
console.log('ABC'.codePointAt(1))        // 66
console.log('\uD800\uDC00'.codePointAt(0)) // 65536
console.log('XYZ'.codePointAt(42)) // 查不到返回undefined 
console.log('XYZ'.codePointAt()) // 88
console.log('XYZ'.codePointAt(1)) // 89
console.log('XYZ'.codePointAt(2)) // 90
```

## concat

```js
let hello = 'Hello, '
console.log(hello.concat('Kevin', '. Have a nice day.'))
```

## endWith

```js
const str1 = 'Cats are the best!'

console.log(str1.endsWith('best!'))
// expected output: true

console.log(str1.endsWith('best', 17))
// expected output: true

const str2 = 'Is this a question?'

console.log(str2.endsWith('question'))
// expected output: false
```

## fromCharCode

```js
console.log(String.fromCharCode(189, 43, 190, 61)) // "½+¾="
```

## formCodePoint

```js
String.fromCodePoint(42)       // "*"
String.fromCodePoint(65, 90)   // "AZ"
String.fromCodePoint(0x404)    // "\u0404"
String.fromCodePoint(0x2F804)  // "\uD87E\uDC04"
String.fromCodePoint(194564)   // "\uD87E\uDC04"
String.fromCodePoint(0x1D306, 0x61, 0x1D307) // "\uD834\uDF06a\uD834\uDF07"

String.fromCodePoint('_')      // RangeError
String.fromCodePoint(Infinity) // RangeError
String.fromCodePoint(-1)       // RangeError
String.fromCodePoint(3.14)     // RangeError
String.fromCodePoint(3e-2)     // RangeError
String.fromCodePoint(NaN)      // RangeError
```

## includes

```js
const str = 'ABC'
console.log(str.includes('a')) // false
console.log(str.includes('A')) // true
```

## indexOf lastIndexOf

> 在chrome测试 全部返回1：也就是说都是共字符串的起始位置查询

```js
const str = 'ABCD'
console.log(str.indexOf('B'))
console.log(str.lastIndexOf('B'))
```

## localCompare

> 不知道做啥用的

## match matchAll

```js
const paragraph = 'The quick brown fox jumps over the lazy dog. It barked.'
const regex = /[A-Z]/g
const found = paragraph.match(regex)

console.log(found);
// expected output: Array ["T", "I"]
```

```js
const regexp = /t(e)(st(\d?))/g
const str = 'test1test2'

const array = [...str.matchAll(regexp)]

console.log(array[0])
// expected output: Array ["test1", "e", "st1", "1"]

console.log(array[1])
// expected output: Array ["test2", "e", "st2", "2"]
```

## normalize

```js
const name1 = '\u0041\u006d\u00e9\u006c\u0069\u0065'
const name2 = '\u0041\u006d\u0065\u0301\u006c\u0069\u0065'

console.log(`${name1}, ${name2}`)
// expected output: "Amélie, Amélie"
console.log(name1 === name2)
// expected output: false
console.log(name1.length === name2.length)
// expected output: false

const name1NFC = name1.normalize('NFC')
const name2NFC = name2.normalize('NFC')

console.log(`${name1NFC}, ${name2NFC}`)
// expected output: "Amélie, Amélie"
console.log(name1NFC === name2NFC);
// expected output: true
console.log(name1NFC.length === name2NFC.length)
// expected output: true
```

## padEnd

> padEnd()  方法会用一个字符串填充当前字符串（如果需要的话则重复填充），返回填充后达到指定长度的字符串。从当前字符串的末尾（右侧）开始填充。

```js
const str1 = 'Breaded Mushrooms'

console.log(str1.padEnd(25, '.'))
// expected output: "Breaded Mushrooms........"

const str2 = '200';

console.log(str2.padEnd(5))
// expected output: "200  "
```

## padStart

> padStart() 方法用另一个字符串填充当前字符串 (如果需要的话，会重复多次)，以便产生的字符串达到给定的长度。从当前字符串的左侧开始填充。

```js
const str1 = '5'
console.log(str1.padStart(2, '0'))
// expected output: "05"
const fullNumber = '2034399002125581'
const last4Digits = fullNumber.slice(-4)
const maskedNumber = last4Digits.padStart(fullNumber.length, '*')
console.log(maskedNumber);
// expected output: "************5581"
```

## raw

```js
let name = "Bob"
String.raw`Hi\n${name}!`
// "Hi\nBob!"，内插表达式还可以正常运行
```

## repeat

```js
const str = 'XYZ'
console.log(str.repeat(3))
```

## replace

```js
const p = 'The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?'

console.log(p.replace('dog', 'monkey'))
// expected output: "The quick brown fox jumps over the lazy monkey. If the dog reacted, was it really lazy?"


const regex = /Dog/i
console.log(p.replace(regex, 'ferret'))
// expected output: "The quick brown fox jumps over the lazy ferret. If the dog reacted, was it really lazy?"
```

## replaceAll

```js
const p = 'The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?'

console.log(p.replaceAll('dog', 'monkey'));
// expected output: "The quick brown fox jumps over the lazy monkey. If the monkey reacted, was it really lazy?"


// global flag required when calling replaceAll with regex
const regex = /Dog/ig;
console.log(p.replaceAll(regex, 'ferret'))
// expected output: "The quick brown fox jumps over the lazy ferret. If the ferret reacted, was it really lazy?"
```

## search

```js
const paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?'

// any character that is not a word character or whitespace
const regex = /[^\w\s]/g

console.log(paragraph.search(regex))
// expected output: 43

console.log(paragraph[paragraph.search(regex)])
// expected output: "."
```

## slice

```js
const str = 'The quick brown fox jumps over the lazy dog.'

console.log(str.slice(31))
// expected output: "the lazy dog."

console.log(str.slice(4, 19))
// expected output: "quick brown fox"

console.log(str.slice(-4))
// expected output: "dog."

console.log(str.slice(-9, -5))
// expected output: "lazy"

```

## split

```js
const str = 'The quick brown fox jumps over the lazy dog.'

const words = str.split(' ')
console.log(words[3])
// expected output: "fox"

const chars = str.split('')
console.log(chars[8])
// expected output: "k"

const strCopy = str.split()
console.log(strCopy)
// expected output: Array ["The quick brown fox jumps over the lazy dog."]

```

## startWith

```js
const str1 = 'Saturday night plans'

console.log(str1.startsWith('Sat'))
// expected output: true

console.log(str1.startsWith('Sat', 3))
// expected output: false

```

## substring

```js
var anyString = "Mozilla"

// 输出 "Moz"
console.log(anyString.substring(0, 3))
console.log(anyString.substring(3, 0))
console.log(anyString.substring(3, -3))
console.log(anyString.substring(3, NaN))
console.log(anyString.substring(-2, 3))
console.log(anyString.substring(NaN, 3))

// 输出 "lla"
console.log(anyString.substring(4, 7))
console.log(anyString.substring(7, 4))

// 输出 ""
console.log(anyString.substring(4, 4))

// 输出 "Mozill"
console.log(anyString.substring(0, 6))

// 输出 "Mozilla"
console.log(anyString.substring(0, 7))
console.log(anyString.substring(0, 10))

```

## toLocaleLowerCase toLocalUpperCase

```js
'ALPHABET'.toLocaleLowerCase() // 'alphabet'

'\u0130'.toLocaleLowerCase('tr') === 'i'    // true
'\u0130'.toLocaleLowerCase('en-US') === 'i' // false

let locales = ['tr', 'TR', 'tr-TR', 'tr-u-co-search', 'tr-x-turkish']
'\u0130'.toLocaleLowerCase(locales) === 'i' // true
```

## toLowerCase toUpperCase

```js
console.log('中文简体 zh-CN || zh-Hans'.toLowerCase())
// 中文简体 zh-cn || zh-hans
console.log("ALPHABET".toLowerCase())
// "alphabet"
```

## toString valueOf

```js
var x = new String("Hello world")

alert(x.toString())      // 输出 "Hello world"
```

```js
var x = new String('Hello world')
console.log(x.valueOf()) // Displays 'Hello world'

```

## trim trimEnd trimStart

```js
var orig = '   foo  '
console.log(orig.trim()) // 'foo'

// 另一个 .trim() 例子，只从一边删除

var orig = 'foo    '
console.log(orig.trim())// 'foo'
```

## 数组 API (37)

## 稀疏数组

```js
const arr = [1, 2, 3, 4, 5]
delete arr[1] // true
console.log(arr) // [1, empty, 3, 4, 5]

const arr2 = [1, , 3, 4, 5]
console.log(arr2) // [1, empty, 3, 4, 5]
console.log(arr2[1]) // undefined
```

## 类数组 （本身是对象）

```js
function test(...arr) {
    console.log(arguments)
    // [...arguments].forEach(item => {console.log(item)})  Chrome浏览器不支持此语法
    arr.push('1')
}

test(1, 2, 3, 4, 5)

```

### 02.类数组对象 DomList

```html

<ul>
    <li></li>
    <li></li>
    <li></li>
</ul>
```

```js
const nodeList = document.querySelectorAll('ul > li')
```

### 03.类数组 字符串

```js
const str = '12345'
str.push('a')
console.log(str) // Uncaught TypeError: str.push is not a function

const str2 = '12345'
Array.prototype.push.call(str2, 'a') // Cannot assign to read only property 'length' of object '[object String]'at String.push 

const str3 = '12345'
Array.prototype.forEach.call(str3, function (item) {
    console.log(item) // 1 2 3 4 5
})
```

> 总结： 字符串无法使用数组中改变字符串长度的方法 可以使用数组的便利方法

## 1.转字符串 (3)

### 01.转字符串的方法 toString 原数组不改变 返回新的字符串

```js
const arr = [1, 2, 3, 4, 5]
const str = arr.toString()
console.log(arr, str) // [1, 2, 3, 4, 5] '1, 2, 3, 4, 5'

// 基本类型可以直接变为字符串 可以多层
const arr2 = [1, [2, [3, [4], 5], 6], 7]
const str2 = arr2.toString()
console.log(str2, arr2) // 1,2,3,4,5,6,7 [1, [2, [3, [4], 5], 6], 7]

const array1 = [1, 'a', new Date('21 Dec 1997 14:12:00 UTC')]
const localeString = array1.toLocaleString('en', {timeZone: 'UTC'})

console.log(localeString)
// expected output: "1,a,12/21/1997, 2:12:00 PM",
// This assumes "en" locale and UTC timezone - your results may vary
```

### 02 转字符串方法 join 原数组不改变 返回新的字符串

```js
const arr = [1, 2, 3, 4]
const str = arr.join('-')
console.log(str, arr) // 1-2-3-4 [1, 2, 3, 4]

const arr2 = [1, [2, [3, [4], 5], 6], 7]
const str2 = arr2.join()
console.log(str2, arr2) // 1,2,3,4,5,6,7  [1, [2, [3, [4], 5], 6], 7]

const str3 = arr2.join('')
console.log(str3) // 1,2,3,4,5,67
```

> 数组转字符串的逆操作

```js
const str = '1,2,3,4,5,6,7'
const arr = str.split(',')
console.log(str, arr) // 1,2,3,4,5,6,7 ['1', '2', '3', '4', '5', '6', '7']
```

## 2.堆栈方法 (4)

> push() 返回值 => 增加数组后的长度
> pop() 返回值 => 删除的项目
> unshift() 返回值 => 增加数组后的长度
> shift() 返回值 => 删除的项目

```js
const arr = [1, 2, 3, 4, 5]
const res = arr.push(6) // 返回改变后数组长度 直接修改原数组
console.log(arr, res) // [1, 2, 3, 4, 5, 6] 6

const item = arr.pop()
console.log(arr, item) // [1, 2, 3, 4, 5] 6

const res2 = arr.unshift(0)
console.log(arr, res2) // [0, 1, 2, 3, 4, 5] 6

const item2 = arr.shift()
console.log(arr, item2) // [1, 2, 3, 4, 5] 0
```

> 堆栈 API push pop unshift shift 直接修改原数组。 如果需要备份原数据。 需要做深 Copy。

## 3.数组的排序 (2)

### 倒序 反序 reverse()

```js
const arr = [1, 2, 3, 4, 5]
const arr2 = arr.reverse()
console.log(arr, arr === arr2) // [5, 4, 3, 2, 1] true 返回倒序之后的原数组 内存地址没变 数组元素顺便改变啦
```

### 排序 sort

> sort() 方法用于对数组的元素进行排序，并返回数组。默认排序顺序是根据字符串 UniCode 码。因为排序是按照字符串 UniCode
> 码的顺序进行排序的，所以首先应该把数组元素都转化成字符串（如有必要），以便进行比较。

> 语法：arr.sort(sortBy), 参数 sortby 可选，用来规定排序的顺序，但必须是函数。

### 1.按照字母排序

```js
const arr = ['tom', 'ami', 'love', 'sai', 'fei']
console.log(arr.sort()) // ['ami', 'fei', 'love', 'sai', 'tom']
```

### 2.还是按照字母排序

```js
const arr = [12, 323, 1000, 50]
const arr2 = arr.sort()
console.log(arr, arr === arr2) //[1000, 12, 323, 50] true  返回排序之后的原数组 新数组和原数组内存地址一致 元素顺序改变啦
```

> 纳尼，这次排序似乎没有得到想要的结果。。。。。。

> 如果要得到自己想要的结果，不管是升序还是降序，就需要提供比较函数了。该函数比较两个值的大小，然后返回一个用于说明这两个值的相对顺序的数字。

> 比较函数应该具有两个参数 a 和 b，其返回值如下：

> 若 a 小于 b，即 a - b 小于零，则返回一个小于零的值，数组将按照升序排列。

> 若 a 等于 b，则返回 0。

> 若 a 大于 b, 即 a - b 大于零，则返回一个大于零的值，数组将按照降序排列。

### 3.升序

```js
function sortNum(a, b) {
    return a - b
}

const arr = new Array(12, 323, 1000, 50)
console.log(arr.sort(sortNum)) // (4) [12, 50, 323, 1000]
```

### 4.降序

```js
function sortNum(a, b) {
    return b - a
}

const arr = new Array(12, 323, 1000, 50)
console.log(arr.sort(sortNum)) //
```

### 5.按照数组对象中某个属性值进行排序

```js
const arr = [
    {name: '刘备', age: 30},
    {name: '关羽', age: 20},
    {name: '张飞', age: 55},
    {name: '赵云', age: 45},
]

function compare(prop) {
    debugger
    return function (a, b) {
        console.log(a, b, '比较函数')
        const v1 = a[prop]
        const v2 = b[prop]
        return v1 - v2
    }
}

console.log(arr.sort(compare('age')))
```

### 6.根据参数来确定是升序还是降序

```js
const arr = [
    {name: '刘备', age: 30},
    {name: '关羽', age: 20},
    {name: '张飞', age: 55},
    {name: '赵云', age: 45},
]

function sortBy(attr, rev) {
    if (rev == undefined) {
        rev = 1
    } else {
        rev = rev ? 1 : -1
    }
    return function (a, b) {
        a = a[attr]
        b = b[attr]
        if (a < b) {
            return rev * -1
        }
        if (a > b) {
            return rev * 1
        }
        return 0
    }
}

console.log(arr.sort(sortBy('age', true)))
console.log(arr.sort(sortBy('age', false)))
```

output:

```
[
  { name: '关羽', age: 20 },
  { name: '刘备', age: 30 },
  { name: '赵云', age: 45 },
  { name: '张飞', age: 55 }
]
[
  { name: '张飞', age: 55 },
  { name: '赵云', age: 45 },
  { name: '刘备', age: 30 },
  { name: '关羽', age: 20 }
]
```

### 7.根据参数来确定是升序还是降序

```js
const arr = [1, 2, 3, 4, 5]

console.log(arr.sort(function () {
    return Math.random() - 0.5
}))
```

### 8.随机数组 shuffle 没看懂

```js
Array.prototype.shuffle = function () {
    let m = this.length, i;
    while (m) {
        i = (Math.random() * m--) >>> 0;
        [this[m], this[i]] = [this[i], this[m]];
        // console.log(i);
    }
    return this;
}
const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
arr.shuffle()
```

> 参考地址： https://segmentfault.com/a/1190000019945332

## 数组的拼接 cancat (1)

```js
const arr = [1, 2]
console.log(arr.concat(3, 4)) // [1, 2, 3, 4]
console.log(arr.concat([3, 4])) // [1, 2, 3, 4]
console.log(arr.concat(3, [4])) // [1, 2, 3, 4]
console.log(arr) // [1, 2] 返回新数组
```

> 代替方案

```js
const arr = [1, 2]
console.log([...arr, 3, 4], arr) // [1, 2, 3, 4]  [1, 2] 展开运算法不改变原数组
```

## 数组的删改方法 splice slice (2)

```js
const arr = [1, 2, 3, 4, 5]
console.log(arr, arr.slice(2)) // [1, 2, 3, 4, 5] [3, 4, 5]
console.log(arr, arr.slice(2, 4)) // [1, 2, 3, 4, 5] [3, 4] 左闭右开 【 )
console.log(arr, arr.slice(4, 2)) // [] 
console.log(arr, arr.slice(-2)) // [4, 5] 
console.log(arr, arr.slice(-2, -1)) // [4] 

const str = '123456'
Array.prototype.slice.call(str) // ['1', '2', '3', '4', '5', '6']

function test() {
    console.log(Array.prototype.slice.call(arguments)) // [1, 2, 3, 4]
}

test(1, 2, 3, 4)
```

> slice的作用 数组截取 类数组转为数组

```js
const arr = [1, 2, 3, 4, 5]
console.log(arr, arr.splice(2)) // [1, 2] [3, 4, 5] splice直接改变原数组： 返回删除元素组成的新数组 

const arr2 = [1, 2, 3, 4, 5]
console.log(arr2, arr2.splice(4)) //[5] 从下标4 左闭右开 包含起始位置元素

const arr3 = [1, 2, 3, 4, 5]
console.log(arr3, arr3.splice(-2)) //[4, 5] 从下标-2开始截取到结束

const arr4 = [1, 2, 3, 4, 5]
console.log(arr4, arr4.splice()) // [1, 2, 3, 4, 5] []

const arr5 = [1, 2, 3, 4, 5]
console.log(arr5, arr5.splice(0, 2)) //[3, 4, 5] [1, 2]

const arr6 = [1, 2, 3, 4, 5]
console.log(arr6, arr6.splice(0, 2)) //[3, 4, 5] [1, 2]

const arr7 = [1, 2, 3, 4, 5]
console.log(arr7, arr7.splice(0, NaN, 'a', 'b', 'c')) // ['a', 'b', 'c', 1, 2, 3, 4, 5] []

const arr8 = [1, 2, 3, 4, 5]
console.log(arr8, arr8.splice(0, 2, ...['a', 'b', 'c'])) // ['a', 'b', 'c', 3, 4, 5] [1, 2]
```

## 数组索引方法 indexOf lastIndexOf includes (3)

> 语法： arr.indexOf(item,start)
> item必须是查找的元素

```js
const arr = [1, 2, 3, 4, 5, 6, 7, 8]
console.log(arr.indexOf(3)) // 2
console.log(arr.lastIndexOf(1)) // 0

const arr2 = [{a: 1, b: 2}, {a: 3, b: 4}]
console.log(arr2.indexOf(item => item.a === 3)) // -1 貌似对象无法使用 indexOf
console.log(arr2.lastIndexOf(item => item.a === 3)) // -1 貌似对象无法使用 indexOf

console.log(arr.includes(2), arr2.includes(item => item.a === 3)) // true false 
```

> tips: indexOf 和 lastIndexOf 功能类似了 都是从数组起始位置查询

## 创建数组的方法 Array() arr.fill() Array.of() Array.form() (3)

```js
const arr = [1, 2, 3, 4, 5]
console.log(arr, arr.fill('x', 0, 2))// [x, x, 3, 4, 5] [x, x, 3, 4, 5] 直接改变了原数组

const arr2 = Array(3)
const arr3 = Array(3, 4, 5)
console.log(arr2, arr3) //[empty × 3] [3, 4, 5]

const arr4 = Array.of(3)
const arr5 = Array.of(3, 4, 5)
console.log(arr4, arr5) // [3] [3, 4, 5]

console.log(Array.from('12345')) // ['1', '2', '3', '4', '5']
console.log([...'12345']) // ['1', '2', '3', '4', '5']
```

> tips: Array.of() 是为了解决 Array() 创建数组的时候返回值不一致的问题
> Array.from 把类数组组转为数组 类似展开运算符

## 查找 find findIndex findLast findLastIndex(4)

```js
const users = [{name: 'Dendi', age: 88}, {name: 'Tom', age: 18}]
const user = users.find(function (u) {
    return u.age === 18
})
const index = users.findIndex(function (u) {
    return u.age === 18
})
console.log(user, index) // {name: 'Tom', age: 18} 1

const users2 = [{name: 'Dendi', age: 88}, {name: 'Tom', age: 18}]
const user2 = users2.findLast(function (u) {
    return u.age === 18
})
const index2 = users2.findLastIndex(function (u) {
    return u.age === 18
})
console.log(user2, index2) // {name: 'Tom', age: 18} 1
```

## 数组的遍历方法 !== 遍历数组的方法 (10)

> Array.keys Array.values Array.entries
> some every filter reduce reduceRight map forEach

```js
const obj = {a: 1, b: 2, c: 3, d: 4, e: 6}

for (let key of Object.keys(obj)) {
    console.log(key) // a b c d e
}
for (let value of Object.values(obj)) {
    console.log(value) // 1 2 3 4 5
}
for (let [key, value] of Object.entries(obj)) {
    console.log(key, value)  // a 1 b 2 c 3 d 4 e 5
}

const arr = ['a', 'b', 'c', 'd', 'e']

for (let key of arr.keys()) {
    console.log(key) // 0 1 2 3 4
}
for (let value of arr.values()) {
    console.log(value) // a b c d e
}
for (let [key, value] of arr.entries()) {
    console.log(key, value) // 0 a 1 b 2 c 3 d 4 e
}
```

> a.forEach 没有返回值 手动写return语句也无效 b. 第二个参数可以改变this指向

```js
const arr = [1, 2, 3, 4]
arr.forEach((val, idx, arr) => {
    console.log(val, idx, arr)
})

Array.prototype.forEach.call([1, 2, 3, 4], (val, idx, arr) => {
    console.log(val, idx, arr)
})

const arr = [1, 2, 3, 4].forEach((val, idx, arr) => {
    console.log(val, idx, arr)
})
console.log(arr) // undefined 返回值

console.log([1, 2].forEach((val, idx, arr) => {
    return 1
})) // undefined

const obj = {a: 1}
console.log([1, 2].forEach(function (val, index, arr) {
    console.log(this, 'this')
}, obj)) // undefined

const obj2 = {
    name: 'Tom',
    times: [1, 2, 3],
    print() {
        console.log(this)
        this.times.forEach(function (time) {
            console.log(this) // obj2
        }, this)
    }
}

const obj2 = {
    name: 'Tom',
    times: [1, 2, 3],
    print() {
        console.log(this)
        this.times.forEach((time) => {
            console.log(this)
        })
    }
}
```

> 稀疏数组数组 forEach遍历会跳过数组元素为空的项 for for...of 不会

```js
const arr1 = [1, , 3] // [1, empty, 3]
// const arr2 = [1, 2, 3] delete arr2[2] 
arr1.forEach((item, index) => {
    console.log(index) // 0 2
    console.log(item) // 1, 3 
})

for (let i = 0; i < arr1.length; i++) {
    console.log(arr1[i]) // 1 undefined 3
}

for (let val of arr1) {
    console.log(val) // // 1 undefined 3
}
```

> 语句中断执行

```js
const arr = [1, 2, 3]

for (let i = 0; i < arr.length; i++) {
    if (i === 1) {
        break
    }
    console.log(i) // 0
}

for (let i = 0; i < arr.length; i++) {
    if (i === 1) {
        continue
    }
    console.log(i) // 0 2
}

const arr2 = [1, 2, 3]
arr2.forEach((item, index, arr) => {
    console.log(index, 'index')
    if (item * 1 === 2) {
        return false
    }
    console.log(item, 'v')
})
```

```js
function x() {
    [...arguments].forEach((item, index, arr) => {
        console.log(item) // 1 2 3
    })
    console.log(arguments, 'argument')
}

x(1, 2, 3)

const x2 = (...argv) => {
    argv.map()
}
x2(4, 5, 6)
```

```js
const arr = [1, 2, 3]
const arr2 = arr.map(item => item * 2)
console.log(arr2)

const arr3 = ['a', 'b', 'c']
const arr4 = [1, 2].map(function (item, index, arr) {
    return this[index]
}, arr3)

console.log(arr4) // ['a', 'b']

const users = [
    {name: 'Dendi', age: 18, sex: 0},
    {name: 'Tom', age: 19, sex: 0},
    {name: 'kitty', age: 20, sex: 1},
]
const nameList = users.map(item => item.name)
console.log(nameList)

function test(arr) {
    const result = arr.map(arr2 => {
        return arr2.sort((a, b) => a - b)[arr2.length - 1]
    })
    console.log(result) // [7, 63, 432, 7567] 每项最大值
}

test([
    [4, 5, 6, 7],
    [12, 33, 45, 63],
    [123, 432, 423, 234],
    [1234, 5435, 4564, 7567]
])
```

> filter 返回满足条件的元素的集合

```js
const arr = [1, 2, 3]
const arr2 = arr.filter(function (item, index, arr) {
    return true
})
console.log(arr2)
console.log(arr)

const arr4 = [1, 2, 3, undefined, 4, null, 5, -1, 0]
var arr5 = arr4.filter(function (item, index, arr) {
    return item != undefined // undefined == null &&  undefined === undefined
})
```

> some every

```js
const arr = [1, 2, 3]
const bool = arr.some(item => {
    console.log('some')
    return item === 2
})
const bool02 = arr.every(item => {
    console.log('every')
    return item === 2
})
console.log(bool, bool02)
```

> reduce

```js
// 01.求和
const arr = [0, 1, 2, 3, 4]
const res = arr.reduce((previousValue, currentValue, currentIndex, arr) => {
    console.log(previousValue, currentValue, currentIndex, arr, '99')
    return previousValue + currentValue
})
console.log(res)

// 02.数组元素为对象的求和

const initialValue = 0
const sum = [
    {x: 0},
    {x: 1},
    {x: 2},
    {x: 3},
    {x: 4},
]
const res = sum.reduce((previousValue, currentValue, currentIndex, arr) => {
    console.log(currentIndex)
    return previousValue + currentValue.x
}, initialValue)
console.log(res)

// 03.将二维数组转为一维数组
const flattened = [[0, 1], [2, 3], [4, 5]].reduce(
    function (previousValue, currentValue) {
        return previousValue.concat(currentValue)
    },
    []
)
// flattened is [0, 1, 2, 3, 4, 5]

// 04. 计算数组中每个元素出现的次数

let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice']

let countedNames = names.reduce(function (allNames, name) {
    if (name in allNames) {
        allNames[name]++
    } else {
        allNames[name] = 1
    }
    return allNames
}, {})
// countedNames is:
// { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }
```

## 判断是否为数组 Array.isArray (1)

```js
const bool01 = Array.isArray({})
const bool02 = Array.isArray([])
console.log(bool01, bool02)
```

## 打平数组 flat flatMap (2)

```js
const arr1 = [0, 1, 2, [3, 4]]

console.log(arr1.flat());
// expected output: [0, 1, 2, 3, 4]

const arr2 = [0, 1, 2, [[[3, 4]]]]

console.log(arr2.flat(2))
// expected output: [0, 1, 2, [3, 4]]

const arr1 = [1, 2, [3], [4, 5], 6, []]
const flattened = arr1.flatMap(num => num)
console.log(flattened)
// expected output: Array [1, 2, 3, 4, 5, 6]
```

## copyWithin (1)

```js
const array1 = ['a', 'b', 'c', 'd', 'e'];

// copy to index 0 the element at index 3
console.log(array1.copyWithin(0, 3, 4));
// expected output: Array ["d", "b", "c", "d", "e"]

// copy to index 1 all elements from index 3 to the end
console.log(array1.copyWithin(1, 3));
// expected output: Array ["d", "d", "e", "d", "e"]
```

## 实验性原型方法 (3)

> at group groupToMap

```js
const array1 = [5, 12, 8, 130, 44];

let index = 2;

console.log(`Using an index of ${index} the item returned is ${array1.at(index)}`);
// expected output: "Using an index of 2 the item returned is 8"

index = -2;

console.log(`Using an index of ${index} item returned is ${array1.at(index)}`);
// expected output: "Using an index of -2 item returned is 130"

```

## 数组方法哪些会改变原数组

以下是 JavaScript 数组中会改变原数组的 API 列表：

1. **`push()`**  
   在数组末尾添加元素，返回新长度。

2. **`pop()`**  
   删除并返回数组的最后一个元素。

3. **`shift()`**  
   删除并返回数组的第一个元素。

4. **`unshift()`**  
   在数组开头添加元素，返回新长度。

5. **`sort()`**  
   对数组元素进行排序（按 Unicode 或自定义规则）。

6. **`reverse()`**  
   反转数组元素的顺序。

7. **`splice()`**  
   添加/删除元素（通过指定位置和数量），返回被删除的元素。

8. **`fill(value, start?, end?)`**  
   用固定值填充数组的某一部分（默认填充全部）。

9. **`copyWithin(target, start, end?)`**  
   将数组内部某段元素复制到另一位置（覆盖原内容）。

#### 常见误区：

- **`slice()`、`concat()`、`map()`、`filter()`** 等方法返回新数组，**不会改变原数组**。
- **`sort()` 和 `reverse()`** 会直接修改原数组，而不是返回新数组。
- ES2023 新增的 **`toSorted()`、`toReversed()`、`toSpliced()`** 等方法不会改变原数组，而是返回新数组。

#### 总结：

以上 9 个方法会直接修改原数组，其他数组方法通常返回新数组或非破坏性结果。使用时需注意文档说明以避免副作用。

## 数组 (Array)

attr: length
methods：(34)
concat copyWithin entries every fill filter find findIndex flat flatMap forEach Array.form includes indexOf
Array.isArray join keys lastIndexOf map Array.of pop push reduce reduceRight reverce shift slice some sort splice
toLocalString toString unshift values

[MDN 数组 API](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
[ES5 新增方法](https://segmentfault.com/a/1190000022786002)

JavaScript 的 Array 对象是用于构造数组的全局对象，数组是类似于列表的高阶对象。

### 创建数组

```js
var fruits = ['Apple', 'Banana']

console.log(fruits.length)
// 2
```

### 通过索引访问数组元素

```js
var first = fruits[0]
// Apple

var last = fruits[fruits.length - 1]
// Banana
```

### 遍历数组

1.for 2.for...in 3.for...of 4.forEach 5.map 6.filter 7.values 8.keys 9.values 10.some 11.every 12.fill 13.reduce
14.reduceRight 15.find 16.findIndex

```js
fruits.forEach(function (item, index, array) {
    console.log(item, index);
})
// Apple 0
// Banana 1
```

```js
fruits.forEach(function (item, index, array) {
    console.log(item, index)
})
// Apple 0
// Banana 1
```

### splice(Array) slice(Array) 和 split(String)

splice() 方法通过删除或替换现有元素或者原地添加新的元素来修改数组,并以数组形式返回被修改的内容。此方法会改变原数组。

