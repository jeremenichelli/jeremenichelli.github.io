(function() {
    'use strict';

    // Google Analytics
    require('./_ga')();

    var loadCSS = require('./_loadCSS');

    loadCSS('/assets/styles/site.min.css');
})();
