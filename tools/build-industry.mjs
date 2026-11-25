// Industry pages: static, crawlable pages built from content/industries/<slug>.json + shared.json.
//   node tools/build-industry.mjs            preview build: bracketed copy shows as yellow placeholders
//   node tools/build-industry.mjs --publish  final build: bracketed copy is left out (never published)
//
// Every page has the same eight sections in the same order:
//   1 Hero · 2 What you get · 3 Case study · 4 What owners are up against · 5 Why the usual fix doesn't work
//   6 How it works · 7 Questions (FAQ schema) · 8 Book a review
// with the "Book a free 15-minute review" button repeated after sections 2, 4 and 6.
import fs from 'fs';
import path from 'path';
import url from 'url';
import { NAV_HTML, NAV_CSS, MOBILE_NAV_HTML, MOBILE_NAV_CSS, FOOTER_HTML } from './site-nav.mjs';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const SRC = path.join(REPO, 'content', 'industries');
const OUT = path.join(REPO, 'project');
const SITE = 'https://calonaisolutions.com';
const PUBLISH = process.argv.includes('--publish');
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const SHARED = JSON.parse(fs.readFileSync(path.join(SRC, 'shared.json'), 'utf8'));

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const isPh = (s) => typeof s === 'string' && /\[[^\]]+\]/.test(s);
const missing = [];
// Text that may contain [bracketed] placeholders. Preview: highlighted. Publish: element left out.
function t(s, ctx) {
  if (s == null || s === '') return '';
  if (!isPh(s)) return esc(s);
  missing.push(`${ctx}: ${s}`);
  return PUBLISH ? '' : esc(s).replace(/\[([^\]]+)\]/g, '<mark class="ph">[$1]</mark>');
}
const ok = (s) => s && (!PUBLISH || !isPh(s));
// A bracketed note on otherwise final copy ("[Confirm this figure with Volt.]"): preview only, never published.
const note = (n, ctx) => (n ? (missing.push(`${ctx}: ${n}`), PUBLISH ? '' : ` <mark class="ph">${esc(n)}</mark>`) : '');
const waLink = (msg) => `https://wa.me/${SHARED.whatsappNumber}?text=` + encodeURIComponent(msg).replace(/'/g, '%27');

const ICON = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
};

const CSS = fs.readFileSync(path.join(REPO, 'tools', 'industry.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '\n').trim();
const JS = fs.readFileSync(path.join(REPO, 'tools', 'industry.js'), 'utf8');

function bookBtn(where, variant = 'primary') {
  return `<a class="btn btn-${variant}" href="#book" data-track="cta" data-cta="${where}">${esc(SHARED.bookButton)} ${ICON.arrow}</a>`;
}
const ctaRow = (where) => `<div class="cta-row fu">${bookBtn(where)}</div>`;

function build(page) {
  missing.length = 0;
  const H = { ...SHARED.sectionHeadings, ...(page.sectionHeadings || {}) };
  const href = `/${page.slug}`;
  const canonical = SITE + href;
  const wa = waLink(page.whatsappMessage);
  const title = ok(page.title) ? page.title : `${page.name.replace(/&amp;/g, '&')} | Calon AI`;
  const description = ok(page.description) ? page.description : '';
  if (isPh(page.title)) missing.push(`title: ${page.title}`);
  if (isPh(page.description)) missing.push(`description: ${page.description}`);

  // 1. Hero
  const photo = page.hero.photo;
  const photoHtml = photo && ok(photo.src)
    ? (isPh(photo.src) ? `<div class="hero-photo ph-box"><mark class="ph">${esc(photo.src)}</mark></div>`
      : `<figure class="hero-photo"><img src="${esc(photo.src)}" alt="${esc(photo.alt)}" width="${photo.w || 960}" height="${photo.h || 720}" fetchpriority="high" decoding="async"></figure>`)
    : '';
  if (photo && isPh(photo.src)) missing.push(`hero photo: ${photo.src}`);
  const hero = `<section class="hero" aria-labelledby="h1">
  <div class="wrap hero-grid${photoHtml ? '' : ' no-photo'}">
    <div class="hero-copy">
      <p class="label">${t(page.hero.label, 'hero label')}</p>
      <h1 id="h1">${t(page.hero.headline, 'hero headline')}</h1>
      <p class="sub">${t(page.hero.subhead, 'hero subhead')}</p>
      <div class="hero-ctas">${bookBtn('hero')}<a class="btn btn-wa" href="${wa}" target="_blank" rel="noopener" data-wa="hero">${ICON.wa}WhatsApp us</a></div>
      <p class="hero-phone">Or call <a href="tel:${SHARED.phone.tel}">${esc(SHARED.phone.display)}</a></p>
    </div>
    ${photoHtml}
  </div>
</section>`;

  // 2. What you get
  const results = `<section class="sec" aria-labelledby="s2"><div class="wrap">
  <h2 id="s2" class="fu">${esc(H.results)}</h2>
  <div class="tiles t${page.results.filter((r) => ok(r.title) || ok(r.text)).length}">${page.results.filter((r) => ok(r.title) || ok(r.text)).map((r) => `<div class="card tile fu"><p class="tile-h">${t(r.title, 'result')}</p>${r.text ? `<p>${t(r.text, 'result detail')}${note(r.note, 'result note')}</p>` : ''}</div>`).join('')}</div>
  ${ctaRow('after-results')}
</div></section>`;

  // 3. Case study (space reserved; Alom supplies the content)
  const cs = page.caseStudy;
  let caseHtml = '';
  if (cs) {
    const media = cs.media?.type === 'video'
      ? `<video controls preload="none" poster="${esc(cs.media.poster || '')}" aria-label="${esc(cs.media.alt)}"><source src="${esc(cs.media.src)}" type="video/mp4"></video>`
      : cs.media?.src ? `<img src="${esc(cs.media.src)}" alt="${esc(cs.media.alt)}" width="960" height="720" loading="lazy" decoding="async">` : '';
    caseHtml = `<section class="sec sec-grey" aria-labelledby="s3"><div class="wrap">
  <h2 id="s3" class="fu">${esc(H.caseStudy)}</h2>
  <div class="card case fu"><div class="case-media">${media}</div><div class="case-body">
    ${cs.client ? `<p class="case-client">${t(cs.client, 'case client')}</p>` : ''}
    <h3>The problem</h3><p>${t(cs.problem, 'case problem')}</p>
    <h3>What changed</h3><p>${t(cs.changed, 'case changed')}</p>
    <h3>The result</h3><p class="case-result">${t(cs.result, 'case result')}</p>
    ${cs.link ? `<p><a class="link" href="${esc(cs.link)}">Read the full story ${ICON.arrow}</a></p>` : ''}
  </div></div>
</div></section>`;
  } else if (!PUBLISH) {
    missing.push('case study: Alom to supply');
    caseHtml = `<section class="sec sec-grey" aria-labelledby="s3"><div class="wrap">
  <h2 id="s3" class="fu">${esc(H.caseStudy)}</h2>
  <div class="card case case-empty fu"><div class="case-media ph-box"><mark class="ph">[Client photo or video: Alom to supply]</mark></div><div class="case-body">
    <p class="case-client"><mark class="ph">[Client name]</mark></p>
    <h3>The problem</h3><p><mark class="ph">[The problem]</mark></p>
    <h3>What changed</h3><p><mark class="ph">[What changed]</mark></p>
    <h3>The result</h3><p class="case-result"><mark class="ph">[The result]</mark></p>
    <p><span class="link"><mark class="ph">[Link to the full story]</mark></span></p>
  </div></div>
</div></section>`;
  }

  // 4. What owners are up against
  const problems = `<section class="sec" aria-labelledby="s4"><div class="wrap">
  <h2 id="s4" class="fu">${esc(H.problems)}</h2>
  <div class="tiles t${page.problems.filter((p) => ok(p.text)).length}">${page.problems.filter((p) => ok(p.text)).map((p) => `<div class="card prob fu">${ok(p.figure) ? `<p class="fig">${t(p.figure, 'problem figure')}</p>` : ''}${p.title ? `<p class="tile-h">${t(p.title, 'problem title')}</p>` : ''}<p>${t(p.text, 'problem')}</p>${p.source && ok(p.source.url) ? (isPh(p.source.url) ? `<p class="src"><mark class="ph">${esc(p.source.url)}</mark></p>` : `<p class="src"><a href="${esc(p.source.url)}" rel="noopener" target="_blank">${esc(p.source.label || 'Source')}</a></p>`) : ''}</div>`).join('')}</div>
  ${ctaRow('after-problems')}
</div></section>`;
  page.problems.forEach((p) => p.source && isPh(p.source.url) && missing.push(`problem source: ${p.source.url}`));

  // 5. Why the usual fix doesn't work
  const usual = `<section class="sec sec-grey" aria-labelledby="s5"><div class="wrap narrow">
  <h2 id="s5" class="fu">${esc(H.usualFix)}</h2>
  ${page.usualFix.filter(ok).map((p) => `<p class="lead fu">${t(p, 'usual fix')}</p>`).join('')}
</div></section>`;

  // 6. How it works (shared)
  const how = `<section class="sec" aria-labelledby="s6"><div class="wrap">
  <h2 id="s6" class="fu">${esc(H.howItWorks)}</h2>
  <ol class="steps">${SHARED.howItWorks.map((s, i) => `<li class="card step fu"><span class="n" aria-hidden="true">${i + 1}</span><p class="step-h">${esc(s.title)}</p><p>${esc(s.text)}</p></li>`).join('')}</ol>
  ${ctaRow('after-how')}
</div></section>`;

  // 7. Questions (FAQ schema)
  const faqs = page.faqs.filter((f) => ok(f.q) && ok(f.a));
  const faqHtml = `<section class="sec sec-grey" aria-labelledby="s7"><div class="wrap narrow">
  <h2 id="s7" class="fu">${esc(H.faqs)}</h2>
  <div class="faqs">${faqs.map((f) => `<details class="card faq fu"><summary>${t(f.q, 'faq question')}</summary><p>${t(f.a, 'faq answer')}${note(f.note, 'faq note')}</p></details>`).join('')}</div>
</div></section>`;

  // 8. Book a review
  const cal = SHARED.bookingCalendarUrl;
  const calHtml = cal && !isPh(cal)
    ? `<div class="cal"><iframe src="${esc(cal)}" title="Book a free 15-minute review" loading="lazy"></iframe></div>`
    : PUBLISH ? `<div class="cal cal-fallback"><a class="btn btn-primary" href="/contact">${ICON.cal}${esc(SHARED.bookButton)}</a></div>`
      : `<div class="cal ph-box"><mark class="ph">${esc(cal || '[Booking calendar]')}</mark></div>`;
  if (isPh(cal)) missing.push(`booking calendar: ${cal}`);
  const book = `<section class="book" id="book" aria-labelledby="s8"><div class="wrap book-grid">
  <div class="book-copy">
    <h2 id="s8">${t(page.book.headline, 'booking headline')}</h2>
    <p class="sub">${esc(SHARED.bookSubtext)}</p>
    <p class="book-phone"><a href="tel:${SHARED.phone.tel}">${ICON.phone}${esc(SHARED.phone.display)}</a></p>
    <p><a class="btn btn-wa" href="${wa}" target="_blank" rel="noopener" data-wa="booking">${ICON.wa}WhatsApp us</a></p>
  </div>
  ${calHtml}
</div></section>`;

  const mbar = `<nav class="mbar" aria-label="Contact Calon AI">
  <a href="tel:${SHARED.phone.tel}" data-track="cta" data-cta="mbar-call">${ICON.phone}Call</a>
  <a href="${wa}" target="_blank" rel="noopener" data-wa="mobile-bar">${ICON.wa}WhatsApp</a>
  <a href="#book" class="mbar-book" data-track="cta" data-cta="mbar-book">${ICON.cal}Book</a>
</nav>`;

  const crumbs = [['Home', '/'], [page.name, href]];
  const jsonld = [
    { '@type': ['Organization', 'ProfessionalService'], '@id': SITE + '/#org', name: 'Calon AI', url: SITE + '/', telephone: '+44 3301 332508', logo: SITE + '/assets/logo-square.png' },
    { '@type': 'WebPage', '@id': canonical, url: canonical, name: title, ...(description ? { description } : {}), inLanguage: 'en-GB', about: page.name.replace(/&amp;/g, '&'), publisher: { '@id': SITE + '/#org' } },
    { '@type': 'BreadcrumbList', itemListElement: crumbs.map(([n, h], i) => ({ '@type': 'ListItem', position: i + 1, name: n.replace(/&amp;/g, '&'), item: SITE + h })) },
  ];
  const realFaqs = faqs.filter((f) => !isPh(f.q) && !isPh(f.a));
  if (realFaqs.length) jsonld.push({ '@type': 'FAQPage', mainEntity: realFaqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });

  const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
${description ? `<meta name="description" content="${esc(description)}">\n` : ''}<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Calon AI">
<meta property="og:title" content="${esc(title)}">
${description ? `<meta property="og:description" content="${esc(description)}">\n` : ''}<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/assets/og-image.png">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0A1428">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>${CSS}
${NAV_CSS}
${MOBILE_NAV_CSS}</style>
${ld({ '@context': 'https://schema.org', '@graph': jsonld })}
<script>document.documentElement.classList.add('js')</script>
<script src="/cookie.js" defer></script>
<script src="/whatsapp.js" defer></script>
</head>
<body class="has-mbar">
<a class="skip" href="#main">Skip to content</a>
<header class="hdr"><nav class="pill" aria-label="Main">
  <a class="brand" href="/" aria-label="Calon AI, home"><span class="m"><img src="/assets/calon-mark.png" alt="" width="30" height="30"></span>Calon <b>AI</b></a>
  ${NAV_HTML}
  <a class="cta" href="#book" data-track="cta" data-cta="header">${esc(SHARED.bookButton)}</a>
  ${MOBILE_NAV_HTML}
</nav></header>
<main id="main" data-industry="${page.slug}">
${hero}
${results}
${caseHtml}
${problems}
${usual}
${how}
${faqHtml}
${book}
</main>
${FOOTER_HTML}
${mbar}
<script>${JS}</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, `${page.slug}.html`), html);
  return [...new Set(missing)];
}

const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.json') && f !== 'shared.json' && (!only.length || only.includes(f.replace('.json', ''))));
for (const f of files) {
  const page = JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
  const gaps = build(page);
  console.log(`${PUBLISH ? 'Published' : 'Preview'} /${page.slug}: ${gaps.length ? `${gaps.length} placeholders ${PUBLISH ? 'left out' : 'shown'}` : 'complete'}`);
  if (gaps.length && process.argv.includes('--list')) gaps.forEach((g) => console.log('   -', g));
}
