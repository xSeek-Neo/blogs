# css 样式问题

### 1.页面导入样式时，使用 link 和 @import 有什么区别

:::tip
- 1.从属关系区别。@import是css提供的预发， 只能导入样式表； link 还可以定义 RSS、rel 连接属性、引入网站图标等
- 2.加载顺序区别；加载页面时，link 标签引入的 CSS 被同时加载；@import 引入的 CSS 将在页面加载完毕后被加载
- 3.@import是 CSS2.1提出的语法，故只可在 IE5+ 才能识别；link标签作为 HTML 元素，不存在兼容性问题。
:::

### 2.文本超出部分显示省略号

- 单行

```
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

- 多行

```
-ms-word-break: break-all;
white-space: normal;
word-break: break-word;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
overflow: hidden;
text-overflow: ellipsis;
```

### 3.已知父级盒子的宽高，子级img宽高未知，想让img铺满父级盒子且图片不能变形

```css
div {
    width: 200px;
    height: 200px;
}
img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}
```

### 4.利用伪元素画三角

```css
.info-tab {
    position: relative;
}
.info-tab::after {
    content: '';
    border: 4px solid transparent;
    border-top-color: #2c8ac2;
    position: absolute;
    top: 0;
}
```

### 5.隐藏元素的方法

```
display: none;
visiblity: hidden;
opacity: 0;
position 定位到浏览器的窗口之外
clipPath
```

### 6.display:none、visibility:hidden、opacity:0的区别

|                  | 是否隐藏 | 是否在文档中占用空间 | 是否会触发事件 |
| :--------------- | :------- | :------------------- | :------------- |
| display: none    | 是       | 否                   | 否             |
| visibile: hidden | 是       | 是                   | 否             |
| opacity: 0       | 是       | 是                   | 是             |

### 6.CSS清除浮动

使用CSS的:after伪元素

::: tip 清楚浮动
结合 :after 伪元素（注意这不是伪类，而是伪元素，代表一个元素之后最近的元素）。
给浮动元素的容器添加一个clearfix的class，然后给这个class添加一个:after伪元素实现元素末尾添加一个看不见的块元素（Block element）清理浮动。
:::

```css
.news {
  background-color: gray;
  border: solid 1px black;
  }

.news img {
  float: left;
  }

.news p {
  float: right;
  }

.clearfix:after{
  content: "020";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
  }

.clearfix {
  /* 触发 hasLayout */
  zoom: 1;
  }
```
```html
<div class="news clearfix">
<img src="news-pic.jpg" />
<p>some text</p>
</div>
```

通过CSS伪元素在容器的内部元素最后添加了一个看不见的空格"020"或点"."，并且赋予clear属性来清除浮动。需要注意的是为了IE6和IE7浏览器，要给clearfix这个class添加一条zoom:1;触发haslayout。

### 7.选择器优先级

:::warning
CSS的特性：继承性、层叠性、优先级
优先级：写CSS样式的时候，会给同一个元素添加多个样式，此时谁的权重高就显示谁的样式
标签、类/伪类/属性、全局选择器、行内样式、id、!important
!important > 行内样式 > id > 类/伪类/属性 > 标签 > 全局选择器
:::

### 8.BFC (Block Formatting Content)

#### BFC到底是什么

BFC（Block Formatting Context），即块级格式化上下文，它是页面中的一块渲染区域，并且有一套属于自己的渲染规则：

a.每个元素的左外边距与包含块的左边界相接触（从左到右），即使浮动元素也是如此
b.内部的盒子会在垂直方向上一个接一个的放置(块盒从左到右排列, 放不下时换行. 行和独立占一行)
c.对于同一个BFC的俩个相邻的盒子的margin会发生重叠，与方向无关。
d.BFC的区域不会与float的元素区域重叠
e.计算BFC的高度时，浮动子元素也参与计算
f.BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，子元素不会影响到外部的元素

#### 如何触发BFC

:::tip
- 1.根元素 (`<thml>`, `<body>`)
- 2.浮动元素 (元素的float不是none(默认值), 可以是left, right)
- 3.绝对定位元素 (元素position为absolute 或 fixed)
- 4.display为inline-block, table-cell, table-caption, table, table-row, table-row-group, table-header-group, table-footer-group, inline-table, flow-row, flex或inline-flex, grid或inline-grid.  (非inline, 非block)
- 5.overflow 值不是visible的块元素, 为 auto、scroll、hidden
- 6.contain值为layout, content 或 paint的元素
- 多列容器 (元素的columns-count或column-width 不为auto, 包括column-count为1)
:::

#### 解决问题

:::tip
- a.相邻元素外边距重合(与方向无关)
- b.外边距塌陷(eg: 子元素外边距没有作用的直接父元素)
- c.高度坍塌 (eg: 子元素浮动, 父没有高度)
- d.浮动元素
:::

### 9.CSS Position(定位)

:::warning
- static
- relative
- fixed
- absolute
- sticky
:::

### 9.说一下CSS的盒模型

:::tip
在HTML页面中的所有元素都可以看成是一个盒子
盒子的组成：内容content、内边距padding、边框border、外边距margin
盒模型的类型：
标准盒模型
margin + border + padding + content
IE盒模型
margin + content(border + padding)
控制盒模型的模式：box-sizing:content-box（默认值，标准盒模型）、border-box（IE盒模型）
:::

### 10.px与rem区别

**px 与 rem 的区别**  
`px`（像素）和 `rem`（Root EM）是 CSS 中常用的长度单位，它们的核心区别在于 **计算基准** 和 **响应式设计适应性**。以下是详细对比：

---

#### 1. **定义与基准**
- **px（像素）**
    - **绝对单位**：1px 对应屏幕上的一个物理像素点（在高分辨率屏幕中可能被缩放）。
    - **固定大小**：不受父元素或根元素字体大小影响，始终为设定值。
    - 示例：`font-size: 16px;` 表示字体始终为 16 像素。

- **rem（Root EM）**
    - **相对单位**：1rem 等于 **根元素（`<html>`）的字体大小**。
    - **动态调整**：若根元素字体大小改变，所有使用 rem 的元素会按比例缩放。
    - 示例：若根元素 `font-size: 16px;`，则 `1rem = 16px`，`2rem = 32px`。

---

#### 2. **继承性**
- **px**：无继承性，直接使用设定值。
- **rem**：基于根元素字体大小，但不受父元素字体大小影响（与 `em` 不同，`em` 是相对于父元素字体大小）。

---

#### 3. **响应式设计的适应性**
- **px**
    - **固定布局**：适合需要精确控制尺寸的场景（如图标、边框）。
    - **缺点**：难以根据屏幕大小或用户设置自动调整，可能导致小屏幕上元素过大或大屏幕上过小。

- **rem**
    - **弹性布局**：通过修改根元素字体大小，可一键调整整个页面的比例（如适配不同设备）。
    - **推荐场景**：字体大小、间距、容器尺寸等需要动态缩放的属性。
    - 示例：媒体查询中调整根字体大小：
      ```css
      html { font-size: 16px; }  /* 默认 */
      @media (max-width: 768px) {
        html { font-size: 14px; } /* 小屏幕缩小整体比例 */
      }
      ```

---

#### 4. **浏览器兼容性**
- **px**：所有浏览器支持。
- **rem**：现代浏览器均支持，但 IE8 及以下不支持（需用 `px` 作为回退）。

---

#### 5. **最佳实践**
- **优先使用 rem**：  
  对字体、边距（`margin`/`padding`）、宽度/高度等使用 `rem`，提升可维护性和响应能力。
- **结合使用 px**：  
  对边框（`border`）、阴影（`box-shadow`）等需要固定值的属性使用 `px`。
- **简化计算**：  
  设置根元素字体大小为 `62.5%`（即 `10px`），使 `1rem = 10px`，方便计算（如 `1.6rem = 16px`）。

---

#### 示例对比
```css
html { font-size: 62.5%; } /* 1rem = 10px */

.box {
  width: 200px;      /* 固定宽度，不随根元素变化 */
  font-size: 1.6rem; /* 16px（基于根元素的 10px * 1.6） */
  padding: 2rem;     /* 20px */
}
```


#### 总结
| **特性**       | **px**                     | **rem**                     |
|----------------|---------------------------|----------------------------|
| 单位类型       | 绝对单位                  | 相对单位（基于根元素）     |
| 响应式适应性   | 弱                        | 强（通过根元素一键调整）   |
| 继承性         | 无                        | 依赖根元素，不继承父元素   |
| 适用场景       | 边框、固定尺寸元素        | 字体、间距、弹性布局       |

根据需求灵活选择：**固定尺寸用 `px`，动态缩放用 `rem`**。



| **单位** | **描述**              |
|--------|---------------------|
| px     | 像素（绝对单位）            |
| %      | 百分比（相对于父元素的尺寸）      |
| em     | 相对于当前元素的字体大小        |
| rem    | 相对于根元素（`<html>`）的字体大小 |
| vw     | 视口宽度的 1%            |
| vh     | 视口高度的 1%            |
| vmin   | 视口宽度和高度中较小值的 1%     |
| vmax   | 视口宽度和高度中较大值的 1%     |
| auto   | 自动计算尺寸（常用于宽度和高度）    |

#### 水平垂直居中

:::tip
- 1.定位 + margin
- 2.定位 + transform
- 3.flex 布局
- 4.grid布局
- 5.table布局
:::

##### 1.定位 + margin

```css
.outer {
  position: relative;
}

.inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

##### 2.定位 + transform

```css
.outer {
  position: relative;
}

.inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

##### 3.flex 布局

```css
.outer {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

##### 4.grid布局

```css
.outer {
  display: grid;
  place-items: center;
  /* 或者 */
  align-items: center;
  justify-content: center;
}
```
#### 水平居中
margin: auto;
text-align + inline-block;
fit-content + margin;

#### 垂直居中
table-cell + vertical-align;
inline-block + line-height;
inline-block + vertical-align;

### 11.css可以被继承的属性

#### 一、文本与字体相关
- **`font-family`**: 字体类型（如 `Arial`）
- **`font-size`**: 字体大小（如 `16px`）
- **`font-weight`**: 字体粗细（如 `bold`）
- **`font-style`**: 字体样式（如 `italic`）
- **`line-height`**: 行高（如 `1.5`）
- **`color`**: 文本颜色（如 `#333`）
- **`text-align`**: 文本对齐方式（如 `center`）
- **`text-indent`**: 首行缩进（如 `2em`）
- **`word-spacing`**, **`letter-spacing`**: 词间距和字符间距

---

#### 二、列表相关
- **`list-style-type`**: 列表项标记类型（如 `circle`）
- **`list-style-position`**: 列表标记位置（如 `inside`）

---

#### 三、其他属性
- **`visibility`**: 元素可见性（如 `hidden`，但隐藏后仍占据空间）
- **`cursor`**: 鼠标指针样式（如 `pointer`）
- **`direction`**: 文本方向（如 `rtl` 从右到左）
- **`quotes`**: 引用符号的样式（如 `« »`）

---

#### 四、注意事项
1. **浏览器默认样式**可能覆盖继承（如 `<a>` 标签默认蓝色颜色）。
2. **显式重置继承**：通过设置子元素的属性值为 `initial` 或 `unset`。
3. **非继承属性**（需手动设置）：
  - 盒模型相关：`width`, `height`, `margin`, `padding`, `border`
  - 布局相关：`display`, `position`, `float`
  - 背景相关：`background`, `background-color`

---

#### 示例
```html
<div style="color: blue; font-family: Arial;">
  父元素
  <p>子元素会自动继承颜色和字体</p>
</div>
```

通过理解继承机制，可以减少重复代码，但需注意不同元素的默认行为差异。


### 12.重绘重排有什么区别

:::warning
重排（回流）：布局引擎会根据所有的样式计算出盒模型在页面上的位置和大小
重绘：计算好盒模型的位置、大小和其他一些属性之后，浏览器就会根据每个盒模型的特性进行绘制
浏览器的渲染机制
对DOM的大小、位置进行修改后，浏览器需要重新计算元素的这些几何属性，就叫重排
对DOM的样式进行修改，比如color和background-color，浏览器不需要重新计算几何属性的时候，直接绘制了该元素的新样式，那么这里就只触发了重绘
:::


###  CSS3的新特性：
    1.新增选择器：属性选择器、伪类选择器、伪元素选择器
    2.增加了媒体查询
    3.文字阴影
    4.边框
    5.盒子模型box-sizing
    6.渐变
    7.过度
    8.自定义动画
    9.背景的属性
    10.2D和3D
