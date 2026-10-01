/* Cookie notice: small pill at the bottom of the screen, shown until the visitor accepts. */
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
      '#calon-cookie button{flex:none;border:0;cursor:pointer;background:#0A1428;color:#fff;font:inherit;font-weight:600;' +
      'padding:12px 24px;border-radius:999px;transition:background .2s;}' +
      '#calon-cookie button:hover{background:#1d3a63;}' +
      '@media(max-width:520px){#calon-cookie{font-size:14.5px;gap:14px;padding:8px 8px 8px 18px;bottom:14px;width:calc(100% - 28px);justify-content:space-between;}}' +
      '@media(prefers-reduced-motion:reduce){#calon-cookie{transition:none;}}';
    document.head.appendChild(css);

    var bar = document.createElement('div');
    bar.id = 'calon-cookie';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Cookie notice');
    bar.innerHTML = '<p>This website uses <b>cookies</b>. <a href="' + legalHref() + '">Privacy Policy</a></p>' +
      '<button type="button">Accept</button>';
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
