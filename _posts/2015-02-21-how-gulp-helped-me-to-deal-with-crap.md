---
layout: post
title: How Gulp helped me to deal with crap
resume: It's not a big secret that maintaining code that we didn't create is a big pain sometimes. Of course the only fact that other developer did it puts us in an uncomfortable place because there's a high chance that you're trying to understand patterns and approaches you wouldn't have taken, which doesn't mean they are wrong they just aren't yours. For a few months I had to deal not only with this, but with code full of bad practices. 
---

Some guys from my home town have a news site and they needed some new stuff and little tweaks on the design, after looking at the code I said that I would only work on it if they gave me the time to improve loading times and clean a little bit the code. And you know what, it wasn't that bad. At the beggining I didn't know how to work around this and get a good output at the end. Two things came to help me in a big way: Gulp and LESS.


### Organizing the styles

When I received the permissions to put my hands in the code the first little thing that made me open my eyes wide was a seven thousands lines style sheet. Bad indentation all the way and of course not the best practices on CSS, impossible to maintain and detect unused styles so the first thing I did was to pass the entire file through a CSS to LESS process. You can find CSS to LESS online processors in the web, they don't take all the advantages of the LESS language so I had to go line through line and fix a couple of lines to really look like a nice LESS file.

They weren't the funniest hours of my life but it reduced the file by more than a half and I lost less time trying to find what to fix or delete in the code in the next weeks.

#### A master LESS file to rule them all

A small decision sometimes becomes big. I decided to create a *main.less* file that will import first the *_oldStyles.less* file and everytime I refactored a particular section or functionality of the site I should erase them from that file and move it to a new one.

So, the main file looked like this at the beginning...

```
@import '_oldStyles.less';
```

After working a lot in the site and modularizing some parts of the site the main file looked like this...

```
@import '_reset.less';
@import '_general.less';
@import '_layout.less';
@import '_oldStyles.less';
@import '_header.less';
@import '_home.less';
@import '_footer.less';
@import '_singlePage.less';
@import '_categoryPage.less';
@import '_ads.less';
```

You can understand what most of the style sheets contain. In the general file I placed some variables like colors, spacing and mixins. In layout, the new grid system. I also deleted most of the browsers vendors and rely more on <a target="_blank" href="https://www.npmjs.com/package/gulp-autoprefixer">gulp-autoprefixer</a> and the mixins in the *_general.less* file.

The final step would be to delete completely the *_oldStyles.less* file, thing I wasn't able to do because my time ended. The good thing was that by doing this and deleting a lot of useless styles I reduced page loading time in a fifty percent.

The thing is that, of course, no matter how much you like LESS the site needs a CSS one to load.


#### Gulp to the rescue

In case you've never heard of it, <a href="http://www.gulpjs.com" target="_blank">GulpJS</a> is a build system that allows you to custimze and automate tasks. I started using it to process and test scripts but it became a great tool to handle any file inside a project.

One of the reasons why I prefer it from <a href="http://www.gruntjs.com" target="_blank">GruntJS</a> is that is faster to set and easier to read, if this is the first time you ever read a **gulpfile** you will notice that you will be able to guess what's happening in most of the lines.

```js
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css');

gulp.task('styles', function() {
    return gulp.src('./src/less/main.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(minifyCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./assets/styles/'));
});
```

Basically what we do is to require the modules we'll use, then we take the *main.less* file as a source, compile it to a CSS file, add prefixes, minify, rename it and place it in the destination folder. I will cover GulpJS in more depth in a future post.

That way, no matter the structure of the files this task will work. The only thing we need to do is to add a new import statement in the main file in case we added a new LESS file to our flow.


### Wrap-up

This is just an approach I took for this specific problem, I'm sure there's tons of ways to deal with this kind of crap. I hope you've found this useful.

Happy coding!