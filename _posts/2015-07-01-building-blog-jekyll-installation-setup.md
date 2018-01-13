---
title: Building a blog using Jekyll. Install and quick&nbsp;setup
resume: This static site generator has become popular between developers because of its simplicity and the fact that runs in GitHub pages, a place in the web we the developers feel confortable working in.
---

In this first post, I'm going to explain really quick what you need to install it and the essential commands to start using it.

## What's Jekyll?

It's a static site generator written in Ruby, the programming language that will take care of the build process in your site. In case you know nothing about it, don't worry, me neither. You don't need any Ruby knowledge to use it.

It does use some other languages and tools that gives us the power to build custom and more complex stuff, the good part is that these techonologies are not hard to learn and they are well documented.

For configuration and data files <a href="https://en.wikipedia.org/?title=YAML" target="_blank">YAML</a> is used, though you're not going to manipulate this type of files very often, probably just at the beginning and when setting data files.

For templating, **Liquid**. Never heard of it? I recommend <a href="https://github.com/Shopify/liquid/wiki/Liquid-for-Designers" target="_blank">Shopify reference sheet for designers</a>. If you're familiar with other template engines it won't be hard at all to get used to it. The knowledge you will need on this will depend on how complex the layouts you want to build are.

For your pages and posts you can just use HTML, but if you like them <a href="https://guides.github.com/features/mastering-markdown/" target="_blank">Markdown</a> and <a href="https://gist.github.com/LeRoove/1536449" target="_blank">Textile</a> are supported. Though they're not perfect and complete tools, they are great if you need highlighting code syntax inside your posts like me.

To sum up very quickly these last paragraphs, Jekyll is a static site generator written in Ruby that uses YAML files for configuration, Liquid for templating and gives you the option of Markdown and Textile to build pages.


## Installation

So, you want to build a site or just know what all the fuss is about, then this is what you have to install.

**Jekyll** runs on **Ruby**, so this is the first basic requirement, here you can download the correct installation package depending on your operative system:

<a href="https://www.ruby-lang.org/en/downloads/" target="_blank">https://www.ruby-lang.org/en/downloads/</a>

You're also going to need **RubyGems** which is a package manager framework for Ruby which you can download here:

<a href="https://rubygems.org/pages/download" target="_blank">https://rubygems.org/pages/download</a>

<a href="https://www.nodejs.org" target="_blank">NodeJS</a> is required only if you want CoffeScript support out of the box.

Now we are ready to install this **gem** by simple running this in the terminal.

```bash
gem install jekyll
```

You might need admin permission to complete this, in that case run it again with ```sudo``` before. If you're having some other issue regarding installation check the <a href="http://jekyllrb.com/docs/installation/" target="_blank">official documentation</a> about this particular stage.


## Folder structure

With everything set, we can start building our site, these are the basic folders and files inside a standard Jekyll site.

- **_config.yml** file is placed in the root folder and it contains the configuration variables and global site variables. Here you can place general data like your name or the main title of the site and change things like the port in which you will test locally the site, the highlighting enging or permalinks.
- **_includes** folder will contain HTML files for sections of your site that will be present in more than one place, like the header or the footer, making the maintanance less painful because the modification you do here will replicate in every place you insert this files.
- **_layouts** folder holds the base templates for your files, all files must contain a layout so **Jekyll** can generate a valid HTML file. You can have as many as you need.
- **_posts** is there in case the site is blog-aware. Every page must start with the year, the month, the day and the title of the page separated by hyphens.
- **_site** folder is the one that contains the generated site so you don't actually need to modify this. In fact, if you're using Jekyll to run inside **GitHub pages** you have to include this directory in your **.gitignore** file since the instance of Jekyll running in the server will create it.
- **index.html** file needs to be present as any web project.

Other folders that are not necessary but very useful are **_data** where you can create ```.yml``` files and store general content and information to make your templates more dynamic and **_drafts** where you can upload writings in work that Jekyll will ignore when listing posts.


## Useful commands

Maybe this whole thing is still a little confusing and you don't feel so confident to start from zero ground and build the whole site, then your terminal run the ```new``` command.

```bash
jekyll new my-new-site
```

A new directory, **my-new-site** in this case, will be created with the basic folders and sample includes, layouts and posts will be there for you to explore or build your site above it.

Remember that this is a static site so if some file was updated it won't be reflected inside the **_site** folder, for that you can use ```build``` and if you don't want to run it every five seconds just add the watch flag.

```bash
jekyll build --w
```

It will detect modifications and trigger a build process automatically. Magic.

To browse your site, use the **serve** command.

```bash
jekyll serve
```

You can now test your work locally by typing **localhost:4000** in your browser. If you use the ```--w``` flag here you won't need another tab running the build process. If you want to see your drafts listed in your site posts add ```--drafts```.

```bash
jekyll serve --w --drafts
```

## Wrap-up

I hope this information was clear enough for you to have a quick and painless start using this great tool.

I swear to you that the learning curve is not steep, and in case you find difficulties in the process there's <a href="https://talk.jekyllrb.com" target="_blank">a brand new forum</a> where you can ask for help and of course you can reach me via email or twitter if you have a quick question.

Happy blogging!
