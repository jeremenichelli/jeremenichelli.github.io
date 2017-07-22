---
title: Why code styles in open&nbsp;source
resume: Linting tools are trending right now. Big companies are using them in their projects and if you're working with other people in a same project with lots of lines of code and a build process there's a chance you're already using them too, but what about small open source projects?
---
You might have heard that you're going to spend more time reading code than writing it. You investigate, use tools that other developers have created, fix issues in someone else's work which requires you to understand what's going on, which means you have to read that code.

Most of the times you read a lot of lines to be able to write a couple of them.

### What's a code style?

To be brief, it's a group of rules that define how a code should look. One of those rules could be to not allow if statements without curly braces, indentation or the maximum length a line of code must have for example.

The immediate benefit is the readability of the code. Each of us have preferences over those rules, I prefer four spaces but some developers prefer two. Whatever your choices are, truth is that as you read a code that is properly formatted you get used to it, because it is **cohesive**, even if the styles of the code aren't your common choices.

> What if someone wants to propose a change, fix a bug or add a feature to your open source&nbsp;code?

In a project, the code style to follow must be a team decision and is important because it will have a great impact at the moment of finding something wrong on the code or to refactor part of it. It's way easier to find an issue or to add a feature on a code which looks similar than doing it in one with style changes every ten lines.

Where the abscense of these rules is more critical is in small open source, and not that small, projects. If you're writing some library, polyfill or just a small solution to share to other devs you need to apply code styles rules to it and provide a command to check if all files are following them. What if someone wants to propose a change, fix a bug or add a feature to your open source code?

The code style of your project is the result of the combination of a lot of rules and we can't expect the person who is collaborating with our repository to know all of them, that would be crazy. Today we have tools like **Gulp** or **Grunt** which can be used by that person. He or she can run a task and know which specific modifications needs to be applied to keep the code looking beautiful and readable.


### Linting tools

The first popular tool of this kind to appear was <a href="http://www.jslint.com/" target="_blank">jslint</a> and though is not being used by developers today it was an inspiration for the ones that currently are.

Our second tool in the list is <a href="http://jshint.com/" target="_blank">jshint</a>, which isn't a linting tool itself but one that tries to prevent potential problems in the script. The thing is that it contains some configurable options about code style too, so the lines are blurry here. To customize it you create a ```.jshintrc``` file in the root folder of your project, the configurable options can be found in the Documentation section of their page.

The next one is <a href="http://jscs.info/" target="_blank">jscs</a> which is usually used in combination with **jshint**, but this one it is indeed a code style checker and nothing else. Popular because is used by well-known organizations like Google, Adobe and jQuery because it's fast, well documented and has presets that you can load. If you want to use the code styles that Google uses, in the ```.jscsrc``` file you can just configure one option:

```js
{
  "preset: "google"
}
```

And that's it, though I recommend you to check out <a href="https://github.com/jscs-dev/node-jscs/tree/master/presets" target="_blank">the presets folder in their GitHub repository</a> and see if there isn't any rule which you disagree with. In that case you can create your own preset.

The last one that I will mention is <a href="http://eslint.org/" target="_blank">eslint</a>. This one is the youngest one and covers both possible code issues and code styles. It has a really nice documentation and though is not as fast as **jscs** it gets the job done very well.

My choice lately has been the combination of both **jshint** and **jscs**, but I've also used **eslint**. While there's not a clear advantage thought I did notice something in particular. I was collaborating with Dustan Kasten in his really good <a href="https://github.com/iamdustan/smoothscroll">smooth scroll polyfill</a> and **eslint** was really accurate at detecting unused variables. Apparently **jshint** isn't that smart about them, if you're assigning something to a variable but then doing nothing with it **eslint** will notice it while **jshint** won't. At least that was my experience.

Also, in **eslint** instead of setting an option to be ```true``` or ```false``` you can configure it to be a warning. If we don't want a syntax error to affect the exit code, but we do want that to be reported in the terminal to caught the developer's attention we can set the rule in an array form with a code number and the rule value.

```js
{
  // other eslint rules...

  // 0: no error, 1: warning, 2: error
  "quotes": [1, "single"]
}
```


## Using linting tools in Gulp

All of these utilities are of course packages which its corresponding **Grunt** versions, but my choice on task runners is **Gulp** nowadays. If you're familiar with it, setting up automated asks is really simple.

To get **jshint** and **jscs** running you must first create ```.jshintrc``` and ```.jscsrc``` files in the root of your project with your code style rules and install both packages.

```bash
npm install --save-dev gulp-jshint gulp-jscs
```

Once you've done that you can create a ```lint``` task.

```js
var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  jscs = require('gulp-jscs');

gulp.task('lint', function() {
  return gulp.src('/assets/scripts/**/*.js')
    .pipe(jshint())
    // interrupt task if an error is found
    .pipe(jshint.reporter('fail'))
    .pipe(jscs());
});
```

In case you want to use **eslint** you need to create a ```.eslintrc``` file instead and install the package.

```bash
npm install --save-dev gulp-eslint
```

This is how the ```lint``` task will look in this case.

```js
gulp.task('lint', function() {
  return gulp.src('/assets/scripts/**/*.js')
    .pipe(eslint())
    // outputs the lint results to the console.
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe(eslint.failOnError());
});
```

Now any developer who wants to contribute with your project doesn't need to know your coding preferences, just by running ```gulp lint``` the terminal will report what needs to be changed.


## Wrap-up

Today there are a lot of awesome tools with nice documentation we can use to provide possible collaborators the chance to add code while maintaining the cohesion in our open projects, but this is also scalable to big projects where there are a lot developers with different code preferences.

Maybe the painful part is to set the configuration file which contains a lot of options that can be set. I usually turn all possible warnings or errors to true, run the command and start modifying or turning off the ones that I don't consider harmful.

In case you need a place to start I've created <a href="https://gist.github.com/jeremenichelli/a4dff3e4034d3c324380" target="_blank">a gist with an example for each of the tools</a> that were mentioned here.

Happy coding!
