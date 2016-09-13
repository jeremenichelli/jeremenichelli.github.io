---
layout: default
title: The component based frameworks experience
resume: Developers have been trying to find a solution to architecture on complex web applications. The most recent answer to that are components, divide the interface in smaller and autonomous blocks to conquer maintainability and scalability.
---

I'm not _a framework or library person_, but they exist for a reason. There's a need of solving things quickly, a clear gorwth path and fast adoption for new team members. Frameworks are exactly that, they are an inversion of control for your developing product, they will tell you how to do something and how to scale it.

> Frameworks and libraries exist for a reason

The problem is that [they come at a cost][cost] that's usually paid by the user. Big bundles to download, long waiting times to actually see content and some times not the best performance in mobile devices.

But again, they are here, they are a thing. So I shaked the denial off and decided to write a simple web application, the exact same one, with different libraries.

## VueJS

Amazed by its incresing popularity I decided to go with [Vue][vuejs] first. And I've found that why a lot of developers are happy with it.

**Vue** is really well documented and it comes with a set of features and tools that make the experience great like [single files components][singlefilecomponents].

Performance is not a trade off at all, some case studies show is [as good or even faster][vuereactperf] than other popular libraries.

> VueJS strongest points are documentation and ecosystem

I think that its strongest drawback is its self-defined field of action. Initially **Vue** borrowed notation and approaches from Angular and React plus its own interface and features. Those blurry lines allow you to fall into anti-patterns to easily, closing some trails some times pushes the developer into the right ones.

Some of these stuff has been addressed in [an upcoming new version][vue2]. Approaches that can be accomplish with plain JavaScript have been deprecated, and view parser and run time are now splited in two different bundles minimizing loading times and allowing server side rendering.

- [Complete article about Vue](/2016/06/building-component-based-app-vue/)
- [Simple web app built with Vue](https://github.com/jeremenichelli/movies/results/vue)


## React

Next, probably the one which make _component_ an every day word in the fron tend development sphere. [React][react] intention is to provide a declarative way to build, an abstraction to represent a small part of your application.

It could be said that it just handles _virtual elements_ and their internal state.

Facebook team built **React** with architecture in mind, it pushes you to separate concerns and build reusable small pieces which communicate in a one way flow.

One of its biggest drawback is that abstraction layer which relays entirely on JavaScript and it can be a pain to get used to. When you do, the experience really pays off.

> After setting up your mind around its concept, building stuff with it is great

It isn't slow, but it isn't fast either unless you apply certain patterns in specific parts of your project, _shouldComponentUpdate_ is an example.

To beat others you need a lot of specific knowledge about how it works, knowledge that most of the time a team doesn't have time to absorb, and though documentation is complete, it definitely needs some gardening.

- [Complete article about React](/2016/07/building-a-component-based-app-react/)
- [Simple web app built with React](https://github.com/jeremenichelli/movies/results/react)


## Polymer

Though it comes with similar features, it is hard to find products built with [Polymer][polymer].

It extends already existing web features instead of redefining concepts ot creating extra layers between your code and what ends up rendered in the browser.

Without that extra layer and taking advantage of the native platform under the hood achieves really good performance. Then why isn't it more popular?

Well, while performance is something _almost_ everyone cares, scaling a big application through HTML imports and loosely declared components is a hard choice to make.

> Polymer relays on native features, and native is hard to beat


As someone who prefers vanilla solutions over framework-based ones, I really hope **Polymer** takes some shape in time and improves a project structure instead of affecting it.

- [Complete article about Polymer](/2016/08/building-a-component-based-app-polymer/)
- [Simple web app built with Polymer](https://github.com/jeremenichelli/movies/results/polymer)


## Angular 2

The first version dominated the framework scene for years, but a lot of years went by since its release and today the needs are very different.

That's why the **Angular** team is betting on a complete rewrite to keep pace.

Though it was still on beta I decided to give it a try. This second version pushes a lot of changes in the development experience like TypeScript over vanilla JavaScript and a new component interface.

You won't find it hard to adpot it if you are coming from **Angular 1.x**, but if you are not prepare for a slow learning curve. An **Angular 2** requires a lot of configuration to bootstrap a simple application, but scaling over it is really easy.

> When using Angular 2 in your project, you are choosing a slow start for a rapid and organized growth

This new version introdoces interesting concepts and improvements under the hood, but they will be hard to sell if documentation and configuration ease aren't improved by its release.

- [Complete article about Polymer](/2016/08/building-component-based-app-angular-2//)
- [Simple web app built with Polymer](https://github.com/jeremenichelli/movies/results/angular)


## Wrap-up

As I mentioned at the beggining, working with frameworks or libraries with heavy influence in the project structure is hard for me.

This was an experiment for me to jump in the game, learn and the result is a set of articles describing my findings. The intention wasn't to provide a _how to_ article for each, but to quickly describe and compare how these four work and what is my opinion.

Frameworks still focus more in making life easier for us the developers than for the final users.

Which one is my favorite? I don't feel there is one that beats the others. Same results can be achieved with either of them .

To give the user a reliable experience you'll have to read and learn a lot about best practices and concept for each of them, no matter what your choice is.


[vuejs]: https://www.vuejs.org
[singlefilecomponents]: http://vuejs.org/guide/single-file-components.html
[vuereactperf]: https://engineering.footballradar.com/from-a-react-point-of-vue-comparing-reactjs-to-vuejs-for-dynamic-tabular-data/
[vue2]: https://vuejs.org/2016/04/27/announcing-2.0/

[react]: https://facebook.github.io/react/

[polymer]: https://www.polymer-project.org

[angular]: https://angular.io

[cost]: https://aerotwist.com/blog/the-cost-of-frameworks/
