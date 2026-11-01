# Intactic — corporate website

Static, multi-page marketing site for **Intactic**, a software engineering studio
(intactic.net). Every page is self-contained: CSS, JavaScript and both typefaces are
inlined, so the site renders identically offline and on any static host.

- **Live domain:** intactic.net
- **Repository:** github.com/abumdselim/refined-intactic
- **Local master copy:** `D:\The Intactic Atelier`
- **Pages:** 19 (see [docs/PAGES.md](docs/PAGES.md))
- **Design system:** [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)
- **Design tokens:** [docs/TOKENS.md](docs/TOKENS.md) · [tokens.json](docs/tokens.json)
- **Typography (authoritative):** [docs/TYPOGRAPHY-SPEC.md](docs/TYPOGRAPHY-SPEC.md)
- **Decisions:** [docs/DECISIONS.md](docs/DECISIONS.md)
- **History:** [docs/CHANGELOG.md](docs/CHANGELOG.md)
- **Product facts:** [docs/PRODUCTS.md](docs/PRODUCTS.md)

## How the site is built

The HTML files in the repository root are **generated**. The editable source lives in
`_build/`.

```
_build/
  styles.css        design tokens, components, responsive rules
  app.js            theme toggle, mobile menu, reveal, form handling
  icons.svg         the 37-symbol SVG sprite
  pages/*.html      body fragments for editorial pages
  cats.py           copy + data for the six capability pages
  products.py       copy + data for the four product pages
  catpage.py        capability page template
  prodpage.py       product page template, products hub, home band
  build.py          assembles head, header, footer, CTA and writes the pages
  tokens.css        design tokens (single source), prepended at build
  tokens_doc.py     writes docs/TOKENS.md and docs/tokens.json from tokens.css
  fonts/fonts.css   Barlow 400/500/600 + Titillium Web 600/700, base64
```

Build:

```powershell
cd "D:\The Intactic Atelier"
python _build\build.py
```

The build writes all pages to the repository root. It fails loudly if a template
placeholder is missing, and it rewrites the typographic apostrophes in body copy.

## Adding a page

1. Add a body fragment in `_build/pages/<name>.html` (start from an existing page).
2. Register it in `PAGES` in `_build/build.py` with a title, description and `active`
   key for the navigation.
3. Run the build. Add the URL to `sitemap.xml`.
4. Add a changelog entry.

Capability and product pages are data-driven: edit `_build/cats.py` or
`_build/products.py` instead of writing HTML.

## Deployment

Any static host works. The canonical target is Cloudflare Pages or a plain bucket in
front of `intactic.net`.

- `404.html` is the not-found page (marked `noindex, follow`).
- `robots.txt` points to `sitemap.xml`.
- Social preview image: `assets/img/og-1200x630.png` (1200×630).
- No build step is required at the host: the repository root is the deployable artefact.

## Constraints that must not be broken

1. **No gradients.** Anywhere. Check with a computed-style sweep after changes.
2. **Header is opaque and fixed** on every device.
3. **Light mode is the default**; the dark theme is opt-in and stored per browser.
4. **No emoji as UI.** Icons come from the SVG sprite only.
5. **No invented metrics or client names.** Claims are either evidenced in a repository
   or stated by the owner.
6. **No external runtime dependencies** — no CDN, no webfont fetch, no analytics script.

## Ownership

Code, design and copy: Intactic. Product facts for Shamlai, Pharmasys, Pdfing Pro and
iCounsel are documented in [docs/PRODUCTS.md](docs/PRODUCTS.md) with their sources.
