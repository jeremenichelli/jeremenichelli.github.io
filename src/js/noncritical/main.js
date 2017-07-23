(function(_win, _doc) {
  'use strict';

  var w400r = new FontFaceObserver('Fira Sans', { weight: 400 }).load();
  var w400i = new FontFaceObserver('Fira Sans', { weight: 400, style: 'italic' }).load();
  var w700r = new FontFaceObserver('Fira Sans', { weight: 700 }).load();

  Promise.all([
    w400r,
    w400i,
    w700r
  ]).then(function() {
    // add class to show webfonts on next available frame
    requestAnimationFrame(function() {
      _doc.documentElement.classList.add('fonts-loaded');
    });

    // put mark on web storage
    try {
      sessionStorage.setItem('fonts-loaded', true);
    } catch (e) {
      if (DEV === true) {
        console.log(e);
      }
    }
  });
})(window, document);
