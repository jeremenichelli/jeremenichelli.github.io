---
title: Building a component based app with&nbsp;Angular&nbsp;2
resume: Developers have been trying to find a solution to architecture on complex web applications. The most recent answer to that are components, divide an interface in smaller and autonomous blocks to conquer maintainability and scalability.
---

In this case I will go through my thoughts and feelings on developing a web application using [Angular 2][angular], the upcoming version of this popular framework.


_This writing belongs to a serie of articles about using components with [Vue][vue-article], [React][react-article], [Polymer][polymer-article] and Angular 2._

## Introduction to Angular 2

After years of being the framework behind _almost_ every web application out there, Angular is getting a full re-write focusing on the last development trends.

Even if you have a bunch of experience with Angular 1.x, mastering this new version will require several reading time and even learning a new language, a lot of strong decisions were taken during the development of this new version.


## Writing components

If you have used some of the popular rendering libraries today and ES2015 classes, this Angular 2 component file will look familiar to you.

```
import { Component } from '@angular/core';

@Component({
  selector: 'sample-component',
  styleUrls: [ './sample-component.less' ],
  templateUrl: './sample-component.html'
})

export class SampleComponent {
  firstProp: string;
  secondProp = true;

  someFn() {

  }
}
```

Inside the class declaration we define which properties will be used, indicating their type `(:)` or assigning a value `(=)` to it.

Don't freak out if this syntax looks a bit confusing, the reason is you're not looking at a **.js** file, but a **.ts** one actually.

Angular 2 documentation encourages you to use [TypeScript](https://www.typescriptlang.org) and not JavaScript in your project, and when I say _encourages you_ I mean _forces you_ since its whole guide lacks of JavaScript documentation and only contains TypeScript examples.

> First **strong** decision: TypeScript.

Instead of being a class we can extend from, `Component` is a decorator used to modify the component's behavior and creation. [Decorators](decorators) are part of the ES2016 specification and they are already available in TypeScript.

Inside of that decorator we indicate the files where the styles and template for our component will be, or they can also be placed in line.

```
@Component({
  selector: 'sample-component',
  styles: [ '.link { font-weight: 700; }' ],
  template: '<a href="https://github.com/jeremenichelli">GitHub</a>'
})
```

Decorators and types are not part of ECMAScript specs and browsers can't interpret them, so before running your code it will need to be compiled to JavaScript.


### Transclution

Components in Angular will use web component technologies behind the scene to encapsulate views and styles, which I think is a great decision by the team since it will improve performance as these features get supported natively on browsers.

> Second **strong** decision: Web components behind the scenes.

That said, when views are appended inside a `shadowRoot` the content inside tags doesn't get rendered unless you specify so.

```html
<sample-component>This content won't get displayed!</sample-component>
```

In Angular 2, content projection can be achieved by placing an `<ng-content>` tag. Similar to how the `<content>` tag works in vanilla web components.

In our sample component this would make content between the tags visible.

```js
@Component({
  selector: 'sample-component',
  styles: [ '.link { font-weight: 700; }' ],
  template: `
      <a href="https://github.com/jeremenichelli">
        <ng-content></ng-content>
      </a>
    `
})
```

If you wanna go deeper into transclution I recommend [this article](https://toddmotto.com/transclusion-in-angular-2-with-ng-content) by Todd Motto.


### Directives

Present in previous versions of Angular, directives are _hints_ that will modify an element's behavior when Angular compiles a view. Notation has also changed for this version.


```html
<ul *ngIf="avengers.length > 0">
  <li *ngFor="let avenger of avengers">
    <h2>{% raw %}{{ avenger.name }}{% endraw %}</h2>
    <p>{% raw %}{{ avenger.identity }}{% endraw %}</p>
  </li>
</ul>
```

[See it in action](http://embed.plnkr.co/eyMDXCRRIXPUo4YpxDHi/)

`*ngIf` will not render the element when its condition is false, useful to improve view times and prevent undefined errors when data is not available.

`*ngFor` allows you to render an element more than once dependending on a collection of data present in the component, making your template smarter.

These are just a couple of a bunch of directives available out of the box.


### Events

No much has changed around binding events, in this version they need to be sorrounded by `()` and expecting an expression or a function call.

```html
<button (click)="onSave()">Save</button>
```

Events act like directives under the hood, and Angular provides some special ones like `ngSubmit` to handle form submissions.


### Properties

Along with the component hype, one way data flow became popular as a way to improve the coherence of a code, since communication is always expected to go from a parent to a child component.

This communication is achieved through _properties_ or _props_, a feature already mentioned before in this article and also present in other libraries.

THe difference in Angular 2 is that properties are encapsulated and can't be modify externally, unless they are _decorated_.

```js
// child component
import { Component, Input } from '@angular/core';

@Component({
  selector: 'github-link',
  template: `
      <a href="https://github.com/{% raw %}{{ user }}{% endraw %}">
        {% raw %}{{ user }}{% endraw %} on GitHub
      </a>
    `
})

export class GitHubLink {
  @Input() user: string;
}
```

If we don't place the `@Input` decorator before the property, not only the parent component won't able to pass a value to it, but it will also generate an error at compile time.

```js
// parent component
import { Component } from '@angular/core';

@Component({
  selector: 'app',
  template: '<github-link [user]="users[1]"><github-link>'
})

export class App {
  users = [ 'jeremenichelli', 'iamdustan' ];
}
```

To bind data with a property we enclose it with square brackets `[]` in the component's template, and the same can be done to handle standard attributes.


#### Two way data binding

Not all libraries allow explicitly children to parent communication, the performance cost is big and most of the time is not the best solution.

Though not recommended, some times two way data flows are needed.

For form elements, Angular 2 provides an `ngModel` directive available.

```js
@Component({
  selector: 'search-box',
  template: `
  <form action="/?">
    <input type="text" [(ngModel)]="searchValue" name="searchValue"/>
    <button type="submit">Search</button>
    </form>
  `
})

export class SearchBox {
  searchValue = '';
}
```

In two way bindings `[()]` notation is used. The component's property will be modified by the changes in the input element.

For children to parent communication outside a form, documentation suggests various [communication methods][communication], with the _parent listens to child events pattern_ being the cleanest option in my opinion.

For that we will need Angular's built-in event emmiter and the `Output` decorator.

```js
// child component
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'search-box',
  template: `
    <form action="/?" (ngSubmit)="onSubmit()">
      <input type="text" [(ngModel)]="searchValue" name="searchValue"/>
      <button type="submit">Search</button>
    </form>
  `
})

export class SearchBox {
  searchValue = '';

  @Output() onSearchStarted = new EventEmitter<string>();

  onSubmit() {
    this.onSearchStarted.emit(this.searchValue);
  }
}
```

After the custom event is created we can bind to a method present in the parent component as we do with natural web events.

```js
// parent component
import { Component } from '@angular/core';

@Component({
  selector: 'search-view',
  template: `
    <div class="view">
      <search-box (onSearchStarted)="onSearchStarted($event)">
      </search-box>
    </div>
  `
})

export class SearchView {

  onSearchStarted(value: string) {
    // event triggered... do something!
  }
}
```

Notice the parameter's type is specified with `<>` on the emmiter and `:` on the receiver function in TypeScript.


### Styles

Same as views, styles are encapsulated using Shadow DOM when available, falling back to an attribute system like CSS modules or Vue tools do when not supported.

As you might have noticed styles can be passed in line or you can make reference to an external url that is later handled by the tool in charge of bundling or serving your files.

I had to make the disctintion between _bundling_ and _serving_ since documentation indicates that, though you could safely use bundlers like webpack, the core team will recommend and push for [SystemJS][systemjs] to drive your application build.

We can call that the third strong decision, right?

> Third **strong** decision: SystemJS

But more on this later in the **Ecosystem** section.


### Routing

Among with its official release, Angular 2 will bring a new [routing module][router]. It provides the basic for configuring paths, setting components and handling events.

It's not the goal of this article to go through the set up since it is pretty similar to existing router plugins and it still can changed on its release candidate cycle, happening now.


## Architecture

Angular is definitely a framework, not a library. It tells you exactly what to do and how to do it, there are not glitches or second approaches to explore.

That's the big difference between adding a _library_ or a _framework_ to a project.

On the first, you're supposed to be in control on your code structure and approaches while on the second you're letting it govern all those decisions for you.

You have to adopt its ways which can bring both benefits and drawbacks. The first moments of developing with Angular 2 were painful. I had to understand TypeScript, new binding syntax, services and modules declarations, and more.

Even on your simplest Angular 2 application, your project folder will contain one or more files for each component, something that actually sounds good in terms of code organization.

But then, along with the app component file, I need an app module file specifing each service in a _providers_ array, each component in a _declarations_ array, and all the modules in an _imports_ array even when some of them need to be imported in the component that is going to use them too.

Does that mean that in a really big application I'm going to have a _declarations_ array with dozens of component names? Why do I need to import my services twice? What are the big benefits of this when almost everyone is already used to ES2015 module notation?

Those are some of the questions that came to my mind while developing a simple and small application that contained three times more files when comparing it to other frameworks or libraries.

The question will always be if the benefits can overcome the drawbacks, something that will depend on each project, company or developer.


## Ecosystem

To simplify development Angular team is releasing an [angular cli][angular-cli] to kick off your app quickly. I tried to use it but couldn't really change configurations without breaking it.

Beware that Angular 2 is still on a release candidate state so documentation and tooling is not ready yet.

Instead I've used the [official angular seed][angular-seed] which looked cleaner and allowed me to do some modifications like moving to LESS.

This seed has **webpack** in charge of bundling your project while documentation points to [SystemJS][systemjs] to load your application as I already mentioned.

I feel that because of the amount of initial configuration required, the decision of TypeScript being the language to go and the dissociation from common module patterns, Angular 2 will need that _cli_ and _seeds_ a lot to help developers without an extensive knowledge of tooling and last trends to adopt it.


## Wrap-up

Angular has a really big community waiting for this release but there's a difference between today and 2010, the year the first Angular version came out, today there is competition and [competition is doing really good][state-js-survey].

I hope the drawbacks I pointed out in the last part of this article become tiny in comparison to Angular's rendering times and performance, because if that happens I will be more than pleased to dig into TypeScript and all the configuration it requires to build an application with it.

All these thoughts came from building a [simple web app][angular-app] available on GitHub.



[angular]: https://angular.io/
[decorators]: https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.g7bu9fyyx
[communication]: https://angular.io/docs/ts/latest/cookbook/component-communication.html
[systemjs]: https://github.com/systemjs/systemjs
[router]: [https://angular.io/docs/ts/latest/guide/router.html]
[angular-cli]: https://github.com/angular/angular-cli
[angular-seed]: https://github.com/angular/angular2-seed
[state-js-survey]: https://medium.com/@sachagreif/the-state-of-javascript-front-end-frameworks-1a2d8a61510
[angular-app]: https://github.com/jeremenichelli/movies/tree/master/results/angular

[vue-article]: /2016/06/building-component-based-app-vue/
[react-article]: /2016/07/building-a-component-based-app-react/
[polymer-article]: /2016/08/building-a-component-based-app-polymer/
[angular-article]: /2016/08/building-component-based-app-angular-2/
