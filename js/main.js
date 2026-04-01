// ============================================================
// HAMBURGER MENU TOGGLE
// ============================================================

(function () {
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.navbar-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ============================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================

(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

// ============================================================
// ACTIVE NAV LINK HIGHLIGHTING
// Handles root-level pages and subdirectory pages (e.g. blog/post-1.html)
// ============================================================

(function () {
  var path = window.location.pathname;
  var segments = path.replace(/\/$/, '').split('/').filter(Boolean);
  var filename = segments.pop() || 'index.html';
  var parentDir = segments.pop() || '';

  document.querySelectorAll('.navbar-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;

    var hrefClean = href.replace(/^(\.\.\/)+/, '');
    var hrefSegments = hrefClean.replace(/\/$/, '').split('/').filter(Boolean);
    var hrefFile = hrefSegments.pop() || 'index.html';

    var isActive = false;

    // Direct filename match (root-level pages)
    if (hrefFile === filename) isActive = true;

    // If inside a subdirectory, highlight the parent nav item (blog/ -> blog.html)
    if (parentDir && hrefFile === parentDir + '.html') isActive = true;

    // Root / index special case
    if ((filename === '' || filename === 'index.html') &&
        (hrefFile === 'index.html' || href === '/')) isActive = true;

    link.classList.toggle('active', isActive);
  });
})();

// ============================================================
// DATE FORMATTER  →  applied to all .js-date[data-date] elements
// ============================================================

function formatDate(dateString) {
  if (!dateString) return '';
  var parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  var year  = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10) - 1;
  var day   = parseInt(parts[2], 10);
  var months = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
  if (month < 0 || month > 11) return dateString;
  return months[month] + ' ' + day + ', ' + year;
}

(function () {
  document.querySelectorAll('.js-date[data-date]').forEach(function (el) {
    var formatted = formatDate(el.getAttribute('data-date'));
    if (formatted) el.textContent = formatted;
  });
})();

// ============================================================
// READING TIME ESTIMATOR  (blog post pages)
// ============================================================

(function () {
  var body   = document.querySelector('.post-body');
  var dateEl = document.querySelector('.post-date');
  if (!body || !dateEl) return;

  var words   = body.innerText.trim().split(/\s+/).length;
  var minutes = Math.max(1, Math.round(words / 200));
  var label   = minutes === 1 ? '1 min read' : minutes + ' min read';

  var sep = document.createElement('span');
  sep.style.cssText = 'margin:0 0.5rem;color:#334155;';
  sep.textContent = '·';

  var rt = document.createElement('span');
  rt.className = 'reading-time';
  rt.textContent = label;

  dateEl.appendChild(sep);
  dateEl.appendChild(rt);
})();

// ============================================================
// BLOG TAG FILTER
// ============================================================

(function () {
  var filterBar = document.querySelector('.blog-filter-bar');
  if (!filterBar) return;

  var cards = document.querySelectorAll('.blog-grid .card[data-tags]');

  filterBar.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBar.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      var tag = btn.getAttribute('data-filter');

      cards.forEach(function (card) {
        if (tag === 'all') {
          card.style.display = '';
        } else {
          var cardTags = card.getAttribute('data-tags').split(',').map(function (t) {
            return t.trim().toLowerCase();
          });
          card.style.display = cardTags.indexOf(tag.toLowerCase()) !== -1 ? '' : 'none';
        }
      });
    });
  });
})();
