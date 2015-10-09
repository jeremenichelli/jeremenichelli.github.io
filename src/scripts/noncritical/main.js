(function(_win, _doc, SITE) {
    'use strict';

    /*
     * aliasses
     * _win: window global object
     * _doc: document object
     */

    // attach event to mobile navigation button
    SITE.mobileNavigation.button.addEventListener('click', SITE.mobileNavigation.toggle, false);

    // progress bar only for posts
    if (SITE.isPost) {
        _win.addEventListener('load', function() {
            scrollProgress.set({
                events: false,
                color: '#ff8f00'
            });

            var progressBar = _doc.getElementById('progress-wrapper');

            steer.set({
                events: false,
                up: function() {
                    progressBar.classList.add('hidden');
                },
                down: function() {
                    progressBar.classList.remove('hidden');
                }
            });

            // add events for scroll progress bar
            _win.addEventListener('scroll', function() {
                scrollProgress.trigger();
                steer.trigger();
            }, false);

            _win.addEventListener('resize', function() {
                scrollProgress.update();
            }, false);
        }, false);
    }

})(window, document, window.SITE = window.SITE ? window.SITE : {});
