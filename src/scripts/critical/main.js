(function() {
    'use strict';

    // Google Analytics
    require('./_ga')();

    var loadCSS = require('fg-loadcss');

    loadCSS('/assets/styles/site.min.css');
})();
