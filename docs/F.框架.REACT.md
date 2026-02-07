# React 面试题

## React 闭包问题

### 什么是闭包

闭包: 函数会记住（捕获）函数定义时可见的变量（引用或值）。在React中，函数（事件处理器、effect、定时器回调等）会捕获当时组建的状态与props。

闭包陷阱：
   - 学术版：当组件的 state 或 props 发生更新时，既有回调仍按创建时的闭包执行，因而读取到的是创建时刻的旧值，导致“陈旧值/状态读取”问题。
   - 口语版：组件的 state/props 变了，但之前创建的回调还在跑，它拿到的还是当时的旧值，所以就会读到“过期的状态”。

### 为什么在React中常见

- 函数组件每次渲染都会创建新的函数和新状态值，但如果你把回调传给外部（setInterval、第三方库、事件监听器）或将他保存在ref变量中，旧回调仍可能被调用并读取旧的闭包环境。

- Hooks（useEffect、useCallback、 useMemo）的依赖数组如果写错，会导致闭包中的值不同步。

### 典型场景与示例 + 修复方法

1. useEffect 中使用状态但依赖数组不完整（最常见）示例（有bug）:

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // 这里的 `count` 是effect创建时的值， 若依赖数组为空会一直是初始值
      setCount(count + 1)
    }, 1000)
  }, []) // ❌ 忘记把count加入依赖

  return (
    <div>
      <h3> React 闭包陷阱 - 01</h3>
      {/* count 不会一直增加 */}
      <p>count：{count}</p>
    </div>
  )
}

```
问题：回调内的count不会更新，会一直使用创建的count。

修复： 
  - 方法A： 把依赖加上或让effect重新创建。

  ```tsx
    useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1)
    }, 1000)
  }, [count]) // 会每次count变化重建定时器 （简单但可能不想重建）
  ```
  -  方法B（推荐）: 使用函数式state更新， 避免读取闭包的就count
    ```tsx
    useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1) // 使用最新的c
    }, 1000)
  }, []) // 安全： 不依赖外部count
  ```

  - 方法C： 用ref保存可变最新值

  ```tsx
  count countRef = useRef(0)
  useEffect(() => {countRef.current = count}, [count])
  useEffect(() => {
    count id = setInterval(() => {
      // 使用countRef.current 即可获得最新值
      setCount(countRef.current + 1)
    }, [count])
    return () => clearInterval(id)
  }, [])
  ```

  

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
