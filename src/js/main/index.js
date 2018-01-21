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
  function preloadFromAnchor() {
    var href = this.href;

    // bail out if link already preloaded or external
    if (linksPreloaded[ href ]) {
      return;
    }

    // preload!
    try {
      linksPreloaded[ href ] = true;

      var link = document.createElement('link');
      link.href = href;
      link.rel = 'prefetch';

      document.head.appendChild(link);
    } catch(e) {
      if (DEV === true) {
        console.log('preload not supported: ', e);
      }
    }
  }

  var linksPreloaded = {};

  // listen to hover on anchors
  [].slice.call(document.querySelectorAll('a')).map(function(a) {
    // only attach event if link is not external
    if (a.host === document.location.host) {
      a.addEventListener('mouseover', preloadFromAnchor);
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
