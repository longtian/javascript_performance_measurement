# OneHeap

## 背景

JavaScript 性能分析另一个比较重要的方面是内存分析。JavaScript 运行过程中的大部分数据都保存在堆 (Heap) 中。

利用 Chrome Dev Tools 可以生成某个时刻的堆快照 (HeapSnapshot)，较完整地记录了各种引用的情况，堪称查找内存泄露问题的神器。
和 Profile 结果一样，快照可以被导出成 `.heapsnapshot` 文件。

![heapsnapshot](./images/dog.png)

上周发布了工具 [OneProfile](http://wyvernnot.github.io/javascript_performance_measurement/cpuprofile_topology/) ，
可以用来动态地展示 Profile 的结果，分析各种函数的调用关系。周末我用类似的思路研究了一下 `.heapsnapshot` 文件，做了这个网页小工具。

## OneHeap 名字的由来

> There are only two hard things in Computer Science: cache invalidation and naming things. -- Phil Karlton

目前还没有时间想一个高端、大气、上档次的名字，因为我在的公司名叫 [OneAPM](http://www.oneapm.com/info/about.html) ( 省去软广1000字，总之做性能监控很牛)，所以就取名 OneHeap 啦。

## 如何生成 Heap Snapshot 文件

**浏览器**

使用 Chrome 打开 [测试页面](http://wyvernnot.github.io/javascript_performance_measurement/heap_snapshot/dog.html)
按 F12 打开 `Devtools`，切换到 `Profiles` 页，选择 `Take Heap Snapshot`。稍等片刻，在生成的 `Snapshot` 上点击右键可以导出，文件后缀一般是 `.heapsnapshot`。

**Node.JS**

如果你是 Node.JS 工程师，可以安装 `heapdump` 这个很有名的模块。

[https://github.com/bnoordhuis/node-heapdump](https://github.com/bnoordhuis/node-heapdump)

上面两种方法都可以生成 `.heapsnapshot` 文件，这个是用来测试的 [nodejs.heapsnapshot](http://wyvernnot.github.io/javascript_performance_measurement/heap_snapshot/nodejs.heapsnapshot)

## 理解 .heapsnapshot 文件格式

打开测试用的 `nodejs.heapsnapshot` 文件，很激动有没有，因为也是 JSON 格式的。`snapshot` 属性保存了关于快照的一些基本信息；`nodes` 是
所有的结点；结点间的对应关系存在 `edges` 属性下；此外所有的字符串都保存在 `strings` 下。

`nodes` 和 `strings` 都是数组，这比较好理解，

**nodes**

|下标   |属性          |类型            |
|------|--------------|---------------|
|n      |type         |number         |
|n+1    |name         |string         |
|n+2    |id           |number         |
|n+3    |self_size    |number         |
|n+4    |edge_count   |number         |

其中 type 是一个 0~9 的数字，数字到对应的名字的关系用一个数组表示

```
[
  "hidden",
  "array",
  "string",
  "object",
  "code",
  "closure",
  "regexp",
  "number",
  "native",
  "synthetic"
],
```

`edges` 也是一个数组，这理解起来就需要花点时间了。

**edges的结构**

**edges**

|下标   |属性          |类型|
|------|--------------|---------------|
|n      |type         |number|
|n+1    |name_or_index|string_or_number|
|n+2    |to_node      |node         |


其中 type 是一个 0~6 的数字，数字到对应的名字的关系用一个数组表示

```
[
  "context",
  "element",
  "property",
  "internal",
  "hidden",
  "shortcut",
  "weak"
],
```


## 有趣的点

**MathConstructor**

![Math](./images/math.png)

```js

  // Instance class name can only be set on functions. That is the only
  // purpose for MathConstructor.
  function MathConstructor() {}
  var $Math = new MathConstructor();
  
  ......

  // Set up math constants.
  InstallConstants($Math, $Array(
    // ECMA-262, section 15.8.1.1.
    "E", 2.7182818284590452354,
    // ECMA-262, section 15.8.1.2.
    "LN10", 2.302585092994046,
    // ECMA-262, section 15.8.1.3.
    "LN2", 0.6931471805599453,
    // ECMA-262, section 15.8.1.4.
    "LOG2E", 1.4426950408889634,
    "LOG10E", 0.4342944819032518,
    "PI", 3.1415926535897932,
    "SQRT1_2", 0.7071067811865476,
    "SQRT2", 1.4142135623730951
  ));
```

**正则表达式**

![Regexp](./images/regexp.png)

**流处理**

![Stream](./images/stream_inherit.png)

在 Node.JS 中和 Stream 相关的几个类的设计和 `Java` 类似，都使用到装饰器的设计模式，层层嵌套。

例如 `Passthrough` 继承自 `Transform`，这部分的源码如下：

```js
var Transform = require('_stream_transform');
var util = require('util');
util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}
```

通过可视化，可以很方便地找到这个继承关系。
