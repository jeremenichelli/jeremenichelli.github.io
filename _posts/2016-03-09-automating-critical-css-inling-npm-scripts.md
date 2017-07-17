---
title: Automating the critical CSS inlining with npm scripts
resume: A few months ago I published an article about inling critical CSS to improve content-first-pages performance and looking at the stats it became quite popular. Later I wrote another one about the benefits of using npm scripts when possible, so consider this a merge of both.
---

*I will avoid an introduction about these topics, but you can go to my previous posts about [critical css inlining](/2015/10/automating-the-critical-css-inlining-with-gulp) and [npm scripts](/2016/01/you-might-not-need-a-task-runner) and then come back to this one.*


## Divide and conquer

Nowadays it's really weird to not use a preprocesor, so let's suppose we are using **LESS**. The files structure might change depending on your needs and you can use **@import**(s) to improve the maintainability of your project, for now we're going to create two files containing the critical and noncritical styles.

```
├── src
│    └── styles
│          ├── critical.less
│          └── noncritical.less
```


## Keeping it simple

First thing is to detect what we need to do, in order to know what packages we're going to install. For this recipe, process `.less` files, minimize them and move them to the correct folder.

To visualize how powerful **npm scripts** are, this is all we need to install.

```sh
npm install --save-dev less cssmin
```

### Noncritical

In the **scripts** property of the `package.json` file of your project, add a `styles:noncritical` task.

```json
{
  ...
  "scripts": {
    "styles:noncritical": "lessc src/styles/noncritical.less | cssmin > assets/styles/site.css"
  }
}
```

Just like in the solution I proposed with **Gulp**, the result goes to an **assets/styles/** folder, but npm scripts will not try to create it and throw an error in your terminal.

You can create it manually or install `mkdirp` package and write a simple *prescript*.

```sh
npm install --save-dev mkdirp
```

```json
{
  ...
  "scripts": {
    "prestyles:noncritical": "mkdirp assets/styles",
    "styles:noncritical": "lessc src/styles/noncritical.less | cssmin > assets/styles/site.css"
  }
}
```

### Critical

For this one the solution is pretty much the same, the only differences are the destination folder and the extension of the file. Both will depend on the engine you're using to generate your site, this example should work for **Jekyll** sites.

```json
{
  ...
  "scripts": {
    ...
    "prestyles:critical": "mkdirp _includes",
    "styles:critical": "lessc src/styles/critical.less | cssmin > _includes/criticalCSS.html"
  }
}
```

We are exporting the result as an **.html** file because that's the type of file **Jekyll** uses for includes, the next thing is to add it in the **head** of your site between **style** tags.

```html
<head>
  ...
  <style>{% raw %}{% include criticalCSS.html %}{% endraw %}</style>
</head>
```


#### Adapt the solution to other platforms

In **Wordpress** the solution doesn't differ that much. This time the file will be exported with a **.php** extension and use the correct include pattern.

```json
{
  ...
  "scripts": {
    ...
    "styles:critical": "lessc src/styles/critical.less | cssmin > wp-content/themes/your_theme/criticalCSS.php"
  }
}
```

Take in count that the path could change depending on where your **package.json** is placed and the name of the **Wordpress** theme.

```php
<head>
  ...
  <?php include (TEMPLATEPATH . '/criticalCSS.php'); ?>
</head>
```

#### Grouping tasks

To simplify the execution of them we can put these both tasks together in a new one.

```json
{
  ...
  "scripts": {
    "prestyles:noncritical": "mkdirp assets/styles",
    "styles:noncritical": "lessc src/styles/noncritical.less | cssmin > assets/styles/site.css",
    "prestyles:critical": "mkdirp _includes",
    "styles:critical": "lessc src/styles/critical.less | cssmin > _includes/criticalCSS.html",
    "styles": "npm run styles:noncritical & npm run styles:critical"
  }
}
```

Now, you can just run `npm run styles` and presto!


#### Watch 'em all

To really automate this task let's install a new package that will watch any change on our **.less** files and run the necessary task for us.

```sh
npm install --save-dev onchange
```

Add a watch script.

```json
{
  ...
  "scripts": {
    "prestyles:noncritical": "mkdirp assets/styles",
    "styles:noncritical": "lessc src/styles/noncritical.less | cssmin > assets/styles/site.css",
    "prestyles:critical": "mkdirp _includes",
    "styles:critical": "lessc src/styles/critical.less | cssmin > _includes/criticalCSS.html",
    "styles": "npm run styles:noncritical & npm run styles:critical",
    "watch:styles": "onchange src/**/*.less -- 'npm run styles'"
  }
}
```

Finally we can write `npm run watch:styles` in the terminal and the **styles** script will run every time we modify any style in our project.


## Wrap-up

This is a base solution for CSS inlining using **npm scripts** and it might defer depending on how your site is built and what you're using to write its styles, but it shouldn't be hard to adapt.
