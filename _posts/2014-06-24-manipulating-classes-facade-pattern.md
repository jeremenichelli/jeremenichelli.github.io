---
title: Manipulating classes using the Facade&nbsp;pattern
resume: One of the things that we do very often in a web project is change the class attribute on HTML elements. There are millons of ways of doing this. Here is the one I developed using the Facade pattern as a start point.
---

It's known that there are a lot of libraries like jQuery that simplify this task, [but as I said in a previous post](/2014/05/stop-the-jquery-abuse) sometimes adding a whole library that does a lot of things when you only need assistance in a couple of them does not make sense.

Why do we ussually add a library to do this? Does not the browser already provide us of ways to achieve this? The answer is yes.

## classList

Modern browsers include an API that allows us to do all we need regarding classes, its name is [classList](https://developer.mozilla.org/en-US/docs/Web/API/Element.classList).

If you don't know it yet, it provides us with `add`, `remove`, `contains` and `toggle` methods, and it has a great performance.

```js
var nav = document.getElementById('navigation');

// adds a class
nav.classList.add('hidden');

// removes a class
nav.classList.remove('hidden');

// returns a boolean indicating if the element contains the class name
nav.classList.contains('hidden');

// toggles a class
nav.classList.toggle('hidden');
```

The only problem in the last paragraph I wrote is one word: modern.

Before you even think of it, let's just say it, the problem is Internet Explorer and its old versions that some users still use. In fact, [classList](http://caniuse.com/classlist) has a nice support, but if your code must work properly in version 8 and 9 of Internet Explorer then you won't be able to use it. _Well, maybe you will._

## The Facade pattern

You've may never heard of it before, but I'm pretty sure you've seen it or even used it. The facade pattern is very common in web development since it simplifies some complex stuff from your code in an elegant way.

In order to show how a facade pattern implementation works, let's use it to create a function that detects if **classList** is available for use in case we want to add a class.

```js
var addClass = function(el, cl) {
  if (document.documentElement.classList) {
    el.classList.add(cl);
  } else {
    el.className = el.className + ' ' + cl;
  }
}
```

We've created a function that takes an element and a string for the class we want to add as arguments. If the **classList API** is supported the `add` method is called, if it's not then a fallback that works too is provided.

This fallback is way slower, but using this pattern allows us to take advantage of **classList** and its great performance whenever it's possible.

Now, you don't have to check if a feature is available for use every time, you just call a function and the result is a cleaner and more readable code.

```js
var nav = document.getElementById('navigation');

// add 'hidden' class to the nav element
addClass(nav, 'hidden');
```

Another thing that's great about this approach is that as modern browsers improve **classList** performance your code itself will get better but still work on old browsers.

## A workaround for facades

One of the things that I don't like about a facade implementation is that the feature existence will be consulted as many times as you call the method.

This means that if you invoke our `addClass` function ten times, our code will check ten times if **classList** is available for use.

So why don't just check it just once?

```js
var addClass;
if (document.documentElement.classList) {
  // call classList inside addClass method
  addClass = function(el, cl) {
    el.classList.add(cl);
  };
} else {
  // fallback for classList.add
  addClass = function(el, cl) {
    el.className = el.className + ' ' + cl;
  };
}
```

As you see we only do the checking part once.

You still call `addClass(nav, 'hidden')` as you did before, the only difference is that it will perform better now.

This code works on Internet Explorer 7, and even in older versions, but if your support starts from version 8 you could even `prototype` this method and improve more the performance. Remember that `prototype` method is not supported in Internet Explorer 7... **yeah, buuuh!**

```js
var els = HTMLElement || Element;

if (document.documentElement.classList) {
  els.prototype.addClass = function(cl) {
    this.classList.add(cl);
  };
} else {
  els.prototype.addClass = function(cl) {
    this.className = this.className + ' ' + cl;
  };
}

// add 'hidden' class to the nav element
var nav = document.getElementById('navigation');
nav.addClass('hidden');
```

**Is it just me or that looks prettier?** Since some versions of Internet Explorer have the _Element_ word to make reference to the DOM element object we have to make that assignment in the first line to make sure we are prototyping the correct one. The variable _els_ will make reference to _HTMLElement_ unless is **undefined**, falling back to _Element_.

## Wrap up

The result of this exploration was [classing](https://github.com/jeremenichelli/classing). It checks only once if **classList** exists and it has fallback for adding, removing, toggling and a `hasClass` method to check if the class is contained. It has a lot of place for improvement so feel free to check it out and suggest changes.

Happy coding!
