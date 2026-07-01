# 异步并发

## 浏览器的事件循环机制

### 基本概念

JavaScript 是**单线程**的，这意味着同一时间只能执行一个任务。为了避免阻塞，JavaScript 使用事件循环（Event Loop）机制来处理异步操作。

**为什么是单线程？**
- 主要用途是与用户交互和操作 DOM
- 多线程操作 DOM 会带来复杂的同步问题（如一个线程删除节点，另一个线程同时操作该节点）
- 即使有 Web Worker，它也受主线程控制，不能操作 DOM

**事件循环的工作机制**

浏览器通过**任务队列**和**事件循环**的机制，将各种任务进行分类排队，按照一定的优先级和顺序逐一执行。这种排队机制既保证了主线程任务的有序性，又能够动态调整任务的优先级，从而在多种场景下提供最佳的用户体验。

在浏览器运行中，有些操作是无法立即完成的，例如：
- 网络请求
- 定时器到期后的回调
- 文件读写
- I/O 操作

这些异步操作会被放入相应的任务队列中，等待事件循环机制调度执行。

### 核心组成部分

#### 1. 执行栈（Call Stack）
- 所有同步任务在主线程执行，形成一个执行栈
- 函数调用时被推入栈，执行完毕后从栈中弹出

#### 2. 任务队列（Task Queue）
- 主线程之外存在任务队列，存放异步任务
- 分为**宏任务队列**和**微任务队列**

#### 3. 宏任务（Macro Task / Task）
主要包括：
- `script`（整体代码）
- `setTimeout`
- `setInterval`
- `setImmediate`（Node.js）
- `I/O` 操作
- UI 渲染
- UI 交互事件（click、scroll、resize 等）
- `postMessage`
- `MessageChannel`

#### 4. 微任务（Micro Task / Jobs）
主要包括：
- `Promise.then` / `Promise.catch` / `Promise.finally`
- `async/await`（本质是 Promise）
- `queueMicrotask()`
- `MutationObserver`
- `process.nextTick`（Node.js，优先级最高）

### 事件循环执行流程

```
1. 执行全局同步代码（宏任务）
2. 执行栈为空时，检查微任务队列
3. 依次执行所有微任务，直到微任务队列为空
4. 执行下一个宏任务
5. 重复步骤 2-4，形成循环
```

**关键点：**
- 每执行完一个宏任务，都会清空整个微任务队列
- 微任务优先级高于宏任务
- UI 渲染会在微任务队列清空后、下一个宏任务之前执行

### 示例代码分析

#### 示例 1：基本执行顺序

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// 输出顺序：1, 4, 3, 2
```

**执行过程：**
1. 执行同步代码：输出 `1`、`4`
2. 宏任务：`setTimeout` 回调放入宏任务队列
3. 微任务：`Promise.then` 回调放入微任务队列
4. 同步代码执行完毕，执行栈为空
5. 清空微任务队列：输出 `3`
6. 执行下一个宏任务：输出 `2`

#### 示例 2：嵌套 Promise

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('4');
  setTimeout(() => {
    console.log('5');
  }, 0);
});

console.log('6');

// 输出顺序：1, 6, 4, 2, 3, 5
```

**执行过程：**
1. 同步代码：输出 `1`、`6`
2. `setTimeout` 回调放入宏任务队列
3. `Promise.then` 放入微任务队列
4. 执行微任务：输出 `4`，`setTimeout` 回调放入宏任务队列
5. 执行第一个宏任务：输出 `2`，`Promise.then` 放入微任务队列
6. 清空微任务队列：输出 `3`
7. 执行下一个宏任务：输出 `5`

#### 示例 3：async/await

```javascript
async function async1() {
  console.log('1');
  await async2();
  console.log('2');
}

async function async2() {
  console.log('3');
}

console.log('4');

setTimeout(() => {
  console.log('5');
}, 0);

async1();

new Promise(resolve => {
  console.log('6');
  resolve();
}).then(() => {
  console.log('7');
});

console.log('8');

// 输出顺序：4, 1, 3, 6, 8, 2, 7, 5
```

**注意：** `await` 后面的代码会被包装成 `Promise.then` 的微任务

### 执行时机

#### 微任务的执行时机
- 在每个宏任务执行完毕后
- 在 DOM 渲染之前
- 如果在微任务中继续添加微任务，会在当前微任务队列清空时全部执行

#### 宏任务的执行时机
- 在微任务队列清空后
- 在浏览器渲染之前（也可能在渲染之后，取决于浏览器优化）

### 渲染时机

浏览器会在以下时机进行渲染：
- 微任务队列清空后
- 下一个宏任务执行前

```javascript
// 示例：渲染时机
setTimeout(() => {
  console.log('宏任务1');
  document.body.style.backgroundColor = 'red';
}, 0);

Promise.resolve().then(() => {
  console.log('微任务1');
  document.body.style.backgroundColor = 'blue';
});

// 最终背景色为 blue，因为微任务在宏任务之前执行
```

### 常见面试题

#### 题目 1

```javascript
console.log('start');

setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(() => {
    console.log('promise1');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('promise2');
  setTimeout(() => {
    console.log('timer2');
  }, 0);
});

console.log('end');

// 输出：start, end, promise2, timer1, promise1, timer2
```

#### 题目 2

```javascript
Promise.resolve().then(() => {
  console.log('promise1');
  return Promise.resolve();
}).then(() => {
  console.log('promise2');
});

Promise.resolve().then(() => {
  console.log('promise3');
});

// 输出：promise1, promise3, promise2
// 注意：Promise.resolve() 返回的 Promise 需要额外的一次微任务来处理
```

### 与 Node.js 事件循环的区别

| 特性 | 浏览器 | Node.js |
|:--|:--|:--|
| 宏任务队列 | 单个队列 | 多个阶段（timers、pending callbacks、poll、check、close callbacks） |
| 微任务执行时机 | 每个宏任务后 | 每个阶段后 |
| `process.nextTick` | 不支持 | 支持，优先级最高 |
| `setImmediate` | 不支持 | 支持 |

### 性能优化建议

1. **避免长时间运行的同步任务**：会阻塞事件循环
2. **合理使用微任务**：适合高优先级操作，但避免大量嵌套
3. **使用 `requestIdleCallback`**：在浏览器空闲时执行非关键任务
4. **使用 `requestAnimationFrame`**：确保动画流畅性

### 参考资料

- [MDN: 并发模型与事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)
- [Philip Roberts: What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
- [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
