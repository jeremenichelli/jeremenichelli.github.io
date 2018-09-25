---
layout: default
type: blog
title: Blog
---

<ul class="bloglist">
{% for post in site.posts limit: 6 %}
  <li>
    <p class="bloglist__info">
      {% if post.external_url %}
      Hosted by <span class="bloglist__host">{{ post.host }}</span>
      {% else %}
      <time class="bloglist__time" datetime="{{ post.date | date_to_xmlschema }}">
        {{ post.date | date: '%b %-d, %Y'}}
      </time>
      {% endif %}
    </p>
    <a
      class="bloglist__link"
      alt="{{ post.title }}"
      {% if post.external_url %}href="{{ post.external_url }}" target="_blank" rel="noopener noreferrer"
      {% else %}href="{{ post.url }}"
      {% endif %}
    >
      {{ post.title }}
    </a>
  </li>
{% endfor %}
</ul>

<a class="blocked__link" href="/archive" alt="archive">See all the publications</a>
