"use strict";

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3002});
var readline = require('readline');
var parseLine = require('./lib/parseLine.js');
var start = Date.now();
var _ = require('underscore');

/**
 * headlessly broad cast an object to every connected clients
 * @param obj
 */
function broadCast(obj) {
  wss.clients.forEach(function (client) {
    client.send(JSON.stringify(obj));
  });
}

var rl = readline.createInterface({
  input: process.stdin,
  terminal: false
});

rl.on('line', function (l) {
    var pased = parseLine(l);
    if (pased && pased.pid) {
      pased.time = start + pased.time;
      broadCast(pased);
    }
  }
);

// just pipe everything through after dealing with lines
process.stdin.pipe(process.stdout);

