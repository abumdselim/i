# Implementation log

Every meaningful change to the site, newest first. Entries are factual: what changed,
why, and which files were touched. Add a new entry for every subsequent change — this
file is the project's memory.

Format:

```
## YYYY-MM-DD — short title
**Why:** the problem or request
**Changed:** files and areas
**Verified:** what was actually run and observed
```

---

## 2026-11-01 — Design tokens extracted and documented

**Why:** Tokens lived only inside the compiled stylesheet, so a designer or a future
framework had no reference for them, and documentation could drift from the CSS.

**Changed:**
- `_build/tokens.css` — new single source for all 26 tokens (light + dark blocks).
- `_build/styles.css` — token blocks removed; the build now prepends `tokens.css`.
- `_build/tokens_doc.py` — parses the token file and writes `docs/TOKENS.md` and
  `docs/tokens.json` on every build, so the reference cannot go stale.
- `docs/TOKENS.md` — colour tables per group with light/dark values and roles, type scale,
  space and layout, border/shadow/motion rules, breakpoints, and how to change the brand
  colour.
- `docs/README.md` — token links added; `_build/` tree updated.

**Verified:** build reports 26 tokens documented; `docs/tokens.json` parses; the inlined
CSS on every page still carries `--accent:#115fc8`; token extraction changed no rendered
value (same declarations, different file).

---

## 2026-11-01 — Stack section, logo wall and a curated stack

**Why:** The client wanted an Industries and a Stack section in the spirit of the
reference site, then questioned whether every listed technology was a defensible modern
choice.

**Changed:**
- Stack section rebuilt as three-per-row tiles with official technology marks (Simple
  Icons SVGs embedded in the sprite, monochrome, `currentColor`), grouped in four
  labelled blocks.
- Stack curated: Cloudflare D1 and R2 removed — they are vendor SKUs, not stack
  categories, and D1 duplicates SQLite. Meilisearch added (used in the commerce stack).
  Groups renamed to "Frameworks & runtimes" and "Data & storage" because Node is a
  runtime and Prisma is an ORM.
- Removed the closing line about .NET/Java/PHP retraining: defensive, and it lowered the
  register of the section.
- Industries: five sectors plus a CTA cell, moved to the home page; the duplicated band
  on `products.html` removed.
- Card index badges (C/01, P/01, MODEL 01) and the matching page-head indices removed;
  the system-map bars now read "Fig.".
- Footer logo bug: both logo variants rendered because the light/dark rules were scoped
  to `.brand`. Rules are now global (`.logo--white` hidden in light mode).
- Hero: the "Software engineering studio" eyebrow removed.
- Display headings switched from "&" to "and"; typeface moved from Archivo to Geist.

**Verified:** 23 stack tiles render with 23 marks; one logo variant visible per theme;
zero broken local links; Geist loaded and covers `&`; no horizontal overflow at 426 px.

---

## 2026-11-01 — Typeface, hero, industries and stack

**Why:** The Archivo ampersand read as a mismatched glyph in display headings, the
typeface felt short of the corporate bar, the hero carried a redundant label, and the
site lacked the industries and stack sections the client asked for.

**Changed:**
- Typeface replaced: Geist variable (400–700, latin subset, 29 KB) now carries display and
  body; IBM Plex Mono stays for labels. Tracking retuned for the new metrics
  (`-.025em` display, `-.024em` h2, `-.016em` h3).
- Display headings use "and" instead of "&" (ERP and operations, Automation and models,
  Assessment and augmentation). Ampersands remain in small labels only.
- Home hero: the "Software engineering studio" eyebrow removed; the headline now opens
  the page.
- New **Industries** section on the home page: five sectors plus a call-to-action cell.
- New **Stack** section on the home page: four columns (languages, frameworks, data,
  infrastructure) with a note about working in the client's existing stack.
- `products.html` no longer repeats the industries band; that content now lives once, on
  the home page.
- `_build/prodpage.py` was rebuilt after a patch duplicated `prods_hub` four times; the
  file now defines each function once.
- New `_build/sections.py` for the industries and stack sections.

**Verified:** build writes 19 pages; link checker reports zero missing targets; Geist
reports as loaded and covers `&`; the home page renders both new sections at 473 px with
no horizontal overflow.

---

## 2026-11-01 — Products, documentation and repository

**Why:** The studio's four own products (Shamlai, Pharmasys, Pdfing Pro, iCounsel) were
not represented on the site, and the project needed a written record of every
implementation.

**Changed:**
- `_build/products.py` — new data file: positioning, problem, system map, six features,
  engineering rules, stack and audience for each product; industry list.
- `_build/prodpage.py` — new product template, products hub generator and home band.
- `_build/build.py` — imports the above; adds the `Products` nav item, the hub and four
  product pages; adds a Products column to the footer; replaces `{{PRODUCTS_HOME}}` in
  the home page.
- `_build/styles.css` — product cards (`.prods`, `.prod`), industry grid (`.inds`),
  product head actions; nav padding tightened for seven items; footer grid widened to
  five columns.
- `_build/pages/index.html` — product band inserted between the intelligence and process
  sections.
- `_build/pages/404.html` — new not-found page.
- `_build/og.py` — generates `assets/img/og-1200x630.png`.
- `robots.txt`, `sitemap.xml` — new.
- `_build/build.py` — meta descriptions now derive from the first sentence of a lead;
  `og:image`, `twitter:image` and per-page `robots` added.
- `docs/` — this documentation set.

**Verified:** build writes 19 pages; link checker reports zero missing local targets;
no `AI` badge wording remains in visible copy; product pages render with system maps and
six features each.

---

## 2026-11-01 — Section pages, colour rhythm, copy pass

**Why:** The site read as one long page and the writing sounded like generic software
marketing. Each section needed its own page, and the palette needed tonal structure
instead of white on white.

**Changed:**
- Split Approach, Engagements and Process out of the home page into `approach.html`,
  `engagements.html`, `process.html`; capability pages became six dedicated pages.
- Rewrote all copy in a corporate, human register; removed AI-hype vocabulary
  ("AI-first", "AI-powered", "cutting-edge", "seamless", "unlock") from the site.
- Surface system: tinted page heads and hero (`--bg-2`), alternating bands, tinted
  footer; no two adjacent sections share a surface.
- Typography: display scale raised to 4.35rem, tracking tightened to `-.03em`, leading
  to `.96`; lead and body re-tuned; smart apostrophes applied at build time.
- Footer rebuilt with five columns.

**Verified:** 375 / 768 / 1440 checks; no horizontal overflow; computed background sweep
confirms the tint order (mist → white → ink → mist).

---

## 2026-11-01 — Header behaviour and brand assets

**Why:** The client required a fully opaque header, fixed on every device, and the
supplied logo files were 11,000px wide, which is unusable on the web.

**Changed:**
- `.head` changed from sticky+translucent to `position: fixed`, solid `--bg`, no blur;
  `body` gained `padding-top: var(--head-h)`.
- Logo PNGs trimmed to their alpha bounds and resized to 527×80 (9.9 KB / 6.1 KB);
  favicons generated from the backgroundless brand mark (512/180/64/32).
- `color-scheme` set per theme so native controls follow.

**Verified:** computed styles report `position: fixed`, `background: rgb(255,255,255)`,
`backdrop-filter: none`; no layout shift when the theme changes.

---

## 2026-11-01 — First complete build

**Why:** Initial delivery of the corporate site.

**Changed:**
- Design system in `_build/styles.css` (tokens, type, header, footer, sections, forms,
  motion), interactions in `_build/app.js`, 37-symbol sprite in `_build/icons.svg`.
- Generator `_build/build.py` with shared head, header, mobile menu, CTA and footer.
- Pages: home, capabilities, approach, engagements, process, studio, contact.
- Brand assets downloaded, optimised and referenced; fonts embedded as base64.
- Product-agnostic system plate on the home page: three cascading module rows
  (interface, intelligence, data) drawn in CSS on a 14-column grid.

**Verified:** fonts report as loaded; theme toggle, mobile menu and Escape close work;
anchor navigation and skip link work; zero gradients in computed styles.

---

## Conventions for future entries

- One entry per working session, not per file.
- State the request that caused the change, not just the change.
- Name the files; a future reader should not have to search.
- Under **Verified**, only write what was actually executed. "Checked visually" is not
  the same as "measured", and neither is "should work".
- If a change was not verified, say so explicitly.
