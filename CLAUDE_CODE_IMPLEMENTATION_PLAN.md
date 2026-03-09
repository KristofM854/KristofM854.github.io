# Website Implementation Plan — kristofmoeller.com
**For use with Claude Code in the repo: KristofM854/KristofM854.github.io**

---

## Overview

This plan covers 9 discrete change sets, ordered by dependency (CSS first, shared components next, then page-by-page). Each section includes the exact file(s) to edit, what to change, and precise content/values to use. Claude Code should work through these in order.

---

## Change Set 1 — CSS: Navbar restructure (primary/secondary split)

**File:** `css/style.css`

The navbar currently has 8 items and will crowd on mid-size screens. Restructure to a 6-item primary nav. The secondary nav items (News, Blog) will live only in the footer.

**In `.navbar-links`**, remove the gap between items slightly:
```css
gap: 1.5rem;  /* was 2rem */
```

No CSS changes required beyond this — the structural change is in the HTML (Change Set 3).

---

## Change Set 2 — CSS: Skill tag grouping labels + harmonised bullet system

**File:** `css/style.css`

### 2a. Skill group label (new class for homepage grouped skills)
Add after the existing `.cv-skills-group h4` rule:

```css
.skill-group {
  margin-bottom: 1.75rem;
}

.skill-group:last-child {
  margin-bottom: 0;
}

.skill-group-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #4F9CF9;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.625rem;
}
```

### 2b. Harmonise bullet system on CV

The CV currently uses two systems: `cv-list-item` (with `▸` pseudo-element) for lab skills, and `skill-tag` pills for IT/Languages. **Decision: use `cv-list-item` rows everywhere on the CV.** This means converting IT and Languages on the CV page from pills to list items (done in Change Set 7).

No new CSS needed — `cv-list-item` already handles this correctly.

### 2c. Abstract toggle (new classes for publications page)

Add to the publications section:

```css
.pub-abstract-toggle {
  appearance: none;
  -webkit-appearance: none;
  background: none;
  border: none;
  color: #64748B;
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-top: 0.5rem;
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.pub-abstract-toggle:hover {
  color: #4F9CF9;
}

.pub-abstract-toggle::before {
  content: '▸';
  display: inline-block;
  transition: transform 0.2s ease;
}

.pub-abstract-toggle.open::before {
  transform: rotate(90deg);
}

.pub-abstract-body {
  display: none;
  margin-top: 0.625rem;
  font-size: 0.875rem;
  color: #64748B;
  line-height: 1.7;
  border-left: 2px solid #1E293B;
  padding-left: 0.875rem;
}

.pub-abstract-body.open {
  display: block;
}
```

### 2d. Stats strip (new component for homepage hero)

```css
.hero-stats {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #1E293B;
  flex-wrap: wrap;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.hero-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4F9CF9;
  line-height: 1;
  letter-spacing: -0.02em;
}

.hero-stat-label {
  font-size: 0.75rem;
  color: #64748B;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### 2e. Status badge for project cards

```css
.project-status {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #22C55E;
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.25);
  border-radius: 999px;
  padding: 0.2rem 0.625rem;
}

.project-status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #22C55E;
  flex-shrink: 0;
}
```

---

## Change Set 3 — ALL PAGES: Navbar + footer update

**Files:** `index.html`, `cv.html`, `publications.html`, `r-projects.html`, `talks.html`, `blog.html`, `news.html`, `contact.html`, `blog/post-1.html`

### Primary navbar (6 items — remove News and Blog)
Replace every `<ul class="navbar-links">` block across all pages with:

```html
<ul class="navbar-links">
  <li><a href="index.html">Home</a></li>
  <li><a href="cv.html">CV</a></li>
  <li><a href="publications.html">Publications</a></li>
  <li><a href="r-projects.html">Data &amp; Software</a></li>
  <li><a href="talks.html">Talks</a></li>
  <li><a href="contact.html">Contact</a></li>
</ul>
```

Note: `r-projects.html` stays as the filename; only the link text and page title changes (see Change Set 8).

### Footer nav (all 7 items)
Replace every `<nav class="footer-links">` block across all pages with:

```html
<nav class="footer-links">
  <a href="cv.html">CV</a>
  <a href="publications.html">Publications</a>
  <a href="r-projects.html">Data &amp; Software</a>
  <a href="talks.html">Talks</a>
  <a href="news.html">Updates</a>
  <a href="blog.html">Blog</a>
  <a href="contact.html">Contact</a>
</nav>
```

---

## Change Set 4 — index.html: Hero bio, tagline, skills grouping, stats strip

**File:** `index.html`

### 4a. Hero tagline (single sharp sentence)
Replace the `<p class="hero-title">` line with:

```html
<p class="hero-title">Marine Biochemist & Data Scientist turning ocean toxin research into policy-ready science — at the IAEA Marine Environment Laboratories, Monaco.</p>
```

### 4b. Hero bio (condensed to 2 paragraphs)
Replace the entire `<div class="hero-bio">` block with:

```html
<div class="hero-bio">
  <p>I work at the intersection of marine science, environmental monitoring, and public health at the IAEA Marine Environment Laboratories in Monaco. My research focuses on harmful algal blooms (HABs), marine biotoxins, and the monitoring systems that support food safety and policy response — combining fieldwork, analytical chemistry, and data analysis in R.</p>
  <p>I'm particularly interested in roles that connect environmental science with policy design, programme coordination, or consulting, especially in the context of international cooperation and sustainable ocean governance.</p>
</div>
```

### 4c. Stats strip
Add directly after `</div><!-- /.hero-bio -->`, still inside `.hero-content`:

```html
<div class="hero-stats">
  <div class="hero-stat">
    <span class="hero-stat-value">7</span>
    <span class="hero-stat-label">Publications</span>
  </div>
  <div class="hero-stat">
    <span class="hero-stat-value">1</span>
    <span class="hero-stat-label">International Award</span>
  </div>
  <div class="hero-stat">
    <span class="hero-stat-value">3</span>
    <span class="hero-stat-label">Languages</span>
  </div>
  <div class="hero-stat">
    <span class="hero-stat-value">IAEA</span>
    <span class="hero-stat-label">Monaco</span>
  </div>
</div>
```

### 4d. Grouped skills section
Replace the entire `<div class="skills-grid">` block (the flat pills) with:

```html
<div class="skill-group">
  <p class="skill-group-label">Marine Science</p>
  <div class="skills-grid">
    <span class="skill-tag">Harmful Algal Blooms</span>
    <span class="skill-tag">Marine Biotoxins</span>
    <span class="skill-tag">Environmental Monitoring</span>
    <span class="skill-tag">Analytical Chemistry</span>
    <span class="skill-tag">LC-MS/MS</span>
    <span class="skill-tag">Cell Culture</span>
  </div>
</div>
<div class="skill-group">
  <p class="skill-group-label">Data & Analysis</p>
  <div class="skills-grid">
    <span class="skill-tag">R</span>
    <span class="skill-tag">Statistical Analysis</span>
    <span class="skill-tag">Time Series Analysis</span>
    <span class="skill-tag">Python (intermediate)</span>
    <span class="skill-tag">R Shiny</span>
  </div>
</div>
<div class="skill-group">
  <p class="skill-group-label">Policy & Coordination</p>
  <div class="skills-grid">
    <span class="skill-tag">International Relations</span>
    <span class="skill-tag">Technical Cooperation</span>
    <span class="skill-tag">Scientific Communication</span>
  </div>
</div>
```

### 4e. Profile photo: circular crop
In `.hero-avatar`, change `border-radius` from `8px` to `50%`. Either in the CSS file directly, or add inline:
```html
<img class="hero-avatar" src="images/profile.jpg" alt="Kristof Moeller" style="border-radius:50%;">
```

---

## Change Set 5 — publications.html: Full author strings, abstracts, navbar fix

**File:** `publications.html`

The navbar on this page is missing "Talks" — fix that as part of Change Set 3.

### 5a. Replace all `<div class="pub-entry">` blocks with expanded versions

Use the following content. Each entry gains: full authors (3-4 + et al.), and an abstract toggle.

Add this JavaScript at the bottom of the page (before `</body>`), replacing the existing inline script's closing, or appending:

```html
<script>
  // Abstract toggles
  document.querySelectorAll('.pub-abstract-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var body = this.nextElementSibling;
      var isOpen = body.classList.contains('open');
      body.classList.toggle('open', !isOpen);
      this.classList.toggle('open', !isOpen);
      this.textContent = isOpen ? 'Show abstract' : 'Hide abstract';
      // restore the ::before pseudo via class — textContent wipes it, so use data attr instead
    });
  });
</script>
```

**Note on the toggle button:** Because `textContent` overwrites the `::before` pseudo-element trick, use this pattern instead for the button HTML and a slightly adjusted CSS approach — just change the button text and rotate a `▸` span inside it:

Button HTML template (use for every pub entry):
```html
<button class="pub-abstract-toggle" aria-expanded="false">▸ Show abstract</button>
<div class="pub-abstract-body">
  [ABSTRACT TEXT HERE]
</div>
```

JS should toggle the text between `▸ Show abstract` and `▾ Hide abstract` and toggle the `.open` class on the body div.

### 5b. Full pub entry content to use:

**Entry 1 — Harmful Algae 2026**
- Authors: `Möller, K., Jakobsen, H.H., Engesmo, A., Karlson, B. et al.`
- Abstract: *The harmful dinoflagellate Alexandrium pseudogonyaulax has been associated with the mortality of marine organisms, including fish. To confirm hypothesised range expansion, comprehensive long-term time series from monitoring stations in Germany, Sweden, Denmark, and Norway were analysed. The species is now a recurrent part of the microalgal community, primarily in the Kattegat, Skagerrak, and southern Baltic Sea, occurring May–October and peaking in July. Logistic regression revealed increasing occurrence trends at several sites. Salinity tolerance, potential cyst dispersal, and climate-induced warming likely promoted its regional spread.*

**Entry 2 — Harmful Algae 2024**
- Authors: `Möller, K., Tillmann, U., Pöchhacker, M., Varga, E. et al.`
- Abstract: *Alexandrium pseudogonyaulax is currently appearing with increasing frequency across Northern European waters. This study assessed lethal and sublethal effects on algae, zooplankton, and fish gill cells, providing the first report of fish-killing potency for this species. Adverse effects were mainly driven by unknown bioactive extracellular compounds rather than goniodomins. Intrastrain variability highlighted limited understanding of factors modulating lytic activity in Alexandrium spp.*

**Entry 3 — Limnology & Oceanography 2024**
- Authors: `Möller, K., Thoms, S., Tillmann, U., Krock, B. et al.`
- Abstract: *The toxin-producing dinoflagellate A. pseudogonyaulax has become increasingly abundant in northern European waters, yet little is known about the environmental conditions influencing its growth and toxicity. The impacts of different nitrogen sources and light intensities on growth and toxin content were investigated using three strains isolated from the Danish Limfjord. Growth rates were significantly influenced by nitrogen source and light, while intracellular toxin content differed mainly between exponential and stationary growth phases. Intraspecific differences between strains highlight the need for multi-strain experiments in long-term modelling studies.*

**Entry 4 — Rapid Communications in Mass Spectrometry 2022**
- Authors: `Möller, K., Krock, B., Koch, F.`
- Abstract: *More than half of surveyed microalgae require vitamin B12, but methods for directly measuring dissolved B12 in seawater are scarce. A LC-MS/MS method for simultaneous detection of four B12 congeners was optimised and applied to field samples from northern European marine systems. A novel isomer of hydroxycobalamin was detected and found to dominate the dissolved B12 pool at all field sites. This isomer should be included in future studies of vitamin B12 cycling in the ocean.*

**Entry 5 — Progress in Oceanography 2022**
- Authors: `Möller, K., Pinto-Torres, M., Mardones, J.I., Krock, B.`
- Abstract: *Harmful algal blooms pose an increasing threat to public health and economic stability in southern Chile. Fieldwork during the PROFAN expedition (November 2019) extended knowledge of toxin-producing species in the difficult-to-access Última Esperanza Province. Paralytic Shellfish Poisoning toxins and lipophilic toxins dominated by yessotoxins, pectenotoxins, and domoic acid were detected at nearly every station. Crucially, the first detection of pinnatoxin-G in Chilean waters strongly indicates the presence of the dinoflagellate Vulcanodinium rugosum.*

**Entry 6 — Bulletin of Environmental Contamination and Toxicology 2025 (Co-Author)**
- Authors: `Tondu, F., Moeller, K., Sdiri, K., Oberhansli, F. et al.`
- Abstract: *This study quantified the adsorption and desorption kinetics of brevetoxin-3 (PbTx-3) on polyethylene (PE) microplastics in relation to the presence of biofilms, using radiolabeled ³H-PbTx-3. Contrary to expectations, biofilm-coated PE showed significantly reduced toxin adsorption compared to virgin PE, and desorption from biofilm-coated PE occurred rapidly. Results suggest that biofilm-coated PE likely plays a minor role as a biotoxin vector in marine food webs compared to virgin microplastics.*

**Entry 7 — Tetrahedron 2018 (Co-Author)**
- Authors: `Haut, K., Moeller, K. et al.`
- Abstract: *Total synthesis of the sesterterpene natural product (+)-stachyflin was achieved using a Negishi cross-coupling reaction as the key step. The synthesis confirms the absolute configuration and provides a scalable route to this architecturally complex marine natural product.*

---

## Change Set 6 — cv.html: Remove "Other Experience", harmonise skills bullets, fix Python/MATLAB

**File:** `cv.html`

### 6a. Remove entire "Other Experience" section
Delete from `<!-- OTHER EXPERIENCE -->` comment through the closing `</section>` tag of that block (approximately lines 331–356 in the current file).

### 6b. IT & Computing skills — convert from pills to cv-list-item rows
Replace the `<div class="skills-grid">` block inside the IT & Computing `cv-skills-group` with:

```html
<div class="cv-list">
  <div class="cv-list-item">R — very good</div>
  <div class="cv-list-item">Python — intermediate</div>
  <div class="cv-list-item">LaTeX — good</div>
  <div class="cv-list-item">Excel, PowerPoint — proficient</div>
</div>
```

(MATLAB removed entirely.)

### 6c. Languages — convert from pills to cv-list-item rows
Replace the `<div class="skills-grid">` block inside the Languages `cv-skills-group` with:

```html
<div class="cv-list">
  <div class="cv-list-item">German — Native</div>
  <div class="cv-list-item">English — Fluent (C2)</div>
  <div class="cv-list-item">French — Very good (B2–C1)</div>
</div>
```

---

## Change Set 7 — r-projects.html: Rename page, add status badges

**File:** `r-projects.html`

### 7a. Page `<title>` and `<h1>`
- `<title>`: Change to `Data &amp; Software Projects — Kristof Moeller`
- `<h1>`: Change to `Data &amp; Software Projects`
- `<p>` subtitle under h1: Change to `Open-source tools and analytical pipelines for marine science, environmental monitoring, and toxicology.`

### 7b. Add status badge to each project card
Inside each `<article class="card">`, add the following immediately after the existing `<div class="card-meta" ...>` tag (the one with the tech/topic pills), as a new line:

```html
<span class="project-status">Active Development</span>
```

---

## Change Set 8 — news.html: Rename to "Updates"

**File:** `news.html`

### 8a. `<title>` and `<h1>`
- `<title>`: Change to `Updates — Kristof Moeller`
- `<h1>`: Change to `Updates`
- `<p>` subtitle: Change to `News and updates from IAEA-MEL and the HAB research community.`

### 8b. `<meta name="description">` and OG/Twitter tags
Update the description to: `Latest updates from Kristof Moeller — IAEA Marine Environment Laboratories researcher working on harmful algal blooms and marine biotoxins.`

Also update og:title and twitter:title to `Updates — Kristof Moeller`.

---

## Change Set 9 — talks.html: Promote the ICHA award

**File:** `talks.html`

### 9a. Add a featured award callout at the top of `<main>`
Directly after `<main class="container" ...>` and before the filter bar, insert:

```html
<div style="background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); border: 1px solid #4F9CF9; border-radius: 8px; padding: 1.25rem 1.5rem; margin-bottom: 2.5rem; display: flex; align-items: center; gap: 1rem;">
  <span style="font-size: 1.5rem; flex-shrink: 0;">★</span>
  <div>
    <div style="font-size: 0.75rem; font-weight: 700; color: #4F9CF9; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.25rem;">International Recognition</div>
    <div style="font-size: 1rem; font-weight: 600; color: #F8FAFC; line-height: 1.4;">ISSHA Maureen Keller Award — Best Oral Student Presentation</div>
    <div style="font-size: 0.875rem; color: #94A3B8; margin-top: 0.25rem;">International Conference on Harmful Algae (ICHA) · Hiroshima, Japan · 2023</div>
  </div>
</div>
```

---

## Verification Checklist

After all changes, Claude Code should confirm:

- [ ] Navbar has exactly 6 items on all 9 pages (Home, CV, Publications, Data & Software, Talks, Contact)
- [ ] Footer has 7 items on all pages, including "Updates" (linking to news.html) and "Blog"
- [ ] `r-projects.html` page title and h1 read "Data & Software Projects"
- [ ] `news.html` page title and h1 read "Updates"
- [ ] Homepage bio is 2 paragraphs maximum
- [ ] Hero stats strip is present below bio on index.html
- [ ] Skills on homepage are grouped under 3 labelled categories
- [ ] Profile photo has `border-radius: 50%` (circular)
- [ ] Each pub entry has: full authors, abstract toggle button, abstract body div
- [ ] Abstract JS toggle works (▸/▾ and show/hide)
- [ ] CV has no "Other Experience" section
- [ ] CV IT & Languages skills use `cv-list-item` rows (no pills)
- [ ] MATLAB removed from CV; Python reads "intermediate"
- [ ] Both R project cards have green "Active Development" status badge
- [ ] Talks page has award callout block at top of main content
- [ ] All new CSS classes are present in `css/style.css`
- [ ] No broken links (especially r-projects.html filename unchanged)

---

## Notes for Claude Code

- **Do not rename `r-projects.html`** — only change the display text. All internal links already point to `r-projects.html`.
- The abstract toggle JS should be self-contained inline on publications.html, not added to main.js, to avoid conflicts.
- When updating the navbar across all pages, be careful that the **active class** is on the correct page's link on each respective page (e.g. `class="active"` on CV link when on cv.html, etc.) — this is handled by main.js's `setActiveNav()` function automatically, so no manual changes needed.
- The `blog/post-1.html` file is in a subdirectory — its CSS path is `../css/style.css` and nav links need `../` prefixes. Check that the navbar update on that file preserves `../` prefixes.
