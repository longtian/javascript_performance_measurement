/**
 * Created by yan on 15-8-12.
 */

var parseLine = require('../lib/parseLine.js');
var assert = require('assert');

describe('parseLine', function () {
  /**
   *
   * {
   *    pid: 9893,
        time: 636,
        type: 'gc',
        pause: 0,
        mutator: 0,
        gc: 's',
        external: 0,
        mark: 0,
        sweep: 0,
        sweepns: 0,
        evacuate: 0,
        new_new: 0,
        root_new: 0,
        old_new: 0,
        compaction_ptrs: 0,
        intracompaction_ptrs: 0,
        misc_compaction: 0,
        total_size_before: 2398448,
        total_size_after: 2017168,
        holes_size_before: 169032,
        holes_size_after: 176640,
        allocated: 2398448,
        promoted: 392648,
        stepscount: 0,
        stepstook: 0

   * }
   */
  it('should work with NVP', function () {
    var str = "[9893]      636 ms: pause=0 mutator=0 gc=s external=0 mark=0 sweep=0 sweepns=0 evacuate=0 " +
      "new_new=0 root_new=0 old_new=0 compaction_ptrs=0 intracompaction_ptrs=0 misc_compaction=0 " +
      "total_size_before=2398448 total_size_after=2017168 holes_size_before=169032 holes_size_after=176640 " +
      "allocated=2398448 promoted=392648 stepscount=0 stepstook=0";
    var result = parseLine(str);

    assert.equal(result.pid, 9893);
    assert.equal(result.type, 'gc');
    assert.equal(result.total_size_before, 2398448);

  });
});