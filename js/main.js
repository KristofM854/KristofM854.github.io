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

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
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
// ============================================================

(function () {
  var path = window.location.pathname;

  // Normalize path: strip trailing slash, get the filename
  var page = path.replace(/\/$/, '').split('/').pop() || 'index.html';

  document.querySelectorAll('.navbar-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;

    var linkPage = href.replace(/\/$/, '').split('/').pop() || 'index.html';

    if (
      linkPage === page ||
      (page === '' && linkPage === 'index.html') ||
      (linkPage === 'index.html' && page === '') ||
      (href === '/' && (page === '' || page === 'index.html'))
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

// ============================================================
// DATE FORMATTER
// Input: 'YYYY-MM-DD'  Output: 'March 6, 2026'
// ============================================================

function formatDate(dateString) {
  if (!dateString) return '';

  var parts = dateString.split('-');
  if (parts.length !== 3) return dateString;

  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10) - 1; // 0-indexed
  var day = parseInt(parts[2], 10);

  var months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (month < 0 || month > 11) return dateString;

  return months[month] + ' ' + day + ', ' + year;
}
