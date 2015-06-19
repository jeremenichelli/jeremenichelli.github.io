---
layout: post
title: Code styles are as important as the code itself
resume: Linting tools are trending right now. Big companies are using them in their projects and if you're working with a team in a project with a lot of lines of code and a build process, but what about small open source projects?
---
You might have heard that you're going to spend more time reading code than writing it. You investigate, use tools that other developers have created, fix issues in someone else's work which requires you to understand what's going on, which means you have to read that code.

Most of the times you read a lot of lines to be able to write a couple of them.

### What's a code style?

To be brief, it's a group of rules that define how a code should look. One of those rules could be to not allow if statements without curly braces, indentation or the maximum length a line of code must have for example.

The immediate benefit is the readability of the code. Each of us have preferences over those rules, I prefer four spaces but some developers prefer two. Whatever your choices are, truth is that as you read a code that is properly formatted you get use to it, because it is **cohesive**.

Even if the style of the code aren't your common choices.

In a project, the code style to follow must be a team decision and is important because it will have a great impact at the moment of finding something wrong on the code or to refactor a part of it. It's way easier to find an issue or to add a feature on a code which looks similar than doing it which style changes every ten lines.

Where the abscense of these rules is more critical is in small open source, and not that small, project. If you're writing some library, polyfill or just a small solution to share to other devs you need to apply code styles rules to it and provide a command to check if all files are following them. What if someone wants to propose a change, fix a bug or add a feature to your open source code?

The code style of your project is the result of the combination of a lot of rules and we can't expect the person who is collaborating with our repository to know of all of them, that would be crazy. Today we have tools like **Gulp** or **Grunt** which can be used by that person. He or she can run a task and know which specific modifications needs to apply to keep the code cohesive.


### Linting tools

The first popular tool of this kind to appear was JSLint though today is not used, but probably was an inspiration for the ones that currently are.

Our second tool in the list is <a href="http://jshint.com/" target="_blank">jshint</a>, which actually isn't a linting tool itself but one that tries to prevent potential problems in the script. The thing is that it contains some configurable options about code style so the lines are blurry here. To customize it you create a ```.jshintrc``` file in the root of your folder, the configurable options can be found in the Documentation section of their page.

The next one is <a href="http://jscs.info/" target="_blank">jscs</a> which is usually used in combination with **jshint**, though this one it is indeed a code style checker and nothing else. It's very used for well-known organizations like Google because it's fast, well documented and has presets that you can load. If you want to use the code styles that Google use, in the ```.jscsrc``` file you can just configure one option:

```json
{
    "preset: "google"
}
```

And that's it, though I recommend you to check out <a href="https://github.com/jscs-dev/node-jscs/tree/master/presets" target="_blank">the presets folder in their GitHub repository</a> and see if there isn't any rule which you disagree with. If not you can create your own preset.

The last one that I will mention is <a href="http://eslint.org/" target="_blank">eslint</a>. This one is the youngest one and covers both possible code issues and code styles. It has a really nice documentation and though is not as fast as **jscs** it does the job very well.

My choice lately has been the combination of both **jshint** and **jscs**, but I've also used **eslint**. There's not a clear advantage thought I did notice something in particular. I was collaborating with Dustan Kasten in his really good <a href="https://github.com/iamdustan/smoothscroll">smooth scroll polyfill</a> and **eslint** was really accurate at detecting unused variables. Apparently **jshint** isn't that smart about them, if you're assigning something to a variable but then doing nothing with it **eslint** will notice it while **jshint** won't. At least that was my experience.

Also, instead of setting an option to be ```true``` or ```false``` you can configure it to be a warning. For example, if we don't want a double quote syntax to affect the exit code but we do want that to appear in the console to call the developer's attention with can set the rule in an array form with a code number and the rule value.

```json
{
    // other eslint rules...

    // 0: no error, 1: warning, 2: error
    "quotes": [1, "single"]
}
```


### Using linting tools in Gulp

All of these utilities are of course packages which its corresponding **Grunt** versions, but I'm on the **Gulp** team for now. If you're familiar it, setting up tasks is really simple.

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

This is how the ```lint``` task could look this time.

```js
gulp.task('lint', function() {
    return gulp.src(paths.src)
        .pipe(eslint())
        // outputs the lint results to the console. 
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on 
        // lint error, return the stream and pipe to failOnError last. 
        .pipe(eslint.failOnError());
});
```

Now if any developer want to collaborate with our project there's a bash command available ```gulp lint``` that can be call and know if the modifications that were made in our project pass our code styles rules.


### Wrap-up

Today there are a lot of awesome tools with nice documentation we can use to provide possible collaborators the chance to add code while maintaining the cohesion in our open projects, but this is also scalable to big projects where there are a lot developers with different code preferences changing the same code base.

Maybe the painful part is to set the configuration files which have a lot of options that can be set. I usually turn all possible warnings or errors to true and run the command and start modfing or turning off the ones that I don't consider harmful. In case you need a place to start I've created <a href="https://gist.github.com/jeremenichelli/a4dff3e4034d3c324380" target="_blank">a gist with an example for each of the tools</a> I mentioned in this post and you can always go the the tool website and check the documentation.

Happy coding!
