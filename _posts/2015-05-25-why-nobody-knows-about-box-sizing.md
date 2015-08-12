---
layout: post
title: Why not everyone knows about box-sizing?
resume: It really surprises me that almost all developers I've interviewed in the recent time didn't know about the existance of this property at all and I'm really asking myself, why?
---

## box-sizing

First of all, let's talk about it. This property allows you to choose what criteria an element will adopt when you apply layout properties to it like width, height, padding and border.

Let's see it in action. What's the width of this element?

```html
<style>
    .box {
        height: 50px;
        padding: 20px;
        width: 100px;
    }
</style>

<div class="box"></div>
```

If you said **100px** you were wrong, the actual width of this element is **140px**. If you really want *.box* to occupy 100px and still have 20px of padding you'll need to do some maths and finally set the width of that element to **60px**.

But, wait I also need a border and keep the element **100px** wide. Now the width property will need a **56px** so the span of the element is not modified.

```html
<style>
    .box {
        border-style: solid;
        border-width: 2px;
        height: 50px;
        padding: 20px;
        width: 56px;
    }
</style>

<div class="box"></div>
```

There you go, we did it! After some math we have an element that's 100px wide, with 20px of padding and a 2px border. Is this behavior correct? Do I have to do all this math to set the width I want for an element?

Answer to the first question, you might not like it, I don't actually, but this is expected if you know about *box-sizing* and how it works. Answer to the second question, no you don't have to... if you know about *box-sizing* and how it works.


### content-box

This is the default value of *box-sizing*. Every time you set the height and the width of an element it won't consider other layout properties of the box model as padding and border, like in the example above.


### padding-box

So let's go back to our example and make a small change.

```html
<style>
    .box {
        box-sizing: padding-box;
        border-style: solid;
        border-width: 2px;
        height: 50px;
        padding: 20px;
        width: 100px;
    }
</style>

<div class="box"></div>
```

What's the width of the element now? The answer is **104px**. When you set *box-sizing* to **padding-box** the width and height take in count the padding of the element, excluding only the border.


### border-box

Ignoring **inherit**, this is the last optional value that *box-sizing* can adopt and if you didn't know about it before you're probably going to use it a lot from now on.

```html
<style>
    .box {
        box-sizing: border-box;
        border-style: solid;
        border-width: 2px;
        height: 50px;
        padding: 20px;
        width: 100px;
    }
</style>

<div class="box"></div>
```

Last time, what's the width of the element? Yes, now the element is **100px** wide!

If you think about it, this behavior makes more sense than the default one. After the release of the CSS1 specification, developers and designers complained a lot about how painful it was to code a layout with this being the standard. Jeff Kaufman wrote <a href="http://www.jefftk.com/p/the-revenge-of-the-ie-box-model" target="_blank">a nice post about this story</a>.


## What's the trend?

Almost all developers around the globe reset the default to follow the **border-box** approach. This is how Paul Irish suggests to apply the change to all the document elements.

```css
html {
   box-sizing: border-box;
}
*, *:before, *:after {
   box-sizing: inherit;
}
```

Basically all frameworks and style guides like <a href="http://foundation.zurb.com/" target="_blank">Foundation</a>, <a href="http://getbootstrap.com/" target="_blank">Bootstrap</a> and GitHub's <a href="http://primercss.io/" target="_blank">Primer</a> do this because it's way more easy to develop grids and complex layouts.


## Then, why a lot of developers don't know about it?

It's really weird that people with years in the field haven't even heard about it in some cases. After scratching my head a little, my best guess is that you can survive without it. You can still build and mantain complex stuff in CSS without it, though it will be harder to achieve.

You can survive in the front end world without **border-box**, but I don't know for how long. Truth is that once you know about it, it becomes one of the first rules you write every time you start a new project.


## Related articles

If my explanation was a little confusing I suggest <a href="http://www.paulirish.com/2012/box-sizing-border-box-ftw/" target="_blank">Paul Irish's article</a> and <a href="https://css-tricks.com/box-sizing/" target="_blank">CSS Trick's reference page</a> about this. You can also download this small html page in this <a href="https://gist.github.com/jeremenichelli/a7f26e5951bfb2b77043" target="_blank">gist</a> I did and see how this property affects an element with the same border, padding, height and width.

Something else, there is an <a href="https://css-tricks.com/international-box-sizing-awareness-day/">International box-sizing Awareness Day</a>. Yes, this is real.

