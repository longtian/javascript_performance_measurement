# javascript_performance_measurement

## 1. 用拓扑图的方式展现 CPU Profile 结果

Chrome Dev Tools 自带的 Profile 功能非常好用。用它可以方便的生成 JavaScript 的 `Flame Chart`。

![Flame Chart](./cpuprofile_topology/screenshot_chrome.png)

更棒的是你可以把 `Flame Chart` 导出，留着下次或者拷贝到其它机器上看。但是网上关于它的文件格式以及如何生成 `Flame Chart` 的文档非常稀有，所以我自己摸索了一下它的文件格式,并尝试着用另一种方式展示 Profile 的结果。

**如何生成 CPU Profile 文件**

使用最新版的 Chrome 打开任意一个 [测试网站](http://oneapm.com)，按 F12 打开 `Devtools`， 切换到 `Profiles` 页，点击 `Start` 开始
收集 Profile 信息，在当前页面任意滑动鼠标等待大约5秒后， 点击 `Stop` 停止 Profile。在生成的 CPU Profile 名字上单击右键可以导出，
比如这个 [sample.cpuprofile](https://raw.githubusercontent.com/wyvernnot/javascript_performance_measurement/gh-pages/cpuprofile_topology/sample.cpuprofile)

**原理**

0\. `sample.cpuprofile` 其实就是一个 JSON 格式的文件，有 `head`, `timestamps`, `samples` 等几个重要的属性

1\. 如果对 `head` 结点及其子节点 `children` 做一次深度优先的遍历，每个可能路径都会有一个编号

2\. `timestamps` 是一个数组，记录着 Profiling 过程中每个采样点的时间戳

3\. 对应 `timestamps` 下的每个时间点，`samples` 数组相同的位置都会有一个数字，研究表明这个数字 _就是步骤1中的编号_

4\. 对于任意一个时间点，都会有一个 active 的路径，用蓝色表示。

**DEMO**

使用 Chrome 打开： [DEMO](http://wyvernnot.github.io/javascript_performance_measurement/cpuprofile_topology/)

**操作**

1\. 等待加载完成

2\. 鼠标滚轮可以缩放图片

3\. 拖过滑块可以查看每个时间点的详细情况
