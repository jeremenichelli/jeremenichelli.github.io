(function(PAGE) {
    'use strict';

    // Google Analytics
    require('./_ga')();

    var loadCSS = require('fg-loadcss');

    loadCSS('/assets/styles/' + PAGE + '.css');
})(window.PAGE);
