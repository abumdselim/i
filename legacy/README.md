# legacy — the retired static build

**Nothing here is wired to a build, a test or a deploy. It is history.**

Until 2026-11-02 this folder was `_build/` at the repository root: a small Python generator
(`build.py`, `catpage.py`, `prodpage.py`, `sections.py`, `cats.py`, `products.py`) that wrote the
19 HTML files now sitting in the repository root, plus the design system it pulled from
(`tokens.css`, `styles.css`, `icons.svg`, `fonts/fonts.css`).

It was retired in three steps, each recorded in `docs/CHANGELOG.md`:

1. the content moved into typed TypeScript (`next-app/src/lib/content/`), so the JSON exporters
   and then `cats.py` / `products.py` stopped being the source;
2. the design system moved into the app (`next-app/src/styles/globals.css`,
   `next-app/src/components/icons.ts`, `next-app/src/fonts/`), so the sync step stopped running;
3. this folder moved here, and the gate proved the app no longer reads it.

**Why keep it:** it is the content history. `cats.py` and `products.py` hold the copy as it was
written and reviewed, and the CSS here is the stylesheet the port proved itself identical to. If a
sentence on the live site is ever questioned, this is where to look — and the
`qa/reference/` snapshot in `next-app/` is where to see what it rendered as.

**Do not run it.** It was written to expand into the repository root, and running it from here
would write wherever its relative paths now point. The site is built in `next-app/`.
