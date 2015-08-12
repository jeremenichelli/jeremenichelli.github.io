(function(_win, _doc, SITE, undefined) {
    'use strict';

    /*
     * aliasses
     * _win: window global object
     * _doc: document object
     */

    // attach event to mobile navigation button
    SITE.mobileNavigation.button.addEventListener('click', SITE.mobileNavigation.toggle, false);

    // progress bar for posts
    if (SITE.isPost) {
        _win.addEventListener('load', function() {
            scrollProgress.set({
                events: false,
                color: '#263238'
            });

            // add listener for scroll progress bar
            _win.addEventListener('scroll', function() {
                scrollProgress.trigger();
            }, false);

            _win.addEventListener('resize', function() {
                scrollProgress.update();
            }, false);
        }, false);
    }

})(window, document, window.SITE = window.SITE ? window.SITE : {});