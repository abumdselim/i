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

## 2026-11-02 — Step 4: lint, CI and the last of the scaffolding

**Why:** With `_build/` retired the repo could build itself, but nothing stopped a broken commit:
no linter, no CI, no hook, and `scripts/import-page.mjs` plus two superseded notes still suggested
workflows that no longer existed.

**Changed:**
- `next-app/eslint.config.mjs` + `eslint`/`eslint-config-next` — flat config on
  `core-web-vitals`; `npm run lint`; `verify` is now build → gate → lint.
- Nine real lint errors fixed rather than silenced:
  - eight `<a href="/…">` internal links became `next/link` (`about`, `approach`, `engagements`,
    `not-found-body`) — same rendered markup, client-side navigation;
  - `SiteHeader` read the theme with a state-setting effect and closed the mobile menu with
    another. The theme is now `useSyncExternalStore` over `<html data-theme>` (the DOM is the
    store; the bootstrap script writes it), and the menu is open only on the route it was opened
    on (`openedAt === pathname`) — a navigation closes it as a fact, not as a follow-up render.
- `next-app/scripts/device-regress.mjs` + `npm run qa:device:diff` — the device pass exits 1 on 60
  problems that also exist on the legacy build, so CI compares the two lists and fails only on a
  problem the port introduces.
- `.github/workflows/ci.yml` — `verify` job (build · gate · lint · tsc) and a `visual` job that
  serves **`qa/reference`** on 8081 (the frozen baseline, not the working tree), runs capture and
  compare, then the device delta; heatmaps upload on failure.
- `.githooks/pre-commit` — types + gate before a commit; enabled with
  `git config core.hooksPath .githooks` (set on this clone).
- Deleted `next-app/scripts/import-page.mjs`, `Undone.md`, `docs/WIP-REDESIGN.md` — superseded.

**Verified:** `npm run verify` → build 20 pages, `ported: 19/19   warnings: 0   errors: 0`, eslint
clean; `npx tsc --noEmit` exit 0. Header behaviour re-tested in Chromium: theme light→dark with
`aria-pressed="true"`→light, mobile menu opens with `<body>` locked, and after navigating to
`/contact` `data-open="false"` with the scroll lock released. `qa:device:diff` → 60 problems on both
builds, none new, exit 0. Home visual check after the link/header changes: 6 pairs, 0 failures,
same 0.043%/0.031%/0.024% as before.

**Not run:** the full 114-pair diff for this step (the link swap and header state are covered by the
gate, the header test and the home capture); it runs after step 5. CI has not executed on GitHub —
no run has been observed.

---

## 2026-11-02 — Step 3: the legacy generator is retired

**Why:** `_build/` had stopped being a source in step 1 (content) and step 2 (design system), but it
still sat at the repository root looking authoritative — the README still told people to run it.
Leaving it there invites someone to edit the wrong file and see no effect.

**Changed:**
- `_build/` → `legacy/_build/` (moved, not deleted: it is the content history, and the CSS the port
  proved itself identical to). `legacy/README.md` states that nothing reads it and it must not run.
- `README.md` (root) — rewritten around the two artefacts: `next-app/` is the source, the root
  `*.html` is the output the domain serves today, `legacy/` is history.
- `docs/DECISIONS.md` — **D-13** supersedes D-01 and D-02: static export from Next.js, and what
  survives of D-02's reasoning (files on a host, self-hosted fonts, no CDN) versus what does not
  (base64 inlining).

**Verified:** with `_build/` already moved, `npm run verify` → `ported: 19/19   warnings: 0
errors: 0` and `npx tsc --noEmit` exit 0 — the build does not touch the old generator. `rg` over
`next-app/scripts` finds `_build` only inside comments and one baseline note. The root pages,
`sitemap.xml` and `robots.txt` are untouched.

**Not done:** deployment (step 5). `next-app/out/` still has no `robots.txt` or `sitemap.xml` — the
gap is recorded for step 5 rather than patched silently here.

---

## 2026-11-02 — Step 2: the design system becomes the source

**Why:** Every build re-copied the design system out of `_build/` and rewrote it with two
transforms. That made the legacy generator the owner of the CSS, the sprite and the fonts, and it
kept a sync script — the one place the port was allowed to diverge — in the critical path of every
build. The port has to own its design system before `_build/` can retire.

**Changed:**
- `next-app/src/styles/globals.css` — the header now declares it the source and records the two
  permanent divergences: font families resolve through `next/font`'s variables, and the reveal
  gate hangs off `html.reveal-ready` with `[data-revealed]` as the shown state.
- `next-app/src/components/icons.ts` (was `icons.generated.ts`) — hand-editable; the 68 symbols
  are unchanged and `IconName` still derives from them. Twelve import sites updated.
- `next-app/package.json` — `build` is plain `next build`; the `sync` script is gone.
- `next-app/scripts/sync-assets.mjs` — deleted.
- `next-app/public/_redirects` — a static file now, and `gate.py` fails when a route in the
  manifest has no rule there, so the redirects cannot drift from the routes.
- `next-app/README.md` — provenance table and build description follow.

**Verified:** `npm run build` → 20 static pages without a sync step; `python scripts/gate.py` →
`ported: 19/19   warnings: 0   errors: 0`; `npx tsc --noEmit` exit 0. `git diff` on
`globals.css` is 11 insertions / 3 deletions, all of them banner — no rule changed. Negative test
for the redirect check: deleting the `/erp.html` rule from `out/_redirects` produced
`_redirects: no rule for /erp.html`; restored, 0 errors. Visual diff after the change:
**114 pairs, 0 failures**, max 0.043%, 74 pixel-identical — unchanged, which is the point.

**Not run:** `qa:device`.

---

## 2026-11-02 — Step 1: the content layer is TypeScript

**Why:** Capability and product copy, the route manifest and the figure geometry were JSON files
produced by three Python exporters out of `_build/`. Every copy edit had to survive a generator
round-trip, and the app's only use for `resolveJsonModule` was to cast `string` icons into
`IconName` at runtime — a name outside the sprite reached the browser as a blank 20×20 box.

**Changed:**
- `next-app/src/lib/content/{capabilities,products,pages}.ts` — the exported values as typed
  literals, `satisfies` the existing interfaces, one comment line above every entry
  (`// 01 · /custom-software — Custom software; typical engagement: Platform build`).
- `next-app/src/lib/content/figures.ts` — the geometry moved in beside its interfaces: 9 figures,
  the 42-cell plate, 5 industries, 4 stack groups.
- `next-app/src/lib/content/index.ts` — the runtime icon guard and the `as unknown as` casts are
  gone; the union is checked at compile time now.
- `next-app/src/lib/pages.ts` — reads the manifest from `content/pages.ts` and re-exports its types.
- `next-app/scripts/manifest.mjs` — new, the one bridge for the four consumers that cannot import
  TypeScript: `capture.mjs` and `sync-assets.mjs` import `PAGES`, `gate.py` and
  `freeze-reference.py` call it with `--json`.
- Deleted `capabilities.json`, `products.json`, `figures.json`, `pages.json` and
  `scripts/export-content.py`, `export-figures.py`, `export-manifest.py`; dropped
  `resolveJsonModule` from `tsconfig.json` and the `manifest` npm script.
- `next-app/scripts/freeze-reference.py` — a re-run no longer overwrites the frozen screenshots
  (`--refresh-shots` is the explicit opt-in), so a capture cannot quietly move the visual baseline.

**Verified:** the `.ts` files were generated by machine from the JSON, never retyped, then compared
value-for-value in node: 6 capabilities, 4 products, 9 figures, 3 layers/42 plate cells,
5 industries, 4 stack groups, 19 routes — all identical, in the original order. Before deletion
each exporter was run once more from the repository root and reproduced every JSON byte-for-byte
(identical sha256). `npm run verify` → `ported: 19/19   warnings: 0   errors: 0`;
`npx tsc --noEmit` exit 0. Compile-time icon check: `i-custom` → `i-does-not-exist` failed with
`TS2322` at `capabilities.ts(18,5)`; restored, tsc 0. Full visual diff after the migration:
114 pairs, **0 failures**, max 0.043%, 74 pairs pixel-identical — the same figures as before —
and the re-captured screenshots are byte-identical to the frozen baseline.

**Note:** the plan read as if `pages.json` could simply be deleted. The gate, the capture script,
the sync script and the reference freezer all parsed it, so `scripts/manifest.mjs` was added
instead of leaving a second copy of the routes on disk.

**Not run:** `qa:device` after the change (rendering is unchanged — the pixel diff proves it).
Step 0.5 is included in the same commit, `cae65be`.

---

## 2026-11-02 — Step 0: the reference is frozen

**Why:** The gate compared every export against the root HTML — the living output of
`_build/`. A yardstick that can move proves nothing: regenerating the legacy site, or editing
a root page, changed the baseline silently, and retiring `_build/` (step 3) would have left the
parity check comparing the port with itself. Step 0 gives the gate a snapshot the port owns.

**Changed:**
- `next-app/qa/reference/` — the 19 legacy HTML files, copied byte-for-byte from the root
  (4,460,424 bytes total), plus `baseline.json`: per page the file digest, `<title>`, the
  normalised `<main>` text length and digest, and the markup-signature element count and digest.
- `next-app/qa/reference/shots/` — the 114 visual-diff baselines, copied from `qa/legacy/`
  (39.3 MB). `qa:capture` still writes to `qa/legacy/` + `qa/port/`; these copies are the
  frozen baseline.
- `next-app/scripts/freeze-reference.py` — repeatable freeze: copy, verify the bytes, record the
  digests, copy the shots. Re-running writes only files whose bytes differ.
- `next-app/scripts/parity.py` — the text/markup normalisation and digests the gate carried
  inline, extracted so the freezer and the gate cannot disagree about what "the same page" means.
- `next-app/scripts/gate.py` — `LEGACY` is now `qa/reference`; before judging, the gate verifies
  every frozen file against `baseline.json`, so a reference that drifts becomes an error instead
  of a quietly weaker test.

**Verified:** `python scripts/freeze-reference.py` → 19 pages frozen, 19 written, 114 shots,
0 byte mismatches, every page yielded `<main>` text and a markup signature.
`python scripts/gate.py` → `ported: 19/19   warnings: 0   errors: 0`, with all 19 text lengths
identical to the pre-change run (6545, 2320, 4735, 4527, 4296, 2777, 177, 2154, 1780, 2998,
2850, 2670, 2597, 2608, 2730, 2848, 2902, 2676, 2641). `npx tsc --noEmit` exit 0.
Negative test: `Intactic` → `Intactix` in the frozen `index.html` produced two errors
(`frozen reference drifted from baseline.json`, `<title> differs`), and the restored file hashes
to `234835c19179…`, identical to the root file.

**0.5, same day:** committed as `cae65be` and tagged `ts-migration-start` — 218 files (the port,
`qa/reference`, `docs/Go.md`, this log). The pre-port edits to `_build/` and the root pages stayed
uncommitted, as the git warning in §9 of docs/Go.md requires. `qa:compare` was not re-run for this
step — it reads `qa/legacy/` and `qa/port/`, whose paths step 0 does not touch.

---

## 2026-11-02 — Visual diff and device pass

**Why:** Text and markup parity prove the page says the same thing; they do not prove it
looks the same. The remaining risk was rendering — fonts resolving, SVG geometry, spacing —
and the measurable accessibility floors at three widths.

**Changed:**
- `next-app/scripts/capture.mjs` — captures 19 routes × 3 widths (390/834/1440) × 2 themes
  from both builds with reduced motion, the theme set through localStorage before page
  scripts, fonts awaited, and a 1.6s settle so the plate cascade cannot be caught mid-stagger.
- `next-app/scripts/compare.py` — Pillow pixel comparison with a channel tolerance of 12 and
  a failure threshold of 0.15% of the page; writes a heatmap and the bounding box per failure.
- `next-app/scripts/device-pass.mjs` — 10 routes × 3 viewports: horizontal overflow, the 74px
  header contract, nav/burger per breakpoint, WCAG AA contrast on body copy, and 24×24 target
  size. `--legacy` runs the same probe against the old build for a baseline.
- `next-app/package.json` — `qa:capture`, `qa:compare`, `qa:device`, `qa`.

**Verified:** 114 screenshot pairs, **0 failures**; max difference 0.043%, mean 0.003%, 74
pairs pixel-identical, and every pair had an identical page height. Device pass: 60 problems,
**the same 60 on the legacy build** (footer links 18–23px tall), so zero regressions.

**Fixed during the work:** the first home capture showed three plate cells as missing. It was
the cascade animation still running at capture time — reduced motion shortens the duration but
not the `animation-delay` — not a layout difference. The settle wait removed it (0.080% →
0.031%), and the episode is why the tolerance is low: a real defect is an order of magnitude
larger.

**Not verified:** a real device, iOS Safari, throttled CPU/network. Emulation only.

---

## 2026-11-02 — The last seven pages; no generated component left

**Why:** After the templated pages and the home page, seven components were still the
mechanical `import-page.mjs` output: valid TSX, but one long return each, no typed arrays,
and every icon spelled out as an inline `<svg><use></svg>`. Until they were decomposed, the
port could not honestly be described as hand-written TypeScript.

**Changed:**
- `next-app/src/components/pages/{process,engagements,approach,about,services,contact,not-found-body}.tsx`
  — rewritten in place with typed content arrays (`STEPS`, `MODELS`, `FAQ`, `PRINCIPLES`,
  `STATS`, `CONTACT_LINES`, `NEXT_STEPS`, …), `<Icon>` instead of inline icon markup, and
  `<Figure>` for the engagement lattices. Export names, file paths and `<main id="main">`
  unchanged, so no route file moved.
- `next-app/src/components/BriefForm.tsx` — the last hand-written inline icon replaced with
  `<Icon name="i-arrow" />`.

**Process note:** two of the four delegated writers reported failure *after* writing their
files. Neither was trusted: the gate re-checked all seven pages from the built output, which
is why the work stands.

**Verified:** `npm run build` → 20 static pages; `python scripts/gate.py` → 19/19 routes,
0 errors, with text parity at a zero-character threshold **and** markup-signature parity on
all seven pages; `tsc --noEmit` exits 0. Rendered checks: every page has one `<main>`, exactly
one `aria-current` (`Process`, `Engagements`, `Approach`, `Studio`, `Capabilities`, `Contact`,
none on 404), four `<details>` on engagements and three on contact, and on `/contact` the
form still hides its status on an invalid submit, shows and focuses it on a valid one, while
`<details>` opens and closes by clicking its summary.

**Not yet:** visual diff against the legacy screenshots, real-device pass.

---

## 2026-11-02 — Home page decomposed; figures become data

**Why:** The home page was the last large generated component and the worst offender: nine
module-lattice figures inlined as hundreds of `<rect>` coordinates, plus three sections the
Python build injected into the fragment (products, industries, stack). A coordinate could
not be reviewed, and the same lattice language was duplicated on every page that used it.

**Changed:**
- `next-app/scripts/export-figures.py` — parses the exact SVG strings `_build/build.py`
  produces back into geometry (9 figures, 434 rects, 42 plate cells) and exports the
  `INDUSTRIES` / `STACK` rows to `src/lib/content/figures.json`. Nothing is re-derived, so
  the drawing cannot drift.
- `next-app/src/components/sections/Figure.tsx` — one `Figure` component and one `Plate`
  component render any lattice from that data.
- `next-app/src/components/pages/home/{Hero,Sections,index}.tsx` — nine sections with typed
  content arrays; `Sections.tsx` reuses the shared `SectionHead` (extended with an optional
  `titleId` so the legacy anchor ids survive).
- `next-app/scripts/gate.py` — unchanged; it is what made the swap provable.

**Verified:** `npm run build` → 20 static pages; gate 19/19 routes, 0 errors, with text and
markup-signature parity on the home page. In the browser: 9 figures with 434 rects, 42 plate
cells (21 lit), geometry sane, 8 sections, 7,368 characters of text — the same numbers the
legacy page produces.

**Not yet:** services, approach, engagements, process, about, contact, 404 (7 of 19).

---

## 2026-11-02 — Typed content layer for the ten templated pages

**Why:** The ported pages were generated JSX: valid TypeScript, but each one a single long
`return`, with its copy inlined and ten files that differed only in content. A content edit
meant editing markup ten times, and a typo in an icon name rendered a blank square with no
error. The point of the migration was to stop that class of drift, not to reproduce it in a
new directory.

**Changed:**
- `next-app/scripts/export-content.py` — exports `_build/cats.py` and `_build/products.py`
  to `src/lib/content/*.json`, decoding HTML entities and splitting `meta` values into a
  text/link discriminated union instead of passing HTML through the data layer.
- `next-app/src/lib/content/{types,index}.ts` — the schema (`PageContent`,
  `CapabilityContent`, `ProductContent`, `MetaValue`) plus accessors. Icon names are
  resolved against the sprite at module load, so an unknown name fails the build.
- `next-app/src/components/sections/{PageHead,SystemMap,Blocks}.tsx` — the section
  primitives: head with meta rail, the nine-cell system map, section head, deliverable
  grid, rules list, related links, stack panel.
- `next-app/src/components/pages/{CapabilityPage,ProductPage,ProductsHub}.tsx` — three
  components replacing ten generated page files.
- `next-app/src/app/[slug]/page.tsx` — one route for six capabilities and four products,
  with `generateStaticParams` and `dynamicParams = false`.
- `next-app/scripts/gate.py` — now also compares a **markup signature** (`tag.class` for
  every element under `<main>`, in document order), so a refactor cannot quietly drop a
  wrapper or rename a class while the text still matches.
- `next-app/README.md` — documents the content layer and the new gate check.

**Verified:** `npm run build` → 20 static pages; `python scripts/gate.py` → 19/19 routes,
0 errors, with text parity at a zero-character threshold **and** markup-signature parity on
every route; `tsc --noEmit` exits 0. Rendered checks on `/erp`, `/icounsel` and `/products`
confirm one `aria-current` per page (`Capabilities`, `Products`, `Products`), the expected
section sequence and the CTA outside `<main>`. The ten generated page components and their
route folders were deleted only after the gate passed on the templated version.

**Not yet:** home, services, approach, engagements, process, about, contact and 404 are
still the generated components (8 of 19 routes).

---

## 2026-11-01 — Reveal gate can no longer blank a page

**Why:** The ported site rendered white in the embedded preview panel: the document and
`<title>` loaded, nothing painted. The reveal gate holds `[data-reveal]` at `opacity:0`
until an IntersectionObserver marks it, and that webview loads the document without ever
delivering an intersection record — so the gate never opened. A second, quieter fault sat
underneath: the revealed state was a `.in` class on elements whose `className` React owns,
so a class added before hydration is a hydration mismatch React can undo, leaving an
already-unobserved element stuck at `opacity:0`.

**Changed:**
- `next-app/src/components/bootstrap-script.ts` — the revealed state is now the
  `data-revealed` attribute, which no JSX declares and hydration cannot touch; a missing
  IntersectionObserver or MutationObserver returns before the gate is armed; a 1.5s
  watchdog reveals everything and marks the run degraded when no record arrives, so later
  mounts skip the gate too.
- `next-app/scripts/sync-assets.mjs` — rewrites `[data-reveal].in` to
  `[data-reveal][data-revealed]` and asserts the selector it found is the one it expected.
- `next-app/README.md` — the divergence listed as (1) now describes the attribute and the
  watchdog.

**Verified:** both fallback paths exercised in the browser — deleting
`IntersectionObserver` leaves `reveal-ready` unarmed with 0 elements hidden; an observer
that never calls back hides 49 and reveals 49 after the watchdog. A full scroll walk
leaves 0 pending, `npm run verify` reports 19/19 routes and 0 errors, and the dev log
shows no className diff or hydration warning since the change.

---

## 2026-11-01 — TypeScript + Next.js port (`next-app/`)

**Why:** The site was a generated static build with a hand-rolled IIFE for theme, menu and
scroll reveal. A typed implementation was requested so pages can grow without the Python
generator and so routing, metadata and component boundaries are compile-checked.

**Changed:**
- `next-app/` — App Router project, React 19 / Next 16, `output: 'export'` so the deploy
  artefact stays static files, as in D-01/D-02.
- `next-app/scripts/sync-assets.mjs` — copies `_build/tokens.css`, `styles.css`, the five
  base64 faces and `icons.svg` into the app. This is the only place the port may diverge,
  and it asserts what it expects: fonts become `var(--font-barlow)` /
  `var(--font-titillium)`, and the reveal gate moves from `html.js` to
  `html.reveal-ready`, armed last by the script that also unhides.
- `next-app/scripts/export-manifest.py` — `PAGES` → `src/lib/pages.json`; titles and
  descriptions are copied, never re-derived through `meta_desc_from()`.
- `next-app/scripts/import-page.mjs` — legacy `<main>` fragment → typed server component
  (`class`→`className`, SVG attribute casing, `style`→`css({})`, `.html` hrefs→routes).
- `next-app/scripts/gate.py` — route-by-route parity gate: `<main>` text at a zero-character
  threshold, `<title>`, sprite targets, duplicate ids, orphan anchors, bootstrap order,
  design-token probes in the emitted CSS, `_redirects` present.
- `next-app/public/_redirects` — 301 from the 19 flat `*.html` URLs to the new routes.
- `docs/CHANGELOG.md` — this entry.

**Verified:** `npm run verify` → sync-assets, `next build`, 19/19 routes, 0 errors.
`<main>` text is character-identical to the legacy pages on all 19 routes. Browser pass on
`/`: fonts resolve to `titillium` (not the fallback), `body` padding 74px, 68 symbols
once, `--accent` `#115fc8`; after a scroll walk 0/49 reveals stay hidden; client
navigation to `/approach` keeps the document, sets one `aria-current`, and reveals 0
hidden after scrolling; theme toggles to `#070d16` and persists; the menu opens with
focus inside, Escape closes it, restores `body` overflow and returns focus to the burger.

**Not verified:** no visual diff against the legacy screenshots yet, no real-device pass,
and the host redirects were not exercised (only generated).

---

## 2026-11-01 — Schematic figures on the home capability cards

**Why:** The six cards under "Six disciplines, one engineering standard." carried only an
icon tile and a number — the one card set on the site with no drawing. The engagement
cards already speak in the module language; the capability cards now use the same one,
one schematic per discipline, so the section reads as a set rather than a list.

**Changed:**
- `_build/build.py` — six `FIG_CAP_*` figures built with `fig_modules()`, plus the
  `{{FIG_CAP_*}}` replace chain: C/01 base plus interface bus, C/02 two vendor stacks
  into a marketplace, C/03 domain cluster into one record bar, C/04 dashboard skeleton,
  C/05 device into a dashed offline zone and a sync core, C/06 input into a machine with
  an automated lane and a reviewed lane. C/01's module sits at columns 7–8 rather than
  6–7, so the three-wire bus reads as a gap instead of the outline of an empty cell.
- `_build/pages/index.html` — each card's `.cap__top` (tile plus number) replaced by a
  full-bleed `.cap__fig` strip; the number moves to the strip's top-left corner.
- `_build/styles.css` — `.cap` takes a `--pad` variable; new `.cap__fig` rules (bleeds to
  the card edge, `--bg-3` ground, hairline foot, and a 22–26px bottom margin so the
  strip does not sit flush against the card's heading). `.fig .cell-soft` gains a 1px
  `--accent` hairline at 30% opacity: `--accent-tint` on `--bg-3` is a 5/255 step, so the
  tinted core of every figure was invisible — here and on the engagement figures.
- `docs/DESIGN-SYSTEM.md` — capability-card row updated.

**Verified:** `python _build\build.py` exits 0. Built `index.html` holds exactly six
`cap__fig` blocks, each with one `<svg>`, and no `{{` placeholder survives. Zero
`gradient` declarations in the page (the single match is the pre-existing CSS header
comment). Headless Edge at 1440 / 1000 / 820 / 680 / 472 px: cards lay out 3 / 2 / 2 / 2 / 1
per row as the CSS declares, and `scrollWidth` equals `clientWidth` at every width — no
horizontal overflow. Light and dark themes inspected; `services.html` capability cards
are unchanged. Page weight 262.6 KB → 280.4 KB (+17.4 KB), above the 5 KB estimate
because each figure is 48 module rects written into the markup.

---

## 2026-11-01 — Adopt the Barlow + Titillium Web type system

**Why:** The company issued an authoritative typography spec (Barlow for body/UI,
Titillium Web for display, five Latin weights, no italics). It replaces Geist.

**Changed:**
- `_build/fonts/fonts.css` — exactly five base64 WOFF2 faces: Barlow 400/500/600,
  Titillium Web 600/700. IBM Plex Mono removed; mono is now the system stack.
- `_build/tokens.css` — `--font-sans`, `--font-display`, `--font-mono` plus the spec's
  fluid scale (`--text-sm` … `--text-h1`, rem + vw).
- `_build/styles.css` — display/H1–H4, lead, body and buttons rewired to the tokens;
  heading tracking relaxed to `-.01em`, leading to the spec values; body copy moved to
  17–18px; every label/caption raised to the 14px floor; icon buttons to 44px targets;
  `:lang(bn)` tracking/leading rules added.
- `docs/TYPOGRAPHY-SPEC.md` — the issued spec, kept verbatim, with the static-build
  adaptation note, the measured font budget (90,824 B of Latin WOFF2) and a changelog row.
- `docs/DESIGN-SYSTEM.md`, `docs/README.md` — typography sections rewritten.
- Page weight rose from ~197 KB to ~241 KB because five static faces are inlined instead
  of one variable file; the trade is the spec's five exact weights.

**Verified:** built pages contain exactly 5 `@font-face` blocks, zero `IBM Plex Mono`
references, zero requests to `fonts.googleapis.com` / `fonts.gstatic.com`; `--text-base`
and `var(--font-display)` are present in the compiled CSS.

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
