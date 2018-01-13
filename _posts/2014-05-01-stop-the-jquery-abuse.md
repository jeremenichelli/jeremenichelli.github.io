---
title: Stop the jQuery&nbsp;abuse!
date: 2014-05-01
resume: I've spent most of my time as a front-end developer building web pages that reach people from all around the globe. Most of that time was when I was working at Globant. All of the sites I helped build there have one particular thing in common&#58; jQuery.
---

This isn't exactly a bad thing. It's an architectural decision and those projects I worked on had an Architect indeed and he or she decided that we should use jQuery. The bad thing is that developers -and architects- that use this popular library don't make themselves these questions: Why? What version? What parts of jQuery are we going to use? We are going to pick that third question later.

## jQuery is huge

One of the main reasons jQuery became popular is their slogan: **write less, do more**. The scope of the library covers mostly everything you need to do in a web page. DOM manipulation, classes, events, iterators, animation, ajax and more specific features. All of this assuring a cross-browser functionality that sometimes is really hard to achieve.

That involves a lot of lines of code and there are a lot of features implemented there, but do you really need all of those features and fallbacks?

One of the projects in which I have to use jQuery a lot was StateFarm. They wanted to cover a lot of browsers and without this library it would have been really hard. We needed to make sure that the page worked on most of Android devices, old iOS and even Internet Explorer 7.

Given the amount of work we had to do and that we had junior developers on the team, yes I would have used jQuery. Of course, this wasn't the only project I've worked there, so let's go back to that third question...

## What parts of jQuery are you going to use?

Every architech, tech lead and freelance developers have to make themselves this question with every framework or library that's going to be included in the project. It's a must.

Class manipulation is one of the most used features in jQuery, but don't browsers already know how to lead with classes in HTML Elements?

**The answer is yes**. Of course one of the problems is that [classList is not supported in some browsers](http://caniuse.com/classlist), but does your project support these browsers?

If your answer is no then you can use classList. If the answer is yes then, why not build a specific shim to cover this instead of adding a library that does a lot of things that you're not going to use? Doing this will decrease the page load time and if the browser can use classList you'll see that [performance also improves](http://jsperf.com/classlistvsjquery).

Going back to StateFarm project we had to cover Web ARIA features and that involves modifing attributes a lot, so using `attr()` jQuery function was very common. The thing is that **browsers already know how to handle this** with this two functions:

```js
// get an attribute value
var someValue = element.getAttribute("attribute_name");

// set an attribute value
element.setAttribute("attribute_name", "new_value");
```

These are only two examples of things that jQuery adds as a feature that most of the browsers already have.


## Wrap-up

Like **classList** there are a lot of features that browsers already have and that don't need to be re-invented. With mobile users increasing year by year, loading times and performance are things you have to think about before introducing libraries into your project's scope.

**I'm not saying that you shouldn't use jQuery at all**, but asking youserlf questions like what browsers you need to cover or what features from jQuery or other library you need won't hurt for sure.

Just think for a moment if you're really going to use all the scripts you are loading on your project and if it makes sense to keep them there.
