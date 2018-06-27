import store from 'store-css';

// add store.css logs on dev mode
if (__DEV__ === true) {
  store.verbose();
}

// remove no js class
document.documentElement.classList.remove('no-js');

// load font face styles
store.css('https://fonts.googleapis.com/css?family=Fira+Sans:400,400i,700', {
  storage: 'session',
  crossOrigin: 'anonymous'
});

var scripts = [];

// promise polyfill for legacy browsers
if (!('Promise' in window)) {
  scripts.push('https://cdnjs.cloudflare.com/ajax/libs/es6-promise/4.1.1/es6-promise.auto.min.js');
}

// font bundle only on first visit
if (window.FONTS_CACHED === true) {
  document.documentElement.classList.add('fonts-loaded');
} else {
  scripts.push('/assets/js/font.js');
}

// include main script
scripts.push('/assets/js/main.js');

// append all scripts when dom parsing is finished
window.addEventListener('DOMContentLoaded', function() {
  scripts.map(function(src) {
    var scriptElement = document.createElement('script');
    scriptElement.src = src;
    scriptElement.async = false;
    document.head.appendChild(scriptElement);
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
