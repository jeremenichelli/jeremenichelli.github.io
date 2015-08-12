---
layout: post
title: Building a blog using Jekyll. Writing posts and presenting them
resume: In this third and final post about Jekyll, we are going to exploit its blog-aware features.
---

This article assumes you are familiar with this static site generator, in case you're not you can read the two previous posts I've written where I explain how to set it up and create your first pages.


## Building a separate layout for posts

In spite of being one of the reasons why it is very popular, creating a blog section in your site with Jekyll is really simple and you're going to notice that here because this tutorial is not going to take long time to read.

First of all we're going to create a new file inside the *_layouts* folder and call it *post.html*. You could still use your default layout file for each post you create but it's highly probable you're going to display some extra information or make some changes on the design to improve the reading experience.

Let's go with something simple.

```html
{% raw %}{% include head.html %}{% endraw %}

{% raw %}{% include header.html %}{% endraw %}

<section class="post--content">
    {% raw %}<p class="post--date">{{ page.date | date_to_string }}</p>{% endraw %}

    {% raw %}<h1>{{ page.title }}</h1>{% endraw %}
    {% raw %}<p>{{ page.introduction }}</p>{% endraw %}

    {% raw %}{{ content }}{% endraw %}
</section>

{% raw %}{% include footer.html %}{% endraw %}
```

The `page` word is used to make reference to the post information. As I said, we're going simple and just showing a title, an introduction or excerpt and the content. You might have also noticed that we're printing the date of the post and adding some configuration. Jekyll and Liquid itself come with a lot of versatility on date filters, I suggest you to read both docs if you really want the date attribute in a special format.


## Creating your first post

There's no much wizardry here. You just need to start throwing Markdown or HTML files inside the *_posts* folder. the only condition is that you need to name them in a particular way: **year-month-day-title-separate-by-hyphens.md**, and that's it.

Of course you still need to maintain the YAML configuration as it was shown in my previous posts. Here, you're going to assign the value *post* to *layout* and then fill the title and introduction attributes.

```html
---
layout: post
title: My First Post
introduction: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
---

Nam elit purus, tempus vel velit non, laoreet tempus ligula. Suspendisse eu condimentum urna.

Aliquam magna magna, faucibus non orci a, ultrices pretium justo. Donec tincidunt tellus mauris,
quis viverra orci elementum sit amet. Quisque vulputate diam tortor, quis accumsan velit volutpat mattis.
```

There you go, that's a post in Jekyll. Simple, right?


### Permalinks

The url that your post will have can be changed in the *_config.yml* file and Jekyll already has <a href="http://jekyllrb.com/docs/permalinks/" target="_blank">some nice formats ready to go</a> for you.


## Listing your posts

It's time to brag about your writing skills, **posts** is an array accessible in any file through the `site` namespace. It's up to you to show them in your home or create a new page where you can list them. Whatever your choice is, this will get the job done.

```html
{% raw %}
<ul>
{% for post in site.posts %}
    <li>
        <a href="{{ post.url }}">
            <h2>{{ post.title }}</h2>
        </a>
    </li>
{% endfor %}
</ul>
{% endraw %}
```

Not so hard, but what if you're launching your site and didn't wrote anything yet?

```html
{% raw %}
{% if site.posts.size > 0 %}
    <ul>
    {% for post in site.posts %}
        <li>
            <a href="{{ post.url }}">
                <h2>{{ post.title }}</h2>
            </a>
        </li>
    {% endfor %}
    </ul>
    {% else %}
    <p>There are no posts available right. Come back soon!</p>
{% endif %}
{% endraw %}
```

A **for** loop and an **if** block, I'm guessing you're familiar with those in any other programming language, that's them in their Liquid form. Of course you have plenty of options to structure this view and show the date, the excerpt or any data related to posts. 

As you get into the Liquid language the opportunities will multiply.


## Wrap-up

I hope you've enjoyed this last posts about Jekyll. Remember that is the engine behind this blog you're reading and I'm just scratching is surface, feel free to build your own stuff and share it with the community.

If you have any questions, I'm available on <a href="https://www.twitter.com/jeremenichelli" target="_blank">twitter</a>. Happy blogging!
