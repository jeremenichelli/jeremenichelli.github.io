---
layout: default
title: Building a component based app with Polymer
resume: Developers have been trying to find a solution to architecture on complex web applications. The most recent answer to that are components, divide the interface in smaller and autonomous blocks to conquer maintainability and scalability.
---

_This writing belongs to a serie of articles about using components with different frameworks and libraries. Stay tuned for future posts about this topic._

In this case I will go through my thoughts and feelings on developing components using [Polymer][polymer], a library written by Google developers built on top of native web technologies.


## Introduction to Polymer

Instead of redefining how views should render or being heavily tied to complex data flow concepts, Polymer simply acts as a wrapper for modern and native web techonologies.

These technologies are **HTML imports** to modularize the project, **web components** to create reusable elements, **template** tags and **Shadow DOM** for render trees and styles encapsulation.


### HTML Imports

As its name implies, this feature allows you to request HTML content from another file which can contain any markup, even _style_ or _script_ tags.

This comes handy since web components will probably need both.

```html
<link rel="import" href="/sample-component.html">
```

To import an **.html** file you include a **link** tag referencing the source and setting the value _import_ in the **rel** attribute.


### Custom elements

With the coming of a new era for user interfaces, the web needed a way to natively expand the features of the elements already defined.

This is not hard to achieve extending the **HTMLElement** class, here shown with the syntax introduced for ES2015.

```js
class GitHubLink extends HTMLElement {
  constructor() {
    super();
  }
  createdCallback() {
    this._createRoot();
  }
  attachedCallback() {
    let a = document.createElement('a');
    a.innerHTML = 'GitHub profile';
    a.href= 'https://github.com/jeremenichelli';

    this.root.appendChild(a);

  }
  _createRoot() {
    this.root = this.createShadowRoot();
  }
}

document.registerElement('github-link', GitHubLink);
```

[See it in action &raquo;](https://jsfiddle.net/8Lrm8dzh/)

When extending native elements prototype, some life cycle functions become available like the **createdCallback** and **attachedCallback** to run some code at specific moments.

This way we generate a root using **Shadow DOM** which can be filled by appending elements, using _innerHTML_ or cloning a template tag.

Later, we need to register the element in order to be able to place it in a page or another custom web element.

To know more about all the technologies mentioned previously I suggest going through documentation and articles present in the [official web components site](http://webcomponents.org/).

Of course these new features are not present in all browsers and they don't cover all the necessities of a modern web app. The mission of Polymer is to take advantage of all this native stuff while providing encapsulation, properties and easier data handling.


## Writing components

To start, we need to create a new **.html** file and import the Polymer library which will provide methods and built-in tags to enpower our development around components.

The one you're going to use more is the `<dom-module>` tag, inside of which we place a template tag that will encapsulate the render tree and the styles of our element, followed by a script tag that will initialize and configure it.

```js
<link rel="import" href="path/to/polymer.html">

<dom-module is="github-link">
  <template>
    <style>
      :host {
        font-family: monospace;
        font-size: 14px;
      }
    </style>

    <a href="https://github.com/jeremenichelli">
      <content></content>
    </a>
  </template>

  <script>
    Polymer({
      is: 'github-link'
    });
  </script>
</dom-module>
```

[See it in action &raquo;](https://jsfiddle.net/jeremenichelli/nvd4t92h/)

The element's name must match in the `<dom-module>` tag and the Polymer function call for the [is](https://www.w3.org/TR/custom-elements/#custom-elements-customized-builtin-example) attribute and property respectively.

Also the name must contain a _hyphen_, a web components gotcha.

`<content>` is also new though it actually belongs to the web components standard and not Polymer. This indicates where the content between our custom element tags will be rendered.

It's pretty obvious where the text should go in the previous example, but it won't be for more complex views.

Another useful feature available is the `dom-repeat` extension that allows you to pass a collection and render multiple elements.

```html
<link rel="import" href="path/to/polymer.html">

<dom-module is="link-list">
  <template>
    <template is="dom-repeat" items="[[ links ]]">
      <a href="[[ item ]]">[[ item ]]</a>
    </template>
  </template>

  <script>
    Polymer({
      is: 'link-list',
				ready: function() {
					this.links = [
					  'https://google.com',
					  'https://facebook.com'
					];
				}
    });
  </script>
</dom-module>
```

In the example above I'm using `ready`, one of the lifecycle callbacks provided by the library. They are well documented if you want to [know them more deeply](https://www.polymer-project.org/1.0/docs/devguide/registering-elements#lifecycle-callbacks).


### Properties

Being able to pass data to components is what makes them dynamic instead of immutable pieces of text and nodes.

When we create a new element with Polymer, properties are declared in its object descriptor and there are a bunch of options to modify their behavior.

```js
<link rel="import" href="path/to/polymer.html">

<dom-module is="github-link">
  <template>
    <a href="https://github.com/[[ user ]]">
      [[ user ]] on GitHub
    </a>
  </template>

  <script>
    Polymer({
      is: 'github-link',
      properties: {
        user: {
          type: String,
          value: ''
        }
      }
    });
  </script>
</dom-module>
```

[See it in action &raquo;](https://jsfiddle.net/jeremenichelli/fdg4mwez/)

Properties are accessible in the view by enclosing them with square brackets.

You can define a default `value` or set `readOnly` to true and prevent overrides.


#### Attributes and properties

When manipulating vanilla attributes you need to add a `$` sign after it.

Here we are placing a `hidden` attribute to the link when no user is provided.

```js
<link rel="import" href="path/to/polymer.html">

<dom-module is="github-link">
  <template>
    <a href="https://github.com/[[ user ]]" hidden$="[[ !user ]]">
      [[ user ]] on GitHub
    </a>
  </template>

  <script>
    Polymer({
      is: 'github-link',
      properties: {
        user: {
          type: String,
          value: ''
        }
      }
    });
  </script>
</dom-module>
```

Remember that with Polymer, we are working with actual web elements and not an abstraction like JSX, where _props_ and attributes are treated differently when the view is compiled.


#### Computed properties

Popular libraries allow you to put complex JavaScript expressions on their bindings.

In Polymer when using `[[ ]]`, single operators can be used and object properties can be accessed but for heavier logic you will need **computed** values.

```js
<link rel="import" href="path/to/polymer.html">

<dom-module is="github-link">
  <template>
    <a href="https://github.com/[[ user ]]" hidden$="[[ !user ]]">
      [[ fullName ]] on GitHub
    </a>
  </template>

  <script>
    Polymer({
      is: 'github-link',
      properties: {
        user: {
          type: String,
          value: ''
        },
        firstName: String,
        lastName: String,
        fullName {
          type: String,
          computed: '_computeFullName(first, last)'
        }
      },
      _computeFullName: function(first, last) {
        return first + ' ' + last;
      }
    });
  </script>
</dom-module>
```

[See it in action &raquo;](https://jsfiddle.net/jeremenichelli/kfz4pbqn/)

To define a computed property, add it with a **computed** key referencing a method and including the properties that will trigger a value change in the arguments.

Polymer also provides [observers](https://www.polymer-project.org/1.0/docs/devguide/properties#change-callbacks) which also work as a solution for this cases.


#### Two way data binding

Most frameworks and libraries embrace a one way flow for data. This means only hosts can pass information to their children components.

In Polymer both directions can be achieved. The _parent to child_ communication shown above and the _child to parent_, easily configured by changing the square brackets for curly braces and adding a `notify` option in the child's property.

```js
// parent configuration
Polymer({
  is: 'parent-component'
  properties: {
    isLoading: {
      type: Boolean
    }
  }
});

// child configuration
Polymer({
  is: 'child-component'
  properties: {
    isLoading: {
      type: Boolean,
      notify: true
    }
  }
});
```

This example only shows the scripting part, inside the template for the parent where we place the child component we need to pass the property.

```html
<parent-component>
  <child-component is-loading="{% raw %}{{ isLoading }}{% endraw %}"></child-component>
</parent-component>
```

If you use curly braces but `notify` is not set, this will work as a one way binding.

This means you could always use curly braces, but is recommended to explicitly place them to indicate two way data flows and give a hint for developers who are reading the code.

Notice that inside the scripts and binding expresions properties are in camel case but when placed as attributes kebab case is used.


### Events

Any function present in the descriptor object can be bound to an event inside the component's view by adding an attributes.

```html
<link rel="import" href="path/to/polymer.html">

<dom-module id="search-box">
  <template>
    <form action="?" on-submit="_onSubmit">
      <input type="text" on-input="_handleChange"/>
      <button type="submit">Search</button>
    </form>
  </template>

  <script>
    Polymer({
      is: 'search-box',
      properties: {
        title: {
          type: String,
          value: ''
        }
      },
      _handleChange: function(e) {
        this.title = e.target.value;
      },
      _onSubmit: function(e) {
        // do stuff...
      }
    });
  </script>
</dom-module>
```

it's good to mention that the library doesn't come with a _model_ binding for form elements so you have to manually update the property when changes occur.

Also, instead of `on-click` is recommended to use `on-tap`, a helper event which comes built in and will eliminate the known click delay for touch devices.


### Styles

Not only Polymer encourages you to use plain CSS and its latest features like [variables](https://www.polymer-project.org/1.0/docs/devguide/styling#custom-css-properties), it will also force you since there's absolute not documentation about integrating preprocessors or other tools to its work flow.

To me this is definitely a caveat for two reasons.

Reason one, you might have your application already written and you will need to migrate all your preprocessor syntax to CSS, something you probably had automated before.

Reason two, latest features of CSS are not there yet for today's needs. For example I had a prototyped version of my application using LESS for styling, not only I had to migrate syntax but also found out that CSS variables don't work for media queries values. By changing this my code became less maintainable.

Like it or not, for complex cases preprocessor present more advantages than drawbacks and not having a clear and clean way to incorporate it to a Polymer app is something that would prevent me from choosing it for a real project.

On the other hand, encapsulation works great since it uses Shadow DOM and special classes so styles don't affect other elements, no need for external modules or approaches. More than welcome.


### Routing

Following the _there's an element for that_ slogan, routing is resolved with [a component](https://github.com/PolymerElements/app-route) developed by the Polymer team.

You simply place special elements in you main component which will expose properties you can use to toggle views.

```html
<app-location route="{{ route }}"></app-location>

<!-- this app-route manages the top-level routes -->
<app-route
  route="{{ route }}"
  pattern="/:view"
  data="{{ routeData }}"
  tail="{{ subRoute }}"></app-route>

<app-route
  route="{{ route }}"
  pattern="/"
  active="{{ mainActive }}">
</app-route>

<app-route
  route="{{ route }}"
  pattern="/movie/:id"
  active="{{ movieActive }}">
</app-route>
```

The `app-location` element simply exposes the current route so it is available for other related components.

Then `app-route` components can be placed to express reachable locations inside your application and provide an active two way handler you can later use.

Not only this is a little bit confusing, but it is also buggy. In addition to this, the only thing that this does is provide a way to hide views, something good when you have a couple of views but definitely not enough when you want to animate view changes or when you have lots of them and it could be preferible to destroy unused ones.


## Ecosystem

In the 2016 Google I/O, the [Polymer Toolbox](https://www.polymer-project.org/1.0/toolbox/) was announced which is basically a CLI to quickly start a Polymer based project that could be a component or an entire application.

It comes with testing, serving and even different types of builds, one that creates a single bundle and other which takes more advantage of the HTTP/2 standard.

This is super helpful, but totally lacks of versatility. What if I want to write my code using ES2015 but wanted transpiled for older browsers I need to cover? How about style preprocessors or different markup languages like Jade?

Somehow Polymer assumes you just need to cover modern browsers or that you don't take advantage of any tool available in popular front end ecosystems at all.


## Architecture

In a Polymer based application, everything is an **.html** file.

Not having a way to require external scripts was a pain for me, but you can get used to it. The thing is that I don't find confortable developing a helper script or library inside an script tag to later import it as an **.html** file.

There's an approach that didn't became popular called [IMD](https://github.com/PolymerLabs/IMD) which it is not bad but it's hard to sell when there are dozens of recipes most developers know and understand relying on bundlers and npm modules.


## Wrap-up

Polymer tries to squeeze every feature of the modern web and provides others that can be easily used and are well documented. An immediate consequence is better performance and accessibility in your project.

But the lack of versatility of its ecosystem and uncommon architecture makes it hard to choose it over other popular libraries which provide similar development experience without these caveats.

All these conclusions came up while building a [simple web app available on GitHub](https://github.com/jeremenichelli/movies/tree/master/results/polymer).

I hope Polymer team keeps working hard and improves this since it is the closest alternative to native web features.

### Update

**8 AUG 2016** &mdash; specs have been updated, `document.registerElement` has been deprecated in favor of `customElements.define` and easier extending syntax was added. I suggest reading [Eric Bidelman's article](https://developers.google.com/web/fundamentals/primers/customelement) which explains these two changes.


[polymer]: https://polymer-project.org
