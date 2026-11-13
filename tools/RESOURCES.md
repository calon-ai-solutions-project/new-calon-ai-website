# Resources hub (`/resources`)

The Resources hub is built the same way as the case-study and legal pages: articles are Markdown files in the repo, and a build script turns them into plain static HTML. Every page is fully readable without JavaScript, which is what Google and AI search tools need. There are no new runtime dependencies.

```
content/resources/
  site.json          hub title/description, newsletter key, analytics IDs (off by default)
  categories.json    the 8 categories (add more here; empty ones show "Coming soon" and get no page)
  authors.json       bylines (add named authors here once they agree to be credited)
  articles/*.md      one file per article; the file name is the URL slug
  img/               generated cover images (.webp for display, .jpg for social sharing)
tools/
  build-resources.mjs   generates every Resources page, plus search-index.json, feed.xml,
                        sitemap-resources.xml and the Resources block in llms.txt
  resources-covers.mjs  renders the cover illustrations (needs Playwright + Chromium)
  resources.css / .js   shared styles and the search, filter, newsletter and share code
```

## Publish or edit an article

1. Create or edit `content/resources/articles/<slug>.md` (front matter reference below).
2. Add a cover entry to `COVERS` in `tools/resources-covers.mjs`, then run `node tools/resources-covers.mjs <slug>`.
3. Run `node tools/build-resources.mjs`. It warns about descriptions over 160 characters and about missing related articles.
4. Commit the Markdown and everything generated under `project/`.

If you also run `node tools/build-static.mjs`, run `build-resources.mjs` **afterwards**. `build-static` rewrites `llms.txt`, and `build-resources` then adds its Resources block back in.

- **Unpublish:** set `draft: true` and rebuild. The page, search entry and sitemap entry are removed.
- **Schedule:** set `date` to a future day. The article stays hidden until a build runs on or after that date. There is no build on deploy, so someone has to rebuild on the day (or use the CMS option below).

## Front matter

```yaml
---
title: How to ...                  # H1 and card title
seoTitle: Short title | Calon AI   # <title>; aim for 60 characters or fewer (defaults to "title | Calon AI")
description: ...                   # meta description and card text; 160 characters or fewer
category: chatgpt-guides           # a slug from categories.json
kind: Troubleshooting              # small label next to the category (optional)
tags: [ChatGPT, Errors]
date: 2026-11-13                   # published date
updated: 2026-12-01                # last updated (optional; shown and used for dateModified)
author: calon-team                 # a key in authors.json
featured: true                     # hub hero card (first featured article wins)
editorsPick: true                  # hub "Editor's picks" (up to 3)
trending: true                     # hub "Trending topics" (up to 5; curated until GA4 data exists)
cover: other-slug                  # optional; defaults to the article slug
coverAlt: Describe the cover image
canonical: https://...             # optional; only for content first published elsewhere
cta: automation                    # optional; which call-to-action band to show (default | automation)
related: [slug-a, slug-b]          # optional; the rest are filled in by category and tag overlap
draft: true                        # optional
takeaways:
  - Shown in a "Key takeaways" box at the top
sources:
  - Title of source | https://url
faq:
  - q: Question?
    a: Answer. Shown on the page, and output as FAQPage structured data that matches the visible text.
---
```

**Body:** use `##` and `###` headings (the H1 comes from `title`), paragraphs, lists, tables, fenced code, images (`![alt](src)` with an optional `*caption*` line straight after) and links. A blockquote that starts with `**Quick answer:**`, `**In short:**`, `**Note:**`, `**Tip:**` or `**Warning:**` becomes a styled callout. A table of contents is added automatically when an article has three or more `##` sections.

## Editorial standards

- **Sources:** verify facts against primary sources (official documentation, help centres, the provider's own announcements). List them under `sources`.
- **Dates:** say when facts were checked, especially prices. Update `updated:` whenever you make a material change.
- **Facts versus opinion:** label vendor benchmarks as the vendor's own claims, and keep opinion separate from fact.
- **House style:** UK English. No em dashes.

## Analytics and Search Console (prepared, not enabled)

There is no Google Analytics or Tag Manager on the site today, so nothing has been duplicated.

- **To turn analytics on:** add `gtmId` (preferred) or `ga4Id`, and optionally `googleSiteVerification`, in `content/resources/site.json`, then rebuild.
- **Consent:** the snippet defaults Google Consent Mode to *denied*. The current cookie bar ("I understand") is a notice, not a consent choice, so add a real accept/reject choice before switching storage on. That is a UK PECR requirement for analytics cookies.
- **Events:** the pages already push these events to `dataLayer`, ready for GA4 or GTM: `resources_search` (search_term, results), `resources_filter`, `cta_click`, `newsletter_signup` and `article_share`.
- **Search Console:**
  1. Verify the domain with a DNS record (covers every page), or use the meta tag above.
  2. Submit `https://calonaisolutions.com/sitemap.xml` and `https://calonaisolutions.com/sitemap-resources.xml`.
  3. Track impressions and clicks per article under Performance.

## Recommended CMS (not installed yet; needs a decision)

The site has no CMS, and there is no build step on deploy, so editing the Markdown files in GitHub currently also requires running the build. The recommended path, in order:

1. **A GitHub Action** that runs `tools/build-resources.mjs` whenever `content/resources/**` changes and commits the output. This makes any edit in GitHub publish automatically, and a scheduled daily run makes future-dated articles go live on their day.
2. **[Pages CMS](https://pagescms.org)** (free, open source, Git-based). It gives non-technical editors a web form for the same Markdown files: drafts, publish/unpublish, dates, categories, tags, SEO fields and image uploads. It only needs a `.pages.yml` config file in the repo plus the Pages CMS GitHub app. Decap CMS is an alternative but needs an OAuth service hosted somewhere.

Both keep the content in Git with full history, keep the site static and fast, and avoid a database.
