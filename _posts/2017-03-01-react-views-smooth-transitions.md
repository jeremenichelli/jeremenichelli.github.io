---
layout: default
title: GPU accelarated view transitions in React
resume: Achieving nice and performant animations on modern web apps can be a real challenge. Using libraries like React can require a lot CPU activity to update the DOM, not leaving enough room for smooth transitions.
---

This happened to me in a recent project with view transitions. After debugging and many tries these findings were the most _bulletproof_ solutions.

## Building our views

In general, a view looks like a regular React component with some extra lifecycle hooks to handle animations when it enters or gets unmounted.

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

Instead of [gsap](https://www.npmjs.com/package/gsap) module, I will use [gsap-promise](https://www.npmjs.com/package/gsap-promise) which wraps the original one and returns a Promise when animations are done.

For this to work, the parent component that will render `Home` and the rest of the views needs to wrap them with `TransitionGroup` components.

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


### Animating views

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

Calling **done** we indicate that the lifecycle sequence should continue.

Once we built our views and animations, how we make sure they will run smooth? We basically need to **hint** the browser which elements will require GPU acceleration, give it **time** so it can upgrade them, **animate** and when the animations are done, **remove hints** to free up resources since they are no longer needed.


## will-change

The easiest and modern way to point the browser that some element needs to be optimize for GPU is as simple as setting `will-change` to `transform`.

This is just adding previous step from animating.

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

Still, this might not _just_ work. The browsers still needs to do some processing so animating right away will have no effect.

## time

There are to paths we can take here. One is delaying our animation enough time for the browsers to run optimizations but as little as possible so users don’t notice the delay.

The second one is queuing a high priority task on the next available frame using `requestAnimationFrame`.

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
      .then(done);
  });
}
```

First problem, _solved_.


## remove hints

Accumulating optimized elements in the document can have a negative effect and make things run slower and look worse, so after we are done it’s necessary to reset the property value.

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

Done! Transitioning between views will now be optimized, except when our application first loads. Why? When trying to figure out the reason, my best guess was that after parsing a big bundle there was a lot of scripting going on, the browser might be handling lots of DOM updates, because well… we use JavaScript to write HTML now and that comes at a cost.


### The load event

In modern browsers when the `load` event is triggered, not only all main resources were fetched and parsed but busy tasks like building the render tree are also completed.

Running animations after all of that already happened sounded reasonable to me.

Placing a listener inside the component could not work since after the `load` event occurred its callback is ignored, _racing condition_.

Also, the user might access the app from different routes so it's better to have a centralized approach for this.

To achieve this keeping the code consistent, before we kicked off the application render process, I exposed a global `Promise` that got resolved when the `load` event was triggered.

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

Notice I'm storing the `Promise` object under the `self` namespace so it can be accessed by any view and it will work for any component at any time.


### Come together

This is how the final code will look when bringing all the steps and requirements together. The original one contained some cross browser checks and fallbacks.

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

If you find yourself writing this same logic repeatedly, it might be worth to build a decorator or a reusable  component containing all this logic in just one place.


## Wrap-up

Steps to optimize transitions are pretty easy: **hint** the browser, give it a little **time**, **animate** elements and **remove hints**. This should work independently from the libraries you are using to animate and to manage your views.

The main challenge will be to keep the code straight-forward and reusable.

If you want to know more about `will-change` there are two excellent articles, one from [Paul Lewis][paul-will-change] and another one from [Sara Soueidan][sara-will-change], both explaining the nature of this property.

_Thanks to [Matt DesLauriers](https://twitter.com/mattdesl) for reviewing this article._

[paul-will-change]: https://aerotwist.com/blog/bye-bye-layer-hacks/
[sara-will-change]: https://dev.opera.com/articles/css-will-change-property/
