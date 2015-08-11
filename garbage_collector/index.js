"use strict";

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3002});
var readline = require('readline');
var parseLine = require('./lib/parseLine.js');
var start = Date.now();

function broadCast(obj) {
  wss.clients.forEach(function (client) {
    client.send(JSON.stringify(obj));
  });
}

var rl = readline.createInterface({
  input: process.stdin,
  terminal: false
});

process.stdin.pipe(process.stdout)

rl.on('line', function (l) {
  var pased = parseLine(l);
  if (pased && pased.pid) {

    var emit = [];




    for (var i in pased) {

      if (typeof pased[i] === 'number') {

        if ([
            "total_size_after",
            "allocated",
            "holes_size_before",
            "holes_size_after",
            "mark",
            "sweep",
            "stepscount",
            "stepstook"
          ].indexOf(i) > -1) {
          emit.push({
            y: pased[i],
            group: i
          });
        }


      }

    }

    emit.push({
      y: pased.total_size_before - pased.total_size_after,
      group: "total_size_diff"
    })


    emit.forEach(function (item) {
      item.x = start + pased.time;
    });
    broadCast(emit);
  }
});

