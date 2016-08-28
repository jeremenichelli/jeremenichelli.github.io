---
layout: default
title: Building a blog using Jekyll. Creating custom layouts
resume: Using the versatility of Liquid language, you can practically build any layout you want in Jekyll. Here's a quick explanation on how to do it.
---

This post assumes that you have a basic knowledge of the folder structure of a Jekyll project and basic Liquid syntax. If you don't you can <a href="/2015/07/building-blog-jekyll-installation-setup/">go to my previous post</a> where I explain this.

Jekyll comes with a handy `new` command that creates a boilerplate site you can start with. Though it's great to start playing around, and I suggest you do, I prefer to start from zero ground to feel sure that there isn't something there I would have never choose to put.

If you're going my way and you're starting with an empty folder then you're going to need a **_config.yml** file or the `build` and `serve` commands won't work. You can start with this sample.

```yaml
# site settings
title: Your awesome title
author: Your name
description: "Write an awesome description for your new site here. It will appear in your document head meta (for Google search results) and in your feed.xml site description."

# build settings
port: 4000
highlighter: pygments
markdown: redcarpet
permalink: pretty
```

Some of the values here are default like the **port**, but the default **markdown** engine is karmdown. My choice is <a href="https://github.com/vmg/redcarpet" target="_blank">redcarpet</a>.

Except for the build settings, the rest of the properties you declare here are going to be available in your layouts under the `site` namespace.

## Modularize your pages

The first thing that you need to do is separate parts that are going to be in every section, or at least in more than one, in your site. Then you put does small HTML parts inside the **_includes** folder.

The most common parts are the head tag, the header and the footer of your site, but this depends on the design you're trying to achieve. You can have a side column, a **recent posts** section you can attach to every article or a badge with your information for example.

> includes make maintainance much easier, something similar to what you have in php based generators

Doing this will make maintainance much easier, something similar to what you have in php based generators like Wordpress. This time, they are just **.html** files and the only thing you're required to do is to include this parts inside the **_includes** folder and nothing more.

You can still play a little with Liquid here. For example inside the head tag you can check if the page has a title, and if not you can default you the site title.

```html
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>
    {% raw %}{% if page.title %} {{ page.title }}
    {% else %} {{ site.title }}
    {% endif %}{% endraw %}
  </title>
  <meta name="description" content="{% raw %}{{ site.description }}{% endraw %}">
  <meta name="viewport" content="width=device-width">
</head>
```

We save this as **head.html** inside the **_includes** folder and we can now create more versatile base templates.


## _layouts

This is the name of your folder where your layouts, pretty obvious, are going to be placed. There's not much to explain here, the best is to show you how a layout would look in Jekyll.

```html
<!DOCTYPE html>
<html lang="en">

  {% raw %}{% include head.html %}{% endraw %}

  {% raw %}{% include header.html %}{% endraw %}

  <body>
    <section class="page-wrapper">
      {% raw %}{{content}}{% endraw %}
    </section>
  </body>

  {% raw %}{% include footer.html %}{% endraw %}
</html>
```

Pretty easy to understand. We're going to call this layout **default.html**, but if we want more special layouts for pages or posts we can add as many as we want. For example let's create a post layout structure. This time the `{% raw %}{{ content }}{% endraw %}` placeholder will hold the text inside the article and not the whole page.

```html
<!DOCTYPE html>
<html lang="en">

  {% raw %}{% include head.html %}{% endraw %}

  {% raw %}{% include header.html %}{% endraw %}

  <body>
    <section class="post-wrapper">
      <p class="post-date">{% raw %}{{ page.date }}{% endraw %}</p>
    </section>
    <h1 class="post-title">{{ page.title}}</h1>
    <article class="post-content">
      {% raw %}{{content}}{% endraw %}
    </article>
  </body>

  {% raw %}{% include footer.html %}{% endraw %}
</html>
```

With small changes you can heavily alter the markup and structure of your templates, and the more you know Liquid blocks and built in filters the more powerful this layouts can become.


## Create your index page

Now that we have the basic needs for our site, we can create an **index** file in our folder. This file can be either be an html file or a markdown file.

```html
---
layout: default
---

## Hi this is my site

This is the **index** page.

This site is built with Jekyll.
```

After you've saved this file in the root folder, you can run the `serve` command and see the results.

You might have noticed that before starting with the content we specify the **layout** that Jekyll needs to use to render this page as a configuration property. You can also put other variables like a **title** or **excerpt** and they can be access through the `page` namespace as we did in our **head.html** file above.


## Wrap-up

Placing html files in some specific folders and with some basic Liquid blocks we're able to build inifinte template flavours. This is why Jekyll is so powerful, it relies on simple languages and technologies.

I hope you found this article useful, if not you can always go to <a href="http://jekyllrb.com/docs/frontmatter/">Jekyll's official documentation</a>.
