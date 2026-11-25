// Shared site navigation for the generated (static) pages.
// The five industry pages, in menu order. Keep in sync with CalonHeader.dc.html / CalonFooter.dc.html
// (update those two files by hand if this list changes).
export const INDUSTRIES = [
  ['/fire-security', 'Fire &amp; Security'],
  ['/heating-plumbing', 'Heating, Plumbing &amp; Renewables'],
  ['/construction-training', 'Construction &amp; Training Providers'],
  ['/hospitality-food', 'Hospitality &amp; Food'],
  ['/salons-gyms-membership', 'Salons, Gyms &amp; Membership'],
];

export const NAV_HTML = `<div class="nav"><div class="dd"><a href="/#who-we-help" aria-haspopup="true">Industries <span class="dd-chev" aria-hidden="true"></span></a><div class="dd-menu">${INDUSTRIES.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</div></div><a href="/proof">Proof</a><a href="/about">About Us</a><a href="/contact">Contact</a></div>`;

export const NAV_CSS = `.dd{position:relative}.dd-chev{display:inline-block;margin-left:6px;border:solid currentColor;border-width:0 1.5px 1.5px 0;padding:2.5px;transform:rotate(45deg) translateY(-2px);opacity:.7}
.dd-menu{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:18px;opacity:0;visibility:hidden;transition:opacity .2s,visibility .2s;z-index:60}
.dd-menu::before{content:'';position:absolute;inset:18px 0 0;background:rgba(14,24,44,.97);border:1px solid rgba(126,196,240,.16);border-radius:18px;box-shadow:0 20px 50px rgba(0,0,0,.45);z-index:-1}
.dd-menu a{display:block;white-space:nowrap;padding:11px 18px;margin:0 6px;border-radius:12px;font-size:15px}.dd-menu a:first-child{margin-top:6px}.dd-menu a:last-child{margin-bottom:6px}.dd-menu a:hover{background:rgba(126,196,240,.1)}
.dd:hover .dd-menu,.dd:focus-within .dd-menu{opacity:1;visibility:visible}`;

export const FOOTER_INDUSTRIES = INDUSTRIES.map(([h, l]) => `<a href="${h}">${l}</a>`).join('');
