---
layout: post
title: Automating the critical CSS inlining with Gulp
resume: Stylesheets can block the rendering process of your site not allowing the user to see the content while all the resources are being loaded. The solution is well known and here is a way to automate it in your project.
---

## Critical rendering path

Including styles and scripts on top of your site can give a very bad experience to the user. Each time a stylesheet is loaded in the browser the rendering tree needs to be updated and while this happens the user is not able to see content. 

A good solution is to inline the critical styles in the **&lt;head&gt;** tag and load the rest of them asynchronically. This way we deliver to the user a consumable site, partially loaded but avoiding a blocking experience.

If you're more interested in this particular topic I recommend reading <a href="https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css" target="_blank">Render Blocking CSS article by Ilya Grigorik</a> in Web Fundamentals and <a href="https://www.filamentgroup.com/lab/performance-rwd.html" target="_blank">Filament Group's insight about performance</a> in their blog.


## Divide and conquer

The first step to automate this task is to separate all your site's styles into two different files, one will hold the critical styles and the other one will contain the styles that can be loaded lately.

Since we need Gulp to apply different changes to them we are going to create two different tasks for each one. So, let's make a `src` folder, with a `styles` subdirectory where these two files will be present.

```
├── src
│    └── styles
│          ├── critical.css
│          └── noncritical.css
```

You can also create an `assets` folder where the *noncritical stylesheet* will be placed, but if you don't Gulp will do that for you so it's not completely necessary.


## Keeping it simple

Gulp is all about simplicity. Just come with what your task need to do, then find the correct packages and pipe them. If you're still not familiar with how Gulp works you can check <a href="http://jeremenichelli.github.io/2015/05/using-gulp/" target="_blank">this article</a> I wrote and then come back to this one.

So, for this solution you will need to install these dependencies.

```bash
npm install gulp gulp-minify-css gulp-rename gulp-concat-util --save-dev
```

Then create a file called `gulpfile.js` in the root of your project and require those packages.

```js
// require the dependencies
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat-util'),
    minify = require('gulp-minify-css');
```

Let's take the critical file first. What do we need to do? Grab the file, minify its content, wrap it with `style` tags and convert it to a file we can include in our site generator, let's take Jekyll as an example.

```js
// critical styles task
gulp.task('styles:critical', function() {
    return gulp.src('src/styles/critical.css')
        // minify content
        .pipe(minify())
        // wrap with style tags
        .pipe(concat.header('<style>'))
        .pipe(concat.footer('</style>'))
        // convert it to an include file
        .pipe(rename({
            basename: 'criticalCSS',
            extname: '.html'
        }))
        // insert file in the includes folder
        .pipe(gulp.dest('_includes/'));
});
```

Then you just need to include the **criticalCSS.html** file in the head of the site.

```html
<head>
    ...
    {% raw %}{% include criticalCSS.html %}{% endraw %}
</head>
```

This works great for Jekyll projects, but what about other site generators?

### Adapt the solution to other platforms

The only thing you need to change if your site is not built with Jekyll is the destination folder and the extension of the final file. Let's say you're using Wordpress, then this is how the task would look like.

```js
gulp.task('styles:critical', function() {
    return gulp.src('wp-content/themes/your_theme/src/styles/critical.css')
        // minify it
        .pipe(minify())
        // wrap with style tags
        .pipe(concat.header('<style>'))
        .pipe(concat.footer('</style>'))
        // convert it to a php file
        .pipe(rename({
            basename: 'criticalCSS',
            extname: '.php'
        }))
        // insert it Wordpress theme folder
        .pipe(gulp.dest('wp-content/themes/your_theme/'));
});
```

Then include the file in `head.php`.

```html
<head>
    ...
    <?php include (TEMPLATEPATH . '/criticalCSS.php'); ?>
</head>
```

As you see, adapting this approach to a completely different platform is very simple. 


### Pre-processing critical styles

Almost any project today in web development uses **LESS**, **SASS** or **Autoprefixer**. If your project is among them just install the packages, require them and pipe the new steps at the beginning to later continue with the rest of the process.

Install the packages.

```bash
npm install gulp-less gulp-autoprefixer --save-dev
```

Require them in your `gulpfile.js`.

```js
// in addition to the packages required previously
var less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer');
```

Add these new steps to the task.

```js
gulp.task('styles:critical', function() {
    return gulp.src('src/styles/critical.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(minify())
        .pipe(concat.header('<style>'))
        .pipe(concat.footer('</style>'))
        .pipe(rename({
            basename: 'criticalCSS',
            extname: '.html'
        }))
        .pipe(gulp.dest('_includes/'));
});
```

### Create the noncritical stylesheet

Let's now close the circle and generate a `.css` file for the rest of the styles of our project.

```js
gulp.task('styles:noncritical', function() {
    return gulp.src('src/styles/noncritical.css')
        .pipe(minify())
        .pipe(rename({
            basename: 'site'
        }))
        .pipe(gulp.dest('assets/styles/'));
});
```

Of course you need to include a **&lt;link&gt;** tag at the bottom of your page referencing the location of this file or lazy load it using JavaScript to make its styles visible.

We can now run `gulp styles:critical` and `gulp styles:noncritical` in our terminal each time we make a change in our styles, but running the same command over and over again doesn't sound like *automating*...


### Watch em' all!

To actually automate this, we need to trigger those tasks every time we modify a file. Hopefully, we have a `watch` method that we can use inside Gulp to achieve this.

```js
gulp.task('watch', function() {
    gulp.watch([ 'src/styles/critical.css' ], [ 'styles:critical' ]);
    gulp.watch([ 'src/styles/noncritical.css' ], [ 'styles:noncritical' ]);    
});
```

After this small addition you can run `gulp watch` on your terminal and presto!


## Wrap-up

If you decide to inline styles at the top of your site you need to find out which styles are *critical* and which aren't. There's not a right anwser because it depends on the design of your site, but most of the articles about authoring those critical rules recommend to focus on the portion of the page that is first seen by the user and leave probably nitpicky design styles for a later load.

Hope you find this useful and, in case you give a try, that it really simplifies your work flow and improves your page loading times.
