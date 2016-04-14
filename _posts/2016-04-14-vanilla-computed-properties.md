---
layout: post
title: Vanilla computed properties
resume: A feature available in almost every framework today is the ability to some how generate computed properties from existing data, but isn't JavaScript already capable of doing that?
---

Libraries today offer you the capability to express complex expressions and operations as objects properties like [VueJS][1] does here.

{% highlight javascript %}
var me = new Vue({
    data: {
        firstName: 'John',
        lastName: 'Oliver'
    },
    computed: {
        fullName: function() {
            return this.firstName + ' ' + this.lastName;
        }
    }
});

me.fullName; // John Oliver
{% endhighlight %}

*I have nothing against VueJS and it is actually used in this article because its simplicity in comparison with other libraries and frameworks.*

## Defining properties

The natural response for this kind of situation has been around for quite some time and it's even supported by **Internet Explorer 9**.

We are used to define properties through dot notation, but it's good to keep in mind the existence of `defineProperty` native solution since it brings some useful features.

The `Object.defineProperty` method accepts a base object as the first argument, the property key string and a descriptor object.

{% highlight javascript %}
var me = {
    firstName: 'John',
    lastName: 'Oliver'
};

Object.defineProperty(me, 'age', {
    value: 45,
    configurable: false,
    enumerable: false,
    writeable: true
});
{% endhighlight %}


### configurable

When set to *false* prevents the property from being deleted and it will throw an error on **strict**.


### enumerable

Makes the property visible while iterating through the object properties.


### writeable

The property will be *read-only* if this option is *false*.


## Getters and setters

In addition to these options, we can also define operations that will run when the property is being both **get** and **set**, and the first one is what we are looking for to mimic the behavior from our first framework snippet.

{% highlight javascript %}
var me = {
    firstName: 'John',
    lastName: 'Oliver'
};

Object.defineProperty(me, 'fullName', {
    enumerable: true,
    writeable: false,
    get: function() {
        return this.firstName + ' ' + this.lastName;
    }
});

me.fullName; // John Oliver
{% endhighlight %}

This feature is really powerful when combined with prototyped constructors.

{% highlight javascript %}
var Circle = function(r) {
    this.radius = r;
    this.diameter = r * 2;
};
{% endhighlight %}

Doing this makes it possible to modify the **diameter** property on any `Circle` instance, breaking the arithmetical relation it has with the **radius** value.

{% highlight javascript %}
var Circle = function(r) {
    this.radius = r;
};

Object.defineProperty(Circle.prototype, 'diameter', {
    enumerable: true,
    writeble: false,
    get: function() {
        return this.radius * 2;
    }
});
{% endhighlight %}

Defining the **diameter** this way fixes the possibility of inconsistence data.


## Multiple definition

In some cases we need to define more than one property, hopefully there is another similar method available to prevent duplicated code for the same action.

{% highlight javascript %}
var Circle = function(r) {
    this.radius = r;
};

// define computed values
Object.defineProperties(Circle.prototype, {
    diameter: {
        writeable: false,
        get: function() {
            return this.radius * 2;
        }
    },
    circumference: {
        writeable: false,
        get: function() {
            return this.diameter * Math.PI;
        }
    },
    area: {
        writeable: false,
        get: function() {
            return Math.pow(this.radius, 2) * Math.PI;
        }
    }
});

// create circle instance
var example = new Circle(1.75);

example.diameter // 3.5
example.circumference // 10.99557
example.area // 9.62112
{% endhighlight %}

This time we just need two arguments, a base object and a descriptor containing the properties.


## Native evolution

This is not an article to bash on frameworks. They exist because there's a need of building more complex software structures inside web browsers.

And as **jQuery** once appeared because we needed a better DOM manipulation API, frameworks are around because today there isn't a clear and straight way to produce a solid architecture for complex web apps without big compromises.


## Wrap-up

While it's great to have nice and popular libraries, they add an abstraction layer to the language.

This is great when people are doing their first steps in web programming, but it's good to later explore the native capabilities of JavaScript to extend the knowledge we have of its API and prevent us from adding code when it is not needed.

[1]: http://vuejs.org/guide/computed.html
