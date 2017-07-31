(function(_win, _doc) {
  'use strict';

  // fake promise resolve for cached fonts
  if (_win.FONTS_CACHED === true) {
    _win.FONTS_LOADED = Promise.resolve();
  }

  // resolve promise when image is loaded
  if (_win.PAGE === 'home') {
    var IMAGE_LOADED = new Promise(function(resolve) {
      // get home image
      var image = _doc.getElementsByClassName('home__image')[0];

      // resolve on iamge loaded
      image.onload = function() {
        image.onload = null;
        resolve();
      }

      // assign src to image
      image.src = image.dataset.src;
    });
  } else {
    var IMAGE_LOADED = Promise.resolve();
  }

  /*
   * add class when image and fonts are ready
   */
  Promise.all([
    IMAGE_LOADED,
    _win.FONTS_LOADED
  ])
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
    var headings = _doc.querySelectorAll('h2, h3, h4, h5, h6');

    for (var i = 0, len = headings.length; i < len; i++) {
      var h = headings[ i ];
      h.innerHTML = '<a href="#' + h.id + '">' + h.textContent + '</a>';

      if (DEV === true) {
        console.log('Link added to heading', '<' + h.tagName.toLowerCase() + '>', h.textContent);
      }
    }
  }
})(window, document);
