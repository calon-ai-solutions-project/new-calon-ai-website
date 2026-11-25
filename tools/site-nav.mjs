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

// Mobile menu (no JavaScript needed): a <details> toggle shown below 860px.
export const MOBILE_NAV_HTML = `<details class="mnav"><summary aria-label="Menu"><span></span><span></span><span></span></summary><div class="mnav-panel"><p>Industries</p>${INDUSTRIES.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}<p>More</p><a href="/proof">Proof</a><a href="/about">About Us</a><a href="/resources">Resources</a><a href="/contact">Contact</a></div></details>`;

export const MOBILE_NAV_CSS = `.mnav{display:none}
@media(max-width:860px){.mnav{display:block}
.mnav summary{list-style:none;cursor:pointer;width:46px;height:46px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;border:1px solid rgba(126,196,240,.3)}
.mnav summary::-webkit-details-marker{display:none}
.mnav summary span{display:block;width:18px;height:2px;border-radius:2px;background:#fff}
.mnav-panel{position:absolute;left:16px;right:16px;top:calc(100% + 10px);padding:14px;border-radius:22px;background:rgba(14,24,44,.98);border:1px solid rgba(126,196,240,.16);box-shadow:0 24px 60px rgba(0,0,0,.5);z-index:70;max-height:calc(100vh - 120px);overflow:auto}
.mnav-panel p{margin:10px 8px 4px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(226,236,247,.6)}
.mnav-panel a{display:block;padding:13px 8px;font-size:16px;color:#fff;text-decoration:none;border-bottom:1px solid rgba(126,196,240,.08)}}`;

export const FOOTER_HTML = `<footer class="ftr">
  <div class="wrap cols">
    <div>
      <a class="brand" href="/" style="margin-bottom:14px"><span class="m"><img src="/assets/calon-mark.png" alt="" width="30" height="30"></span>Calon <b>AI</b></a>
      <p>Calon AI is a Welsh operational AI and automation consultancy for founder-led service businesses across the UK.</p>
      <address>Ty Merlin, Caerphilly Business Park, Van Road, Caerphilly, Wales CF83 3GS<br>Lower Brecon Building, University of South Wales, Llantwit Road, Treforest, Pontypridd CF37 1DL</address>
      <p><a href="tel:+443301332508" style="display:inline">03301 332 508</a> &middot; <!--email_off--><a href="mailto:contact@calonaisolutions.com" style="display:inline">contact@calonaisolutions.com</a><!--/email_off--></p>
    </div>
    <div><h2>Industries</h2>${FOOTER_INDUSTRIES}</div>
    <div><h2>Company</h2><a href="/about">About us</a><a href="/proof">Case studies</a><a href="/ai-brain">The AI Brain</a><a href="/resources">Resources</a><a href="/contact">Contact</a></div>
  </div>
  <div class="legal wrap">&copy; ${new Date().getFullYear()} Calon AI. Calon AI is the trading name of CALON AI SOLUTIONS LIMITED, registered in Wales, Company No. 15984397.
    <br><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a><a href="/acceptable-use">Acceptable Use</a></div>
</footer>`;
