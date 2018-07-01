---
layout: default
type: blog
title: Blog
---

{% assign posts = site.posts | where_exp: "post", "post.external_url == null" %}
<ul class="bloglist">
{% for post in posts limit: 5 %}
  <li>
    <p class="bloglist__info">
      <time class="bloglist__time" datetime="{{ post.date | date_to_xmlschema }}">
        {{ post.date | date: '%b %-d, %Y'}}
      </time>
    </p>
    <a class="bloglist__link" href="{{ post.url }}">{{ post.title }}</a>
  </li>
{% endfor %}
</ul>

<a class="blocked__link" href="/archive">See all posts</a>

## Guested articles

{% assign hosted = site.posts | where_exp: "post", "post.external_url" %}
<ul class="bloglist">
  {% for post in hosted limit: 5 %}
  <li>
    <p class="bloglist__info">
      Hosted by <span class="bloglist__host">{{ post.host }}</span>
    </p>
    <a class="bloglist__link" href="{{ post.external_url }}" target="_blank" rel="noopener noreferrer">
      {{ post.title }}
    </a>
  </li>
  {% endfor %}
</ul>
