---
layout: default
title: Getting an object property from a string
resume: One of the puzzles I had to solve when writing a data binding script was how to get the value of a property from the value of an attribute. As always, I decided to go my own way before looking for other solutions.
---

The result was very good so I forgot to look at third party solutions. Later I did a little investigation and found some resources that provide solutions to this riddle. Here's my approach.

## Getting the attribute of a node

The start point for this is a *node* object which has a property called *attributes*, an array-like list with all the attributes of the element. Pretty obvious so far.

```js
var node = document.getElementById('sample-element');
var attrs = node.attributes;
var sampleAttr = attrs[0];
```

The value of this attribute is accessible by doing *sampleAttr.value*. When you're using a data binding library (or writing one) you get something like this *'user.name.first'*.

```js
var model = {
  user: {
    name: {
      first: 'John',
      last: 'Oliver'
    }
  }
};
```
Now the question is how we could get the value *'John'* given this model and the string *'user.name.first'*.

```js
function getFromPath(obj, path) {
  var props = path.split('.');
  var newObj = obj;

  for (var i = 0, len = props.length; i < len; i++) {
    if (newObj[props[i]] !== null && newObj[props[i]] !== undefined) {
      newObj = newObj[props[i]];
    } else {
      return null;
    }
  }

  return newObj;
}
```

Basically what we're doing is splitting the string to get an array of properties, in this case *user*, *name* and *first*. Then we're looping this array and if the value exists in the base object we override it.

It's not hard to understand this since it's a simple loop and we are getting more deeply into the object with each iteration until there are no properties left to explore. If we pass to the function a path like *'user.name.middle'* the code will get an *undefined* value and return *null* breaking the iteration.


## Modules and libraries

It doesn't get mentioned a lot, but <a href="https://lodash.com/" target="_blank">lodash</a> is a really nice library that solves a lot of things for you in the operations with objects area. This library contains a method called *get* which solves the exact same thing and you can find it in its <a href="https://github.com/lodash/lodash/blob/master/lodash.js#L9386" target="_blank">github file</a>.

A not so popular **npm module** called <a href="https://www.npmjs.com/package/delve" target="_blank">delve</a> also tackled this problem.

A good thing about **lodash**'s approach is that it lets you pass a default value as fallback if the property is not found. That's something we can easily add to the first approach.

```js
function getFromPath(obj, path, defaultValue) {
  var props = path.split('.');
  var newObj = obj;

  for (var i = 0, len = props.length; i < len; i++) {
    if (newObj[props[i]] !== null && newObj[props[i]] !== undefined) {
      newObj = newObj[props[i]];
    } else {
      return defaultValue || null;
    }
  }

    return newObj;
};

var model = {
  user: {
    name: {
      first: 'John',
      last: 'Oliver'
    }
  }
};

var middleName = getFromPath(model, 'user.name.middle', 'William');
// middleName value is "William"
```

## Performance

Looking for a brief code that solves this, **lodash** uses *while* to iterate the base object, and while *while* is shorter than using *for*, the speed difference is huge. Yes, I put while twice there.

As a consequence, *delve* and my first approach itself are faster than *lodash* approach and <a href="http://jsperf.com/lodash-get-vs-monster-method/2" target="_blank">perform better</a>.

I'm seeing a lot of solved-in-one-line approaches that work like a magic trick, and actually solve the problem which is great, but they are not the best choices if you're taking performance in account. Remember that when the code is minified and gzipped the differences in using a *while* loop or a *for* loop are just bytes, but speed can get really affected.

If you look at **delve** code you'll notice that it also uses *while*. The reason why **delve** is faster than **lodash** when they are both using similar approaches is that the second one contains other methods that are used by more than one public function, so it makes sense to have them there but they might cause <a href="http://jsforallof.us/2014/09/19/hoisting/" target="_blank">hoisting</a> and larger code too.

Obviously if you use this method just a couple of times it won't hurt a lot, but you can be sure that this functionality will be called **a lot of times** in a data binding library.


## Wrap-up

Libraries are good (**lodash** is great in my opinion) it solves a lot of problems, but they also contain general private methods and no so performant choices that can slow down the execution of simple operations.

In case you need it, my approach is in this <a href="https://gist.github.com/jeremenichelli/63b75db9434272b16d1d" target="_blank">gist</a>.

And yes, I love John Oliver.
