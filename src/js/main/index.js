(function(_win, _doc) {
  'use strict';

  // fake promise resolve for cached fonts
  if (_win.FONTS_CACHED === true) {
    _win.FONTS_LOADED = Promise.resolve();
  }

  // resolve promise when image is loaded
  if (_win.PAGE == 'home') {
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
    _doc.documentElement.classList.add('ready');
  });
})(window, document);
