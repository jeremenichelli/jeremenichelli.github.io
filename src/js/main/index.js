(function(_win, _doc) {
  'use strict';

  // fake promise resolve for cached fonts
  if (_win.FONTS_CACHED === true) {
    _win.FONTS_LOADED = Promise.resolve();
  }

  // Add class when image and fonts are ready
  _win.FONTS_LOADED
    .then(function() {
      // add ready class to switch
      requestAnimationFrame(function() {
        _doc.documentElement.classList.add('ready');
      });
    });

  // Preload pages on anchor hover event
  function prefetchRoute() {
    var href = this.href;

    // preload!
    try {
      var link = document.createElement('link');
      link.href = href;
      link.rel = 'prefetch';

      document.head.appendChild(link);

      this.removeEventListener('mouseover', prefetchRoute);
    } catch(e) {
      if (DEV === true) {
        console.log('preload not supported: ', e);
      }
    }
  }

  // listen to hover on anchors
  [].slice.call(document.querySelectorAll('a')).map(function(a) {
    // attach when not hashed or external link
    if (a.host === document.location.host && a.href[ 0 ] !== '#') {
      a.addEventListener('mouseover', prefetchRoute);
    }
  });

  // Wrap subheadings with anchors in posts
  if (_win.PAGE === 'post') {
    [].slice.call(_doc.querySelectorAll('h2, h3')).map(function(h) {

      h.innerHTML = '<a href="#' + h.id + '">' + h.textContent + '</a>';

      if (DEV === true) {
        console.log('Link added to heading', '<' + h.tagName.toLowerCase() + '>', h.textContent);
      }
    });
  }
})(window, document);
