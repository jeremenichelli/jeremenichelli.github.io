---
title: Web components for React developers
resume: After a lot of back and forth, web components are slowly making their way into browsers. But what do they really mean given the current state of development?
---

To answer this questions I moved an entire application from React to web components, a good exercise to spot the differences between both choices and how this new native feature work and **what they really solve** in an application.


## Declaration

The entry selling points of components is their declarative and reusable nature.

```js
import React from 'react';

class MovieBox extends React.Component {
  constructor() {
    super();
  }
}

export default MovieBox;
```

**React** introduced a new paradigm to define objects to be rendered as many times as we needed in our projects. Web components declaration imposes something really similar.

```js
class MovieBox extends HTMLElement {
  constructor() {
    super();
  }
}

window.customElements.define('movie-box', MovieBox);
```

_As JSX needs React components to be capitalized, custom element tag names need to contain a hypen._

The big difference here is that the custom element becomes globally available.

As long as you are including its declaration in your bundle you can instantiate using the `<movie-box>` tag or creating an element via `document.createElement` to later inject it in the document.

Explicitly using `export` in a module that contains a custom element definition isn't necessary but it might be useful for testing purposes or extending the class to create a new type of component from it.


## Lifecycle callbacks

In all frameworks we have some combination of callbacks that fire at a certain moment of a component's life.

```js
class MovieBox extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() { }

  disconnectedCallback() { }

  adoptedCallback() { }

  attributeChangedCallback() { }
}
```

Quick descroption of all these four methods if you are coming from **React** or similar libraries, `connectedCallback` equals to `componentDidMount` and `disconnectedCallback` equals to `componentWillUnmount`.

`adoptedCallback` is fired when the component is moved to a new document, something that I can't imagine happening too often.

The last one, `attributeChangedCallback`, fires whenever an _observed attribute_ has changed, something that I'm going to explain further in this article.


## From render to shadow DOM

**React** pushed a lot of tools into the spotlight like **JSX** and transpiling. Though this arised some controversy, truth is they really improved the developer experience when expressing a component's content.

Without both, using `React.createElement` interface would be mandatory, and to be honest, messy in complex situations.

```js
class MovieBox extends React.Component {
  render() {
    return (
      <div className="movie__box">
        <h2 className="title">{ this.props.title }</h2>
      </div>
    );
  }
}
```

In custom elements, we declare the template of our component with **shadow DOM**. Switching back to HTML means we lose that _reactivity_ that stateful React components gave us.

To better understand what **shadow DOM** is, imagine DOM elements as you know them as _light DOM_, or elements that can be altered by any known DOM API.

On the other hand, **shadow DOM** can only be accessed and styled inside of its host element, giving us native encapsulation.

```js
class MovieBox extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <div class="movie__box">
        <h2 class="title">${ this.getAttribute('title') }</h2>
      </div>
    `;
  }
}
```

By calling `this.attachShadow()` we create a shadow root in the element, we can insert markup and styles making sure they won't _leak_ outside the component.

Since there is no such a thing as _props_ in custom elements, we use attributes to inject data.

### The template tag

The issue with this approach is we trigger HTML parsing for each element that gets instantiated. To avoid this we can create a template tag, clone its content and append it to the shadow root.

```js
const template = document.createElement('template');

template.innerHTML = `
  <div class="movie__box">
    <h2 class="title"></h2>
  </div>
`;

class MovieBox extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
```

We are no paying the parsing cost only once, no matter how many instances of the element we put in the document.

This improvement brings a new issue though, now we aren't able to take advantage of template strings to pour data into components.

```js
constructor() {
  super();
  this.attachShadow({ mode: 'open' });
  this.shadowRoot.appendChild(template.content.cloneNode(true));
}

connectedCallback() {
  const titleElement = this.shadowRoot.querySelector('.title');
  titleElement.textContent = this.getAttribute('title');
}
```

_DOM manipulation is recommended once the element has connected._

It's inevitable to go back to DOM scraping, which is not particularly a bad thing, but something that will require a lot of advocating to standarize inside a team.


## The host

As I was translating components written in React to custom elements I noticed I was creating unnecesary nodes. When we extend the `HTMLElement` we already have a tag, so try to avoid wrappers.

```js
const template = document.createElement('template');

template.innerHTML = `<h2 class="title"></h2>`;
```

The tree inside the component will be:

```html
<movie-box title="Zootopia">
  <!-- shadow dom -->
  <h2 class="title">Zootopia</h2>
</movie-box>
```

Styles that were affecting the `.movie__box` selector can be moved to `:host` will apply the root tag of our component.

```js
const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: block;
      padding: 1em;
    }

    .title {
      color: #101010;
    }
  </style>
  <h2 class="title"></h2>
`;
```


## DOM manipulation and refs

Moving to web components means going back to DOM manipulation, something that hardly occurs when working with frameworks and one of the reasons why web applications built with them scale up quickly and easier.

If you know well the basic DOM APIs and how they work it's not that big deal to be honest, but I did really missed some features, like **refs**.

```js
const template = document.createElement('template');

template.innerHTML = `
  <div class="movie__box">
    <h2 class="title" ref="title"></h2>
  </div>
`;

class MovieBox extends HTMLElement {
  constructor() { ... }

  connectedCallback() {
    this.refs.title.textContent = this.getAttribute('title');
  }
}
```

If this was possible, it will simplify a lot data injection and mutations on components with a high complexity.


### A homebaked solution fo refs

Bringing this feature to web components is possible by selecting all elements with a `ref` attribute and save them into an object.

```js
function collectRefs() {
  const refsArray = [ ...this.shadowRoot.querySelectorAll('[ref]') ];

  if (refsArray.length > 0) {
    this.refs = {};

    refsArray.map(el => {
      this.refs[ el.getAttribute('ref') ] = el;
      el.removeAttribute('ref');
    });
  }
}
```

After looping over the references we can even remove the attribute. Of course, we still need to manually call the method in the component's lifecycle.

```js
connectedCallback() {
  // collect refs
  collectRefs.call(this);

  // use them!
  this.refs.title.textContent = this.getAttribute('title');
}
```

This solution works and speeded up a lot the writing transition to me, but it's not still what refs are for frameworks since it doesn't support mutations inside the shadow DOM.

For example, if we remove the `title` ref element in the previous code and then re-insert it, an error would be thrown when referencing to `this.refs.title` since the original node doesn't exist anymore.


## From children to slots

On React components we use `{ this.props.children }` to render child nodes.

Custom elements and shadow DOM contain a similar, and probably more powerful interface, to place content inside web components.

```js
const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      background-color: #fefefe;
      display: block;
    }
  </style>
`;

class AppCard extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define('app-card', AppCard);
```

Nodes inside of this custom element won't actually get rendered at all. To allow this, just as you would use the `children` prop, you can place a `<slot>` in the shadow root.

```js
template.innerHTML = `
  <style>
    :host {
      background-color: #fefefe;
      display: block;
    }
  </style>

  <slot></slot>
`;
```

But `<slot>` tags are not just content placeholders, they can be named to get a better control of the place where the children nodes will be.

If you want to know more about this I recommend checking [Eric Bidelman's explanation about named slots](https://developers.google.com/web/fundamentals/web-components/shadowdom#slots) in shadow DOM.


## From props to attributes, from reactive data to setters

Another mind shifting concept of component based apps is data flow, pouring down properties to give shape and behavior to the interface.

This is possible in web components through attributes.

In previous examples I showed how we got the `title` attribute to populate text content in a component. But what happens if that attributes changes after the element was mounted?

To cover this situation custom elements support observed attributes and a callback to run specific operations.

```js
class MovieBox extends HTMLElement {
  constructor() { ... }

  static get observedAttributes() {
    return [ 'title' ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title') {
      this.refs.title.textContent = newValue;
    }
  }
}
```

`attributeChangedCallback` runs only when an attribute returned by the `observedAttributes` getter changes.

The **name** of the attribute, its **old value** and the **new one** are provided.

We can also use getters and setters to synchronize attributes with properties for any component instance, compute the data or do more complex mutations.

```js
get hollow() {
  return this.hasAttribute('hollow');
}

set hollow(value) {
  // pass the value to boolean
  const isHollow = Boolean(value);

  if (isHollow === true) {
    this.setAttribute('hollow', '');
  } else {
    this.removeAttribute('hollow');
  }
}
```

This behavior is not mandatory, but useful for styling or visual reference.

For example when you set the `disabled` property to `true` to a button you can see that reflected in the element, this doesn't happen with a video element and the `muted` attribute.

For styles based on **boolean attributes**, we can use the `:host([attribute])` notation to place specific styles.

```html
<style>
  :host {
    background-color: #fefefe;
    display: block;
  }

  :host([hollow]) {
    background-color: transparent;
  }
</style>
```

If attributes are worth being listened to or being reflected to properties is something that will depend on the nature of it.

For attributes that help build urls for XHR calls I wouldn't, because if somehow we accidentally modify them we will trigger unnecessary network calls.

For properties that change constantly it wouldn't be optimal to be synced with an atribute, like the current time of a video element.

**Is data reactivy possible in web components?** Yes, though it will involve heavy coding around properties, attributes and a lot of careful DOM manipulation when necessary.


## Final thoughts

Several discussion occured around what web components mean today and whether they came here to replace current libraries.

To achieve pretty basic mutations on small components, children references and data manipulation there's a lot of heavy lifting that really compromises the developer experience.

And it's a big deal, since developer experience is one of the reasons why React or Vue are widely used in production.

> Unfortunately the developer experience of building an application with web components today is quite painful
>
> - Sam Saccone

Though components are meant to act as minimal functional pieces in our applications, at some higher level our codebase will need a component to gather all of these together and make them interact.

This could scalate to tons of event listeners and property mutations that will be hard to track down as an application grows.


### The future

Web components do solve part of the current component situation in web development. Having a native way to achieve encapsulation and templating operating at a low level in the browser will be hard to beat on performance.

As libraries get better at [working with custom elements](https://custom-elements-everywhere.com/), the interoperatibility will be a big win for the platform, a company could build one component that teams using Angular or Vue could make use of.

> JavaScript frameworks as we know them are never going to deliver interop
>
> - Alex Russell

In the same way I've built a _patch_ to use refs in custom elements, other developers will find common and solid solutions for necessities not natively covered,  and as that happens frameworks will have to do less.

I'm really excited about what things web components will allow in the platform.

_These thoughs came from building an entire React app in web components, which is open sourced and you can check out here: [https://github.com/jeremenichelli/movies-web-components](https://github.com/jeremenichelli/movies-web-components)_


### Other resources
 - [Web components: the long game](https://infrequently.org/2017/10/web-components-the-long-game/) by Alex Russell
 - Some of the techniques I showed here are also covered in Rob Dodson video on [how to build a toggle button](https://www.youtube.com/watch?v=16gvkPfPIx4&t=416s)
 - Great advices from Monica Dinculescu, [practical lessons from a year of building web components](https://www.youtube.com/watch?v=zfQoleQEa4w&t=1519s)
