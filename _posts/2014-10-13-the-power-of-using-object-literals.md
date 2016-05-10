---
layout: default
title: The power of using object literals
resume: For the last months I've found myself using this simple technic quite a lot. Here are some examples of what you can do with it and how I took advantage of its versatility.
---

## Object notation

One of the main caracteristics of JavaScript is that **almost** everything is an object. As you may know, or if you don't, you have two ways to access to an object property, both to read from it and write on it.

One is the dot notation *person.age*, the other one is the brackets notation that goes like this *person['age']* where **person** is the object and **age** the property you want to have access to.

In the second one we are passing the property as a string and that's the main reason why object literals are so useful and clean since strings are primitive values in JavaScript; this means you can compare them to take some different paths on your code.


## Use cases of object literals

### Storing and overriding default options

Sometimes functions and components need a lot of customization by the time they're called or when an instance of them is created and every customizable property or flag means an argument. When this number exceeds the number three I usually prefer an options object to handle this situation.

```js
var carousel = new Carousel(document.getElementById('photos'), {
    loop: false,
    time: 500,
    prevButton: 'previous',
    nextButton: 'next'
});
```

Here we are creating a new carousel instance and we're passing an HTML element and an object as parameters. Object literals are a good way to manage overriden default options inside the *Carousel* object.

First of all, we must create an object containing the default values.

```js
// default options
var dflt = {
    loop: true,
    time: 300,
    navigation: true,
    nextButton: '&gt;',
    prevButton: '&lt;'
};
```

Then we have to create a method that will compare the modified options object with the default one.

```js
function setOptions (options) {
    var newOptions = {};

    for (var opt in dflt) {
        newOptions[opt] = (typeof options[opt] !== 'undefined') ? options[opt] : dflt[opt];
    }

    return newOptions;
}
```

Using the *for in* iterator you loop on every key of an object and I've sent *dflt*, but in this case I'm searching for its keys inside the custom one. If the custom options object contains that key I save its value in a new object, in case it's not present I go for the default one. This approach is great because if you accidentally send an object with unnecessary option keys not contained on the default one they will be ignored.

This technic is used in <a href="https://github.com/jeremenichelli/vanish" target="_blank">vanish</a>, one of my repositories to handle carousels, in case you want to see how it works.


### Linking states to specific methods

Flags are very usual to save the state of something in your code so you can take different paths later through conditional statements.

If this flag is not boolean, meaning it could have more than two possible values, saving it as a string is a good decision. The reason is that you can call specific methods which are stored inside an object.

```js
var method = {
    active: function () {
        // do something for active state
    },
    inactive: function () {
        // do something for inactive state
    },
    waiting: function () {
        // do something for the waiting state
    }
};

// assuming getState returns a string
var state = getState();

method[state](); 
```

Doing this is convenient because you avoid doing this not-so-good approach.

```js
function isActive() {
    // do something for active state
}

function isInactive() {
    // do something for inactive state
}

function isWaiting() {
    // do something for waiting state
}

var state = getState();

if (state === 'active') {
    isActive();
} else if (state === 'inactive') {
    isInactive();
} else {
    isWaiting();
}
```

Not only the code is ugly, but is not future proof. If at some point another state needs to be supported you will have to nest another *if* statement. Using object literals you would only need to add a new function to the **method** object making the code clearer and easier to maintain.

I use a similar structure in <a href="https://www.github.com/jeremenichelli/steer" target="_blank">steer</a>.


### Data binding 

Injecting large amount of data into an HTML Document can be hard to do in a clean a simple way. A nice choice is to solve this using *data* attributes in the elements and object literals.

```js
var data = {
    name: 'Alan Turing',
    age: '58',
    field: 'Computing Science',
    job: 'professor',
    place: 'Cambridge'
};

for (var property in data) {
    var selector = '[data-' + property + ']',
        element = document.querySelector(selector);

    if (element) {
        element.innerHTML = data[property];
    } 
};
```

Using again the *for in* iterator, we look for HTML elements with a data attribute that makes reference to a certain property, for example *&lt;p data-name&gt;&lt;/p&gt;*. When the iterator falls on the **name** property it will get the paragraph element and inject the name value inside of it.

It's a pretty simple case but a good way to show how powerful is to have access to the keys of an object as a string so they can be manipulated and extend funcitonality in your code.

This approach is used in this weather widget I did call <a href="https://github.com/jeremenichelli/condense" target="_blank">condense</a>.


### Generating dynamic callbacks

If your dealing with a web app that needs to do JSONP calls, using object literals could help you store the callback to obtain the data.

Just create a base name and an integer to increase everytime you make a call to the API that will compound the final callback name. With the brackets notation you can store the new callback as a string key in a global variable like *window*, though it would be safer to use a namespace. Depending on the API documentation you will also need to specify the callback name in the url of the request.

```js
var cName = 'apicall',
    cNumber = 0;

var _getData = function (baseUrl, callback) {
    var script = document.createElement('script'),
        callbackId = cName + cNumber;

    // increase callback number
    cNumber++;

    // make padding method global
    window[callbackId] = function (data) {
        if (typeof callback === 'function') {
            callback(data);
        } else {
            console.error('You must specify a method as a callback');
        }
    };

    script.src = baseUrl + '&callback=' + callbackId;
    document.head.appendChild(script);
};

```

These lines belong to a simple script I developed to make JSONP calls that, for some unknown reason I named <a href="https://www.github.com/jeremenichelli/jabiru" target="_blank">jabiru</a>. I wrote <a href="/2014/09/south-american-bird-cross-domain-calls/" target="_blank">a post about it</a> if you're interested on cross domain requests.


## Wrap-up

That's it, I hope you find these approachs useful. Happy coding!
