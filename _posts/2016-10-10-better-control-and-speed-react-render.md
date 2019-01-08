---
title: Optimize performance in React&nbsp;components
resume: Under the hood, React creates something similar to a virtual DOM tree to track updates when a component state or prop changes.
---

This also implies that its render function gets called to generate a new tree and compare it to the current one to know what to update.

> The fastest function is the one that’s never&nbsp;called

Even when nothing is changed, a lot of function gets called to determinate that and its usually a big performance gap in React applications.


## Smarter updates

Knowing how our components behave might also unveil when they actually need to be rendered again.

Given this loading bar component, it’s noticeable that unless its hidden state changes after being mounted, we won’t need to update it.

```js
import { Component } from 'react';

class LoadingBar extends Component {
  render() {
    return (
      <div className='loading-bar' hidden={ this.props.hidden }>
        <div className='loading-bar-progress'></div>
      </div>
    );
  }
}
```

`shouldComponentUpdate` give us better control over the component’s update cycle by comparing the upcoming **props** and **state** from the current ones.

```js
import { Component } from 'react';

class LoadingBar extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.hidden !== nextProps.hidden;
  }
  render() {
    return (
      <div className='loading-bar' hidden={ this.props.hidden }>
        <div className='loading-bar-progress'></div>
      </div>
    );
  }
}
```

Since we know the nature of our component we selectively choose in which situation we want it to be rendered again.


### Be quick

Whatever you do inside `shouldComponentUpdate`, do it fast. Avoid expensive operations and go directly to shallow comparisons.

This method will be called every time React tries to update the element. If deciding whether a new render should happen or not is more expensive than the render itself, it will cause the inverse and slow down our application.

A common case is when a component receives an object as a _prop_.

```js
import { Component } from 'react';

class MovieBox extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.data.id !== nextProps.data.id;
  }
  render() {
    return (
      <div className='movie__box'>
        <h3>{ this.props.data.title }</h3>
        <img src={this.props.data.thumb }/>
        <p>Plot: { this.props.data.plot }</p>
      </div>
    );
  }
}
```

Instead of comparing the whole object, check for a key or a combination of them which makes the _prop_ unique.


### Pure components

Another solution is to extend from [PureComponent](https://facebook.github.io/react/docs/react-api.html#react.purecomponent) class. This will run shallow compares on all props and states to know when a given component should update.

I suggest only using this class when all the props are primitives, running shallow compares on objects and arrays might have a higher cost than the render function call itself.


### No updates at all

If the component doesn’t contain any dynamic data or state change, you might consider to return `false` inside `shouldComponentUpdate` and render only once.


## Constant elements

Behind the sugar syntax **JSX** you will find objects representing elements. In JavaScript objects are not directly comparable, to know if two objects represent the same element is necessary to walk through all the properties.

Without **JSX** a component declaration might look like this:

```js
class Icon extends Component {
  render() {
    return React.createElement('i', { className: 'small-icon' })
  }
}
```

Every change on the component containing an instance `Icon` will trigger a new call for `createElement` and also a new reconciling step, unnecessary since every call for render returns the same result.

To mitigate this, declare it as a constant.

```js
import { Component } from 'react';
import Icon from './icon.js':

const icon = <Icon />;

class SearchButton extends Component {
  render() {
    return (
      <button className="search__button">
        { icon } Search
      </button>
    );
  }
}
```

## Avoid anonymous references

Beside elements creation, other computational operations like loops can happen inside a render function.

```js
import { Component } from 'react';
import MovieBox from './movie-box.js';

class Movies extends Component {
  render() {
    const movies = this.props.movies;

    return (
      <div className="movies">
        { (movies || []).map(m => <MovieBox data={ m }/>) }
      </div>
    );
  }
}
```

At first glance, this code looks totally fine _(and it kinda is)_, but again remember this render function might get called several times. On every call we are defaulting to an empty array in case no _movie prop_ was passed.

Doing `[]` equals to `new Array()`, not only these are expensive operations, but they also generate anonymous references on memory making our application slower on each update because of garbage collection.

Quick solution, create a constant reference with a default value.

```js
import { Component } from 'react';
import MovieBox from './movie-box.js';

const noMovies = [];

class Movies extends Component {
  render() {
    const movies = this.props.movies;

    return (
      <div className="movies">
        { (movies || noMovies).map(m => <MovieBox data={ m }/>) }
      </div>
    );
  }
}
```

The same happens with the arrow function inside `map`, it is better to move it outside `render` and save new memory allocations.

```js
import { Component } from 'react';
import MovieBox from './movie-box.js';

const noMovies = [];

class Movies extends Component {
  renderMovie(movie) {
    return <MovieBox data={ movie }>;
  }

  render() {
    const movies = this.props.movies;

    return (
      <div className="movies">
        { (movies || noMovies).map(this.renderMovie) }
      </div>
    );
  }
}
```

<a
  class="blocked__link blocked__link--centered"
  href="https://jsfiddle.net/jeremenichelli/rt9tnk45/"
  rel="noopener noreferrer">
  See it in action
</a>

These optimizations are similar to the ones shown before, the final take is to place outside the render function everything that will remain constant.


## Wrap-up

For more granular control over render calls use `shouldComponentUpdate`.

Detect static parts on your components and move them outside as constants.

Avoid anonymous references during renders to reduce memory allocation and speed up execution time.
