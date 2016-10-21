---
layout: default
title: Improve control and performance for render functions in React
resume: As a caveat of its declarative interface, components might get rendered several times unnecesarily, slowing down your application.
---

This happens because inside its code base React creates a virtual DOM composed by its own React elements mirroring the actual DOM tree. When an element's state or prop is changed, not only its render function gets called, but its children ones too.


### Behind the scenes

All the syntax sugar **JSX** gives us is great, but also hides what's really happening when we place a tag.

```js
class Icon extends React.Component {
  render() {
    return <i className="small-icon"></i>
  }
}
```

Without **JSX** this component declaration becomes this:

```js
class Icon extends React.Component {
  render() {
    return React.element('i', { className: 'small-icon' })
  }
}
```

Every change on its parent component will trigger a new `React.element` call and a new reconciling, which makes no sense here since every call for _render_ returns the same result.

Depending on how the component is written there are different ways we can easily improve this.


## You Only Render Once, no updates

If we want our component to render just once, the simplest solution is to make use of `shouldComponentUpdate` and return always `false`.

```js
class Icon extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <i className="small-icon"></i>
  }
}
```

In case the component is being imported from an external source or for some reason we can't modify it, declare it as a constant outside the parent.

```js
const icon = <Icon/>;

class SearchButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false
    };
  }
  render() {
    return (
      <button disabled={ this.state.disabled}>
        { icon } Search
      </button>
    );
  }
}
```

The resulting number of calls of the render function in **Icon** will be the same in both cases, so there's not a real advantage of one over the other.


## Smarter updates

Knowing how our components behave might also unveil when they actually need to be rendered again.

Given this loading bar component, it's noticeable that unless its hidden state changes after being mounted, we won't need to update it.

```js
class LoadingBar extends React.Component {
  render() {
    return (
      <div className='loading-bar' hidden={ this.props.hidden }>
        <div className='loading-bar-progress'></div>
      </div>
    );
  }
}
```

To make our component update cycle smarter we can use the arguments that `shouldComponentUpdate` sends when is called.

The first one is an object with the new _props_, the second one are the new _states_.

```js
class LoadingBar extends React.Component {
  shouldComponentUpdate(nextProps, nextStates) {
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

With a simple and straight forward line of code our component gets smarter.


### Be quick

Whatever you do inside `shouldComponentUpdate`, do it fast. Avoid expensive operations and go directly to shallow comparisons.

This method will be called every time React tries to update the element. If deciding whether a new render should happen or not is more expensive than the render itself, it will cause the inverse and slow down our application.

A common case is when a component receives an object as a _prop_.

Instead of comparing the whole object, check for a key or a combination of them which makes the _prop_ unique.

```js
class MovieBox extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.data.imdbID !== nextProps.data.imdbID;
  }
  render() {
    return (
      <div className='movie__box'>
        <h3>{ this.props.data.Title }</h3>
        <img src={this.props.data.Poster }/>
        <p className='movie__plot'>
          Plot: { this.props.data.Plot }
        </p>
      </div>
    );
  }
}
```

Comparing primitive values, like strings, is fast making the logic inside `shouldComponentUpdate` efficient and valuable from a performance perspective.


## Avoid anonymous references

Not only returning React elements, other computational operations like loops can happen inside a render function.

This power in combination with some short hand allowed from JavaScript itself can become a double-edge sword.

```js
class Movies extends React.Component {
  render() {
    const movies = this.props.movies;

    return (
      <div className="movies">
        { (movies || []).map(mov => <MovieBox data={ mov }/>) }
      </div>
    );
  }
}
```

At first glance, this code looks totally fine. There's a variable holding the data we need to loop through to render a **MovieBox** component for each movie.

But again, remember this render function will get called several times. On every call we are defaulting to an empty array in case no _movie prop_ was passed.

Doing `[]` equals to `new Array`, as `{}` is the same as `Object.create(null)`.

Not only it's an expensive operation, but it also generates an anonymous reference on memory making our application slower on each render.

A quick solution, create a constant reference with a default value.

```js
const noMovies = [];

class Movies extends React.Component {
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

The same ocurrs with arrow functions like the one used inside `map`. Though it looks great, a new reference for it is created on each render.

```js
const noMovies = [];

function renderMovie(movie) {
  return <MovieBox data={ movie }/>;
}

class Movies extends React.Component {
  render() {
    const movies = this.props.movies;

    return (
      <div className="movies">
        { (movies || noMovies).map(renderMovie) }
      </div>
    );
  }
}
```

[See it in action](https://jsfiddle.net/jeremenichelli/rt9tnk45/)

These optimizations are similar to the ones shown before. The general take is to place outside the component everything that will remain constant.


## TL;DR

Use `shouldComponentUpdate` for more granular renders whenever it's possible.

Detect _static_ parts on your components and move them outside of it.

Avoid creating anonymous references during renders to reduce memory allocation and speed up execution time.
