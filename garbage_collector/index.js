"use strict";

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3002});

function broadCast(obj) {
  wss.clients.forEach(function (client) {
    client.send(JSON.stringify(obj));
  });
}

function broadcastMemory() {
  var mem = process.memoryUsage();

  broadCast([{
    x: Date.now(),
    group: 0,
    y: mem.heapUsed
  }, {
    x: Date.now(),
    group: 1,
    y: mem.heapTotal
  }, {
    x: Date.now(),
    group: 2,
    y: mem.rss
  }]);
}

setInterval(function () {
  broadcastMemory();
}, 1000)