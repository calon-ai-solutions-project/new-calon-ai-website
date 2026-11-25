#!/usr/bin/env python3
"""Adds WhatsApp to the hand-built (DC) pages. Idempotent: safe to run again.
  python3 tools/whatsapp-buttons.py
- includes /whatsapp.js (floating button + whatsapp_click tracking) next to cookie.js on every page
- adds a "WhatsApp us" button beside the hero and booking-section CTAs
- adds a WhatsApp row to the contact page details
Static pages (work/*, legal, resources) get the same via tools/build-static.mjs and tools/build-resources.mjs.
"""
import glob, os, re, sys
from urllib.parse import quote

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'project')
NUMBER = '447359849180'
INDUSTRY = {
    'fire-security': 'a fire and security business',
    'heating-plumbing': 'a heating, plumbing or renewables business',
    'construction-training': 'a construction business or training provider',
    'hospitality-food': 'a hospitality or food business',
    'salons-gyms-membership': 'a salon, gym or membership business',
}
ICON = ('<svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true" focusable="false" style="flex:none;">'
        '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>')


def wa_link(page):
    ind = INDUSTRY.get(page)
    msg = f"Hi Calon AI, I run {ind} and I'd like a free review." if ind else "Hi Calon AI, I'd like a free review for my business."
    return f'https://wa.me/{NUMBER}?text=' + quote(msg, safe='')


def button(page, where, size='md'):
    pad = 'padding:17px 32px;font-size:17px;' if size == 'lg' else 'padding:15px 26px;font-size:16px;'
    return (f'<a href="{wa_link(page)}" target="_blank" rel="noopener" data-wa="{where}" '
            f'style="display:inline-flex;align-items:center;justify-content:center;gap:10px;background:rgba(37,211,102,0.08);color:#fff;{pad}font-weight:600;'
            f'border-radius:999px;text-decoration:none;border:1.5px solid rgba(37,211,102,0.6);transition:background .2s,border-color .2s;" '
            f'style-hover="background:rgba(37,211,102,0.16);border-color:#25D366;">{ICON}WhatsApp us</a>')


def patch(path):
    name = os.path.basename(path)
    page = name.replace('.html', '').replace('.dc', '')
    if name in ('index.html', 'Calon Landing.dc.html'):
        page = 'home'
    s = orig = open(path, encoding='utf-8').read()

    # 1. script include (every page that loads cookie.js)
    if 'whatsapp.js' not in s:
        s = re.sub(r'(<script src="(\.?/)cookie\.js" defer></script>)', lambda m: m.group(1) + f'\n<script src="{m.group(2)}whatsapp.js" defer></script>', s, count=1)
        if 'whatsapp.js' not in s and '</head>' in s and '<x-dc>' not in s:  # standalone pages without cookie.js
            s = s.replace('</head>', '<script src="/whatsapp.js" defer></script>\n</head>', 1)

    if 'data-wa=' in s:  # buttons already added
        return s != orig and open(path, 'w', encoding='utf-8').write(s)

    # 2. hero: industry, about pages (primary CTA followed by "See the work")
    s = re.sub(r'(<a href="/contact" style="background:#7EC4F0;color:#06101F;font-size:16px;font-weight:600;padding:16px 30px;border-radius:999px;text-decoration:none;box-shadow:0 8px 30px rgba\(126,196,240,0\.22\);">[^<]+</a>)(\s*<a href="/#proof")',
               lambda m: m.group(1) + '\n        ' + button(page, 'hero') + m.group(2), s, count=1)
    # home hero
    s = re.sub(r'(<a href="/contact" class="btn-pill btn-primary">.*?</a>)', lambda m: m.group(1) + '\n          ' + button(page, 'hero'), s, count=1, flags=re.S)
    # AI Brain hero CTA
    s = re.sub(r'(<a class="brain-cta" href="/contact">.*?</a>)',
               lambda m: '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:14px;">' + m.group(1) + button(page, 'hero') + '</div>', s, count=1, flags=re.S)

    # 3. booking sections: centred final CTA (single big button) -> button pair
    s = re.sub(r'(<a href="/contact" style="display:inline-block;background:#7EC4F0;color:#06101F;font-size:17px;font-weight:600;padding:18px 38px;border-radius:999px;text-decoration:none;box-shadow:0 10px 40px rgba\(126,196,240,0\.28\);">[^<]+</a>)',
               lambda m: '<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:14px;">' + m.group(1) + button(page, 'booking', 'lg') + '</div>', s)
    # home: "Start the conversation" band
    s = re.sub(r'(<a href="/contact" style="flex:none;background:#7EC4F0;[^"]*">Start the conversation</a>)',
               lambda m: '<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:14px;">' + m.group(1) + button(page, 'booking') + '</div>', s)
    # home: "Book your review" card
    s = re.sub(r'(<a href="/contact" style="align-self:flex-start;[^"]*">Book your review &rarr;</a>)',
               lambda m: '<div style="display:flex;flex-wrap:wrap;gap:12px;">' + m.group(1).replace('align-self:flex-start;', '') + button(page, 'booking') + '</div>', s)

    # 4. contact page: WhatsApp row after the phone row
    if name == 'contact.html':
        s = re.sub(r'(<a href="tel:03301332508"[^>]*>03301 332 508</a>\s*</div>)',
                   lambda m: m.group(1) + '\n          <div style="display:flex;align-items:center;gap:14px;">\n            <span style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:rgba(37,211,102,0.12);flex:none;">'
                   + ICON + '</span>\n            <a href="' + wa_link(page) + '" target="_blank" rel="noopener" data-wa="contact" style="font-size:16px;color:rgba(226,236,247,0.85);text-decoration:none;">WhatsApp us: 07359 849180</a>\n          </div>', s, count=1)

    if s != orig:
        open(path, 'w', encoding='utf-8').write(s)
        return True
    return False


pages = sorted(set(glob.glob(os.path.join(ROOT, '*.html')) + glob.glob(os.path.join(ROOT, 'case-studies', '**', '*.html'), recursive=True)))
changed = [os.path.relpath(p, ROOT) for p in pages if patch(p)]
print(f'{len(changed)} pages updated')
for c in changed:
    print(' ', c)
