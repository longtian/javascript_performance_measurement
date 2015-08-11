var buffer1 = [];
var buffer2 = [];
var now = t();

setInterval(function () {
  buffer1.push((new Array(1E6)).join("."));
}, 100);

function h(int) {
  return Math.round(int / 1024);
}

function t() {
  var a = process.hrtime();
  return a[0] * 1000 + a[1] / 1E6;
}

setInterval(function () {
  var mem = process.memoryUsage();
  console.log("%d ms", t() - now);
  console.log("[%d] RSS, \t\t    used:\t%d KB", process.pid, h(mem.rss));
  console.log("[%d] Heap total, \t    used:\t%d KB", process.pid, h(mem.heapTotal));
  console.log("[%d] Heap used, \t    used: \t%d KB", process.pid, h(mem.heapUsed));
  console.log("");
  buffer1 = [];
}, 1000);