---
title: Fast inner navigation for static sites
resume: When trying to improve a web product experience and performance we usually encounter limitations. Sometimes we are not be able to modify servers configuration, build scripts or even some parts of the code that don't belong to our scope.
---

A good example of this is a site stored in GitHub pages, where there's no much to be done about servers latency except moving to a paid solution.

In this context, I was trying to come up with something that would help navigation inside a static site to feel closer to instant view changes in single page applications.


## Resource hints

The first thing a browser receives when users open a website is an **html** file, so any type of information we can give to it about what resources are going to be needed without actually blocking document parsing will be a huge win.

> Anything we can do as the document parses (without blocking it) will be a huge win

This is where **hints** become crucial, they allow us to start connecting or fetching a resource ahead of time, but how do we do that?


### link prefetching

Apart from loading stylesheets, the `link` tag has another set of values for its `rel` attribute to indicate other network related actions over a file or URL.

Browsers will take high or low priority actions when it detects these hints, in a similar way it starts to load an image file when it finds an `img` tag.


For example, **dns-prefetch** will resolve the domain to get the resulting ip address, while **preconnect** does this plus the handshake and TLS negotiation.

```html
<link rel="preconnect" href="https://some-cloud-cdn.net/" crossorigin>
```

Both will save you some time when accessing to external services and CDNs.

When instead of a domain we have a particular resource or route that could be needed in future navigations the **prefetch** value is used, as **preload** is for resources needed in the current page.

```html
<link rel="prefetch" href="https://your-site.com/next-route.html">
```

_If you would like to read more about resource hints or see more examples this [oldie but goodie article](https://medium.com/@luisvieira_gmr/html5-prefetch-1e54f6dda15d) by Luis Vieira is highly recommended._

Since we want to improve the inner navigation in a static site, we can combine **prefetch** with a little of JavaScript to load possible upcoming routes in advanced.


## Prefetch on demand

To move forward with this idea we would need to append a `link` element everytime the user hovers an anchor.

The element to append should look like this:

```html
<link rel="prefetch" href="https://your-project.com/the-future-route">
```

First thing, let's collect all the anchors from the current page and turn them into an array to loop over them easier.

```js
const anchors = document.getElementsByTagName('a');

const anchorsArray = [].slice.call(anchors);
// yay, we can use array methods now!
```

Next, let's create a method that adds a `link` element to the document with the corresponding `href` to prefetch.

```js
const prefetchRoute = function() {
  const link = document.createElement('link');
  link.href = this.href;
  link.rel = 'prefetch';

  document.head.appendChild(link);
}
```
_Keep in mind that once we use this method in an event listener the keyword this will point to the anchor element being hovered._

Now we attach this function to all anchors' events.

```js
anchorsArray.map(anchor => {
  anchor.addEventListener('mouseover', prefetchRoute);
});
```

The interval of time between the user hovering and clicking a link might not be much, but it's enough to start ahead the connection to the resource and speed up the navigation at practically no cost.


### Refinement

For the solution to work properly we should skip anchors with external links.

```js
anchorsArray.map(anchor => {
  // only listen to hover when hosts match
  if (anchor.host === document.location.host) {
    anchor.addEventListener('mouseover', prefetchRoute);
  }
});
```

We could also remove the listener after prefetching the route.

```js
const prefetchRoute = function() {
  const link = document.createElement('link');
  link.href = this.href;
  link.rel = 'prefetch';

  document.head.appendChild(link);

  // remove listener from anchor element
  this.removeEventListener('mouseover', prefetchRoute);
}
```

This way we avoid injecting the same `link` element several times.


### What about mobile?

Since the `mouseover` event won't be dispatched in mobile devices we could also attach the `prefetchRoute` method to the `touchstart` action.

I've personally bailed on doing it because there's a chance the device is not connected to WiFi while navigating and I prefer not to silently consume users' data plan, even when they are just some kilobytes.


### What about actual single page applications?

If you are code splitting your application and using a bundler that allows named chunks [like webpack does](https://webpack.js.org/guides/code-splitting/#dynamic-imports), you can prefetch that file to fasten dynamic routes.


## Wrap-up

Even when you're in control of your server environment, using resource hints it's highly recommended. Take in count that for them to work you might need to serve your project on https.

This little trick is currently speeding up the experience in this site on desktop, so you can inspect the `head` element or check the network tab on developer tools while passing your pointer over internal links to see it in action.

_Kudos to Rich Harris from whom I stole this approach he used in [Sapper](https://sapper.svelte.technology/guide#prefetch-href-)._
