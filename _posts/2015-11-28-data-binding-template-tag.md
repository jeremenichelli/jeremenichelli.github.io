---
layout: default
title: Data binding using the template tag
resume: There's a discussion taking place in the front end development industry right now about frameworks. No matter which side you are, truth is we sometimes forget all the things the web platform has available for us to achieve some complex requirements.
---

## Are you sure you need that framework?

I remember having a strong opinion about <a href="/2014/05/stop-the-jquery-abuse/" target="_blank">not using jQuery</a>, not because I was against the library itself but because most of the developers that included it in their projects only used a small part of it like the selector engine or the class manipulation API.

Lots of bytes to load and not the best performance can cause an undesired negative effect over the user experience when you can solve most of the stuff you do with native APIs.

Something similar is happening with frameworks nowadays. It's true that in the past the web was mostly used to show content to the user and not much more and today we are talking about complex web apps, but at some point developers are again adding chunks of bytes to their projects with features they don't use and as a secondary symptom it prevents them from investigating first if there's a native way they can develop a solution.

Cross browsing support is a good argument, but modern ones are still the most used so it makes more sense to start developing from scratch for those enviroments and then maybe start adding fallbacks for others.

## Data binding

Just like DOM selection for jQuery, data binding is one of the reason why developers tend to use an MVC framework, but again it comes with other stuff that might be useful but you might not need. There are a lot of small data binding alternatives that will perform equally or better than these libraries.

Last year I <a href="https://github.com/jeremenichelli/mnster" target="_blank">wrote a small data binding library</a>, nothing complicated it just covers the basic needs when inserting data dinamically with JavaScript and a super easy API to add new bindings in seconds.


### Using mnster

Let's do a simple binding so that you get familiar with the library syntax. First you need an element that you want to alter depending on certain information present in your script scope. You can create that element with JavaScript or grab it from the DOM.

```js
var element = document.createElement('p');

// set mnster attributes for data binding
element.setAttribute('mns-text', 'user.name');
```

Now there's an element and we've set an attribute on it that will use the **text** binding in **mnster** to insert the user name.

The data can come from a request or a plain object that resides in a script.

```js
var userData = {
  name: 'Jeremias Menichelli'
};
```

We have an element, and the data, we just need to bind it using **mnster** and here's how.

```js
mnster.view(element, { context: 'user', model: userData });
```

I've just call the `view` method, passing an element and then an object with the context name I'll use in my attributes and an object that holds the data to bind.


## Views and data

In more complex applications is not good to have everything inside a JavaScript file. Most frameworks have already define structures that use *.html* files for views and usually get the data from a server request.

Truth is we can still do that without any framework, let me introduce you to the **template** tag.


### The template tag

This new little but powerful friend can be placed inside our main page but nothing inside of it will be rendered or trigger a request, scripts won't execute, styles tags won't work until we grab its content and append it somewhere in the body of the document.

```html
<template id="user-template">
  <p mns-text="user.name"></p>
</template>
```

You can still access to its content and make modifications, but I think the right way to use is to import its content in a new variable and apply the changes into that cloned node.

```js
// get template
var userTemplate = document.getElementById('user-template');

// clone template content
var clone = document.importNode(userTemplate.content, true);

// bind data
mnster.view(clone, { context: 'user', model: { name: 'Jeremias Menichelli' } });

// append content to body
document.body.appendChild(clone);
```

*A template content is a document fragment object in JavaScript, while you can still do a lot of operations not all the DOM APIs are available for it until you append it to the document, for example classList.*

We can organize the code a little better saving all the templates in an object since we can reuse it, create a method to clone their content and another one to bind the data and insert the content in the document.

Let's create a placeholder view in which we're going to append the content and the template.

```html
<div id="user-view"></div>

<template id="user-template">
  <p mns-text="user.name"></p>
</template>
```

Then get the elements and build the methods.

```js
/*
 * Templates object
 * for convension use <TYPE>-template notation to name them
 */
var templates = {
  user: document.getElementById('user-template');
};

/*
 * Views object
 * for convension use <TYPE>-view notation to name them
 */
var views = {
  user: document.getElementById('user-view');
};

/*
 * Clone template method
 */
function clone(name) {
  return document.importNode(templates[name].content, true);
}

/*
 * Build view method
 */
function build(name, data) {
  var temp = clone(name);

  mnster.view(temp, { context: name, model: data });

  // clean previous content
  views.name.innerHTML = '';

  views[name].appendChild(temp);
}
```

Now we can easily call `build` function to bind the data and insert the result in the DOM.

```js
build('user', { name: 'Jeremias Menichelli'});
```

Notice that we've used a specific notation on elements to make the code more semantic and future proof, then if we need to cover more views we have to update the `templates` and `views` objects but the `clone` and `build` methods can remain the same.

### Drawbacks

Of course this approach is simple but not perfect. Since we are not using two way data binding and a buffered template instead, we need to erase the view content and insert nodes again every time the view is updated.

Also, the template tag is not supported in any Internet Explorer version and it's just making its way into Edge, so you will need to check and add a fallback for these browsers.

```js
if ('content' in document.createElement('template')) {
  // template tag supported
} else {
  // template tag not supported, apply fallback
}
```

If this is more convenient than adding a whole framework or not will depend on what you're trying to build.


### Live example

You can see this approach working in a simple web app to visualize GitHub user profiles I wrote recently using another library of mine called <a href="https://github.com/jeremenichelli/jabiru" target="_blank">jabiru</a> to manage **jsonp** requests and <a href="https://github.com/jeremenichelli/mnster" target="_blank">mnster</a> for **data binding** with the template logic that was explored in this post.

You can check it out in its <a href="https://github.com/jeremenichelli/octosearch" target="_blank">repository</a> or <a href="https:/jeremenichelli.github.io/octosearch" target="_blank">see it in action</a>.


## Wrap-up

Again, I'm not against using frameworks. If you think is the best option for your project, if loading times are not that critical and you're aware of performance and good practices around your choice then you'll be fine, but it's a nice habit to first go and check if you can use the amazing features the browsers bring today out of the box and give the user a better experience.

There are tons of documentation around, examples and small libraries to fill some spots on your project. The template tag and a custom data binding library are just a small example of this, but they are also a concept proof of the options we have to develop today.

Happy coding!
