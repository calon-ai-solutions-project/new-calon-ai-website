// Calon AI Resources hub: static, crawlable pages built from Markdown.
//   node tools/build-resources.mjs
//
// Reads   content/resources/site.json, categories.json, authors.json, articles/*.md
// Writes  project/resources.html                       (/resources hub)
//         project/resources/<slug>.html                (/resources/<slug> articles)
//         project/resources/category/<slug>.html       (/resources/category/<slug>, + /page/N when long)
//         project/resources/search-index.json          (internal site search)
//         project/resources/feed.xml                   (RSS)
//         project/sitemap-resources.xml                (listed in robots.txt)
//         the "Resources" block in project/llms.txt
//
// No dependencies. Drafts (draft: true) and future-dated articles are skipped, so
// scheduling works by setting a future date and rebuilding on or after that day.
import fs from 'fs';
import path from 'path';
import url from 'url';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const SRC = path.join(REPO, 'content', 'resources');
const OUT = path.join(REPO, 'project');
const SITE = 'https://calonaisolutions.com';
const TODAY = process.env.RESOURCES_TODAY || new Date().toISOString().slice(0, 10);
const PAGE_SIZE = 24;

const readJson = (f) => JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
const CONFIG = readJson('site.json');
const CATS = readJson('categories.json');
const AUTHORS = readJson('authors.json');
const catBySlug = new Map(CATS.map((c) => [c.slug, c]));

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const fmtDate = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const fmtShort = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const slugify = (s) => String(s).toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------------------------------------------------------------- front matter
function parseFrontMatter(src, file) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing front matter`);
  const data = {};
  const lines = m[1].split('\n');
  const scalar = (v) => {
    v = v.trim();
    if (v === 'true') return true;
    if (v === 'false') return false;
    if (/^\[.*\]$/.test(v)) return v.slice(1, -1).split(',').map((x) => scalar(x)).filter((x) => x !== '');
    if (/^".*"$/.test(v) || /^'.*'$/.test(v)) return v.slice(1, -1);
    return v;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const km = line.match(/^([A-Za-z][\w]*):\s*(.*)$/);
    if (!km) throw new Error(`${file}: cannot parse front matter line "${line}"`);
    const [, key, rest] = km;
    if (rest !== '') { data[key] = scalar(rest); continue; }
    // block list: "  - item" or "  - q: ..." objects
    const items = [];
    while (i + 1 < lines.length && /^\s+-\s/.test(lines[i + 1])) {
      i++;
      const first = lines[i].replace(/^\s+-\s/, '');
      const om = first.match(/^([a-z]\w*):\s(.*)$/); // object items use lower-case keys (q:, a:)
      if (om && !/^https?:/.test(first)) {
        const obj = { [om[1]]: scalar(om[2]) };
        while (i + 1 < lines.length && /^\s{4,}[A-Za-z]\w*:\s/.test(lines[i + 1])) {
          i++;
          const pm = lines[i].trim().match(/^([A-Za-z]\w*):\s(.*)$/);
          obj[pm[1]] = scalar(pm[2]);
        }
        items.push(obj);
      } else items.push(scalar(first));
    }
    data[key] = items;
  }
  return { data, body: m[2] };
}

// ---------------------------------------------------------------- markdown
// A small, strict Markdown subset: headings, paragraphs, lists (one level of nesting),
// ordered lists, fenced code, blockquotes / callouts, tables, images, hr, inline styles.
function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, src) => `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, href) => {
    const ext = /^https?:\/\//.test(href) && !href.startsWith(SITE);
    return `<a href="${href}"${ext ? ' rel="noopener" target="_blank"' : ''}>${text}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
  return s;
}

function markdown(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const out = [];
  const toc = [];
  const usedIds = new Set();
  const idFor = (text) => {
    let id = slugify(text) || 'section';
    let n = 2; const base = id;
    while (usedIds.has(id)) id = `${base}-${n++}`;
    usedIds.add(id);
    return id;
  };
  let i = 0;
  const isBlockStart = (l) => /^(#{2,4}\s|```|>\s?|\s*[-*]\s|\s*\d+\.\s|\|.*\||---\s*$|!\[)/.test(l);
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = line.match(/^(#{2,4})\s+(.*)$/))) {
      const level = m[1].length;
      const text = m[2].trim();
      const id = idFor(text);
      if (level <= 3) toc.push({ level, text: inline(text).replace(/<[^>]+>/g, ''), id });
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      i++; continue;
    }
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
      i++;
      out.push(`<pre${lang ? ` data-lang="${esc(lang)}"` : ''}><code>${esc(code.join('\n'))}</code></pre>`);
      continue;
    }
    if (/^---\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
    if (/^>\s?/.test(line)) {
      const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ''));
      const inner = markdown(q.join('\n')).html;
      const cm = q[0].match(/^\*\*(Note|Tip|Warning|Important|In short|Quick answer)[:.]?\*\*/i);
      out.push(cm ? `<aside class="callout callout-${slugify(cm[1])}">${inner}</aside>` : `<blockquote>${inner}</blockquote>`);
      continue;
    }
    if (/^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const headCells = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) rows.push(cells(lines[i++]));
      out.push(`<div class="table"><table><thead><tr>${headCells.map((c) => `<th scope="col">${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, j) => j === 0 ? `<th scope="row">${inline(c)}</th>` : `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s/.test(line)) {
      const ordered = /^\s*\d+\.\s/.test(line);
      const items = [];
      while (i < lines.length && (/^\s*([-*]|\d+\.)\s/.test(lines[i]) || (lines[i].trim() && /^\s{2,}/.test(lines[i])))) {
        const l = lines[i];
        if (/^\s{2,}([-*]|\d+\.)\s/.test(l) && items.length) {
          (items[items.length - 1].sub ||= { ordered: /^\s*\d+\.\s/.test(l), items: [] }).items.push(l.replace(/^\s*([-*]|\d+\.)\s/, ''));
        } else if (/^\s{2,}\S/.test(l) && items.length && !/^\s*([-*]|\d+\.)\s/.test(l)) {
          items[items.length - 1].text += ' ' + l.trim();
        } else items.push({ text: l.replace(/^\s*([-*]|\d+\.)\s/, '') });
        i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((it) => `<li>${inline(it.text)}${it.sub ? `<${it.sub.ordered ? 'ol' : 'ul'}>${it.sub.items.map((s) => `<li>${inline(s)}</li>`).join('')}</${it.sub.ordered ? 'ol' : 'ul'}>` : ''}</li>`).join('')}</${tag}>`);
      continue;
    }
    if ((m = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/))) {
      const cap = lines[i + 1] && /^\*[^*].*\*\s*$/.test(lines[i + 1]) ? lines[++i].trim().slice(1, -1) : '';
      out.push(`<figure><img src="${m[2]}" alt="${esc(m[1])}" loading="lazy" decoding="async">${cap ? `<figcaption>${inline(cap)}</figcaption>` : ''}</figure>`);
      i++; continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) para.push(lines[i++].trim());
    if (!para.length) { para.push(lines[i++].trim()); }
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return { html: out.join('\n'), toc };
}

const plainText = (md) => md
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/[#>*`|_-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// ---------------------------------------------------------------- load articles
const REQUIRED = ['title', 'description', 'category', 'date', 'author', 'coverAlt'];
const all = fs.readdirSync(path.join(SRC, 'articles')).filter((f) => f.endsWith('.md')).sort().map((f) => {
  const { data, body } = parseFrontMatter(fs.readFileSync(path.join(SRC, 'articles', f), 'utf8'), f);
  for (const k of REQUIRED) if (!data[k]) throw new Error(`${f}: missing "${k}"`);
  if (!catBySlug.has(data.category)) throw new Error(`${f}: unknown category "${data.category}"`);
  if (!AUTHORS[data.author]) throw new Error(`${f}: unknown author "${data.author}"`);
  if (data.description.length > 165) console.warn(`! ${f}: description is ${data.description.length} chars (aim for <= 160)`);
  const slug = data.slug || f.replace(/\.md$/, '');
  const text = plainText(body);
  const words = text.split(' ').length;
  const { html, toc } = markdown(body);
  return {
    ...data, slug, body, html, toc, text, words,
    tags: data.tags || [],
    updated: data.updated || data.date,
    readMins: Math.max(1, Math.round(words / 220)),
    cover: data.cover || slug,
    href: `/resources/${slug}`,
    cat: catBySlug.get(data.category),
  };
});
const published = all
  .filter((a) => a.draft !== true && a.date <= TODAY)
  .sort((a, b) => (b.date + b.updated).localeCompare(a.date + a.updated) || a.title.localeCompare(b.title));
const skipped = all.length - published.length;
const bySlug = new Map(published.map((a) => [a.slug, a]));
for (const a of published) {
  for (const r of a.related || []) if (!bySlug.has(r)) console.warn(`! ${a.slug}: related "${r}" is not published`);
}
const activeCats = CATS.filter((c) => published.some((a) => a.category === c.slug));

// ---------------------------------------------------------------- shared layout
const NAV = [['/#who-we-help', 'Who We Help'], ['/proof', 'Proof'], ['/about', 'About Us'], ['/contact', 'Contact']];
const SECTORS = [
  ['/fire-security', 'Fire &amp; Security'], ['/heating-plumbing', 'Heating &amp; Plumbing'],
  ['/facilities-management', 'Facilities Management'], ['/solar-renewables', 'Solar &amp; Renewables'],
  ['/construction', 'Construction'], ['/training-compliance', 'Training &amp; Compliance'],
];
const ORG = {
  '@type': ['Organization', 'ProfessionalService'], '@id': SITE + '/#org', name: 'Calon AI', legalName: 'CALON AI SOLUTIONS LIMITED',
  url: SITE + '/', logo: { '@type': 'ImageObject', url: SITE + '/assets/logo-square.png', width: 512, height: 512 },
};
const WEBSITE = {
  '@type': 'WebSite', '@id': SITE + '/#website', url: SITE + '/', name: 'Calon AI', publisher: { '@id': SITE + '/#org' }, inLanguage: 'en-GB',
  potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: SITE + '/resources?q={search_term_string}' }, 'query-input': 'required name=search_term_string' },
};
const crumbsLd = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name: name.replace(/&amp;/g, '&'), item: SITE + href })),
});
const crumbsHtml = (items) => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map(([n, h], i) =>
  i === items.length - 1 ? `<li><span aria-current="page">${n}</span></li>` : `<li><a href="${h}">${n}</a></li>`).join('')}</ol></nav>`;

const ICON = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
};

function analyticsHead() {
  // Off until IDs are added to content/resources/site.json. Consent Mode defaults to denied so
  // nothing is stored until a real consent choice exists (see tools/RESOURCES.md).
  const a = CONFIG.analytics || {};
  let s = '';
  if (a.googleSiteVerification) s += `<meta name="google-site-verification" content="${esc(a.googleSiteVerification)}">\n`;
  if (!a.gtmId && !a.ga4Id) return s;
  s += `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});</script>\n`;
  if (a.gtmId) s += `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${esc(a.gtmId)}');</script>\n`;
  else s += `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(a.ga4Id)}"></script><script>gtag('js',new Date());gtag('config','${esc(a.ga4Id)}');</script>\n`;
  return s;
}

const CSS = fs.readFileSync(path.join(REPO, 'tools', 'resources.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '\n').trim();
const JS = fs.readFileSync(path.join(REPO, 'tools', 'resources.js'), 'utf8');

function page({ title, description, canonical, ogImage, ogType = 'website', jsonld = [], body, preload, extraHead = '', robots }) {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${robots || 'index, follow, max-image-preview:large, max-snippet:-1'}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="Calon AI">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage || SITE + '/assets/og-image.png'}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@calon_ai">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage || SITE + '/assets/og-image.png'}">
<meta name="theme-color" content="#0A1428">
<link rel="alternate" type="application/rss+xml" title="Calon AI Resources" href="${SITE}/resources/feed.xml">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
${preload ? `<link rel="preload" as="image" href="${preload}" fetchpriority="high">\n` : ''}<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
${analyticsHead()}${extraHead}${ld({ '@context': 'https://schema.org', '@graph': jsonld })}
<script src="/cookie.js" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="hdr"><nav class="pill" aria-label="Main">
  <a class="brand" href="/" aria-label="Calon AI, home"><span class="m"><img src="/assets/calon-mark.png" alt="" width="30" height="30"></span>Calon <b>AI</b></a>
  <div class="nav">${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</div>
  <a class="cta" href="/contact" data-track="cta" data-cta="header">Start the conversation ${ICON.arrow}</a>
</nav></header>
<main id="main">
${body}
</main>
<footer class="ftr">
  <div class="wrap cols">
    <div>
      <a class="brand" href="/" style="margin-bottom:14px"><span class="m"><img src="/assets/calon-mark.png" alt="" width="30" height="30"></span>Calon <b>AI</b></a>
      <p>Calon AI is a Welsh operational AI and automation consultancy for founder-led service businesses across the UK.</p>
      <address>Ty Merlin, Caerphilly Business Park, Van Road, Caerphilly, Wales CF83 3GS<br>Lower Brecon Building, University of South Wales, Llantwit Road, Treforest, Pontypridd CF37 1DL</address>
      <p><a href="tel:+443301332508" style="display:inline">03301 332 508</a> &middot; <!--email_off--><a href="mailto:contact@calonaisolutions.com" style="display:inline">contact@calonaisolutions.com</a><!--/email_off--></p>
    </div>
    <div><h2>Who we help</h2>${SECTORS.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</div>
    <div><h2>Company</h2><a href="/about">About us</a><a href="/proof">Case studies</a><a href="/ai-brain">The AI Brain</a><a href="/resources">Resources</a><a href="/contact">Contact</a></div>
  </div>
  <div class="legal wrap">&copy; ${TODAY.slice(0, 4)} Calon AI. Calon AI is the trading name of CALON AI SOLUTIONS LIMITED, registered in Wales, Company No. 15984397.
    <br><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a><a href="/acceptable-use">Acceptable Use</a></div>
</footer>
<script>${JS}</script>
</body>
</html>
`;
}

// ---------------------------------------------------------------- components
const img = (a, size) => `/resources/img/${a.cover}${size === 'sm' ? '-sm' : ''}.webp`;
const imgW = (size) => (size === 'sm' ? 640 : 1200);
const imgH = (size) => (size === 'sm' ? 336 : 630);
const catChip = (c) => `<a class="chip chip-${c.slug}" href="/resources/category/${c.slug}">${esc(c.short || c.name)}</a>`;
const metaLine = (a) => `<span class="when"><time datetime="${a.date}">${fmtShort(a.date)}</time><span aria-hidden="true"> &middot; </span><span class="mins">${ICON.clock}${a.readMins} min read</span></span>`;

function card(a, { size = 'md', eager = false, heading = 'h3' } = {}) {
  return `<article class="card card-${size}" data-cat="${a.category}">
  <a class="card-img" href="${a.href}" tabindex="-1" aria-hidden="true"><img src="${img(a, size === 'lg' ? 'lg' : 'sm')}" alt="" width="${imgW(size === 'lg' ? 'lg' : 'sm')}" height="${imgH(size === 'lg' ? 'lg' : 'sm')}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></a>
  <div class="card-body">
    <p class="card-meta">${catChip(a.cat)}</p>
    <${heading} class="card-title"><a href="${a.href}">${esc(a.title)}</a></${heading}>
    <p class="card-desc">${esc(a.description)}</p>
    <p class="card-foot">${metaLine(a)}</p>
  </div>
</article>`;
}

function ctaBand(kind = 'default') {
  const v = {
    default: ['Want this working in your business, not just on paper?', 'Calon AI builds automations, AI agents and dashboards around the tools you already use. Book a 15-minute call and we will tell you honestly whether it is worth doing.', [['/contact', 'Request an AI consultation', 'primary'], ['/ai-brain', 'Explore our AI solutions', 'ghost']]],
    automation: ['Rather have someone build it for you?', 'We design and run automations across CRMs, job management, Xero, inboxes and spreadsheets for founder-led UK businesses. Start with a 15-minute call.', [['/contact', 'Discover business automation', 'primary'], ['/proof', 'See case studies', 'ghost']]],
  }[kind] || [];
  return `<section class="band" aria-labelledby="band-${kind}"><div>
  <p class="eyebrow">Calon AI</p>
  <h2 id="band-${kind}">${v[0]}</h2>
  <p>${v[1]}</p>
  <p class="band-actions">${v[2].map(([h, l, s]) => `<a class="btn btn-${s}" href="${h}" data-track="cta" data-cta="band-${kind}">${l} ${ICON.arrow}</a>`).join('')}</p>
</div></section>`;
}

function newsletter(id = 'nl') {
  const n = CONFIG.newsletter || {};
  if (!n.web3formsKey) return '';
  return `<section class="newsletter" aria-labelledby="${id}-h">
  <div class="nl-copy"><p class="eyebrow">Newsletter</p><h2 id="${id}-h">Practical AI, once a month.</h2>
  <p>New guides, tool changes worth knowing about and automation ideas you can actually use. No spam, unsubscribe any time.</p></div>
  <form class="nl-form" action="https://api.web3forms.com/submit" method="POST" data-newsletter>
    <input type="hidden" name="access_key" value="${esc(n.web3formsKey)}">
    <input type="hidden" name="subject" value="New Resources newsletter signup">
    <input type="hidden" name="from_name" value="Calon AI Resources">
    <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <label class="sr" for="${id}-email">Email address</label>
    <div class="nl-row"><input id="${id}-email" type="email" name="email" required autocomplete="email" placeholder="you@company.co.uk"><button type="submit" class="btn btn-primary">Subscribe</button></div>
    <p class="nl-note">We use your email only to send the newsletter. See our <a href="/privacy">Privacy Policy</a>.</p>
    <p class="nl-status" role="status" aria-live="polite"></p>
  </form>
</section>`;
}

// ---------------------------------------------------------------- article pages
fs.rmSync(path.join(OUT, 'resources'), { recursive: true, force: true, filter: undefined });
fs.mkdirSync(path.join(OUT, 'resources', 'category'), { recursive: true });
// keep generated cover images (built separately by tools/resources-covers.mjs)
if (fs.existsSync(path.join(REPO, 'content', 'resources', 'img'))) {
  fs.cpSync(path.join(REPO, 'content', 'resources', 'img'), path.join(OUT, 'resources', 'img'), { recursive: true });
}

function relatedFor(a) {
  const picked = (a.related || []).map((s) => bySlug.get(s)).filter(Boolean);
  const score = (o) => (o.category === a.category ? 3 : 0) + o.tags.filter((t) => a.tags.includes(t)).length;
  const rest = published.filter((o) => o.slug !== a.slug && !picked.includes(o)).sort((x, y) => score(y) - score(x));
  return [...picked, ...rest].slice(0, 3);
}

for (const a of published) {
  const canonical = a.canonical || SITE + a.href;
  const author = AUTHORS[a.author];
  const crumbs = [['Home', '/'], ['Resources', '/resources'], [esc(a.cat.name), `/resources/category/${a.cat.slug}`], [esc(a.title), a.href]];
  const ogImage = `${SITE}/resources/img/${a.cover}.jpg`;
  const related = relatedFor(a);
  const tocItems = a.toc.filter((t) => t.level === 2);
  const shareUrl = encodeURIComponent(SITE + a.href);
  const shareTitle = encodeURIComponent(a.title);
  const authorLd = author.type === 'Person'
    ? { '@type': 'Person', name: author.name, jobTitle: author.role, url: author.url ? SITE + author.url : undefined, worksFor: { '@id': SITE + '/#org' } }
    : { '@type': 'Organization', '@id': SITE + '/#org', name: 'Calon AI', url: SITE + '/' };
  const jsonld = [
    ORG,
    {
      '@type': 'BlogPosting', '@id': canonical + '#article', headline: a.title, description: a.description,
      image: [{ '@type': 'ImageObject', url: ogImage, width: 1200, height: 630 }],
      datePublished: a.date, dateModified: a.updated, author: authorLd, publisher: { '@id': SITE + '/#org' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical }, url: canonical, inLanguage: 'en-GB',
      articleSection: a.cat.name, keywords: a.tags.join(', '), wordCount: a.words, isAccessibleForFree: true,
      ...(a.sources?.length ? { citation: a.sources.map((s) => { const [t, u] = String(s).split(' | '); return { '@type': 'CreativeWork', name: t, url: u }; }) } : {}),
    },
    crumbsLd(crumbs.map(([n, h]) => [n.replace(/&amp;/g, '&'), h])),
  ];
  if (a.faq?.length) jsonld.push({ '@type': 'FAQPage', mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });

  const body = `<div class="wrap">
${crumbsHtml(crumbs)}
<article class="post" data-article="${a.slug}" data-category="${a.category}">
  <header class="post-head">
    <p class="post-cat">${catChip(a.cat)}${a.kind ? `<span class="kind">${esc(a.kind)}</span>` : ''}</p>
    <h1>${esc(a.title)}</h1>
    <p class="lede">${esc(a.description)}</p>
    <div class="byline">
      <span class="avatar" aria-hidden="true">${author.initials ? esc(author.initials) : '<img src="/assets/calon-mark.png" alt="" width="22" height="22">'}</span>
      <span><span class="by">By <a href="/about">${esc(author.name)}</a></span>
      <span class="dates">Published <time datetime="${a.date}">${fmtDate(a.date)}</time>${a.updated !== a.date ? ` &middot; Updated <time datetime="${a.updated}">${fmtDate(a.updated)}</time>` : ''} &middot; ${a.readMins} min read</span></span>
    </div>
  </header>
  <figure class="post-cover"><img src="/resources/img/${a.cover}.webp" alt="${esc(a.coverAlt)}" width="1200" height="630" fetchpriority="high" decoding="async"></figure>
  <div class="post-grid">
    <aside class="post-side">
      ${tocItems.length >= 3 ? `<nav class="toc" aria-label="On this page"><details open><summary>On this page</summary><ol>${tocItems.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></details></nav>` : ''}
      <div class="share" aria-label="Share this article">
        <p>Share</p>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" rel="noopener" target="_blank" data-share="linkedin" aria-label="Share on LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM7.12 20.45H3.56V9h3.56v11.45z"/></svg></a>
        <a href="https://x.com/intent/post?url=${shareUrl}&amp;text=${shareTitle}" rel="noopener" target="_blank" data-share="x" aria-label="Share on X"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 1.5h3.68l-8.04 9.19L24 22.5h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.5h7.59l5.24 6.93L18.9 1.5zm-1.29 18.8h2.04L6.48 3.6H4.29l13.32 16.7z"/></svg></a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" rel="noopener" target="_blank" data-share="facebook" aria-label="Share on Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4z"/></svg></a>
        <a href="mailto:?subject=${shareTitle}&amp;body=${shareUrl}" data-share="email" aria-label="Share by email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="M3 6.5l9 6 9-6"/></svg></a>
        <button type="button" data-copy="${SITE + a.href}" aria-label="Copy link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1 1"/><path d="M14 10a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1-1"/></svg></button>
      </div>
    </aside>
    <div class="post-main">
      ${a.takeaways?.length ? `<aside class="takeaways" aria-labelledby="tk"><h2 id="tk">Key takeaways</h2><ul>${a.takeaways.map((t) => `<li>${inline(t)}</li>`).join('')}</ul></aside>` : ''}
      <div class="prose">
${a.html}
      </div>
      ${a.faq?.length ? `<section class="faq" aria-labelledby="faq-h"><h2 id="faq-h">Frequently asked questions</h2>${a.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${inline(f.a)}</p></details>`).join('')}</section>` : ''}
      ${a.sources?.length ? `<section class="sources" aria-labelledby="src-h"><h2 id="src-h">Sources and further reading</h2><ol>${a.sources.map((s) => { const [t, u] = String(s).split(' | '); return `<li><a href="${esc(u)}" rel="noopener" target="_blank">${esc(t)}</a></li>`; }).join('')}</ol></section>` : ''}
      <section class="author-box" aria-label="About the author">
        <span class="avatar lg" aria-hidden="true">${author.initials ? esc(author.initials) : '<img src="/assets/calon-mark.png" alt="" width="30" height="30">'}</span>
        <div><p class="ab-name">${esc(author.name)}</p><p>${esc(author.bio)}</p></div>
      </section>
      <p class="disclaimer">${esc(CONFIG.editorialNote)}</p>
    </div>
  </div>
</article>
${ctaBand(a.cta || 'default')}
<section class="related" aria-labelledby="rel-h">
  <h2 id="rel-h">Keep reading</h2>
  <div class="grid">${related.map((r) => card(r)).join('\n')}</div>
</section>
</div>`;
  fs.writeFileSync(path.join(OUT, 'resources', `${a.slug}.html`), page({
    title: a.seoTitle || `${a.title} | Calon AI`, description: a.description, canonical, ogImage, ogType: 'article', jsonld,
    body, extraHead: `<meta property="article:published_time" content="${a.date}">\n<meta property="article:modified_time" content="${a.updated}">\n<meta property="article:section" content="${esc(a.cat.name)}">\n${a.tags.map((t) => `<meta property="article:tag" content="${esc(t)}">`).join('\n')}\n`,
  }));
}

// ---------------------------------------------------------------- category pages
const sitemapUrls = [];
for (const c of activeCats) {
  const items = published.filter((a) => a.category === c.slug);
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  for (let p = 1; p <= pages; p++) {
    const href = `/resources/category/${c.slug}${p > 1 ? `/page/${p}` : ''}`;
    const canonical = SITE + href;
    const slice = items.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
    const crumbs = [['Home', '/'], ['Resources', '/resources'], [esc(c.name), `/resources/category/${c.slug}`]];
    if (p > 1) crumbs.push([`Page ${p}`, href]);
    const title = `${c.seoTitle || c.name}${p > 1 ? ` (page ${p})` : ''} | Calon AI Resources`;
    const body = `<div class="wrap">
${crumbsHtml(crumbs)}
<header class="cat-head">
  <p class="eyebrow">Resources &middot; Category</p>
  <h1>${esc(c.name)}</h1>
  <p class="lede">${esc(c.description)}</p>
  ${c.topics?.length ? `<ul class="topics" aria-label="Topics covered">${c.topics.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
</header>
<nav class="cat-nav" aria-label="Categories"><a href="/resources">All</a>${activeCats.map((o) => `<a href="/resources/category/${o.slug}"${o.slug === c.slug ? ' aria-current="page"' : ''}>${esc(o.short || o.name)}</a>`).join('')}</nav>
<section aria-label="${esc(c.name)} articles"><div class="grid">${slice.map((a, i) => card(a, { eager: i < 3, heading: 'h2' })).join('\n')}</div></section>
${pages > 1 ? `<nav class="pager" aria-label="Pagination">${p > 1 ? `<a rel="prev" href="/resources/category/${c.slug}${p > 2 ? `/page/${p - 1}` : ''}">&larr; Newer</a>` : '<span></span>'}<span>Page ${p} of ${pages}</span>${p < pages ? `<a rel="next" href="/resources/category/${c.slug}/page/${p + 1}">Older &rarr;</a>` : '<span></span>'}</nav>` : ''}
${ctaBand(c.cta || 'default')}
</div>`;
    const file = p > 1 ? path.join(OUT, 'resources', 'category', c.slug, 'page', `${p}.html`) : path.join(OUT, 'resources', 'category', `${c.slug}.html`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, page({
      title, description: c.description, canonical,
      jsonld: [ORG, { '@type': 'CollectionPage', '@id': canonical, name: c.name, description: c.description, url: canonical, isPartOf: { '@id': SITE + '/resources' }, inLanguage: 'en-GB',
        mainEntity: { '@type': 'ItemList', itemListElement: slice.map((a, i) => ({ '@type': 'ListItem', position: (p - 1) * PAGE_SIZE + i + 1, url: SITE + a.href, name: a.title })) } }, crumbsLd(crumbs)],
      body,
    }));
    sitemapUrls.push([href, items[0].updated]);
  }
}

// ---------------------------------------------------------------- hub
{
  const canonical = SITE + '/resources';
  const featured = published.find((a) => a.featured) || published[0];
  const picks = published.filter((a) => a.editorsPick && a !== featured).slice(0, 3);
  const trending = published.filter((a) => a.trending).slice(0, 5);
  const latest = published;
  const crumbs = [['Home', '/'], ['Resources', '/resources']];
  const body = `<section class="hero">
  <div class="wrap">
    ${crumbsHtml(crumbs)}
    <p class="eyebrow">Calon AI Resources</p>
    <h1>Straight answers to your <span>AI questions.</span></h1>
    <p class="lede">Practical guides, fixes, comparisons and news on ChatGPT, Claude, AI tools and business automation. Written by the team that builds these systems for UK businesses every week.</p>
    <form class="search" role="search" action="/resources" method="get" data-search>
      <label class="sr" for="q">Search the resources</label>
      ${ICON.search}
      <input id="q" name="q" type="search" placeholder="Search guides, e.g. &ldquo;ChatGPT not working&rdquo;" autocomplete="off" spellcheck="false" aria-controls="suggest" aria-autocomplete="list" aria-expanded="false">
      <button type="button" class="search-clear" aria-label="Clear search" hidden>${ICON.x}</button>
      <button type="submit" class="btn btn-primary">Search</button>
      <ul id="suggest" class="suggest" role="listbox" hidden></ul>
    </form>
    <p class="quick" aria-label="Popular searches">Popular: ${['ChatGPT not working', 'How to use Claude', 'Automate tasks', 'Zapier vs Make vs n8n', 'AI data privacy'].map((q) => `<a href="/resources?q=${encodeURIComponent(q)}" data-q="${esc(q)}">${esc(q)}</a>`).join('')}</p>
  </div>
</section>
<div class="wrap">
<section class="results" id="results" aria-live="polite" hidden></section>
<div data-hub>
<section class="featured" aria-labelledby="feat-h">
  <h2 id="feat-h" class="sec-h">Featured</h2>
  <div class="feat-grid">
    ${card(featured, { size: 'lg', eager: true })}
    <div class="picks"><p class="picks-h">Editor's picks</p>${picks.map((a) => card(a, { size: 'sm' })).join('\n')}</div>
  </div>
</section>
<section class="trending" aria-labelledby="tr-h">
  <h2 id="tr-h" class="sec-h">Trending topics</h2>
  <ol class="tr-list">${trending.map((a, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><div><p class="card-meta">${catChip(a.cat)}</p><a href="${a.href}">${esc(a.title)}</a><p class="tr-meta">${metaLine(a)}</p></div></li>`).join('')}</ol>
</section>
<section class="latest" aria-labelledby="lt-h">
  <div class="sec-row"><h2 id="lt-h" class="sec-h">Latest articles</h2>
  <div class="filters" role="group" aria-label="Filter by category"><button type="button" class="f" data-filter="all" aria-pressed="true">All</button>${activeCats.map((c) => `<button type="button" class="f" data-filter="${c.slug}" aria-pressed="false">${esc(c.short || c.name)}</button>`).join('')}</div></div>
  <div class="grid" data-latest>${latest.map((a) => card(a)).join('\n')}</div>
  <p class="more"><button type="button" class="btn btn-ghost" data-more hidden>Load more articles</button></p>
</section>
<section class="cats" aria-labelledby="cat-h">
  <h2 id="cat-h" class="sec-h">Browse by topic</h2>
  <div class="cat-grid">${CATS.map((c) => {
    const n = published.filter((a) => a.category === c.slug).length;
    const inner = `<span class="cat-ic cat-${c.slug}" aria-hidden="true"></span><span class="cat-name">${esc(c.name)}</span><span class="cat-desc">${esc(c.blurb)}</span><span class="cat-n">${n ? `${n} article${n > 1 ? 's' : ''}` : 'Coming soon'}</span>`;
    return n ? `<a class="cat" href="/resources/category/${c.slug}">${inner}</a>` : `<div class="cat cat-soon">${inner}</div>`;
  }).join('')}</div>
</section>
</div>
${newsletter()}
${ctaBand()}
</div>`;
  fs.writeFileSync(path.join(OUT, 'resources.html'), page({
    title: CONFIG.hub.title, description: CONFIG.hub.description, canonical, preload: img(featured, 'lg'),
    jsonld: [ORG, WEBSITE, { '@type': 'CollectionPage', '@id': canonical, name: 'Calon AI Resources', description: CONFIG.hub.description, url: canonical, isPartOf: { '@id': SITE + '/#website' }, inLanguage: 'en-GB',
      mainEntity: { '@type': 'ItemList', itemListElement: published.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + a.href, name: a.title })) } }, crumbsLd(crumbs)],
    body,
  }));
  sitemapUrls.unshift(['/resources', published[0]?.updated || TODAY]);
}

// ---------------------------------------------------------------- search index
const STOP = new Set('a an and are as at be by for from how i in is it of on or the to what when where which why with you your can do does my me we our this that'.split(' '));
fs.writeFileSync(path.join(OUT, 'resources', 'search-index.json'), JSON.stringify({
  categories: Object.fromEntries(CATS.map((c) => [c.slug, c.short || c.name])),
  articles: published.map((a) => ({
    s: a.slug, t: a.title, d: a.description, c: a.category, g: a.tags, dt: a.date, m: a.readMins,
    h: a.toc.map((t) => t.text).join(' · '),
    b: a.text.split(' ').filter((w) => !STOP.has(w.toLowerCase())).slice(0, 1400).join(' '),
  })),
}));

// ---------------------------------------------------------------- RSS
fs.writeFileSync(path.join(OUT, 'resources', 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Calon AI Resources</title>
<link>${SITE}/resources</link>
<atom:link href="${SITE}/resources/feed.xml" rel="self" type="application/rss+xml"/>
<description>${esc(CONFIG.hub.description)}</description>
<language>en-gb</language>
${published.slice(0, 30).map((a) => `<item><title>${esc(a.title)}</title><link>${SITE}${a.href}</link><guid>${SITE}${a.href}</guid><pubDate>${new Date(a.date + 'T08:00:00Z').toUTCString()}</pubDate><category>${esc(a.cat.name)}</category><description>${esc(a.description)}</description></item>`).join('\n')}
</channel>
</rss>
`);

// ---------------------------------------------------------------- sitemap + llms.txt
const sm = [
  ...sitemapUrls.slice(0, 1),
  ...published.map((a) => [a.href, a.updated, `<image:image><image:loc>${SITE}/resources/img/${a.cover}.webp</image:loc></image:image>`]),
  ...sitemapUrls.slice(1),
];
fs.writeFileSync(path.join(OUT, 'sitemap-resources.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sm.map(([h, d, extra]) => `  <url><loc>${SITE}${h}</loc><lastmod>${d}</lastmod>${extra || ''}</url>`).join('\n')}
</urlset>
`);

{
  const llmsPath = path.join(OUT, 'llms.txt');
  const block = `<!-- resources:start -->
## Resources (guides, fixes, comparisons and AI news)
- [Calon AI Resources hub](${SITE}/resources): practical AI guides for business owners and teams
${published.map((a) => `- [${a.title}](${SITE}${a.href}): ${a.description}`).join('\n')}
<!-- resources:end -->`;
  let llms = fs.readFileSync(llmsPath, 'utf8');
  llms = /<!-- resources:start -->[\s\S]*<!-- resources:end -->/.test(llms)
    ? llms.replace(/<!-- resources:start -->[\s\S]*<!-- resources:end -->/, block)
    : llms.trimEnd() + '\n\n' + block + '\n';
  fs.writeFileSync(llmsPath, llms);
}

console.log(`Resources: ${published.length} published (${skipped} draft/scheduled), ${activeCats.length} categories, sitemap ${sm.length} URLs`);
