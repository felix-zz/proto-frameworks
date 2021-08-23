# Welcome to Proto Frameworks

## Proto Frameworks 能做什么？

这是一套原型框架，着眼点是「用前端代码写出你的原型」，面向一些微型、后台型团队，多角色型选手，比如：

* 你是前端，但也有产品和交互的职责
* 你是产品经理，会写也乐于写一点前端代码，想练手想转型

Proto Frameworks 可以帮你做什么——

* 一套前端代码，既是带需求和逻辑描述的原型稿，也是交互稿，更是视觉稿，当然，你也可以把这些代码直接
  复制到你的前端工程里，变成终稿。（怎么做到的？请继续看 QuickStart）
* 使用任意的脚手架、组件库和视觉标准化的样式表构建你的原型工程（但目前 Proto Frameworks 只支持
  React 框架）
* 无后端设计，所有的文档、注释、原型稿都在你的代码仓库中
* 想看历史版本？Checkout 你的历史 Git 分支，部署即可！

如果你觉得这点子不错，就开始阅读 QuickStart 吧！（我们认为你已经有一定的前端基础了，包括
JavaScript 基础，React，以及一定的打包构建知识）

## QuickStart

你可以直接 Clone 下本工程，使用工程中的 Demo 进行体验。

> 建议安装 Node 14.17 及以上版本，本例使用 Yarn 1.19.1 进行示范，TypeScript 作为前端语言

* Clone
  下本工程：```$ git clone git@github.com:felix-zz/proto-frameworks.git```
* 进入工程目录，安装依赖：```$ cd proto-frameworks; yarn```
* 启动 Demo 工程：```$ yarn start```
* 打开 [http://localhost:18080]() 开始浏览 Demo 工程

## Demo 工程说明

万物起源：```demo/index.tsx```，在页面中渲染一个 ```<ProtoFrameworks/>```
组件即可。

### ProtoFrameworks 入口组件属性说明

* pageTree，必填，包含原型中所有的页面，由多个产品（Product）组成一棵页面树。
* currentVersion，必填，当前原型的版本，可以使用你喜欢的任意版本号风格，比如 ```v202109```
* defaultProduct，默认产品名，对应于 pageTree 第一层的 Key
* historyVersions，历史版本描述信息，在"历史版本"
  弹窗中会显示历史版本信息，也有助于管理你原型工程的版本，作为 Release Notes
* requirementPlans，需求计划列表，我们使用"计划 -> 模块 -> 需求"
  三层模型来描述你的需求计划周期，计划有对应的"版本"，我们也推荐使用此属性来管理页面、注释的版本。
* titleToolbar，定制原型的顶部导航栏工具包
* indexPage，定制原型首页的 React 组件，默认是一个空白页面。你可以把一些常用内容放入首页，比如
  你产品的设计规范等

### pageTree

引入 ```pageTreeBuilder()``` 方法来构造你的 pageTree：

```js
const pageTree: StringMap<PageNode> =
  pageTreeBuilder()
    .addProduct('foo-product', fooProduct)
    .create();
```

其中，fooProduct 是 ```foo-product``` 这个产品 Key
对应的子页面树，可以引入 ```pageNodeBuilder()``` 来构造一个子页面树，也可以直接创建。

使用 Builder 构造一个 fooProduct：

```js
const fooProduct: PageNode =
  pageNodeBuilder()
    .withChildren(childPages) // 子页面，Map<String, PageNode> 类型，Key 是页面的键值，Value 是一个 PageNode
    .withElement(FooProductIndex) // 页面的 React 组件类型，如果不设置这个属性，那么这个页面就是个虚节点，可作为文件夹/分组使用
    .withRequirements(requirements) // 与此页面相关的需求列表
    .withProps({}) // 如果页面组件需要一些 Props 参数，用此方法注入
    .create();
```

直接创建 childPages：

```js
const childPages: StringMap<PageNode> = {
  fooModule: { // 页面的 Key
    name: 'Foo 模块', // 页面的标题，出现在原型页面的左侧导航栏中
    element: FooPageComponent, // 用来渲染这个页面的 React 组件
    requirements: [fooRequirement1], // 与这个页面相关的需求列表，如果需求所在计划的版本跟 currentVersion 相同，则页面会被展示在左侧页面树中
    pages: { // 这个页面的子页面树，结构相同
      fooChildPage: {}, // 子页面结构相同
    },
    nav: { // 页面还可以包含多个状态，每个状态都被列举在原型页面的头部，作为导航项
      defaultTitle: 'Default Stage Title', // 默认状态下的页面标题
      items: [{ // 其他状态列表，元素是 PageNav 类型，属性与 PageNode 大致相同
        name: 'Stage 1', // 状态 1 的状态名
        element: FooPageComponent, // 状态 1 的页面组件
        props: {stage: 1}, // 不同状态可能会使用同一个组件，通过某个属性来进行部分页面元素的控制
        requirements: [fooRequirement1], // 这个状态对应的需求
      }],
    },
  },
  barModule: {...}, // 另一个页面
};
```

### requirementPlans

使用这个属性来管理你的需求计划列表。

创建一个计划：

```js
const plan1: RequirementPlan = {
  key: 'demo_plan', // Plan 的 Key
  title: 'Demo Requirement Plan', // Plan 的标题
  version: 'v202109', // Plan 的版本，你可以使用任意的版本风格
  groups: [{ // 需求分组/模块列表
    key: 'm1', // 模块 Key
    title: 'Module 1', // 模块名
    requirements: [fooRequirement1], // 模块中的需求列表
  }],
};
```

创建一个需求，可以引入 ```createRequirement()``` 来构造一个需求，也可以直接创建：

```js
// 创建一个需求，你可以 export 它，然后在构造 pageTree、写页面注释的时候直接引用这个需求
export const fooRequirement1: Requirement = {
  key: 'fooReq1', // 需求的 Key
  title: 'Foo 需求1', // 需求标题
  priority: 1, // 需求等级，我们定义出 1~4 四个等级，1 为最高优先级需求，4 为最低
  renderContent: () => (
    <Markdown md='# 需求标题\n\n 需求内容'/>
  ), // 渲染需求描述的类型，可以使用框架自带的 Markdown 组件，使用 Markdown 语法撰写需求
};
```

### historyVersions

历史版本描述信息，VersionInfo 数组。直接创建一个版本信息：

```js
const version1: VersionInfo = {
  version: 'v202109', // 版本号
  description: '这个版本的一些描述信息', // 描述信息
  url: 'http://xxxx', // 如果这个版本的原型还在某处部署着，可以直接查看，可以把链接地址放在这里
};
```

## 编写一个原型页面

入口我们介绍完了，下面举例介绍如何写一个原型页面。

可以参考 ```demo/module_index.tsx``` 的源代码，需要特别注意的是，写原型页面的时候，
与真正写业务工程中的前端代码有几点不同：

* 代码中可以使用 ```ComponentComment``` 组件以及另外几个相关组件，直接对页面元素加上注释，
  框架会自动把注解分布在页面的两侧，这一点与使用一些图形化页面来画原型也有显著的不同——彻底解放你的鼠标或触摸板！
* **不要**纠结于页面元素的动态状态、交互响应等，始终牢记你写的只是一个纯静态的原型，状态变化、交互相应要尽可能的
  使用注解表达，让其他人直接读懂你的逻辑设计，而不是用鼠标戳遍你的页面元素，不断猜你的意图。**这一点是原型的精髓**
  > 如果你的页面有多个状态，尝试用页面的 nav 属性把这些状态罗列成一系列静态页面。其他简单的场景比如——
  * 比如，更好的做法是把 Select 中的选项逐一列举在注释中，并且解释每一个的用途，而不是让其他成员点一下
    Select 查看里面的选项
  * 比如，把一个元素的 Tooltip 内容显式地写在注释中，而不是让其他成员把鼠标 Hover 上去查看内容
  * 比如，一个表单中，Radio1 为 A 时显示 x 选项，为 B 时显示 y 选项，那么请把 x 和 y
    都罗列在表单中，然后把它们与 Radio1 的联动逻辑写在注释中

### &lt;ComponentComment/&gt;

这是在原型页面中最常用的一个元素，一般用法比如：

```js
render()
{
  return (
    <div>
      <h1>这是 Foo 页面的标题</h1>
      <p>
        这是一段页面内容，其中
        <ComponentComment requirementComments={[{
          requirement: fooRequirement1,
          content: '这是这一段文字的注释内容\n换行再写一些注释'
        }]}>
          <span>有一段文字</span>
        </ComponentComment>
        有注释
      </p>
    </div>
  )
}
```

被 ```ComponentComment``` 包裹的元素会自动挂上一个注释，显示在页面的两侧。另外，
被包裹的元素上会有一个热区，用户点击这个热区，注释内容会显示在页面元素下方，在页面过长时可以更方便的查看注释。

#### 指定注释的位置

注释被自动的放在页面的左右两侧，如果你觉得某一侧太拥挤，可以为注释指定一个位置：```position='left'```
或 ```position='right'```。

#### 指定注释的选择器

如果你有一个组件 ```<BarComponent/>```：

```js
class BarComponent {
  render() {
    return (
      <div>
        <label>Bar Label:</label>
        <span>Bar Content</span>
      </div>
    )
  }
}
```

另外一个组件引用了它，并添加了注释，但这个注释仅针对于 ```BarComponent```
中的 ```label``` 标签。 那么可以使用 ```selector```
选择器属性来把注释指向 ```label```：

```js
class BarParentComponent {
  render() {
    return (
      <ComponentComment selector='label'
                        requirementComments={[]}>
        <BarComponent/>
      </ComponentComment>
    )
  }
}
```

```selector``` 请参照 JQuery 的选择器语法，可以按照 id、class 等进行选择。

#### 组件内注释去重

如果 ```BarComponent``` 内部有一条注释，而它又被父组件引用了多次，造成的后果就是有多个重复的注释
被展示到了页面两侧。要避免这种情况，使用 ```uk``` 属性即可：

```js
class BarComponent {
  render() {
    return (
      <div>
        {/* 有了 uk，框架会根据 uk 进行页面注释的去重 */}
        <ComponentComment uk='label-of-bar'
                          requirementComments={[]}>
          <label>Bar Label:</label>
        </ComponentComment>
        <span>Bar Content</span>
      </div>
    )
  }
}
```

```js
class BarParentComponent {
  render() {
    return (
      <div>
        {/* 不论有多少个 BarComponent 出现，label 的注释只会有一个 */}
        <BarComponent/>
        <BarComponent/>
        <BarComponent/>
      </div>
    )
  }
}
```

#### ```ComponentComment``` 的其他属性

* width，选填，指定注释的宽度
* plainContent，选填，默认为 true，表示注释内容是否为普通的文本，默认状态下，注释以默认的宽度
  和默认的样式出现，当此属性为 false 时，注释内容将不再带默认的边框、底色和字体颜色，```content```
  属性可以填充一个任意的 ```ReactNode```，放入任何富文本注释内容
* maxHeight，避免注释过高，引入滚动条展示
* comments，不建议使用，类型是 Map<string, ReactNode>，Key 是版本号，Value
  是注释的内容， 可以不关联需求直接写注释和它对应的版本号，简单场景还可以应对，但如果一个需求因为某些
  原因变更了计划后，版本发生变化，那你可能要在下一期的新版本中，逐一修改页面中注释的版本号了。

#### 其他注释组件

* ```<DsiableComment/>```，在它包裹下的元素，其中所有的注释都不会显示出来
* ```<CommentAnchor/>```，注释的锚点，可以让一条注释挂在多个页面元素上
  （一个注释有多条线链接多个元素），示例：
  ```js
  render()
  {
    return (
      <ComponentComment>
        <div>注释会默认挂在这个元素上</div>
        <div>一些其他内容</div>
        <CommentAnchor/>
        <div>前面放一个锚点，注释还会挂在这个元素上</div>
      </ComponentComment>
    );
  }
  ```

### 页面的度量模式

框架在展示原型时可以开启上部导航栏的度量模式（Shift+E），度量模式下注释被隐藏，鼠标 Hover 到每个元素
上会显示元素的一些样式信息，比如宽、高、字体信息等等。点击某个元素后还能锁定，再 Hover 到其他元素上时，
除了展示两个元素的样式信息，他们之间的 x/y 距离也会显示出来。

#### 移动端的度量

一般情况下，宽、高、字体大小、间距等都是以 ```px```
为单位，如果你在编写移动端的原型，那么放置一个 ```<Base1Rem/>```
组件在页面的任意位置（组件本身不可见）， 度量单位就会变为 ```rem```：

```js
render()
{
  return (
    <div style={{fontSize: '1.2rem'}}>
      这是一个移动端原型的内容，字体大小为 1.2 rem。只需要在任意位置放置一个 Base1Rem
      组件，度量模式就会自动转换为 rem 单位。
      <Base1Rem/>
    </div>
  )
}
```