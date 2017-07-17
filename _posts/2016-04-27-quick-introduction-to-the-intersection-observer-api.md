---
title: Quick introduction to the Intersection Observer&nbsp;API
resume: These last years browsers vendors have paid more attention to the riddles developers were trying to solve to implement native and more performant solutions.
---

The new **Intersection Observer API** is here as a response of developers trying to figure out the best way to detect when an element enters the viewport. Doing this is useful in a lot of cases like infinite scrolling, lazy loading images or animating content for example.


## Creating a new observer

First thing you need to do is to instance a new observer passing a **callback** function that will be executed everytime an element becomes visible and an **options** object that can alter how the observer will behave.

```js
let observer = new IntersectionObserver(onChange, {
  threshold: [ .25 ]
});

function onChange(changes) {
  // for each element that has become visible
  changes.forEach(change => {
    // add class to element
    change.target.classList.add('visible');
  }
}
```

The callback function will receive a list of all the intersections detected. Each element on that list is an object with useful information like the DOM element itself, or *target* from now on.

The options object supports a variety of configurations:

- **threshold** represents the element's area that needs to become visible to trigger the callback, in this example the function will be called only when at least a quarter of the element appears in the viewport.
- **root** is the element used as reference to determinate the target intersection, when this configuration `null` the reference is the browser top level viewport.
- **rootMargin** will allow you to shrink or grow the *box* that is being observed, its notation is the same as the style margin property we already know so its default value is `0px 0px 0px 0px`.

We're still doing nothing, so let's actually observe something.

```js
let observer = new IntersectionObserver(onChange);

// start observing an element
observer.observe(document.querySelector('.hidden'));

function onChange(changes) {
  changes.forEach(change => {
    change.target.classList.remove('hidden');
  }
}
```

Passing a node to the **observe** method will add it to the Intersection Observer's list of interest.

You can stop watching an element using the **unobserve** method.

```js
let observer = new IntersectionObserver(onChange);

observer.observe(document.querySelector('.hidden'));

function onChange(changes) {
  changes.forEach(change => {
    change.target.classList.remove('hidden');

    // stop observing the current target
    observer.unobserve(change.target);
  }
}
```

When you don't need the observer anymore you can **disconnect** it.

```js
let observer = new IntersectionObserver(onChange);

observer.observe(document.querySelector('.hidden'));

function onChange(changes) {
  changes.forEach(change => {
    change.target.classList.remove('hidden');
    observer.unobserve(change.target);

    // thank you, we don't need you anymore
    observer.disconnect();
  }
}
```


This API also comes with a `takeRecords` method to trigger the observe action at any time.


### Lazy loading images in the future

To show an actual use case let's do some lazy loading, a practice useful to improve the initial rendering time of a page.

```js
// create observer
let observer = new IntersectionObserver(onChange);

function onChange(changes) {
  changes.forEach(change => {
    // take image url from `data-src` attribute
    change.target.src = change.target.dataset.src;

    // stop observing the current target
    observer.unobserve(change.target);
  }
}

// convert node list to array
const imgs = [ ...document.querySelectorAll('.lazy') ];

// observe each image
imgs.forEach(img => observer.observe(img));
```

Taking advantage of this native API avoiding scroll handlers will improve performance during navigation, making intersection observers a great addition.


## Wrap-up

Since this is super new in the web world it's not available in any browser yet. At the moment it could possibily be shipped with Chrome 51.

In the mean time you can grab [this nice polyfill][1] written by Surma Das from Google or check it out in [Chrome Canary][2]. Want to see it in action? Check out this [living example][3] by Wilson Page.

To know more I suggest reading the [explainer][4] present in GitHub's API sketch.

[1]: https://github.com/surma-dump/IntersectionObserver/blob/polyfill/polyfill/intersectionobserver-polyfill.js
[2]: https://www.google.es/chrome/browser/canary.html
[3]: http://wilsonpage.github.io/in-sixty/intersection-observer/
[4]: https://github.com/WICG/IntersectionObserver/blob/gh-pages/explainer.md
