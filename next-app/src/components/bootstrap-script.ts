/**
 * The blocking bootstrap, inlined as the first thing inside <body>.
 *
 * It does three jobs, in this order, before any content paints:
 *   1. swap `no-js` for `js` (the stylesheet uses both);
 *   2. apply the stored theme to <html data-theme>;
 *   3. arm the scroll reveal.
 *
 * The legacy build armed the reveal by adding `js`, in a script that ran once at
 * the end of the document. In an App Router app the page subtree is replaced on
 * every client-side navigation without re-running document scripts, so new nodes
 * would never be marked revealed while the CSS still held them at opacity:0.
 *
 * Three decisions carry the whole thing:
 *
 * a) The gate is a class on <html> (`reveal-ready`) and the state is an
 *    ATTRIBUTE on the element (`data-revealed`), not a class. React owns every
 *    className declared in JSX, so a pre-hydration `.in` class is a hydration
 *    mismatch — React reports it and can restore the server value, which leaves
 *    an element that the observer already unobserved stuck at opacity 0.
 *    `data-revealed` is never declared in JSX, so hydration cannot touch it.
 *
 * b) Arming the gate is a promise to open it, so every path that cannot open it
 *    returns before arming: no IntersectionObserver, no MutationObserver.
 *
 * c) An occluded or never-composited webview can load this document and receive
 *    no intersection record at all. A 1.5s watchdog then reveals everything and
 *    marks the run degraded, so later mounts skip the gate entirely.
 */
export const BOOTSTRAP = String.raw`(function () {
  var d = document.documentElement;
  d.classList.remove('no-js');
  d.classList.add('js');
  try {
    var t = localStorage.getItem('intactic-theme');
    if (t === 'dark' || t === 'light') d.setAttribute('data-theme', t);
  } catch (e) {}

  var PENDING = '[data-reveal]:not([data-revealed])';
  var degraded = false;

  function mark(el) {
    el.setAttribute('data-revealed', '');
  }

  function revealAll() {
    degraded = true;
    var nodes = document.querySelectorAll(PENDING);
    for (var i = 0; i < nodes.length; i++) mark(nodes[i]);
  }

  // Fail open: a gate that can never be opened must not be armed.
  if (!('IntersectionObserver' in window) || !('MutationObserver' in window)) return;

  var fired = false;
  var io = new IntersectionObserver(function (entries) {
    fired = true;
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if (entry.isIntersecting || degraded) {
        mark(entry.target);
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  function bind(root) {
    if (!root || root.nodeType !== 1) return;
    var nodes = [];
    if (root.matches(PENDING)) nodes.push(root);
    var found = root.querySelectorAll(PENDING);
    for (var i = 0; i < found.length; i++) nodes.push(found[i]);
    for (var j = 0; j < nodes.length; j++) {
      if (degraded) mark(nodes[j]);
      else io.observe(nodes[j]);
    }
  }

  bind(document);
  new MutationObserver(function (records) {
    records.forEach(function (record) {
      record.addedNodes.forEach(bind);
    });
  }).observe(d, { childList: true, subtree: true });

  setTimeout(function () { if (!fired) revealAll(); }, 1500);

  d.classList.add('reveal-ready');
})();`;
