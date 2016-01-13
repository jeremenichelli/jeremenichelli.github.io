(function(_win) {
    'use strict';

    /*
     * aliasses
     * _win: window global object
     */

    var mobileNavigation = require('./_mobileNavigation');

    _win.addEventListener('load', function() {
        // attach event to mobile navigation button
        mobileNavigation.button.addEventListener('click', mobileNavigation.toggle, false);
    }, false);
})(window);
