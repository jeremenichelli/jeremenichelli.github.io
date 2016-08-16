---
layout: default
title: Building a component based app with Vue
resume: Developers have been trying to find a solution to architecture on complex web applications. The most recent answer to that are components, divide the interface in smaller and autonomous blocks to conquer maintainability and scalability.
---

_This writing belongs to a serie of articles about using components with different frameworks and libraries. Stay tuned for future posts about this topic._

In this case I will go through my thoughts and feelings on developing components using [Vue][vue], a young library that has gained a lot popularity in the recent time.


## Introduction to Vue

The primary goal of **Vue** is to easily create interfaces which _react_ on data changes, so when a **Vue instance** is created you need to define a template and a model.

Inside these templates you can interpolate properties with curly braces like you do in popular templating engines or use attributes.

```html
<div id="#view">
  <!-- string interpolation -->
  <h1>{% raw %}{{ name }}{% endraw %}</h1>
  <!-- binding syntax -->
  <p v-text="description"></p>
</div>
```

It could be said each instance acts as some kind of _view controller_ object.

```js
new Vue({
  el: '#view',
  data: {
    name: 'John Oliver',
    description: 'Comedian, political commentator and tv host.'
  }
});
```

Another axiom from **Vue** is to let JavaScript rule the whole thing, so you can use HTML tags just as placeholders and define everything, even the template, in your instance object.

You can also bind methods and compute properties.

```js
// HTML
<app></app>

// JavaScript
new Vue({
  el: '#view',
  template: `
    <div id="view">
      <h1>{{ fullName }}</h1>
      <button @click="showDescription">Description</button>
    </div>
  `,
  data: {
    firstName: 'John',
    lastName: 'Oliver',
    description: 'Comedian, political commentator and tv host.'
  },
  computed: {
    fullName() {
      return `${ this.firstName } ${ this.lastName }`;
    }
  },
  methods: {
    showDescription() {
      alert(this.description)
    }
  }
});
```

[See it in action &raquo;](https://jsfiddle.net/jeremenichelli/k9vatv0m/)

The library is really well documented, one of the things I like the most about it. Give the [guide][guide] a quick read which details methods, features available and also explains how it works under the hood.


## Writing components

I find its component syntax the strong selling point of the library.

Just as you create **Vue instances** you can create **Vue components** to be reused.

```js
// search form component
Vue.component('search-box', {
  template: `
    <form action="?" class="search__form" @submit="onSearch">
      <input type="text" class="search__input"
        v-model="title">
      <button type="submit"
        class="search__button"
        :disabled="searching">Search</button>
    </form>
  `,
  data() {
    return {
      title: '',
      searching: false
    }
  },
  methods: {
    onSearch() {
      const BASE_URL = 'https://www.omdbapi.com/?r=json';

      this.searching = true;

      fetch(`${ BASE_URL }&s=${ this.title }`)
        .then(response => response.json())
        .then(data => {
          this.searching = false;

          // do something with the data
        });
    }
  }
});
```

Calling the `component` method requires first a string indicating a custom tag in kekab case and a constructor object.

Inside the template you might notice `:disabled` which is just a shortcut for `v-bind:disabled` directive and the `v-model` binding, super useful to synchronize a form element value with data.

The `@` symbol is used to bind events from `methods`.

Instead of an object, `data` is a function returning one to prevent all instances from sharing the same object reference causing a undesired collisions.

Now the _search-box_ tag is available for use on other **Vue instance** template.

```js
new Vue({
  el: `#app`,
  template: `
    <h1>Search</h1>
    <h2>Movies</h2>
    <search-box></search-box>
  `
});
```

[See it in action &raquo;](https://jsfiddle.net/jeremenichelli/k4xqwto9/)


### Props

When the component's model is partially or totally present in its parent, `props` are used to pass down that information.

```js
Vue.component('result', {
  template: `
    <h3 v-text="title"></h3>
    <a :href="url">Find out more</a>
  `,
  props: [ 'title', 'url' ]
});
```

Then specify a _prop value_ with Vue's binding syntax.

```js
Vue.component('results-list', {
  template: `
    <ul>
      <li v-for="r in results">
        <result :title="r.title" :url="r.url">
      </li>
    </ul>
  `,
  data() {
    return {
      results: [
        {
          title: 'Batman Begins',
          url: 'https://www.imdb.com/title/tt0372784'
        },
        {
          title: 'The Dark Knight',
          url: 'https://www.imdb.com/title/tt0468569'
        },
        {
          title: 'The Dark Knight Rises',
          url: 'https://www.imdb.com/title/tt1345836'
        }
      ]
    };
  }
});
```

[See it in action &raquo;](https://jsfiddle.net/jeremenichelli/eoa5qhsf/)

Props are prefixed with a _colon_ because we are passing a data reference, but it should be removed when passing the value itself.


### Styles

There is still a discussion on going about extending the components philosophy to styles, probably one of the pain points of atomizing the user interface since almost all approaches forces you to mix unnatural CSS syntax with JavaScript.

New standards like HTML imports and Shadow DOM are preparing the ground for a future where native web components will be easy to develop and cross browser compatible.

In the meantime, devs are adding steps in their build processes to transform their stylesheets into [local scoped CSS][scoped-css] for pure JavaScript components.


### Routing

Vue capabilities can be extended with plugins calling the `use` method.

```js
var Vue = require('vue');
var VueRouter = require('vue-router');

Vue.use(VueRouter);
```

On our first examples calling `new Vue` meant kicking off the whole project, but when [vue-router][vue-router] comes to play you need to first create components, the views, main Vue instance and delegate that kick start to the router.

```js
// views as components
var mainView = Vue.component({
  template: `
    <p>Main view content.</p>
  `
});

var aboutView = Vue.component({
  template: `
    <p>About view content.</p>
  `
});

// main instance
var app = Vue.component({
  template: `
    <h1>Single Page Application</h1>
    <a v-link="{ path: '/' }">Home</a>
    <a v-link="{ path: '/about' }">About</a>
    <router-view></router-view>
  `
});

// create router
var router = new VueRouter({ root: '/' });

// map paths and views
router.map({
  '/': {
    component: mainView,
    name: 'main'
  },
  '/about': {
    component: aboutView,
    name: 'about'
  }
});

// kick off!
router.start(app, '#app');
```

There's no need to learn nothing special for views creation, they are _components_, the difference is they are now passed to the router to be defined as _views_ with an associated path.

A special directive, `v-link` allows anchors to navigate the app and the _router-view_ tag is the placeholder where the view's template will be mounted.

Finally, map the different paths and send to `router.start` the app instance and the selector to initialize the project.


## Ecosystem

Vue has a wider response to the styles problem with a set of tools and packages to also improve the development experience while using the framework and accelerate the ramp up for new developers.

### Single file components

The problem with templates and styles in component libraries is that you end up writing CSS or HTML inside a JavaScript file, something you can get used to but isn't the best experience.

React, for example, uses [JSX][jsx] to fix the HTML-in-JavaScript thing.

Vue's single file components is probably a bigger bet, it allows you to put everything regarding a component in one place solving a major number of decisions around architecture out of the box.

```js
<template>
  <form action="?" class="search__form" @submit="onSearch">
    <input type="text" class="search__input"
      v-model="title">
    <button type="submit"
      class="search__button"
      :disabled="searching">Search</button>
  </form>
</template>

<script>
import search from '../services/search.js';

export default {
  data() {
    return {
      title: '',
      searching: false
    }
  },
  methods: {
    onSearch() {
      search(this.title)
        .then(data => {
          this.searching = false;
          // do something with the data
        });
    }
  }
}
</script>

<style lang="less" scoped>
.search__form {
  font-size: 16px;

  button {
    background-color: orange;
    color: white;
  }
}
</style>
```

Basically a single file component consists in three parts. What it used to be a string property is now just plain HTML inside a **template** tag. In **scripts** you export the component object constructor, and you can also import other modules.

The styles' component paradigm here is solved with a **style** tag where you can write using any preprocessor passing a `lang` attribute.

Placing a `scoped` attribute causes the styles to affect the component only, similar to generating [CSS modules with Webpack loaders][css-modules].

You can later import **.vue** files to let components be used by other instances.

```js
<template>
  <h1>Movies</h1>
  <h2>Search</h2>
  <search-box></search-box>
</template>

<script>
import searchBox from 'search-box.vue';

export default {
  components: {
    searchBox
  }
}
</script>
```

Of course, the **.vue** extension is not a valid module you can import.

To transpile this to something the browser can actually render, a [loader][vue-loader] for Webpack and a [transform][vueify] for Browserify are available to add them as more step to your bundling process.

If you're building a web app you should be already using them either way, _right?_


#### CLI

Vue's ecosystem and its single file components are great, thank you, but now you have to deal with building configuration?

JavaScript fatigue was _and still is_ a real thing. Folder structure, building processes, tooling are big decisions which define how your project will scale on time.

Thankfully a [command line][vue-cli] and official templates are available to quickly start developing, testing and serving a Vue project.

Creating a terminal client is becoming a trend, giving developers the chance to adopt more easily new environments. A [Polymer toolbox][polymer-cli] was announced in the last Google I/O and Angular 2 will have [a command line interface][angular-cli] too.

For some reason, there's no such a thing from the React community yet.


## Wrap-up

Thanks to the single file components solution Vue's learning curve is not that steep and it embraces some look and feel from combining HTML imports and native web components.

Definitely worth giving it a try, I actually did and created a [simple web app][vue-movies] using all of the tools mentioned in this article.

As any other framework, its ecosystem kind of forces you to do things you might or might not feel comfortable doing, but if you do, Vue speeds up adoption and simplifies a lot of decisions when building large scale apps.


[vue]: https://www.vuejs.org
[guide]: https://www.vuejs.org/guide
[vue-router]: https://github.com/vuejs/vue-router
[scoped-css]: https://github.com/webpack/css-loader#local-scope
[jsx]: https://facebook.github.io/react/docs/jsx-in-depth.html
[css-modules]: http://andrewhfarmer.com/what-are-css-modules/
[vue-loader]: https://github.com/vuejs/vue-loader
[vueify]: https://github.com/vuejs/vueify
[vue-cli]: https://github.com/vuejs/vue-cli
[polymer-cli]: https://github.com/Polymer/polymer-cli
[angular-cli]: https://github.com/angular/angular-cli
[vue-movies]: https://github.com/jeremenichelli/movies/results/vue
