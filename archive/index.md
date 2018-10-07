---
layout: default
type: archive
title: Archive
---

<ul class="archivelist">
{% for post in site.posts %}
  {% assign post_current_date = post.date | date: "%Y" %}
  {% if post_current_date != date %}
    <li class="archivelist__year"><h2>{{ post_current_date }}</h2></li>
    {% assign date = post_current_date %} 
  {% endif %}
  <li>
    <a
      class="archivelist__link"
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
