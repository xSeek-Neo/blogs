# 从输入 URL 到页面展示的完整过程

## 完整流程概览

```
用户输入 URL
    ↓
URL 解析与处理
    ↓
查找浏览器缓存（强缓存）
    ↓
DNS 解析
    ↓
建立 TCP 连接
    ↓
TLS 握手（HTTPS）
    ↓
发送 HTTP 请求
    ↓
服务器处理与响应
    ↓
接收 HTTP 响应
    ↓
解析 HTML、CSS、JS
    ↓
构建 DOM 树、CSSOM 树
    ↓
构建渲染树
    ↓
布局（Layout）
    ↓
绘制（Paint）
    ↓
合成（Composite）
    ↓
页面显示
```

## 一、URL 解析与预处理阶段

### 1. URL 解析（第一步）

**浏览器首先解析 URL 中的各个组成部分：**

- **协议（Protocol）**：HTTP / HTTPS / FTP 等
- **域名（Domain）**：如 `www.example.com`
- **端口号（Port）**：默认 HTTP 为 80，HTTPS 为 443
- **路径（Path）**：如 `/index.html`
- **查询参数（Query）**：如 `?id=123&name=test`
- **锚点（Hash）**：如 `#section1`（不会发送到服务器）

**特殊处理：**
- 如果输入的内容不是一个合法 URL，浏览器通常会将其交由**默认搜索引擎处理**（如 Google、百度）
- 如果输入的是域名但没有协议，浏览器会自动补全协议（通常是 HTTPS）
- 如果输入的是 IP 地址，会直接使用该 IP，跳过 DNS 解析

**示例：**
```
输入：example.com
解析后：https://example.com/（自动补全协议和路径）
```

### 2. 查找浏览器缓存（强缓存检查）

**在发起网络请求之前，浏览器会先检查缓存：**

**缓存查找顺序：**
1. **Memory Cache**：内存缓存，关闭标签页后失效
2. **Disk Cache**：磁盘缓存，持久化存储

**缓存判断逻辑：**
- **未缓存**：发起新请求
- **已缓存且新鲜**：直接使用缓存，**跳过网络请求**
- **已缓存但过期**：携带验证信息（`If-None-Match`、`If-Modified-Since`）发起协商缓存请求

**缓存控制机制：**
- **HTTP/1.0**：`Expires` 头（绝对时间）
- **HTTP/1.1**：`Cache-Control` 头（推荐使用）

**Cache-Control 常用指令：**
- `max-age=<seconds>`：缓存有效期（秒）
- `public`：可被任何缓存（浏览器、CDN）缓存
- `private`：仅浏览器缓存，不被共享缓存缓存
- `no-cache`：使用前必须验证（协商缓存）
- `no-store`：不缓存，每次从服务器获取
- `must-revalidate`：过期后必须验证
- `immutable`：资源不变，无需验证（适用于带版本号的静态资源）

**缓存验证（协商缓存）：**
- 验证请求头：`If-None-Match`（ETag）、`If-Modified-Since`（Last-Modified）
- 服务器响应：`304 Not Modified`（使用缓存）或 `200 OK`（返回新资源）

**缓存策略建议：**

**1. 静态资源（JS/CSS/图片/字体等）**
```http
Cache-Control: public, max-age=31536000, immutable
```
- 使用文件版本号或 hash（如 `app.abc123.js`）
- 长期缓存（1年），资源不变时无需验证

**2. HTML 文件**
```http
Cache-Control: no-cache, must-revalidate
```
- 不缓存或短期缓存，确保及时获取更新
- 每次使用前验证，保证内容最新

**3. API 响应（数据接口）**
```http
Cache-Control: private, max-age=300, stale-while-revalidate=3600
```
- 短期缓存（5分钟），过期后后台更新
- 使用 `private` 避免共享缓存

**4. 用户相关数据**
```http
Cache-Control: private, max-age=3600
```
- 仅浏览器缓存，不共享
- 根据数据更新频率设置缓存时间

**5. 敏感数据**
```http
Cache-Control: no-store, no-cache, must-revalidate
```
- 完全不缓存，每次从服务器获取

**最佳实践：**
- 静态资源使用版本号/hash，设置长期缓存
- HTML 使用协商缓存，确保及时更新
- API 数据根据更新频率设置合适的缓存时间
- 利用 `stale-while-revalidate` 提升用户体验

## 二、网络请求阶段

### 1. DNS 解析（Domain Name System）

**DNS 的作用是将域名转换为服务器的 IP 地址。**

**DNS 查询顺序（递归查询）：**
1. **浏览器缓存**：检查浏览器自身的 DNS 缓存
2. **操作系统缓存**：检查 `hosts` 文件和系统 DNS 缓存
3. **路由器缓存**：检查路由器 DNS 缓存
4. **ISP DNS 缓存**：检查 ISP（互联网服务提供商）的 DNS 服务器缓存
5. **DNS 递归查询**：
   - 从根域名服务器开始查询
   - 逐级查询：`.com` → `example.com` → `www.example.com`
   - 最终返回 IP 地址
   - **可能存在负载均衡，导致每次 IP 不一样**

**为什么是逐级查询？**

DNS 采用**分层树状结构**，每个域名服务器只负责自己管辖的域名区域：

1. **根域名服务器（Root DNS）**：全球共 13 组根服务器，负责顶级域名（`.com`、`.org`、`.cn` 等）
2. **顶级域名服务器（TLD DNS）**：负责二级域名（如 `.com` 下的所有域名）
3. **权威域名服务器（Authoritative DNS）**：负责具体域名的解析（如 `baidu.com`）

**查询过程（以 `www.baidu.com` 为例）：**

**面试时这样表达：**
> "当浏览器要访问 www.baidu.com 时，DNS 解析是逐级查询的：
> 
> 1. **第一步**：客户端向本地 ISP 的 DNS 服务器发起查询
> 2. **第二步**：ISP DNS 服务器不知道，就去问根域名服务器："www.baidu.com 的 IP 是多少？"
> 3. **第三步**：根服务器回答："我不知道具体 IP，但我知道 .com 的服务器地址，你去问它"，然后返回 .com 服务器的地址
> 4. **第四步**：ISP DNS 去问 .com 服务器："www.baidu.com 的 IP 是多少？"
> 5. **第五步**：.com 服务器回答："我不知道具体 IP，但我知道 baidu.com 的权威服务器地址，你去问它"
> 6. **第六步**：ISP DNS 去问 baidu.com 的权威服务器："www.baidu.com 的 IP 是多少？"
> 7. **第七步**：权威服务器返回最终 IP 地址，比如 39.156.66.10
> 8. **第八步**：ISP DNS 把 IP 返回给客户端，并缓存这个结果"

**流程图：**
```
客户端 → ISP DNS 服务器
  ↓
ISP DNS → 根服务器："www.baidu.com 的 IP？"
  ↓
根服务器："去问 .com 服务器"（返回 .com 服务器地址）
  ↓
ISP DNS → .com 服务器："www.baidu.com 的 IP？"
  ↓
.com 服务器："去问 baidu.com 的权威服务器"（返回权威服务器地址）
  ↓
ISP DNS → baidu.com 权威服务器："www.baidu.com 的 IP？"
  ↓
权威服务器："IP 是 39.156.66.10"
  ↓
ISP DNS → 客户端：返回 IP 并缓存
```

**面试回答要点（三步法）：**

**1. 先说原理：**
> "DNS 采用分层树状结构，每个服务器只管理自己的域名空间。就像查电话簿，先查省份，再查城市，最后查具体人名"

**2. 再说过程：**
> "查询时从右到左逐级解析：先问根服务器（.com），再问顶级域名服务器（baidu.com），最后问权威服务器得到 IP"

**3. 最后说优化：**
> "实际查询中，ISP DNS 服务器会缓存结果，所以大部分情况下不需要每次都走完整流程。而且客户端到 ISP DNS 是递归查询，客户端只发一次请求，后续查询都由 ISP DNS 完成"

**只有当所有本地缓存均未命中时，才会向 DNS 服务器发起真正的网络请求。**

### 2. 建立 TCP 连接（三次握手）

**浏览器通过 TCP 协议与服务器建立可靠连接：**

**三次握手过程：**
1. **第一次握手（SYN）**：
   - 客户端发送一个 TCP 包，设置 `SYN=1`，序列号 `Seq=X`
   - 客户端进入 `SYN_SENT` 状态
   - 表示客户端请求建立连接

2. **第二次握手（SYN-ACK）**：
   - 服务器收到请求后，返回响应包
   - 设置 `SYN=1`，`ACK=X+1`，序列号 `Seq=Y`
   - 服务器进入 `SYN_RCVD` 状态
   - 表示服务器确认客户端的连接请求，同时请求与客户端建立连接

3. **第三次握手（ACK）**：
   - 客户端发送确认包，设置 `ACK=Y+1`，序列号 `Seq=Z`
   - 客户端和服务器都进入 `ESTABLISHED` 状态
   - **连接建立完成**，可以开始传输数据

**为什么需要三次握手？**

1. **确认双方的发送和接收能力**：确保客户端和服务器都能发送和接收数据
2. **防止已失效的连接请求**：防止网络延迟导致的过期连接请求被服务器误认为是新连接

**为什么不能是两次？**
- 两次握手时，服务器无法确认客户端能接收数据
- 如果客户端发送的 SYN 因网络延迟卡住，客户端会重发。旧请求到达时，两次握手会让服务器误认为是新连接并建立连接，但客户端已关闭，导致服务器一直等待

**为什么不能是四次？**
- 三次已足够确认双方的双向通信能力，四次是多余的

**TCP 连接复用（Keep-Alive）：**
- HTTP/1.1 默认启用 `Connection: keep-alive`
- 同一个 TCP 连接可以发送多个 HTTP 请求
- 减少 TCP 握手的开销

### 3. TLS 握手（仅 HTTPS）

**如果使用的是 HTTPS 协议，在 TCP 建立完成后，还需要进行 TLS 握手才能建立安全连接。**

**为什么需要 TLS 握手？**
- **验证服务器证书**：确保连接的是真正的目标服务器，防止中间人攻击
- **协商加密算法**：客户端和服务器协商出双方都支持的加密套件
- **协商对称加密密钥**：通过非对称加密（公钥/私钥）安全地协商出对称加密的共享密钥

### 4. 浏览器组装 HTTP 请求报文

**浏览器构建 HTTP 请求报文，包括：**

**请求行：**
```
GET /index.html HTTP/1.1
```
- 请求方法：GET、POST、PUT、DELETE 等
- 请求路径：URL 的路径部分
- HTTP 版本：HTTP/1.1 或 HTTP/2

**请求头（Request Headers）：**
- `Host`：目标主机名（必需）
- `User-Agent`：浏览器类型和版本
- `Accept`：客户端可接受的内容类型
- `Accept-Language`：客户端可接受的语言
- `Accept-Encoding`：客户端可接受的编码（如 gzip）
- `Cookie`：存储的 Cookie 信息
- `Referer`：来源页面 URL
- `Connection`：连接方式（keep-alive / close）
- `Cache-Control`：缓存控制
- `If-None-Match` / `If-Modified-Since`：缓存验证（协商缓存）

**请求体（Request Body）：**
- GET 请求通常没有请求体
- POST、PUT 请求包含请求数据（表单数据、JSON 等）

### 5. 发送 HTTP 请求

**浏览器通过已建立的 TCP/TLS 连接发送 HTTP 请求报文给服务器。**

## 三、服务器处理阶段

### 1. 服务器接收与路由

**服务器（如 Nginx、Apache）接收到 HTTP 请求后，首先进行请求解析和路由：**

- **解析请求头**：提取请求方法、路径、协议版本、请求头信息
- **缓存验证**：检查 HTTP 请求头中的缓存验证信息（如 `If-None-Match`、`If-Modified-Since`）
  - 如果资源未修改，返回 **304 Not Modified**，客户端使用本地缓存
  - 如果资源已修改或不存在，继续处理请求

### 2. 请求处理流程

**典型的服务器架构（Nginx 作为反向代理）：**

```
客户端请求 → Nginx（反向代理服务器）
              ↓
        ┌─────┴─────┐
        ↓           ↓
   静态资源      动态请求
   (直接返回)    (转发后端)
                  ↓
           后端应用服务器
           (Node.js/Java等)
                  ↓
              数据库/缓存
```

**处理流程：**

1. **静态资源请求**
   - Nginx 直接返回文件系统中的静态文件（HTML、CSS、JS、图片等）
   - 无需转发到后端，响应最快

2. **动态请求（需要后端处理）**
   - Nginx 作为**反向代理**，将请求转发到后端应用服务器
   - 后端应用服务器处理：
     - 执行业务逻辑
     - 访问数据库或缓存获取数据
     - 进行数据计算和处理
     - 生成 HTML 或 JSON 响应
   - 响应通过 Nginx 返回给客户端

### 3. 返回 HTTP 响应

**服务器构建并返回 HTTP 响应报文，主要包含：**

**状态行：**
```
HTTP/1.1 200 OK
```
- `200 OK`：请求成功
- `301 Moved Permanently`：永久重定向
- `302 Found`：临时重定向
- `304 Not Modified`：缓存有效（协商缓存）
- `400 Bad Request`：请求错误
- `401 Unauthorized`：未授权
- `403 Forbidden`：禁止访问
- `404 Not Found`：资源不存在
- `500 Internal Server Error`：服务器错误
- `502 Bad Gateway`：网关错误
- `503 Service Unavailable`：服务不可用

**响应头（Response Headers）：**
- `Content-Type`：资源类型（`text/html`、`application/json`、`image/png` 等）
- `Content-Length`：响应体大小（字节）
- `Content-Encoding`：内容编码（如 `gzip`、`br`）
- `Cache-Control`：缓存控制策略
- `ETag`：资源版本标识（用于协商缓存）
- `Last-Modified`：资源最后修改时间（用于协商缓存）
- `Set-Cookie`：设置 Cookie
- `Location`：重定向目标 URL（用于 301/302）
- `Access-Control-Allow-Origin`：CORS 跨域控制

**响应体（Response Body）：**
- HTML 文档
- JSON 数据
- 二进制资源（图片、视频、字体等）

## 四、浏览器接收响应阶段

### 1. 接收 HTTP 响应

**浏览器接收服务器返回的 HTTP 响应报文：**

- 解析状态码，判断请求是否成功
- 解析响应头，提取缓存信息、内容类型等
- 接收响应体数据（可能是流式接收）

### 2. 处理重定向

**如果服务器返回 301 或 302 重定向：**

- 浏览器读取 `Location` 响应头，获取重定向目标 URL
- **自动发起新的请求**到重定向 URL
- 重定向可能会发生多次（浏览器通常限制重定向次数，如 20 次）
- 重定向会增加额外的网络请求，影响性能

**重定向类型：**
- **301 永久重定向**：浏览器会缓存重定向关系，后续直接访问新 URL
- **302 临时重定向**：每次都需要重定向，不缓存

### 3. 处理缓存响应

**如果服务器返回 304 Not Modified：**
- 浏览器使用本地缓存资源
- 不下载响应体，节省带宽和时间

**如果服务器返回 200 OK：**
- 浏览器接收新资源
- 根据响应头更新缓存（`Cache-Control`、`ETag`、`Last-Modified`）

### 4. 解压响应内容

**如果响应使用了压缩（`Content-Encoding: gzip`）：**
- 浏览器自动解压响应体
- 支持 gzip、deflate、br（Brotli）等压缩格式

### 5. 开始解析 HTML

**浏览器接收到 HTML 数据后，开始解析和渲染流程。**

## 五、浏览器渲染阶段（核心重点）

当浏览器接收到 HTML 数据后，渲染引擎开始工作。这是整个页面展示过程中最关键的部分，直接影响首屏渲染速度和用户体验。

### 渲染流程概览

```
HTML 字节流 → DOM 树 → CSSOM 树 → 渲染树 → 布局 → 绘制 → 分层 → 合成 → 屏幕显示
```

### 1. 构建 DOM 树（DOM Tree）

**过程：**
- 浏览器接收到 HTML 字节流后，**自上而下逐行解析**
- 将 HTML 标签转换为 **DOM 节点**（Node）
- 根据标签的嵌套关系，形成树形结构
- 每个节点包含标签名、属性、子节点等信息

**特点：**
- **渐进式解析**：遇到 `<script>` 标签会暂停 DOM 解析，执行完 JS 后继续
- **容错机制**：浏览器会自动修复一些 HTML 错误（如未闭合标签）
- **解析是异步的**：不会阻塞其他资源的下载

**示例：**
```html
<html>
  <head>
    <title>页面标题</title>
  </head>
  <body>
    <div>内容</div>
  </body>
</html>
```
解析后形成：
```
Document
└── html
    ├── head
    │   └── title
    │       └── "页面标题"
    └── body
        └── div
            └── "内容"
```

**优化建议：**
- 减少 DOM 层级深度
- 避免在 HTML 中写大量内联样式和脚本
- 使用 `defer` 或 `async` 属性延迟脚本执行

**资源加载时机：**

在 HTML 解析过程中，遇到以下资源标签会触发额外的网络请求：

- `<link rel="stylesheet">`：CSS 样式表
- `<script src="">`：JavaScript 脚本
- `<img src="">`：图片资源
- `<video src="">`、`<audio src="">`：媒体资源
- `<iframe src="">`：嵌入页面
- `@font-face`：字体文件

**关键点：**
- **同步 JavaScript 会阻塞 DOM 解析**：遇到 `<script>` 标签时，浏览器会暂停 DOM 解析，下载并执行脚本
- **CSS 会阻塞渲染**：必须等待 CSS 解析完成才能构建渲染树
- **图片不会阻塞渲染**：图片加载是异步的，但会影响页面布局（如果未设置尺寸）
- **资源加载是并行的**：浏览器会并行下载多个资源（受同域连接数限制，HTTP/1.1 通常是 6-8 个）

### 2. 构建 CSSOM 树（CSS Object Model）

**过程：**
- 解析所有 CSS 资源（外链 CSS、内联 `<style>`、行内样式）
- 将 CSS 规则转换为 **CSSOM 树**
- 计算每个节点的最终样式（继承、层叠、优先级）

**特点：**
- **CSS 解析会阻塞渲染**：浏览器必须等待 CSS 解析完成才能构建渲染树
- **不会阻塞 DOM 解析**：DOM 和 CSSOM 的构建是并行的
- **CSS 选择器从右到左匹配**：`div p span` 先找 `span`，再找 `p`，最后找 `div`

**CSS 阻塞渲染的原因：**
- 如果 CSS 未加载完成就渲染，可能出现 **FOUC（Flash of Unstyled Content）** 闪烁
- 浏览器会等待 CSS 解析完成，确保首次渲染就是正确的样式

**优化建议：**
- 将关键 CSS 内联到 HTML 中（Critical CSS）
- 非关键 CSS 使用 `media` 属性延迟加载：`<link rel="stylesheet" media="print" href="print.css">`
- 避免使用过于复杂的选择器（如 `div > ul > li > a > span`）
- 减少 CSS 文件数量和大小

### 3. 生成渲染树（Render Tree）

**过程：**
- 将 **DOM 树** 和 **CSSOM 树** 合并
- 遍历 DOM 树，为每个可见节点找到对应的 CSS 规则
- 计算每个节点的最终样式（继承、层叠、优先级）
- 生成只包含**可见元素**的渲染树

**关键点：**
- **只包含可见节点**：
  - `display: none` 的元素**不会**出现在渲染树中
  - `visibility: hidden` 的元素**会**出现在渲染树中（占据空间但不显示）
  - `<head>`、`<script>` 等不可见元素会被剔除
- **每个节点包含完整的样式信息**：位置、大小、颜色、字体等

**示例：**
```html
<div style="display: none">隐藏内容</div>
<p>可见内容</p>
```
渲染树中只包含 `<p>` 节点，不包含 `<div>`。

### 4. 布局（Layout / Reflow 回流）

**过程：**
- 计算渲染树中每个节点的**几何信息**：
  - 位置坐标（x, y）
  - 尺寸大小（width, height）
  - 边框、内边距、外边距
- 确定元素在页面中的**精确位置和大小**
- 这是一个**自上而下、可能递归**的过程（因为某些元素的大小依赖于子元素）

**触发回流的操作：**
- 修改 DOM 结构（添加、删除、移动节点）
- 修改元素的尺寸相关属性：
  - `width`、`height`、`padding`、`margin`
  - `border-width`、`min-height` 等
- 修改布局相关属性：
  - `position`、`float`、`display`
  - `flex`、`grid` 布局属性
- 读取布局信息（如 `offsetWidth`、`scrollTop`、`getBoundingClientRect()`）
- 窗口大小改变（`resize` 事件）
- 字体大小改变

**性能影响：**
- **回流是性能杀手**：会触发后续的绘制和合成，成本很高
- **强制同步布局**：读取布局属性会强制浏览器立即执行回流，导致性能问题

**优化建议：**
- 批量修改 DOM，使用 `DocumentFragment` 或虚拟 DOM
- 避免频繁读取布局属性，先读取后修改
- 使用 CSS3 的 `transform` 和 `opacity` 代替修改位置和尺寸（不会触发回流）
- 使用 `absolute` 或 `fixed` 定位，脱离文档流，减少影响范围

### 5. 绘制（Painting / Repaint 重绘）

**过程：**
- 将布局阶段计算好的元素**绘制成位图（bitmap）**
- 包括元素的视觉表现：
  - 背景色、背景图
  - 文本内容、字体样式
  - 边框、阴影
  - 图片、视频等
- **不处理几何位置**，只负责"画"出元素的外观

**触发重绘的操作：**
- 修改颜色相关属性：`color`、`background-color`、`border-color`
- 修改视觉效果：`box-shadow`、`outline`、`opacity`
- 修改背景：`background-image`、`background-position`
- 修改字体：`font-size`、`font-family`、`text-decoration`

**性能影响：**
- 重绘比回流成本低，但仍需要重新计算像素
- 如果频繁重绘，仍会影响性能

**优化建议：**
- 避免频繁修改样式
- 使用 CSS3 硬件加速属性（`transform`、`opacity`）
- 合理使用 `will-change` 提示浏览器优化

### 6. Layerize（分层）

**过程：**
- 浏览器根据特定规则将某些元素**提升为独立的合成层（Layer）**
- 每个层都有自己的绘制上下文
- 为后续的合成阶段做准备

**会被提升为独立图层的元素：**
- 使用 `transform` 或 `opacity` 的元素（CSS3 硬件加速）
- `position: fixed` 或 `position: sticky` 的元素
- 设置了 `will-change` 属性的元素
- `<video>`、`<canvas>`、`<iframe>` 等元素
- 有 3D 变换的元素（`transform: translateZ(0)`）
- 有 `filter` 效果的元素（如 `blur`、`opacity`）

**为什么需要分层？**
- **独立渲染**：每个层可以独立绘制和更新，互不影响
- **GPU 加速**：合成层可以交给 GPU 处理，性能更好
- **减少重绘范围**：修改某个层的内容时，只需要重绘该层，不影响其他层

**优化建议：**
- 合理使用 `transform` 和 `opacity` 触发硬件加速
- 避免过度使用 `will-change`（会占用内存）
- 使用 Chrome DevTools 的 Layers 面板查看分层情况

### 7. Compositing（合成）

**过程：**
- 由 **合成线程（Compositor Thread）** 完成
- 将各个独立的图层按照正确的顺序**合成为一个最终的图像**
- 处理图层的变换、透明度、混合等效果
- 最终交给 **GPU** 显示到屏幕上

**关键特点：**
- **不阻塞主线程**：合成在独立的合成线程中进行
- **GPU 加速**：利用 GPU 的并行处理能力，性能极佳
- **只处理图层变换**：如果只修改 `transform` 或 `opacity`，可以跳过布局和绘制，直接合成

**合成线程的优势：**
- 即使主线程被 JavaScript 阻塞，合成线程仍可以继续工作
- 滚动、动画等操作可以非常流畅
- 这就是为什么使用 `transform` 做动画比修改 `left`、`top` 性能更好的原因

**优化建议：**
- **优先使用 `transform` 和 `opacity` 做动画**（只触发合成，不触发回流和重绘）
- 避免在动画中修改会触发回流的属性
- 使用 `requestAnimationFrame` 优化动画性能

### 渲染性能优化总结

**性能从好到差：**
1. **只触发合成**：`transform`、`opacity`（最佳）
2. **触发重绘**：颜色、背景等视觉属性
3. **触发回流**：尺寸、位置等布局属性（最差）

**优化原则：**
- 减少回流和重绘的次数
- 使用 CSS3 硬件加速
- 批量修改 DOM
- 避免强制同步布局
- 使用 `requestAnimationFrame` 优化动画

### 关键概念对比

| 概念 | 触发条件 | 性能影响 | 优化方法 |
|------|---------|---------|---------|
| **回流（Reflow）** | 修改布局属性（width、height、position 等） | 高（会触发重绘和合成） | 使用 transform 代替 |
| **重绘（Repaint）** | 修改视觉属性（color、background 等） | 中（会触发合成） | 批量修改样式 |
| **合成（Composite）** | 修改 transform、opacity | 低（GPU 加速） | 优先使用这两个属性 |

## 六、后续阶段与优化点

页面首次渲染完成后，浏览器还会继续处理各种交互、资源加载和性能优化任务。这些后续阶段同样对用户体验至关重要。

### 1. 资源加载与预加载策略

#### 1.1 资源加载时机

在 HTML 解析过程中，遇到以下资源会触发额外请求：

- `<img>` 图片资源
- `<link>` CSS 样式表
- `<script>` JavaScript 脚本
- `<video>`、`<audio>` 媒体资源
- `<iframe>` 嵌入页面
- `@font-face` 字体文件

**关键点：**
- **同步 JS 会阻塞 DOM 解析**：遇到 `<script>` 标签时，浏览器会暂停 DOM 解析，下载并执行脚本
- **CSS 会阻塞渲染**：必须等待 CSS 解析完成才能构建渲染树
- **图片不会阻塞渲染**：图片加载是异步的，但会影响页面布局（如果未设置尺寸）

#### 1.2 资源预加载策略

**DNS 预解析（DNS Prefetch）：**
```html
<link rel="dns-prefetch" href="https://cdn.example.com">
```
提前解析域名，减少后续请求的 DNS 查询时间。

**预连接（Preconnect）：**
```html
<link rel="preconnect" href="https://api.example.com" crossorigin>
```
提前建立 TCP 连接和 TLS 握手，适用于需要频繁请求的第三方域名。

**预加载（Preload）：**
```html
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="main.js" as="script">
```
提前加载关键资源，优先级高于普通资源加载。

**预获取（Prefetch）：**
```html
<link rel="prefetch" href="next-page.html">
```
在浏览器空闲时预加载可能需要的资源（如下一页内容）。

#### 1.3 JavaScript 加载优化

**defer 属性：**
```html
<script defer src="app.js"></script>
```
- 脚本下载**不阻塞** DOM 解析
- 脚本执行**延迟到** DOM 解析完成后、`DOMContentLoaded` 事件之前
- 多个 `defer` 脚本按顺序执行

**async 属性：**
```html
<script async src="analytics.js"></script>
```
- 脚本下载**不阻塞** DOM 解析
- 脚本下载完成后**立即执行**（可能在 DOM 解析完成前）
- 多个 `async` 脚本执行顺序不确定

**动态加载：**
```javascript
// 动态创建 script 标签
const script = document.createElement('script');
script.src = 'app.js';
script.async = true;
document.head.appendChild(script);
```

**模块化加载：**
```html
<script type="module" src="app.js"></script>
```
ES6 模块默认是 `defer` 行为，且支持 `async`。

### 2. JavaScript 执行与事件处理

#### 2.1 JavaScript 引擎执行流程

**执行上下文（Execution Context）：**
- **全局执行上下文**：页面加载时创建
- **函数执行上下文**：函数调用时创建
- **Eval 执行上下文**：`eval()` 执行时创建

**调用栈（Call Stack）：**
- JavaScript 是单线程的，只有一个调用栈
- 函数调用会创建新的执行上下文并压入栈
- 函数执行完成后，执行上下文出栈

**事件循环（Event Loop）：**
```
调用栈 → 执行同步代码
     ↓
微任务队列（Microtask Queue）
  - Promise.then()
  - queueMicrotask()
  - MutationObserver
     ↓
宏任务队列（Macrotask Queue）
  - setTimeout()
  - setInterval()
  - I/O 操作
  - UI 渲染
```

**执行顺序：**
1. 执行同步代码
2. 执行所有微任务
3. 执行一个宏任务
4. 重复步骤 2-3

#### 2.2 DOM 操作优化

**批量修改 DOM：**
```javascript
// ❌ 不好：多次触发回流
for (let i = 0; i < 1000; i++) {
  element.style.width = i + 'px';
}

// ✅ 好：使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  fragment.appendChild(div);
}
element.appendChild(fragment);

// ✅ 好：使用虚拟 DOM（React、Vue）
```

**避免强制同步布局：**
```javascript
// ❌ 不好：强制同步布局
element.style.width = '100px';
const width = element.offsetWidth; // 触发回流
element.style.height = width + 'px';

// ✅ 好：先读取后修改
const width = element.offsetWidth;
element.style.width = '100px';
element.style.height = width + 'px';
```

**使用 requestAnimationFrame：**
```javascript
// ✅ 优化动画性能
function animate() {
  // 修改样式
  element.style.transform = `translateX(${x}px)`;
  x += 1;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

#### 2.3 事件处理优化

**事件委托（Event Delegation）：**
```javascript
// ❌ 不好：为每个元素绑定事件
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handleClick);
});

// ✅ 好：事件委托
document.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handleClick(e);
  }
});
```

**防抖（Debounce）：**
```javascript
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 使用场景：搜索输入、窗口 resize
const handleSearch = debounce((query) => {
  // 搜索逻辑
}, 300);
```

**节流（Throttle）：**
```javascript
function throttle(func, wait) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}

// 使用场景：滚动事件、鼠标移动
const handleScroll = throttle(() => {
  // 滚动处理逻辑
}, 100);
```

### 3. 连接管理与网络协议优化

#### 3.1 HTTP/1.1 优化

**Keep-Alive 连接复用：**
- 默认启用 `Connection: keep-alive`
- 同一个 TCP 连接可以发送多个 HTTP 请求
- 减少 TCP 握手和 TLS 握手的开销

**域名分片（Domain Sharding）：**
```html
<!-- 突破浏览器同域连接数限制（6-8个） -->
<img src="https://cdn1.example.com/image1.jpg">
<img src="https://cdn2.example.com/image2.jpg">
<img src="https://cdn3.example.com/image3.jpg">
```
**注意：** HTTP/2 已不需要此优化，反而会增加 DNS 查询。

#### 3.2 HTTP/2 特性

**多路复用（Multiplexing）：**
- 单个 TCP 连接可以并行发送多个请求
- 解决了 HTTP/1.1 的队头阻塞问题
- 请求和响应可以交错传输

**头部压缩（HPACK）：**
- 使用 HPACK 算法压缩 HTTP 头部
- 减少重复头部字段的传输
- 显著降低头部大小

**服务器推送（Server Push）：**
```http
Link: </style.css>; rel=preload; as=style
```
服务器可以主动推送资源给客户端，无需客户端请求。

**二进制分帧：**
- 将 HTTP 消息分解为更小的帧
- 帧可以交错传输，提高效率

#### 3.3 HTTP/3 特性

**基于 QUIC 协议：**
- 基于 UDP 而非 TCP
- 内置加密（TLS 1.3）
- 减少连接建立时间

**改进的多路复用：**
- 解决了 TCP 的队头阻塞问题
- 即使某个流的数据包丢失，其他流不受影响

**连接迁移：**
- 切换网络时保持连接（如 WiFi 切换到移动网络）

### 4. 内存管理与性能监控

#### 4.1 内存泄漏预防

**常见内存泄漏场景：**

1. **未清理的事件监听器：**
```javascript
// ❌ 不好
element.addEventListener('click', handler);

// ✅ 好：及时清理
element.addEventListener('click', handler);
// 组件卸载时
element.removeEventListener('click', handler);
```

2. **闭包引用：**
```javascript
// ❌ 不好：闭包持有大对象引用
function createHandler() {
  const largeData = new Array(1000000).fill(0);
  return function() {
    // largeData 无法被垃圾回收
  };
}

// ✅ 好：使用后置 null
function createHandler() {
  const largeData = new Array(1000000).fill(0);
  return function() {
    // 使用 largeData
    largeData = null; // 解除引用
  };
}
```

3. **定时器未清理：**
```javascript
// ❌ 不好
const timer = setInterval(() => {}, 1000);

// ✅ 好：及时清理
const timer = setInterval(() => {}, 1000);
clearInterval(timer);
```

4. **DOM 引用未清理：**
```javascript
// ❌ 不好
const elements = document.querySelectorAll('.item');

// ✅ 好：使用后置 null
const elements = document.querySelectorAll('.item');
// 使用后
elements = null;
```

#### 4.2 性能监控指标

**核心 Web 指标（Core Web Vitals）：**

1. **LCP（Largest Contentful Paint）**：最大内容绘制
   - 测量加载性能
   - 良好：< 2.5 秒

2. **FID（First Input Delay）**：首次输入延迟
   - 测量交互性
   - 良好：< 100 毫秒

3. **CLS（Cumulative Layout Shift）**：累积布局偏移
   - 测量视觉稳定性
   - 良好：< 0.1

**其他重要指标：**

- **FCP（First Contentful Paint）**：首次内容绘制
- **TTI（Time to Interactive）**：可交互时间
- **TBT（Total Blocking Time）**：总阻塞时间
- **Speed Index**：速度指数

**性能监控 API：**

```javascript
// Performance API
const perfData = performance.getEntriesByType('navigation')[0];
console.log('DNS 查询时间:', perfData.domainLookupEnd - perfData.domainLookupStart);
console.log('TCP 连接时间:', perfData.connectEnd - perfData.connectStart);
console.log('请求响应时间:', perfData.responseEnd - perfData.requestStart);
console.log('DOM 解析时间:', perfData.domInteractive - perfData.responseEnd);
console.log('页面加载时间:', perfData.loadEventEnd - perfData.fetchStart);

// Resource Timing API
const resources = performance.getEntriesByType('resource');
resources.forEach(resource => {
  console.log(resource.name, resource.duration);
});

// Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals';
getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

### 5. 持续优化策略

#### 5.1 代码分割与懒加载

**路由懒加载：**
```javascript
// React
const Home = React.lazy(() => import('./Home'));
const About = React.lazy(() => import('./About'));

// Vue
const Home = () => import('./Home.vue');
```

**组件懒加载：**
```javascript
// 按需加载组件
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

**图片懒加载：**
```html
<img src="placeholder.jpg" data-src="real-image.jpg" loading="lazy">
```

#### 5.2 缓存策略

**浏览器缓存：**
- **强缓存**：`Cache-Control`、`Expires`
- **协商缓存**：`ETag`、`Last-Modified`

**Service Worker 缓存：**
```javascript
// 缓存策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

**HTTP 缓存头设置：**
```http
Cache-Control: public, max-age=31536000  # 静态资源：长期缓存
Cache-Control: no-cache                  # HTML：不缓存
Cache-Control: private, max-age=3600     # 用户相关：短期缓存
```

#### 5.3 构建优化

**代码压缩：**
- JavaScript：UglifyJS、Terser
- CSS：cssnano
- HTML：html-minifier

**Tree Shaking：**
- 移除未使用的代码
- 支持 ES6 模块的打包工具（Webpack、Rollup、Vite）

**代码分割：**
```javascript
// Webpack
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
        },
      },
    },
  },
};
```

**资源压缩：**
- Gzip / Brotli 压缩
- 图片压缩和格式优化
- 字体子集化（只包含使用的字符）

### 6. 优化检查清单

**网络层面：**
- [ ] 使用 CDN 加速静态资源
- [ ] 启用 HTTP/2 或 HTTP/3
- [ ] 配置合理的缓存策略
- [ ] 压缩资源（Gzip/Brotli）
- [ ] 使用 DNS 预解析和预连接

**渲染层面：**
- [ ] 内联关键 CSS（Critical CSS）
- [ ] 延迟加载非关键 CSS
- [ ] 使用 `defer` 或 `async` 加载脚本
- [ ] 优化图片格式和大小
- [ ] 减少 DOM 层级和节点数量

**JavaScript 层面：**
- [ ] 代码分割和懒加载
- [ ] 使用事件委托
- [ ] 防抖和节流优化
- [ ] 避免内存泄漏
- [ ] 使用 `requestAnimationFrame` 优化动画

**监控与测试：**
- [ ] 使用 Lighthouse 进行性能测试
- [ ] 监控 Core Web Vitals
- [ ] 使用 Chrome DevTools 分析性能
- [ ] 定期进行性能审计

# 当面试官问我前端可以做的性能优化有哪些
[参考文档](https://juejin.cn/post/7194400984490049573#heading-41)

## 回答思路

前端性能优化可以从**网络层面、渲染层面、代码层面、资源层面、构建层面**等多个维度进行优化。核心目标是**减少资源体积、加快加载速度、提升渲染性能、优化用户体验**。

---

## 一、网络层面优化

### 1. DNS 预解析（DNS Prefetch）
提前解析域名，减少后续请求的 DNS 查询时间。

```html
<link rel="dns-prefetch" href="https://cdn.example.com">
```

### 2. 预连接（Preconnect）
提前建立 TCP 连接和 TLS 握手，适用于需要频繁请求的第三方域名。

```html
<link rel="preconnect" href="https://api.example.com" crossorigin>
```

### 3. 预加载（Preload）
提前加载关键资源，优先级高于普通资源。

```html
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="main.js" as="script">
```

### 4. 域名收敛
减少页面中域名的数量，从而减少 DNS 解析次数和连接建立时间。

### 5. 使用 CDN 加速
将静态资源部署到 CDN，利用就近节点加速资源加载。

### 6. HTTP/2 或 HTTP/3
- **HTTP/2**：多路复用、头部压缩、服务器推送、二进制传输
- **HTTP/3**：基于 QUIC 协议，解决队头阻塞，连接迁移

### 7. 优化 HTTP 缓存策略
- **强缓存**：`Cache-Control`、`Expires`
- **协商缓存**：`ETag`、`Last-Modified`
- 静态资源设置长期缓存，HTML 设置不缓存或短期缓存

### 8. 资源压缩
- **Gzip / Brotli 压缩**：减少传输体积
- **代码压缩**：JavaScript、CSS、HTML 压缩

### 9. 接口请求优化
- 接口请求合并，减少请求次数
- 使用批量接口替代多个单独接口
- 合理使用请求缓存

---

## 二、渲染层面优化

### 1. 关键渲染路径优化

**内联关键 CSS（Critical CSS）**
```html
<style>
  /* 首屏关键样式内联 */
  body { margin: 0; }
  .header { ... }
</style>
```

**延迟加载非关键 CSS**
```html
<link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'">
```

### 2. JavaScript 加载优化

**使用 defer 或 async**
```html
<!-- defer: 延迟执行，不阻塞 DOM 解析 -->
<script defer src="app.js"></script>

<!-- async: 异步执行，下载完立即执行 -->
<script async src="analytics.js"></script>
```

**动态加载脚本**
```javascript
const script = document.createElement('script');
script.src = 'app.js';
script.async = true;
document.head.appendChild(script);
```

### 3. 减少 DOM 操作

**批量修改 DOM**
```javascript
// ❌ 不好：多次触发回流
for (let i = 0; i < 1000; i++) {
  element.style.width = i + 'px';
}

// ✅ 好：使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  fragment.appendChild(div);
}
element.appendChild(fragment);
```

**避免强制同步布局**
```javascript
// ❌ 不好：强制同步布局
element.style.width = '100px';
const width = element.offsetWidth; // 触发回流

// ✅ 好：先读取后修改
const width = element.offsetWidth;
element.style.width = '100px';
element.style.height = width + 'px';
```

### 4. 使用虚拟列表
对于长列表，只渲染可见区域，减少 DOM 节点数量。

### 5. 服务端渲染（SSR）
使用 Next.js、Nuxt.js 等服务端渲染框架，提升首屏加载速度。

### 6. 骨架屏和 Loading
在内容加载前显示骨架屏或 Loading 图标，提升用户体验。

---

## 三、JavaScript 代码优化

### 1. 事件委托（Event Delegation）
减少事件监听器数量，提升性能。

```javascript
// ❌ 不好：为每个元素绑定事件
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handleClick);
});

// ✅ 好：事件委托
document.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handleClick(e);
  }
});
```

### 2. 防抖（Debounce）和节流（Throttle）

**防抖**：适用于搜索输入、窗口 resize
```javascript
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
```

**节流**：适用于滚动事件、鼠标移动
```javascript
function throttle(func, wait) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}
```

### 3. 使用 Web Worker
将复杂计算放到 Web Worker 中执行，避免阻塞主线程。

```javascript
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: largeData });
worker.onmessage = (e) => {
  console.log('计算结果:', e.data);
};

// worker.js
self.onmessage = (e) => {
  const result = heavyCalculation(e.data);
  self.postMessage(result);
};
```

### 4. 计算结果缓存
使用缓存减少重复计算，如 Vue 的 `computed`、React 的 `useMemo`。

### 5. 动画优化
- **优先使用 CSS3 动画**：`transform`、`opacity`（只触发合成，不触发回流和重绘）
- **使用 `requestAnimationFrame`**：优化 JavaScript 动画
- **避免使用 JS 动画**：CSS3 动画和 Canvas 动画性能更好

```javascript
// ✅ 使用 requestAnimationFrame
function animate() {
  element.style.transform = `translateX(${x}px)`;
  x += 1;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### 6. 避免内存泄漏
- 及时清理事件监听器
- 清理定时器（`setTimeout`、`setInterval`）
- 避免闭包持有大对象引用
- 清理 DOM 引用

---

## 四、CSS 优化（减少重绘和回流）

### 1. 避免触发回流（Reflow）

**使用 `transform` 代替修改位置和尺寸**
```css
/* ❌ 不好：触发回流 */
.element {
  left: 100px;
  top: 100px;
}

/* ✅ 好：只触发合成 */
.element {
  transform: translate(100px, 100px);
}
```

**使用 `absolute` 或 `fixed` 定位**
脱离文档流，减少回流影响范围。

### 2. 避免触发重绘（Repaint）

**批量修改样式**
```javascript
// ❌ 不好：多次触发重绘
element.style.color = 'red';
element.style.backgroundColor = 'blue';
element.style.border = '1px solid black';

// ✅ 好：一次性修改
element.className = 'new-style';
```

### 3. 使用 CSS3 硬件加速
```css
.element {
  transform: translateZ(0); /* 或 translate3d(0,0,0) */
  will-change: transform;
}
```

### 4. 优化选择器
- 避免过于复杂的选择器（如 `div > ul > li > a > span`）
- CSS 选择器从右到左匹配，优先使用类选择器

### 5. 减少 CSS 文件数量和大小
- 合并 CSS 文件
- 移除未使用的 CSS
- 使用 CSS 压缩工具

---

## 五、资源优化

### 1. 图片优化

**选择合适的图片格式**

| 格式 | 特点 | 使用场景 | 优缺点 |
|------|------|----------|--------|
| JPEG / JPG | 位图格式，有损压缩，色彩表现好 | 照片、banner、背景图 | 优点：色彩丰富、文件小、兼容性好；缺点：有损压缩、不可透明、不支持动画 |
| PNG | 位图格式，无损压缩，支持透明 | Logo、icon、需要透明的图片 | 优点：无损、支持透明；缺点：体积大、不支持动画 |
| GIF | 位图格式，支持动画和透明 | 简单动图、表情包 | 优点：支持动画、兼容性好；缺点：仅支持 256 色、画质差 |
| WebP | 支持有损/无损压缩，支持透明和动画 | 替代 JPEG / PNG / GIF | 优点：压缩率高、性能好；缺点：老旧浏览器不支持，需要回退格式 |
| SVG | 矢量图，可无限缩放 | 图标、Logo、图表 | 优点：无损缩放、文件小、可动画；缺点：不适合复杂照片 |
| AVIF | 新一代图片格式，基于 AV1 | 高性能网站 | 优点：比 WebP 压缩率更高；缺点：兼容性较差 |

**图片优化策略**
- 图片压缩：使用工具压缩图片体积
- 使用雪碧图（CSS Sprites）：合并小图标，减少请求次数
- 使用 iconfont：图标字体，体积小、可缩放
- 小图片转 base64：减少 HTTP 请求（注意会增加 HTML 体积）
- 图片懒加载：只加载可见区域的图片
- 响应式图片：使用 `srcset` 和 `sizes` 属性
- 渐变色使用 CSS 代替图片

```html
<!-- 图片懒加载 -->
<img src="placeholder.jpg" data-src="real-image.jpg" loading="lazy">

<!-- 响应式图片 -->
<img srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
     sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
     src="medium.jpg">
```

### 2. 字体优化
- 字体子集化：只包含使用的字符
- 使用 `font-display: swap`：避免字体加载阻塞渲染
- 预加载关键字体

```css
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* 字体加载期间显示备用字体 */
}
```

---

## 六、构建打包优化

### 1. 代码分割（Code Splitting）
按需加载，减少初始包体积。

```javascript
// 路由懒加载
const Home = React.lazy(() => import('./Home'));
const About = React.lazy(() => import('./About'));

// 组件懒加载
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

### 2. Tree Shaking
移除未使用的代码，支持 ES6 模块的打包工具（Webpack、Rollup、Vite）。

### 3. 代码压缩
- JavaScript：UglifyJS、Terser
- CSS：cssnano
- HTML：html-minifier

### 4. 公共代码提取
```javascript
// Webpack 配置
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
        },
      },
    },
  },
};
```

### 5. CDN 加载第三方模块
将 `node_modules` 中的第三方库通过 CDN 加载，减少打包体积。

### 6. 多线程打包
使用 `thread-loader` 或 `happypack` 加速构建。

---

## 七、框架特定优化

### React 优化

1. **避免不必要的 render**
   - 使用 `React.memo`、`React.PureComponent`、`shouldComponentUpdate`

2. **避免内联函数和对象**
```jsx
   // ❌ 不好
<button onClick={() => handleClick()}>button1</button>

   // ✅ 好
<button onClick={handleClick}>button1</button>
const handleClick = () => {};
```

3. **使用 Fragment 减少层级**
   ```jsx
   <React.Fragment>
     <Child1 />
     <Child2 />
   </React.Fragment>
   ```

4. **循环使用 key，但不要用 index**
   ```jsx
   {items.map(item => (
     <Item key={item.id} data={item} />
   ))}
   ```

5. **Hook 优化**
   - 使用 `useMemo` 缓存计算结果
   - 使用 `useCallback` 缓存函数

6. **代码分割和懒加载**
```jsx
const MyComponent = React.lazy(() => import('./MyComponent'));

  <React.Suspense fallback={<Spinner />}>
     <MyComponent />
  </React.Suspense>
   ```

### Vue 优化

1. **v-for 添加 key**
   ```vue
   <div v-for="item in list" :key="item.id">{{ item.name }}</div>
   ```

2. **路由懒加载**
   ```javascript
const Home = () => import('./Home.vue');
```

3. **第三方插件按需引入**
   ```javascript
   import { Button } from 'element-ui'; // 而不是 import ElementUI from 'element-ui'
   ```

4. **合理使用 computed 和 watch**
   - `computed`：缓存计算结果
   - `watch`：监听数据变化

5. **v-for 和 v-if 不要同时使用**
   ```vue
   <!-- ❌ 不好 -->
   <div v-for="item in list" v-if="item.visible">{{ item.name }}</div>
   
   <!-- ✅ 好 -->
   <div v-for="item in visibleList" :key="item.id">{{ item.name }}</div>
   ```

6. **使用 keep-alive 缓存组件**
   ```vue
   <keep-alive>
     <component :is="currentComponent" />
   </keep-alive>
   ```

7. **及时销毁事件和定时器**
   ```javascript
   onBeforeUnmount(() => {
     clearInterval(timer);
     bus.$off('event');
   });
   ```

---

## 八、首屏优化策略

1. **使用路由懒加载**：按需加载路由组件
2. **非首屏组件使用异步组件**：延迟加载非关键组件
3. **首屏不重要的组件延迟加载**：使用 `IntersectionObserver` 或滚动加载
4. **静态资源放在 CDN 上**：加速资源加载
5. **减少首屏 JS、CSS 等资源文件的大小**：代码分割、压缩
6. **使用服务端渲染（SSR）**：提升首屏渲染速度
7. **减少 DOM 的数量和层级**：简化 HTML 结构
8. **使用精灵图**：减少图片请求次数
9. **显示 Loading 或骨架屏**：提升用户体验
10. **开启 Gzip 压缩**：减少传输体积
11. **图片懒加载**：只加载可见区域的图片
12. **内联关键 CSS**：减少首屏渲染阻塞

---

## 九、性能监控工具

### 1. Chrome DevTools
- **Performance**：可查看性能指标，并有网页快照
- **Network**：可以查看各个资源的加载时间
- **Lighthouse**：性能评测工具

### 2. Lighthouse
非常流行的第三方性能评测工具，支持移动端和 PC，提供性能评分和优化建议。

### 3. WebPageTest
在线性能测试工具，可以模拟不同网络环境和设备。

### 4. PageSpeed Insights
Google 提供的页面速度分析工具。

### 5. 核心 Web 指标（Core Web Vitals）
- **LCP（Largest Contentful Paint）**：最大内容绘制，< 2.5 秒为良好
- **FID（First Input Delay）**：首次输入延迟，< 100 毫秒为良好
- **CLS（Cumulative Layout Shift）**：累积布局偏移，< 0.1 为良好

---

## 十、性能优化检查清单

### 网络层面
- [ ] 使用 CDN 加速静态资源
- [ ] 启用 HTTP/2 或 HTTP/3
- [ ] 配置合理的缓存策略
- [ ] 压缩资源（Gzip/Brotli）
- [ ] 使用 DNS 预解析和预连接
- [ ] 优化图片格式和大小

### 渲染层面
- [ ] 内联关键 CSS（Critical CSS）
- [ ] 延迟加载非关键 CSS
- [ ] 使用 `defer` 或 `async` 加载脚本
- [ ] 减少 DOM 层级和节点数量
- [ ] 使用虚拟列表处理长列表

### JavaScript 层面
- [ ] 代码分割和懒加载
- [ ] 使用事件委托
- [ ] 防抖和节流优化
- [ ] 避免内存泄漏
- [ ] 使用 `requestAnimationFrame` 优化动画
- [ ] 复杂计算使用 Web Worker

### CSS 层面
- [ ] 使用 `transform` 和 `opacity` 做动画
- [ ] 避免频繁触发回流和重绘
- [ ] 优化 CSS 选择器
- [ ] 减少 CSS 文件数量和大小

### 监控与测试
- [ ] 使用 Lighthouse 进行性能测试
- [ ] 监控 Core Web Vitals
- [ ] 使用 Chrome DevTools 分析性能
- [ ] 定期进行性能审计

---

## 总结

前端性能优化是一个系统性工程，需要从**网络、渲染、代码、资源、构建**等多个维度综合考虑。核心原则是：

1. **减少资源体积**：压缩、代码分割、Tree Shaking
2. **加快加载速度**：CDN、缓存、预加载、HTTP/2
3. **提升渲染性能**：减少回流重绘、使用硬件加速、优化关键渲染路径
4. **优化用户体验**：骨架屏、懒加载、防抖节流

在实际项目中，需要根据具体情况选择合适的优化策略，并通过性能监控工具持续跟踪和优化。
