// Generates crawlable static pages from the site's data files.
//   node tools/build-static.mjs
// Outputs (committed, no build step needed on deploy):
//   project/work/<slug>.html        one page per case study
//   project/privacy.html, terms.html, acceptable-use.html
//   project/sitemap.xml, project/llms.txt
import fs from 'fs';
import path from 'path';
import url from 'url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', 'project');
const SITE = 'https://calonaisolutions.com';
const TODAY = new Date().toISOString().slice(0, 10);

// The data files are browser ES modules with a .js extension; load them as ESM via a data: URL.
async function loadEsm(file) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  return import('data:text/javascript;base64,' + Buffer.from(src).toString('base64'));
}
const { STUDIES } = await loadEsm('case-studies-data.js');
const { DOCS, ORDER, META } = await loadEsm('legal-data.js');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (s) => String(s).replace(/\s*\u2014\s*/g, ': ');           // no em dashes in titles
const clip = (s, n) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)) + '…');
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

const ORG_REF = { '@id': SITE + '/#org' };

const NAV = [
  ['/#who-we-help', 'Who We Help'], ['/proof', 'Proof'], ['/about', 'About Us'], ['/contact', 'Contact'],
];
const SECTORS = [
  ['/fire-security', 'Fire &amp; Security'], ['/heating-plumbing', 'Heating &amp; Plumbing'],
  ['/facilities-management', 'Facilities Management'], ['/solar-renewables', 'Solar &amp; Renewables'],
  ['/construction', 'Construction'], ['/training-compliance', 'Training &amp; Compliance'],
];

const CSS = `
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:#0A1428;color:#fff;font-family:'Inter Tight','Inter',system-ui,-apple-system,'Segoe UI',sans-serif;letter-spacing:-0.012em;-webkit-font-smoothing:antialiased}
a{color:#7EC4F0}
.wrap{max-width:1100px;margin:0 auto;padding:0 24px}
.hdr{position:sticky;top:0;z-index:50;padding:14px 16px 0}
.pill{max-width:1240px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:10px 10px 10px 14px;border-radius:999px;background:rgba(20,30,54,.86);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(126,196,240,.14);box-shadow:0 18px 50px rgba(0,0,0,.35)}
.brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:#fff;font-size:22px;font-weight:500}
.brand span.m{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 35% 30%,#1d3a63,#0B1830 70%);border:1px solid rgba(126,196,240,.35)}
.brand b{color:#7EC4F0;font-weight:500}
.nav{display:flex;gap:28px}.nav a{color:rgba(240,246,252,.88);text-decoration:none;font-size:16px}.nav a:hover{color:#7EC4F0}
.cta{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(180deg,#9AD3F5,#7EC4F0 45%,#5AAEE2);color:#06101F;font-weight:600;padding:14px 24px;border-radius:999px;text-decoration:none}
@media(max-width:860px){.nav{display:none}.pill .cta{padding:12px 18px;font-size:14px}}
.crumbs{font-size:14px;color:rgba(226,236,247,.55);margin:56px 0 18px}.crumbs a{color:rgba(226,236,247,.75);text-decoration:none}.crumbs a:hover{color:#7EC4F0}
.eyebrow{font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:#7EC4F0;margin:0 0 14px}
h1{font-weight:500;font-size:clamp(34px,5vw,58px);line-height:1.06;letter-spacing:-.04em;margin:0}
h2{font-weight:600;font-size:clamp(24px,2.6vw,32px);letter-spacing:-.03em;margin:56px 0 16px}
.lede{font-size:clamp(18px,1.8vw,21px);line-height:1.55;color:rgba(226,236,247,.75);max-width:68ch;margin:22px 0 0}
p,li{font-size:17px;line-height:1.7;color:rgba(226,236,247,.78)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:40px 0 0}
.stat{border:1px solid rgba(126,196,240,.22);border-radius:22px;padding:24px;background:linear-gradient(165deg,rgba(126,196,240,.12),rgba(17,28,51,.9) 60%)}
.stat strong{display:block;font-size:clamp(26px,3vw,36px);font-weight:700;letter-spacing:-.04em}
.stat span{font-size:14px;color:rgba(226,236,247,.65)}
.meta{display:flex;flex-wrap:wrap;gap:10px;margin:26px 0 0}.meta span{font-size:13.5px;border:1px solid rgba(126,196,240,.25);border-radius:999px;padding:6px 14px;color:rgba(226,236,247,.85)}
ul.results{list-style:none;padding:0;margin:0;display:grid;gap:12px}ul.results li{padding-left:30px;position:relative}
ul.results li::before{content:'';position:absolute;left:4px;top:10px;width:12px;height:12px;border-radius:50%;background:#7EC4F0;box-shadow:0 0 10px rgba(126,196,240,.6)}
blockquote{margin:48px 0 0;padding:28px 32px;border-left:3px solid #7EC4F0;border-radius:0 20px 20px 0;background:rgba(126,196,240,.06)}
blockquote p{font-size:clamp(19px,2vw,23px);color:#fff;font-weight:500;line-height:1.45;margin:0}
blockquote cite{display:block;margin-top:14px;font-style:normal;color:#7EC4F0;font-size:15px}
.related{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.related a{display:block;border:1px solid rgba(126,196,240,.16);border-radius:20px;padding:22px;background:#111C33;text-decoration:none;color:#fff;transition:border-color .2s,transform .2s}
.related a:hover{border-color:rgba(126,196,240,.55);transform:translateY(-3px)}
.related small{display:block;color:#7EC4F0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px}
.band{margin:72px 0 0;padding:44px;border-radius:26px;text-align:center;background:radial-gradient(80% 120% at 50% 0%,rgba(126,196,240,.16),rgba(17,28,51,.9) 70%);border:1px solid rgba(126,196,240,.25)}
.band h2{margin:0 0 12px}
@media(max-width:760px){.stats,.related{grid-template-columns:1fr}.band{padding:30px 22px}}
.doc section{margin:0 0 34px}.doc h2{font-size:22px;margin:0 0 12px}
.ftr{margin-top:110px;border-top:1px solid rgba(126,196,240,.12);background:#08101F}
.ftr .cols{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:36px;padding:56px 24px 36px}
.ftr h3{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(226,236,247,.45);margin:0 0 14px;font-weight:500}
.ftr a{display:block;color:rgba(226,236,247,.72);text-decoration:none;font-size:15px;margin:0 0 10px}.ftr a:hover{color:#7EC4F0}
.ftr p,.ftr address{font-size:14px;line-height:1.6;color:rgba(226,236,247,.55);font-style:normal;margin:0 0 10px}
.ftr .legal{border-top:1px solid rgba(126,196,240,.1);padding:22px 24px;font-size:13px;color:rgba(226,236,247,.5)}
.ftr .legal a{display:inline;margin:0 14px 0 0;font-size:13px}
@media(max-width:760px){.ftr .cols{grid-template-columns:1fr}}
`;

function head({ title, description, canonical, type = 'website', jsonld = [], noindex = false }) {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">\n' : ''}<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Calon AI">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/assets/og-image.png">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@calon_ai">
<meta name="theme-color" content="#0A1428">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>${CSS.trim()}</style>
${jsonld.map(ld).join('\n')}
<script src="/cookie.js" defer></script>
</head>
<body>
<header class="hdr"><nav class="pill" aria-label="Main">
  <a class="brand" href="/" aria-label="Calon AI, home"><span class="m"><img src="/assets/calon-mark.png" alt="" width="30" height="30"></span>Calon <b>AI</b></a>
  <div class="nav">${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</div>
  <a class="cta" href="/contact">Start the conversation &rarr;</a>
</nav></header>
<main class="wrap">`;
}

const FOOT = `</main>
<footer class="ftr">
  <div class="wrap cols">
    <div>
      <a class="brand" href="/" style="margin-bottom:14px"><span class="m"><img src="/assets/calon-mark.png" alt="" width="30" height="30"></span>Calon <b>AI</b></a>
      <p>Calon AI is a Welsh operational AI and automation consultancy for founder-led service businesses across the UK.</p>
      <address>Ty Merlin, Caerphilly Business Park, Van Road, Caerphilly, Wales CF83 3GS<br>Lower Brecon Building, University of South Wales, Llantwit Road, Treforest, Pontypridd CF37 1DL</address>
      <p><a href="tel:+443301332508" style="display:inline">03301 332 508</a> &middot; <a href="mailto:contact@calonaisolutions.com" style="display:inline">contact@calonaisolutions.com</a></p>
    </div>
    <div><h3>Who we help</h3>${SECTORS.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</div>
    <div><h3>Company</h3><a href="/about">About us</a><a href="/proof">Case studies</a><a href="/ai-brain">The AI Brain</a><a href="/contact">Contact</a></div>
  </div>
  <div class="legal wrap">&copy; ${new Date().getFullYear()} Calon AI. Calon AI is the trading name of CALON AI SOLUTIONS LIMITED, registered in Wales, Company No. 15984397.
    <br><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a><a href="/acceptable-use">Acceptable Use</a></div>
</footer>
</body>
</html>
`;

const crumbsLd = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + href })),
});
const crumbsHtml = (items) => `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([n, h], i) =>
  i === items.length - 1 ? `<span aria-current="page">${esc(n)}</span>` : `<a href="${h}">${esc(n)}</a> / `).join('')}</nav>`;

// ---------- Case studies ----------
fs.mkdirSync(path.join(ROOT, 'work'), { recursive: true });
const sectorPage = (industry) => {
  const s = industry.toLowerCase();
  if (s.includes('training')) return '/training-compliance';
  if (s.includes('fire') || s.includes('security')) return '/fire-security';
  if (s.includes('heating')) return '/heating-plumbing';
  if (s.includes('renewable') || s.includes('solar')) return '/solar-renewables';
  if (s.includes('construction')) return '/construction';
  if (s.includes('facilit')) return '/facilities-management';
  return '/#who-we-help';
};

for (const st of STUDIES) {
  const href = `/work/${st.slug}`;
  const canonical = SITE + href;
  const titleText = plain(st.name);
  const title = clip(titleText.replace(/^UK /, ""), 48) + " | Calon AI";
  const description = clip(st.subtitle, 158);
  const related = [...STUDIES.filter(o => o.slug !== st.slug && o.industry === st.industry), ...STUDIES.filter(o => o.slug !== st.slug && o.industry !== st.industry)].slice(0, 3);
  const crumbs = [['Home', '/'], ['Case studies', '/proof'], [titleText, href]];
  const article = {
    '@context': 'https://schema.org', '@type': 'Article', headline: clip(titleText, 110), description,
    mainEntityOfPage: canonical, url: canonical, image: SITE + '/assets/og-image.png',
    author: ORG_REF, publisher: ORG_REF, inLanguage: 'en-GB',
    about: [{ '@type': 'Thing', name: st.industry }, { '@type': 'Thing', name: st.service }],
    articleSection: 'Case studies',
  };
  const html = head({ title, description, canonical, type: 'article', jsonld: [article, crumbsLd(crumbs)] }) + `
${crumbsHtml(crumbs)}
<article>
  <p class="eyebrow">Case study &middot; ${esc(st.industry)}</p>
  <h1>${esc(titleText)}</h1>
  <p class="lede">${esc(st.subtitle)}</p>
  <div class="meta"><span>Sector: <a href="${sectorPage(st.industry)}" style="color:inherit">${esc(st.industry)}</a></span><span>Service: ${esc(st.service)}</span><span>Client: ${esc(st.named ? st.client.split(/\s+\u2014\s+/)[0] : st.client)}</span></div>
  <div class="stats">${st.stats.map(x => `<div class="stat"><strong>${esc(x.n)}</strong><span>${esc(x.l)}</span></div>`).join('')}</div>
  <h2>Overview</h2>
  <p>${esc(st.overview)}</p>
  <h2>The operational problem</h2>
  ${st.challenge.map(p => `<p>${esc(p)}</p>`).join('\n  ')}
  <h2>What Calon AI built</h2>
  ${st.solution.map(p => `<p>${esc(p)}</p>`).join('\n  ')}
  <h2>Results</h2>
  <ul class="results">${st.results.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
  ${st.quote ? `<blockquote><p>&ldquo;${esc(st.quote)}&rdquo;</p><cite>${esc(st.qa)}</cite></blockquote>` : ''}
</article>
<section class="band">
  <h2>Want this kind of result in your business?</h2>
  <p>Book a 15-minute operational review. No deck, no pitch. If there is no fit, we will say so.</p>
  <p style="margin:22px 0 0"><a class="cta" href="/contact">Book your 15-minute call &rarr;</a></p>
</section>
<h2>More case studies</h2>
<div class="related">${related.map(r => `<a href="/work/${r.slug}"><small>${esc(r.industry)}</small>${esc(plain(r.name))}</a>`).join('')}</div>
<p style="margin-top:22px"><a href="/proof">See all case studies &rarr;</a></p>
` + FOOT;
  fs.writeFileSync(path.join(ROOT, 'work', `${st.slug}.html`), html);
}

// ---------- Proof page grid (static, crawlable) ----------
{
  const proofPath = path.join(ROOT, 'proof.html');
  const proof = fs.readFileSync(proofPath, 'utf8');
  const carTpl = (st, hidden) => { const href = `/work/${st.slug}`; return `          <a href="${href}" style="flex:none;width:400px;border:1px solid rgba(126,196,240,0.16);border-radius:18px;padding:32px;background:rgba(12,24,48,0.55);text-decoration:none;color:inherit;display:flex;flex-direction:column;transition:border-color .25s,transform .25s;" style-hover="border-color:#7EC4F0;transform:translateY(-3px);">
            <span style="font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#7EC4F0;margin-bottom:18px;">${esc(st.industry)}</span>
            <h3 style="font-family:'Inter Tight',sans-serif;font-weight:500;font-size:20px;line-height:1.28;margin:0 0 14px;color:#fff;">${esc(st.name)}</h3>
            <p style="font-size:14.5px;line-height:1.58;color:rgba(226,236,247,0.62);margin:0 0 22px;flex:1;">${esc(st.subtitle)}</p>
            <div style="display:flex;align-items:baseline;gap:10px;border-top:1px solid rgba(126,196,240,0.12);padding-top:18px;">
              <span style="font-family:'Inter Tight',sans-serif;font-weight:300;font-size:24px;color:#7EC4F0;letter-spacing:-0.01em;">${esc(st.stats[0].n)}</span>
              <span style="font-size:13px;color:rgba(226,236,247,0.55);line-height:1.4;">${esc(st.stats[0].l)}</span>
            </div>
            <span style="color:#7EC4F0;font-size:14px;font-weight:600;margin-top:18px;">Read full case study &rarr;</span>
          </a>
`.replace('<a href=', hidden ? '<a aria-hidden="true" tabindex="-1" href=' : '<a href='); };
  const car = [...STUDIES.map(st => carTpl(st, false)), ...STUDIES.map(st => carTpl(st, true))].join('');
  const cards = STUDIES.map(st => `        <a href="/work/${st.slug}" style="border:1px solid rgba(126,196,240,0.14);border-radius:16px;padding:30px;background:#0A1428;text-decoration:none;color:inherit;display:flex;flex-direction:column;transition:border-color .25s,transform .25s;" style-hover="border-color:#7EC4F0;transform:translateY(-3px);">
          <span style="font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#7EC4F0;margin-bottom:16px;">${esc(st.industry)}</span>
          <h3 style="font-family:'Inter Tight',sans-serif;font-weight:500;font-size:18px;line-height:1.3;margin:0 0 12px;color:#fff;">${esc(st.name)}</h3>
          <p style="font-size:14px;line-height:1.55;color:rgba(226,236,247,0.6);margin:0 0 20px;flex:1;">${esc(st.subtitle)}</p>
          <span style="color:#7EC4F0;font-size:13.5px;font-weight:600;">Read case study &rarr;</span>
        </a>`).join('\n');
  const proof2 = proof.replace(/<!-- STATIC:CAROUSEL:BEGIN -->[\s\S]*?<!-- STATIC:CAROUSEL:END -->/, `<!-- STATIC:CAROUSEL:BEGIN -->\n${car}        <!-- STATIC:CAROUSEL:END -->`);
  fs.writeFileSync(proofPath, proof2.replace(/<!-- STATIC:GRID:BEGIN -->[\s\S]*?<!-- STATIC:GRID:END -->/, `<!-- STATIC:GRID:BEGIN -->\n${cards}\n        <!-- STATIC:GRID:END -->`));
}

// ---------- Legal ----------
for (const key of ORDER) {
  const d = DOCS[key];
  const href = '/' + key;
  const canonical = SITE + href;
  const crumbs = [['Home', '/'], [d.title, href]];
  const html = head({ title: `${d.title} | Calon AI`, description: clip(d.summary, 158), canonical,
    jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage', name: d.title, url: canonical, description: d.summary, publisher: ORG_REF, inLanguage: 'en-GB' }, crumbsLd(crumbs)] }) + `
${crumbsHtml(crumbs)}
<p class="eyebrow">Legal</p>
<h1>${esc(d.title)}</h1>
<p class="lede">${esc(d.summary)}</p>
<p style="font-size:14px;color:rgba(226,236,247,.5)">Effective ${esc(META.EFFECTIVE)} &middot; ${esc(META.COMPANY)} &middot; Company No. ${esc(META.NUMBER)}</p>
<p style="font-size:15px">${ORDER.map(k => k === key ? `<strong>${esc(DOCS[k].label)}</strong>` : `<a href="/${k}">${esc(DOCS[k].label)}</a>`).join(' &middot; ')}</p>
<div class="doc" style="margin-top:40px">
${d.sections.map(s => `<section><h2>${esc(s.h)}</h2>${(s.p || []).map(p => `<p>${esc(p)}</p>`).join('')}${s.list && s.list.length ? `<ul>${s.list.map(li => `<li>${esc(li)}</li>`).join('')}</ul>` : ''}</section>`).join('\n')}
</div>
<section class="band"><h2>Questions about this document?</h2><p>Email <a href="mailto:${META.EMAIL}">${META.EMAIL}</a> and a real person will get back to you.</p></section>
` + FOOT;
  fs.writeFileSync(path.join(ROOT, `${key}.html`), html);
}

// ---------- Sitemap ----------
const pages = [
  ['/', '1.0'], ['/about', '0.8'], ['/proof', '0.8'], ['/contact', '0.8'], ['/ai-brain', '0.6'],
  ...SECTORS.map(([h]) => [h, '0.9']),
  ...STUDIES.map(s => [`/work/${s.slug}`, '0.7']),
  ...ORDER.map(k => [`/${k}`, '0.2']),
];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([h, p]) => `  <url><loc>${SITE}${h === '/' ? '/' : h}</loc><lastmod>${TODAY}</lastmod><priority>${p}</priority></url>`).join('\n')}
</urlset>
`);

// ---------- llms.txt ----------
fs.writeFileSync(path.join(ROOT, 'llms.txt'), `# Calon AI

> Calon AI (CALON AI SOLUTIONS LIMITED, Companies House 15984397) is a Welsh operational AI and automation consultancy for founder-led service businesses across the UK. We connect the tools a business already uses (CRM, Xero, job management, inboxes, spreadsheets), automate the admin around them and build AI agents and dashboards so founders can see margin, jobs and follow-ups in one place. Based in Caerphilly and Treforest (University of South Wales), Wales. Founder-led: clients work directly with the people who build the systems.

Contact: contact@calonaisolutions.com · 03301 332 508 · ${SITE}/contact

## Who we help
${SECTORS.map(([h, l]) => `- [${l.replace('&amp;', '&')}](${SITE}${h})`).join('\n')}

## Company
- [About Calon AI](${SITE}/about): founders, credentials (ICO registered, BNI member, £1M professional indemnity, public and cyber liability cover)
- [The AI Brain](${SITE}/ai-brain): one chat across CRM, Xero, ServiceM8, Google Ads, inbox and website
- [Contact](${SITE}/contact): book a 15-minute operational review

## Case studies
${STUDIES.map(s => `- [${plain(s.name)}](${SITE}/work/${s.slug}): ${s.subtitle}`).join('\n')}

## Legal
${ORDER.map(k => `- [${DOCS[k].title}](${SITE}/${k})`).join('\n')}
`);

console.log(`Built ${STUDIES.length} case studies, ${ORDER.length} legal pages, sitemap (${pages.length} URLs) and llms.txt`);
