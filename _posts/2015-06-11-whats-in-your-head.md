---
layout: post
title: What's in your head?
resume: Not singing a Cranberries song. Not saying you're crazy. I realized that when I have to start a new web project I spend a lot of time trying to make sure I'm not forgetting anything inside the head tag.
---

Let's start building its content.


### &lt;title&gt;

The first thing you have to put inside the head tag is the title tag. It's the main sign to show the user which specific part of the site is being served and it's the first thing that search optimization engines will catch to see if what the user is looking up has something to do with that page from your site. That's why it's also important that the title varies through the different pages and sections.

Of course, you shouldn't put here long content with unnecessary words or phrases that are not related to the real content of the page. So, title must contain some general information about the site and something that sums up the content of the page.

Here is our head for the moment.

```html
<head>
    <title>Page Title | Section | Website Title</title>
</head>
```

### &lt;meta&gt; tags

If you've been working in web sites for a long time you're gonna find meta tags very familiar. Each one has a **name** attribute indicating its type and a **content** attribute indicating its value.

#### description

The first one to mention is **description**, which is basically a short paragraph with a summary of the page. Google recommends the use of this meta tag, though it also claims that it will first track some real content from your site to see if there are good matches from the search the user is doing.

The rules here are similars to the title's ones. Be brief, be accurate and change it from page to page.

#### keywords

The second is **keywords**. This was a really important one if you wanted your site to appear in search results, but now is deprecated. Why? In the past search engines relied a lot in the content of this meta tag so web developers started cheating to put it in some way. In the **keywords** meta tag you were able to list words that were related to the content inside the page separated by a comma.

You were searching for an article about cars for example and the first three results had nothing to do with them, but if you opened some of those pages and inspect their head content you would probably find that they had the word cars in their **keyword** meta tag. Believe me this scenario was really really common so search engines, and mainly Google, started to not even look here at all.

#### charset

This tag will indicate which group of characters will take the browser to parse the text content. Usually it's value is **utf-8**, but it can vary, mostly if you're serving a page with a language with special characters.

#### Special meta tag for IE

Yes, it's recommended to add a meta tag for Internet Explorer to indicate we want our page to be rendered with the hightest standard possible. Yes, you have to.

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```

#### The world wide web is getting mobile

This one is pretty new, the **viewport** tag indicates how a mobile device will render your site. Modern devices have a lot of pixels. To show visible and sharp content they take more pixels to form only one pixel from your page. Confusing? I suggest you <a href="https://developer.mozilla.org/en/docs/Mozilla/Mobile/Viewport_meta_tag" target="_blank">read the article the folks from Mozilla Developer Network wrote</a> that contains a pretty good explanation on how this works.

The standard is to indicate the width of the viewport, the height, and the initial scale of the rendering. It's not an impossible scenario but it's weird to set the height of the viewport because usually web sites content grow vertically. The most usual configuration is to set the width as the device width and an initial scale of **1**. You can also indicate a maximum scale though the user will not be able to pinch and zoom which can compromise accessibility.

Now, let's update our head tag.

```html
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="Some description of the page.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <title>Page Title | Section | Website Title</title>
</head>
```

### Canonical

This link tag is used to specify which url the page is refering in case you have more than one that point to a single page. If you have only one url for a page or post, then is not really necessary, but it's a nice to add it if for example you have a different domain for mobile versions.

```html
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="Some description of the page.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <title>Page Title | Section | Website Title</title>

    <!-- if your mobile URL is different from the desktop URL, add a canonical link to the desktop page -->
    <link rel="canonical" href="http://www.example.com/path/to/page">
</head>
```

### Favicons

If you've never heard of them, a **favicon** is that little icon you see in your browsers tab or location bar. They usually have a small size and are a really nice touh to personalize your project.

The problem here is fragmentation. Each browser expects a different size and not all of them support any image type. If you look at <a href="https://github.com/google/web-starter-kit/blob/master/app/index.html" target="_blank">the header inside the Web Starter Kit</a> you're going to notice a set of icons for Chrome, another one for Safari and a final one to support Windows 8 touch icons. But if you really want to cover all the edge cases then you'll have to go to <a href="http://realfavicongenerator.net/" target="_blank">Real Favicon Generator</a> site which will nicely let you update an image and generate the whole set. You will immediately notice that providing a favicon for every browser around is not that simple.

```html
<!-- Cover all apple devices -->
<link rel="apple-touch-icon" sizes="57x57" href="assets/favicon/apple-touch-icon-57x57.png">
<link rel="apple-touch-icon" sizes="114x114" href="assets/favicon/apple-touch-icon-114x114.png">
<link rel="apple-touch-icon" sizes="72x72" href="assets/favicon/apple-touch-icon-72x72.png">
<link rel="apple-touch-icon" sizes="144x144" href="assets/favicon/apple-touch-icon-144x144.png">
<link rel="apple-touch-icon" sizes="60x60" href="assets/favicon/apple-touch-icon-60x60.png">
<link rel="apple-touch-icon" sizes="120x120" href="assets/favicon/apple-touch-icon-120x120.png">
<link rel="apple-touch-icon" sizes="76x76" href="assets/favicon/apple-touch-icon-76x76.png">
<link rel="apple-touch-icon" sizes="152x152" href="assets/favicon/apple-touch-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="assets/favicon/apple-touch-icon-180x180.png">

<!-- Old school favicon -->
<link rel="shortcut icon" href="assets/favicon/favicon.ico">

<!-- General favicon sizes for different sizes -->
<link rel="icon" type="image/png" href="assets/favicon/favicon-192x192.png" sizes="192x192">
<link rel="icon" type="image/png" href="assets/favicon/favicon-160x160.png" sizes="160x160">
<link rel="icon" type="image/png" href="assets/favicon/favicon-96x96.png" sizes="96x96">
<link rel="icon" type="image/png" href="assets/favicon/favicon-16x16.png" sizes="16x16">
<link rel="icon" type="image/png" href="assets/favicon/favicon-32x32.png" sizes="32x32">

<!-- Add to homescreen for Chrome on Android -->
<meta name="mobile-web-app-capable" content="yes">
<meta name="application-name" content="Page title">
<link rel="icon" sizes="192x192" href="assets/favicon/chrome-touch-icon-192x192.png">

<!-- Icon for Win8 -->
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="msapplication-TileImage" content="assets/favicon/mstile-144x144.png">
```

Yes, you need all of those icons. You can create them by yourself or let the tool I provided before to generate most of them. If you really want your favicon to reach all browsers, this will do the job.

### Scripts

No. Don't put scripts here since they are going to block rendering. In cases where you need **HTML5** tags to work in legacy browsers you will need <a href="https://github.com/afarkas/html5shiv" target="_blank">html5shiv</a> in the head tag.

```html
<!--[if lt IE 9]>
    <script src="assets/scripts/html5shiv.js"></script>
<![endif]-->
```

The thing is that if the request for the scripts takes some time and the DOM tree renders before the library has loaded and run it won't work and I've seen it not working because of this.

The correct form is to include the content of the script minified inside a script tag.


### Styles

Last year there was a move impulsed mostly by Google devs and their web standars to provide to the user the web site with a **content** first approach. This means that while adding a link tag with a stylesheet in the past was not wrong, it's now seen as a bad practice because your blocking content renderization.

To solve this, put the most critical CSS rules in a style tag, also called **above the fold** styles, and load the rest of the rules by adding the stylesheet using Javascript. The incredible guys from Filament Group have a small script to achieve this called <a href="https://github.com/filamentgroup/loadCSS" target="_blank">loadCSS</a> which I suggest you dig in.


#### Other content

Of course, the web keeps changing and moving on and there is new content that can go inside here. For example if your project is a web app is recommended to add a **manifest.json** file reference, or you can change the look of Chrome mobile top bar by specifing a **theme-color**.


### Wrap-up

Let's take a deep breath and see what a complete **head** tag looks like.

```html
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="Some description of the page.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <title>Page Title | Section | Website Title</title>

    <!-- if your mobile URL is different from the desktop URL, add a canonical link to the desktop page -->
    <link rel="canonical" href="http://www.example.com/path/to/page">

    <!-- Cover all apple devices -->
    <link rel="apple-touch-icon" sizes="57x57" href="assets/favicon/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="114x114" href="assets/favicon/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="72x72" href="assets/favicon/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="144x144" href="assets/favicon/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="60x60" href="assets/favicon/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="120x120" href="assets/favicon/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="76x76" href="assets/favicon/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="152x152" href="assets/favicon/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="assets/favicon/apple-touch-icon-180x180.png">

    <!-- Old school favicon -->
    <link rel="shortcut icon" href="assets/favicon/favicon.ico">

    <!-- General favicon sizes for different sizes -->
    <link rel="icon" type="image/png" href="assets/favicon/favicon-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="assets/favicon/favicon-160x160.png" sizes="160x160">
    <link rel="icon" type="image/png" href="assets/favicon/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="assets/favicon/favicon-16x16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="assets/favicon/favicon-32x32.png" sizes="32x32">

    <!-- Add to homescreen for Chrome on Android -->
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="application-name" content="Page title">
    <link rel="icon" sizes="192x192" href="assets/favicon/chrome-touch-icon-192x192.png">

    <!-- Web Application Manifest -->
    <link rel="manifest" href="manifest.json">

    <!-- theme color for Chrome mobile -->
    <meta name="theme-color" content="#3372DF">

    <!-- Icon for Win8 -->
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="assets/favicon/mstile-144x144.png">

    <!--[if lt IE 9]>
        <script>
            // minified code from html5shiv
        </script>
    <![endif]-->

    <style>
        // above the fold CSS rules
    </style>
</head>
```

Pretty big, right? It's even bigger than the head tag of this post you're reading. Of course you don't need all of these, that depends on the browser scope of your project and what type of project it is.

Maybe you don't need all these favicon declarations, or you don't need to cover HTML5 tags, but in case you want a nice cross browsing experience following the last trends, your head will have to look a little similar to this one.

