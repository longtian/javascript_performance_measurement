/**
 * Created by yan on 15-8-3.
 */
(function ($) {
    var STYLING_EVENTS_BINDED = false;
    var DROPPABLE_CLASSNAME = 'droppable';

    /**
     *
     * @param handler {Funtion}
     * @returns {jQuery}
     *
     */
    $.fn.droppable = function (handler) {

        if (!STYLING_EVENTS_BINDED) {
            $(window).on('dragenter', function () {
                $("." + DROPPABLE_CLASSNAME).css({
                    background: "orange"
                });
            });
            STYLING_EVENTS_BINDED = true;
        }

        return $(this)
            .not('.' + DROPPABLE_CLASSNAME)
            .addClass(DROPPABLE_CLASSNAME)
            .on('dragover', function (e) {
                e.preventDefault();
            }).on('drop', function (e) {
                e.preventDefault();

                var self = this;

                // baidu tongji code, should be removed
                _hmt && _hmt.push(['_trackEvent', 'events', 'drop']);

                var reader = new FileReader();
                var file = e.originalEvent.dataTransfer.files[0];

                reader.onload = function () {

                    handler.call(self, file, reader.result);

                };

                reader.readAsText(file);
            });

    };
})(jQuery);