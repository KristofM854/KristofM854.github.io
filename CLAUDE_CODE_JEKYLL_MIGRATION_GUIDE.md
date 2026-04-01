# Jekyll Migration & Personal Theme Redesign — Claude Code Implementation Guide

## Overview

This guide instructs Claude Code to migrate kristofmoeller.com (currently plain HTML/CSS/JS on GitHub Pages) to a Jekyll-based site, redesigned to match the aesthetic of the "Personal" Jekyll theme (https://personal.jekyllthemes.io/). We are NOT purchasing or using that theme. We are replicating its visual design from scratch using custom Jekyll layouts and CSS.

**Repository:** `KristofM854/KristofM854.github.io`  
**Live URL:** https://kristofmoeller.com  
**Hosting:** GitHub Pages (native Jekyll support, no GitHub Actions needed for standard Jekyll)  
**Custom domain:** kristofmoeller.com (DNS already configured via Namecheap, CNAME file exists)

---

## CRITICAL RULES

1. **Work on a branch.** Create a branch called `jekyll-migration` for all work. Never push directly to `main` until the migration is verified.
2. **Preserve the `/quiz` subfolder.** The HAB quiz app (React/Vite) lives in `/quiz`. Jekyll must be configured to exclude it from processing. Add `exclude: [quiz, node_modules]` to `_config.yml`.
3. **Preserve SEO setup.** Carry over all existing meta descriptions, JSON-LD schema, robots.txt, and sitemap configuration.
4. **Preserve the CNAME file.** The file `CNAME` containing `kristofmoeller.com` must remain in the repo root.
5. **No fancy vocabulary or rhetorical devices in any written content.** Kristof's writing style is direct, functional, non-native English. Never use colons within sentences, "it is not... it is..." constructions, or decorative language.
6. **Minimize dependencies.** Use only GitHub Pages-whitelisted plugins. No gems that require custom GitHub Actions to build.

---

## PHASE 0: Audit Current Site & Back Up

**Goal:** Understand the existing file structure before touching anything.

### Steps

1. Clone the repo (or pull latest) and create the working branch:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b jekyll-migration
   ```

2. Run `find . -type f -name "*.html" | head -40` to map all existing HTML files.

3. Document the current site structure. Expected structure (verify and update):
   ```
   /
   ├── index.html              (homepage)
   ├── about.html              (about page)
   ├── publications.html       (publications page)
   ├── blog.html               (blog index)
   ├── blog/
   │   ├── post-1.html
   │   ├── post-2.html
   │   ├── ... (7 posts total)
   ├── css/                    (stylesheets)
   ├── js/                     (scripts)
   ├── images/                 (site images)
   ├── quiz/                   (React HAB quiz app — DO NOT TOUCH)
   ├── robots.txt
   ├── CNAME
   └── ... (other assets)
   ```

4. For each blog post HTML file, extract:
   - The post title
   - The post date
   - The post body content (the actual text/HTML between the header/footer boilerplate)
   - Any images referenced
   
   Save these as notes — you will need them in Phase 3.

5. Extract the content (not the HTML boilerplate) from:
   - `about.html`
   - `publications.html`
   - `index.html` (hero text, any project descriptions)

6. Note all images currently used and their paths. These need to be migrated to the Jekyll `/assets/images/` directory.

---

## PHASE 1: Jekyll Project Scaffolding

**Goal:** Set up the Jekyll directory structure alongside the existing files, then swap over.

### Steps

1. Create the Jekyll configuration file `_config.yml` in the repo root:
   ```yaml
   # Site settings
   title: Kristof Möller
   description: "Marine scientist specializing in harmful algal blooms and biotoxins. JPO at IAEA Marine Environment Laboratories, Monaco."
   url: "https://kristofmoeller.com"
   baseurl: ""
   
   # Author
   author:
     name: Kristof Möller
     email: ""  # fill in if desired
     description: "JPO for Harmful Algal Blooms & Biotoxins | IAEA Marine Environment Laboratories"
   
   # Build settings
   markdown: kramdown
   highlighter: rouge
   permalink: /blog/:title/
   
   # Pagination (uses jekyll-paginate, GitHub Pages whitelisted)
   paginate: 6
   paginate_path: "/blog/page:num/"
   
   # Collections (for projects/portfolio)
   collections:
     projects:
       output: true
       permalink: /projects/:title/
   
   # Plugins (GitHub Pages whitelisted only)
   plugins:
     - jekyll-feed
     - jekyll-seo-tag
     - jekyll-sitemap
     - jekyll-paginate
   
   # Exclude from Jekyll processing
   exclude:
     - quiz
     - node_modules
     - README.md
     - LICENSE
     - Gemfile
     - Gemfile.lock
     - CLAUDE_CODE_JEKYLL_MIGRATION_GUIDE.md
     - CLAUDE_CODE_INIT_PROMPT.md
   
   # Include dotfiles or specific files if needed
   include:
     - _pages
   
   # Default front matter
   defaults:
     - scope:
         path: ""
         type: "posts"
       values:
         layout: "post"
     - scope:
         path: ""
         type: "projects"
       values:
         layout: "project"
     - scope:
         path: ""
         type: "pages"
       values:
         layout: "page"
   ```

2. Create the `Gemfile` in the repo root:
   ```ruby
   source "https://rubygems.org"
   gem "github-pages", group: :jekyll_plugins
   ```

3. Create the Jekyll directory structure:
   ```bash
   mkdir -p _layouts _includes _posts _projects _pages _data assets/css assets/js assets/images
   ```

4. Move existing images into `assets/images/` (adjust references later in templates).

5. Verify `CNAME` file still exists in root with content `kristofmoeller.com`.

---

## PHASE 2: Design System — CSS

**Goal:** Create a single CSS file that replicates the Personal theme's aesthetic.

### Design Reference (Personal Theme)

The Personal theme uses:
- **Layout:** Single-column, centered, max-width ~720px for content, ~1100px for project grid
- **Typography:** Clean sans-serif (system font stack or Inter/similar), large hero headings (~48-60px), generous line-height (1.6-1.7 for body)
- **Colors:** Neutral palette — near-white background (#fafafa or #fff), dark text (#1a1a2e or #2d2d2d), one subtle accent color for links/hover states
- **Spacing:** Very generous whitespace — large padding between sections, breathing room everywhere
- **Navigation:** Top bar with site name on left, page links on right. Simple, not sticky.
- **Cards (homepage projects):** Image background, dark overlay on hover with project title/subtitle revealed. Grid layout (2 columns on desktop, 1 on mobile).
- **Blog listing:** Clean list — post title (as link), excerpt below, date subtle. No images in the listing.
- **Single post:** Large title at top, date below in subtle text, then wide single-column content. Images full-width within the content column.
- **Footer:** Simple — site tagline, copyright, optional social icons
- **Transitions:** Subtle fade-in on page load (CSS only, no Ajax needed)

### Steps

1. Create `assets/css/style.css` with the following structure (write it as one file):

```css
/* ============================================
   DESIGN SYSTEM — Personal Theme Recreation
   for kristofmoeller.com
   ============================================ */

/* --- CSS Custom Properties --- */
:root {
  /* Colors */
  --color-bg: #ffffff;
  --color-bg-alt: #fafafa;
  --color-text: #2d2d2d;
  --color-text-light: #6b7280;
  --color-text-lighter: #9ca3af;
  --color-accent: #3b82f6;         /* Blue accent — adjust to preference */
  --color-accent-hover: #2563eb;
  --color-border: #e5e7eb;
  --color-card-overlay: rgba(26, 26, 46, 0.7);
  
  /* Typography */
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-heading: var(--font-body);
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* Sizing */
  --content-width: 720px;
  --wide-width: 1100px;
  --nav-height: 72px;
  
  /* Spacing scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-2xl: 5rem;
  --space-3xl: 8rem;
}

/* --- Reset & Base --- */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 18px; scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

img { max-width: 100%; height: auto; display: block; }
a { color: var(--color-accent); text-decoration: none; transition: color 0.2s; }
a:hover { color: var(--color-accent-hover); }

/* --- Page fade-in --- */
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.page-content { animation: fadeIn 0.4s ease-out; }

/* --- Navigation --- */
/* Top bar: site name left, links right. Clean, not sticky. */
.site-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: var(--wide-width);
  margin: 0 auto;
  padding: var(--space-lg) var(--space-lg);
  height: var(--nav-height);
}

.site-nav__logo {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  letter-spacing: -0.02em;
}
.site-nav__logo:hover { color: var(--color-accent); }

.site-nav__links { display: flex; gap: var(--space-lg); list-style: none; }

.site-nav__links a {
  color: var(--color-text-light);
  font-size: 0.9rem;
  font-weight: 400;
  text-decoration: none;
  transition: color 0.2s;
}
.site-nav__links a:hover,
.site-nav__links a.active { color: var(--color-text); }

/* Mobile hamburger */
.site-nav__toggle { display: none; background: none; border: none; cursor: pointer; padding: var(--space-sm); }
.site-nav__toggle svg { width: 24px; height: 24px; stroke: var(--color-text); }

@media (max-width: 640px) {
  .site-nav__toggle { display: block; }
  .site-nav__links {
    display: none;
    position: absolute;
    top: var(--nav-height);
    left: 0; right: 0;
    background: var(--color-bg);
    flex-direction: column;
    padding: var(--space-lg);
    border-bottom: 1px solid var(--color-border);
    z-index: 100;
  }
  .site-nav__links.is-open { display: flex; }
}

/* --- Hero Section (Homepage) --- */
.hero {
  max-width: var(--wide-width);
  margin: 0 auto;
  padding: var(--space-3xl) var(--space-lg) var(--space-2xl);
}

.hero__title {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--color-text);
  max-width: 800px;
}

.hero__subtitle {
  margin-top: var(--space-md);
  font-size: 1.15rem;
  color: var(--color-text-light);
  max-width: 600px;
  line-height: 1.6;
}

/* --- Project Grid (Homepage) --- */
/* 2-column grid with image cards and dark overlay on hover */
.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
  max-width: var(--wide-width);
  margin: 0 auto;
  padding: 0 var(--space-lg) var(--space-3xl);
}

@media (max-width: 768px) {
  .project-grid { grid-template-columns: 1fr; }
}

.project-card {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: 16 / 10;
  background-color: var(--color-bg-alt);
  background-size: cover;
  background-position: center;
  cursor: pointer;
  text-decoration: none;
  display: block;
}

.project-card__overlay {
  position: absolute;
  inset: 0;
  background: var(--color-card-overlay);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--space-xl);
  opacity: 0;
  transition: opacity 0.35s ease;
}

.project-card:hover .project-card__overlay { opacity: 1; }

.project-card__title {
  color: #fff;
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.project-card__subtitle {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
  margin-top: var(--space-xs);
}

/* --- Page Header (for blog index, about, contact, etc.) --- */
.page-header {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--space-3xl) var(--space-lg) var(--space-xl);
}

.page-header__title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.page-header__description {
  margin-top: var(--space-md);
  color: var(--color-text-light);
  font-size: 1.05rem;
}

/* --- Blog Post List --- */
.post-list {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 var(--space-lg) var(--space-3xl);
  list-style: none;
}

.post-list__item {
  padding: var(--space-xl) 0;
  border-bottom: 1px solid var(--color-border);
}
.post-list__item:first-child { padding-top: 0; }
.post-list__item:last-child { border-bottom: none; }

.post-list__title {
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.post-list__title a { color: var(--color-text); }
.post-list__title a:hover { color: var(--color-accent); }

.post-list__excerpt {
  margin-top: var(--space-sm);
  color: var(--color-text-light);
  font-size: 0.95rem;
  line-height: 1.6;
}

.post-list__date {
  margin-top: var(--space-sm);
  color: var(--color-text-lighter);
  font-size: 0.85rem;
}

/* --- Pagination --- */
.pagination {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--space-lg) var(--space-lg) var(--space-3xl);
  display: flex;
  justify-content: space-between;
}

.pagination a {
  color: var(--color-accent);
  font-weight: 500;
  font-size: 0.95rem;
}

/* --- Single Post / Project Layout --- */
.post-header {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--space-3xl) var(--space-lg) var(--space-lg);
}

.post-header__title {
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.post-header__meta {
  margin-top: var(--space-md);
  color: var(--color-text-lighter);
  font-size: 0.9rem;
}

.post-content {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--space-lg) var(--space-lg) var(--space-3xl);
}

/* Post content typography */
.post-content h2 { font-size: 1.6rem; font-weight: 600; margin-top: var(--space-2xl); margin-bottom: var(--space-md); letter-spacing: -0.01em; }
.post-content h3 { font-size: 1.25rem; font-weight: 600; margin-top: var(--space-xl); margin-bottom: var(--space-md); }
.post-content p { margin-bottom: var(--space-md); }
.post-content ul, .post-content ol { margin-bottom: var(--space-md); padding-left: var(--space-lg); }
.post-content li { margin-bottom: var(--space-sm); }
.post-content blockquote {
  border-left: 3px solid var(--color-accent);
  padding-left: var(--space-lg);
  margin: var(--space-xl) 0;
  color: var(--color-text-light);
  font-size: 1.1rem;
  font-style: italic;
}
.post-content img {
  margin: var(--space-xl) 0;
  border-radius: 6px;
}
.post-content pre {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: var(--space-lg);
  border-radius: 8px;
  overflow-x: auto;
  margin: var(--space-xl) 0;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.5;
}
.post-content code {
  font-family: var(--font-mono);
  font-size: 0.88em;
  background: var(--color-bg-alt);
  padding: 0.15em 0.4em;
  border-radius: 4px;
}
.post-content pre code { background: none; padding: 0; font-size: inherit; }
.post-content table {
  width: 100%;
  border-collapse: collapse;
  margin: var(--space-xl) 0;
  font-size: 0.9rem;
}
.post-content th, .post-content td {
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-sm) var(--space-md);
  text-align: left;
}
.post-content th { font-weight: 600; color: var(--color-text); }

/* --- Image Gallery (optional, for blog posts) --- */
.gallery {
  display: grid;
  gap: var(--space-md);
  margin: var(--space-xl) 0;
}
.gallery[data-columns="2"] { grid-template-columns: repeat(2, 1fr); }
.gallery[data-columns="3"] { grid-template-columns: repeat(3, 1fr); }
.gallery img { border-radius: 6px; width: 100%; }

@media (max-width: 640px) {
  .gallery[data-columns="2"],
  .gallery[data-columns="3"] { grid-template-columns: 1fr; }
}

/* --- About Page --- */
.about-content {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 var(--space-lg) var(--space-3xl);
}

.about-content img.portrait {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: var(--space-xl);
}

/* --- Contact Form --- */
.contact-form {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 var(--space-lg) var(--space-3xl);
}

.contact-form label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: var(--space-xs);
  color: var(--color-text);
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  margin-bottom: var(--space-lg);
  transition: border-color 0.2s;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: var(--color-accent);
}

.contact-form textarea { min-height: 160px; resize: vertical; }

.contact-form button {
  background: var(--color-accent);
  color: #fff;
  border: none;
  padding: var(--space-sm) var(--space-xl);
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.contact-form button:hover { background: var(--color-accent-hover); }

/* --- Publications Page --- */
.publications-list {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 var(--space-lg) var(--space-3xl);
}

.publication-item {
  padding: var(--space-lg) 0;
  border-bottom: 1px solid var(--color-border);
}
.publication-item:last-child { border-bottom: none; }

.publication-item__title {
  font-weight: 600;
  font-size: 1rem;
}

.publication-item__authors {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin-top: var(--space-xs);
}

.publication-item__journal {
  color: var(--color-text-lighter);
  font-size: 0.85rem;
  font-style: italic;
  margin-top: var(--space-xs);
}

/* --- Footer --- */
.site-footer {
  border-top: 1px solid var(--color-border);
  padding: var(--space-2xl) var(--space-lg);
  text-align: center;
  color: var(--color-text-lighter);
  font-size: 0.85rem;
}

.site-footer__tagline {
  margin-bottom: var(--space-sm);
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.site-footer__social {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
  list-style: none;
}

.site-footer__social a {
  color: var(--color-text-light);
  transition: color 0.2s;
}
.site-footer__social a:hover { color: var(--color-accent); }

/* --- Utility --- */
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
```

**Important notes for Claude Code:**
- Load Inter font from Google Fonts in the `<head>` include (fallback to system sans-serif)
- The CSS above is a complete starting point. Adjust values during implementation as needed for visual balance.
- Test at 320px, 768px, and 1200px breakpoints.

---

## PHASE 3: Jekyll Layouts & Includes

**Goal:** Create the templating layer — the reusable HTML skeleton that wraps all pages.

### 3.1 Create `_includes/head.html`

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{% if page.title %}{{ page.title }} — {{ site.title }}{% else %}{{ site.title }}{% endif %}</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Styles -->
  <link rel="stylesheet" href="{{ '/assets/css/style.css' | relative_url }}">
  
  <!-- SEO (jekyll-seo-tag handles most of this) -->
  {% seo %}
  
  <!-- Feed -->
  {% feed_meta %}
  
  <!-- Favicon (add your favicon files to /assets/) -->
  <link rel="icon" type="image/png" href="{{ '/assets/images/favicon.png' | relative_url }}">
  
  <!-- JSON-LD Person Schema (carry over from existing site) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Kristof Möller",
    "jobTitle": "Junior Professional Officer – Harmful Algal Blooms & Biotoxins",
    "worksFor": {
      "@type": "Organization",
      "name": "IAEA Marine Environment Laboratories"
    },
    "url": "https://kristofmoeller.com",
    "sameAs": [
      "https://github.com/KristofM854",
      "https://scholar.google.com/citations?user=YOUR_ID",
      "https://www.linkedin.com/in/YOUR_LINKEDIN"
    ]
  }
  </script>
</head>
```

**Note:** Replace placeholder URLs (Google Scholar, LinkedIn) with actual values from the existing site.

### 3.2 Create `_includes/nav.html`

```html
<nav class="site-nav">
  <a href="{{ '/' | relative_url }}" class="site-nav__logo">Kristof Möller</a>
  
  <button class="site-nav__toggle" aria-label="Toggle navigation">
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  </button>
  
  <ul class="site-nav__links">
    <li><a href="{{ '/' | relative_url }}" {% if page.url == '/' %}class="active"{% endif %}>Projects</a></li>
    <li><a href="{{ '/blog/' | relative_url }}" {% if page.url contains '/blog' %}class="active"{% endif %}>Blog</a></li>
    <li><a href="{{ '/publications/' | relative_url }}" {% if page.url == '/publications/' %}class="active"{% endif %}>Publications</a></li>
    <li><a href="{{ '/about/' | relative_url }}" {% if page.url == '/about/' %}class="active"{% endif %}>About</a></li>
    <li><a href="{{ '/contact/' | relative_url }}" {% if page.url == '/contact/' %}class="active"{% endif %}>Contact</a></li>
  </ul>
</nav>
```

### 3.3 Create `_includes/footer.html`

```html
<footer class="site-footer">
  <ul class="site-footer__social">
    <!-- Add/remove social links as appropriate -->
    <li><a href="https://github.com/KristofM854" target="_blank" rel="noopener" aria-label="GitHub">GitHub</a></li>
    <li><a href="https://scholar.google.com/citations?user=YOUR_ID" target="_blank" rel="noopener" aria-label="Google Scholar">Scholar</a></li>
    <li><a href="https://www.linkedin.com/in/YOUR_LINKEDIN" target="_blank" rel="noopener" aria-label="LinkedIn">LinkedIn</a></li>
    <li><a href="https://orcid.org/YOUR_ORCID" target="_blank" rel="noopener" aria-label="ORCID">ORCID</a></li>
  </ul>
  <p class="site-footer__tagline">Marine scientist. HABs, biotoxins, data.</p>
  <p>&copy; {{ 'now' | date: "%Y" }} {{ site.title }}</p>
</footer>
```

**Note:** Pull the actual social profile URLs from the existing site. Replace placeholder values.

### 3.4 Create `_layouts/default.html`

This is the master layout that wraps every page:

```html
<!DOCTYPE html>
<html lang="en">
{% include head.html %}
<body>
  {% include nav.html %}
  <main class="page-content">
    {{ content }}
  </main>
  {% include footer.html %}
  
  <!-- Mobile nav toggle -->
  <script>
    document.querySelector('.site-nav__toggle').addEventListener('click', function() {
      document.querySelector('.site-nav__links').classList.toggle('is-open');
    });
  </script>
</body>
</html>
```

### 3.5 Create `_layouts/post.html`

```html
---
layout: default
---
<article>
  <header class="post-header">
    <h1 class="post-header__title">{{ page.title }}</h1>
    <p class="post-header__meta">{{ page.date | date: "%d %B %Y" }}</p>
  </header>
  <div class="post-content">
    {{ content }}
  </div>
</article>
```

### 3.6 Create `_layouts/project.html`

```html
---
layout: default
---
<article>
  <header class="post-header">
    <h1 class="post-header__title">{{ page.title }}</h1>
    <p class="post-header__meta">{{ page.subtitle }}</p>
  </header>
  <div class="post-content">
    {{ content }}
  </div>
</article>
```

### 3.7 Create `_layouts/page.html`

```html
---
layout: default
---
<header class="page-header">
  <h1 class="page-header__title">{{ page.title }}</h1>
  {% if page.description %}
  <p class="page-header__description">{{ page.description }}</p>
  {% endif %}
</header>
<div class="post-content">
  {{ content }}
</div>
```

---

## PHASE 4: Content Migration — Homepage

**Goal:** Create the homepage with hero section and project grid.

### Steps

1. Create `index.html` in the repo root (replaces the old one):

```html
---
layout: default
title: Home
---

<section class="hero">
  <h1 class="hero__title">Marine scientist working on harmful algal blooms and biotoxins</h1>
  <p class="hero__subtitle">Junior Professional Officer at the IAEA Marine Environment Laboratories in Monaco. Building monitoring capacity across 30+ member states.</p>
</section>

<section class="project-grid">
  {% for project in site.projects reversed %}
  <a href="{{ project.url | relative_url }}" class="project-card" style="background-image: url('{{ project.image | relative_url }}')">
    <div class="project-card__overlay">
      <h2 class="project-card__title">{{ project.title }}</h2>
      <p class="project-card__subtitle">{{ project.subtitle }}</p>
    </div>
  </a>
  {% endfor %}
</section>
```

**Note:** Adjust the hero title and subtitle text. Pull the exact wording from the existing homepage or rewrite in Kristof's direct, no-frills style.

2. Create project files in `_projects/`. Each project is a Markdown file:

Example `_projects/hab-review.md`:
```markdown
---
title: "Global Catastrophic HAB Events Review"
subtitle: "Systematic review for Harmful Algae journal"
image: "/assets/images/projects/hab-review.jpg"
date: 2025-01-01
---

A systematic global catalog of catastrophic harmful algal bloom events, covering marine and freshwater systems across all continents. The review includes a structured event database with 71 data columns, controlled vocabulary schemas, and automated validation infrastructure.

[More details about the project...]
```

Create similar files for other projects. Suggested projects to feature (verify against existing site and adjust):
- `hab-review.md` — Global catastrophic HAB events review paper
- `shiny-bioassay.md` — Competitive Binding Assay Analysis Suite (R Shiny)
- `hab-quiz.md` — Educational HAB & Biotoxins Quiz App
- `r-monitoring-pipeline.md` — Multi-country HAB time series analysis pipeline
- `crp-k41027.md` — CRP K41027 coordination (TC project)

**For project images:** Each project card needs a background image. Options:
- Use relevant photos from the existing site
- Use placeholder images initially (solid color or gradient backgrounds via CSS as fallback)
- Add a CSS fallback: `.project-card { background-color: var(--color-bg-alt); }` so cards without images still look clean

---

## PHASE 5: Content Migration — Blog Posts

**Goal:** Convert all 7 existing blog posts from HTML to Jekyll Markdown posts.

### Steps

1. For each existing blog post HTML file:
   a. Extract the title, date, and body content
   b. Convert the body HTML to Markdown (strip the nav/footer/boilerplate)
   c. Create a file in `_posts/` following Jekyll's naming convention: `YYYY-MM-DD-slug-title.md`

   Example: `_posts/2025-03-15-arriving-at-iaea-monaco.md`
   ```markdown
   ---
   title: "Arriving at the IAEA Marine Environment Laboratories"
   date: 2025-03-15
   excerpt: "First impressions of starting as a JPO in Monaco..."
   ---
   
   [Body content in Markdown, converted from the original HTML]
   ```

2. Do this for all 7 posts. Known posts to migrate (titles approximate — verify against actual files):
   - IAEA arrival / first impressions
   - Cuba INT7022 workshop
   - German JPO seminar
   - ICHA Chile conference
   - Shiny/AI bioassay automation article
   - Data visualization / boxplot ambiguity piece
   - (7th post — check existing site)

3. When converting HTML to Markdown:
   - Preserve all images. Update image paths to `/assets/images/blog/filename.jpg`
   - Move referenced images into `assets/images/blog/`
   - Convert `<strong>` to `**bold**`, `<em>` to `*italic*`, etc.
   - Convert `<a href="...">text</a>` to `[text](url)`
   - Convert `<h2>` to `##`, `<h3>` to `###`, etc.
   - Fix the known `~~strikethrough~~` bug in Post 2 (kramdown uses `~~text~~` for strikethrough — verify it renders correctly)

4. Create the blog index page. This is special because it uses pagination.

   Create `blog/index.html` (note: must be `.html` not `.md` for the paginator to work):
   ```html
   ---
   layout: default
   title: Blog
   description: "Thoughts on marine science, data, and life as a JPO."
   ---
   
   <header class="page-header">
     <h1 class="page-header__title">{{ page.title }}</h1>
     <p class="page-header__description">{{ page.description }}</p>
   </header>
   
   <ul class="post-list">
     {% for post in paginator.posts %}
     <li class="post-list__item">
       <h2 class="post-list__title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
       <p class="post-list__excerpt">{{ post.excerpt | strip_html | truncatewords: 40 }}</p>
       <p class="post-list__date">{{ post.date | date: "%d %B %Y" }}</p>
     </li>
     {% endfor %}
   </ul>
   
   {% if paginator.total_pages > 1 %}
   <nav class="pagination">
     {% if paginator.previous_page %}
       <a href="{{ paginator.previous_page_path | relative_url }}">&larr; Newer Posts</a>
     {% else %}
       <span></span>
     {% endif %}
     {% if paginator.next_page %}
       <a href="{{ paginator.next_page_path | relative_url }}">Older Posts &rarr;</a>
     {% endif %}
   </nav>
   {% endif %}
   ```

---

## PHASE 6: Content Migration — Secondary Pages

### 6.1 About Page

Create `_pages/about.md`:
```markdown
---
title: About
layout: page
permalink: /about/
description: "Marine scientist, data enthusiast, and JPO at the IAEA."
---

<div class="about-content">

![Kristof Möller](/assets/images/portrait.jpg){: .portrait}

[Pull the about text from the existing about.html. Keep it in Kristof's direct style.
Include: background, current role, research interests, education (Dr. rer. nat., magna cum laude, AWI Bremerhaven), skills, languages.]

</div>
```

**Note:** Kramdown (Jekyll's default Markdown renderer) supports adding CSS classes to images via the `{: .classname}` syntax shown above.

### 6.2 Publications Page

Create `_pages/publications.md`:
```markdown
---
title: Publications
layout: default
permalink: /publications/
---

<header class="page-header">
  <h1 class="page-header__title">Publications</h1>
</header>

<div class="publications-list">
  [Convert the existing publications.html content here.
   Each publication should be wrapped in a div.publication-item
   with child elements for title, authors, and journal.
   
   Alternatively, store publications in _data/publications.yml 
   and loop through them with Liquid — see data-driven approach below.]
</div>
```

**Data-driven approach (recommended):** Create `_data/publications.yml`:
```yaml
- title: "Title of Paper One"
  authors: "Möller, K., Author, B., Author, C."
  journal: "Harmful Algae"
  year: 2024
  doi: "10.1016/j.hal.2024.XXXXX"
  
- title: "Title of Paper Two"
  authors: "Author, A., Möller, K., Author, D."
  journal: "Journal Name"
  year: 2023
  doi: "10.XXXX/XXXXX"
```

Then in the publications page, loop with Liquid:
```html
<div class="publications-list">
  {% for pub in site.data.publications %}
  <div class="publication-item">
    <p class="publication-item__title">{{ pub.title }}</p>
    <p class="publication-item__authors">{{ pub.authors }}</p>
    <p class="publication-item__journal">{{ pub.journal }}, {{ pub.year }}. {% if pub.doi %}<a href="https://doi.org/{{ pub.doi }}">DOI</a>{% endif %}</p>
  </div>
  {% endfor %}
</div>
```

### 6.3 Contact Page

Create `_pages/contact.md`:
```markdown
---
title: Contact
layout: default
permalink: /contact/
---

<header class="page-header">
  <h1 class="page-header__title">Get in touch</h1>
  <p class="page-header__description">Whether it is about collaboration, speaking, or consulting — I am happy to hear from you.</p>
</header>

<div class="contact-form">
  <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <label for="email">Email Address *</label>
    <input type="email" id="email" name="email" required>
    
    <label for="name">Name *</label>
    <input type="text" id="name" name="name" required>
    
    <label for="message">Message *</label>
    <textarea id="message" name="message" required></textarea>
    
    <button type="submit">Send Message</button>
  </form>
</div>
```

**Note:** Register at https://formspree.io/ to get a form endpoint (free tier: 50 submissions/month). Replace `YOUR_FORM_ID`. Alternatively, keep whatever contact mechanism the existing site uses.

---

## PHASE 7: Asset Migration & Cleanup

### Steps

1. Move all images from the old `images/` directory to `assets/images/`:
   ```bash
   # Adjust paths based on actual current structure
   mv images/* assets/images/
   ```

2. Organize images into subdirectories:
   ```
   assets/
   ├── images/
   │   ├── projects/      (project card backgrounds)
   │   ├── blog/          (blog post images)
   │   ├── portrait.jpg   (about page photo)
   │   └── favicon.png
   ├── css/
   │   └── style.css
   └── js/
       └── (minimal JS if needed)
   ```

3. Delete old HTML files that are now replaced by Jekyll templates:
   - Old `index.html` (replaced by new Jekyll `index.html`)
   - Old `about.html` (replaced by `_pages/about.md`)
   - Old `publications.html` (replaced by `_pages/publications.md`)
   - Old `blog.html` (replaced by `blog/index.html`)
   - Old `blog/post-*.html` files (replaced by `_posts/*.md`)
   - Old `css/` directory (replaced by `assets/css/`)
   - Old `js/` directory (replaced by `assets/js/` if needed)

4. **Do NOT delete:**
   - `/quiz/` directory (React app, excluded from Jekyll processing)
   - `CNAME`
   - `robots.txt` (or move its content into Jekyll's build if preferred)

5. Verify `robots.txt` is correct:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://kristofmoeller.com/sitemap.xml
   ```
   (The `jekyll-sitemap` plugin will auto-generate `/sitemap.xml`)

---

## PHASE 8: Testing & Verification

### Local Testing

1. Install dependencies and build locally:
   ```bash
   bundle install
   bundle exec jekyll serve --livereload
   ```
   Open `http://localhost:4000` and verify:

2. **Checklist — verify each item:**
   - [ ] Homepage loads with hero text and project grid
   - [ ] Project cards show images with hover overlay effect
   - [ ] Clicking a project card opens the project detail page
   - [ ] Blog index lists all posts with titles, excerpts, dates
   - [ ] Pagination works if more than 6 posts
   - [ ] Individual blog posts render correctly with proper typography
   - [ ] Images in blog posts display correctly
   - [ ] Code blocks in blog posts have syntax highlighting
   - [ ] About page renders with portrait image
   - [ ] Publications page lists all publications
   - [ ] Contact page shows the form
   - [ ] Navigation highlights the active page
   - [ ] Mobile hamburger menu works at <640px
   - [ ] Footer shows social links and copyright
   - [ ] `/quiz/` still loads the React HAB quiz app
   - [ ] RSS feed available at `/feed.xml`
   - [ ] Sitemap available at `/sitemap.xml`
   - [ ] Page title and meta description correct on each page (check `<head>`)
   - [ ] JSON-LD schema present in page source
   - [ ] No broken image links
   - [ ] No console errors

### Responsive Testing

Test at these widths:
- 320px (small mobile)
- 375px (standard mobile)
- 768px (tablet)
- 1200px (desktop)
- 1440px (wide desktop)

Key things to check on mobile:
- Nav collapses to hamburger
- Project grid becomes single column
- Blog post content is readable with proper padding
- Images don't overflow
- Contact form inputs are full-width and tappable

---

## PHASE 9: Deployment

### Steps

1. Commit all changes on the `jekyll-migration` branch:
   ```bash
   git add -A
   git commit -m "Migrate to Jekyll with Personal theme-inspired design"
   ```

2. Push the branch to GitHub:
   ```bash
   git push origin jekyll-migration
   ```

3. Create a Pull Request on GitHub from `jekyll-migration` → `main`.

4. GitHub Pages will attempt to build the Jekyll site from the PR (check the Actions tab or commit status).

5. If the build succeeds, merge the PR.

6. After merging, verify https://kristofmoeller.com loads correctly (may take 1-2 minutes for GitHub Pages to rebuild).

7. Verify in Google Search Console that the site is still indexed and the sitemap is being read.

---

## PHASE 10: Post-Migration Polish (Optional, Later Sessions)

These are nice-to-have improvements for follow-up sessions:

1. **Dark mode toggle** — Add a CSS-only or minimal JS dark mode with a toggle button in the nav. Define `--color-*` dark variants in a `[data-theme="dark"]` selector.

2. **Reading time** — Add estimated reading time to blog posts using the `reading_time` Liquid filter or manual word count calculation.

3. **Tags/categories** — Add tags to blog post front matter and create a tag index page.

4. **Image optimization** — Compress all images, add `loading="lazy"` attributes.

5. **Social sharing meta** — The `jekyll-seo-tag` plugin handles Open Graph and Twitter Card tags. Verify they render correctly by testing with the Facebook Sharing Debugger and Twitter Card Validator.

6. **Custom 404 page** — Create `404.html` with a friendly message and link back to the homepage.

7. **Analytics** — Add Google Analytics or a privacy-friendly alternative (Plausible, Umami) via the `_includes/head.html`.

8. **CV/Resume page** — Add a dedicated CV page or a downloadable PDF link.

9. **Consulting/speaking section** — Add availability signals for paid speaking and scientific advisory work, either on the About page or as a separate page.

---

## REFERENCE: File Structure After Migration

```
KristofM854.github.io/
├── _config.yml                 # Jekyll configuration
├── Gemfile                     # Ruby dependencies
├── CNAME                       # Custom domain
├── robots.txt                  # SEO
├── index.html                  # Homepage (hero + project grid)
├── _layouts/
│   ├── default.html            # Master layout
│   ├── post.html               # Blog post layout
│   ├── project.html            # Project detail layout
│   └── page.html               # Generic page layout
├── _includes/
│   ├── head.html               # <head> tag contents
│   ├── nav.html                # Navigation bar
│   └── footer.html             # Site footer
├── _posts/
│   ├── 2025-XX-XX-post-1.md    # Blog post 1
│   ├── 2025-XX-XX-post-2.md    # Blog post 2
│   └── ...                     # (7 posts total)
├── _projects/
│   ├── hab-review.md           # Project: HAB review paper
│   ├── shiny-bioassay.md       # Project: Shiny app
│   ├── hab-quiz.md             # Project: Quiz app
│   └── ...                     # (more projects)
├── _pages/
│   ├── about.md                # About page
│   ├── publications.md         # Publications page
│   └── contact.md              # Contact page
├── _data/
│   └── publications.yml        # Publication entries (data-driven)
├── blog/
│   └── index.html              # Blog index with pagination
├── assets/
│   ├── css/
│   │   └── style.css           # All styles
│   ├── js/                     # Minimal JS if needed
│   └── images/
│       ├── projects/           # Project card images
│       ├── blog/               # Blog post images
│       ├── portrait.jpg        # About page photo
│       └── favicon.png
├── quiz/                       # React HAB quiz app (EXCLUDED from Jekyll)
└── CLAUDE_CODE_INIT_PROMPT.md  # (if present, excluded from Jekyll)
```

---

## IMPORTANT REMINDERS FOR CLAUDE CODE

1. **Always verify against the actual repo.** This guide is based on known information about the site. The actual file names, paths, and content may differ. Run `find` and `cat` commands to inspect the real state before making changes.

2. **Content comes first.** The blog post text, about page bio, publication list, and project descriptions must be migrated accurately. Do not invent or paraphrase content. Copy it faithfully from the existing HTML files, converting only the markup format.

3. **Preserve all existing URLs if possible.** If the old blog posts were at `/blog/post-title.html`, the new Jekyll URLs should match or redirect. The `permalink` setting in `_config.yml` and per-post front matter can handle this. Check old URLs and set up redirects if needed using `jekyll-redirect-from` (GitHub Pages whitelisted).

4. **Test early and often.** Run `bundle exec jekyll serve` after each phase to catch issues early.

5. **Git commit after each phase.** Make one commit per phase so it is easy to roll back if something breaks.

6. **The quiz app must survive.** After every change, verify that `/quiz/` still serves the React app. The `exclude: [quiz]` in `_config.yml` prevents Jekyll from processing it, but double-check the directory is intact.
