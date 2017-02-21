---
layout: default
title: Smooth view transitions for React views
resume: At work we are currently building heavy animated sites and applications using React, transition group hooks and GSAP.
---

Designers and I found that some times views transitions and first entrance didn't run as performant as we wanted. After debugging and many tries these findings were the most _bulletproof_ solutions.

## Basic view structure

Omitting obvious complexity this is how a generic view looks in our code base.

```js
import { Component } from 'react';
import animate from 'gsap-promise';

class Home extends Component {
  componentWillAppear(done) {
    // animate view entering...
  }
  componentWillLeave(done) {
    // animate view leaving...
  }
  render() {
    return (
      <div className="home--view">
        <h1 ref={el => this.title = el}>
          home
        </h1>
        <p ref={el => this.content = el}>
          Lorem ipsum dolor sit amet...
        </p>
      </div>
    );
  }
}
```

Instead of the generic [gsap](https://www.npmjs.com/package/gsap) module we import [gsap-promise](https://www.npmjs.com/package/gsap-promise) which is just a wrapper of the official one that returns a Promise when animation is completed and keeps the code cleaner.

When an element is wrapped by a transition group, `componentWillAppear` and `componentWillLeave` lifecycle hooks become available.

```js
import { Component } from 'react';
import TransitionGroup from 'react-addons-transition-group';

class App extends Component {
  render() {
    return (
      <div className="app--wrapper">
        <TransitionGroup>
          { this.props.children }
        </TransitionGroup>
      </div>
    );
  }
}
```

Assumming this component is where the views will be rendered, we place the `children` prop inside a `TransitionGroup` component so the previously mentioned hooks are called.

Presented the case, let's dive into the solutions!


## will-change

<!-- The first thing that caught my eye was that we weren't upgrading elements -->
