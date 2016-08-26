(function(_win, _doc) {
  'use strict';

  var w400 = new FontFaceObserver('Fira Sans', { weight: 400 }),
    w400i = new FontFaceObserver('Fira Sans', { weight: 400, style: 'italic' }),
    w700 = new FontFaceObserver('Fira Sans', { weight: 700 });

  Promise.all([ w400.load(), w400i.load(), w700.load() ])
    .then(function() {
      _doc.documentElement.classList.add('fonts-loaded');
      _win.sessionStorage.setItem('fonts-loaded', true);
    });
})(window, document);
