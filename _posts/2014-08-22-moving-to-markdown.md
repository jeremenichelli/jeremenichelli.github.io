---
title: Moving to&nbsp;Markdown
resume: A few days ago I received an email from a developer asking for help with Markdown files on Jekyll.
---

Giving him some assistance on this reminded me how good and agnostic this language is for writing, so from now on my posts will be Markdown files. Here is why I'm doing this and some tips about it.

Having to write all my posts in HTML wasn't bad but it made me lose a lot of time and it felt more like working, instead of just writing. So the main reason was to improve my writing experience.

The other reason was writing code samples. Trying to find a good way to show and style them on HTML can be a not that pleasant task.

## The code tag

The best way to achieve this while following the standards is to write a *&lt;pre&gt;* tag and a *&lt;code&gt;* one inside it. What happens here is that spaces, tabs and line breaks are interpreted, the opposite behaviour of a normal HTML document.

```
<pre><code>function doSomething(){
  var anything = 'string';
  <span class="comment">// do something</span>
}</pre></code>
```

As any line break or space is parsed we have to concat lines and tags. While this isn't pretty all at and it's also a struggle to read or mantain since what you're seeing is way different from the final result.

## Markdown to the rescue

When I was reading some documentation to help this developer I remembered how easy is to achieve this in Markdown. When you want to use a code tag the only thing you need to do is wrap it inside three **grave accent (&#x60;)** characters followed by the type of code you're trying to show, for example **&#x60;&#x60;&#x60;js**, and that's it.

## Choose a parser

There are a lot of Markdown interpreters that you can use, most of them respect the normal standards of the language. I chose **redcarpet** because it slices the code adding *&lt;span&gt;* tags with classes that make easier to style, for example **cl** for comments in JavaScript. You can inspect the following code to see what's the result.

```js
function doSomething(){
  var anything = 'string';
  // do something
}
```

## Migration

Of course for consistency I would like to have the same generated markup in my old HTML posts for styling and mantainance. What I did was to create a **draft** in Jekyll using Markdown with all the code snippets from my old posts, using titles to separate and identify them. After doing this I just had to build my site using the *--drafts* flag, opened the file and copied every piece of HTML inside every post.

## Wrap-up

If you have the chance try it. If your blogging engine is Jekyll you have some good parsers for your choice and it will speed up your writing, and it's nice to feel that **I'm actually writing** a post instead of working.

There's a [nice article in Wikipedia](http://en.wikipedia.org/wiki/Markdown) about Markdown and its syntax, which is pretty straight forward and easy to learn. If you're using SublimeText as your IDE there are lots of packages that can improve the highlighting on this type of files.

Happy writing!
