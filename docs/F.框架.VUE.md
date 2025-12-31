# vue 面试题

## 什么是 MVVM

<img class='zoom-imgs' src="https://github.com/scott8013/readme-images/blob/main/WX20210324-203950@2x.png?raw=true" alt="mvvm">

:::tip
MVVM是Model-View-ViewModel的缩写。前端开发的架构模式

M：模型，对应的就是data的数据

V：视图，用户界面，DOM

VM：视图模型：Vue的实例对象，连接View和Model的桥梁
MVVM的核心是提供对View和ViewModel的双向数据绑定，当数据改变的时候，ViewModel能监听到数据的变化，自动更新视图，
当用户操作视图的时候，ViewModel也可以监听到视图的变化，然后通知数据进行改动，这就实现了双向数据绑定
ViewModel通过双向绑定把View和Model连接起来，他们之间的同步是自动的，不需要认为干涉，所以我们只需要关注业务逻辑即可，不需要操作DOM，同时也不需要关注数据的状态问题，因为她是由MVVM统一管理
:::

## v-if 和 v-show 区别

::: tip 相同点 两者都是在判断 DOM 节点是否要显示。
:::

::: tip
不同点
1、实现方式

v-if 是根据后面数据的真假值判断直接从 Dom 树上删除或重建元素节点

v-show 只是在修改元素的 css 样式，也就是 display 的属性值，元素始终在 Dom 树上。

2、编译过程

v-if 切换有一个局部编译/卸载的过程，切换过程中会销毁和重建内部的事件监听和子组件

v-show 只是简单的基于 css 切换

3、编译条件

v-if 是惰性的，如果初始条件为假，则什么也不做只有在条件第一次变为真时才开始局部编译

v-show 是在任何条件下（首次条件是否为真）都被编译，然后被缓存，而且 DOM 元素始终被保留

4、性能消耗

v-if 有更高的切换消耗，不适合做频繁的切换

v-show 有更高的初始渲染消耗，适合做频繁的额切换
:::

:::warning
v-if 是真正的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建
也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 的 “display” 属性进行切换。 所以，v-if
适用于在运行时很少改变条件，不需要频繁切换条件的场景 v-show
则适用于需要非常频繁切换条件的场景
:::

## v-for中的key值的作用是什么

> key属性是DOM元素的唯一标识
> 作用：

- 1.提高虚拟DOM的更新效率
- 2.若不设置key，可能会触发一些bug
- 3.为了触发过度效果

## 说一下你对vue生命周期的理解

> 组件从创建到销毁的过程就是它的生命周期

1.创建
:::tip
a.beforeCreat
时机：组件实例刚创建，但数据观测 (data) 和事件配置 (methods) 未初始化。
用途：常用于插件初始化（如 Vuex 或路由的初始化）

b.created
时机：props, 数据观测 (data)、计算属性 (computed)、方法 (methods) 已初始化，但 DOM 未生成。
用途：发起异步请求（如 API 调用）、初始化非 DOM 相关数据。
:::
2.挂载

:::tip
a.beforeMount
时机：模板编译完成，但尚未将组件挂载到 DOM。
用途：极少使用，一般用于服务端渲染
b.Mounted
时机：组件已挂载到 DOM 上，可以访问 this.$el
用途：操作 DOM（如绑定第三方库）、发起依赖 DOM 的请求
:::

3.更新
:::tip
beforeUpdate
时机：数据变化后，DOM 重新渲染前。

用途：获取更新前的 DOM 状态。
updated
时机：DOM 已更新完成。

用途：执行依赖更新后 DOM 的操作，需避免在此修改数据（可能导致无限循环）。
:::
4.销毁
:::tip
beforeDestroy
时机：组件销毁前，实例仍可用。

用途：清除定时器、取消事件监听、销毁第三方库实例。
destroyed
时机：组件已销毁，所有子实例和事件监听被移除。

用途：执行最后的清理操作。
:::
5.使用了keep-alive时多出两个周期：
activited
组件激活时
deactivited

## 在created和mounted去请求数据，有什么区别

### 1. **触发时机**

- **`created`**：  
  在组件实例创建完成后调用，此时数据观测 (`data`)、计算属性、方法等已初始化，**但 DOM 还未生成**（`this.$el` 不可用）。
- **`mounted`**：  
  在组件首次渲染并挂载到 DOM 后调用，此时可以访问 DOM 元素（`this.$el` 可用）。

### 2. **数据请求的适用场景**

#### **在 `created` 中请求数据**

- **优势**：  
  可以更早发起异步请求，减少用户等待时间（尤其当数据获取和模板渲染不依赖 DOM 时）。
- **适用场景**：
    - 数据不依赖 DOM，仅用于填充模板。
    - 需要服务端渲染（SSR）时，`created` 会在服务端执行，而 `mounted` 不会。
    - 父组件需在子组件挂载前传递数据。

#### **在 `mounted` 中请求数据**

- **优势**：  
  可以操作 DOM，例如初始化第三方库（如地图、图表）。
- **适用场景**：
    - 数据返回后需要直接操作 DOM。
    - 需要确保子组件已挂载，再基于 DOM 布局请求数据（如获取元素尺寸）。

### 3. **用户体验差异**

- **`created` 请求**：  
  数据返回后触发重新渲染，用户可能看到内容从“初始状态”到“数据填充”的变化。
- **`mounted` 请求**：  
  用户可能先看到初始渲染内容（如骨架屏），稍后看到数据更新。

---

### 4. **服务端渲染 (SSR) 注意事项**

- **`created`**：  
  在服务端和客户端均会执行，需确保请求代码兼容 Node.js 环境（如使用 `axios`）。
- **`mounted`**：  
  仅在客户端执行，无法用于服务端预取数据。

---

### 5. **代码示例**

```javascript
// 在 created 中请求（不依赖 DOM）
export default {
    created() {
        this.fetchData(); // 更早发起请求
    },
    methods: {
        async fetchData() {
            const data = await api.get('/data');
            this.items = data;
        },
    },
};

// 在 mounted 中请求（依赖 DOM）
export default {
    mounted() {
        this.initChart(); // 需要 DOM 存在
        this.fetchData();
    },
    methods: {
        initChart() {
            this.chart = new Chart(this.$refs.canvas, {...});
        },
        async fetchData() {
            const data = await api.get('/chart-data');
            this.chart.update(data);
        },
    },
};
```

---

### **总结**

- 优先使用 **`created`**：  
  数据不依赖 DOM，需更快发起请求或支持 SSR。
- 使用 **`mounted`**：  
  需要操作 DOM 或等待子组件挂载。
- **关键考量**：是否需要访问 DOM、服务端渲染兼容性、用户体验优化（如避免内容闪烁）。

## vue中的修饰符有哪些

### 1.事件修饰符

.stop 组织冒泡
.prevent 组织默认行为
.capture 即是给元素添加一个监听器，当元素发生冒泡时，先触发带有该修饰符的元素。若有多个该修饰符，则由外而内触发。
就是谁有该事件修饰符，就先触发谁
.self 只有在event.target是当前元素时触发
.once 事件只会触发一次
.passive 立即触发默认行为
.native 把当前元素作为原生标签看待

### 2.按键修饰符

.enter
.tab
.delete
.esc
.space
.up
.down
.left
.right
.keyup 键盘抬起
.keydown 键盘按下

### 3.系统修饰符

.ctrl
.shift
.alt
.meta

### 4.鼠标修饰符

.left 鼠标左键
.right 鼠标右键
.middle 鼠标中键

### 5.表单修饰符

.lazy 等输入完之后再显示
.trim 删除内容前后的空格
.number 输入是数字或转为数字

### elementui是怎么做表单验证的

1.在表单中加rules属性，然后再data里写校验规则
2.内部添加规则
3.自定义函数校验

### vue如何进行组件通信

- 01.父到子
  :::
    - 01.props
    - 02.父组建默认暴露(defineExpose)方法，父通过模板引用获取子组建实例, 调用子组建暴露方法，并传参
      :::
- 02.子到父
  :::tip
    - 01.父自定义事件，子emit触发自定义事件，并传参给父组建
    - 02.把函数作为属性传给子组建，在子调用函数并传参数
    - 03.作用域插槽 子：`<slot :obj="obj" :age="age"></slot>` 父： `<template #default="{obj, age}"></template>`
    - 03.1作用域插槽 子：`<slot name="slot1" :obj="obj" :age="age"></slot>` 父：
      `<template v-slot:slot1="{obj, age}"></template>`
- :::
- 03.兄弟
  mitt
- 04.祖孙
  provide, inject

useAttrs($attrs)

v-modal + defineModal
pinia

## keep alive 原理

[keep alive 原理](https://cloud.tencent.com/developer/article/1605603)

## keep-alive是什么？怎么使用
`
Vue的一个内置组件，包裹组件的时候，会缓存不活跃的组件实例，并不是销毁他们
作用：把组件切换的状态保存在内存里，防止重复渲染DOM节点，减少加载时间和性能消耗，提高用户体验
`

## keep-alive是什么 怎么使用

Vue的一个内置组件，包裹组件的时候，会缓存不活跃的组件实例，并不是销毁他们

作用：把组件切换的状态保存在内存里，防止重复渲染DOM节点，减少加载时间和性能消耗，提高用户体验

### keep-alive 原理

### 一、缓存机制

1. **缓存对象**  
   `keep-alive` 内部维护一个 `cache` 对象（存储 VNode）和 `keys` 数组（记录缓存组件的 key）。结构类似：
   ```javascript
   const cache = new Map();
   const keys = [];
   ```

2. **命中缓存**  
   当组件切换时，`keep-alive` 根据组件的 `name` 或匿名组件的特殊标识，检查 `cache` 中是否存在匹配的 VNode：

- 命中缓存：直接复用缓存的组件实例。
- 未命中：创建新实例并缓存。

---

### 二、LRU 缓存策略

若设置了 `max` 属性（如 `<keep-alive max="5">`），当缓存数量超过 `max` 时，采用 **LRU（Least Recently Used）** 策略淘汰最久未使用的组件：

```javascript
// 伪代码：淘汰逻辑
if (max && keys.length > max) {
    const oldestKey = keys.shift(); // 移除最久未使用的 key
    cache.delete(oldestKey); // 删除对应缓存
}
```

---

### 三、生命周期管理

1. **激活/停用钩子** 被缓存的组件会触发特有生命周期：

- `activated`：组件被激活（插入 DOM 时调用）。
- `deactivated`：组件被停用（移除 DOM 但未销毁时调用）。

2. **避免销毁**  
   缓存的组件不会触发 `beforeDestroy` 和 `destroyed` 钩子，而是通过 `deactivated` 暂停运行。

### 四、实现原理（源码简析）

1. **`render` 函数逻辑**  
   `keep-alive` 的 `render` 函数优先返回缓存中的 VNode：
   ```vue
   render() {
     const slot = this.$slots.default;
     const vnode = slot[0]; // 获取包裹的组件 VNode
     const key = vnode.key ?? getComponentKey(vnode);
     
     if (cache.has(key)) {
       vnode.componentInstance = cache.get(key).componentInstance; // 复用实例
       // 调整 key 顺序（LRU）
     } else {
       cache.set(key, vnode);
       keys.push(key);
     }
     return vnode;
   }
   ```

2. **`include` 与 `exclude`**  
   通过 `include` 和 `exclude` 属性匹配组件 `name`，决定是否缓存：
   ```javascript
   const name = getComponentName(vnode.componentOptions);
   if (
     (include && !matches(include, name)) ||
     (exclude && matches(exclude, name))
   ) {
     return vnode; // 不缓存
   }
   ```

### 五、使用注意事项

- **必须设置 `name`**：匿名组件或未显式声明 `name` 的组件无法被 `include/exclude` 正确匹配。
- **避免内存泄漏**：缓存大量组件可能占用内存，需合理设置 `max`。
- **动态组件优化**：适合缓存需要保持状态的复杂组件（如表单、选项卡）。

### 总结

`keep-alive` 通过 **缓存 VNode + LRU 淘汰策略**，结合 Vue 的组件生命周期管理，实现了无状态损耗的组件持久化。这种设计在保留组件状态的同时，显著提升了高频切换场景下的性能表现。

## Vue 的双向绑定原理

> 主要基于 **数据劫持** 和 **发布-订阅模式**，通过以下核心机制实现：

---

### 1. **数据劫持（响应式系统）**

Vue 通过劫持数据的读写操作，监听数据变化：

- **Vue2 使用 `Object.defineProperty`**：
    - 遍历 `data` 对象的属性，将其转换为 `getter/setter`。
    - **局限性**：无法直接监听新增属性和数组索引变化，需通过 `Vue.set` 或数组变异方法（如 `push`、`pop`）触发更新。
- **Vue3 使用 `Proxy`**：
    - 直接代理整个对象，支持监听属性的增删、数组索引变化和 `length` 修改。
    - 性能更优，无需递归初始化所有属性。

---

### 2. **依赖收集与发布-订阅**

- **Dep（依赖管理器）**：
    - 每个响应式属性对应一个 `Dep` 实例，用于存储依赖它的 `Watcher`。
- **Watcher（订阅者）**：
    - 在组件渲染、计算属性或监听器中被创建。
    - 在初始化时触发 `getter`，将自身添加到当前属性的 `Dep` 中（依赖收集）。
- **更新流程**：
    - 数据变化时，`setter` 或 `Proxy` 触发 `Dep` 通知所有 `Watcher`。
    - `Watcher` 将更新任务推入异步队列，等待批量执行（避免重复渲染）。

---

### 3. **异步批量更新**

- 同一事件循环内的多次数据变更合并为一次更新。
- 通过 `nextTick` 实现延迟执行，优先使用 `Promise.then`、`MutationObserver` 等微任务机制。

---

### 4. **模板编译与虚拟 DOM**

- **模板编译**：
    - 将模板转换为渲染函数，渲染函数执行时访问数据属性，触发依赖收集。
- **虚拟 DOM**：
    - 数据变化后，重新生成虚拟 DOM，通过 **Diff 算法** 对比新旧节点，最小化 DOM 操作。

---

### 5. **双向绑定的实现（v-model）**

- **语法糖**：`v-model` 自动绑定 `value` 属性和 `input` 事件。
  ```html
  <input v-model="message">
  <!-- 等价于 -->
  <input 
    :value="message" 
    @input="message = $event.target.value"
  >
  ```
- **自定义组件**：可通过 `model` 选项配置绑定的属性和事件。

---

### 6. **数组的响应式处理（Vue2）**

- **重写数组方法**：对 `push`、`pop`、`splice` 等 7 个方法进行重写，调用时手动触发更新。
- **递归监听数组元素**：若数组元素是对象，仍会进行响应式转换。

---

### 总结

- **Vue2**：`Object.defineProperty` + 发布订阅 + 虚拟 DOM。
- **Vue3**：`Proxy` + 重构的响应式系统 + 优化虚拟 DOM。
- **核心流程**：  
  **数据变更 → 触发 setter/Proxy → 通知 Watcher → 异步更新 → 虚拟 DOM 对比 → 渲染视图**。

### Vue.js 的 diff 算法

> diff 算法是虚拟 DOM（Virtual DOM）更新的核心机制，用于高效地更新真实 DOM。Vue 2.x 和 Vue 3.x 在 diff 算法上有一些差异，但核心思想相似。以下是
> Vue 的 diff 算法的主要思路和优化策略

---

### 1. **Diff 算法的核心思想**

Diff 算法通过比较新旧虚拟 DOM 树，找出最小的变化，然后只更新真实 DOM 中需要变化的部分，而不是重新渲染整个 DOM 树。这样可以大幅提升性能。

---

### 2. **Diff 算法的优化策略**

Vue 的 diff 算法采用了一些优化策略，以减少比较的复杂度：

#### （1）**同层比较**

Vue 的 diff 算法只会比较同一层级的节点，而不会跨层级比较。如果发现节点在不同层级，则会直接销毁旧节点并创建新节点。

- **优点**：减少了比较的复杂度，算法时间复杂度从 O(n^3) 降低到 O(n)。
- **示例**：
  ```html
  <!-- 旧节点 -->
  <div>
    <p>Hello</p>
  </div>

  <!-- 新节点 -->
  <div>
    <span>Hi</span>
  </div>
  ```
  在这种情况下，`<p>` 和 `<span>` 是同一层级的节点，Vue 会直接替换 `<p>` 为 `<span>`。

#### （2）**Key 的作用**

Vue 通过 `key` 属性来标识节点的唯一性。在列表渲染时，`key` 可以帮助 Vue 更高效地复用节点。

- **没有 key**：Vue 会采用“就地复用”策略，可能会导致状态错乱。
- **有 key**：Vue 会根据 key 的值来匹配新旧节点，确保节点的正确复用。
- **示例**：
  ```html
  <ul>
    <li v-for="item in items" :key="item.id">{{ item.text }}</li>
  </ul>
  ```
  如果 `items` 的顺序发生变化，Vue 会根据 `key` 来重新排序节点，而不是销毁和重新创建。

#### （3）**双端比较**

Vue 2.x 的 diff 算法采用双端比较（双指针法），即同时从新旧节点的两端开始比较，逐步向中间靠拢。

- **步骤**：
    1. 比较新旧节点的开始节点（头对头）。
    2. 比较新旧节点的结束节点（尾对尾）。
    3. 比较旧节点的开始节点和新节点的结束节点（头对尾）。
    4. 比较旧节点的结束节点和新节点的开始节点（尾对头）。
    5. 如果以上都不匹配，则尝试在旧节点中查找新节点。

- **优点**：减少不必要的节点移动，提升性能。

#### （4）**静态节点优化**

Vue 会标记静态节点（即不会变化的节点），在 diff 过程中直接跳过这些节点的比较。

- **示例**：
  ```html
  <div>
    <p>This is a static node</p>
    <p>{{ dynamicContent }}</p>
  </div>
  ```
  在这个例子中，第一个 `<p>` 是静态节点，Vue 不会对它进行比较。

---

### 3. **Vue 3 的优化**

Vue 3 在 diff 算法上进一步优化，主要体现在以下几个方面：

#### （1）**Patch Flag**

Vue 3 引入了 `Patch Flag`，用于标记节点的动态部分。在 diff 过程中，Vue 3 可以跳过不需要更新的部分。

- **示例**：
  ```html
  <div>
    <p>Static content</p>
    <p>{{ dynamicContent }}</p>
  </div>
  ```
  Vue 3 会为第二个 `<p>` 标记一个 `Patch Flag`，表示只有 `dynamicContent` 是动态的。

#### （2）**Block Tree**

Vue 3 引入了 `Block Tree` 的概念，将模板划分为多个块（Block），每个块可以独立更新。

- **优点**：减少了 diff 的范围，提升了性能。

#### （3）**缓存事件处理函数**

Vue 3 会缓存事件处理函数，避免在每次渲染时重新创建函数。

---

### 4. **Diff 算法的局限性**

尽管 Vue 的 diff 算法非常高效，但在某些情况下仍然存在性能瓶颈：

- **大规模列表更新**：如果列表项非常多，且顺序频繁变化，diff 算法的性能可能会下降。
- **跨层级移动节点**：由于 Vue 只进行同层比较，跨层级移动节点会导致节点销毁和重新创建。

---

### 5. **总结**

Vue 的 diff 算法通过同层比较、双端比较、静态节点优化等策略，实现了高效的 DOM 更新。Vue 3 进一步优化了 diff 算法，引入了
`Patch Flag` 和 `Block Tree` 等机制，提升了性能。理解 diff 算法的工作原理，可以帮助开发者编写更高效的 Vue 代码。

## Vuex 的响应式处理主要

> Vuex 的响应式处理主要依赖于 Vue.js 自身的响应式系统，通过 Vue 的 `data` 和 `computed` 特性实现状态变化的自动追踪。以下是其核心实现原理和关键细节：

### 一、核心原理

1. **基于 Vue 的响应式系统**  
   Vuex 的 `state` 对象会被传入一个 Vue 实例的 `data` 中，通过 Vue 的 `Object.defineProperty`（Vue 2）或 `Proxy`（Vue
   3）实现数据劫持。当状态变化时，依赖该状态的组件会自动更新。

2. **Getter 的响应式**  
   Getter 本质上是 Vue 的 `computed` 属性，其值会缓存并根据依赖的 `state` 或 `其他 Getter` 自动重新计算。

### 二、具体实现步骤

1. **初始化响应式 State**  
   在创建 Store 时，Vuex 会创建一个内部 Vue 实例，并将 `state` 作为其 `data`：
   ```javascript
   store._vm = new Vue({
     data: {
       $$state: state // $$state 会被 Vue 转换为响应式
     },
     computed: getters // Getter 转换为计算属性
   });
   ```

2. **模块化 State 处理**  
   对于嵌套模块，Vuex 会递归地将每个模块的 `state` 挂载到根 `state` 上，确保所有层级的 `state` 均为响应式。

3. **Getter 的计算属性化**  
   每个 Getter 会被转换为 Vue 实例的 `computed` 属性，依赖追踪由 Vue 自动完成：
   ```vue
   // 示例：Getter 转换为 computed
   computed: {
     doubleCount() {
       return this.$store.state.count * 2;
     }
   }
   ```

### 三、响应式限制与解决方案

1. **动态添加属性**

- **问题**：直接为对象添加新属性（如 `state.obj.newProp = 123`）不会触发响应式更新。
- **解决**：使用 `Vue.set()` 或对象替换：
  ```javascript
  Vue.set(state.obj, 'newProp', 123);
  // 或
  state.obj = { ...state.obj, newProp: 123 };
  ```

2. **数组操作**

- **响应式方法**：使用数组变异方法（如 `push`, `pop`, `splice`）或 `Vue.set`。
- **非响应式操作**：直接通过索引修改值（如 `arr[0] = 1`）或修改 `length` 属性。

---

### 四、严格模式

在严格模式下（`strict: true`），Vuex 会通过 `watch` 监听 `state` 的变化。若发现非 `mutation` 触发的修改，会抛出错误：

```javascript
const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production'
});
```

---

### 五、Vue 3 的优化

在 Vue 3 中，Vuex 4 利用 `Proxy` 替代 `Object.defineProperty`，解决了 Vue 2 中无法检测对象新增属性的问题，同时提升了性能。

### 总结

Vuex 的响应式通过 Vue 实例的 `data` 和 `computed` 实现，使用时需注意：

- 通过 `mutations` 修改状态。
- 动态属性需使用 `Vue.set` 或对象替换。
- 数组操作使用变异方法或 `Vue.set`。

## vue 和 react 区别

### 相同点

- 01.都支持组建化开发 和 Virtual DOM
- 02.都支持props进行父子组建间数据通讯
- 03.都支持数据驱动试图 不直接操作真实DOM 更新状态数据界面会自动更新.
- 04.都支持服务端渲染
- 05.都有支持native的方案, React使用React Native, Vue使用Week

### 不同点

- 01.数据绑定: vue实现了数据的双向绑定, react数据流动是单向的
- 02.组建写法不一样, React推荐语法JSX, 也就是HTML和CSS全都写进JavaScript里, 即 All In js. Vue推荐的做法是(webpack +
  vue-loader)的单文件组建的格式, 即 html css js 写在同一个文件.
- 03.state对象在react应用中不可改变, 需用使用setState方法更新状态, 在vue中, state对象不是必须的, 数据由data熟悉在vue对象中管理
- 04.virtual Dom不一样, vue会跟踪每一个组建的依赖关系, 不需要重新渲染组建树. 而对于React而言, 每个应用的状态被改变时,
  全部组建都会重新渲染. 所以react中会需要shouldComponentUpdate这个声明周期函数方法来进行控制.
- 05.React严格上只针对MVC的view层. Vue则是MVVM模式

## webpack 中 loader 和 plugin 的区别是什么

loader：loader 是一个转换器，将 A 文件进行编译成 B 文件，属于单纯的文件转换过程

plugin：plugin 是一个扩展器，它丰富了 webpack 本身，针对是 loader 结束后，webpack 打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听
webpack 打包过程中的某些节点，执行广泛的任务。

## vue 封装通用组件

通用组件必须具备高性能、低耦合的特性

**1、数据从父组件传入**

- a.为了解耦，子组件本身就不能生成数据。即使生成了，也只能在组件内部运作，不能传递出去。
- b.但是通用组件的的应用场景比较复杂，对 props 传递的参数应该添加一些验证规则
- c.props 中数据不要更改。

**2.在父组件处理事件**

- a.在通用组件中，通常会需要有各种事件， 比如复选框的 change 事件，或者组件中某个按钮的 click 事件
  这些事件的处理方法应当尽量放到父组件中，通用组件本身只作为一个中转,
  这样既降低了耦合性，也保证了通用组件中的数据不被污染
- b. 不过，并不是所有的事件都放到父组件处理 比如组件内部的一些交互行为，或者处理的数据只在组件内部传递，这时候就不需要用 $
  emit 了

**3. 合理使用 slot**
一般在不同场景显示不同组件。

**4.尽量不要依赖 vuex**

Vue 没有直接子对子传参的方法，建议将需要传递数据的子组件，都合并为一个组件。如果一定需要子对子传参，可以先从传到父组件，再传到子组件。
或者使用 pubSub.js 实现子组件之间互相传参数。

**5.动态组件**
Vue 还可以将多个子组件，都挂载在同一个位置，通过变量来切换组件，实现 tab 菜单这样的效果

```js
<component v-bind:is='tabView'></component>
```

**6.递归组件**
当组件拥有 name 属性的时候，就可以在它的模板内递归的调用自己，这在开发树形组件的时候十分有效

## vue 数据双向绑定原理

双向绑定是指数据模型（Module）和 视图（View）之间的双向绑定。 其原理是采用数据劫持结合发布订阅者模式实现。

- 1). 创建 vue 实例的过程中， 会先遍历 data 选项中所有的属性（发布者）， 用 Object.defineProperty 劫持这些属性将其转换为
  getter/setter。读取数据时候会触发 getter， 修改数据会触发 setter。

  代码：

    - 1).initData 初始化用户传入的数据
    - 2). new Observer 将数据进行观测。
    - 3). this.walk 进行对象的处理。
    - 4). defineReactive 循环对象属性定义响应式变化。
    - 5). Object.defineProperty 使用 Object.defineProperty 重新定义数据。 拦截属性的获取--进行依赖收集。 拦截属性的更新操作，
      对相关依赖进行通知。

- 2). 然后给每个对象属性对应的 new Dep(), Dep 专门收集依赖、删除依赖、向依赖发送消息。 dep 实际就是一个普通对象， 里边只有两个属性
  id,subs。 subs 存放 watcher 数组。
  先把每个依赖设置在 Dep.target 上。 在 Dep 中创建一个依赖数组， 先判断 Dep.target 是否已经在依赖数组中存在，
  如果不存在就添加到依赖数组中完成依赖收集。 随后 Dep.target 置为 null。
- 3). 组件在挂载过程中都会 new 一个 Watcher 实例。 这个实例就是依赖（订阅者）。 Watcher 的第二个参数是一个函数，
  此函数的作用是更新渲染节点。 在首次渲染过程， 会自动调用 Dep 方法收集依赖，
  收集完成后组件中每个数据都绑定上依赖。 当数据变化时就会在 setter 中调用 dep.notify 通知对应的依赖进行更新。 在更新过程中要读取数据，
  就会触发 Watcher 的第二个函数参数。 一触发就再次自动调用 Dep 方法收集依赖，
  同时在此函数中运行 patch（diff 运算）来更新对应的 DOM 节点， 完成了数据的双向绑定。

## mixin 合并规则

### 选项合并规则

1.数据对象（data）在内部会进行递归合并，并在发生冲突时以组件数据优先

2.同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用

3.值为对象的选项，例如 methods、components、watch 和
directives，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。Vue.extend() 也使用同样的策略进行合并

## elementUI 按需加载原理

## 统计页面停留时长

统计用户访问时长，如何优雅地发送统计数据到服务端（提示： 提出在路由钩子实现， 提到节流和防抖， 回答节流和防抖的原理）

## vue template 模板到解析层真实 DOM 的过程

## v-model 手动实现

[v-model 手动实现](https://segmentfault.com/a/1190000012264050)

## $nextTick 原理

[nextTick 原理 黄奕](https://ustbhuangyi.github.io/vue-analysis/v2/reactive/next-tick.html#js-%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6)

[nextTick 原理 华为云](https://bbs.huaweicloud.com/blogs/235688)

## vuex 原理

[vuex 原理](https://segmentfault.com/a/1190000018251844)

## vue router 原理

[Vue Router](https://juejin.cn/post/6844903612930326541)

## vue 开发插件流程

[vue 自定义插件](https://segmentfault.com/a/1190000010813937)

## computed 与 watch 区别

watch 和 computed 区别:

1.computed 是监听属性 依赖属性值发生变化的时候 数据才会变化. watch 是监听数据变化 执行相应的操作.
2.computed 有缓存 当依赖的属性没有发生变化的时候 则取缓存中的数据. watch 监听值是否发生变化, 都会调用回调函数.
3.computed 必须有 return watch 不需要
4.computed 不能有异步 watch 可以

::: tip 功能上：computed 是计算属性，也就是依赖其它的属性计算所得出最后的值。watch 是去监听一个值的变化，然后执行相对应的函数

使用上：computed 中的函数必须要用 return 返回 watch 的回调里面会传入监听属性的新旧值，通过这两个值可以做一些特定的操作，不是必须要用
return

性能上：computed 中的函数所依赖的属性没有发生变化，那么调用当前的函数的时候会从缓存中读取，而 watch 在每次监听的值发生变化的时候都会执行回调

场景上：computed：当一个属性受多个属性影响的时候，例子：购物车商品结算 watch：当一条数据影响多条数据的时候，例子：搜索框
:::

## vue diff 算法

## vue 模板编译过程

[vue 模板编译过程](https://segmentfault.com/a/1190000012922342)

## vue 组建 name 属性的作用

项目使用 keep-alive 时，可以搭配组件的 name 属性进行过滤
DOM 做递归组件时需要调用自身 name
vue-devtools 调试工具里显示的组见名称是由 vue 中组件 name 决定的

## vue 父子组建传递参数 8 种方式

> 参考地址： https://juejin.cn/post/6844904080540712967

## 组建化 和 MVVM

> 1.1 组件：把重复的代码提取出来合并成为一个个组件，组件最重要的就是重用（复用），位于框架最底层，其他功能都依赖于组件，可供不同功能使用，独立性强。

> 1.2
>
模块：分属同一功能/业务的代码进行隔离（分装）成独立的模块，可以独立运行，以页面、功能或其他不同粒度划分程度不同的模块，位于业务框架层，模块间通过接口调用，目的是降低模块间的耦合，由之前的主应用与模块耦合，变为主应用与接口耦合，接口与模块耦合。

### eg:

> 2.1 组件：就像一个个小的单位，多个组件可以组合成组件库，方便调用和复用，组件间也可以嵌套，小组件组合成大组件。
> 2.2 模块：就像是独立的功能和项目（如淘宝：注册、登录、购物、直播...），可以调用组件来组成模块，多个模块可以组合成业务框架。

## 响应式原理

## vdom 和 diff

## 模板编译

## 组建渲染过程

## 前端路由

## Object.defineProperty 和 Proxy 对比的缺点

:::tips 01.深度监听需要递归 02.无法监听新增属性与删除属性(Vue.$set Vue.$delete) 03.无法原生监听数组 需要特殊处理
:::

> Proxy 基本应用

:::tips

:::

> Reflect

## vue3 语法汇总

## vue3 和 vue2 响应式原理差别

> TODO: vue3 和 vue2 响应式原理 区别

## ref 和 reactive区别

> 宏观角度

- 1.ref用来定义: 基本类型和对象类型数据
- 2.reactive用来定义: 对象类型数据

> 却别:

- 1.ref创建的变量必须通过.value来访问(可以使用volar插件自动补全.value)
- 2.reactive重新分配一个新对象, 会失去响应式 (可以通过对象结构赋值, 或者Object.assign()去整体替换)
- 3.使用watch监听ref和reactive创建的对象时, reactive创建的对象默认开启深度监听,且无法关闭. ref定义的响应式对象,
  需要手动开启深度监听

```ts
const obj = ref({})
watch(obj, () => {
}, {deep: true})
```

> 使用原则:

- 1.若需要定义一个基本类型的响应数据, 必须通过ref来定义
- 2.若需要一个响应式对象, 层次不深, ref, reactive都可以
- 3.若需要一个响应式对象, 且层次较深, 推荐使用reactive来定义

## toRefs 和 toRef

```vue
const car = reactive({brand: "奔驰", price: 120})
const {brand, price} =toRefs(car)
const brand = toRef(car, 'brand')
```

## computed 计算属性

```ts
import {ref} from 'vue'

const firstName = ref('张')
const lastName = ref('三')

// 只读计算属性
const fullName = computed(() => {
    return firstName + lastName
})

// 可以读写的计算属性
const fullName2 = computed({
    get() {
        return firstName.value + lastName.value
    },
    set(val) {
        // 给fullName2赋值的时候触发, val就是赋的值
        const list = val.split('-')
        firstName.value = list[0]
        lastName.value = list[1]
    }
})
```

## watch 使用

- 作用：监视数据的变化（和`Vue2`中的`watch`作用一致）
- 特点：`Vue3`中的`watch`只能监视以下**四种数据**：

> 1. `ref`定义的数据(包括计算属性)
> 2. `reactive`定义的数据
> 3. 函数返回一个值（`getter`函数）
> 4. 一个包含上述内容的数组

我们在`Vue3`中使用`watch`的时候，通常会遇到以下几种情况：

###  * 情况一

监视`ref`定义的基本类型数据：直接写数据名即可，监视的是其`value`值的改变。

```vue
  监视，情况一：监视ref定义的基本类型数据
  const stopWatch = watch(sum, (newValue, oldValue) => {
    console.log('sum变化了', newValue, oldValue)
    if (newValue >= 10) {
      stopWatch()
    }
  })
```

###  * 情况二

监视`ref`定义的对象类型数据：直接写数据名，监视的是对象的地址值，若想监视对象内部的数据，要手动开启深度监视。

> 注意：
>
> - 若修改的是`ref`定义的对象中的属性，`newValue` 和 `oldValue` 都是新值，因为它们是同一个对象。
>
> - 若修改整个`ref`定义的对象，`newValue` 是新值， `oldValue` 是旧值，因为不是同一个对象了。

```vue
  /*
    监视，情况一：监视ref定义的对象类型数据，监视的是对象的地址值，若想监视对象内部属性的变化，需要手动开启深度监视
    watch的第一个参数是：被监视的数据
    watch的第二个参数是：监视的回调
    watch的第三个参数是：配置对象（deep、immediate等等.....）
  */
  watch(person, (newValue, oldValue) => {
    console.log('person变化了', newValue, oldValue)
  }, {deep: true})
```

###  *  情况三
监视`reactive`定义的对象类型数据，且默认开启了深度监视。

```vue
  // 监视，情况三：监视reactive定义的对象类型数据，且默认是开启深度监视的
  watch(person, (newValue, oldValue) => {
    console.log('person变化了', newValue, oldValue)
  })
  watch(obj, (newValue, oldValue) => {
    console.log('Obj变化了', newValue, oldValue)
  })
```

###  * 情况四

监视`ref`或`reactive`定义的对象类型数据中的**某个属性**，注意点如下：

1. 若该属性值**不是**对象类型，需要写成函数形式。
2. 若该属性值是**依然**是对象类型，可直接编，也可写成函数，建议写成函数。

结论：监视的要是对象里的属性，那么最好写函数式，注意点：若是对象监视的是地址值，需要关注对象内部，需要手动开启深度监视。

```vue
  // 监视，情况四：监视响应式对象中的某个属性，且该属性是基本类型的，要写成函数式
  /* watch(()=> person.name,(newValue,oldValue)=>{
    console.log('person.name变化了',newValue,oldValue)
  }) */

  // 监视，情况四：监视响应式对象中的某个属性，且该属性是对象类型的，可以直接写，也能写函数，更推荐写函数
  watch(() => person.car, (newValue, oldValue) => {
    console.log('person.car变化了', newValue, oldValue)
  }, {deep: true})
```

####  * 情况五

```vue
  // 监视，情况五：监视上述的多个数据
  watch([() => person.name, person.car], (newValue, oldValue) => {
    console.log('person.car变化了', newValue, oldValue)
  }, {deep: true})
```

## watchEffect

- 官网：立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行该函数。

- `watch`对比`watchEffect`

  > 1. 都能监听响应式数据的变化，不同的是监听数据变化的方式不同
  >
  > 2. `watch`：要明确指出监视的数据
  >
  > 3. `watchEffect`：不用明确指出监视的数据（函数中用到哪些属性，那就监视哪些属性）。

- 示例代码：
  ```vue
    watch([temp,height],(value)=>{
      // 从value中获取最新的temp值、height值
      const [newTemp,newHeight] = value
      // 室温达到50℃，或水位达到20cm，立刻联系服务器
      if(newTemp >= 50 || newHeight >= 20){
        console.log('联系服务器')
      }
    })

    // 用watchEffect实现，不用
    const stopWatch = watchEffect(()=>{
      // 室温达到50℃，或水位达到20cm，立刻联系服务器
      if(temp.value >= 50 || height.value >= 20){
        console.log(document.getElementById('demo')?.innerText)
        console.log('联系服务器')
      }
      // 水温达到100，或水位达到50，取消监视
      if(temp.value === 100 || height.value === 50){
        console.log('清理了')
        stopWatch()
      }
    })
  ```

## watch vs. watchEffect

> watch 和 watchEffect 都能响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：
>
> watch 只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西。另外，仅在数据源确实改变时才会触发回调。watch
> 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。
>
> watchEffect，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

## 标签的 ref 属性

作用：用于注册模板引用。

> - 用在普通`DOM`标签上，获取的是`DOM`节点
> - 用在组件标签上，获取的是组件实例对象

## vue2 和 vue3 声明周期对比

| vue2                         | vue3            |
|:-----------------------------|:----------------|
| beforeCreate                 | setup           |
| created                      | setup           |
| beforeMount                  | onBeforeMount   |
| mounted                      | onMounted       |
| beforeUpdate                 | onBeforeUpdate  |
| updated                      | onUpdated       |
| beforeDestroy                | onBeforeUnmount |
| destroyed                    | onUnmounted     |
| activated                    | onActivated     |
| deactivated                  | onDeactivated   |
| errorCaptured                | onErrorCaptured |
| onRenderTracked vue3开发环境独有   |
| onRenderTriggered vue3开发环境独有 |
| onServerPrefetch vue3 ssr 独有 |


## Vue Router原理

---

### **核心原理对比**

#### 1. **Hash 模式**

- **实现机制**：
    - URL 中的 `#` 后的部分称为 **哈希（hash）**，例如 `http://example.com/#/home`。
    - **哈希变化不会触发浏览器向服务器发送请求**，因此页面不会重新加载。
    - 依赖 `hashchange` 事件监听哈希变化：
      ```js
      window.addEventListener('hashchange', () => {
        // 根据当前哈希值更新页面内容
      });
      ```
    - **Vue Router 内部**：
        - 通过 `window.location.hash` 修改 URL。
        - 监听 `hashchange` 事件，触发路由匹配和组件渲染。

- **关键特点**：
    - **完全由前端控制**：服务器只需返回一个 HTML 文件（如 `index.html`），所有路由逻辑由前端处理。
    - **兼容性极好**：`hashchange` 事件在老旧浏览器（如 IE8+）中也能工作。

---

#### 2. **History 模式**

- **实现机制**：
    - 使用 HTML5 的 **History API**（`pushState` 和 `replaceState`）修改 URL：
      ```js
      // 添加一条历史记录
      history.pushState({}, '', '/home');
      // 替换当前历史记录
      history.replaceState({}, '', '/home');
      ```
    - **URL 路径变化不会触发页面刷新**，但需要前端自行处理路由逻辑。
    - **Vue Router 内部**：
        - 通过 `history.pushState` 或 `history.replaceState` 修改 URL。
        - 监听 `popstate` 事件（用户点击浏览器前进/后退按钮时触发）：
          ```js
          window.addEventListener('popstate', () => {
            // 根据当前路径更新页面内容
          });
          ```

- **关键特点**：
    - **需要服务器配合**：当用户直接访问子路径（如 `http://example.com/home`）时，服务器需要返回 `index.html`，否则会报 404。
    - **依赖现代浏览器**：IE9 及以下不支持 History API。

---

### **深入原理**

#### Hash 模式如何避免页面刷新？

- **哈希的天然特性**：  
  浏览器对 `#` 后的内容视为“页面内的锚点”，修改哈希值不会触发页面请求。前端通过监听 `hashchange` 事件，手动更新页面内容。

#### History 模式如何模拟“无刷新跳转”？

- **History API 的魔法**：  
  `pushState` 和 `replaceState` 允许前端直接修改 URL 路径，而**不会触发页面加载**。但浏览器不会自动处理这些路径对应的内容，需要前端自己实现路由匹配。

---

### **为什么 History 模式需要服务器配置？**

假设用户直接访问 `http://example.com/home`：

1. 浏览器会向服务器发送请求 `/home`。
2. 如果服务器没有对应的路由处理，会返回 404。
3. **解决方案**：  
   服务器将所有非静态资源请求重定向到 `index.html`，例如：
    - **Nginx 配置**：
      ```nginx
      location / {
        try_files $uri $uri/ /index.html;
      }
      ```
    - **Express 配置**：
      ```js
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
      });
      ```

---

### **路由跳转的完整流程**

#### Hash 模式流程：

1. **用户点击 `<router-link to="/home">`**：
    - Vue Router 调用 `router.push('/home')`。
    - 修改 `window.location.hash` 为 `#/home`。
2. **触发 `hashchange` 事件**：
    - Vue Router 解析哈希值 `/home`，匹配对应路由。
    - 加载并渲染对应的组件。
3. **用户点击浏览器后退按钮**：
    - 哈希值变化，再次触发 `hashchange` 事件。
    - 重复步骤 2。

#### History 模式流程：

1. **用户点击 `<router-link to="/home">`**：
    - Vue Router 调用 `router.push('/home')`。
    - 调用 `history.pushState({}, '', '/home')`，URL 变为 `/home`。
2. **Vue Router 解析路径 `/home`**：
    - 匹配对应路由，加载并渲染组件。
3. **用户点击浏览器后退按钮**：
    - 触发 `popstate` 事件。
    - Vue Router 解析当前路径，重新渲染组件。

---

### **关键问题与解决方案**

#### 1. **History 模式的 404 问题**

- **场景**：用户直接访问 `/home`，但服务器未配置，返回 404。
- **解决**：服务器需将所有路径指向 `index.html`（如上述 Nginx 配置）。

#### 2. **Hash 模式的 SEO 问题**

- **问题**：搜索引擎可能忽略 `#` 后的内容。
- **解决**：改用 History 模式 + 服务端渲染（SSR）或静态生成（如 Nuxt.js）。

#### 3. **History 模式的浏览器兼容性**

- **问题**：IE9 及以下不支持 History API。
- **解决**：使用 Hash 模式，或为旧浏览器提供降级方案。

---

### **Vue Router 的底层实现**

- **Hash 模式**：
  ```js
  class HashHistory {
    constructor(router) {
      window.addEventListener('hashchange', () => {
        const path = window.location.hash.slice(1); // 去掉 # 号
        router.transitionTo(path); // 执行路由跳转
      });
    }
  }
  ```

- **History 模式**：
  ```js
  class HTML5History {
    constructor(router) {
      window.addEventListener('popstate', (event) => {
        const path = window.location.pathname;
        router.transitionTo(path); // 执行路由跳转
      });
    }

    push(path) {
      history.pushState({}, '', path); // 修改 URL
      router.transitionTo(path); // 手动触发路由跳转
    }
  }
  ```

---

### **总结**

| **核心差异**    | **Hash 模式**                   | **History 模式**                      |
|-------------|-------------------------------|-------------------------------------|
| **URL 结构**  | 带 `#`，如 `http://a.com/#/home` | 无 `#`，如 `http://a.com/home`         |
| **服务器要求**   | 无需配置                          | 需配置所有路径返回 `index.html`              |
| **实现原理**    | `hashchange` 事件 + 哈希操作        | `history.pushState` + `popstate` 事件 |
| **兼容性**     | 所有浏览器                         | 不支持 IE9 及以下                         |
| **SEO 友好性** | 差（需额外处理）                      | 较好（仍需服务端渲染）                         |
| **前端路由控制权** | 完全由前端管理                       | 需与服务器配合                             |

**选择建议**：

- 优先使用 **History 模式**：追求 URL 美观，且能控制服务器配置。
- 降级为 **Hash 模式**：兼容旧浏览器，或无法配置服务器时。

理解这些原理后，可以更自信地处理路由相关的问题（如 404、SEO、浏览器兼容性等）！

## 路由拦截是怎么实现的

路由拦截，需要在路由配置中添加一个字段，它是用于判断路由是否需要拦截

```
{
    name: 'index',
        path: "/index",
        component:Index,
        meta : {
        requirtAuth:true
    }
}
router.beforeEach((to, from, next) => {
    if (to.meta.requirtAuth) {
        if (store.satte.token) {
            next()
        } else {

        }
    }
})
```

## 说一下vue的动态路由

要在路由配置里设置meat属性，扩展权限相关的字段，在路由导航守卫里通过判断这个权限标识，实现路由的动态增加和跳转
根据用户登录的账号，返回用户角色
前端再根据角色，跟路由表的meta.role进行匹配
把匹配搭配的路由形成可访问的路由

## ref 和 reactive区别

> 宏观角度

- 1.ref用来定义: 基本类型和对象类型数据
- 2.reactive用来定义: 对象类型数据

> 却别:

- 1.ref创建的变量必须通过.value来访问(可以使用volar插件自动补全.value)
- 2.reactive重新分配一个新对象, 会失去响应式 (可以通过对象结构赋值, 或者Object.assign()去整体替换)
- 3.使用watch监听ref和reactive创建的对象时, reactive创建的对象默认开启深度监听,且无法关闭. ref定义的响应式对象,
  需要手动开启深度监听

```ts
const obj = ref({})
watch(obj, () => {
}, {deep: true})
```

> 使用原则:

- 1.若需要定义一个基本类型的响应数据, 必须通过ref来定义
- 2.若需要一个响应式对象, 层次不深, ref, reactive都可以
- 3.若需要一个响应式对象, 且层次较深, 推荐使用reactive来定义

### ajax是什么？怎么实现的？

:::tip
创建交互式网页应用的网页开发技术

在不重新加载整个网页的前提下，与服务器交换数据并更新部分内容

通过XmlHttpRequest对象向服务器发送异步请求，然后从服务器拿到数据，最后通过JS操作DOM更新页面

1.创建XmlHttpRequest对象 xmh

2.通过xmh对象里的open()方法和服务器建立连接

3.构建请求所需的数据，并通过xmh对象的send()发送给服务器

4.通过xmh对象的onreadystate change事件监听服务器和你的通信状态

5.接收并处理服务器响应的数据结果

6.把处理的数据更新到HTML页面上
:::

### get和post有什么区别？

1.get一般是获取数据，post一般是提交数据

2.get参数会放在url上，所以安全性比较差，post是放在body中

3.get请求刷新服务器或退回是没有影响的，post请求退回时会重新提交数据

4.get请求时会被缓存,post请求不会被缓存

5.get请求会被保存在浏览器历史记录中,post不会

6.get请求只能进行url编码，post请求支持很多种

### promise的内部原理是什么？它的优缺点是什么？

Promise对象，封装了一个异步操作并且还可以获取成功或失败的结果

Promise主要就是解决回调地狱的问题，之前如果异步任务比较多，同时他们之间有相互依赖的关系，
就只能使用回调函数处理，这样就容易形成回调地狱，代码的可读性差，可维护性也很差
有三种状态：pending初始状态 fulfilled成功状态 rejected失败状态
状态改变只会有两种情况，
pending -> fulfilled; pending -> rejected 一旦发生，状态就会凝固，不会再变
首先就是我们无法取消promise，一旦创建它就会立即执行，不能中途取消
如果不设置回调，promise内部抛出的错误就无法反馈到外面
若当前处于pending状态时，无法得知目前在哪个阶段。
原理：
构造一个Promise实例，实例需要传递函数的参数，这个函数有两个形参，分别都是函数类型，一个是resolve一个是reject
promise上还有then方法，这个方法就是来指定状态改变时的确定操作，resolve是执行第一个函数，reject是执行第二个函数

### promise和async await的区别是什么？

1.都是处理异步请求的方式
2.promise是ES6，async await 是ES7的语法
3.async await是基于promise实现的，他和promise都是非阻塞性的
优缺点：
1.promise是返回对象我们要用then，catch方法去处理和捕获异常，并且书写方式是链式，容易造成代码重叠，不好维护，async await
是通过try catch进行捕获异常
2.async await最大的优点就是能让代码看起来像同步一样，只要遇到await就会立刻返回结果，然后再执行后面的操作
promise.then()的方式返回，会出现请求还没返回，就执行了后面的操作

### history模式: popstate 无法监听问题

> 不能监听:  history.pushState 和 history.replaceState 方法
>
> 可以监听:  history.go history.back history.forward方法
>
> hash模式:  监听hashchange 事件

### vue 和 react 区别

vue和react区别有以下11点：1、响应式原理不同；2、监听数据变化的实现原理不同；3、组件写法不同；4、Diff算法不同；5、核心思想不同；6、数据流不同；7、组合不同功能的方式不同；8、组件通信方法不同；9、模板渲染方式不同；10、渲染过程不同；11、框架本质不同。

1、响应式原理不同
vue：vue会遍历data数据对象，使用Object.definedProperty()
将每个属性都转换为getter和setter，每个Vue组件实例都有一个对应的watcher实例，在组件初次渲染的时候会记录组件用到了那些数据，当数据发生改变的时候，会触发setter方法，并通知所有依赖这个数据的watcher实例调用update方法去触发组件的compile渲染方法，进行渲染数据。

react：React主要是通过setState()方法来更新状态，状态更新之后，组件也会重新渲染。

2、监听数据变化的实现原理不同
vue：Vue通过 getter/setter以及一些函数的劫持，能精确知道数据变化。

react：React默认是通过比较引用的方式（diff）进行的，如果不优化可能导致大量不必要的VDOM的重新渲染。为什么React不精确监听数据变化呢？这是因为Vue和React设计理念上的区别，Vue使用的是可变数据，而React更强调数据的不可变，两者没有好坏之分，Vue更加简单，而React构建大型应用的时候更加鲁棒。

3、组件写法不同
vue：Vue的组件写法是通过template的单文件组件格式。

react：React的组件写法是JSX+inline style，也就是吧HTML和CSS全部写进JavaScript中。

4、Diff算法不同
vue和react的diff算法都是进行同层次的比较，主要有以下两点不同：

vue对比节点，如果节点元素类型相同，但是className不同，认为是不同类型的元素，会进行删除重建，但是react则会认为是同类型的节点，只会修改节点属性。
vue的列表比对采用的是首尾指针法，而react采用的是从左到右依次比对的方式，当一个集合只是把最后一个节点移动到了第一个，react会把前面的节点依次移动，而vue只会把最后一个节点移动到最后一个，从这点上来说vue的对比方式更加高效。
5、核心思想不同
vue：Vue的核心思想是尽可能的降低前端开发的门槛，是一个灵活易用的渐进式双向绑定的MVVM框架。

react：React的核心思想是声明式渲染和组件化、单向数据流，React既不属于MVC也不属于MVVM架构。

6、数据流不同
vue：Vue1.0中可以实现两种双向绑定：父子组件之间，props可以双向绑定；组件与DOM之间可以通过v-model双向绑定。Vue2.x中去掉了第一种，也就是父子组件之间不能双向绑定了（但是提供了一个语法糖自动帮你通过事件的方式修改），并且Vue2.x已经不鼓励组件对自己的
props进行任何修改了。

react：React一直不支持双向绑定，提倡的是单向数据流，称之为onChange/setState()
模式。不过由于我们一般都会用Vuex以及Redux等单向数据流的状态管理框架，因此很多时候我们感受不到这一点的区别了。

7、组合不同功能的方式不同
vue：Vue组合不同功能的方式是通过mixin，Vue中组件是一个被包装的函数，并不简单的就是我们定义组件的时候传入的对象或者函数。比如我们定义的模板怎么被编译的？比如声明的props怎么接收到的？这些都是vue创建组件实例的时候隐式干的事。由于vue默默帮我们做了这么多事，所以我们自己如果直接把组件的声明包装一下，返回一个HoC，那么这个被包装的组件就无法正常工作了。

react：React组合不同功能的方式是通过HoC(
高阶组件）。React最早也是使用mixins的，不过后来他们觉得这种方式对组件侵入太强会导致很多问题，就弃用了mixinx转而使用HoC。高阶组件本质就是高阶函数，React的组件是一个纯粹的函数，所以高阶函数对React来说非常简单。

8、组件通信方法不同
vue：Vue中有三种方式可以实现组件通信：父组件通过props向子组件传递数据或者回调，虽然可以传递回调，但是我们一般只传数据；子组件通过事件向父组件发送消息；通过V2.2.0中新增的provide/inject来实现父组件向子组件注入数据，可以跨越多个层级。

react：React中也有对应的三种方式：父组件通过props可以向子组件传递数据或者回调；可以通过 context 进行跨层级的通信，这其实和
provide/inject 起到的作用差不多。React
本身并不支持自定义事件，而Vue中子组件向父组件传递消息有两种方式：事件和回调函数，但Vue更倾向于使用事件。在React中我们都是使用回调函数的，这可能是他们二者最大的区别。

9、模板渲染方式不同
vue：Vue是在和组件JS代码分离的单独的模板中，通过指令来实现的，比如条件语句就需要 v-if 来实现对这一点，这样的做法显得有些独特，会把HTML弄得很乱。

react：React是在组件JS代码中，通过原生JS实现模板中的常见语法，比如插值，条件，循环等，都是通过JS语法实现的，更加纯粹更加原生。

10、渲染过程不同
vue：Vue可以更快地计算出Virtual DOM的差异，这是由于它在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。

react：React在应用的状态被改变时，全部子组件都会重新渲染。通过shouldComponentUpdate这个生命周期方法可以进行控制，但Vue将此视为默认的优化。

11、框架本质不同
vue：Vue本质是MVVM框架，由MVC发展而来；

react：React是前端组件化框架，由后端组件化发展而来。


vue3为什么使用proxy
1.proxy可以代理整个对象，defineproperty只代理对象上的某个属性
2.proxy对代理对象的监听更加丰富
3.proxy代理对象会生成新的对象，不会修改被代理对象本身
4.proxy不兼容ie浏览器

## vue3为什么使用proxy
* 1.proxy可以代理整个对象，defineproperty只代理对象上的某个属性
* 2.proxy对代理对象的监听更加丰富
* 3.proxy代理对象会生成新的对象，不会修改被代理对象本身
* 4.proxy不兼容ie浏览器

## vue路由时怎么传参的

```
{
  path: '/user/:id',
  name: 'User',
  component: () => import('@/views/User.vue')
}
```

### 1. 声明式导航(使用 `<router-link>`)

```
<router-link :to="{ name: 'User', params: { id: 123 }}">用户详情</router-link>
<router-link :to="{ path: '/user', query: { plan: 'private' }}">查看计划</router-link>
```

### 2.编程式导航 (使用 router.push)

```
import { useRouter } from 'vue-router'

const router = useRouter()

router.push({ name: 'User', params: { id: '123' } })
router.push({ path: '/user', query: { id: '123' } })
```


```
import { useRouter } from 'vue-router'

const router = useRouter()
特点： 参数在 URL 中：/user/1001 页面刷新不丢失 必须在 path 中声明 :id
router.push({
  name: 'User',
  params: {
    id: 1001
  }
})

特点：/user?id=1001&name=tom 可选参数多 刷新不丢
router.push({
  path: '/user',
  query: {
    id: 1001,
    name: 'tom'
  }
})
```

- 获取参数

```
import { useRoute } from 'vue-router'
const route = useRoute();

console.log(route.params.id) // 获取 params
console.log(route.query.id)  // 获取 query

```

### props（官方推荐方式）
特点： 解耦路由与组件 更好测试 更符合组件设计理念
```
{
  path: '/user/:id',
  component: () => import('@/views/User.vue'),
  props: true
}
```

```
<script setup>
defineProps({
  id: Strin
})
</script>
```

### state（Vue Router 4 新增）
特点：页面刷新 数据会丢; 分享链接 不支持; 适合场景 页面间临时数据传递

```
router.push({
  path: '/user',
  state: {
    id: 1001
  }
})

const route = useRoute()
console.log(route.state.id)
```



## vue路由的hash模式和history模式有什么区别
* 1.hash的路由地址上有#号，history模式没有
* 2.在做回车刷新的时候，hash模式会加载对应页面，history会报错404
* 3.hash模式支持低版本浏览器，history不支持，因为是H5新增的API
* 4.hash不会重新加载页面，单页面应用必备
* 5.history有历史记录，H5新增了pushState和replaceState()去修改历史记录，并不会立刻发送请求
* 6.history需要后台配置

## 路由拦截是怎么实现的
- 需要在路由配置中添加一个字段，它是用于判断路由是否需要拦截
```
    {
        name:'index',
        path:'/index',
        component:Index,
        meta:{
            requirtAuth:true
        }
    }
    router.beforeEach((to,from,next) => {
        if(to.meta.requirtAuth){
            if( store.satte.token ){
                next()
            }else{
                
            }
        }
    })
```



## 如何解决刷新后二次加载路由

```
 1.window.location.reload()
 2.matcher
 const router = createRouter()
 export function resetRouter(){
    const newRouter = creatRouter()
    router.matcher = newRouter.matcher
 }
```
## vuex刷新数据会丢失吗 怎么解决 终极方案数据持久化

 - vuex肯定会重新获取数据，页面也会丢失数据
* 1.把数据直接保存在浏览器缓存里（cookie  localstorage  sessionstorage）
* 2.页面刷新的时候，再次请求数据，达到可以动态更新的方法
* 监听浏览器的刷新书简，在刷新前把数据保存到sessionstorage里，刷新后请求数据，请求到了用vuex，如果没有那就用sessionstorage里的数据

## computed和watch的区别
* 1.computed是计算属性，watch是监听，监听的是data中数据的变化
* 2.computed是支持缓存，依赖的属性值发生变化，计算属性才会重新计算，否则用缓存；watch不支持缓存
* 3.computed不支持异步，watch是可以异步操作
* 4.computed是第一次加载就监听，watch是不监听
* 5.computed函数中必须有return  watch不用

## vuex在什么场景会去使用属性有哪些
state       存储变量
getters     state的计算属性
mutations   提交更新数据的方法
actions     和mutations差不多，他是提交mutations来修改数据，可以包括异步操作
modules     模块化vuex
使用场景：
用户的个人信息、购物车模块、订单模块

## vue的双向数据绑定原理是什么
    通过数据劫持和发布订阅者模式来实现，同时利用Object.defineProperty()劫持各个属性的setter和getter，
    在数据发生改变的时候发布消息给订阅者，触发对应的监听回调渲染视图，也就是说数据和视图时同步的，数据发生改变，视图跟着发生改变，视图改变，数据也会发生改变。
    第一步：需要observer的数据对象进行递归遍历，包括子属性对象的属性，都加上setter和getter
    第二步：compile模板解析指令，把模板中的变量替换成数据，然后初始化渲染视图，同时把每个指令对应的节点绑定上更新函数，添加订阅者，如果数据变化，收到通知，更新视图
    第三步：Watcher订阅者是Observer和Compile之间的通信桥梁，作用：
            1.在自身实例化的时候忘订阅器内添加自己
            2.自身要有一个update()方法
            3.等待属性变动时，调用自身的update方法，触发compile这种的回调
    第四步：MVVM作为数据绑定的入口，整合了observer、compile和watcher三者，通过observer来监听自己的数据变化，通过compile解析模板指令，最后利用watcher把observer和compile联系起来，最终达到数据更新视图更新，视图更新数据更新的效果

## 了解diff算法和虚拟DOM吗
    虚拟DOM，描述元素和元素之间的关系，创建一个JS对象
    如果组件内有响应的数据，数据发生改变的时候，render函数会生成一个新的虚拟DOM，这个新的虚拟DOM会和旧的虚拟DOM进行比对，找到需要修改的虚拟DOM内容，然后去对应的真实DOM中修改
    diff算法就是虚拟DOM的比对时用的，返回一个patch对象，这个对象的作用就是存储两个节点不同的地方，最后用patch里记录的信息进行更新真实DOM
    步骤：
        1.JS对象表示真实的DOM结构，要生成一个虚拟DOM，再用虚拟DOM构建一个真实DOM树，渲染到页面
        2.状态改变生成新的虚拟DOM，跟就得虚拟DOM进行比对，这个比对的过程就是DIFF算法，利用patch记录差异
        3.把记录的差异用在第一个虚拟DOM生成的真实DOM上，视图就更新了。

## 封装一个可复用的组件，需要满足什么条件
* 1.低耦合，组件之间的依赖越小越好
* 2.最好从父级传入信息，不要在公共组件中请求数据
* 3.传入的数据要进行校验
* 4.处理事件的方法写在父组件中

## vue3中如何做强制刷新

 - 强制刷新组建

```
<template>
  <MyComponent :key="componentKey" />
  <button @click="forceUpdate">强制刷新组件</button>
</template>

<script setup>
import { ref } from 'vue';
const componentKey = ref(0);

const forceUpdate = () => {
  componentKey.value++; // 修改 key 值即可触发重渲染
};
</script>

```

- 强制刷新页面
 * 原生 JS 方法：使用 location.reload()。缺点是会产生白屏感，用户体验较差
 * 内置方法
```
getCurrentInstance().proxy.$forceUpdate()
```

## vue3和vue2有哪些区别

Vue3 相比 Vue2，在性能、可维护性和可扩展性上都有明显提升，核心变化包括：响应式系统重写、Composition API、编译优化、Tree Shaking、更好的 TS 支持等
Vue3 使用 Proxy 实现响应式，解决了 Vue2 无法监听新增/删除属性的问题，同时性能更好

* 1.响应式系统：Object.defineProperty → Proxy

| 对比项           | Vue2                      | Vue3                 |
|----------------|---------------------------|----------------------|
| 实现方式         | Object.defineProperty     | Proxy                |
| 新增属性监听     | ❌ 不支持                 | ✅ 支持               |
| 删除属性         | ❌ 不支持                 | ✅ 支持               |
| 数组监听         | 重写数组方法              | 原生支持             |
| 性能             | 初始化递归劫持            | 懒代理，性能更好     |

* 2.Composition API（组合式 API）

- 逻辑聚合（按功能而不是生命周期拆分）
- 更好的代码复用（替代 mixin）
- 更利于大型项目维护
- TypeScript 友好

* 3.性能优化（重点）
Vue3 在编译阶段做了更多静态分析，减少了运行时 diff 开销

* 4.生命周期变化

* 5.v-model 改进

* 6.新增内置组件 Fragment Teleport Suspense

## vue3的性能为什么比vue2好
* 1.diff算法的优化
* 2.静态提升
* 3.事件侦听缓存
