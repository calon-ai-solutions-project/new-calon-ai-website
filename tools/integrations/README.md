# Integration logos (About page, "Built around your stack")

`build.mjs` writes the logo SVGs to `project/assets/integrations/` and prints the tile markup
that sits inside `<div class="ig-grid">` in `project/about.html`.

```
cd tools/integrations
npm i --no-save simple-icons @iconify-json/logos
node build.mjs ../../project/assets/integrations grid.html   # then paste grid.html into about.html
```

Sources (both CC0): [Simple Icons](https://simpleicons.org/) and
[SVG Logos](https://github.com/gilbarbara/logos) by Gil Barbara (via `@iconify-json/logos`).
Entries with source `'file'` use official logo files supplied by Calon (trimmed PNGs named
`brand-*.png`, kept in `project/assets/integrations/`). Tools listed without a source keep their name in a matching tile, because neither library has a
verified logo for them. To add one, drop its official SVG in `project/assets/integrations/` and
point its entry at it.
