// fake promise resolve for cached fonts
if (window.FONTS_CACHED === true) {
  window.FONTS_LOADED = Promise.resolve();
}

// Add class when image and fonts are ready
window.FONTS_LOADED
  .then(function() {
    // add ready class to switch
    requestAnimationFrame(function() {
      document.documentElement.classList.add('ready');
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
    if (__DEV__ === true) {
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
if (window.PAGE_TYPE === 'post') {
  [].slice.call(document.querySelectorAll('h2, h3')).map(function(h) {

    h.innerHTML = '<a href="#' + h.id + '">' + h.textContent + '</a>';

    if (__DEV__ === true) {
      console.log(
        'Link added to heading',
        '<' + h.tagName.toLowerCase() + '>',
        h.textContent
      );
    }
  });
}
