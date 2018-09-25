---
layout: default
type: archive
title: Archive
---

<ul class="archivelist">
{% for post in site.posts %}
  {% assign currentdate = post.date | date: "%Y" %}
  {% if currentdate != date %}
    <li class="archivelist__year"><h2>{{ currentdate }}</h2></li>
    {% assign date = currentdate %} 
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
