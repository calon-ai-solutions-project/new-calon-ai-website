/* Cookie notice: small pill at the bottom of the screen, shown until the visitor clicks "I understand". */
(function () {
  var KEY = 'calon-cookie-consent';
  try { if (localStorage.getItem(KEY)) return; } catch (e) { /* storage blocked: still show the notice */ }

  function show() {
    if (document.getElementById('calon-cookie')) return;
    var css = document.createElement('style');
    css.textContent =
      '#calon-cookie{position:fixed;left:50%;bottom:22px;z-index:9999;display:flex;align-items:center;gap:22px;' +
      'max-width:calc(100% - 28px);padding:10px 10px 10px 26px;border-radius:999px;background:#F3F6F8;color:#0A1428;' +
      "font-family:'Inter Tight','Inter',system-ui,-apple-system,'Segoe UI',sans-serif;font-size:16px;letter-spacing:-0.01em;" +
      'box-shadow:0 18px 50px rgba(0,0,0,0.45),0 0 0 1px rgba(126,196,240,0.25);' +
      'transform:translate(-50%,140%);opacity:0;transition:transform .5s cubic-bezier(.22,.61,.36,1),opacity .5s;}' +
      '#calon-cookie.is-in{transform:translate(-50%,0);opacity:1;}' +
      '#calon-cookie p{margin:0;line-height:1.35;}' +
      '#calon-cookie p b{font-weight:600;}' +
      '#calon-cookie a{color:#0A1428;text-decoration:underline;text-underline-offset:2px;}' +
      '#calon-cookie button{flex:none;display:inline-flex;align-items:center;gap:8px;border:0;cursor:pointer;' +
      'background:linear-gradient(180deg,#9AD3F5,#7EC4F0 45%,#5AAEE2);color:#06101F;font:inherit;font-weight:600;' +
      'padding:12px 22px 12px 18px;border-radius:999px;box-shadow:0 6px 18px rgba(74,155,212,0.35),inset 0 1px 0 rgba(255,255,255,0.6);' +
      'transition:transform .2s,box-shadow .2s;}' +
      '#calon-cookie button:hover{transform:translateY(-1px);box-shadow:0 10px 24px rgba(74,155,212,0.45),inset 0 1px 0 rgba(255,255,255,0.6);}' +
      '#calon-cookie button:focus-visible{outline:2px solid #0A1428;outline-offset:3px;}' +
      '#calon-cookie button svg{width:18px;height:18px;flex:none;}' +
      '@media(max-width:520px){#calon-cookie{font-size:14.5px;gap:14px;padding:8px 8px 8px 18px;bottom:14px;width:calc(100% - 28px);justify-content:space-between;}}' +
      '@media(prefers-reduced-motion:reduce){#calon-cookie{transition:none;}}';
    document.head.appendChild(css);

    var bar = document.createElement('div');
    bar.id = 'calon-cookie';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Cookie notice');
    bar.innerHTML = '<p>This website uses <b>cookies</b>. <a href="' + legalHref() + '">Privacy Policy</a></p>' +
      '<button type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>I understand</button>';
    bar.querySelector('button').addEventListener('click', function () {
      try { localStorage.setItem(KEY, 'accepted:' + new Date().toISOString()); } catch (e) {}
      bar.classList.remove('is-in');
      setTimeout(function () { bar.remove(); }, 500);
    });
    document.body.appendChild(bar);
    requestAnimationFrame(function () { requestAnimationFrame(function () { bar.classList.add('is-in'); }); });
  }

  function legalHref() { return '/privacy'; }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(show, 900); });
  else setTimeout(show, 900);
})();
