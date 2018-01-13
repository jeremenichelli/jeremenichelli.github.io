---
title: Primitive values and&nbsp;objects
resume: One of the main differences that Javascript has with other languages is that it's dynamically typed and based on prototypal inheritance while most of object-oriented languages have classical inheritance.
---

This is a small resume on how JavaScript deals with variables, primitives and specially with objects and constructors on the upfront.

## Primitives

Though you can assign any value to any variable across all the scope, JavaScript has something similar as types in other languages. The difference is that you don't have to specify its type when you declare a new variable. These are the reasons why it is considered a dynamically typed language.

For JavaScript everything is an object, except for: **booleans**, **numbers**, **strings**, **null** and **undefined**.

This group of variable types are called **primitive values**, and its main difference from objects is that they are comparable...

```js
primitive_one = 2;
primitive_two = 2;
(primitive_one == primitive_two) // returns true

object_one = {};
object_two = {};
(object_one == object_two) // returns false
```


What the lines from above are clearly showing is that everytime you create something that JavaScript considers an object, is a stand-alone instance of some other object. Even if they are both empty or have the same keys with the same values, they will always be two different objects.


## Reserved words

As every language JavaScript has words that you can't use like `class`, `delete`, `else`, `export` `false`, `finally`, `for`, `function` and many others.

There are also other words that are not reserved but it's recommended you treat them like they were: `Infinity`, `NaN` and `undefined`.


## Objects

Everything in JavaScript that is a nonprimitive variable, is an **object**, as I said previously, and they are a big thing.

Let's use _typeof_ and _instanceof_ to investigate a little bit about how objects are defined. It's not that common, but let's declare a function using _new_.

```js
var f = new Function();
typeof f // returns 'function', right?
```

Well that's kind of something we would expect, right? Function is the constructor for functions. Now, let's try this...

```js
f instanceof Object // returns true
```

Hey, what's that? Well as I told, everything that's not a primitive is an object, so functions are objects. And a special branch of them because functions are also constructors, so any object has a constructor, that constructor is a function that initialize all keys and methods in a new object.


### Function as constructors

I know it's a little bit confusing so let's build a quick example of this.

```js
var Person = function(string, n) {
  this.name = string;
  this.age = n;
}

var me = new Person('Jeremias', 27);
```

_As a convention function representing constructors are capitalized._

Functions in combination with the word `new` allows us to shape new objects.

You might have noticed the word `this`, its behaviour is very rare some times; here it makes reference to the object you're instantiating.

```js
typeof me // returns 'object'

me instanceof Person // returns true
```

How to add methods to objects? The best way to do this is using populating the `prototype` property, this will let all the instances share the same reference for the method, using less memory.

```js
Person.prototype.salutation = function(){
  return 'Hi! My name is ' + this.name + ' and I am ' + this.age + ' years old.';
};

me.salutation(); // 'Hi! My name is Jeremias and I am 27 years old.'
```

And that's how you create your own constructor. In fact, **constructor** is a key that all objects have, so if you go to the console and write `me.constructor` you should get a reference to the `Person` function we wrote earlier.


## Wrap up

This was a quick and very brief reference on how JavaScript handles variables and objects. There's a lot of things I want to write about, but I'm sure that one of the next posts will be about the differences between the protoypal and the classic inheritance on objects, so stay tune! Happy coding.
