/* WhatsApp: floating chat button on every page + click tracking for every wa.me link.
   Number 07404 458109 (wa.me format 447404458109). Industry pages get an industry-specific message.
   Inline "WhatsApp us" buttons are plain links in the page HTML; this script only tracks their clicks. */
(function () {
  'use strict';
  var NUMBER = '447404458109';
  var DEFAULT_MSG = "Hi Calon AI, I'd like a free review for my business.";
  var INDUSTRY = {
    '/fire-security': 'a fire and security business',
    '/heating-plumbing': 'a heating, plumbing or renewables business',
    '/construction-training': 'a construction business or training provider',
    '/hospitality-food': 'a hospitality or food business',
    '/salons-gyms-membership': 'a salon, gym or membership business'
  };
  function pagePath() { return (location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/$/, '$1')) || '/'; }
  function message() {
    var ind = INDUSTRY[pagePath()];
    return ind ? 'Hi Calon AI, I run ' + ind + " and I'd like a free review." : DEFAULT_MSG;
  }
  function link() { return 'https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(message()).replace(/'/g, '%27'); }

  // ---- tracking: every wa.me link on the page, including the floating button
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
    if (!a) return;
    var data = { event: 'whatsapp_click', page_path: pagePath(), page_location: location.href, link_location: a.getAttribute('data-wa') || 'inline' };
    try { (window.dataLayer = window.dataLayer || []).push(data); } catch (err) {}
    try { if (typeof window.gtag === 'function') window.gtag('event', 'whatsapp_click', { page_path: data.page_path, link_location: data.link_location }); } catch (err) {}
  }, true);

  // ---- floating button
  function mount() {
    if (document.getElementById('calon-wa')) return;
    var css = document.createElement('style');
    css.textContent =
      '#calon-wa{position:fixed;right:24px;bottom:24px;z-index:58;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;' +
      'background:#25D366;color:#fff;text-decoration:none;box-shadow:0 10px 28px rgba(0,0,0,.35),0 0 0 1px rgba(255,255,255,.12) inset;' +
      'transition:bottom .35s cubic-bezier(.22,.61,.36,1),transform .2s,box-shadow .2s;}' +
      '#calon-wa:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 14px 34px rgba(0,0,0,.4);}' +
      '#calon-wa:focus-visible{outline:3px solid #fff;outline-offset:3px;}' +
      '#calon-wa svg{width:30px;height:30px;display:block;}' +
      '@media(max-width:640px){#calon-wa{right:16px;bottom:16px;}}' +
      '@media print{#calon-wa{display:none;}}' +
      '@media(prefers-reduced-motion:reduce){#calon-wa{transition:none;}#calon-wa:hover{transform:none;}}';
    document.head.appendChild(css);
    var a = document.createElement('a');
    a.id = 'calon-wa';
    a.href = link();
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Chat with us on WhatsApp');
    a.setAttribute('title', 'Chat with us on WhatsApp');
    a.setAttribute('data-wa', 'floating');
    a.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
    document.body.appendChild(a);

    // Keep the button above the cookie bar while it is on screen, so it never covers it.
    var base = function () { return window.matchMedia('(max-width:640px)').matches ? 16 : 24; };
    function place() {
      var bar = document.getElementById('calon-cookie');
      var b = base();
      if (bar && bar.isConnected) {
        var cs = getComputedStyle(bar);
        b = Math.max(b, (parseFloat(cs.bottom) || 0) + bar.offsetHeight + 14);
      }
      a.style.bottom = b + 'px';
    }
    place();
    new MutationObserver(place).observe(document.body, { childList: true });
    window.addEventListener('resize', place);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
