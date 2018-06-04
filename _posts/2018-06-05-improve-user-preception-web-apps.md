---
title: Improving user perception on web applications
resume: One of the reasons why we as developers choose the single page application paradigm is to improve the experience on a product or a site, but this also exposes new challenges around the user flow.
---

An example of this, is when user is waiting for content to be lazy loaded.

Of course we want that to happen as fast as possible, but as many researches showed in the past, it's not only about bringing content fast but how users perceive these changes in the view.

> How our users perceive changes in the view is as important as optimized content delivery through network

Currently on the webpack documentation team we are rewriting the site code and infrastructure, with build times and developer experience being the main reasons.

The new version of the project will be a static site that progressively enhaces itself to a single page application, which means that you recibe an HTML content file first hand but then the rest of the documentation is lazy loaded.

_I'm not going deeper into details of this project here. If you are interested stay tuned since a more detailed article about it will come in the future._

As I wasn't satisfied with our current _Loading..._ message I decided to create a better waiting screen for our documentation routes.


## Model the content skeleton

First thing we are going to need is a skeleton of _fake_ content to show. How this skeleton looks will depend on the final state of the UI once the resources are loaded.

In this case we are expecting text so it's not complicated, but you might consider good images, avatars or data visualization placeholders for example.

What I did was to take a look at the most visited articles and see what was the average content disposition.

First important tip, don't reinvent the wheel and **reuse the UI components or elements in your projects, they already contain the space metrics and sizes**.

```js
const placeholderString = () => (
  `<div class="placeholder">
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <h2>&nbsp;</h2>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
  </div>`
)
```

Since we already have styles defined for headings and paragraphs I just listed these elements on a fashion similar to most articles' bodies.


## Create a size collection

To properly simulate content you might need different widths for your elements in addition to other styles like a background color.

```scss
.placeholder {

  h2, p {
    background-color: #f2f2f2;
  }

  &__xsmall {
    width: 35%;
  }

  &__small {
    width: 50%;
  }

  &__medium {
    width: 75%;
  }

  &__large {
    width: 85%;
  }
}
```

This way we give more real life aspect to our placeholders.

```js
const placeholderString = () => (
  `<div class="placeholder">
    <p class="placeholder__medium">&nbsp;</p>
    <p class="placeholder__large">&nbsp;</p>
    <p class="placeholder__small">&nbsp;</p>
    <h2 class="placeholder__xsmall">&nbsp;</h2>
    <p class="placeholder__large">&nbsp;</p>
    <p class="placeholder__small">&nbsp;</p>
    <p class="placeholder__medium">&nbsp;</p>
  </div>`
)
```

[See it in action](https://codepen.io/jeremenichelli/pen/LrGNZm/)

_Play with different combinations of sizes to better match your case._


## Animate the skeleton screen

To inform the user there's an action taking place on the background, like fetching content, we need to add movement to our skeleton.

We can use a pseudo element on each placeholder and translate it over the X axis, which is a common approach used by other designers in similar situations.

```scss
.placeholder {

  h2, p {
    background-color: #f2f2f2;
    overflow: hidden;
    position: relative;

    &:after {
      background: linear-gradient(to right, #f2f2f2, #fcfcfc, #f2f2f2);
      content: '';
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
    }
  }

  // ...collection of sizes
}
```

Now, we declare a css animation for them.

```scss
@keyframes placeholderAnimation {
  from {
    transform: translate3d(-100%, 0, 0);
  }
  to {
    transform: translate3d(100%, 0, 0);
  }
}
```

Finally, we add the `animation` property to the elements.

```scss
h2, p {

  &:after {
    animation: placeholderAnimation 1s infinite;
  }
}
```

[See it in action](https://codepen.io/jeremenichelli/pen/mKVPMg)


### The final result

As you can see in the link above, the footprint of the styles added is not big at all and the animation runs smooth as the placeholder content is present.

If you want to see how it looks in real life [take a look at this pull request](https://github.com/webpack/webpack.js.org/pull/2121) where the behavior was added to our `rebuild` branch.

The pull request contains two GIF sequences which expose how the user experience gets improved while waiting for dynamic content to reach the application.


## Warp-up

As a summary of this post, always try to _reuse already existing components_ and styles in your application as posible, _create a collection of different widths_ that better fits your real content and _animate_.
