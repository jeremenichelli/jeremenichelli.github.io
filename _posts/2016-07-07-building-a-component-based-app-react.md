---
title: Building a component based app with&nbsp;React
resume: Developers have been trying to find a solution to architecture on complex web applications. The most recent answer to that are components, divide an interface in smaller and autonomous blocks to conquer maintainability and scalability.
---

In this case I will go through my thoughts and feelings on developing a web application using [React][react], probably the most popular library to render views these days, created by Facebook developers.


_This writing belongs to a serie of articles about using components with [Vue][vue-article], React,  [Polymer][polymer-article] and [Angular 2][angular-article]._


## Introduction to React

According to its authors, the mear existence of this framework is to compose large web applications through components instead of directives. Those components will only be updated if the data bound to them does.

To achieve this React provides a set of methods to express HTML elements with object notation, an abstraction pattern usually known as _virtual DOM_.

So, instead of creating and appending elements as usual, you represent them with an object passing tag, properties and children to the **createElement** function.

```js
let Link = React.createElement(
	'a',
  {
  	href: 'https://github.com/jeremenichelli',
    className: 'github-link'
  },
  'GitHub'
);
```

<a
  class="blocked__link blocked__link--centered"
  href="https://jsfiddle.net/jeremenichelli/kqLmfcq4"
  rel="noopener noreferrer">
  See it in action
</a>

In this example we are creating an anchor, passing the **href** and **class** properties and a text node as its only children.

It's necessary to express element's properties as their JavaScript equivalent, that's why **className** is used instead of **class**.


### JSX

Not mandatory, but an optional way to describe render trees is **JSX** which basically let's you describe React elements in a syntax similar to HTML.

```js
const GitHubLink = (
  <a
    className="github-link"
    href="https://github.com/jeremenichelli"
  >
    GitHub
  </a>
);
```

Seeing tags inside your code might feel weird at first, however it becomes a better option when writing more complex elements with a bigger number of children that can be harder to read using React's method.

Of course this will need to be _transpiled_ to actually work, but more on that later.


## Writing components

As React promises, the best reason for using it is to improve the architecture of your application diving the views into reusable components.

One of the many ways to achieve this is extending the component class.

```js
import React, { Component } from 'react';
import { render } from 'react-dom';

class GitHubLink extends Component {
  render() {
    return (
      <a
        href="https://github.com/jeremenichelli"
        className="github-link">
        { this.props.user } on github
      </a>
    );
  }
}

render(
  <GitHubLink user="jeremenichelli"/>,
  document.querySelector('#example')
);
```

These components become custom tags you can put inside other components or pass it to the render function. Component tags need to be **capitalized** so JSX can differenciate them from standard HTML ones.

The problem with this component here is that the url is hardcoded, and an anchor always pointing to the same page won't be _that_ reusable.


### Props

To customize our components, data values can be passed to them as _props_.

```js
import React, { Component } from 'react';
import { render } from 'react-dom';

const baseUrl = 'https://github.com/';

class GitHubLink extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <a
        href={ baseUrl + this.props.user }
        className="github-link">
          { this.props.user } on github
      </a>
    );
  }
}

render(
  <GitHubLink user="jeremenichelli"/>,
  document.querySelector('#example')
);
```

When declaring components with this pattern, _props_ need to be passed to the **super** class constructor so they are applied to the component itself.

As you see in the **href** value, JavaScript expressions can be used inside JSX when wrapped with curly braces to apply more dynamic and readable approaches.

```js
import React, { Component } from 'react';
import { render } from 'react-dom';

const baseUrl = 'https://github.com/';

class GitHubLink extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <a
        href={ baseUrl + this.props.user }
        className="github-link">
          { this.props.user } on github
      </a>
    );
  }
}

class GitHubUsers extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <GitHubLink user="jeremenichelli"/>
        <GitHubLink user="iamdustan"/>
      </div>
    );
  }
}

render(
  <GitHubUsers />,
  document.querySelector('#example')
);
```

<a
  class="blocked__link blocked__link--centered"
  href="https://jsfiddle.net/jeremenichelli/oLL9j1bj/3"
  rel="noopener noreferrer">
  See it in action
</a>

The render function in React components always has to return a single root element, that's why the two GitHub links are placed inside a **div** tag.

Remember you can use JavaScript inside `render`, which is pretty neat when the number of children is unknown or too big.

```js
import React, { Component } from 'react';

const users = [
  'jeremenichelli',
  'iamdustan'
];

class GitHubUsers extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div hidden={ !users.length }>
        { users.map(user => <GitHubLink user={ user }/>) }
      </div>
    );
  }
}
```

<a
  class="blocked__link blocked__link--centered"
  href="https://jsfiddle.net/jeremenichelli/oLL9j1bj/4/"
  rel="noopener noreferrer">
  See it in action
</a>

This is a better pattern since now the logic inside `render` doesn't need to be updated when the data changes, improving the maintainability of the code.


#### PropTypes

Validation can be added to props, for example specifying type.

```js
GitHubLink.propTypes = {
  user: PropTypes.string.isRequired
};
```

After passing the type we can go further and use `isRequired` so the presence of it becomes mandatory for rendering the component.

_propTypes have been moved to [a standalone package](https://reactjs.org/docs/typechecking-with-proptypes.html)._

### State

When data values can change internally because a network request or a user interaction happened, we placed them on the component's _state_.

```js
import React, { Component } from 'react';

class AccordionElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    }
  }
  render() {
    return (
      <div className={ this.state.expanded ? 'expanded' : '' }>
        <button>{ this.props.heading }</button>
        <p>{ this.props.content }</p>
      </div>
    );
  }
}
```

Here we are defining an accordion element, the _expanded_ value will define whether the content will be visible or not, so it makes sense to define it as a _state_.

To reveal the content we need to toggle the _expanded_ value.

To do it we use **setState** and React will update the components view.

```js
import React, { Component } from 'react';

class AccordionElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    }
  }
  toggleState() {
  	this.setState({ expanded: !this.state.expanded });
  }
  render() {
    return (
      <div className={ this.state.expanded ? 'expanded' : '' }>
        <button onClick={ this.toggleState.bind(this) }>
          { this.props.heading }
        </button>
        <p>{ this.props.content }</p>
      </div>
    );
  }
}
```

<a
  class="blocked__link blocked__link--centered"
  href="https://jsfiddle.net/jeremenichelli/oLL9j1bj/5"
  rel="noopener noreferrer">
  See it in action
</a>

When the **toggleState** function gets called the context will be the rendered node, with **bind** we change it back to the component.


### Model binding

As the library doesn't come with directives out of the box, when you need to track properties like the value of an input you will have to do it yourself.

It's not hard since React encapsulation itself comes handy for this.

```js
import React, { Component } from 'react';

export default class SearchBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
        searchValue: ''
    };

    // bind events
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({ searchValue: e.target.value });
  }
  render() {
    return (
      <form action="?">
        <input type="text"
          value={ this.props.searchValue }
          onChange={ this.handleChange } />
        <button type="submit">Search</button>
      </form>
    );
  }
}
```

This is a pretty common pattern that allows you to access to that _state_ later in case it affects some other rendered section of the component.

### Styles

If you're using React, the main reason should be that you find the separation of concerns and encapsulation the best way to structure your application, so your strategy around styles should match this philosophy.

**CSS modules** alter original selectors so they are unique, and as a consequence, encapsulates the styles for a set of elements.

```js
import React, { Component } from 'react';

import styles from '../styles/icon.css';

class Icon extends Component {
  render() {
    return (
      <i className={ styles.icon }></i>
    );
  }
}
```

When you import a style file like this, selectors are changed to keys, combinations of letters and numbers. Inside your script an object is returned containing exactly those unique references you can use in your components as classes.

Of course this happens at compilation time so you will need external tools like [webpack loaders][css-modules-webpack] to manage your styles this way.

### Routing

The most popular alternative to turn your React project in a single page application is the [official react router][react-router]. As you might have guessed, you need to define the shell of your app and the views as components.

```js
import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="app">
        <h1>React single page application</h1>
        { this.props.children }
      </div>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <div className="home">
        <h2>Home</h2>
          // view content ...
      </div>
    );
  }
}

class About extends Component {
  render() {
    return (
      <div className="about">
        <h2>About</h2>
          // view content ...
      </div>
    );
  }
}
```

Next, you pass these views as _props_ to special route components that will mount the app and manage the transitions for you.

```js
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';

render((
<Router>
  <Route path="/" component={ App }>
    <IndexRoute component={ Home } />
    <Route path="/about" component={ About }>
      <Route path="/about/:author" component={ Author }></Route>
    </Route>
  </Route>
</Router>
), document.getElementById('app'))
```

Basically you're configuring the routes by placing tags defining the structure of your project, meaning you can go deeper placing routes and defining parameters.

```js
import React, { Component } from 'react';
import { Link } from 'react-router';

class Home extends Component {
  render() {
    return (
      <div className="home">
        <h2>Home</h2>
        <Link to="about/jeremenichelli">About me</Link>
          // view content ...
      </div>
    );
  }
}
```

To render anchors pointing to a defined route, a **Link** component is available.


## Ecosystem

Even when it has a great and growing community, its ecosystem is its weakest point.

Try to learn a new framework always brings a learning curve that, in my opinion, is too steep in React. There are a lot of reasons for that.

The first one is the **documentation**. I have to admit is really complete but unorganized, which is a big deal for begginers, probably a consequence of a fast evolution pace the repository experimented recently.

> The official docs grew organically and need&nbsp;gardening
>
> - Dan Abramov

The second one is **JSX** itself. Using it really improves the developing experience, but it brings its own tricks and limitations to the yard.

I would suggest trying React without it first or you will find yourself learning two things at the same time, not knowing _what's wrong and where_ when your script renders nothing.

The last one is **tooling**. If you're building your application with React, you will need transpiling and a build process to handle the whole thing since you're choosing this path to structure your project separating it in smaller parts.

There are a lot of boilerplates, which I think is a symptom of what's going on with the library nowadays. Apparently developers are having a hard time around decisions when they start a new project which includes React.


## Architecture

This heading probably won't be present in all the articles from this serie and the reason is React actually shaped the structure of my application.

While trying to avoid repeated code and follow best practices, the library itself in combination with CSS modules _forced_ me in own way or another to encapsulate both logic and styles.


### Components as modules

Once you've resolved the tooling part, enclosing each component as a module is the best way to organize an application that might scale in time.

The **SearchBox** component example shown previously can be easily imported to compose more complex components or views.

```js
import React, { Component } from 'react';

// components
import Card from '../components/card.js';
import SearchBox from '../components/search-box.js';

export default class SearchView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Card>
        <SearchBox />
      </Card>
    );
  }
};
```

Following this design rules, the project grows naturally without overthinking around where you should put something or where not, and that's a big win from this library.


## Wrap-up

React has something that makes you like it, it does **one** thing. Short set of methods and patterns to learn and you're ready to go.

But it needs to improve documentation and tooling to help developers without strong concepts around architecture and components.

It definitely could force you to change the develop and scale your app, but after you've done that letting React rule your project's architecture is a relief.

Most of these thoughts came while building a [simple web app][react-movies] using tools and approaches mentioned in this article you can explore on GitHub.


[react]: https://facebook.github.io/react
[props]: https://facebook.github.io/react/docs/reusable-components.html#single-child
[css-modules]: http://andrewhfarmer.com/what-are-css-modules/
[css-modules-webpack]: https://css-modules.github.io/webpack-demo/
[react-router]: https://github.com/reactjs/react-router
[react-movies]: https://github.com/jeremenichelli/movies/tree/master/results/react

[vue-article]: /2016/06/building-component-based-app-vue/
[react-article]: /2016/07/building-a-component-based-app-react/
[polymer-article]: /2016/08/building-a-component-based-app-polymer/
[angular-article]: /2016/08/building-component-based-app-angular-2/
