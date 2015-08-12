---
layout: post
title: Small improvements in gulp files
resume: I want to share some things I always do when I'm building my tasks in Gulp. Small patterns to solve simple situations and improve the build process in my projects.
---

## Use the package.json file

The original use of the package.json file is to provide necessary information for module manager scripts like <a href="https://www.npmjs.com" target="_blank">npm</a> to manage version and dependencies.

One of the key properties of this file is the **name** one. The people from npm have a couple of advices to you, if you're going to publish a module, in their <a href="https://docs.npmjs.com/files/package.json" target="_blank">documentation</a>.

What is really common is to name your files as the name of the package, but if your scripts don't belong to a module you can fill it and later use it to set dinamically strings that you can use as paths in your gulp file.

```js
var project = require('./package.json');

// project paths
var paths = {
    src: './src/' + project.name + '.js',
    spec: './test/' + project.name + '.spec.js',
    output: './dist'
}

gulp.task('something', function() {
    gulp.src(paths.src)
        .pipe( ... )
        .pipe( ... )
        .pipe(gulp.dest(paths.dest));
});
```

What is good is that if you change the name of your project you just have to do it in your package.json file and the name of your source file.

Another way to use the information available inside the package is to build a banner and put it on the top of your distribution file. To add it I use the ```gulp-concat-util``` package.

```js
var concat = require('gulp-concat-util');

var banner = '/*' +
    '\n * ' + project.title + ' - v' + project.version +
    '\n * ' + project.url +
    '\n * ' + project.copyright + ' (c) ' + project.author + ' - ' + project.license + ' License' +
    '\n*/\n\n';

gulp.task('build', function() {
    gulp.dest(paths.src)
        .pipe( ... )
        .pipe( ... )
        .pipe(concat.header(banner));
        .pipe(gulp.dest(paths.output));
});
```

## Organizing and naming tasks

As I explained in <a href="/2015/05/using-gulp/">my previous post</a>, Gulp has a great and simple way to tell a task that some other ones need to finish before it starts.

```js
gulp.task('karma', [ 'lint' ], function() {
   // do something 
});
```

Gulp waits for **lint** to execute before starting with **karma** task here. As you see we pass an array of task names as a second argument. The third one, the function that holds the functionality of the task, is actually optional. This means that you can use an alias to group similar tasks.

Something I often do in my projects is to check the syntax in both test and source files of my projects and use the name of the process followed by a colon and the name of the folder where I'm applying the task, for example *hint:src* and *hint:spec*. Then you can create a general *hint* task.

```js
gulp.task('hint', [ 'hint:spec', 'hint:src' ]);
```

This gives you the option of just check the syntax in your spec files or in your source files only but also to call the *hint* task and run it on both directories.

## Wrap-up

These are just small personal decisions I make when building gulp files. I hope you found them interesting and if you have suggestions or other smart moves and patterns feel free to share them with me and the community.
