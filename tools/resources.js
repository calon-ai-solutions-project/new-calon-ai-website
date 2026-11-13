(function () {
  'use strict';
  var dl = (window.dataLayer = window.dataLayer || []);
  function track(event, data) { try { var o = { event: event }; for (var k in data) o[k] = data[k]; dl.push(o); } catch (e) {} }
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var escH = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  // ---- CTA / share tracking (no-op until analytics is configured)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-track="cta"],[data-share]');
    if (!a) return;
    if (a.hasAttribute('data-share')) track('article_share', { method: a.getAttribute('data-share'), article: (document.querySelector('[data-article]') || {}).dataset ? document.querySelector('[data-article]').dataset.article : '' });
    else track('cta_click', { cta: a.getAttribute('data-cta'), page: location.pathname });
  });

  // ---- copy link
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var done = function () { b.classList.add('ok'); b.setAttribute('aria-label', 'Link copied'); setTimeout(function () { b.classList.remove('ok'); b.setAttribute('aria-label', 'Copy link'); }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(b.getAttribute('data-copy')).then(done, function () {}); else done();
      track('article_share', { method: 'copy' });
    });
  });

  // ---- table of contents: highlight the section in view
  var tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) { tocLinks.forEach(function (l) { l.classList.remove('on'); }); map[en.target.id].classList.add('on'); }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    Object.keys(map).forEach(function (id) { var h = document.getElementById(id); if (h) io.observe(h); });
    if (window.matchMedia('(max-width:1000px)').matches) { var d = $('.toc details'); if (d) d.removeAttribute('open'); }
  }

  // ---- newsletter (Web3Forms; falls back to a normal form post without JS)
  $$('form[data-newsletter]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var st = $('.nl-status', f), btn = $('button', f);
      st.textContent = 'Subscribing…'; st.style.color = '#2A7DB8'; btn.disabled = true;
      fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.success) { st.textContent = 'Thanks, you are on the list.'; st.style.color = '#1C7C4A'; f.reset(); track('newsletter_signup', { page: location.pathname }); }
          else throw new Error();
        })
        .catch(function () { st.textContent = 'Something went wrong. Please try again or email contact@calonaisolutions.com.'; st.style.color = '#B3261E'; })
        .then(function () { btn.disabled = false; });
    });
  });

  // ---- hub: category filters + load more
  var latest = $('[data-latest]');
  var STEP = 9, shown = STEP, filter = 'all';
  var moreBtn = $('[data-more]');
  function renderLatest() {
    if (!latest) return;
    var cards = $$('.card', latest), visible = 0, total = 0;
    cards.forEach(function (c) {
      var match = filter === 'all' || c.getAttribute('data-cat') === filter;
      if (match) total++;
      var show = match && visible < shown;
      if (show) visible++;
      c.hidden = !show;
    });
    if (moreBtn) moreBtn.hidden = total <= shown;
  }
  if (latest) {
    $$('.filters .f').forEach(function (b) {
      b.addEventListener('click', function () {
        filter = b.getAttribute('data-filter'); shown = STEP;
        $$('.filters .f').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        renderLatest();
        track('resources_filter', { category: filter });
      });
    });
    if (moreBtn) moreBtn.addEventListener('click', function () {
      var before = $$('.card:not([hidden])', latest).length;
      shown += STEP; renderLatest();
      var next = $$('.card:not([hidden])', latest)[before];
      if (next) { var a = $('.card-title a', next); if (a) a.focus({ preventScroll: false }); }
    });
    renderLatest();
  }

  // ---- search
  var form = $('form[data-search]');
  if (!form) return;
  var input = $('#q'), sug = $('#suggest'), clearBtn = $('.search-clear', form);
  var resultsEl = $('#results'), hub = $('[data-hub]');
  var INDEX = null, loading = null;
  function load() {
    if (INDEX) return Promise.resolve(INDEX);
    if (!loading) loading = fetch('/resources/search-index.json').then(function (r) { return r.json(); }).then(function (j) {
      j.articles.forEach(function (a) {
        a._t = norm(a.t); a._d = norm(a.d); a._g = norm(a.g.join(' ') + ' ' + j.categories[a.c]); a._h = norm(a.h); a._b = norm(a.b);
      });
      INDEX = j; return j;
    });
    return loading;
  }
  function norm(s) { return ' ' + String(s).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9.+#]+/g, ' ').trim() + ' '; }
  var STOP = ' a an and are as at be by for from how i in is it of on or the to what when where which why with you your can do does my me we our this that should best way ';
  var SYN = {
    gpt: ['chatgpt'], chatgpt: ['openai'], openai: ['chatgpt'], anthropic: ['claude'], claude: ['anthropic'],
    fix: ['error', 'troubleshoot', 'not working'], error: ['fix', 'not working'], errors: ['error', 'fix'], broken: ['not working', 'error'], down: ['not working', 'outage'],
    automate: ['automation', 'workflow'], automation: ['automate', 'workflow'], automating: ['automation'], workflow: ['automation'], workflows: ['automation'],
    connect: ['integrate', 'integration', 'api'], integrate: ['connect', 'integration'], integration: ['connect'], apps: ['app', 'tools'],
    ai: ['artificial intelligence'], llm: ['ai model'], agent: ['agents'], agents: ['agent'], prompt: ['prompts', 'prompting'], prompts: ['prompt'],
    gdpr: ['privacy', 'data protection'], privacy: ['gdpr', 'data'], safe: ['safety', 'privacy', 'security'], security: ['safe', 'privacy'],
    support: ['customer service', 'helpdesk'], code: ['coding', 'developer'], coding: ['code'], business: ['small business', 'company'],
    news: ['announcement', 'launch', 'update'], compare: ['vs', 'comparison'], vs: ['comparison', 'versus'], versus: ['vs'],
    zapier: ['automation'], n8n: ['automation'], make: ['automation']
  };
  function stem(w) { return w.length > 4 ? w.replace(/(ing|ed|es|s)$/, '') : w; }
  function tokens(q) {
    return norm(q).trim().split(' ').filter(function (w) { return w && STOP.indexOf(' ' + w + ' ') < 0; });
  }
  function hit(field, term, prefix) {
    if (field.indexOf(' ' + term + ' ') >= 0) return 1;
    var st = stem(term);
    if (st !== term && field.indexOf(' ' + st) >= 0) return 0.85;
    if (prefix && term.length >= 2 && field.indexOf(' ' + term) >= 0) return 0.7;
    return 0;
  }
  function search(q, live) {
    var toks = tokens(q);
    if (!toks.length) return [];
    var phrase = norm(q).trim();
    var out = [];
    INDEX.articles.forEach(function (a) {
      var score = 0, matched = 0;
      toks.forEach(function (t, i) {
        var prefix = live && i === toks.length - 1;
        var terms = [[t, 1]].concat((SYN[t] || []).map(function (s) { return [s, 0.5]; }));
        var best = 0;
        terms.forEach(function (tw) {
          var term = tw[0], w = tw[1];
          var s = 8 * hit(a._t, term, prefix) + 5 * hit(a._g, term, prefix) + 4 * hit(a._d, term, prefix) + 3 * hit(a._h, term, prefix);
          if (term.indexOf(' ') < 0) {
            var body = 0, idx = a._b.indexOf(' ' + term), n = 0;
            while (idx >= 0 && n < 6) { n++; idx = a._b.indexOf(' ' + term, idx + 1); }
            body = Math.min(n, 6) * 0.6;
            s += body;
          } else if (a._b.indexOf(' ' + term + ' ') >= 0) s += 2;
          best = Math.max(best, s * w);
        });
        if (best > 0) matched++;
        score += best;
      });
      if (!matched || matched < Math.ceil(toks.length * 0.5)) return;
      if (phrase.length > 3 && (a._t.indexOf(phrase) >= 0)) score += 12;
      else if (phrase.length > 3 && (a._d.indexOf(phrase) >= 0 || a._h.indexOf(phrase) >= 0)) score += 6;
      score *= matched / toks.length;
      out.push({ a: a, score: score });
    });
    return out.sort(function (x, y) { return y.score - x.score || (y.a.dt > x.a.dt ? 1 : -1); }).map(function (r) { return r.a; });
  }
  function highlight(text, q) {
    var t = escH(text);
    tokens(q).forEach(function (w) {
      if (w.length < 3) return;
      t = t.replace(new RegExp('(^|[^a-z0-9])(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[a-z]*)', 'gi'), '$1<mark>$2</mark>');
    });
    return t;
  }
  function fmt(d) { try { return new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return d; } }

  var SUGGEST = ['ChatGPT not working', 'How to use Claude', 'Automate repetitive tasks', 'Connect two apps', 'Zapier vs Make vs n8n', 'AI customer support', 'AI data privacy'];
  function showResults(q) {
    q = q.trim();
    if (!q) { reset(); return; }
    load().then(function () {
      var res = search(q, false);
      hub.hidden = true; resultsEl.hidden = false;
      var cats = INDEX.categories;
      var html = '<div class="results-h"><h2>' + (res.length ? res.length + ' result' + (res.length > 1 ? 's' : '') + ' for &ldquo;' + escH(q) + '&rdquo;' : 'No results for &ldquo;' + escH(q) + '&rdquo;') + '</h2><button type="button" class="btn btn-ghost" data-reset>Clear search</button></div>';
      if (res.length) {
        html += res.map(function (a) {
          return '<a class="result" href="/resources/' + a.s + '"><span class="chip">' + escH(cats[a.c]) + '</span><h3>' + highlight(a.t, q) + '</h3><p>' + highlight(a.d, q) + '</p><p style="margin-top:8px;font-size:13.5px">' + fmt(a.dt) + ' &middot; ' + a.m + ' min read</p></a>';
        }).join('');
      } else {
        html += '<div class="empty"><p>We have not written about that yet. Try a broader term, or one of these:</p><p class="quick" style="margin:0">' +
          SUGGEST.map(function (s) { return '<a href="/resources?q=' + encodeURIComponent(s) + '" data-q="' + escH(s) + '">' + escH(s) + '</a>'; }).join('') +
          '</p><p style="margin:18px 0 0">Or <a href="/contact">ask our team directly</a>. If it is a question about your own systems, we are happy to help.</p></div>';
      }
      resultsEl.innerHTML = html;
      track('resources_search', { search_term: q, results: res.length });
      try { history.replaceState(null, '', '/resources?q=' + encodeURIComponent(q)); } catch (e) {}
    });
  }
  function reset() {
    input.value = ''; clearBtn.hidden = true; closeSug();
    resultsEl.hidden = true; resultsEl.innerHTML = ''; hub.hidden = false;
    try { history.replaceState(null, '', '/resources'); } catch (e) {}
  }
  var active = -1;
  function closeSug() { sug.hidden = true; sug.innerHTML = ''; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; }
  function renderSug() {
    var q = input.value;
    clearBtn.hidden = !q;
    if (q.trim().length < 2) { closeSug(); return; }
    load().then(function () {
      var res = search(q, true).slice(0, 6);
      if (!res.length) { closeSug(); return; }
      sug.innerHTML = res.map(function (a, i) { return '<li role="option" id="sg' + i + '" data-href="/resources/' + a.s + '" aria-selected="false"><small>' + escH(INDEX.categories[a.c]) + '</small>' + highlight(a.t, q) + '</li>'; }).join('');
      sug.hidden = false; input.setAttribute('aria-expanded', 'true'); active = -1;
    });
  }
  function move(d) {
    var items = $$('li', sug); if (!items.length) return;
    active = (active + d + items.length) % items.length;
    items.forEach(function (li, i) { li.setAttribute('aria-selected', String(i === active)); });
    input.setAttribute('aria-activedescendant', items[active].id);
  }
  input.addEventListener('focus', load);
  input.addEventListener('input', renderSug);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Escape') { closeSug(); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); location.href = $$('li', sug)[active].getAttribute('data-href'); }
  });
  sug.addEventListener('mousedown', function (e) { var li = e.target.closest('li'); if (li) { e.preventDefault(); location.href = li.getAttribute('data-href'); } });
  document.addEventListener('click', function (e) {
    if (!form.contains(e.target)) closeSug();
    var r = e.target.closest('[data-reset]'); if (r) { reset(); input.focus(); }
    var qa = e.target.closest('a[data-q]');
    if (qa && !e.metaKey && !e.ctrlKey) { e.preventDefault(); input.value = qa.getAttribute('data-q'); clearBtn.hidden = false; showResults(input.value); resultsEl.scrollIntoView({ block: 'start' }); }
  });
  clearBtn.addEventListener('click', function () { reset(); input.focus(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); closeSug(); showResults(input.value); });
  var initial = new URLSearchParams(location.search).get('q');
  if (initial) { input.value = initial; clearBtn.hidden = false; showResults(initial); }
})();
