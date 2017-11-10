---
title: Quarter of a kilobyte solution for a sliding&nbsp;header
resume: In order to leave more room for content consumption, headers and navigation bars that hide when scrolling down and slide back when scrolling up became a common usability feature.
---

But is there a zero dependencies light weight solution? Well, there are plenty of them, here is my approach.


## Conquer the scroll behavior

First of all we need to know in which direction the user is scrolling, which it's not complicated, just store how much the user has gone scrolling and compare it to a previous value to see if it is greater or not.

```js
/*
 * initialize variables
 * y: current scroll position
 * direction: no value
 */
var y = window.scrollY;
var direction = null;

window.addEventListener('scroll', function() {
  direction = window.scrollY > y ? 'down' : 'up';

  if (direction === 'down') {
    // scrolling down, do something!
  }

  if (direction === 'up') {
    // scrolling up, do something!
  }

  // update scroll position
  y = window.scrollY;
});
```

This works great, we can toggle a class on our **header** and call it the day, but we can do it better.

We are executing the code inside the `if` statements on each scroll event which is unnecessary.

Since we are going to toggle our header when the user *starts* scrolling up or down, we rather detect when the scrolling the direction has changed craeting one more variable to store the last direction registered and compare it with the current one.

```js
var y = window.scrollY;
var previousDirection = null;
var direction = null;

window.addEventListener('scroll', function() {
  direction = window.scrollY > y ? 'down' : 'up';

  if (direction !== previousDirection) {
    // update direction value
    previousDirection = direction;

    if (direction === 'down') {
      // just started scrolling down, do something!
    }

    if (direction === 'up') {
      // just started scrolling up, do something!
    }
  }

  // update scroll position
  y = window.scrollY;
});
```

We can now add a class toggle on our **header** inside to the solution. It is also recommended to execute this solution once the user has scrolled a bit so the **header** is always present on the top of out site.

```js
var header = document.getElementsByTagName('header')[0];
var y = window.scrollY;
var previousDirection = null;
var direction = null;

window.addEventListener('scroll', function() {

  if (window.scrollY > 150) {
    direction = window.scrollY > y ? 'down' : 'up';

    if (direction !== previousDirection) {
      // update direction value
      previousDirection = direction;

      if (direction === 'down') {
        // hide the header
        header.classList.add('header--hidden');
      }

      if (direction === 'up') {
        // show the header again
        header.classList.remove('header--hidden');
      }
    }
  } else {
    // show the header on top
    header.classList.remove('header--hidden');
  }

  // update scroll position
  y = window.scrollY;
});
```

Those are a lot of `if` statements, we can reduce them using [the power of object literals](/2014/10/the-power-of-using-object-literals).

```js
var header = document.getElementsByTagName('header')[0];
var y = window.scrollY;
var previousDirection = null;
var direction = null;

var actions = {
  up: function() {
    header.classList.remove('header--hidden');
  },
  down: function() {
    header.classList.add('header--hidden');
  }
};

window.addEventListener('scroll', function() {

  if (window.scrollY > 150) {
    direction = window.scrollY > y ? 'down' : 'up';

    if (direction !== previousDirection) {
      // update direction value
      previousDirection = direction;

      // call to action
      actions[ direction ]();
    }
  } else {
    actions[ 'up' ]();
  }

  // update scroll position
  y = window.scrollY;
});
```

The hardest part is done, but our **header** won't move unless we write some styles for it.


### Leave the magic to CSS

Apart from setting a **fixed** position to the element, we need to make it disappear when the **header--hidden** class hits it.

```css
header {
  position: fixed;
  /* the need of setting a height on the element will
  depend on your project layout and design */
  height: 100px;
  width: 100%;
}

.header--hidden {
  display: none;
}
```

That works though it's not fancy at all. Let's use a negative translate value on the **y axis** to move the element up and a transition to animate the change.

```css
header {
  position: fixed;
  height: 100px;
  width: 100%;
  /* add a nice transition! */
  transition: transform .35s ease;
}

.header--hidden {
  transform: translate(0, -100%);
}
```

See it working in this [demostration page](https://jeremenichelli.github.io/sticky).


### The weight

**Done!** And you know what? If your code is minified and gzipped *&mdash; and it should &mdash;* this script will only weigh **242 bytes** in your project, as I promised in the heading of this article.


## Solution for the lazy ones

But you know, maybe you just want some library to help you do the trick and keep moving. Then you can include [steer](https://jeremenichelli.github.io/steer) in your project and use its API to toggle the **header** class.

```js
var header = document.getElementsByTagName('header')[0];

steer.set({
  events: false,
  up: function () {
    header.classList.remove('header--hidden');
  },
  down: function () {
    header.classList.add('header--hidden');
  }
});

window.addEventListener('scroll', function() {
  if (window.scrollY > 150) {
    steer.trigger();
  } else {
    showHeader();
  }
});
```

This script will add some legacy browser support under the hood for this approach, though you will still need a polyfill for [classList](https://github.com/eligrey/classList.js) which doesn't work in older versions of Internet Explorer.


## Wrap-up

When we see some trending interface trick we tend to search for a library to solve our problem, my suggestion will always be to give it a try and build it yourself.

If you fail at it, you can still dive into the community to look for a solution.
