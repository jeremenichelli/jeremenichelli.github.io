---
title: A recipe for CSS preprocessors and web&nbsp;components
resume: While writing web components one of the biggest tradeoffs I've encounter was giving away the experience brought by CSS modules.
---

_This article assumes a basic knowledge on webpack configs._


## CSS modules, explained

The main reason why CSS modules exist is to achieve encapsulation by creating unique references for class names.

These references are replaced at build time in the stylesheet while having access to them as object keys on the JavaScript side.

A basic CSS modules setup is composed first by a **style file** with local references.

```css
/* title.css */

.title {
  color: #2196f3;
  font-size: 2em;
}

.title .initial {
  color: #101010;
}
```

A **script** importing the styles and using the references.

```js
import styles from './title.css';

// styles.locals -> { title: 'dsa567zh', initial: 'za78hf1o' }

document.body.innerHTML = `
  <h2 class="${ styles.locals.title }">
    <span class="${ styles.locals.initial }">L</span>orem ipsum
  </h2>
`;
```

And the last piece of this setup is a tool to process these files, **webpack** has a really straight forward loaders config for CSS modules.

```js
module.exports = {
  ...

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { modules: true } }
        ]
      }
    ]
  }
}
```

The `css-loader` detects we are importing a `.css` file and parses the result as a string, in the `options` we enable CSS modules to generate the references object.

Later the `style-loader` will take the parsed string and inject it into a style tag in the browser when our bundle runs.

But what if you need a preprocessor?

```less
.title {
  color: #2196f3;
  font-size: 2em;

  .initial {
    color: #101010;
  }
}
```

Adding a preprocessor to the mix is as simple as concatenating a new loader.

```
{
  test: /\.less$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader',
      options: { modules: true }
    },
    { loader: 'less-loader' },
  ]
}
```

This approach was created to help mantain CSS at a big scale by avoiding collisions. The good news is that **shadow DOM** already solves this need by bringing DOM and styles encapsulation to browsers and custom elements.

```js
class MovieTitle extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      </style>
        .title {
          color: #2196f3;
          font-size: 2em;
        }

        .title .initial {
          color: #101010;
        }
      <style>

      <h2 class="title">
        <span class="initial">L</span>orem ipsum
      </h2>
    `;
  }
}
```

The bad news is we are back at writing plain CSS into a string inside a JavaScript file without pre or post processing capabilities, a clear downgrade to our previous experience.


## The recipe

By inspecting the `styles` object imported in the script we will see it not only contains the `locals` property but also a `toString` function.

This method will return the resulting styles as a string.

```js
import styles from './title.less';

// styles.toString -> f()

class MovieTitle extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      </style>${ styles.toString() }<style>

      <h2 class="${ styles.locals.title }">
        <span class="${ styles.locals.initial }">L</span>orem ipsum
      </h2>
    `;
  }
}
```

With this change we are injecting the styles on our own, so there's actually no need for a `style-loader`.

```
{
  test: /\.less$/,
  use: [
    { loader: 'css-loader', options: { modules: true } },
    { loader: 'less-loader' },
  ]
}
```

In fact, if we keep the consistency between the class names the `modules` option could also be disabled. _Remember that shadow DOM is already giving us the scoping we needed._

```js
this.shadowRoot.innerHTML = `
  </style>${ styles.toString() }<style>

  <h2 class="title">
    <span class="initial">L</span>orem ipsum
  </h2>
`;
```

The last piece of improvement is adding source maps on development, this is super helpful while debugging styles to know where they are coming from.

```
{
  test: /\.less$/,
  use: [
    {
      loader: 'css-loader',
      options: {
        sourceMap: process.env.NODE_ENV === 'development'
      }
    },
    { loader: 'less-loader' },
  ]
}
```

We could go further and enable the **minimize** option in the `css-loader` to make our template strings shorter in production or add the `postcss-loader` to autoprefix or optimize deeper the styles.

_This approach speeded up the migration from an application built in a framework to web components, you can check it working in [this repository](https://github.com/jeremenichelli/movies-web-components)._
