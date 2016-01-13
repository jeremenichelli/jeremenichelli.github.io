(function(_win, _doc) {
    'use strict';

    /*
     * aliasses
     * _win: window global object
     * _doc: document object
     */

    var mobileNavigation = require('./_mobileNavigation');

    // attach event to mobile navigation button
    mobileNavigation.button.addEventListener('click', mobileNavigation.toggle, false);

})(window, document);
