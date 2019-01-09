---
title: How hooks might shape design systems built in React
resume: If you use it regularly or play around with React to build stuff for the web, there's a slight chance you heard about a little thing called _hooks_.
---

OK, maybe you are already tired of hearing about them. But the hype is justified, hooks though not in their final form yet are already proving to be a nice pattern to extend capabilities for functional components.

_This article doesn't serve the purposes of an introduction to hooks, if you don't know about them I suggest [watching Dan Abramov presenting them](https://www.youtube.com/watch?v=dpw9EHDh2bM) or [read the documentation available](https://reactjs.org/docs/hooks-overview.html) for it and come back later._

As someone who has been working in design systems over the past year and using React for it, I can already detect a lot of golden opportunities to simplify and unify the logic these codebases need to handle.

Let's go over some of these potential wins.

## Stoping the class switcheroo

In the context of a design system repository, you won't (and shouldn't) find a lot of logic around components, as the purpose of it is to serve the view part for engineers.

Usually, the logic part comes as style calculation, covering backwards compatibility, and some minimal DOM manipulation.

Let's think of a dialog element as a functional component.

```js
import React from 'react'

const Dialog = ({ isOpen, title, content }) => {
  return isOpen && (
    <div className='dialog---overlay'>
      <div className='dialog'>
        <h2 className='dialog--title'>{title}</h2>
        <p className='dialog--content'>{content}</p>
      </div>
    </div>
  )
}
```

_Of course this is an oversimplified example on how it would look from the code perspective, and it will look different depending on the tooling your company is using to distribute styles._

So here our dialog will be displayed every time the `isOpen` prop changes to `true` and hide when it's `false`.

Now, think about the chance that we need to lock scrolling every time the dialog opens. There's no way today to do it without switching this to a class component.

```js
import React from 'react'

class Dialog extends React.Component {
  render() {
    const { isOpen, title, content } = this.props
    return isOpen && (
      <div className='dialog---overlay'>
        <div className='dialog'>
          <h2 className='dialog--title'>{title}</h2>
          <p className='dialog--content'>{content}</p>
        </div>
      </div>
    )
  }
}
```

Then we use the lifecycle hooks to toggle a class or a style on the `body` element of the document.

```js
import React from 'react'

class Dialog extends React.Component {
  componentDidMount() {
    const { isOpen } = this.props
    document.body.style.overflow = isOpen ? 'hidden' : 'visible'
  }

  componentDidUpdate() {
    const { isOpen } = this.props
    document.body.style.overflow = isOpen ? 'hidden' : 'visible'
  }

  render() {
    const { isOpen, title, content } = this.props
    return isOpen && (
      <div className='dialog---overlay'>
        <div className='dialog'>
          <h2 className='dialog--title'>{title}</h2>
          <p className='dialog--content'>{content}</p>
        </div>
      </div>
    )
  }
}
```

For something so little and trivial as this, we needed a whole refactor of our component. We also find ourselves writing basically the same code on two different lifecycle methods in the component.

We can avoid this by using `useEffect`.

```js
import React, { useEffect } from 'react'

const Dialog = ({ isOpen, title, content }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'visible'
    return () => (document.body.style.overflow = 'visible')
  }, [isOpen])

  return isOpen && (
    <div className='dialog---overlay'>
      <div className='dialog'>
        <h2 className='dialog--title'>{title}</h2>
        <p className='dialog--content'>{content}</p>
      </div>
    </div>
  )
}
```

Every time our `Dialog` instance changes the `useEffect` hook will be called. Inside of it, we are deciding what to do based on the `isOpen` value.

We are returning a function that will be executed in case the component gets unmounted, to make sure we clean the body styles.

Finally, as a second argument, we are passing an array with `isOpen` indicating we only want the effect to run if that property has been modified.

This way we avoid a whole rewrite of the component to a class.

_Read about the useEffect hook [here](https://reactjs.org/docs/hooks-effect)._

## Distribution of simple behaviors

It happens a lot that these small details get repeated over and over again in a design system codebase.

There's a huge chance you will need this for a lot of other elements like overlays, drawers or modals. You can't share lifecycle methods between class components, but we can isolate hooks into their own files and import them wherever necessary.

This how the hook from the example above would look like isolated in its own file.

```js
import { useEffect } from 'react'

function useLockBodyScroll(toggle) {
  useEffect(
    () => {
      document.body.style.overflow = toggle ? 'hidden' : 'visible'
      return () => (document.body.style.overflow = 'visible')
    },
    [toggle]
  );
}

export default useLockBodyScroll
```

Later in the component you add the hook and pass the property that will toggle the style.

```js
import React from 'react'
import useLockBodyScreen from './hooks/useLockBodyScreen'

const Dialog = ({ isOpen, title, content }) => {
  useLockBodyScreen(isOpen)

  return isOpen && (
    <div className='dialog---overlay'>
      <div className='dialog'>
        <h2 className='dialog--title'>{title}</h2>
        <p className='dialog--content'>{content}</p>
      </div>
    </div>
  )
}
```

_Check out this example on [Code Sandbox](https://codesandbox.io/s/pl8ollk70)._

Now, the behavior can be shared across the components of the system. This also has an impact in other parts of the repositories like the unit tests suite.

I need to make sure all components with lifecycles altering the body styles work properly, which means writing the same unit tests over and over again. With this pattern, we would only need to test the behavior once at the hook's level.

_Read about building custom hooks [here](https://reactjs.org/docs/hooks-custom)._

## Goodbye dumb states

I don't think states themselves are _dumb_, but it is a little annoying how a lot of components are classes just because you need to conditionally render a part of its tree or not.

For example, menus and dropdowns.

```js
import React from 'react'

class Menu extends React.Component {
  state = { open: false }

  toggleMenu = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const { open } = this.state
    const { options } = this.props

    return (
      <div className='menu'>
        <button onClick={this.toggleMenu}>
          Menu
        </button>
        {open && (
          <div className='menu--options'>
            {options.map(item => (
              <a href={item.href}>{item.text}</a>
            ))}
          </div>
        )}
      </div>
    )
  }
}
```

The only reason this component is a class in the code above is the need of a _state_ to show or hide the options, but this can easily become a functional component with the `useState` hook.

You will notice how we deconstruct the return value of it into _the state_ itself and _the method_ to toggle its value.

```js
import React, { useState } from 'react'

const Menu = ({ options }) => {
  const [open, setOpen] = useState(false)
    
  return (
    <div className='menu'>
      <button onClick={() => setOpen(!open))} >
        Menu
      </button>
      {open && (
        <div className='menu--options'>
          {options.map(item => (
            <a href={item.href}>{item.text}</a>
          ))}
        </div>
      )}
    </div>
  )
}
```

The value we pass to `useState` becomes the initial state, later each `setOpen` call will modify it, without the need of a class at all.

_Read about the useState hook [here](https://reactjs.org/docs/hooks-state)._

## Wrap up

Hooks enable new patterns by empowering functional components and removing the need of lifecycles and states for simple use cases.

The behavior inside **hooks can be shared** now within your design system, and less code to maintain could potentially translate into fewer bugs and avoid redundant unit tests.

Building our own hooks and distributing them across the project will help us concentrate more on what it is happening around the interface itself and less on the logic and little quirks needed for components to behave as expected out of the box.

I can't wait to see how they reshape design systems.

Remember that **hooks are not production ready**, and there could be serious performance regressions and behavior changes in the future so keep their use as experimental.

_Thanks [Sara Vieira](https://iamsaravieira.com/) for proof reading this piece._
