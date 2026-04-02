---
title: Publications
layout: default
permalink: /publications/
---

<header class="page-header">
  <h1 class="page-header__title">Publications</h1>
  <p class="page-header__description">Peer-reviewed research in marine science, analytical chemistry, and environmental toxicology.</p>
</header>

<div class="publications-list">
  {% for pub in site.data.publications %}
  <div class="publication-item">
    <p class="publication-item__title">{{ pub.title }}</p>
    <p class="publication-item__authors">{{ pub.authors }}</p>
    <p class="publication-item__journal">{{ pub.journal }}, {{ pub.year }}. {% if pub.doi %}<a href="https://doi.org/{{ pub.doi }}">DOI</a>{% endif %}</p>
  </div>
  {% endfor %}
</div>
