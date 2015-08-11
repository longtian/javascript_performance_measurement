/**
 * Created by yan on 15-8-11.
 */

var REG_GC = /\[(\d+)\]\s+(\d+) ms:\s+(.*)$/;
var NUMBER = /\d+/;
var SEGMENT_REG = /^\[(\d+)\]\s([\w\s]+),\s+used/;
var USED_REG = /used:\s+(\d+)\s+KB/;
var AVAL_REG = /available:\s+(\d+)\s+KB/;
var COMM_REG = /committed:\s+(\d+)\s+KB/;

function parseLine(l) {
  var res = {};
  var matchGC = l.match(REG_GC);

  if (matchGC && matchGC.length === 4) {
    res.pid = parseInt(matchGC[1]);
    res.time = parseInt(matchGC[2]);
    res.type = "gc";

    matchGC[3].split(" ").forEach(function (pair) {
      var row = pair.split("=");

      if (row.length === 2) {
        if (NUMBER.test(row[1])) {
          res[row[0]] = parseInt(row[1]);
        } else {
          res[row[0]] = row[1];
        }
      }

    });

  }

  var matchSeg = l.match(SEGMENT_REG);

  if (matchSeg) {

    res.pid = matchSeg[1];
    res.type = normalize(matchSeg[2]);

    if (l.match(USED_REG)) {
      res.used = parseInt(l.match(USED_REG)[1]) * 1024;
    }

    if (l.match(AVAL_REG)) {
      res.available = parseInt(l.match(AVAL_REG)[1]) * 1024;
    }

    if (l.match(COMM_REG)) {
      res.committed = parseInt(l.match(COMM_REG)[1]) * 1024;
    }

  }

  return res;
}


function normalize(str) {
  return str.replace(/\s/g, '_').toLowerCase();
}

module.exports = parseLine;