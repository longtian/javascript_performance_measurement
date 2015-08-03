/**
 * Created by yan on 15-8-3.
 */
function track_progress(vis) {

    if ($('.progress_tracker').size()) {
        var $progress = $('.progress_tracker');
    } else {
        var $progress = $("<progress/>").addClass('progress_tracker').prependTo('body');
    }


    vis.on('stabilizationProgress', function (e) {
        $progress.val(e.iterations / e.total);
    });
    vis.on('stabilizationIterationsDone', function (e) {
        $progress.val(1);
    });
    vis.on('startStabilizing', function (e) {

    });
}