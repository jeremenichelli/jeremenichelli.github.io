---
layout: post
title: I love the ampersand
resume: A good example on how small things can make a big difference. It costed me a lot to move from plain CSS to preprocessors languages, but somehow LESS convinced me and its little shorcuts are the way I enjoy the most.
---

### &amp;

For the ones that don't work with SASS or LESS and never heard about it, the ampersand is a selector that refers to the selector itself inside its curly braces declaration.

Examples are better, right?

<div class="highlight"><pre>
<code>.box {
    display: block;
    float: left;

    &.small {
        height: 40px;
        width: 40px;
    }

    &.large {
        height: 90px;
        width: 90px;
    }
}</code>
</pre></div>

Remember that new declarations inside curly braces in LESS indicates inner elements, but using an ampersand indicates that we are instead indicating a *.box* element with an additional class that can be **small** or **medium**.

<div class="highlight"><pre>
<code>.box.small {
    display: block;
    float: left;
    height: 40px;
    width: 40px;
}

.box.medium {
    display: block;
    float: left;
    height: 90px;
    width: 90px;
}</code>
</pre></div>

It's a nice touch, maybe not a big thing. To me this little guy it's great when working with elements that has pseudo-elements or different states like buttons or links. It's very useful inside mixins.

<div class="highlight"><pre>
<code>.clearfix() {
    &:before,
    &:after {
        content: " ";
        display: table;
    }

    &:after {
        clear: both;
    }
}</code>
</pre></div>

I love how the symbol eliminates the noise in the declaration. You now that everything inside that mixin takes totally care of the styling. Don't need to look for other style declaration for that, it's all there. It's simpler to read, ergo simpler to mantain.


### Bringing mixins to the game

Now let's see what happens when you need to style buttons or links.

<div class="highlight"><pre>
<code>.button() {
    background-color: #f90000;
    border: solid 1px #9a3590;
    border-radius: 3px;
    color: #ffffff;
    min-width: 120px;
    padding: 10px;

    &:hover {
        background-color: #ff3a3a;
    }

    &[disabled] {
        opacity: .5;
    }
}</code>
</pre></div>

That's really easy to understand and if you use variables inside the mixin you can build flavors of button in a really easy way.

<div class="highlight"><pre>
<code>.button(@color) {
    background-color: @color;
    border: solid 1px @color - #555555;
    border-radius: 3px;
    color: #ffffff;
    min-width: 120px;
    padding: 10px;

    &:hover {
        background-color: @color + #222222;
    }

    &:active {
        background-color: @color + #111111;
        color: #e0e0e0;
    }

    &[disabled] {
        opacity: .5;
    }
}

.red-button {
    .button(#d32f2f);
}

.blue-button {
    .button(#303f9f);
}

.green-button {
    .button(#388e3c);
}</code>
</pre></div>

I don't know you but to me that's beautiful.


### Variable interpolation

Last but not least, this simple feature is a beast if you know where you can use it. What it basically does is to put value inside strings. Again, examples are better.

<div class="highlight"><pre>
<code>@base-img-url: '../img'

#header {
    background-image: url('@{base-img-url}/banner.jpg');
    background-repeat: no-repeat;
}</code>
</pre></div>

There's a higher chance you'll use the same base path for images so in case you need to change it for some reason, you only do it in one place.

You can also apply some maths on it.

<div class="highlight"><pre>
<code>.opacity(@value) {
    @percentValue: @value * 100;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=@{percentValue})";
    filter: alpha(opacity=7@percentValue);
    -moz-opacity: @value;
    -khtml-opacity: @value;
    opacity: @value;
}

.overlay {
    .opacity(0.75);
    background-color: #000000;
    transition: opacity .25s ease; 

    &.closed {
        .opacity(0);
    }
}</code>
</pre></div>


### Wrap-up

Small things are usually more versatile, they can bend and adapt to different situations. That's why I love the ampersand and I use it a lot.

If you are interested in more LESS awesomeness you can go to the <a href="http://lesscss.org/features/" target="_blank">official language features reference</a>. Happy coding!