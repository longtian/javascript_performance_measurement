/**
 * Created by yan on 15-8-11.
 */

var REG_GC = /\[(\d+)\]\s+(\d+) ms:\s+(.*)$/;
var NUMBER = /\d+/;
function parseLine(l) {
  var res = {};
  var matchGC = l.match(REG_GC);

  if (matchGC && matchGC.length === 4) {
    res.pid = parseInt(matchGC[1]);
    res.time = parseInt(matchGC[2]);

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

  return res;
}

module.exports = parseLine;