---
title: The benefits of props as component slots in React
resume: Composing components with more granular and simpler ones already present in the codebase is a pretty standard situation inside both a web application and, as in my case, a design system repository.
---

Imagine for example a _button_ component that you can use anywhere, but also a _modal_ component that consumes it as part of its basic interface.

You might already have seen lots of different approaches and techniques for composition in React, like [render props](https://reactjs.org/docs/render-props.html) or [child functions](https://medium.com/merrickchristensen/function-as-child-components-5f3920a9ace9). In this case, I'm going to show you _props as component slots_ or _children prop_.

_And if you have a better name for this please reach out._

The best way to explain this pattern, and where it shines, is to present the issues and code smells it solved for me.

## Things to solve

### Prop "drilling"

Let's go back to the example I mentioned with a _button_ component available for use and also consumed by a _modal_ and think about its possible prop signature.

The button's content could be the _children_ prop, a _kind_ prop to indicate whether it is a _primary_ or _secondary_ action, an _icon_ prop in case we want an SVG image prepend inside its content and an _onClick_ prop for the click event.

How modal should handle the customization of its _button_? The immediate thing we do is to match all the props at the component level.

```js
import React from 'react'
import Button from '../button'

const Modal = (props) => (
  <div className="modal">
    <h2 className="modal--title">{props.title}</h2>
    <h2 className="modal--body">{props.body}</h2>
    <Button
      kind={props.buttonKind}
      icon={props.buttonIcon}
      onClick={props.buttonOnClick}  
    >
      {props.buttonText}
    </Button>
  </div>
)
```

Of course there's nothing particularly wrong with the code above and you are going to be just fine with this, specially if these two components are unlikely to change with time.

But if they do then maintenance might become a little pain, even more if you use this pattern for _button_ a lot across your codebase.

It can get even worse if for some reason you have one more component layer between `Modal` and `Button`.

### Duplicated type definitions

Whether you are using _prop types_ or any language superset to define types, you will have duplicated and unnecessary definitions all over the place, matching exactly the button props definition.

```js
Modal.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  buttonKind: PropTypes.oneOf([ 'primary', 'secondary' ]),
  buttonText: PropTypes.string,
  buttonIcon: PropTypes.string,
  buttonOnClick: PropTypes.func
}
```

If the signature of the component expands, it will translate into even more work and duplicated definitions, and for something that might be trivial.

## Props as component slots

The solution I've found is to pass component through props, this allows you to render a component in a certain section.

```js
import React from 'react'

const Modal = (props) => (
  <div className="modal">
    <h2 className="modal--title">{props.title}</h2>
    <h2 className="modal--body">{props.body}</h2>
    {props.action}
  </div>
)
```

Whenever we use `Modal`, we just pass an instance of `Button` to _action_.

```js
import React from 'react'
import Modal from '../modal'
import Button from '../button'

const DeleteModal = (props) => (
  <Modal
    title="Delete post"
    body="Do you want to delete this from your page?"
    action={
      <Button kind="danger">Delete</Button>
    }
  />
)
```

I haven't experience any inconvenience by doing this. The result is cleaner and more extensible code as we pass the props to `Button`directly to the element.

Other stuff you can do is to force certain configuration of the component, for example let's force any _button_ passed to be _secondary_.

```js
import React from 'react'

const Modal = (props) => (
  <div className="modal">
    <h2 className="modal--title">{props.title}</h2>
    <h2 className="modal--body">{props.body}</h2>
    {React.cloneElement(props.action, { kind: 'secondary' })}
  </div>
)
```

No matter what the developer defines for `kind` in the button it will be ignored and `"secondary"` will always be the prop value.

This is super useful inside design systems when trying to force certain visual patterns.

### Type checking

One thing that I don't like much about this, and couldn't figure out a better way to do it, is prop type checking of the component is passed.

It's necessary to import the component and check the instance.

```js
import Button from '../button'

Modal.propTypes = {
  action: ({ action }) => {
    if (action && action.type !== Button) {
      return new Error('Modal expects action to be a Button instance.')
    }
  }
}
```

Before you say it, no, `PropTypes.instanceOf(Button)` doesn't work.

I still think this is a small price to pay, giving all the unnecessary prop manipulation it's saved me, specially inside the design system repository on my current job where internal components are reused as much as possible.

## Wrap up

This technique, props as component slots or however you think this should be called, avoids unnecessary prop handling and repeated type checking.

I haven't detected performance regression around this, but if you do, think about the possibility of switching to another approach that still gives you these benefits while controlling better render cycles.

My recommendation is to hoist the element when possible.

```js
import React from 'react'
import Modal from '../modal'
import Button from '../button'

const deleteButton = <Button kind="danger">Delete</Button>

const DeleteModal = (props) => (
  <Modal
    title="Delete post"
    body="Do you want to delete this from your page?"
    action={deleteButton}
  />
)
```

If the _action_ doesn't depend on a higher prop to define its configuration, then turning it into a static element piece will avoid reconciliation around it.

For further reading I recommend the [short mention the pattern receives](https://reactjs.org/docs/composition-vs-inheritance.html) in the official React docs.
