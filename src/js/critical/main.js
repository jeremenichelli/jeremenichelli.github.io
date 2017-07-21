(function(_win, _doc) {
  'use strict';

  // add store.css logs on dev mode
  if (DEV === true) {
    _win.store.verbose();
  }

  // load font face styles
  _win.store.css('https://fonts.googleapis.com/css?family=Fira+Sans:400,400i,700', {
    storage: 'session',
    crossOrigin: 'anonymous'
  });

  // conditionally load fonts or add class
  if (_win.FONTS_LOADED === null) {
    // load scripts
    var scripts = [ '/assets/js/site.js' ]; // script for all users

    var legacyBrowser = !('Promise' in window);

    if (legacyBrowser === true) {
      scripts.unshift('https://cdnjs.cloudflare.com/ajax/libs/es6-promise/4.1.1/es6-promise.auto.min.js');
    }

    scripts.map(function(src) {
      var scriptEl = _doc.createElement('script');
      scriptEl.src = src;
      scriptEl.async = false;
      _doc.head.appendChild(scriptEl);
    });
  } else {
    _doc.documentElement.classList.add('fonts-loaded');
  }

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
