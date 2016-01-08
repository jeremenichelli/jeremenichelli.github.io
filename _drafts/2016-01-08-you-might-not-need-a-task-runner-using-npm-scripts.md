---
layout: post
title: You might not need a task runner. Using npm scripts
resume: Most front end developers agree that tooling is something we as a community need to figure out this year. The decisions and learning curves around technologies used to build big (and not so big) projects was a trend last year, so maybe it's time to slowly minimize dependencies and delete some middle men.
---

## The middle men

The last couple of years we saw the rise of task runners and it makes totally sense. Why? Well, because if you work on web projects you already some JavaScript knowledge and being able to use the same language to run your build process is really cool. Yoy learn it fast, it is familiar to you and when you're setting it up or making a modification you feel that you're still doing front end work. That's definitely cool.

<a href="https://gruntjs.com" target="_blank">Grunt</a> gained popularity fast and packages starting to emerge fast, behind them a big community supporting them, and that's a healthy sign when choosing a tool for your project. The problem with Grunt was the steep learning curve to understand the task configuration, myself included.

That was the main reason why developers dwell to <a href="https://gulpjs.com" target="_blank">Gulp</a>. The stream/pipe pattern was easy to understand, read and extend. It's currently the choice of big companies like Google in their projects which boosted its development and improved its visibility.


### The packages deviation

To actually do stuff with them the way they are intended you need specific packages, which are in most cases wrappers of already existing npm packages. That's a problem, because you get inside an update cycle which might never occur, for example if you're using browserify to bundle your scripts and modules and it gets a fix then you need to wait to the Gulp or Grunt package owner to apply that improvement in that wrapper.

And you know, someday you wake up and find out that actually <a href="https://www.npmjs.com/package/gulp-browserify" target="_blank">browserify wrapper for Gulp is no longer being maintained</a>. Beautiful. Yes, that was sarcasm.

And that's when a whole bunch of recipes appear to deal with this, and you need to download one or a couple more dependencies like <a href="https://www.npmjs.com/package/vinyl-source-stream" target="_blank">vinyl source stream</a> to do just what browserify does on its own.


## Using npm scripts

Instead of using a wrapped package we could just use the package itself, most of them provide a command line interface and documentation which is what you just need.

You also need to know a little bit of bash and how commands in the terminal. In case you don't you can check this <a href="https://gist.github.com/jeremenichelli/489973c73a00437a188c" target="_blank"> small reference</a> I've created for this post and then come back to this post.




