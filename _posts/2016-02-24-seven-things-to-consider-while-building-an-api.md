---
layout: post
title: Seven things to consider while building an API
resume: The methods that are exposed in a library and what they actually do, can force the developer to follow bad practices and generate anti patterns. The consequences can be huge, that's why the design of the programming interface is crucial, even in the smallest cases.
---

*You will find some links hidden, and not so hidden, in the text that make references to modules or libraries where I've applied a given philosophy.*

## 1. Be atomic

Exposed methods should do one thing, solve one problem. If you want to provide more solutions out-of-the-box you can group different public functions in a new method.

This way the developer can choose to give your code partial or full control of the situation.


## 2. Leave a back door open

Don't force the developer to do things one way, it's hard to imagine every use case. Providing options and some configuration will give versatility to your library.


### steer

Here's a good example of these two principles working together. I was building a library to run code when the user changes the scrolling direction and I knew that I needed to do some stuff during the scroll event, but what if the developer also needs to execute some stuff and prefers to group what happens on scrolling, or use the library logic under a condition?

To allow this the function that will be executed during scrolling is also accessible on its own through the API *(1)*, instead of being private. In addition to that, an `events` option can be passed as `false` when the module is initialized *(2)*, and you can <a href="https://github.com/jeremenichelli/steer#steertrigger" target="_blank">call the method inside your own event architecture</a>.


## 3. Arguments count

If a method needs more than two arguments to work, use a configuration object. This will result in cleaner code inside and outside your module and will allow you to take advantage of object literals and <a href="https://github.com/jeremenichelli/scrollProgress/blob/master/dist/scrollProgress.js#L58" target="_blank">simplify any necessary sanity check</a>.


## 4. Throwing errors is good

Errors are a natural part of a programming language and in JavaScript they even have their own constructor. I generally see plugins trying to avoid them.

Use them to <a href="https://github.com/jeremenichelli/mnster/blob/master/dist/mnster.js#L179" target="_blank">inform the developer why their code is failing</a> while your library is in use.


## 5. Keep general stuff private

If it's not going to cause an over engineering, having a couple of private methods solving more general stuff with behavior flags will shrink the final size of the library and actually <a href="https://github.com/jeremenichelli/vigenere/blob/master/src/vigenere.js#L69" target="_blank">improve the readability</a> for potential contributors.


## 6. Allow chaining

Whenever possible, <a href="https://github.com/jeremenichelli/jabiru/blob/master/src/jabiru.js#L73" target="_blank">return the namespace of your module</a>, it's a great option for developers.


## 7. Just solve one problem

I think this is the most important advice on the list, because it can lead to multiple solutions in the same project, ergo duplicated code.

A lot of libraries that claim to solve one thing for example, detect when a DOM element becomes visible while scrolling, and later exposing a method to change or add a class to that element.

Unless we're talking about a jQuery plugin, there is a high change you are using another library or a helper function to solve cross browsing implicance on class manipulation. 

If that's the case then your web project will hold two different solutions for it, the one inside the library and yours.

Your library should hold the code to solve one specific thing, avoid populating its API with methods for possible use cases. Focus on keep it short and clear and provide nice documentation showing examples on how your stuff can be used to solve these common scenarios.


## Wrap-up

These seven philosophies are the consequence of building my own vanilla solutions for projects I've been present, maybe your experience lead you to different conclusions.

So, they are not universal rules you must follow, but they might help while coding modules that will be used by other developers or different projects.
