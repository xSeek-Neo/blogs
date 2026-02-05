# React 面试题

## React 闭包问题

### 什么是闭包

闭包就是: 函数“记住”了它定义时的词法作用域。函数在别处执行时，仍然可以访问当时作用域里的变量，因为这些变量被函数引用而不会被释放。

### React 中的闭包陷阱

在 React 函数组件中，每次渲染都会重新执行函数，创建新的闭包。当 `useEffect`、`useCallback`、`useMemo` 等 Hook 的回调函数**闭包了某次渲染时的 state/props**，且依赖项未正确设置时，就会拿到**过期的值**，即「陈旧闭包」（stale closure）。

#### 常见陷阱

##### 1. useState：异步与批量更新导致“拿到旧值”

```tsx
export default function Hooks() {
  const [count, setCount] = useState(0);
  const add = () => {
    setCount(count + 1);
    console.log(count, '修改前的值');
  };
  return (
    <div>
      <span>{count}</span>
      <button onClick={add}> + </button>
    </div>
  );
}
```

问题：点击后 UI 更新了，但日志仍是上一次的值。原因是状态更新是异步/批量的，当前闭包里仍是旧值。

解决：使用函数式更新 + `useRef` 获取最新值。

```tsx
export default function Hooks() {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  countRef.current = count;

  const add = () => {
    setCount(prev => prev + 1);
    setTimeout(() => {
      console.log(count, '修改前的值');
      console.log(countRef.current, '修改后的值');
    }, 0);
  };

  return (
    <div>
      <span>{count}</span>
      <button onClick={add}> + </button>
    </div>
  );
}
```

##### 2. useState：连续多次 setState 只生效最后一次

```tsx
const add = () => {
  console.log('value1: ', count);
  setCount(count + 1);
  console.log('value2: ', count);
  setCount(count + 2);
  console.log('value3: ', count);
  setCount(count + 3);
  console.log('value4: ', count);
};
```

问题：传普通值时，只会生效最后一次更新。

解决：用函数式更新，保证每次基于上一次计算。

```tsx
const add = () => {
  console.log('value1: ', count);
  setCount(prev => prev + 1);
  console.log('value2: ', count);
  setCount(prev => prev + 2);
  console.log('value3: ', count);
  setCount(prev => prev + 3);
  console.log('value4: ', count);
};
```

##### 3. useEffect：过期闭包导致定时器读到旧值

```tsx
export default function Hooks3() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCount(count + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    setInterval(() => {
      console.log(`Count: ${count}`);
    }, 1000);
  }, []);

  return <span>{count}</span>;
}
```

问题：`count` 一直停在 1。原因是 effect 只执行一次，闭包里读的是首次渲染的快照。

解决：补齐依赖 + 清理副作用，或改用函数式更新。

```tsx
export default function Hooks() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(`Count: ${count}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [count]);

  return <span>{count}</span>;
}
```

补充：多个副作用应拆成多个 `useEffect`；effect 返回的函数会在卸载或依赖变化时执行，用来清理副作用。

##### 4. useCallback：依赖缺失导致子组件拿到旧值

```tsx
function Child(props) {
  const log = useCallback(() => {
    console.log(props.count, '子组件打印的props');
  }, []);
  return (
    <>
      count: {props.count}
      <button onClick={log}> 打印 </button>
    </>
  );
}
```

问题：`props.count` 变化了，但 `log` 里仍是旧值，因为依赖数组为空。

解决：补齐依赖。

```tsx
const log = useCallback(() => {
  console.log(props.count, '子组件打印的props');
}, [props.count]);
```

#### 小结

- 闭包陷阱本质是：回调函数捕获了旧的渲染快照
- 优先用函数式更新避免读取旧 state
- 依赖项必须写全，或用 `useRef` 保存最新值
- 副作用记得清理，避免重复订阅或计时器泄漏


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
