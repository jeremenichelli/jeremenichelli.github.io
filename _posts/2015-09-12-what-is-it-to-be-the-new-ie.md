---
layout: post
title: What is it to be the new IE?
resume: In the last couple of months some blog posts emerged complaining about Safari and Chrome, and for some reason not Firefox. The first one was Nolan Lawson's post about Safari's lag to implement some features present in modern browsers, saying that Safari is the new IE. Later, Benjamin De Cock said that Chrome was the new IE, but what does that exactly mean?
---

If you are a web developer, a front end more specifically, you work with CSS to style your projects, JavaScript to add behavior and of course you use HTML to show content. I don't know you but I really like my job, I decided to do this every day and I don't regret it.

There's a quote from Confucius that is pretty popular, *"Choose a job you love, and you will never have to work a day in your life"* and I totally agree with this, but at some point I had to support old versions of Internet Explorer and it began to feel like work again.

Most of the complaints are related to some basic and well received JavaScript methods that Internet Explorer didn't have out of the box, like **bind in IE8** and CSS properties that were unsopported like **inline-block in IE7**.

> I had to support old versions of Internet Explorer and it began to feel like work again

Users were still using those versions, clients were still asking us to support them so hacks, polyfills and lots of *ifs* statements in our scripts begun to populate almost any project.

Are you familiar with the facade pattern? If you are, awesome. If you aren't, well you probably are but just didn't know it had a name. Does this look familiar to you?

```js
function addEvent(el, event, method) {
    if (el.addEventListener) {
        // add listener for modern browsers
        el.addEventListener(event, method);
    } else if (el.attachEvent) {
        // fallback for browsers with no addEventListener method
        el.attachEvent('on' + event, method);
    } else {
        // add event for legacy browsers
        el['on' + event] = method;
    }
}
```

It does look familar, right? Well my friend that's a facade. Under the beautiful `addEvent` function we are hiding those horrible nested conditions to simplify our lives a little bit while coding when we have to support old browsers.

If you're like me you ask yourself this question every week, *when will be the last time I do this?*


## Tell me what it takes to let you go

Depending on the type of project you're dealing with, the audience your client is trying to catch and well, business, the browser scope you need to support might not be that bad.

Internet Explorer 7 is practically dead and its 8 version is going down the same path as its usage is decreasing, we aren't there yet but we are close.

Now let's go back to those two posts I mentioned in the first paragraph.


### Is it Safari the new IE?

If you don't give me much time to think about it I will quickly answer *no*, calling <a href="http://nolanlawson.com/2015/06/30/safari-is-the-new-ie/" target="_blank">Apple's beloved browser the new IE</a> is an exageration in my humble opinion. Why? Well, how often do you have to include a facade like the one I showed you above for Safari in your projects? Exactly.

To be fair, Nolan himself cool it down in a <a href="http://nolanlawson.com/2015/07/05/safari-is-the-new-ie-2-revenge-of-the-linkbait/" target="_blank">second post</a> while still maintaining some of the points he made previously.

Truth is that five years ago most of our complains about Internet Explorer were related to DOM manipulation features, basic JavaScript methods and CSS properties.

Now the scenario has changed a lot, browsers are capable of running complex applications, or *web apps*, and mobile usage is increasing so **HTML5** specification came alive giving vendors the chance to keep up with the trend and add new and well specified features to their navigators, but the arrival of those new features to the common spec of a modern browser also increases the possibility of fragmentation in multiple areas.

Nolan has a really good point, his project really needs <a href="http://caniuse.com/#feat=indexeddb" target="_blank">IndexedDB</a> and to be fair that API has been present in Chrome since version 23 and in Firefox since version 16 both unprefixed, but the fruit company hasn't even tried to add it to Safari.

Come on Apple, is it that hard?


### Is it Chrome the new IE?

There could be some stuff that other browsers do better than it but how many times did you need a special fix or a polyfill for Google's navigator only? Probably never.

Some of the things the author claims is that <a href="https://medium.com/@bdc/chrome-is-the-new-ie-1a21c1efc133" target="_blank">Chrome doesn't support scroll snap points or backdrop filters</a>. Those features are not even supported by Safari and Firefox today, so it would be crazy that someone would consider using them in production. Even if that was a good point, Chrome update iterations are every six weeks while Safari is updated only once a year because it's tied to the corresponding mayor releases of its operative system.

We already know that Safari 9 is not going to give us IndexedDB this year while we can have scroll snap points or backdrop filters in Chrome and Firefox this same year.


## Wrap-up

Internet Explorer has been historically the one to get in the way when trying to deliver a decent experience to the user across all devices and browsers. To be the new IE, a browser would need to make you add polyfills and facade patterns and I feel that at least Chrome and Safari are not in that zone.

Sorry folks but to me there is no such a thing as a new IE.
