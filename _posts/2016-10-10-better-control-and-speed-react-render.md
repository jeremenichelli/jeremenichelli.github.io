---
layout: default
title: Improve control and performance for render functions in React
resume: As a caveat of its declarative interface, components might get rendered several times unnecesarily, slowing down your application.
---

React creates a something similar to a virtual DOM, composed by its own React elements mirroring the actual DOM tree.

When an element's state or prop is changed, not only its render function gets called, but its children ones too.

Let's improve this by tackling common scenarios inside components.


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

To make our component update cycle smarter we can use `shouldComponentUpdate` and compare the upcoming _props_ and _state_ from the current one.

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


### No updates at all

If the component doesn't contain any dynamic data we can just return `false` inside `shouldComponentUpdate` and it will only get rendered once.


### Pure components

Another solution is to extend from React's [PureComponent](https://facebook.github.io/react/docs/react-api.html#react.purecomponent), this will run shallow compares on all props and states to know when a given component should update, but beware it can cause false negatives and won't run `shouldComponentUpdate` on any element inside its render subtree.


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

Comparing primitive values like strings is fast making the logic efficient and valuable from a performance perspective.


## Avoid unnecessary element reconciling

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
    return React.createElement('i', { className: 'small-icon' })
  }
}
```

Every change on its parent component will trigger a new call for `createElement` and also a new reconciling step, which makes no sense since every call for _render_ returns the same result.

To mitigate this, declare it as a constant on its parent.

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
      <button disabled={ this.state.disabled }>
        { icon } Search
      </button>
    );
  }
}
```

You can get similar behaviors by returning `false` when the component should update or extending from `PureComponent` class as mentioned before, something that might not be possible the source of the component doesn't belong to your project.


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

Not only these are expensive operations, but they also generate anonymous references on memory making our application slower on each update.

Quick solution, create a constant reference with a default value.

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

The same ocurrs with the arrow function inside `map`. Though it looks great, it is better to move it outside to avoid new memory allocations on each render.

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

For the same reason, you should avoid using `bind` inside **render**.

These optimizations are similar to the ones shown before. The general take is to place outside the component everything that will remain constant.


## TL;DR

- Use `shouldComponentUpdate` for more granular renders whenever possible.
- Detect _static_ parts on your components and move them outside of it.
- Avoid anonymous references during renders to reduce memory allocation and speed up execution time.
