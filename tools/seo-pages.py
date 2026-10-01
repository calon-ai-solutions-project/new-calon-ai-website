"""One-off SEO pass over the hand-built pages in project/.
Sets titles/descriptions, adds JSON-LD and a visible FAQ block (with matching FAQPage markup).
Safe to re-run: every block it inserts is wrapped in SEO:BEGIN/END markers and replaced in place.
"""
import json, re, html, os

ROOT = os.path.join(os.path.dirname(__file__), '..', 'project')
SITE = 'https://calonaisolutions.com'
ORG_ID = SITE + '/#org'

ORG_MIN = {"@type": ["Organization", "ProfessionalService"], "@id": ORG_ID, "name": "Calon AI",
           "legalName": "CALON AI SOLUTIONS LIMITED", "url": SITE + "/", "logo": SITE + "/assets/logo-square.png",
           "telephone": "+44 3301 332508", "email": "contact@calonaisolutions.com"}

def esc(s): return html.escape(s, quote=True)

def faq_block(items, heading="Common questions"):
    rows = ''.join(
        f'<details style="border:1px solid rgba(126,196,240,0.16);border-radius:18px;background:#111C33;padding:0;margin:0 0 12px;">'
        f'<summary style="cursor:pointer;list-style:none;padding:22px 26px;font-size:18px;font-weight:600;color:#fff;letter-spacing:-0.02em;">{esc(q)}</summary>'
        f'<p style="margin:0;padding:0 26px 24px;font-size:16px;line-height:1.7;color:rgba(226,236,247,0.75);">{a_html}</p></details>'
        for q, a, a_html in items)
    return (f'  <section aria-labelledby="faq-h" style="max-width:900px;margin:0 auto;padding:90px 40px 40px;">\n'
            f'    <p style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#7EC4F0;margin:0 0 16px;">FAQ</p>\n'
            f'    <h2 id="faq-h" style="font-weight:500;font-size:clamp(28px,3.6vw,44px);line-height:1.12;letter-spacing:-0.035em;margin:0 0 32px;">{esc(heading)}</h2>\n'
            f'    {rows}\n  </section>\n')

def faq_ld(items):
    return {"@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a, _ in items]}

def crumbs(items):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + h} for i, (n, h) in enumerate(items)]}

def qa(q, a, links=None):
    """links: list of (text, href) rendered as links inside the visible answer."""
    a_html = esc(a)
    for text, href in (links or []):
        a_html = a_html.replace(esc(text), f'<a href="{href}" style="color:#7EC4F0;">{esc(text)}</a>', 1)
    return (q, a, a_html)

START_CALL = "Every engagement starts with a 15-minute operational review call. We listen, find the gap with the highest return first and tell you honestly if we are not the right fit."

HOME_FAQ = [
    qa("What is Calon AI?",
       "Calon AI is an operational AI and automation consultancy based in Caerphilly, Wales. We help founder-led service businesses across the UK connect the tools they already use, automate the admin around them and see margin, jobs and follow-ups in one place."),
    qa("Who does Calon AI work with?",
       "Founder-led service businesses with moving parts: fire and security, heating and plumbing, facilities management, solar and renewables, construction contractors, and training and compliance providers.",
       [("fire and security", "/fire-security"), ("heating and plumbing", "/heating-plumbing"), ("facilities management", "/facilities-management"),
        ("solar and renewables", "/solar-renewables"), ("construction contractors", "/construction"), ("training and compliance providers", "/training-compliance")]),
    qa("Do we have to replace our current software?",
       "No. We work around what you already pay for, such as ServiceM8, Joblogic, Simpro, Xero, QuickBooks, HubSpot, spreadsheets and email, and build only what is missing between them."),
    qa("What kind of results do clients see?",
       "Examples from our case studies: Volt Secure recovered 6 to 8 hours of director time a week and cancelled a £180 a month CRM, and HeatGlow cut first response on qualified leads from 48 hours to under 2.",
       [("Volt Secure", "/work/volt-secure-operational-platform"), ("HeatGlow", "/work/heatglow-lead-vetting")]),
    qa("Where is Calon AI based, and do you work outside Wales?",
       "Our registered office is in Caerphilly and we also work from the University of South Wales in Treforest. We deliver for businesses across England, Wales and Scotland."),
    qa("How do we get started?", START_CALL + " Book a call on our contact page.", [("contact page", "/contact")]),
]

SECTORS = {
    'fire-security': dict(name="Fire & Security", title="AI Automation for Fire & Security Companies | Calon AI",
        desc="Engineers, jobs, quotes, remedials and compliance evidence in one view. Operational AI and automation for UK fire and security firms.",
        service="Operational AI and automation for fire and security companies",
        audience="Fire and security installers and maintainers",
        cases=[("Volt Secure: Operational Platform & CRM Replacement", "/work/volt-secure-operational-platform"),
               ("the engineer job management and evidence capture app", "/work/fire-security-engineer-app")]),
    'heating-plumbing': dict(name="Heating & Plumbing", title="AI Automation for Heating & Plumbing Firms | Calon AI",
        desc="Connect engineers, quotes, service reminders and invoicing so you see the margin in every job. Automation for UK heating and plumbing firms.",
        service="Operational AI and automation for heating and plumbing businesses",
        audience="Heating, boiler and plumbing businesses",
        cases=[("HeatGlow: AI Lead Vetting & Qualification", "/work/heatglow-lead-vetting"),
               ("HeatGlow: AI Customer Reactivation", "/work/heatglow-reactivation-campaign")]),
    'facilities-management': dict(name="Facilities Management", title="AI Automation for Facilities Management | Calon AI",
        desc="Every site, job, subcontractor and piece of evidence in one view. Operational AI and automation for UK facilities management firms.",
        service="Operational AI and automation for facilities management companies",
        audience="Facilities management and maintenance companies", cases=[]),
    'solar-renewables': dict(name="Solar & Renewables", title="AI Automation for Solar & Renewables Installers | Calon AI",
        desc="From enquiry to install with nothing dropped: faster follow-ups, visible projects and cleaner handovers for UK solar and renewables firms.",
        service="Operational AI and automation for solar and renewables installers",
        audience="Solar, battery and renewable energy installers",
        cases=[("the solar AI quote and sales pipeline", "/work/renewables-quote-pipeline"),
               ("the renewables partner network platform", "/work/renewables-partner-platform")]),
    'construction': dict(name="Construction & Contractors", title="AI Automation for Construction Contractors | Calon AI",
        desc="See your real margin job by job. Connect site and office so costs, variations and invoicing stay visible for UK construction contractors.",
        service="Operational AI and automation for construction contractors",
        audience="Construction contractors and trades businesses", cases=[]),
    'training-compliance': dict(name="Training & Compliance", title="Automation for Training & Compliance Providers | Calon AI",
        desc="Onboarding, learner records, documents and chasing handled properly. Operational AI and automation for UK training and compliance providers.",
        service="Operational AI and automation for training and compliance providers",
        audience="Training, compliance and skills providers",
        cases=[("Construction Skills Wales: Automated Learner Onboarding", "/work/construction-skills-wales-onboarding"),
               ("the health and safety training sales and onboarding automation", "/work/health-safety-training-automation")]),
}

OTHER = {
    'index': dict(title="AI Automation Consultancy for Service Businesses | Calon AI",
        desc="Welsh AI and automation consultancy helping founder-led UK service businesses find hidden margin, recover lost revenue and connect their tools.",
        canon="/", kind="WebPage", crumb=None),
    'about': dict(title="About Calon AI | Founder-Led AI Consultancy in Wales",
        desc="Meet the founders of Calon AI, an operational AI consultancy in Caerphilly, Wales. ICO registered, fully insured and working across the UK.",
        canon="/about", kind="AboutPage", crumb="About"),
    'contact': dict(title="Contact Calon AI | Book a 15-Minute Operational Review",
        desc="Book a 15-minute call with Calon AI. No deck, no pitch. Call 03301 332 508 or email contact@calonaisolutions.com.",
        canon="/contact", kind="ContactPage", crumb="Contact"),
    'proof': dict(title="AI Automation Case Studies | Calon AI",
        desc="Case studies from fire and security, heating, renewables and training firms that recovered time, margin and revenue with Calon AI.",
        canon="/proof", kind="CollectionPage", crumb="Case studies"),
    'ai-brain': dict(title="The AI Brain: Ask Your Business Anything | Calon AI",
        desc="One AI chat across your CRM, Xero, ServiceM8, Google Ads, inbox and website. Ask in plain English and get reports, drafted emails and alerts.",
        canon="/ai-brain", kind="WebPage", crumb="The AI Brain"),
}

FOUNDERS = [
    {"@type": "Person", "@id": SITE + "/about#alom", "name": "Mahbubul Alom", "alternateName": "Alom",
     "jobTitle": "Chief AI Officer", "worksFor": {"@id": ORG_ID}, "image": SITE + "/assets/alom.jpg",
     "sameAs": ["https://www.linkedin.com/in/mahbubul-alom-74a050253"]},
    {"@type": "Person", "@id": SITE + "/about#fabrizio", "name": "Fabrizio Pierri", "alternateName": "Fabrizio",
     "jobTitle": "Commercial Lead", "worksFor": {"@id": ORG_ID}, "image": SITE + "/assets/fabrizio.jpg",
     "sameAs": ["https://www.linkedin.com/in/fabrizio-pierri-9b1071204"]},
]

def set_meta(s, title, desc):
    s = re.sub(r'<title>.*?</title>', f'<title>{esc(title)}</title>', s, count=1)
    s = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + esc(desc), s, count=1)
    s = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + esc(title), s, count=1)
    s = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + esc(desc), s, count=1)
    return s

def set_ld(s, graph):
    block = '<!-- SEO:LD:BEGIN --><script type="application/ld+json">' + json.dumps(
        {"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False).replace('</', '<\\/') + '</script><!-- SEO:LD:END -->'
    s = re.sub(r'<!-- SEO:LD:BEGIN -->.*?<!-- SEO:LD:END -->\n?', '', s, flags=re.S)
    return s.replace('<script src="./support.js"></script>', block + '\n<script src="./support.js"></script>', 1)

def set_faq(s, items, anchor, heading="Common questions"):
    s = re.sub(r'  <!-- SEO:FAQ:BEGIN -->.*?<!-- SEO:FAQ:END -->\n', '', s, flags=re.S)
    assert anchor in s, anchor
    return s.replace(anchor, '  <!-- SEO:FAQ:BEGIN -->\n' + faq_block(items, heading) + '  <!-- SEO:FAQ:END -->\n' + anchor, 1)

def webpage(path, name, kind="WebPage", desc=""):
    return {"@type": kind, "@id": SITE + path + "#webpage", "url": SITE + path, "name": name, "description": desc,
            "isPartOf": {"@id": SITE + "/#website"}, "about": {"@id": ORG_ID}, "inLanguage": "en-GB"}

def main():
    # ----- home: keep the existing org graph, enrich it, add FAQ -----
    f = os.path.join(ROOT, 'index.html'); s = open(f, encoding='utf-8').read()
    m = re.search(r'<script type="application/ld\+json">(\{"@context".*?)</script>', s, flags=re.S)
    if m:  # move the original org JSON into our managed block
        old = json.loads(m.group(1)); s = s.replace(m.group(0), '', 1)
        org = next(n for n in old['@graph'] if n['@type'] == 'Organization')
        site = next(n for n in old['@graph'] if n['@type'] == 'WebSite')
        open(os.path.join(os.path.dirname(__file__), '.org.json'), 'w').write(json.dumps([org, site]))
    org, site = json.loads(open(os.path.join(os.path.dirname(__file__), '.org.json')).read())
    org.update({"@type": ["Organization", "ProfessionalService"],
        "description": "Operational AI and automation consultancy for founder-led service businesses across the UK, based in Caerphilly, Wales.",
        "slogan": "You built this business. Let's get more from it.",
        "founder": [{"@id": p["@id"]} for p in FOUNDERS],
        "areaServed": [{"@type": "Country", "name": "United Kingdom"}, {"@type": "AdministrativeArea", "name": "Wales"}],
        "knowsAbout": ["AI automation", "Business process automation", "AI agents", "CRM integration", "Xero integration",
                       "Operational dashboards", "Workflow automation", "Field service management", "Lead qualification"],
        "hasOfferCatalog": {"@type": "OfferCatalog", "name": "Operational AI and automation by sector", "itemListElement": [
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": v['service'], "url": SITE + '/' + k}} for k, v in SECTORS.items()]}})
    o = OTHER['index']
    s = set_meta(s, o['title'], o['desc'])
    s = set_ld(s, [org, site, *FOUNDERS, webpage('/', o['title'], desc=o['desc']), faq_ld(HOME_FAQ)])
    s = set_faq(s, HOME_FAQ, '  <!-- SECTION 12 — FINAL CTA -->', "Questions founders ask us")
    open(f, 'w', encoding='utf-8').write(s)

    # ----- other main pages -----
    for key in ('about', 'contact', 'proof', 'ai-brain'):
        o = OTHER[key]; f = os.path.join(ROOT, key + '.html'); s = open(f, encoding='utf-8').read()
        s = set_meta(s, o['title'], o['desc'])
        graph = [ORG_MIN, webpage(o['canon'], o['title'], o['kind'], o['desc']), crumbs([("Home", "/"), (o['crumb'], o['canon'])])]
        if key == 'about': graph += FOUNDERS
        s = set_ld(s, graph)
        open(f, 'w', encoding='utf-8').write(s)

    # ----- sector pages -----
    for key, v in SECTORS.items():
        f = os.path.join(ROOT, key + '.html'); s = open(f, encoding='utf-8').read()
        s = set_meta(s, v['title'], v['desc'])
        lede = re.search(r'</h1>\s*<p[^>]*>([\s\S]*?)</p>', s).group(1)
        lede = html.unescape(re.sub(r'<[^>]+>', '', lede)).strip()
        lede = re.sub(r'\s+', ' ', lede)
        items = [
            qa(f"What does Calon AI do for {v['name'].lower()} businesses?", lede),
            qa("Do we need to change the software we already use?",
               "No. We connect the job management, accounting, CRM and communication tools you already pay for, such as ServiceM8, Joblogic, Simpro, Xero, QuickBooks and HubSpot, and automate the work between them."),
        ]
        if v['cases']:
            names = ' and '.join(n for n, _ in v['cases'])
            items.append(qa(f"Have you done this for other {v['name'].lower()} businesses?",
                            f"Yes. See {names} in our case studies.", v['cases']))
        items.append(qa("How do we get started?", START_CALL, [("15-minute operational review call", "/contact")]))
        service = {"@type": "Service", "@id": SITE + '/' + key + '#service', "name": v['service'], "serviceType": "Operational AI and automation consultancy",
                   "provider": {"@id": ORG_ID}, "areaServed": {"@type": "Country", "name": "United Kingdom"},
                   "audience": {"@type": "BusinessAudience", "audienceType": v['audience']}, "url": SITE + '/' + key, "description": v['desc']}
        s = set_ld(s, [ORG_MIN, webpage('/' + key, v['title'], desc=v['desc']), service,
                       crumbs([("Home", "/"), ("Who we help", "/#who-we-help"), (v['name'], '/' + key)]), faq_ld(items)])
        s = set_faq(s, items, '  <!-- FINAL CTA -->', f"{v['name']}: common questions")
        open(f, 'w', encoding='utf-8').write(s)
    print('SEO pass done')

if __name__ == '__main__':
    main()
