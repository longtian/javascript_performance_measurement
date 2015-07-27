# javascript_performance_measurement

## 1. 用拓扑图的方式展现 CPU Profile 结果

Chrome Deve Tools 自带的 Profiler 功能非常好用。用它可以方便的生成 JavaScript 的 `Flame Chart`。

但是网上关于如何生成 `Flame Chart` 的文档非常稀有，所以我自己摸索了一下 `.cpuprofile` 文件格式,并尝试着用另一种方式展示 Profile 的结果。

使用最新版的 Chrome 打开任意一个 [测试网站](http://oneapm.com)，按 F12 打开 `Devtools`， 切换到 `Profiles`，点击 `Start` 开始收集 Profile 信息，等待大约5秒后， 点击 `Stop` 停止 Profile。

此时的 CPU Profile 信息是可以导出的，比如这一个 [sample.cpuprofile](https://raw.githubusercontent.com/wyvernnot/javascript_performance_measurement/gh-pages/cpuprofile_topology/sample.cpuprofile)

### 演示

[DEMO](http://wyvernnot.github.io/javascript_performance_measurement/cpuprofile_topology/)

**操作**

1\. 等待加载完成
2\. 鼠标滚轮可以缩放图片
3\. 拖过滑块可以查看每个时间点的 active 的函数
