## this指向的四种规则

> 面向对象语言中 this 表示当前对象的一个引用。
> 但在 JavaScript 中 this 不是固定不变的，它会随着执行环境的改变而改变。

### 01.默认绑定
a.全局作用域中this指向window

```js
console.log({} === {}) // false
console.log(this === window) // true 全局作用域
```

b.函数的独立调用 非严格模式下this 指向 window; 严格模式指向 undefined

```js
// 函数的独立调用
function x() {
  console.log(this)
}
x() // 与window.x()效果一致 函数的独立调用
```

### 02.隐式绑定规则
a.在对象中的方法中, this 表示该方法所属的对象(谁调用就指向谁)

```js
const obj = {
  a: 1,
  test() {
    console.log(this) // obj
    function x() {
      console.log(this) // window 这里是函数的独立调用
    }
    x();
    (function () {
      console.log(this) // window 函数声明后马上调用 函数的独立调用
    })()
  }
}
obj.test()
```

b.闭包（closure）中this 执向window
> 当函数执行的时候 导致新函数被定义, 并抛出

```js
const obj = {
  a: 1,
  test() {
    console.log(this) // obj
    function x() {
      console.log(this) // window 这里是函数的独立调用
    }
    return x
  }
}
obj.test()() // x() 也是函数的独立调用
```

c: 回掉函数函数中的this

```js
const arr = [1, 2]
arr.forEach(function () {
  console.log(this) // widnow
})
arr.sort(function (a, b) {
  console.log(this) // window
  return a - b
})

setInterval(function () {
  console.log(this) // window
})
```

d.变量赋值的情况

```js
const a  = 0
function foo() {
  console.log(this)
}
const obj = {
  a: 2,
  foo: foo,
}
// 隐式丢失≠
const bar = obj.foo
bar() // 0 函数的独立调用
```

f.函数参数赋值的情况

```js
const a = 0
function foo() {
  console.log(this)
}
function bar(fn) {
  fn()
}
const obj = {
  a: 2,
  foo: foo,
}

bar(obj.foo) // window
```


### 03. 显式绑定
> call apply bind

```js
const a = 0
function foo(a, b, c, d, e) {
  console.log(a, b, c, d, e)
  console.log(this)
}
const obj = {
  a: 2,
  foo
}
const bar = obj.foo

obj.foo(1, 2, 3, 4, 5)
bar.call(obj, 1, 2, 3, 4, 5)
bar.call(100, 1, 2, 3, 4, 5) // Number的实例对象 { 100 }
bar.call(true, 1, 2, 3, 4, 5) // Boolean的实例对象 { true }
bar.call('a', 1, 2, 3, 4, 5) // String的实例对象 { 'a' }
bar.call(null, 1, 2, 3, 4, 5) // 绑定失败 默认指向window
bar.call(undefined, 1, 2, 3, 4, 5) // 绑定失败 默认指向window
bar.apply(obj, [1, 2, 3, 4, 5])
bar.bind(obj)(1, 2, 3, 4, 5)
```

### 04.new 关键字绑定

```js
function Person() {
  this.name = 'Tom'
  this.age = 33
  console.log(this, 'this') // 指向生产的新对象
}
const person = new Person()
console.log(person) // 新对象的引用

const obj2 = {
  a: 1
}
;(function () {
  console.log(this) // obj2
}).call(obj2)
```

### 05. this 绑定的优先级 new > 显示绑定 > 隐式绑定 > 默认绑定

```js
function test() {
  console.log(this.a)
}

const obj1 = {
  a: 2,
  test: test,
}

const obj2 = {
  a: 3,
  test,
}

obj1.test() // 隐式绑定
obj2.test() // 隐式绑定

obj1.test.call(obj2) // 显示绑定优先级大于隐式绑定 3
obj2.test.call(obj1) // 显示绑定优先级大于隐式绑定 2
```

```js
function foo(b) {
  this.a = b
}
const obj1 = {}
const bar = foo.bind(obj1)
bar(2) //  执行到这里的时候 bar = foo(b) { obj1.a = 2 }
console.log(obj1.a) // 2
const baz = new bar(3) // new绑定优先级高于bind this指向baz
console.log(obj1.a) // 2

console.log(baz.a) // 3
```

### 06.在事件中 this指向触发的对象

```html
<button onclick="this.style.display='none'">点我后我就消失了</button>
```

### 07.默认绑定 函数独立调用改变箭头函数中 this 无效

```js
const a = 0
function foo() {
  console.log(this) // obj
  const test = () => {
    console.log(this)  // obj
  }
  return test
}
const obj = {
  a: 1,
  foo
}
obj.foo()() // 默认绑定规则（独立调用）对箭头函数无效
```

### 08.隐式绑定

```js
const a = 0
function foo() {
  console.log(this)
}
const foo2 = () => {
  console.log(this)
}
const obj = {
  a: 1,
  foo,
  foo2,
}
obj.foo() // obj
obj.foo2() // window 隐式绑定规则无效
```

### 09.显示绑定改变箭头函数中this 无效

```js
const a = 0
function foo() {
  console.log(this) // obj
  const test = () => {
    console.log(this)  // obj
  }
  return test
}
const obj1 = {
  a: 1,
  foo
}
const obj2 = {
  a: 2,
  foo
}
const bar = foo.call(obj2) // 显示绑定规则绑定规则无效
bar()
```

### 10.箭头函数中的this 箭头函数不存在this 指的是父级作用域中的this

```js
const a = 0
function foo() {
  console.log(this) // obj
  const test = () => {
    console.log(this) // obj 父级作用域中的this 有父级作用域的this
  }
  test()
}
const obj = {
  a: 1,
  foo
}
obj.foo()
```

### 面试题

```js
var name = 'window'

var person1 = {
  name: 'person1',
  foo1: function () {
    console.log(this.name)
  },
  foo2: () => console.log(this.name),
  foo3: function () {
    return function () {
      console.log(this.name)
    }
  },
  foo4: function () {
    return () => {
      console.log(this.name)
    }
  }
}

var person2 = { name: 'person2' }

person1.foo1() // person1
person1.foo1.call(person2) // pserson2

person1.foo2() // window
person1.foo2.call(person2) // window

person1.foo3()() // window
person1.foo3.call(person2)() // window
person1.foo3().call(person2) // person2

person1.foo4()() // person1
person1.foo4.call(person2)() // pserson2
person1.foo4().call(person2) // pserson1
```

> 做一道阿里关于this的面试题

```js
var name = 222;
var a = {
  name: 111,
  say: function () {
    console.log(this.name);
  },
};

var fun = a.say;
fun() //222   fun.call(window) 函数独立调用
a.say() //111  a.say.call(a) 隐式绑定

var b = {
  name: 333,
  say: function (fun) {
    fun()
  },
}

b.say(a.say) //222 函数独立调用
b.say = a.say
b.say() //333 隐式绑定
```


### JS中关于this指向的问题
:::tip

- a.全局对象中的this指向
   指向的是window

- b.全局作用域或者普通函数中的this
   指向全局window

- c.this永远指向最后调用它的那个对象
   在不是箭头函数的情况下

- d.new 关键词改变了this的指向

- e. apply,call,bind
   可以改变this指向，不是箭头函数

- f.箭头函数中的this
   它的指向在定义的时候就已经确定了
   箭头函数它没有this,看外层是否有函数，有就是外层函数的this，没有就是window

- g.匿名函数中的this
   永远指向了window,匿名函数的执行环境具有全局性，因此this指向window

:::


### this指向汇总

#### 1. **默认绑定（普通函数调用）**
- **非严格模式**：`this`指向全局对象（浏览器中为`window`，Node.js中为`global`）。
- **严格模式**：`this`为`undefined`。
   ```javascript
   function test() {
     console.log(this);
   }
   test(); // 非严格模式：window；严格模式：undefined
   ```

#### 2. **隐式绑定（方法调用）**
- 函数作为对象的方法调用时，`this`指向该对象。
   ```javascript
   const obj = {
     name: 'obj',
     method() {
       console.log(this.name); // 输出'obj'
     }
   };
   obj.method();
   ```

#### 3. **隐式丢失**
- 方法被赋值后单独调用，`this`丢失原指向。
   ```javascript
   const method = obj.method;
   method(); // 非严格模式：window.name；严格模式：报错
   ```

#### 4. **显式绑定（call/apply/bind）**
- 使用`call`、`apply`或`bind`显式设置`this`。
   ```javascript
   obj.method.call({ name: 'new' }); // 输出'new'
   const bound = obj.method.bind({ name: 'bound' });
   bound(); // 输出'bound'
   ```

#### 5. **构造函数绑定（new）**
- 使用`new`调用构造函数时，`this`指向新创建的实例。
   ```javascript
   function Person(name) {
     this.name = name;
   }
   const person = new Person('John');
   console.log(person.name); // 输出'John'
   ```

#### 6. **箭头函数**
- 箭头函数的`this`继承自外层作用域，定义时确定且不可更改。
   ```javascript
   const arrowObj = {
     name: 'arrow',
     method: () => console.log(this.name) // this指向外层（如window）
   };
   arrowObj.method(); // 输出外层this的name
   ```

#### 7. **事件处理函数**
- DOM事件中，`this`默认指向触发事件的元素。
   ```javascript
   button.addEventListener('click', function() {
     console.log(this); // 指向button元素
   });
   ```

#### 8. **类中的this**
- 类方法中的`this`默认指向实例，但直接调用可能丢失绑定。
   ```javascript
   class MyClass {
     name = 'class';
     method = () => {
       console.log(this.name); // 箭头函数确保this指向实例
     }
   }
   const instance = new MyClass();
   const method = instance.method;
   method(); // 输出'class'
   ```

#### 9. **嵌套函数中的this**
- 普通嵌套函数的`this`可能丢失外层绑定，需用箭头函数或保存`this`。
   ```javascript
   const obj = {
     name: 'obj',
     method() {
       const inner = () => console.log(this.name); // 箭头函数保留this
       inner();
     }
   };
   obj.method(); // 输出'obj'
   ```

#### 总结表格
| **场景**               | **this指向**                             |
|-------------------------|------------------------------------------|
| 普通函数调用           | 全局对象 / `undefined`（严格模式）       |
| 对象方法调用           | 调用该方法的对象                         |
| call/apply/bind        | 指定的对象                               |
| 构造函数（new）        | 新创建的实例                             |
| 箭头函数               | 定义时的外层作用域this                   |
| DOM事件处理函数        | 触发事件的元素                           |
| 类方法（未绑定）       | 实例（需注意绑定丢失问题）               |

理解`this`的关键在于分析函数的调用方式、是否使用绑定方法，以及是否为箭头函数。多结合具体场景练习，逐步掌握其行为模式。

