---
layout: default
title: Talks & workshops
type: talks
resume: If you are a conference organizer and want to me to speak at your event, here's [what you need to know](/conferences) before moving forward.
---

<h2>Upcoming talks</h2>

{% if site.data.talks.upcoming.size != 0 %}
  <ul class="talklist">
  {% for talk in site.data.talks.upcoming %}
    <li class="talklist__item">
      "{{ talk.title }}"
      <span class="talklist__info">
        {% if talk.workshop %}workshop {% endif %}at
        <a
          class="talklist__link"
          alt="{{ talk.title }}"
          href="{{ talk.url }}" 
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ talk.event }}
        </a>
      </span>
    </li>
    {% endfor %}
  </ul>
{% else %}
  <ul class="talklist">
    <li class="talklist__item">Information coming soon...</li>
  </ul>
{% endif %}

{% if site.data.talks.past.size != 0 %}
  <h2>Past talks</h2>

  <ul class="talklist">
  {% for talk in site.data.talks.past %}
      <li class="talklist__item">
        "{{ talk.title }}"
        <span class="talklist__info">
          {% if talk.workshop %}workshop{% endif %} at
          <a
            class="talklist__link"
            alt="{{ talk.title }}"
            href="{{ talk.url }}" 
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ talk.event }}
          </a>
        </span>
      </li>
    {% endfor %}
  </ul>
{% endif %}
