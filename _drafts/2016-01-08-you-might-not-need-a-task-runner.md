---
layout: post
title: You might not need a task runner
resume: Most front end developers agree that tooling is something we as a community need to figure out this year. The decisions and learning curves around technologies used to build big, and not so big, projects was a trend last year, so maybe it's time to slowly minimize dependencies and delete some middle men.
---

## The middle men

The last couple of years we saw the rise of task runners and it makes totally sense. Why? Well, because if you work on web projects you already have some JavaScript knowledge and being able to use the same language to run your build process is really cool. You learn it fast, it is familiar to you and when you're setting it up or making a modification you feel that you're still doing front end work. That's definitely cool.

<a href="https://gruntjs.com" target="_blank">Grunt</a> gained popularity fast and packages started to emerge fast, behind them a big community supporting them, and that's a healthy sign when choosing a tool for your project. The problem with Grunt was the steep learning curve to understand the task configuration, myself included.

That was the main reason why developers dwell to <a href="https://gulpjs.com" target="_blank">Gulp</a>. The stream/pipe pattern was really semantic and easy to work with. It's currently the choice of big companies like Google in their projects which boosted its development and improved its visibility around developers.


### The packages deviation

To actually do stuff with them the way they are intended you need specific modules, which are in most cases wrappers of already existing npm packages. That's a problem, because you get inside an update cycle which might never occur, for example if you're using browserify to bundle your scripts and modules and it gets a fix then you need to wait to the Gulp or Grunt package owner to apply that improvement in that wrapper.

And you know, someday you wake up and find out that actually <a href="https://www.npmjs.com/package/gulp-browserify" target="_blank">browserify wrapper for Gulp is no longer being maintained</a>. Beautiful. Yes, that was sarcasm.

And that's when a whole bunch of recipes appear to deal with this, and you need to download one or a couple more dependencies like <a href="https://www.npmjs.com/package/vinyl-source-stream" target="_blank">vinyl source stream</a> to do just what browserify does on its own.


## Using npm scripts

Instead of using a wrapped package we could just use the package itself, most of them provide a command line interface and documentation which is what you just need.

You also need to know a little bit of bash and how commands in the terminal. In case you don't, you can check this <a href="https://gist.github.com/jeremenichelli/489973c73a00437a188c" target="_blank">bash&nbsp;reference&nbsp;gist</a> I've created for this post and then come back to this post.

So now that we don't have middle men, if you need browserify, just install browserify.

```sh
npm install --save-dev browserify
```

Of course you can't just use the `browserify` command in your terminal, to actually be able to do that you would need to install it using the `-g` flag, but when you install it as a dev dependency and call it through scripts declared in the **package.json** file of your project npm itself acts as some kind of wrapper and binds the command to their corresponding local node modules.

```json
{
    "name": 'sample',
    "copyright": "2015",
    "version": "2.0.0",
    "license": "MIT",
    "scripts": {
        "build": "browserify js/app.js -o main.js"
    }
}
```

To trigger the script, just run this command on the console `npm run build`, but let's take this example more close to a real case where we actually need a development build process for debugging and production build process with minifaction.

First install the new package that is needed.

```sh
npm install --save-dev uglify-js
```

We can use the `|` operator to pass the output of browserify to uglify command.

```json
"scripts": {
    "build:dev": "browserify js/app.js -o main.js --debug",
    "build:prod": "browserify js/app.js | uglify main.js"
}
```

### Group scripts

Since we need build tasks for our styles too, we are going to rename the ones we've just created.

```json
"scripts": {
    "js:dev": "browserify js/app.js -o main.js --debug",
    "js:prod": "browserify js/app.js | uglify main.js"
}
```

For the styles tasks we will process a `.less` file and minify it. First, install the packages.

```sh
npm install --save-dev less cssmin
```

Then add the style script and a general `build` task to run both.

```json
"scripts": {
    "js:dev": "browserify js/app.js -o main.js --debug",
    "js:prod": "browserify js/app.js | uglify main.js",
    "less": "lessc less/app.less | cssmin > main.css",
    "build:dev": "npm run js:dev & npm run less",
    "build:prod": "npm run js:prod & npm run less"
}
```

Because neither browserify or less need each other to finish we can concat them using only one ampersand operator so they run asynchronously and speed up our build process.


### Pre scripts

You can also specify a task that needs to finish successfully before a script can run just by creating a new script with a **pre** prefix. For example, we could add a lint checking before our build process.

```json
"scripts": {
    "lint": "eslint js/**/*.js",
    "prejs:dev": "npm run lint",
    "prejs:prod": "npm run lint",
    "js:dev": "browserify js/app.js -o main.js --debug",
    "js:prod": "browserify js/app.js | uglify main.js",
    "less": "lessc less/app.less | cssmin > main.css",
    "build:dev": "npm run js:dev & npm run less",
    "build:prod": "npm run js:prod & npm run less"
}
```

Of course, you would need to install <a href="https://eslint.org/">eslint</a> or the linting utility you prefer. You might also have noticed that I created a *lint* script and I'm calling it before development and production build tasks, so if I make some change on the lint command it affects both.

You can do the same with the **post** prefix and add script that should run after other one.

### Watch

To avoid running the same script over and over again we can install the <a href="https://www.npmjs.com/package/watch">watch</a> package and add it to our scripts.

```json
"scripts": {
    "lint": "eslint js/**/*.js",
    "prejs:dev": "npm run lint",
    "prejs:prod": "npm run lint",
    "js:dev": "browserify js/app.js -o main.js --debug",
    "js:prod": "browserify js/app.js | uglify main.js",
    "less": "lessc less/app.less | cssmin > main.css",
    "build:dev": "npm run js:dev & npm run less",
    "build:prod": "npm run js:prod & npm run less",
    "watch:js": "watch 'npm run js:dev' js/**/*.js",
    "watch:less": "watch 'npm run build:less' less/**/*.less",
    "watch": "npm run watch:js & npm run watch:less"
}
```

Easy to understand, you first call the watch command, then pass the command you want to execute in a string and then which files should be watched.

## Benefits and drawbacks

The bright side of this approach is we avoid package version problems and use node modules directly the way they are intended to be used. On the other hand, you might need to do complex stuff for your build process, if that's your case then a task runner is a better choice.

With npm scripts you can't use custom command arguments and you can end up with really big chunk of strings in your **package.json** file making it confusing and hard to maintain, and that's a big deal in a shared project.

## Wrap up

As I always said, the intention of this post is not to bust task runners, I love using Gulp in my projects. But it's good to know what are the compromises they bring and if you are dealing with a build process that is easy to solve with a couple of bash commands, then you should definitely give npm scripts a try.




