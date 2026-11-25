(function () {
  'use strict';
  // Fade-up once as each section enters. Only elements below the fold are hidden first,
  // so nothing is ever blank if this script or the observer does not run.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = Array.prototype.slice.call(document.querySelectorAll('.fu'));
  if (!reduce && 'IntersectionObserver' in window) {
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); e.target.classList.remove('pre'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top > vh) { el.classList.add('pre'); io.observe(el); }
    });
    // safety net: never leave anything hidden
    setTimeout(function () { els.forEach(function (el) { el.classList.remove('pre'); }); }, 4000);
  }
  // CTA tracking (no-op until analytics is configured)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-track="cta"]');
    if (!a) return;
    try { (window.dataLayer = window.dataLayer || []).push({ event: 'cta_click', cta: a.getAttribute('data-cta'), page_path: location.pathname }); } catch (err) {}
  });
  // close the mobile menu after choosing a link
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.mnav-panel a');
    if (a) { var d = a.closest('details'); if (d) d.removeAttribute('open'); }
  });
})();
