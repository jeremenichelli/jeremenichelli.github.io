---
title: Passing code snippets to markdown generated
layout: post
resume: Code snippets from posts previous to markdown implementation
---

### Stop the jQuery abuse!

```js
// get an attribute value
var someValue = element.getAttribute("attribute_name"); 
// set an attribute value
element.setAttribute("attribute_name", "new_value"); 
```

### Primitive values and objects

```js
primitive_one = 2;
primitive_two = 2;
(primitive_one == primitive_two)
// returns true
object_one = {};
object_two = {};
(object_one == object_two)
// returns false
```

```js
var f = new Function();
typeof f
// returns 'function'
```

```js
f instanceof Object
// returns true
```

```js
var Person = function(string, n){
    this.name = string;
    this.age = n;
}
var me = new Person('Jeremias', 27);
```

```js
typeof me
// returns 'object'
me instanceof Person
// returns true
```

```js
Person.prototype.salutation = function(){
    return 'Hi! My name is ' + this.name + ' and I am ' + this.age + ' years old.';
};
me.salutation();
// returns 'Hi! My name is Jeremias and I am 27 years old.'
```

### Classic inheritance vs. prototypal inheritance

```js
// Person object constructor
var Person = function(name, age, city, state, country){
    this.name = name;
    this.age = age;
    this.city = city;
    this.state = state;
    this.country = country;
};
Person.prototype.salutation = function(){
    return 'Hi! My name is ' + this.name + ' and I am ' + this.age + ' years old.';
};
Person.prototype.getLocation = function(){
    return 'I live in ' + this.city + ', ' + this.state + ', ' + this.country + '.';
};
var me = new Person('Jeremias', 27, 'San Lorenzo', 'Santa Fe', 'Argentina');
```

```js
var you = new Person();
```

```js
// Person object constructor
var Person = function(name, age, city, state, country){
    this.name = name;
    this.age = age;
    this.city = city;
    this.state = state;
    this.country = country;
    this.salutation = function(){
        return "Hi! My name is " + this.name + " and I am " + this.age + " years old.";
    }
}
```

```js
// Person object
var Person = {
    name : undefined,
    age : undefined,
    city : undefined,
    state : undefined,
    country : undefined,
    salutation : function(){
        return 'Hi! My name is ' + this.name + ' and I am ' + this.age + ' years old.';
    },
    getLocation : function(){
        return 'I live in ' + this.city + ', ' + this.state + ', ' + this.country + '.';
    }
}
```

```js
// clone function
function clone(obj){
    function F(){};
    F.prototype = obj;
    return new F;
}
```

```js
var me = clone(Person);
```


### Manipulating classes on DOM elements and the Facade pattern

```js
var nav = document.getElementById('navigation');
// Adds a class
nav.classList.add('hidden');
// Removes a class
nav.classList.remove('hidden');
// Checks if an element has a class, in this case it'll return false
nav.classList.contains('hidden');
// Toggles a class
nav.classList.toggle('hidden');
```

```js
var addClass = function(el, cl){
    if(document.documentElement.classList){
        el.classList.add(cl);
    } else {
        el.className = el.className + ' ' + cl;
    }
}
```

```js
var nav = document.getElementById('navigation');
// Add 'hidden' class to the nav element
addClass(nav, 'hidden');
```

```js
var addClass;
if(document.documentElement.classList){
// call classList inside addClass method
    addClass = function(el, cl){
        el.classList.add(cl);
    };
} else {
    // fallback for classList.add
    addClass = function(el, cl){
        el.className = el.className + ' ' + cl;
    };
}
```

```js
var els = HTMLElement || Element,
    addClass;
if(document.documentElement.classList){
    els.prototype.addClass = function(cl){
        this.classList.add(cl);
    };
} else {
    els.prototype.addClass = function(cl){
        this.className = this.className + ' ' + cl;
    };
};
// Add 'hidden' class to the nav element
var nav = document.getElementById('navigation');
nav.addClass('hidden');
```

### Writing Chronos

```js
var now = new Date();
now.getDate(); // returns 2
now.getDay();
// returns a number depending on the day
// 0 for Sunday, 1 for Monday and so on. In this case, 6 for Saturday
now.getFullYear(); // returns 2014
now.getHours(); // returns 19
now.getMinutes(); // returns 35
now.getSeconds(); // returns 34
now.getMilliseconds(); // returns 191
now.getMonth();
// returns a number depending on the month starting with 0 for January
// in this case, 7 for August
now.getTimezoneOffset();
// returns minutes of difference between local time and the Greenwich Mean Time
// in this case, 180 because I'm in Argentina, GMT -3hs. Note: It's always positive!
now.getYear(); // returns 114, the number of years since 1900
```

```js
function renderView(){
    // lots of lines of code
    controllerTimer.checkpoint('view rendered');
};
```

```js
Controller view rendered // lapse: 0min 2s 712ms // interval: 0min 0s 484ms
```

```js
var now = new Date();
var diff = now.getTime() - this.initDate.getTime();
```

```js
var minutes = Math.floor(diff/60000);
```

```js
var minutes = Math.floor(diff/60000);
diff - minutes*60000; // subtracting minutes in milliseconds
var seconds = Math.floor(diff/1000);
diff - seconds*1000; // subtracting seconds in milliseconds
```

```js
console.log(minutes + 'm ' + seconds + 's ' + diff + ' ms');
// 1m 10s 345ms
```

```js
controllerTimer.report('final');
```

```
Controller final report:
 - Controller requesting info // lapse: 0min 0s 12ms // interval: 0min 0s 12ms
 - Controller received info // lapse: 0min 0s 612ms // interval: 0min 0s 600ms
 - Controller starts parsing results // lapse: 0min 1s 492ms // interval: 0min 0s 880ms
 - Controller parsing results finished // lapse: 0min 1s 910ms // interval: 0min 0s 418ms
 - Controller rendering view // lapse: 0min 2s 228ms // interval: 0min 0s 318ms
 - Controller view rendered // lapse: 0min 2s 712ms // interval: 0min 0s 484ms
```


### Don't solve a problem, solve the problem

```js
var minutes = Math.floor(milliseconds/60000);
milliseconds - minutes*60000; // subtracting minutes in milliseconds
var seconds = Math.floor(milliseconds/1000);
milliseconds - seconds*1000; // subtracting seconds in milliseconds
```

```js
// object storing units
var units = {
    minutes: 60000,
    seconds: 1000
};
// extracting values looping the units object
function getValues(){
    var result = {};
    for (var key in units) {
        result[key] = Math.floor(milliseconds/units[key]);
        milliseconds = result[key]*units[key];
    };
    return result;
}
```

```js
var units = {
    hours: 3600000,
    minutes: 60000,
    seconds: 1000
}; 
```

```js
function startLoop(){
    if (sliderElements.length > 1) {
        slider.showNavigation(); // show navigation buttons
        slider.showThumbnails(); // show thumbnails
        slider.loop(); // start looping the content inside the slider
    }
};
```