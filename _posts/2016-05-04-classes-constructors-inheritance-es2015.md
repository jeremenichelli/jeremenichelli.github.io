---
title: Classes, constructors and inheritance in&nbsp;ES2015
resume: Understanding prototype inheritance was one of the pain points in JavaScript development. One of the main reasons was that the language didn't provide a nice syntax that translated this programming concept in a straight manner.
---

Let's remember the way we are writing constructor functions today.

```js
// ES5

// constructor function
function Circle(r) {
  this.radius = r;
}

// prototyped method
Circle.prototype.getCircumference = function() {
  return this.diameter * Math.PI;
};

// computed property
Object.defineProperty(Circle.prototype, 'diameter', {
  get: function() {
    this.radius * 2;
  }
});
```

As you might have noticed there are three independent statements to define different instance properties. This example shows a class with two properties and one method, but this decoupling on big objects can affect your code in a really bad way.

## class

In order to avoid this, the new standard defines a `class` reserved word which acts as a declaring block for prototyped methods and properties.

```js
// ES2015

class Circle {
  // constructor function
  constructor(r) {
    this.radius = r;
  }

  // prototyped method
  getCircumference() {
    return this.diameter * Math.PI;
  }
}
```

Though it's not declared using parenthesis **Circle** is still a function, but now all the stuff that happens when a new instance is created must be moved to the **constructor** method inside the **class** block.

Any method you add inside that block, as **getCircumference** in our example, will be assigned to the prototype of the class.


### getters and setters

Thanks to this new access to the prototype of the constructor and the **get** and **set** special words we don't necessarily have to use `Object.defineProperty` for computed properties.

```js
// ES2015

class Circle {
  // constructor function
  constructor(r) {
    this.radius = r;
  }

  // prototyped method
  getCircumference() {
    return this.diameter * Math.PI;
  }

  // computed property
  get diameter() {
    this.radius * 2;
  }
}

let sample = new Circle(5); // same as in ES5

sample.diameter; // 10
sample.getCircumference(); // 31.41592
```

With this new notation everything related to the **Circle** class gets declared inside the same block which is way better to read and quicker understand.


## Inheritance

Generating a long prototype chain was literally a mess and if you got the chance to take part on a variety of projects you probably saw each of them had a **clone** or an **inherit** to make things look a little bit more organized.

This time, our new friends on the neighbourhood are **extends** and **super** words, they will make inheritance an easy thing to track through our code base.

```js
// ES2015

class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  get area() {
    return this.height * this.width;
  }
}
```

Talking just a little bit about geometry and shapes, squares are rectangles which height equals its width. We can *extend* our already existing class and inherit useful methods and properties.

```js
// ES2015

class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  get area() {
    return this.height * this.width;
  }
}

class Square extends Rectangle {
  constructor(side) {
    super(side, side);
  }
}

let sample = new Square(3.5);

sample.height; // 3.5
sample.width; // 3.5
sample.area; // 12.25
```

Using **super** we execute the constructor method from the class we are extending, avoiding duplicated code or helper functions.

It can also work as a namespace for calling inherited methods.

```js
// ES2015

class Person {
  constructor(name) {
    this.name = name;
  }

  salute() {
    return 'Hi! My name is ' + this.name;
  }
}

class Doctor extends Person {
  constructor(name) {
    super(name);
  }

  salute() {
    return super.salute() + ' and I am a Doctor!';
  }
}

let greg = new Doctor('Gregory');

greg.salute(); // 'Hi! My name is Gregory and I am a Doctor!'
```

All the code inside a class declaration is executed in *strict mode*, no way to get around that.

Also, *hoisting* is not possible as it was with function expressions, you are obliged to declare a class before trying to create an instance of it.


## Wrap-up

JavaScript is becoming a more mature language not only adding more features but also solving syntax complexity from its previous version and forcing *strict* coding in sensible places.

This encourages developers to use more native solutions rather than helper functions that can cause fragmentation of approaches between different projects.
