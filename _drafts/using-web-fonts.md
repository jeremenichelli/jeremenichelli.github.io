---
layout: post
title: Using web fonts? This is how you should load them today
resume: Searching for better design and stronger identity, custom fonts have become something present in almost all modern sites. While the result is great, this feature also comes with one or more network requests and other compromises like FOUT and FOIT.
---

What are those weird acronyms? Well, you're going to see them in any post or article related to web fonts today so let's do a quick description of both.

**FOUT (Flash Of Unstyled Text)** describes the behavior of some browsers showing you the content of the page with a fallback font until the custom one is loaded. When the font is ready then the switch is triggered, like Firefox does.

**FOIT (Flash Of Invisible Text)** is when the browsers chooses to not display the text if it has a custom font assigned that isn't ready for use yet, like Chrome and Chrome Mobile.


### The User Experience

Both scenarios are not desirable. **FOUT** will cause you're page to **blink** because of the physical differences between the font that's being displayed at the moment and the custom one. **FOIT** will literally **hide** your text content when the custom font has been loaded and the text is repainted by the browser.

You will have to choose between **blink** and **hide**. If you ask me I prefer the first one. While it's not perfect, what's important in a web page is the content and well, content first approaches were the trending thing in front end development last year with above-the-fold and critical CSS being the star of the show.

So, if there's a font that's taking a while to load is better to show content to the user until everything is ready. Google's <a href="https://developers.google.com/speed/pagespeed/insights/" target="_blank">PageSpeed Insight</a> will penalize you if you don't follow this approach, for example.

After hearing about this, I did what a lot of developers did.

```js
var fontStyleSheet = document.createElement('link');

fontStyleSheet.onload = function() {
    document.body.classList.add('font-loaded');
};

fontStyleSheet.href = 'http://fonts.googleapis.com/css?family=Roboto';
document.head.appendChild(fontStyleSheet);
```

Pretty obvious, just load the style sheet containing the **@font-face** declaration by JavaScript, wait for the `onload` event to fire and add a class to the body or html tag to change the font-family of the site by CSS.

And guess what? It didn't work. The invisible text problem was still there.


### Solutions available today

A couple of developers noticed these issues and created libraries that provide events that truly indicate the loading and active state of the font. The first one, <a href="https://github.com/zachleat/fontfaceonload" target="_blank">fontfaceonload</a> by <a href="https://github.com/zachleat" target="_blank">zachlet</a>.

You still need to add your fonts via **@font-face** declaration or include the **link** tag in your page and later listen to an specific family of fonts to load.

```js
FontFaceOnload("Oswald", {
    success: function() {
        // when font is available, add class to body
        document.body.classList.add('font-loaded'); 
    }
});
```

The second one is <a href="https://github.com/bramstein/fontfaceobserver" target="_blank">fontfaceobserver</a> by <a href="https://github.com/bramstein">bramstein</a>. According to its creator, this one uses scroll events to detect when the font is available immediately.

Again, you include your custom font by CSS but this time an observer object is created.

```js
var observer = new FontFaceObserver('Oswald');

observer.check().then(function() {
    document.body.classList.add('font-loaded');
});
```

You might have noticed that this library uses a `check` method and the reserved word `then` as the **Promise API** does to run code after the font is ready.

This last one is highly recommended if you're loading a font from Google, Typekit or Fontdeck. It's actually co-developed by <a href="https://github.com/typekit" target="_blank">Typekit</a> and Google developers and its name is <a href="https://github.com/typekit/webfontloader" target="_blank">webfontloader</a>.

You won't need a **@font-face** declaration in your styles here, just JavaScript.

```js
WebFont.load({
    google: {
        families: [ 'Oswald' ]
    }
});
```

The script will automatically add classes to the body of the document, but if you feel more comfortable using your own class names you can disable this feature and do it yourself.

```js
WebFont.load({
    google: {
        families: [ 'Oswald' ]
    },
    classes: false,
    active: function() {
        document.body.classList.add('font-loaded');
    }
});
```

### In the wild

The best way to test this libraries is to see them working on the web, so I've created <a href="https://jeremenichelli.github.io/web-font-samples" target="_blank">a small site with three sample pages</a>, one for each script. The sample pages don't load any resources that are not related to the font loading job and they measure the time the script takes to load the resources and detect the font is ready for use.

After running the sites a few times to get some numbers about the speed of each one, I can say that there's no big differences. The average mark was **270ms** to load the library, run the code and show the font with a normal internet home connection.

About weights, **fontfaceonload** is 1.06KB, **fontfaceobserver** is 1.83KB and **webfontloader** 4.46KB which make sense, all minified and gzipped. The last one is heavier because it supports various fonts API out of the box.

Then I've moved to <a href="http://www.webpagetest.org/" target="_blank">www.webpagetest.org</a> to have a better insight of the performance differences between them and I saw that **fontfaceonload** wasn't solving the **FOIT** issue more than once though as a user I didn't catch that blink at all. I might have missed some step or done something wrong, though I followed the documentation from the repository. The other two worked as expected and have become the choice of most developers.

### Recommended articles

If you are more curious about **FOUT** and **FIOT**, <a href="https://css-tricks.com/fout-foit-foft/" target="_blank">Chris Coyer wrote a nice post in CSS-Tricks</a> about them. Also, Scott Jehl from Filament Group did <a href="https://www.filamentgroup.com/lab/font-events.html" target="_blank">a great post about loading web fonts</a> using their site as test case. Go check it out for more precise information about this.


### Wrap-up

I love web fonts and how they make your web feel more unique, but we don't have to forget that content and user experience come first. If you're going to include custom fonts in your site use font events libraries to load them.
