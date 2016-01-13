(function(_win, _doc) {
    'use strict';

    /*
     * aliasses
     * _win: window global object
     * _doc: document object
     */

    // Google Analytics
    require('./_ga')();

    var loadCSS = require('./_loadCSS');

   	loadCSS('/assets/styles/site.min.css');

})(window, document);
