---
title: You might not need a task&nbsp;runner
resume: Most front end developers agree that tooling is something we as a community need to figure out this year. The fatigue around deciding and learning technologies to build big, and not so big, projects was a trend last year, so maybe it's time to slowly minimize dependencies and delete the middle men.
---

## The middle man

The last couple of years we saw the rise of task runners. **Why?** If you work on web projects you already have some JavaScript knowledge and being able to use the same language to run your build process is really cool.

You learn it fast, it is familiar to you and when you're setting it up or making a modification you feel that you're still doing front end work. That's definitely cool.

<a href="https://gruntjs.com" target="_blank">Grunt</a> gained popularity fast and packages started emerging quickly, behind them a big community giving support, and that's a healthy sign when choosing a tool for your project. The problem with Grunt was the steep learning curve to understand the task configuration, myself included.

That was the main reason why developers dwell to <a href="https://gulpjs.com" target="_blank">Gulp</a>. The stream/pipe pattern was really semantic and easy to work with. It's currently the choice of big companies like Google in their projects which boosted its development and improved its visibility around developers.


### The packages deviation

To actually do stuff with them the way they are intended you need specific modules, which are in most cases wrappers of already existing npm packages. That's a problem, because you get inside an update cycle which might never occur, for example when a fix is applied to a package, but you're using its Gulp or Grunt flavour you need to wait to the owner or contributors to apply the improvement in that wrapper.

And you know, someday you might wake up and find out that actually <a href="https://www.npmjs.com/package/gulp-browserify" target="_blank">browserify wrapper for Gulp is no longer being maintained</a>. Beautiful. Yes, it was sarcasm.

That's when a whole bunch of recipes appear to deal with this, and you need to download one or a couple more dependencies like <a href="https://www.npmjs.com/package/vinyl-source-stream" target="_blank">vinyl source stream</a> to do just what browserify does on its own.


## Using npm scripts

Instead of using a wrapped package we could just use the package itself, most of them provide a command line interface and documentation which is what you just need.

You also need to know a little bit of bash and how commands in the terminal work. In case you don't, I've created a <a href="https://gist.github.com/jeremenichelli/489973c73a00437a188c" target="_blank">bash&nbsp;reference&nbsp;gist</a> you can check and then come back to this post.

So now that we don't want middle men, if you need browserify, just install browserify.

```sh
npm install --save-dev browserify
```

Of course you can't just use the `browserify` command in your terminal, for that you would need to install it using the `-g` flag, but when you install it as a dev dependency and call it through scripts declared in the **package.json** file of your project npm itself acts as some kind of wrapper and binds the command to their corresponding local reference.

```json
{
  "name": "npm-scripts-sample",
  "title": "npm scripts sample project",
  "description": "Sample project to show how npm scripts work",
  "copyright": "2015",
  "version": "1.0.0",
  "license": "MIT",
  "scripts": {
    "build": "browserify js/app.js -o main.js"
  }
}
```

To trigger the script, just run this command `npm run build` in your terminal, but let's take this example more close to a real case where we usually need a development build process for debugging and production minified file.

First install the new package that is needed.

```sh
npm install --save-dev uglify-js
```

We can use the `|` operator to pass the output of browserify to uglify command.

```json
"scripts": {
  "build:dev": "browserify js/app.js -o main.js --debug",
  "build:prod": "browserify js/app.js | uglifyjs > main.js"
}
```

### Group scripts

Let's include styles in our build process. We better rename the script tasks so things don't get confusing.

```json
"scripts": {
  "js:dev": "browserify js/app.js -o main.js --debug",
  "js:prod": "browserify js/app.js | uglifyjs > main.js"
}
```

For the styles tasks we will process a **less** file and minify it. First, install the packages.

```sh
npm install --save-dev less cssmin
```

Then add the style script and a general `build` task to run both.

```json
"scripts": {
  "js:dev": "browserify js/app.js -o main.js --debug",
  "js:prod": "browserify js/app.js | uglifyjs > main.js",
  "less": "lessc less/app.less | cssmin > main.css",
  "build:dev": "npm run less & npm run js:dev",
  "build:prod": "npm run less & npm run js:prod"
}
```

Because neither browserify or less need each other to finish we can concat them using only one ampersand operator so they run asynchronously and speed up our build process.


### Pre scripts

You can also specify a task that needs to finish successfully before a script can run just by creating a new one with the same name and a **pre** prefix. For example, we could add a lint checking before building our **.js** file.

```json
"scripts": {
  "lint": "eslint js/**/*.js",
  "prejs:dev": "npm run lint",
  "prejs:prod": "npm run lint",
  "js:dev": "browserify js/app.js -o main.js --debug",
  "js:prod": "browserify js/app.js | uglifyjs > main.js",
  "less": "lessc less/app.less | cssmin > main.css",
  "build:dev": "npm run less & npm run js:dev",
  "build:prod": "npm run less & npm run js:prod"
}
```

Of course, you will need to install <a href="https://eslint.org/" target="_blank">eslint</a> or the linting utility you prefer. You might also have noticed that a **lint** script was created and I'm calling it in development and production build pre scripts, so if I make some change on the **eslint** command both are affected.

You can do the same with the **post** prefix and add task that should run after a specific script.

### Watch

To avoid running the same script over and over again we can install a <a href="https://www.npmjs.com/package/onchange" target="_blank">package</a> to watch our files.

```json
"scripts": {
  "lint": "eslint js/**/*.js",
  "prejs:dev": "npm run lint",
  "prejs:prod": "npm run lint",
  "js:dev": "browserify js/app.js -o main.js --debug",
  "js:prod": "browserify js/app.js | uglifyjs > main.js",
  "less": "lessc less/app.less | cssmin > main.css",
  "build:dev": "npm run less & npm run js:dev",
  "build:prod": "npm run less & npm run js:prod",
  "watch:js": "onchange './js/**/*.js' -- npm run js:dev",
  "watch:less": "onchange './less/**/*.less' -- npm run less",
  "watch": "npm run watch:less & npm run watch:js"
}
```

Easy to understand, you first write the **onchange** command, then pass the path you want to watch in a string and finally the command you want to run.

You can see all this configuration working on <a href="https://github.com/jeremenichelli/npm-scripts-sample" target="_blank">this repository</a>.

## Benefits and drawbacks

The bright side of this approach is we avoid package versioning problems and use node modules directly the way they are intended to be used.

On the other hand, you can't use custom command arguments and you can end up with really big chunk of long strings in your **package.json** file making it confusing and hard to maintain, and that's a big deal in a shared project. If that's your case then a task runner might be a better choice.

## Wrap up

As I always said, the intention of this post is not to bust task runners, I love using Gulp in my projects. But it's good to know what are the compromises they bring and if you are dealing with a build process that is easy to solve with a couple of bash commands, then you should definitely give npm scripts a try.
