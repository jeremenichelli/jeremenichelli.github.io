(function(_win, _doc) {
  'use strict';

  // fake promise resolve for cached fonts
  if (_win.FONTS_CACHED === true) {
    _win.FONTS_LOADED = Promise.resolve();
  }

  /*
   * add class when image and fonts are ready
   */
  _win.FONTS_LOADED
    .then(function() {
      // add ready class on next available frame
      requestAnimationFrame(function() {
        _doc.documentElement.classList.add('ready');
      });
    });

  /*
   * Wrap subheadings with anchors in posts
   */
  if (_win.PAGE === 'post') {
    var headings = _doc.querySelectorAll('h2, h3');

    for (var i = 0, len = headings.length; i < len; i++) {
      var h = headings[ i ];
      h.innerHTML = '<a href="#' + h.id + '">' + h.textContent + '</a>';

      if (DEV === true) {
        console.log('Link added to heading', '<' + h.tagName.toLowerCase() + '>', h.textContent);
      }
    }
  }
})(window, document);
