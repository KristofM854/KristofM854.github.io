---
title: Publications
layout: default
permalink: /publications/
redirect_from: /publications.html
description: "Peer-reviewed research in marine science, analytical chemistry, and environmental toxicology."
---

<header class="page-header">
  <h1 class="page-header__title">Publications</h1>
  <p class="page-header__description">Peer-reviewed research in marine science, analytical chemistry, and environmental toxicology.</p>
  <p class="page-header__links">
    <a href="https://scholar.google.com/citations?user=PtkVV8oAAAAJ&hl=de&oi=sra" target="_blank" rel="noopener">Google Scholar</a> ·
    <a href="https://orcid.org/0000-0002-4590-6223" target="_blank" rel="noopener">ORCID</a>
  </p>
</header>

<div class="publications-list">
  {% for pub in site.data.publications %}
  <div class="publication-item">
    {% if pub.role == "first-author" %}
    <span class="publication-item__badge publication-item__badge--first">First author</span>
    {% elsif pub.role == "co-author" %}
    <span class="publication-item__badge">Co-author</span>
    {% endif %}
    <p class="publication-item__title">{{ pub.title }}</p>
    <p class="publication-item__authors">{{ pub.authors }}</p>
    <p class="publication-item__journal">{{ pub.journal }}, {{ pub.year }}.{% if pub.doi %} <a href="https://doi.org/{{ pub.doi }}" class="publication-item__doi" target="_blank" rel="noopener">DOI ↗</a>{% endif %}</p>
    {% if pub.abstract and pub.abstract != "" %}
    <details class="publication-item__abstract">
      <summary>Abstract</summary>
      <p>{{ pub.abstract }}</p>
    </details>
    {% endif %}
  </div>
  {% endfor %}
</div>
