var nodes = require('./breakdown/nodes.json');

var defs = require('./breakdown/sample.heapsnapshot.json');
var node_types = defs.snapshot.meta.node_types[0];
var strings = require('./breakdown/strings.json');

var typed_sum = {};
var sum = 0;
for (var i = 0; i < nodes.length; i += 6) {

    var i_type = nodes[i];
    var i_name = nodes[i + 1];
    var i_id = nodes[i + 2];
    var i_size = nodes[i + 3];
    var i_edge_count = nodes[i + 4];
    var i_trace = nodes[i + 5];

    typed_sum[i_type] = typed_sum[i_type] || {
            count: 0,
            size: 0
        };

    typed_sum[i_type].size += i_size;
    typed_sum[i_type].count++;

    sum += nodes[i + 3];
}


Object.keys(typed_sum).forEach(function (key) {
    typed_sum[key].name = node_types[key];
    typed_sum[key].hsize = (typed_sum[key].size / 1024).toFixed(1) + ' k';
});

console.log(sum / 1024);
console.log(require('util').inspect(typed_sum, {
    colors: true
}));