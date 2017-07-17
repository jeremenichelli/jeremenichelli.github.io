---
title: Object literal extensions in ES2015
resume: With the awake of a new JavaScript version making its way into modern browsers, one of the features you will find yourself using more often is the new syntax to manipulate object properties.
---

These are some of those new features that can come useful in the future or even today if you use a transpiler like [Babel][3].

## Initial declaration and properties

This is how you add a property present in a variable today.

```js
// ES5
var firstName = 'Charlie';
var lastName = 'Brown';

var student = {
  firstName: firstName,
  lastName: lastName
};

student.firstName; // 'Charlie'
```

In **ES2015** when the property is named as the variable that holds its value, you can directly place it inside the object declaration.

```js
// ES2015
let firstName = 'Charlie';
let lastName = 'Brown';

let student = {
  firstName,
  lastName
};

student.firstName; // 'Charlie'
```

An immediate consequence that you will notice in this first example, and the ones that will come later in this article, is how cleaner the new form looks.

You can also do something similar when declaring functions as properties.

```js
// ES2015
let firstName = 'Charlie';
let lastName = 'Brown';

let student = {
  firstName,
  lastName,
  getFullName() {
    return `${ this.firstName } ${ this.lastName }`;
  }
};

student.getFullName(); // 'Charlie Brown'
```

Through this article I will be using template strings, another awesome ES2015 feature. If this is the first time you hear or read about them I recommend checking the [MDN documentation][1].


## Computed property names

You can also generate a property name using any valid JavaScript expression inside square brackets.

```js
// ES2015
let student = {
  firstName: 'Violet',
  lastName: 'Gray',
  age: 10
};

let classroom = {
  [ `${ student.firstName }_${ student.lastName }`.toLowerCase() ]: student
}

classroom.violet_gray; // Object { firstName: 'Violet', lastName: 'Gray', age: 10 }
```

This can come really useful while mapping an array into a new object structure.


## Destructuring

Like an inverse syntax, we can break apart object properties and expose them into the current scope. Let's see how we are doing this right now.

```js
// ES5
var student = {
  firstName: 'Violet',
  lastName: 'Gray',
  age: 10
};

var first = student.firstName;
var last = student.lastName;
var age = student.age;
```

Enclosing variable declarations in brackets and referencing the properties from the object allows us to extract them, also rename them or just use the current property name as with **age** in here.

```js
// ES2015
let student = {
  firstName: 'Violet',
  lastName: 'Gray',
  age: 10
};

/*
 * Extracting firstName as first, age as age
 * and birthDate which is not present in the object
 */

let { firstName: first, age, birthDate } = student;

first; // 'Violet'
age; // 10
birthDate; // undefined
```

Trying to access a property that is not present in the object will safely return `undefined` as value without throwing any error.


## Wrap-up

The new version of JavaScript is coming to modern browsers faster as we probably thought, just check this [compatibility table][2] by Juriy ZaytsevIf about **ES2015** browsers support today.

That in addition to the fallen of legacy browsers and how mature the language is getting with this much needed update makes 2016 a good time to start getting familiar with these new features.


[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
[2]: https://kangax.github.io/compat-table/es6/
[3]: https://babeljs.io/
