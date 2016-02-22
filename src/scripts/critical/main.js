(function(PAGE) {
    'use strict';

    // Google Analytics
    require('./_ga')();

    var loadCSS = require('fg-loadcss'),
        loadJS = require('fg-loadjs');

    loadCSS('/assets/styles/' + PAGE + '.css');
    loadJS('/assets/scripts/site.js');
})(window.PAGE);
