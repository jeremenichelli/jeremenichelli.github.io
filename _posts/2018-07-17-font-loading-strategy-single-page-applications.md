---
title: Font loading strategy for single page applications
resume: Web fonts bring a sense of identity to our projects and have become a crucial asset of product design nowadays, but they can delay content displaying in web applications, specially for slow connections.
---

With no effective font loading strategy, users will experiment what's call FOIT _(Flash of Invisible Text)_ as the font files are downloading.

Instead it's preferable to go for FOUT _(Flash of Unstyled Text)_, users will see content sooner with a font from the system and switch to the web font later.

A while ago I wrote about how to properly [load a web font in static sites][1] with a recipe which included a deferred _font bundle_, font observation to switch when fonts are usable, and a combination of stylesheet injection with web storage for future visits.

As a follow up, this article will explain that strategy adapted to web applications architecture and stack.

## Providing a fallback font

Like any lazy loading strategy for fonts, the first thing we need to do is to show a fallback family while we wait for web fonts to be usable.

In the CSS of your project add a default system font and another rule with a class to switch to the web one.

```css
/* system fonts */
body {
  font-family: Georgia, serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: Arial, serif;
}

/* web fonts */
.merriweather-ready body {
  font-family: 'Merriweather', sans-serif;
}

.roboto-ready h1, 
.roboto-ready h2, 
.roboto-ready h3, 
.roboto-ready h4, 
.roboto-ready h5, 
.roboto-ready h6 {
  font-family: 'Roboto', serif;
}
```

_How this is implemented will depend in your stack, but basically these rules should be declared globally to affect all your application._

## Generating a font bundle

webpack is one of the most popular tools to bundle web applications and it comes with a lot of useful features out of the box, like _dynamic imports_.

Every time you load a file using the `import()` method, webpack will generate a new bundle and asynchronously load it for you in the browser.

In React applications, we could do this by adding the function call in the _componentDidMount_ callback of your main component.

```js
import React from 'react';
import Title from '../Title';
import Content from '../Content';

class App extends React.Component {

  componentDidMount() {
    // import font bundle
    import('./font.js');
  }

  render() {
    return (
      <div className="App">
        <Title>
          Loading fonts on single page applications
        </Title>
        <Content/>
      <div>
    );
  }
}
```

The good thing about this is we not only avoid blocking the content with an unloaded font family, but we also don't increase our bundle size or affect loading times, independently from how complex our font strategy is.

_For further reading you can check out the [standard import definition][2] in Google's developer site and [webpack documentation][3] about its use._

### The font bundle

Inside our _font.js_ file we need to import the dependencies needed, observe the fonts and toggle the class when they are ready.

We are going to use Bram Stein's [fontfaceobserver][4] package to watch the different font stacks and [store-css][5] to load the font stylesheet.

```js
import Observer from 'fontfaceobserver';
import store from 'store-css';

// import fonts stylesheet
store.css(
  'https://fonts.googleapis.com/css?family=Merriweather|Roboto:700',
  { crossOrigin: 'anonymous' }
);

// observe body font
const bodyFont = new Observer('Merriweather', {
  weight: 400
});

bodyFont
  .load()
  .then(() => {
    document.documentElement.classList.add('merriweather-ready');
  });

// observe heading font
const headingFont = new Observer('Roboto', {
  weight: 700
});

headingFont
  .load()
  .then(() => {
    document.documentElement.classList.add('roboto-ready');
  });
```

_If you are self-hosting your font files, instead of using [store-css][5] add an `import` with the root of the stylesheet containing the font face declarations and use webpack's [css loader][6] to automatically include it in your bundle._

```js
import Observer from 'fontfaceobserver';

// import fonts stylesheet
import('./fonts.css');

// observe body font
const customFont = new Observer('Your Custom Font');

customFont
  .load()
  .then(() => {
    document.documentElement.classList.add('custom-font-ready');
  });
```

You can check out this solution working [on this repository][8].

### Web storage and reloads

As I described it in my article about [font strategies for static sites][7], it is possible to combine [store-css][5] and web storage to host and detect font declarations when a full reload is triggered in our project.

The approach and code would be identical but if your application has routing incorporated then this won't be necessary.

## Profiling and results

Testing this approach in [a simple React application][9], throttling the network to a Fast 3G connection and the CPU down to 6x slower than my laptop in Chrome devtools, the results were:

- **Without** a font loading strategy, _3250ms_ average to display meaningful text content. This means the application initial content was ready before but user needed to wait for the font some extra time.
- **With** a font loading strategy, _2300ms_ average, which is basically what it takes for the bundle to be downloaded and parsed, and the application to render the first screen since the fallback font is already available.

That's approximately and improvement of 30% in delivering content to the user, and server side rendering could even make this difference bigger.

_If you want to read more about the negative impact of not having a font loading strategy, I suggest [Monica Dinculescu's article][10] describing her experience on a 2G connection and [Zach Leatherman's metrics][11] from profiling font displaying approaches of presidential sites back in 2016._

## Wrap-up

Applying a font strategy is really easy in single page applications since we don't have to care about reloads.

We can use webpack's dynamic imports to create a separate bundle and isolate the logic there so we don't affect bundle size and loading times for our web application.

No excuses folks! Let's take advantage of the tools we have, and already using probably, and make the web better and faster for our users.

_Thanks to [Even Stensberg][12] for reviewing this article._

[1]: /2016/05/font-loading-strategy-static-generated-sites/
[2]: https://developers.google.com/web/updates/2017/11/dynamic-import
[3]: https://webpack.js.org/guides/code-splitting/#dynamic-imports
[4]: https://www.npmjs.com/package/fontfaceobserver
[5]: https://www.npmjs.com/package/store-css
[6]: https://github.com/webpack-contrib/css-loader
[7]: /2016/05/font-loading-strategy-static-generated-sites/#putting-some-dynamic-on-static
[8]: https://github.com/jeremenichelli/font-strategy-single-page-app
[9]: https://github.com/jeremenichelli/movies/tree/master/results/react
[10]: https://meowni.ca/posts/web-fonts/
[11]: https://www.zachleat.com/web/fonts/
[12]: https://twitter.com/ev1stensberg
