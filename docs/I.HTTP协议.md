## http协议

## 同源策略

同源策略可防止 JavaScript 发起跨域请求。同源被定义为 URI、主机名和端口号的组合。此策略可防止页面上的恶意脚本通过该页面的文档对象模型，访问另一个网页上的敏感数据。

## 跨域

- 原因
  浏览器的同源策略导致了跨域
- 作用
  用于隔离潜在恶意文件的重要安全机制
- 解决
  jsonp ，允许 script 加载第三方资源
  反向代理（nginx 服务内部配置 Access-Control-Allow-Origin \*）
  cors 前后端协作设置请求头部，Access-Control-Allow-Origin 等头部信息
  iframe 嵌套通讯，postmessage
  三个允许跨域加载资源的标签：img link script
-

跨域是可以发送请求，后端也会正常返回结果，只不过这个结果被浏览器拦截了！_
JSONP _
CORS _
websocket _

## 一次完整的HTTP请求所经历的7个步骤

```
HTTP通信机制是在一次完整的HTTP通信过程中，Web浏览器与Web服务器之间将完成下列7个步骤：

建立TCP连接
在HTTP工作开始之前，Web浏览器首先要通过网络与Web服务器建立连接，该连接是通过TCP来完成的，该协议与IP协议共同构建 Internet，即著名的TCP/IP协议族，因此Internet又被称作是TCP/IP网络。HTTP是比TCP更高层次的应用层协议，根据规则， 只有低层协议建立之后才能，才能进行更层协议的连接，因此，首先要建立TCP连接，一般TCP连接的端口号是80。

Web浏览器向Web服务器发送请求行
一旦建立了TCP连接，Web浏览器就会向Web服务器发送请求命令。例如：GET /sample/hello.jsp HTTP/1.1。

Web浏览器发送请求头
浏览器发送其请求命令之后，还要以头信息的形式向Web服务器发送一些别的信息，之后浏览器发送了一空白行来通知服务器，它已经结束了该头信息的发送。

Web服务器应答
客户机向服务器发出请求后，服务器会客户机回送应答， HTTP/1.1 200 OK ，应答的第一部分是协议的版本号和应答状态码。

Web服务器发送应答头
正如客户端会随同请求发送关于自身的信息一样，服务器也会随同应答向用户发送关于它自己的数据及被请求的文档。

Web服务器向浏览器发送数据
Web服务器向浏览器发送头信息后，它会发送一个空白行来表示头信息的发送到此为结束，接着，它就以Content-Type应答头信息所描述的格式发送用户所请求的实际数据。

Web服务器关闭TCP连接
一般情况下，一旦Web服务器向浏览器发送了请求数据，它就要关闭TCP连接，然后如果浏览器或者服务器在其头信息加入了这行代码：

Connection:keep-alive
TCP连接在发送后将仍然保持打开状态，于是，浏览器可以继续通过相同的连接发送请求。保持连接节省了为每个请求建立新连接所需的时间，还节约了网络带宽。

建立TCP连接->发送请求行->发送请求头->（到达服务器）发送状态行->发送响应头->发送响应数据->断TCP连接
```

## Web安全(加上原理)

你所了解到的Web攻击技术
（1）XSS（Cross-Site Scripting，跨站脚本攻击）：指通过存在安全漏洞的Web网站注册用户的浏览器内运行非法的HTML标签或者JavaScript进行的一种攻击。
（2）SQL注入攻击
（3）CSRF（Cross-Site Request Forgeries，跨站点请求伪造）：指攻击者通过设置好的陷阱，强制对已完成的认证用户进行非预期的个人信息或设定信息等某些状态更新。

## 跨域

- 原因
  浏览器的同源策略导致了跨域
- 作用
  用于隔离潜在恶意文件的重要安全机制
- 解决
  ::: tip 解决方案
  jsonp ，允许 script 加载第三方资源

反向代理（nginx 服务内部配置 Access-Control-Allow-Origin \*）

cors 前后端协作设置请求头部，Access-Control-Allow-Origin 等头部信息

iframe 嵌套通讯，postmessage
:::

## DNS解析过程

[DNS解析过程](https://cloud.tencent.com/developer/news/324975)

## 内存泄漏

[内存泄漏](http://www.ruanyifeng.com/blog/2017/04/memory-leak.html)

### Axios下载文件流处理

```
axios({
  url: ``,
  method: "post",
  responseType: 'blob',
  data
}).then(res => {
  if(res.status !== 200) {
    return this.$message.error(res.statusText)
  } else {
    const elink = document.createElement('a'); // 创建一个a标签用于下载
    elink.download = name; // 规定被下载的超链接目标名（文件名）
    elink.style.display = 'none';
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  }
}).catch(err => {
  console.log(err)
})
```

### 统计pv uv

[navigator.sendBacon](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon) 上报埋点数据

```ts
// Navigator.sendBeacon(url, blob)
// 浏览器tab切换 和 最小化浏览器 或 关闭窗口都是执行下面方法并上报数据
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') {
    const header = {
      type: 'application/x-www-form-urlencoded',
    }
    const blob = new Blob([JSON.stringify({ name: 'Dendi', age: 88 })], header)
    navigator.sendBeacon('http://localhost:5200/tracker', blob)
  }
})
```

### 重写浏览器的方法 pushState 和 replaceState

```ts
export const createHistoryEvent = <T extends keyof History>(type: T) => {
    const historyEvent = history[type]
    return function () {
        // 调用原生事件
        historyEvent.apply(this, arguments)
        // 创建新事件 dispatch事件
        const e = new Event(type)
        window.dispatchEvent(e)
    }
}

window.history['pushState'] = createHistoryEvent('pushState')
window.history['replaceState'] = createHistoryEvent('replaceState')


// 跳转自动上报
captureEvents(mouseEventList
:
string[]
)
{
    mouseEventList.forEach(event => window.addEventListener(event, () => {
        console.log('路由跳转上报')
    }))
}

function installTracker() {
    if (this.data.historyTracker) {
        this.captureEvents(['pushState', 'replaceState', 'popstate'],)
    }
    if (this.data.hashTracker) {
        this.captureEvents(['hashchange'], 'hash-pv')
    }
}
```

### 监听元素是否在页面中

[intersection Observer](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      html,
      body {
        margin: 0;
      }

      ul.main {
        list-style: none;
        margin: 0;
        padding: 0;
        height: 100vh;
        overflow-y: scroll;

        .list-item {
          margin: 20px 0;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: antiquewhite;

          .img {
            margin-right: 80px;
          }
        }
      }
    </style>
  </head>

  <body>
    <ul class="main"></ul>
    <script lang="ts">
      window.onload = () => {
        const mainEl = document.querySelector('.main')
        const list = new Array(50).fill(' ')
        const fragment = document.createDocumentFragment()
        const getLiEl = (_, index) => {
          const liEl = document.createElement('li')
          liEl.innerHTML = `<img class="img" style="height: 80px"></img><span>${index + 1}</span>`
          liEl.style.cssText = `color: red; font-weight: bold; font-size: 24px`
          liEl.className = 'list-item'
          liEl.setAttribute(
            'src',
            'https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2022/4/1/1648804913581_50.jpg',
          )
          liEl.setAttribute('index', index + 1)
          return fragment.appendChild(liEl)
        }
        list.forEach(getLiEl)
        mainEl.append(fragment)

        let options = {
          root: document.querySelector('.main'),
          // 预先加载 list-item: 上下margin 20, 本身高度80 = 120px 预先加载5 600px = 120px * 5
          rootMargin: '0px 0px 600px 0px',
          threshold: 0.5,
        }

        const callback = (entries, io) => {
          entries.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) {
              const index = target.getAttribute('index') * 1
              const imgUri = target.getAttribute('src')
              const img = target.querySelector('.img')
              img.setAttribute('src', imgUri)
              target.removeAttribute('src')
              target.removeAttribute('index')
              console.log(index)
              // 停止观察
              io.unobserve(target)

              // 关闭观察器
              // io.disconnect()
            }
          })
        }

        let observer = new IntersectionObserver(callback, options)
        const liEls = document.querySelectorAll('.list-item')
        // 开始监听
        liEls.forEach((li) => {
          observer.observe(li)
        })
      }
    </script>
  </body>
</html>
```

## get和post有什么区别

- 1.get一般是获取数据，post一般是提交数据
- 2.get参数会放在url上，所以安全性比较差，post是放在body中
- 3.get请求刷新服务器或退回是没有影响的，post请求退回时会重新提交数据
- 4.get请求时会被缓存,post请求不会被缓存
- 5.get请求会被保存在浏览器历史记录中,post不会
- 6.get请求只能进行url编码，post请求支持很多种

## 解释一下什么是json

- JSON是一种纯字符串形式的数据，它本身不提供任何方法，适合在网络中进行传输
- JSON数据存储在.json文件中，也可以把JSON数据以字符串的形式保存在数据库、Cookise中
- JS提供了JSON.parse() JSON.stringify()
- 什么时候使用json：定义接口；序列化；生成token；配置文件package.json

## HTTP协议规定的协议头和请求头有什么

- 1.请求头信息：

* Accept:浏览器告诉服务器所支持的数据类型
* Host:浏览器告诉服务器我想访问服务器的哪台主机
* Referer:浏览器告诉服务器我是从哪里来的（防盗链）
* User-Agent:浏览器类型、版本信息
* Date:浏览器告诉服务器我是什么时候访问的
* Connection:连接方式
* Cookie
* X-Request-With:请求方式

- 2.响应头信息：

* Location:这个就是告诉浏览器你要去找谁
* Server:告诉浏览器服务器的类型
* Content-Type:告诉浏览器返回的数据类型
* Refresh:控制了的定时刷新

# WebSocket 心跳检测 - 面试标准答案

## 📋 目录

- [开场白](#开场白)
- [核心回答](#核心回答)
- [完整回答示例](#完整回答示例)
- [常见追问及回答](#常见追问及回答)
- [回答要点总结](#回答要点总结)

---

## 🎯 开场白（30秒）

> "心跳检测是 WebSocket 连接保活和故障检测的机制。我在项目中实现过一套完整的心跳机制，包括定时发送、超时检测和自动重连。"

---

## 💡 核心回答（2-3分钟）

### 1. 为什么需要心跳检测？

**标准答案：**
"主要有三个原因：

1. **检测假连接**：网络层断开但应用层未感知，`readyState` 仍为 `OPEN`，需要主动探测
2. **保持连接活跃**：中间设备（路由器、NAT、防火墙）可能因空闲超时断开长连接
3. **及时发现故障**：快速发现问题并触发重连，提升用户体验"

### 2. 实现方案

**标准答案：**
"我采用 **Ping-Pong 机制**：

- 客户端每 **10 秒**发送 `'ping'` 字符串
- 服务器收到后响应 `'pong'` 字符串
- 如果 **30 秒**内没收到 `'pong'`，判定连接异常并关闭，触发自动重连"

### 3. 技术细节

**标准答案：**
"实现上用了**两个定时器**：

- `setInterval`：定时发送 `ping`（10 秒间隔）
- `setTimeout`：检测超时（30 秒超时）

**关键点：**

- 每次发送 `ping` 后重置超时定时器
- 收到 `pong` 后也重置超时定时器
- 连接关闭时清理所有定时器，避免内存泄漏
- 超时时间设置为发送间隔的 3 倍，避免网络抖动误判"

### 4. 工程实践

**标准答案：**
"在 `onopen` 时启动心跳，在 `onclose` 时停止。超时后关闭连接，触发 `onclose`，进而触发自动重连。这样形成闭环，确保连接可用性。"

---

## 🎤 完整回答示例（3-5分钟）

**面试官：** 请介绍一下 WebSocket 的心跳检测机制。

**你：**

> "好的，我来说一下我在项目中实现的心跳检测机制。
>
> **首先，为什么需要心跳检测？** 主要有三个原因：
>
> 1. **检测假连接**：网络层断开但应用层未感知
> 2. **保持连接活跃**：防止中间设备因空闲断开
> 3. **及时发现故障**：快速触发重连
>
> **我的实现方案是 Ping-Pong 机制：**
>
> - 客户端每 10 秒发送 `'ping'` 字符串
> - 服务器收到后响应 `'pong'`
> - 如果 30 秒内没收到 `'pong'`，判定连接异常
>
> **技术实现上，我用了两个定时器：**
>
> - `setInterval`：定时发送 `ping`（10 秒间隔）
> - `setTimeout`：检测超时（30 秒超时）
>
> **关键逻辑是：**
>
> - 每次发送 `ping` 后重置超时定时器
> - 收到 `pong` 后也重置超时定时器
> - 这样只要连接正常，超时定时器会不断被重置
> - 如果连接断开，30 秒后触发超时，关闭连接并触发重连
>
> **在工程实践上：**
>
> - 连接建立时（`onopen`）启动心跳
> - 连接关闭时（`onclose`）停止心跳并清理定时器
> - 超时后关闭连接，触发自动重连机制
>
> **这个方案的优势是：**
>
> 1. 自动检测，无需人工干预
> 2. 及时响应，30 秒内发现问题
> 3. 资源安全，正确清理定时器
> 4. 与重连机制联动，形成完整的容错体系
>
> **我在实际项目中还遇到过一些问题，比如：**
>
> - **内存泄漏**：忘记清理定时器，后来在 `onclose` 中统一清理
> - **误判**：超时时间设置不合理，后来调整为发送间隔的 3 倍
> - **重连风暴**：网络不稳定时频繁重连，后来加入了指数退避和最大重连次数限制
>
> 这就是我实现的心跳检测机制。"

---

## 🔍 常见追问及回答

### Q1: 心跳频率如何选择？

**标准答案：**

> "需要平衡实时性和资源消耗：
>
> - **实时性要求高**：可以 5 秒（如股票行情）
> - **一般场景**：10-30 秒（如聊天、通知）
> - **低频场景**：可以更长（如状态同步）
>
> 我们选择 10 秒是综合考虑了实时性和服务器压力。"

### Q2: 服务器端如何实现？

**标准答案：**

> "服务器端收到 `ping` 后立即返回 `pong`。可以用定时器定期检查客户端是否超时，也可以基于心跳时间戳判断。我们用的是时间戳方式，记录每个连接的最后心跳时间，定期扫描超时的连接并关闭。"

### Q3: 心跳会影响性能吗？

**标准答案：**

> "影响很小：
>
> - `ping`/`pong` 是短字符串，传输量小（几个字节）
> - 定时器开销也很低
> - 相比连接断开的代价，心跳成本可忽略
>
> 实际测试中，1000 个连接的心跳开销不到 1% CPU。"

### Q4: 为什么是 10 秒和 30 秒？

**标准答案：**

> "这是平衡的结果：
>
> - **10 秒发送间隔**：不会过于频繁，也不会间隔太长
> - **30 秒超时**：给网络延迟和服务器处理留出缓冲
> - **超时时间 = 发送间隔 × 3**，避免误判
>
> 实际项目中可以根据业务调整，比如实时性要求高的可以缩短到 5 秒。"

### Q5: 有没有其他方案？

**标准答案：**

> "还有几种方案：
>
> 1. **TCP Keep-Alive**：系统层，但不够灵活
> 2. **应用层心跳**：更可控，我们用的就是这种
> 3. **WebSocket Ping/Pong 帧**：协议层，但浏览器 API 不支持发送 Ping 帧
>
> 我们选择应用层心跳，因为兼容性好、可控性强。"

### Q6: 遇到过什么问题？

**标准答案：**

> "遇到过几个问题：
>
> 1. **内存泄漏**：忘记清理定时器，已修复
> 2. **误判**：超时时间设置不合理，已调整为发送间隔的 3 倍
> 3. **重连风暴**：网络不稳定时频繁重连，已加入指数退避和最大重连次数限制
> 4. **时区问题**：服务器和客户端时区不一致导致时间戳判断错误，后来统一使用 UTC 时间"

---

## ✅ 回答要点总结

### 回答结构

1. ✅ **结构清晰**：问题 → 方案 → 实现 → 实践
2. ✅ **有数据**：10 秒、30 秒等具体参数
3. ✅ **有思考**：为什么这样设计
4. ✅ **有经验**：遇到过的问题和解决方案
5. ✅ **有深度**：技术细节和工程实践

### 回答技巧

- 🎯 **先说结论**：直接说明是什么
- 📊 **再说原理**：解释为什么
- 🔧 **最后说实现**：展示怎么做
- 💡 **补充经验**：分享踩过的坑

### 关键数据

- **发送间隔**：10 秒
- **超时时间**：30 秒
- **超时倍数**：发送间隔 × 3
- **最大重连次数**：5 次
- **重连间隔**：3 秒

---

## 📝 代码示例（可选展示）

如果面试官要求看代码，可以展示核心部分：

```javascript
// 启动心跳
startHeartbeat() {
  if (this.heartbeatTimer) return

  // 每 10 秒发送一次 ping
  this.heartbeatTimer = setInterval(() => {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send('ping')
      this.resetHeartbeatTimeout() // 重置超时定时器
    }
  }, 10000)

  this.resetHeartbeatTimeout()
}

// 重置超时定时器
resetHeartbeatTimeout() {
  if (this.heartbeatTimeoutTimer) {
    clearTimeout(this.heartbeatTimeoutTimer)
  }

  // 30 秒内没收到 pong 就超时
  this.heartbeatTimeoutTimer = setTimeout(() => {
    console.warn('Heartbeat timeout, closing connection')
    if (this.socket) {
      this.socket.close() // 关闭连接，触发重连
    }
  }, 30000)
}

// 接收消息时处理 pong
onmessage = (event) => {
  if (event.data === 'pong') {
    this.resetHeartbeatTimeout() // 收到 pong，重置超时
    return
  }
  // ... 处理其他消息
}
```

---

## 🎓 进阶知识点（加分项）

### 1. 心跳协议设计

- 使用简单的字符串 `'ping'`/`'pong'`，避免 JSON 解析开销
- 也可以使用 JSON 格式，便于扩展（如携带时间戳）

### 2. 超时时间计算

- 超时时间 = 发送间隔 × 2-3 倍
- 考虑网络延迟、服务器处理时间、时钟偏差

### 3. 心跳与重连的联动

- 心跳超时 → 关闭连接 → 触发 `onclose` → 自动重连
- 形成完整的容错闭环

### 4. 资源管理

- 连接关闭时清理所有定时器
- 避免内存泄漏和无效的定时器执行

### 5. 性能优化

- 心跳消息尽量小（字符串优于 JSON）
- 批量处理多个连接的心跳
- 使用 Web Worker 处理心跳（可选）

---

## 📚 相关知识点

### WebSocket 状态

- `WebSocket.CONNECTING` (0) - 连接中
- `WebSocket.OPEN` (1) - 已连接
- `WebSocket.CLOSING` (2) - 关闭中
- `WebSocket.CLOSED` (3) - 已关闭

### 心跳检测时机

- ✅ 连接建立时启动
- ✅ 连接关闭时停止
- ✅ 超时时关闭连接

### 最佳实践

1. ✅ 超时时间 > 发送间隔 × 2
2. ✅ 及时清理定时器
3. ✅ 与重连机制联动
4. ✅ 记录心跳日志（便于排查问题）

---

**最后更新：** 2024年

**适用场景：** WebSocket 相关面试、技术分享、代码审查

## 说说TCP为什么需要三次握手和四次挥手

https://vue3js.cn/interview/http/handshakes_waves.html#%E4%B8%80%E3%80%81%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B
