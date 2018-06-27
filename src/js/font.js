import FontFaceObserver from 'fontfaceobserver';

var w400r = new FontFaceObserver('Fira Sans', { weight: 400 }).load();
var w400i = new FontFaceObserver('Fira Sans', { weight: 400, style: 'italic' }).load();
var w700r = new FontFaceObserver('Fira Sans', { weight: 700 }).load();

window.FONTS_LOADED = new Promise(function(resolve) {
  // wait for all fonts to load
  Promise
    .all([ w400r, w400i, w700r ])
    .then(function() {
      // add fonts loaded class
      document.documentElement.classList.add('fonts-loaded');
      // resolve global fonts loaded promise
      resolve();
      try {
        // put mark on web storage
        sessionStorage.setItem('fonts-cached', true);
      } catch(e) {
        if (__DEV__ === true) {
          console.log(e);
        }
      }
    });
});
