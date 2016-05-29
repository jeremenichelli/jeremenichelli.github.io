---
layout: default
title: Patterns for a Promises based initialization
resume: When is your web site or app ready for usage? It could depend on scripts and styles being loaded, it might need an external API to be accessible, or all of them together. Having control over this situation could generate a heavy reliance on callbacks and one of the best ways to fight this asynchronicity are Promises.
---

*If you haven't checked Promises yet I recommend [the post Jake Archibald wrote][1] about them.*

Now, let's suppose we have a method named **initApp** we need to call when stuff is ready.

{% highlight javascript %}
function initApp() {
    // things to do when your app kicks off!
}
{% endhighlight %}

Why relying this on callbacks when your app is already using Promises?


## Scripts

The team from the Filament Group has already shown us how to properly load a script without blocking render in a browser, here's a simplified to version of it.

{% highlight javascript %}
function loadScript(url, callback) {
    var script = document.createElement('script');

    script.async = true;
    script.src = url;

    if (typeof callback === 'function') {
        script.onload = callback;
    }

    document.head.appendChild(script);
}
{% endhighlight %}

We could pass our method as the second argument of this helper and call it the day, but if you have more than one script and also need something else to be ready, like the DOM for example, you will need to use a set of callbacks and probably some **setInterval** statements which sounds like a place called hell to me.

Recalling one of the most used pattern we can wrap this in a Promise constructor and manage both loading and error events.

{% highlight javascript %}
function loadScript(url) {
    return new Promise(function(resolve, reject) {
        var script = document.createElement('script');

        script.async = true;
        script.src = url;

        // trigger fulfilled state when script is ready
        script.onload = resolve;

        // trigger rejected state when script is not found
        script.onerror = reject;

        document.head.appendChild(script);   
    });
}
{% endhighlight %}

To initialize our app just use **then** after calling **loadScript**.

{% highlight javascript %}
loadScript('/assets/scripts/app.js')
    .then(initApp);
{% endhighlight %}

**Promise.all** will come handy when multiple scripts need to be loaded.

{% highlight javascript %}
// create a Promise for each script
var appPromise = loadScript('/assets/scripts/app.js'),
    jqueryPromise =  loadScript('/assets/scripts/jquery.js');

Promise.all([ appPromise, jqueryPromise ])
    .then(initApp);
{% endhighlight %}

**initApp** will be called only when both scripts are ready.


## Styles

A similar approach can be applied when loading styles, but this time creating a **link** element.

{% highlight javascript %}
function loadStyles(url) {
    return new Promise(function(resolve, reject) {
        var link = document.createElement('link');

        link.rel = 'stylesheet';
        link.href = url;

        // trigger fulfilled state when stylesheet is ready
        link.onload = resolve;

        // trigger rejected state when stylesheet is not found
        link.onerror = reject;

        document.head.appendChild(link);   
    });
}
{% endhighlight %}

The same **Promise.all** pattern can be used for different resources.

{% highlight javascript %}
// create a Promise for each resource
var scriptPromise = loadScript('/assets/scripts/app.js'),
    stylesPromise =  loadStyles('/assets/styles/app.css');

Promise.all([ scriptPromise, stylesPromise ])
    .then(initApp);
{% endhighlight %}


## DOM ready

Trying to detect when the DOM has been completely parsed and move it to a Promise based algorithm will require the use of a different pattern, because of the nature of event listeners.

{% highlight javascript %}
document.addEventListener('DOMContentLoaded', function() {
    // document elements have been parsed!
});
{% endhighlight %}

This is forcing us to act inside a different scope where we can't return a Promise instance, one solution is to create a variable on top that can be both accessible by the Promises constructor and the event function.

{% highlight javascript %}
var domResolve,
    domReady = new Promise(function(resolve) {
        // expose fulfilled state holder to outer scope
        domResolve = resolve;
    });

// add event listener and trigger resolve when ready
document.addEventListener('DOMContentLoaded', domResolve);

// init app when ready
domReady.then(initApp);
{% endhighlight %}

The same can be done for the global load event.

{% highlight javascript %}
var appResolve,
    appReady = new Promise(function(resolve) {
        // expose fulfilled state holder to outer scope
        appResolve = resolve;
    });

// add event listener and trigger resolve when ready
window.addEventListener('load', appResolve);

// init app when ready
appReady.then(initApp);
{% endhighlight %}

Notice that we don't have a **reject** scenario for these two, for the simple reason that if one of these two never occur then something really bad happened.


## External resources

Your project could also depend on a library from a different origin or domain, which can be solved with the first recipe shown in this article, but some of them are not just ready for use when the script has been loaded.

Want an example? **Yes**.

If your app requires the **Google Maps JavaScript API** to work, you will need to load its script and provide the **API key** assigned for you.

{% highlight html %}
<script src="https://maps.googleapis.com/maps/api/js?key=API_KEY&callback=mapsResolve"></script>
{% endhighlight %}

Of course this verification causes a delayed ready state for its use, so we are also provided with a callback query parameter to pass a function name that will be executed when the API is available.

Turning this into an asynchronous event will be similar to the last pattern that was explored.

{% highlight javascript %}
var mapsResolve,
    mapsReady = new Promise(function(resolve) {
        // expose fulfilled state holder to outer scope
        mapsResolve = resolve;
    });

// init app when ready
mapsReady.then(initApp);
{% endhighlight %}

This time we are relying on another API to trigger the fulfilled state, that's way the resolve variable is exposed and passed on the **callback** query parameter, that's why is important to make sure the variable is available by the time the library is ready.


## Wrap-up

Doing this makes sense when your whole project architecture relies on Promises, giving it some consistency where we are usually forced to combine events, timing methods and callbacks.

{% highlight javascript %}
// resources
var scriptPromise = loadScript('/assets/scripts/app.js'),
    stylesPromise =  loadStyles('/assets/styles/app.css');

// maps
var mapsResolve,
    mapsReady = new Promise(function(resolve) {
        mapsResolve = resolve;
    });

// dom
var domResolve,
    domReady = new Promise(function(resolve) {
        domResolve = resolve;
    });

document.addEventListener('DOMContentLoaded', domResolve);

Promise.all([ scriptPromise, stylesPromise, domResolve, mapsResolve ])
    .then(initApp); // everything is ready, kick off!
{% endhighlight %}

It is important to mention that **load** and **error** events aren't supported by all browsers and loading resources asynchornously is a little more tricky than the methods exposed in this article.

I recommend checking Ryan Grove's table for [browser support on link and script events][2] and the Filament Group's approach on asynchronous loading in case you consider implementing a similar strategy in a production environment.

[1]: http://www.html5rocks.com/en/tutorials/es6/promises/
[2]: https://pie.gd/test/script-link-events/
