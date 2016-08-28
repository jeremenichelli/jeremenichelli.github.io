---
layout: default
title: A South American bird and cross domain calls
resume: Forget about the bird, for now. Accessing to data from an API that is located in a different domain is a common scenario in web development. The most used solution is JSONP and here is a way of implementing it.
---

## Same-origin policy

Long time ago, when browsers were a new thing, there was a need to establish what was secure and what wasn't when loading resources inside a web page. Though this can change through different browsers and situations, the algorithm that calculates the origin of a resource looks at the protocol, the host of that resource and the port that's being used. For example, in a site whose url starts with *https* you won't be able to load resources whose urls start with *http*, this is the protocol not matching so the request fail.


### CORS

Just as resources loaded in the DOM, the same policy runs for ajax calls. This means that you can't read the response that comes from an API located in a different domain. **CORS** is a standard that works by adding new HTTP headers indicating the server which domains have permission to access to its resources. Of course this new standard, that is well supported, requires you and the server to know each other and to set specific rules, and that's not always possible.


## JSONP to the rescue

While the standard mentioned before covers any type of request, there's a work around for the method GET and that is JSONP. Servers that are capable of returning JSONP responses wrap them in a function call previously defined by you that can manage the data retrieved. Usually these APIs support a parameter like *callback* or just *jsonp* so you can define the name of the method that's going to be called.

```js
function wrapper (responseData) {
  // do something with responseData
  console.log(responseData);
};

var script = document.createElement('script');
script.src = 'http://api.some.com/find?id=ebf4g4&q=5&callback=wrapper';
document.head.appendChild(script);
```

As you may notice we've appended a script inside the *&lt;head&gt;* tag of the web page, and if everything goes well its content will call the *wrapper* function with the response of the server as an argument.

```js
wrapper({"id": "ebf4g4", "properties": [ "a", "b", "c", "d", "e"]});
```
In this case, our function will just log the result in the console, but you can do whatever you want with it.


### A South American bird

I've developed a simple script that can manage JSONP calls by generating dynamic callback identifiers, you only need to indicate the url that needs to be call and the function you want to be executed when the server responds to our request.

I always put weird names to my repositories, just for fun, and after looking for animal names that begin with **j** I decided to name this one **jabiru**, for no good reason. I just liked it.


## Wrap-up

Hope this post helped you understand quickly what's JSON with padding, what problem solves and how you can use it in your web. If you are a bit curious like me [here's some information about this beautiful bird](http://en.wikipedia.org/wiki/Jabiru) and if you're planning to work with this type of calls [here's the link of the repository](https://github.com/jeremenichelli/jabiru).

Happy coding!
