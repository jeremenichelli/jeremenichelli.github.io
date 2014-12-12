---
layout: post
title: Me, myself and the DOM manipulation
resume: Sometimes as a developer you need to do something you already did in the past, solve the same problem again. Probably not the same but very similar. That happened to me a few months ago, and instead of looking at my last approach I decided to start from blank and see what could have changed in me in that time.
---

What happened is something that might have happened to you too. The approach I took in the past was **awful**, literally a mess. I always say this is a great sign, means you're improving your programming skills, you're getting better, but it's also a good time to make sure that you're introducing those changes into your mores.


### The so-hated carousel

The fact that carousels don't have a lot of fans in the development world is not a secret. I don't hate them, but it's something I wouldn't recommend to implement. In terms of UX the user can miss content or just not explore it to see what's **hidden** there, it's also hard to make them accessible to people with sight problems and finally but not least, they are tricky to code.

The thing that gave me goosebumps when I saw my old approach was how much I was interacting with the DOM, carousels are interface elements so obviously you'll have to but it was too much. Every time the carousel moved I was looking for the current active element, looking for its next sibling, adding and removing classes and a bunch of other stuff. That's a lot.

What's the problem with that? Performance.

```js
var carousel = function(DOMelement) {
    this.element = DOMelement;

    // start with the first element active
    DOMelement.querySelector('[data-carousel-element]').setAttribute('class', 'active');  
}

carousel.prototype.moveForward = function() {
    var index = this.element.querySelector('.active').getAttribute('data-index');
    this.element.querySelector('.active').setAttribute('class', '');

    var element = this.element.querySelectorAll('[carousel-element]')[index + 1];
    element.setAttribute('class', 'active');
}
```

You can see clearly that there's a lot of work here when what needs to be done is really simple. That's because I'm interacting with the DOM to get current element index attribute, then to get the new one and modify what's necessary. Of course there's a better way.


### Layers

It's not hard to explain or imagine why interacting several times with the DOM is not good if you can avoid it. Layers are always a good way to identify different parts of your web application or web page. Imagine the DOM as a layer placed on top of your scripts, which would be a new and deeper layer.

Interactions inside the same layers are always faster than the ones you do between them. Of course since we're talking about only two layers the hit on performance is not that bad, at least not for desktop computers.

### Lesson learned

When I looked at my new attemp I was very happy to see how I solved this problem in a very simpler way and avoiding this particular issue. This is a quick example of that script.

```js
var carousel = function(DOMelement) {
    this.activeElement = 0;
    this.elements = DOMelement.getElementsByClassName('.carousel-elements');
    
    // start with the first element active
    this.elements[0].classList.add('active');
};

carousel.prototype.moveForward = function () {
    var self = this;

    self.elements[self.activeElement].classList.remove('active');

    // increase the active element position
    self.activeElement++;

    self.elements[self.activeElement].classList.add('active');
}
```

Now the script is controlling all the logic and changes. There's one initial DOM interaction to get all the elements, which are stored in a property inside the carousel element and a little class manipulation when a new active element needs to be set. Of course carousels are more complex so this is just a simplified example of this case.

It's good to see DOM manipulation as a initial point and a final state for UI elements. Not in between, not getting involved in programming decisions. Just a source to start and an output to reflect changes.

Also, it is highly recommendable to use *classList* to manipulate class names of DOM elements if it's available, it's faster and you avoid re-painting. Also *getElementsByClassName* is way faster than *querySelectorAll* and there are polyfills for both in case you need to cover older browsers that don't support these methods.


### Wrap-up

We are our biggest teachers, the person we are gonna to learn more from. If we are humble enough and open our eyes to see what could be done better we'll always be moving in the right direction. So if you have the time and opportunity to start a problem from scratch even when you've already done it, don't miss it, maybe you'll find out some concepts are not strongly set on you or that you're better than before.

Happy coding!
