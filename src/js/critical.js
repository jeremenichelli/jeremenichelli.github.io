import store from 'store-css';

// add store.css logs on dev mode
if (__DEV__ === true) {
  store.verbose();
}

// load font face styles
store.css('https://fonts.googleapis.com/css?family=Fira+Sans:400,400i,700', {
  storage: 'session',
  crossOrigin: 'anonymous'
});

// remove no js class
document.documentElement.classList.remove('no-js');

// check for fonts cached flag
var FONTS_CACHED = JSON.parse(sessionStorage.getItem('fonts-cached'));

// enqueue scripts for deferred loading
var scripts = [];

if (!('Promise' in window)) {
  scripts.push('https://cdnjs.cloudflare.com/ajax/libs/es6-promise/4.1.1/es6-promise.auto.min.js');
}

if (!FONTS_CACHED) {
  scripts.push('/assets/js/font.js');
} else {
  document.documentElement.classList.add('fonts-loaded');
}

// append all scripts when dom parsing is finished
window.addEventListener('DOMContentLoaded', function() {
  scripts.map(function(src) {
    var scriptElement = document.createElement('script');
    scriptElement.src = src;
    scriptElement.async = false;
    document.body.appendChild(scriptElement);
  });
});

// analytics for production
if (__DEV__ === false) {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-50290926-1', 'auto');
  ga('send', 'pageview');
} else {
  console.log('Serving locally. Google Analytics is not tracking.');
}
