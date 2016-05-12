---
layout: default
title: Font loading strategy for static generated sites
resume: The lack of a progressive approach on font loading and styles can hide your content for a critical amount of time causing a negative experience for the user.
---

While we know a lot about [how to properly load web fonts][1] thanks to the reasearch and work of other developers, I've noticed some caveats when bringing these best practices to static generated sites.


## Observing web fonts

Assigning a font family that's not ready yet to a site makes the text invisible in some browsers and causes FOIT *(Flash of Invisible Text)* in others. The best solution is to add a library which detects when the font is actually ready for use and provide a fallback family in the mean time.

First, set the styles to switch the font family only when a special class is present on top of our document.

```css
body {
    font-family: sans-serif;
}

.fonts-loaded body {
    font-family: 'Roboto', sans-serif;   
}
```

Now, we need to add that class when the font's ready. In this example I'm going to use [Bram Stein's Font Face Observer][2] library, but there are some others that you might want to checkout.

```js
var robotoFamily = new FontFaceObserver('Roboto');

robotoFamily
    .load()
    .then(function() {
        document.documentElement.classList.add('fonts-loaded');
    });
```

With this simple set of lines we can move any project to a better font loading strategy.

*Remember you will still need to include a stylesheet that contains the font face rules in the page.*


### Putting some dynamic on static

As any other resources, web fonts are cached for future use so it would be good to *leave a mark* when we load the font for the first time so we can quickly enable it on consecutive page views.

When pages are generated dynamically this can be achieved by placing **cookies** and later detect their presence with sever side code like **php** and return a document with the class already added.

Of course this is not possible in static sites since the server already holds the final state of the document. An alternative is [sessionStorage][3].

```js
if (sessionStorage.getItem('fonts-loaded')) {
    // fonts cached, add class to document
    document.documentElement.classList.add('fonts-loaded');
} else {
    var robotoFamily = new FontFaceObserver('Roboto');

    robotoFamily
        .load()
        .then(function() {
            document.documentElement.classList.add('fonts-loaded');
            // set mark on storage for future page views
            sessionStorage.setItem('fonts-loaded', true);
        });
}
```

This way the user will not see the text *switching* from one font family to the desired one on every page load.


## The critical rendering path paradigm

To actually get rid of the *text switching issue*, the solution from above should be inlined in the head of the page. 

The problem is that putting a big font event library in the head of the page will have a negative impact in loading times and that's a step backwards on our *content first* strategy.

One way to solve this is to move the font observing logic to a different JavaScript file and conditionally loading it when the font is not cached using [loadJS function by Filament Group][4], which is really light weight.

The following code should be placed inside the head including the previously mentioned **loadJS** library.

```js
/* include loadJS library */

if (sessionStorage.getItem('fonts-loaded')) {
    // fonts cached, add class to document
    document.documentElement.classList.add('fonts-loaded');
} else {
    // load script with font observing logic
    loadJS('/scripts/font.js');
}
```

The **font.js** file will look similar to this.

```js
/* include Font Face Observer library */

var robotoFamily = new FontFaceObserver('Roboto');

robotoFamily
    .load()
    .then(function() {
        document.documentElement.classList.add('fonts-loaded');
        // set mark on storage for future page views
        sessionStorage.setItem('fonts-loaded', true);
    });
```

Users will only experiment a *flick* in the font style on the first page view. You can check how this works on this [demo page][5] and the resulting code in its [repository][6].


## TL;DR

It's important to have a *strategy* when using web fonts to prevent invisible text in some browsers.

For static generated sites this can be done loading a script which observes when the font is ready, toggling a class on the document and set a flag using *sessionStorage* for future visits.


[1]: https://www.filamentgroup.com/lab/font-events.html
[2]: https://github.com/bramstein/fontfaceobserver
[3]: https://developer.mozilla.org/es/docs/Web/API/Window/sessionStorage
[4]: https://github.com/filamentgroup/loadJS
[5]: http://jeremenichelli.github.io/font-strategy-static/
[6]: http://github.com/jeremenichelli/font-strategy-static/