---
layout: default
title: About that time I tried to beat browser cache
resume: After applying a new redesign and architectural changes to my site to improve loading and rendering times, I started thinking what else I could do to give a faster experience to the user. Then I saw the Network tab on the developer tools and found it!
---

*What if I save the content of the stylesheets in the local storage and use it on future visits?*

Of course, this is similar to what <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching" target="_blank">browser caching</a> does, it temporarily stores used resources.

When a page tries to fetch a **cached** resource instead of going into roundtrips between client and server the browser provides it saving loading time and network usage, but in some way, that fetch is still a network request with headers and directives.

My inital goal was to improve that using the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API" target="_blank">Web Storage API</a> and JavaScript, but first I needed to dive into the **link** element and how it works.


## About the link element

The link element inherits a lot of native methods from the HTML Element object. In addition it brings some special features because of its own nature, and some of them crucial to achieve what I wanted.

The first step was to know when the stylesheet is finally loaded so all the rules are available to be stored and how that could actually be done.


### The load event

This event is present in all elements which allow you to load an external resource. Pretty obvious.

```js
var link = document.createElement('link');

// add rel attribute
link.rel = 'stylesheet';

// add resource location
link.href = 'styles.css';

link.onload = function() {
  // loaded -- now, do something!
};

document.head.appendChild(link);
```

After giving values to the necessary set of attributes and before adding the element to the **head** of the document, we can assign a function that will be called when the stylesheet is ready.

In some browsers this event is executed twice, to prevent that you can assign `null` to the event inside the function.

```js
link.onload = function() {
  this.onload = null;
  // loaded -- now, do something!
};
```

We are ready to start playing with our **link** element and its stylesheet.


### sheet just got real

In modern browsers, a `sheet` property is available on **link** elements which initial value is `null`, but when the stylesheet hits the browser it contains a lot of information about our **.css** file.

For this case, I just needed one thing, a collection of strings for all the CSS rules.

```js
link.onload = function() {
  this.onload = null;

  var rules = this.sheet.cssRules;

  for (var i = 0, len = rules.length; i < len; i++) {
    // rules[i].cssText -- do something with it!
  }
};
```

We had to crawl a little deep inside the `sheet` property but now we can iterate through all the CSS rules and do something with them. Since they are strings, as you know them, I decided to create an empty one and acummulate all the rules to later store the result.

```js
link.onload = function() {
  this.onload = null;

  var rules = this.sheet.cssRules;
  var ssContent = '';

  for (var i = 0, len = rules.length; i < len; i++) {
    ssContent += rules[i].cssText;
  }

  // use link href as key
  localStorage.setItem(this.href, ssContent);
};
```

There you go, we have stored all the rules from our stylesheet. Next step is to detect if our rules have been previously saved and inject a **style** tag containing them.

```js
var link = document.createElement('link');

link.rel = 'stylesheet';
link.href = 'styles.css';

var stored = localStorage.getItem(link.href);

if (stored) {
  // retrieve stored rules
  var style = document.createElement('style');

  style.textContent = stored;

  document.head.appendChild(style);
} else {
  // nothing stored, load stylesheet
  link.onload = function() {
    this.onload = null;

    var rules = this.sheet.cssRules;
    var ssContent = '';

    for (var i = 0, len = rules.length; i < len; i++) {
      ssContent += rules[i].cssText;
    }

    localStorage.setItem(this.href, ssContent);
  };

  document.head.appendChild(link);
}
```

Does this actually work? You can check it out [in this sample page](https://jeremenichelli.github.io/store-css/test).


## Testing the approach against caching

The next step was to do a profile and see if it was a truly advantage to apply this in a site instead of relying on HTTP caching. The short answer is **no**.

Long answer, both profiles got really similar metrics. The one using this small engineering got better **start time** at render and **speed index**, probably because stylesheets are being loaded asynchronously, but when the view was repeated caching was a little faster than storage.

One of the main reasons why **cache** is faster &mdash; its request is done in parallel while the script needed to recover the CSS rules blocks rendering while it executes.

- *Using local storage: <a href="http://www.webpagetest.org/result/160315_DA_1AM8/" target="_blank">http://www.webpagetest.org/result/160315_DA_1AM8/</a>*
- *Using browser cache: <a href="http://www.webpagetest.org/result/160315_00_1AN4/" target="_blank">http://www.webpagetest.org/result/160315_00_1AN4/</a>*

Those are links to each result in case you want to see all the numbers and graphics around them.


## Wrap-up

Even when you are not sure if what you are doing will work, or there's another techonology or library that solves the same riddle, experimenting will get you through a learning path that is awesome to walk. Do it!

This approach lives in its own [repository](https://github.com/jeremenichelli/store-css) in case you want to check its final version, covering a lot of edge cases and variants.

The veredict is that *caching beats web storage*, but loading our stylesheets asynchornously is a proven benefit so I encourage you to use [loadCSS by Filament Group](https://github.com/filamentgroup/loadCSS) that takes care of that.
