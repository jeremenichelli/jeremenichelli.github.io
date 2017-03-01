---
layout: default
title: Smooth transitions for React views
resume: Today's web app development has become way too JavaScript centric and achieving nice and performant animations on modern web apps can be a real challenge.
---

This happened to me in a recent project with view transitions. Nowadays libraries like React and our code require heavy processing activity to update the DOM, not leaving enough room for smooth animations.

After debugging and many tries these findings were the most _bulletproof_ solutions.

## Basic view structure

Omitting obvious complexity this is how a generic view looks in our code base.

```js
import { Component } from 'react';
import animate from 'gsap-promise';

class Home extends Component {
  componentWillAppear(done) {
    // animate view entering...
  }
  componentWillLeave(done) {
    // animate view leaving...
  }
  render() {
    return (
      <div className="home--view">
        <h1 ref={el => this.title = el}>
          home
        </h1>
        <p ref={el => this.content = el}>
          Lorem ipsum dolor sit amet...
        </p>
      </div>
    );
  }
}
```

Instead of the generic [gsap](https://www.npmjs.com/package/gsap) module we import [gsap-promise](https://www.npmjs.com/package/gsap-promise) which is just a wrapper of the official one that returns a `Promise` when animations are done, keeping the code cleaner.

When an element is wrapped by a transition group, `componentWillAppear` and `componentWillLeave` lifecycle hooks become available.

```js
import { Component } from 'react';
import TransitionGroup from 'react-addons-transition-group';

class App extends Component {
  render() {
    return (
      <div className="app--wrapper">
        <TransitionGroup>
          { this.props.children }
        </TransitionGroup>
      </div>
    );
  }
}
```

Assuming this is where the views are rendered, we place the `children` prop inside a `TransitionGroup` component so the previously mentioned hooks get called.


### Basic animations

Let's add some moves to our view.

```js
componentWillAppear(done) {
  const duration = 1;

  animate
    .fromTo(
      [ this.title, this.content ],
      duration,
      { autoAlpha: 0, scale: .5 },
      { autoAlpha: 1, scale: 1 }
    )
    .then(done);
}

componentWillLeave(done) {
  const duration = 0.75;

  animate
    .fromTo(
      [ this.title, this.content ],
      duration,
      { autoAlpha: 1, scale: 1 },
      { autoAlpha: 0, scale: .8, onComplete: done }
    )
    .then(done);
}
```

A `done` callback is passed to indicate the lifecycle sequence should continue.


## will-change

The first thing that caught my eye was that we weren't upgrading elements so that their style updates are handle by the GPU when possible.

This not so new CSS property acts as a hint for the browser so it optimizes elements we are about to animate.

So we could easily add a step before our animation and call it the day.

```js
componentWillAppear(done) {
  const duration = 1;

  // hint the browser about optimizations
  animate.set(
    [ this.title, this.content ],
    { willChange: 'transform' }
  );

  animate
    .fromTo(
      [ this.title, this.content ],
      duration,
      { autoAlpha: 0, scale: .5 },
      { autoAlpha: 1, scale: 1 }
    )
    .then(done);
}
```

The trick here is that the browser needs some time to _upgrade_ the elements before animating, and we also need to set `will-change` back to `auto` when we are done to free resources.

If things were **that** simple it wouldn't be web development, right?

### Giving the browser time

We have two options here, delay our animation enough for the browser to run optimizations, but not too long so the user actually doesn't notice it.

The other one is queuing a high priority task on the next available frame using `requestAnimationFrame`, and I'm picking up this one.

```js
componentWillAppear(done) {
  const duration = 1;

  // hint the browser about optimizations
  animate.set(
    [ this.title, this.content ],
    { willChange: 'transform' }
  );

  // wait for next available frame
  requestAnimationFrame(() => {
    animate
      .fromTo(
        [ this.title, this.content ],
        duration,
        { autoAlpha: 0, scale: .5 },
        { autoAlpha: 1, scale: 1 }
      );
  });
}
```

First problem, _solved_.


### Freeing resources up

Accumulating optimized elements in the document can have the opposite effect and make things run slower and look worse, so after we are done we need to reset the property value, easy thing.

```js
componentWillAppear(done) {
  const duration = 1;

  // hint the browser about optimizations
  animate.set(
    [ this.title, this.content ],
    { willChange: 'transform' }
  );

  // wait for next available frame
  requestAnimationFrame(() => {
    animate
      .fromTo(
        [ this.title, this.content ],
        duration,
        { autoAlpha: 0, scale: .5 },
        { autoAlpha: 1, scale: 1 }
      )
      .then(() => {
        // set will-change back
        return animate.set(
          [ this.title, this.content ],
          { willChange: 'auto' }
        );
      })
      .then(done);
  });
}
```

Second problem, _solved_.

With these additions, transitions between views became really smooth, but when animations run after the site was loaded they lagged. **Sad face emoji**.

My guess was that after parsing a big bundle, there was a lot of scripting going on and the browser might be handling lots of DOM updates, because well... we use JavaScript to write HTML now and that comes with a cost.


## Load event

In most browsers when the `load` event is triggered, it means that all resources where fetched and parsed and the browser is done on the busy task of building the render tree.

Running animations after all of that already happened sounds reasonable.

We could add a listener inside the view's component but that will not work, since after the `load` event occurred its callback is ignored. Racing condition.

Also, the user might access the app from different routes so it's better to have a centralized approach for this.


### Promises, promises

To achieve this keeping the code consistent, and before we kicked off the application render process, I exposed a global `Promise` that got resolved when the `load` event was triggered.

```js
let appResolve;

self.appReady = new Promise(resolve => {
  // expose fulfilled state holder to outer scope
  appResolve = resolve;
});

// add event listener and trigger resolve when ready
self.addEventListener('load', appResolve);
```

If you want to understand better how this code works, I wrote an [article about it](/2016/04/patterns-for-a-promise-based-initialization/) a while ago.

Notice I'm storing the `Promise` object under the `self` namespace so it can be accessed by any view and because it is a `Promise` there is no race condition with the event itself.


## Come together

In the original code, the animation was on its own async method and some dirty checks were necessary for legacy browsers, but here is an all-in version of the approach that works in modern browsers.

```js
componentWillAppear(done) {
  const duration = 1;

  // wait til browser is done with heavy tasks
  appReady
    .then(() => {
      // hint the browser about optimizations
      animate.set(
        [ this.title, this.content ],
        { willChange: 'transform' }
      );

      // wait for next available frame
      requestAnimationFrame(() => {
        animate
        .fromTo(
          [ this.title, this.content ],
          duration,
          { autoAlpha: 0, scale: .5 },
          { autoAlpha: 1, scale: 1 }
        )
        .then(() => {
          // set will-change back
          return animate.set(
            [ this.title, this.content ],
            { willChange: 'auto' }
          );
        })
        .then(done);
      });
    });
}
```

If you find yourself writing this same logic repeatedly in several parts of a project it might be worth to build a decorator or a reusable component containing all this logic in just one place.


## Wrap-up

Steps to optimize transitions are pretty easy: **hint** the browser, give it a little **time**, **animate** elements and **remove** hints &mdash; Independently from the libraries you are using to animate and to manage your views.

The main challenge will be to keep the code straight-forward and readable.

If you want to know more about `will-change` there are two excellent articles, one from [Paul Lewis][paul-will-change] and another one from [Sara Soueidan][sara-will-change], both explaining the nature of this property.

[paul-will-change]: https://aerotwist.com/blog/bye-bye-layer-hacks/
[sara-will-change]: https://dev.opera.com/articles/css-will-change-property/
