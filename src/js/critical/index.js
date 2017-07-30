(function(_win, _doc) {
  'use strict';

  // add store.css logs on dev mode
  if (DEV === true) {
    _win.store.verbose();
  }

  // remove no js class
  _doc.documentElement.classList.remove('no-js');

  /*
   * load font face styles
   */
  _win.store.css('https://fonts.googleapis.com/css?family=Fira+Sans:400,400i,700', {
    storage: 'session',
    crossOrigin: 'anonymous'
  });

  /*
   * Conditionally load only necessary scripts
   */
  var scripts = [];

  // include promise polyfill for legacy browsers
  if (!('Promise' in window)) {
    scripts.push('https://cdnjs.cloudflare.com/ajax/libs/es6-promise/4.1.1/es6-promise.auto.min.js');
  }

  // include font bundle on first visit, add class on repeated view
  if (_win.FONTS_CACHED === true) {
    _doc.documentElement.classList.add('fonts-loaded');
  } else {
    scripts.push('/assets/js/font.js');
  }

  // add main script
  scripts.push('/assets/js/main.js');

  // append all scripts when dom parsing has finished
  window.addEventListener('DOMContentLoaded', function() {
    scripts.map(function(src) {
      var scriptElement = _doc.createElement('script');
      scriptElement.src = src;
      scriptElement.async = false;
      _doc.head.appendChild(scriptElement);
    });
  });

  // analytics for production
  if (DEV === false) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(_win,_doc,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-50290926-1', 'jeremenichelli.github.io');
    ga('send', 'pageview');
  } else {
    console.log('Serving locally. Google Analytics is not tracking.');
  }
})(window, document);
