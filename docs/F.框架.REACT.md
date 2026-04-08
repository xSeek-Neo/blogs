# React 面试题

## React 闭包问题

### 什么是闭包

闭包就是: 函数“记住”了它定义时的词法作用域。函数在别处执行时，仍然可以访问当时作用域里的变量，因为这些变量被函数引用而不会被释放。

### React 中的闭包陷阱

在 React 函数组件中，每次渲染都会重新执行函数，创建新的闭包。当 `useEffect`、`useCallback`、`useMemo` 等 Hook 的回调函数**闭包了某次渲染时的 state/props**，且依赖项未正确设置时，就会拿到**过期的值**，即「陈旧闭包」（stale closure）。

### 解决方案

#### 1. 函数式更新 setState（推荐）

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1); // 始终基于最新状态
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

#### 2. 正确设置依赖项

```tsx
useEffect(() => {
  const handler = () => console.log(keyword);
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}, [keyword]); // keyword 变化时重新订阅
```

#### 3. 用 useRef 保存最新值（需要「最新值」但不触发重新执行 effect）

```tsx
function Search() {
  const [keyword, setKeyword] = useState('');
  const keywordRef = useRef(keyword);
  keywordRef.current = keyword; // 每次渲染都更新

  useEffect(() => {
    const handler = () => {
      console.log(keywordRef.current); // 始终是最新值
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []); // 只需订阅一次

  return <input value={keyword} onChange={e => setKeyword(e.target.value)} />;
}
```

#### 4. useCallback 避免子组件拿到旧的回调

```tsx
const handleClick = useCallback(() => {
  doSomething(count);
}, [count]); // 依赖 count，每次 count 变化都会生成新函数
```

### 小结

- React 函数组件每次渲染都是新闭包，Hook 回调会闭包当时的 props/state
- 依赖项要写全，否则容易产生陈旧闭包
- 能用函数式更新 `setState` 的尽量用，不依赖闭包里的 state
- 需要「只订阅一次但读到最新值」时，用 `useRef` 存最新值

## useEffect 和 useLayoutEffect 有什么区别

- useEffect 的 callback， 准确来说是同步调用的， 会等主线程任务执行完成，DOM更新， JS 执行完整 视图绘制完成 才执行
- useLayoutEffect 的 cb，是同步执行 执行时时机是DOM更新之后。 视图绘制完成之前 这个时间可以更方便的修改DOM

- 使用：如果需要修改DOM 使用useLayoutEffect 其他都是用 useEffect

### useInsertionEffect

- useInsertionEffect 比 useLayoutEffect 更早。useInsertionEffect执行时， DOM海没有更新。
- 本质上 useInsertionEffect 主要是解决CSS-in-js 在渲染中注入样式的性能问题。


## react saga 使用
[react saga 使用](https://www.jianshu.com/p/b17d8bec13f3)


## 21个React性能优化技巧

[21个React性能优化技巧](https://www.infoq.cn/article/KVE8xtRs-uPphptq5LUz)


## React错误边界处理
[React错误边界处理](https://github.com/bvaughn/react-error-boundary)

## HOOK模拟生命周期
![原型链](~@imgs/react-lifeCycle.png)

1. 挂载阶段 constructor --> getDerivedStateFormProps --> render --> componentDidMount
2. 更新阶段 getDerivedStateFormProps --> shouldComponentUpdate --> render --> getSnapshotBeforeUpdate --> componentDidUpdate
3. 卸载阶段 componentWillUnmount

```tsx
1. getDerivedStateFormProps

const [state, setState] = useState(() => {
    console.log('getDerivedStateFormProps')
    return ''
})
2. componentDidMount componentWillUnmount
useEffect(() => {
  console.log("componentDidMount");
    return () => {
        console.log('componentWillUnmount')
    }
  // 请求数据...
}, []);  // 空数组 → 只执行一次

3. shouldComponentUpdate
React.memo / useMemo / useCallback     → shouldComponentUpdate

4. componentDidUpdate
const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    console.log("componentDidUpdate");
  });

5.getSnapshotBeforeUpdate
useLayoutEffect(() => {
  console.log("DOM 更新前同步执行: getSnapshotBeforeUpdate");
});

```

### Hook 的使用 有哪些注意事项

1.只能在最外层使用 - 不能写作循环 条件判断或者其他的函数中 需要确保hook在最外层调用
2.只能在react相关的函数中调用hook - a.不能在普通的js函数中调用hook b.只能在react函数组建 和 自定义hook中调用

### 为什么要有Hook

1.组建之间复用状态逻辑比较困难
2.复杂组建会变的难以理解 类组建会有很多复杂的生命周期等问题
3.难以理解的class

https://blog.csdn.net/qq_16546829/article/details/137056845


## tsx/jsx 转换成普通js语法过程

1.@babel/parse 把jsx 转成 AST语法
2.@babel/traverse 去做转换
3.@babel/generator 把AST 生成新的代码（低版本浏览器兼容代码  或 React.createElement语法）
4. React.createElement 返回的就是vDom (虚拟DOM)

## useMemo 和 useCallback 区别

共同点：入参是一样的
回调函数: callback
依赖项deps: 依赖项数组，当依赖项发生变化时 回调函数会被重新创建，这点根useEffect一样

返回值不一样：
useCallback: 返回当前所缓存的这个函数
useMemo: 返回这个函数执行后的一个结果

第二点不同：
useCallback 适合缓存一些函数
useMemo 适合缓存复杂计算后的值

### 面试版梳理（建议背这个）

一句话：

- **useMemo**：缓存“**一次计算的结果值**”（避免每次 render 都重复算）。
- **useCallback**：缓存“**函数本身的引用**”（避免每次 render 都生成新函数引用）。

心智模型：

- React 组件每次 render 都会重新执行函数体，因此 **普通变量/普通函数都会重新创建**。
- `useMemo/useCallback` 做的是“**在依赖不变时，复用上一次的结果/函数引用**”，它们不是让组件“少 render”，而是让某些计算/引用“别重复”。

最常见使用场景：

- **useMemo**：
  - 计算开销明显（大列表过滤/排序、复杂派生数据），且依赖没变时希望复用结果。
  - 你要把一个对象/数组作为 props 传给 `React.memo` 子组件（让引用稳定，避免子组件无意义重渲染）。
- **useCallback**：
  - 你要把事件处理函数作为 props 传给 `React.memo` 子组件（引用稳定）。
  - 你把某个回调放进 `useEffect/useMemo` 依赖数组里（不希望因为函数引用变动导致 effect/memo 反复触发）。

什么时候别用（高频坑）：

- **不要为了“看起来专业”到处加**：`useMemo/useCallback` 本身也有成本（存储、依赖比较、复杂度上升）。
- **如果子组件没 `memo`、回调也不进依赖数组**：`useCallback` 往往没有收益。
- **如果计算很轻**：`useMemo` 可能得不偿失（算一次很快，但你增加了维护成本）。

依赖数组怎么写（面试常问）：

- 依赖数组要写“**回调/计算里用到的、且可能变化的外部值**”（props/state/来自闭包的变量）。
- 依赖写错会带来两类 bug：
  - **漏依赖**：拿到旧值（stale closure），表现为点击/订阅用的还是老 state。
  - **多依赖/不稳定依赖**：每次都变，导致 memo/effect 形同虚设（例如把内联对象/函数塞进依赖）。

`useCallback` vs `useMemo` 关系（经典追问）：

- `useCallback(fn, deps)` 等价于 `useMemo(() => fn, deps)`
- 只是语义上更直观：一个“缓存函数”，一个“缓存值”。

三个高频追问（回答要点）：

- **useCallback 一定提升性能吗？**
  - 不一定。只有在“需要引用稳定”的地方（`memo` 子组件、依赖数组）才可能带来收益，否则可能是负优化。
- **为什么加了 useCallback 子组件还是 render？**
  - 因为触发子组件 render 的不止回调：别的 props（对象/数组）引用也可能每次变；或子组件本身没有 `React.memo`；或 context/父组件结构变化导致它仍然要 render。
- **useMemo 缓存值会不会缓存过期？**
  - 不会“自动过期”，它完全由 deps 决定；deps 不变就复用旧值，所以 deps 必须准确。

## 什么是“引用稳定”（为什么内联 onClick/onChange 可能影响性能）

在 React 里，函数也是对象。只要组件重新渲染，像 `() => {}` 这种写法会**创建一个全新的函数引用**。

- **引用稳定**：多次渲染之间，拿到的是“同一个函数对象”（引用不变）。
- **引用不稳定**：每次渲染都是“新的函数对象”（引用总在变）。

这件事本身通常不“慢”，真正容易产生性能差异的是：**你的优化依赖“引用不变”**（例如 `React.memo` 的浅比较、`useEffect/useMemo` 的依赖数组）。

### 场景 1：函数 props 传给 `React.memo` 子组件（浅比较被“击穿”）

父组件每次渲染都给子组件传一个新函数，`memo` 会认为 props 变了，从而子组件仍然重渲染：

```tsx
import React, { memo, useState } from "react";

const Child = memo(function Child({ onClick }: { onClick: () => void }) {
  console.log("Child render");
  return <button onClick={onClick}>child</button>;
});

export default function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>parent +</button>

      {/* ❌ 每次 Parent render 都会创建新函数 -> Child 也会 render */}
      <Child onClick={() => console.log("child click")} />
    </div>
  );
}
```

用 `useCallback` 让引用稳定后，Parent 因为 `count` 变化而重渲染时，Child 就能更容易跳过渲染：

```tsx
import React, { memo, useCallback, useState } from "react";

const Child = memo(function Child({ onClick }: { onClick: () => void }) {
  console.log("Child render");
  return <button onClick={onClick}>child</button>;
});

export default function Parent() {
  const [count, setCount] = useState(0);

  const handleChildClick = useCallback(() => {
    console.log("child click");
  }, []);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>parent +</button>

      {/* ✅ onClick 引用稳定 -> Child 不会被无意义重渲染 */}
      <Child onClick={handleChildClick} />
    </div>
  );
}
```

### 场景 2：订阅/绑定事件（`useEffect` 依赖里放了函数，导致重复解绑/绑定）

如果 effect 依赖里有一个“每次 render 都变”的函数，就会导致 effect 反复执行（解绑再绑定）：

```tsx
import React from "react";

export default function Comp() {
  const onResize = () => {
    console.log("resize");
  };

  React.useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]); // ❌ onResize 每次 render 都是新引用 -> effect 每次都重跑

  return <div>open console</div>;
}
```

用 `useCallback` 稳定引用后，只有依赖真的变化时才会重新订阅：

```tsx
import React from "react";

export default function Comp() {
  const onResize = React.useCallback(() => {
    console.log("resize");
  }, []);

  React.useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]); // ✅ 引用稳定 -> 不会无意义重跑

  return <div>open console</div>;
}
```

### 小结（什么时候该在意）

- **需要在意**：handler 作为 props 传给 `React.memo` 子组件；或 handler 出现在 `useEffect/useMemo` 等依赖数组里，并且组件渲染很频繁。
- **一般不用纠结**：handler 只在当前组件内部用、没传给子组件、也不参与依赖优化时，内联写法通常没问题。

