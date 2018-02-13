---
title: Are we done mutating the&nbsp;DOM?
resume: I've heard a lot of times about the DOM being slow or a bad interface model. I disagree with most of these kind of statements.
---

The DOM as a expression of what we want to be rendered in a screen is great, and by its initials you will notice that the whole deal of it is to provide a visual repesentation model.

If it wasn't declarative enough, then **JSX** would have never existed and people would be happily nesting `createElement` calls, but truth is **JSX** is a big part of the React ecosystem helping express a component's internals.

> Staying as a model, dying as an interface

Besides this, the DOM is dying indeed, not as representation model but as a programming interface.


## No one writes DOM anymore

One of the things that all current frameworks have in common is that they provide escape hatches for DOM mutations.

It could be said that when you are passing `Vue` or `Angular` a template string you are actually writing DOM elements.

But truth is you are creating a similar representation model of it that will need to be interpretated, parsed and translated to actual DOM to work.

The same for **JSX**, besides string interpolations we have lots of artifacts to avoid manually appending elements in a list, add event listeners or changing attribute values.

> We seem to be done writing actual DOM

I think most developers today don't mind having DOM as the representation of their applications, but we seem to be done with its API and how they negatively impact product scaling and developer experience.

I think this particular topic got in the way of web components fame, basically because everyone was expecting them to mitigate this DOM interaction issue when they really came as a low level API to extend the elements collection available, and provide interoperability and proper native encapsulation.


## What about the future?

Extending current web APIs is hard, steps need to be firm and clear since going back and forth can produce confusion and cause no adoption at all of new interfaces, something that web components specs also suffered from.

But if we want native methods to help us, we need additions that frameworks, or us directly, can rely on to make substantial changes in our applications.

Recently Yehuda Katz, part of Ember's core collaborators team, proposed a set of methods called `DOMChangeList` and `DOMTreeConstruction` _([see the proposal](https://github.com/whatwg/dom/issues/270))_ to schedule DOM mutations with better performance, something super useful for frameworks which currently apply their own implementation.

But this would still be a sequential change API not solving the developer experience problem which I believe is the real missing piece in the platform.


## Wrap-up

I think that until we don't get a way to _diff_ and _patch_ the DOM in a declarative way similar to what `React.createElement` and `ReactDOM.render` do, developers will still leave this work to frameworks and libraries which are doing almost the same work, creating interesting solutions but fragmentating implementations.

Maybe solutions like [Irakli Gozalishvili's dominion](https://github.com/gozala/dominion) library with a pragma abstracted layer is what we are looking for. Time will tell.
