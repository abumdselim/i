(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- theme ---------- */
  var THEME_KEY = 'intactic-theme';
  function setTheme(mode) {
    root.setAttribute('data-theme', mode);
    try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
    var btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      btn.setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
    }
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });
  setTheme(root.getAttribute('data-theme') || 'light');

  /* ---------- mobile menu ---------- */
  var menu = document.querySelector('[data-menu]');
  var openBtn = document.querySelector('[data-menu-open]');
  var closeBtn = document.querySelector('[data-menu-close]');
  var lastFocus = null;

  function openMenu() {
    if (!menu) return;
    lastFocus = document.activeElement;
    menu.setAttribute('data-open', 'true');
    menu.removeAttribute('aria-hidden');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var first = menu.querySelector('a, button');
    if (first) first.focus();
  }
  function closeMenu() {
    if (!menu) return;
    menu.setAttribute('data-open', 'false');
    menu.setAttribute('aria-hidden', 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.getAttribute('data-open') === 'true') closeMenu();
  });
  if (menu) {
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1080 && menu && menu.getAttribute('data-open') === 'true') closeMenu();
  });

  /* ---------- scroll reveal ---------- */
  var revealables = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- service index (services page) ---------- */
  var svcLinks = document.querySelectorAll('[data-svc-link]');
  if (svcLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    svcLinks.forEach(function (link) {
      var id = link.getAttribute('href');
      if (id && id.charAt(0) === '#') {
        var target = document.querySelector(id);
        if (target) map[id.slice(1)] = link;
      }
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          svcLinks.forEach(function (l) { l.removeAttribute('aria-current'); });
          var link = map[entry.target.id];
          if (link) link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- contact form -> mail ---------- */
  var form = document.querySelector('[data-brief-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var data = new FormData(form);
      var get = function (k) { return (data.get(k) || '').toString().trim(); };
      var subject = 'Project brief — ' + (get('company') || get('name') || 'Intactic enquiry');
      var lines = [
        'Name: ' + get('name'),
        'Company: ' + get('company'),
        'Email: ' + get('email'),
        'Project type: ' + get('type'),
        'Timeline: ' + get('timeline'),
        '',
        'Brief:',
        get('message'),
        '',
        '— Sent from intactic.net'
      ];
      var href = 'mailto:hello@intactic.net?subject=' + encodeURIComponent(subject) +
                 '&body=' + encodeURIComponent(lines.join('\n'));
      var status = document.querySelector('[data-form-status]');
      if (status) {
        status.hidden = false;
        status.textContent = 'Your email app should open with the brief filled in. If nothing happens, write to hello@intactic.net directly.';
        status.focus();
      }
      window.location.href = href;
    });
  }
})();
