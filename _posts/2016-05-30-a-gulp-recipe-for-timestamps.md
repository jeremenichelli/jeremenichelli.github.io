---
title: A Gulp recipe for&nbsp;timestamps
resume: Making sure you serve your users the correct collection of assets is a real challenge, even for static websites, but you can combine some logic on a task runner and your site generator templating to solve this riddle.
---

A quick solution in Jekyll would be to get the last build time and put it at the end of the urls as a query parameter.

```html
<link href="/css/main.css?v={% raw %}{{ site.time | date_to_xmlschema }}{% endraw %}">
```

The problem is that not every build is triggered by a change in our styles or scripts, it could be a change in a template or a post.

We don't want to generate new timestamps on these cases because we will force returning users to download assets again when they haven't really changed.


## Come together

On one side, you might be using a task runner to process your assets, and probably each time you do that a new timestamp should be created.

On the other side, your site generator must know that somehow.

For **Jekyll** and **Gulp**, I thought a good communication channel could be a simple *.json* file which both are able to read.


### The timestamps

Jekyll gives us a *_data* folder to place files which content can be later accessed by its templating engine, so we're going to create a new *timestamps.json* file inside this directory.

```json
{
  "scripts": 0,
  "styles": 0,
  "images": 0
}
```

Notice we are saving a timestamp for each type of resource.


### The recipe

Each time a build modifies a file from one of these assets we need to update the corresponding timestamp.

```js
var gulp = require('gulp');
var less = require('gulp-less');
var minify = require('gulp-clean-css');

// styles task
gulp.task('styles', function() {
  return gulp.src('./styles/main.less')
    .pipe(less())
    .pipe(minify())
    .pipe(gulp.dest('./assets/'))
    // update timestamp for styles
    .pipe(updateTimestamp('styles'));
});
```

This is a simple task in Gulp where we process less files and then minify the output, but at the end of it we *pipe* a custom method.

```js
var gulp = require('gulp');
var util = require('gulp-util');
var file = require('gulp-file');

// import timestamps
var timestamps = require('./_data/timestamps.json');

// update timestamp
function updateTimestamp(stamp) {
  timestamps[ stamp ] = Date.now();

  return file(
      'timestamps.json',
      JSON.stringify(timestamps, null, 2),
      { src: true }
    )
    .pipe(gulp.dest('./_data'));
}
```

This method imports the *timestamps.json* data, updates a given timestamp and then overrides the file with the modification.

*The [Date.now][1] method returns the number of milliseconds elapsed since 1 January 1970, generating a unique number each time is invoked which comes handy for us here.*

Let's get this recipe together.

```js
var gulp = require('gulp');
var less = require('gulp-less');
var minify = require('gulp-clean-css');
var file = require('gulp-file');

// import timestamps
var timestamps = require('./_data/timestamps.json');

// update timestamp
function updateTimestamp(stamp) {
  timestamps[ stamp ] = Date.now();

  return file(
      'timestamps.json',
      JSON.stringify(timestamps, null, 2),
      { src: true }
    )
    .pipe(gulp.dest('./_data'));
}

// styles task
gulp.task('styles', function() {
  return gulp.src('./styles/main.less')
    .pipe(less())
    .pipe(minify())
    .pipe(gulp.dest('./assets/'))
    // update timestamp for styles
    .pipe(updateTimestamp('styles'));
});
```

The method can be easily use in other tasks by changing the string passed to the *updateTimestamp* method.


### Timestamps on templates

Since we are placing our timestamps file in the **_data** folder, its content is globally available for use under the **site.data** namespace in Jekyll.

```html
<link href="/assets/main.css?v={% raw %}{{ site.data.timestamps.styles }}{% endraw %}">
```

The result will be similar to this.

```html
<link href="/assets/main.css?v=1464493602124">
```


## Wrap-up

I've used **Gulp** and **Jekyll** in this article but it could be easily adapted to any site generator that accepts this type of data access through *.json* files and any modern task runner.

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
[2]: https://www.npmjs.com/package/gulp-file
