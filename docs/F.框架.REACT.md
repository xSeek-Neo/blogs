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
