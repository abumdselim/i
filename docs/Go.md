# Intactic — TypeScript Migration: Handover + Plan

> **This file is the single entry point.** A brand-new agent in a brand-new session
> should be able to work from this file alone: it carries the full context, the current
> verified state, the rules, and the plan. It is **both the plan and the state**: a checked
> box means that task is done and verified. In a new session, **the first unchecked box is
> the next task.** After finishing a task: tick the box + add an entry to
> `docs/CHANGELOG.md` + git commit.
>
> Written 2026-11-02. If a lot of time has passed since, re-verify the state yourself with
> the commands in §2 — the numbers below were true on the day they were written.

---

## 1. What this project is (30 seconds)

**Intactic** — the corporate marketing site of a software engineering studio. Domain
`intactic.net`, local master folder `D:\The Intactic Atelier`.

- **19 pages:** Home, Capabilities, six capability pages (custom-software, ecommerce, erp,
  web-platforms, mobile-apps, automation), Products hub, four product pages (shamlai,
  pharmasys, pdfing-pro, icounsel), Approach, Engagements, Process, Studio (about),
  Contact, 404.
- **One design system:** one accent (#115fc8), no gradients, fixed opaque header (74px),
  a module-lattice graphic language, no stock photography. The rules live in
  `docs/DECISIONS.md` (D-01…D-12).
- **English copy** everywhere on the site; copy is frozen unless a task says otherwise.

## 2. Current state at a glance (2026-11-02, verified)

| Check | Result |
|---|---|
| Routes | 19 (all hand-written TypeScript, **zero** generated components) |
| `src/` | 52 files · 7,050 lines · zero `.html`/`.js`/`.jsx`/`.json` |
| `npm run verify` (sync+build+gate) | **19/19 routes, 0 errors** |
| `tsc --noEmit` | exit 0 |
| Visual diff | 114 image pairs, **0 failures**, max 0.043%, 74 pairs pixel-identical |
| Device pass | 60 flags — **byte-identical list on the legacy build**, zero regressions |
| Pipeline | Steps 0–4 done: frozen reference, TypeScript content, design system in the app, generator retired, lint + CI + hooks; step 5 (deployment) open |

## 3. How we got here — history

| Date | What happened | Evidence |
|---|---|---|
| earlier | The site was static HTML produced by a Python generator — `_build/build.py` wrote 19 files to the repository root from fragments + data (~226KB each, CSS/fonts/JS inlined) | `docs/DECISIONS.md` D-01, D-02 |
| 2026-11-01 | Conversion risk analysis (reveal, hydration, icons, fonts, URLs) → `next-app/` scaffold (Next 16.4.3, React 19.3.1, TS 5.9.3, `output:'export'`) → all 19 routes ported → parity gate built → browser verification | `docs/CHANGELOG.md`, 2026-11-01 |
| 2026-11-01 | Two reveal-gate flaws fixed: (1) a gate that could never open is no longer armed, (2) hydration can no longer strip the revealed state → `data-revealed` attribute + 1.5s watchdog | same entry |
| 2026-11-02 | Typed content layer: six capabilities + four products → two templates + one `[slug]` route; Products hub | same entry |
| 2026-11-02 | Home decomposed into nine sections; nine figures + the 42-cell plate became **geometry data** | same entry |
| 2026-11-02 | Last seven pages; zero generated components remain | same entry |
| 2026-11-02 | Visual diff + device pass | same entry |
| 2026-11-02 | **Step 0:** the legacy build frozen into `qa/reference/` with per-page digests, 114 screenshots beside it; the gate now judges against the frozen copy | `docs/CHANGELOG.md`, 2026-11-02 |
| 2026-11-02 | **Step 1:** all content is TypeScript — `capabilities.ts` · `products.ts` · `figures.ts` · `pages.ts`; JSON, `resolveJsonModule` and the three exporters are gone | same entry |
| 2026-11-02 | **Step 2:** `globals.css` and `icons.ts` are the source; `sync-assets.mjs` deleted, `build` is plain `next build` | same entry |
| 2026-11-02 | **Step 3:** `_build/` → `legacy/_build/`, root README rewritten, D-13 supersedes D-01/D-02 | same entry |
| 2026-11-02 | **Step 4:** eslint in `verify`, 9 real errors fixed, CI workflow, pre-commit hook, `qa:device:diff` | same entry |

**Everything in detail:** `docs/CHANGELOG.md` — every change has a why / what changed / what
was run. New work gets its entry there too (project rule D-11).

## 4. Architecture and file map

```
D:\The Intactic Atelier
├─ *.html, sitemap.xml, robots.txt     ← legacy generated site (still live on the domain; never edit)
├─ legacy/_build/                      ← the retired generator + the CSS/icons it fed (history)
│   ├─ tokens.css, styles.css, icons.svg, fonts/fonts.css
│   └─ cats.py, products.py            ← where the content came from
├─ docs/                               ← DECISIONS · DESIGN-SYSTEM · CHANGELOG · PAGES · PRODUCTS
│   └─ Go.md                           ← this file
└─ next-app/                           ← ★ the new site
    ├─ package.json                    scripts: dev · build · preview · verify · qa*
    ├─ next.config.ts                  output:'export', trailingSlash:false
    ├─ qa/                             ← reference/ = frozen legacy snapshot + baseline.json
    │                                  ← legacy/ + port/ = visual-diff screenshots (qa:capture)
    ├─ scripts/
    │   ├─ serve.mjs                   serves out/ and resolves clean URLs (8080)
    │   ├─ freeze-reference.py         step 0: copies the legacy build + records digests
    │   ├─ parity.py                   the one definition of "same text / same markup"
    │   ├─ gate.py                     parity gate (text + markup signature) — the judge
    │   ├─ capture.mjs / compare.py    visual diff (Playwright + Pillow)
    │   ├─ device-pass.mjs             device emulation pass (--legacy = baseline)
    │   └─ manifest.mjs                the typed route manifest, readable by node + gate.py
    ├─ public/                          assets/img/*, _redirects (static since step 2)
    └─ src/
        ├─ app/
        │   ├─ layout.tsx              theme+reveal bootstrap (first node in body), sprite, header/footer
        │   ├─ page.tsx                home → components/pages/home
        │   ├─ [slug]/page.tsx         the 10 templated routes (6 capabilities + 4 products)
        │   ├─ about|approach|contact|engagements|process|products|services/page.tsx
        │   └─ not-found.tsx
        ├─ components/
        │   ├─ bootstrap-script.ts     inline JS: no-js→js, theme, reveal gate (fail-open)
        │   ├─ IconSprite/Icon         the sprite once + typed icons (icons.ts owns IconName)
        │   ├─ SiteHeader/SiteFooter/SiteCta/Year/BriefForm
        │   ├─ sections/               PageHead(+MetaRail) · SystemMap · Figure(+Plate) ·
        │   │                          Blocks (SectionHead, DeliverableGrid, RulesList,
        │   │                          RelatedLinks, Panel, TagList)
        │   └─ pages/                  the bodies of all 19 routes — hand-written, typed
        ├─ lib/
        │   ├─ pages.ts                manifest, metadataFor(), navKeyFor()
        │   ├─ css.ts                  the Vars type (inline custom properties)
        │   ├─ fonts.ts                next/font/local (Barlow+Titillium, variable)
        │   └─ content/                capabilities · products · figures · pages — typed
        │                              literals; this is where content is edited now
        └─ styles/globals.css          **the design system, the source since step 2**
```

## 5. The decisions and why — a new agent will get this wrong without them

1. **`output: 'export'`** — the deploy artefact is still files (D-01). Consequence:
   `redirects()` does not work in `next.config` → legacy URLs are handled by the generated
   `public/_redirects`.
2. **One `globals.css`** — hashing classes (CSS Modules) would break `.ink-block .lead`,
   `.page-head + .section`, `html[data-theme="dark"] .logo--white`. CSS Modules are banned.
3. **Fail-open reveal gate** — the stylesheet holds `html.reveal-ready [data-reveal]{opacity:0}`;
   the class is armed **last**, by the same script that guarantees the observer. If
   IntersectionObserver is missing, or no record ever arrives (occluded webview), everything
   is revealed after 1.5s (`degraded`). The legacy `html.js` gate produced blank pages here.
4. **`data-revealed` attribute, not an `.in` class** — React owns every className declared in
   JSX; a class added before hydration is a mismatch React can undo, leaving an already-
   unobserved element at `opacity:0` forever.
5. **Fonts via `next/font/local` + variable** — D-02's base64-inlining was consciously
   dropped. The `--font-barlow`/`--font-titillium` classes must sit on `<html>`, not body
   (otherwise the whole site silently falls back to serif).
6. **The form is `mailto:`, no backend** (D-10) — no Server Action, no `action=` prop.
7. **Static pages stay RSC** — no client wrapper around `data-reveal` content; the reveal runs
   in one document-level script + MutationObserver.
8. **The sprite renders once** — in `layout.tsx`; per-page rendering duplicates ids.

## 6. Traps — each of these bit once, and will bite again

| Trap | Symptom | Rule |
|---|---|---|
| React hydration restores `className` | an element stuck at `opacity:0` forever | what the script sets is an attribute (`data-revealed`), not a class declared in JSX |
| React SSR inserts comments between adjacent text nodes | `A/01` becomes `A / 01` | `{`${a}/${b}`}` — one string, not three children |
| The plate cascade's `animation-delay` is not shortened | a screenshot shows 3 cells "missing" | captures settle 1.6s; `reducedMotion` shortens the duration, not the delay |
| Curly apostrophes (’) | ESLint complains / copy drifts | the built HTML is the copy source; write `’` directly in JSX, never `&apos;` |
| `--d`/`--i` fail TypeScript | the stagger silently dies | `css({ '--d': '.02s' })` — never delete the property |
| Static host resolves `/about` to a directory listing | preview breaks | use `scripts/serve.mjs` (not `python -m http.server`) |
| A missing icon is a blank box, no error | silent breakage | the `IconName` union — a name outside the sprite fails the build |

## 7. Old bugs — deliberately not fixed (the port preserves them)

| Bug | Where | Why not fixed |
|---|---|---|
| The `budget` field never reaches the mailto body | contact | D-10's copy contract stays; fixing it changes the message |
| Reduced motion leaves the lattice blank ~0.8s | a dead selector in styles.css (`.js .lat .cell-on`) | a pre-existing defect; would need a design decision |
| `shamlai` marks Products with `aria-current` | every product page | a legacy quirk, kept for parity |
| Footer links 18–23px tall (WCAG 2.5.8) | footer | needs a design change; identical on the legacy build |
| D-04 says "Archivo + Plex", the code uses Barlow + Titillium | docs | documentation drift — the code is the truth |

Fixing any of these is **a separate decision** — never mixed into a migration task.

## 8. The verification system — what exists, what each proves

| Tool | Invocation | Proves |
|---|---|---|
| `npm run verify` | sync → build → gate | it builds; on 19 routes text and markup match the legacy |
| `scripts/gate.py` | (inside verify) | text character-exact + markup signature (`tag.class` order) + sprite/id/anchor + token probes |
| `npm run qa:capture` | both builds (8081 legacy, 8080 port) | 228 frozen screenshots |
| `npm run qa:compare` | after capture | pixel diff (tolerance 12/255, failure >0.15%) |
| `npm run qa:device` | port (legacy: `--legacy`) | overflow, the 74px header, nav/burger per breakpoint, contrast, 24px targets |
| `npx tsc --noEmit --incremental false` | zero type errors | — |

**The gate is the judge.** After any refactor or edit, a red gate means regression — work is
not "done" until the gate passes. The text-parity threshold is **zero characters**.

## 9. Session start — the first 10 minutes

**Reading order:** this file (§1–§10) → `next-app/README.md` → `docs/DECISIONS.md` →
`docs/CHANGELOG.md` (last 5 entries). If design rules are needed: `docs/DESIGN-SYSTEM.md`.

**Four commands (in order; if any is red, do not start the plan):**

```powershell
cd next-app
npm run verify                          # expect: "ported: 19/19   errors: 0"
npx tsc --noEmit --incremental false    # expect: exit 0
python scripts/gate.py                  # expect: OK
node scripts/serve.mjs &                # preview http://127.0.0.1:8080
```

If red: not the plan — fix what is broken first. To diagnose why: the last entries of
`docs/CHANGELOG.md` + `git status` + `git log --oneline -5`.

**Servers:** 8080 = the new build (`out/`), 8081 = legacy (repository root) — the visual diff
needs both. They die with the agent session; restart them with the commands above.

**git warning:** the repository carries uncommitted changes predating the port (`_build/`,
root HTML) — those are not ours and must not be reverted. `next-app/` is a legitimate first
commit candidate.

## 10. Rules — editable vs untouchable

| Editable | Never |
|---|---|
| `next-app/src/**` (components, content, styles) | root `*.html`, `sitemap.xml`, `robots.txt` — legacy artefacts |
| `next-app/scripts/*` | `qa/reference/**`, `qa/legacy/**` — frozen baselines |
| `next-app/README.md`, `docs/*` | `_build/**` — the single source until steps 2–3 are done |
| `docs/CHANGELOG.md` (an entry per change) | `Undone.md` / `WIP-REDESIGN.md` — superseded notes |

Always: one step = one commit · "done" requires a green gate · site copy never changes ·
editing `_build/` content happens only by running the exporters.

## 11. The plan — step 0 to 5 (work starts here)

### Step 0 — freeze the reference (before everything, ~1–2h)

The gate's baseline is currently the living HTML in the root, which `_build/` produces.
Without freezing the reference first, retiring `_build/` blinds the parity check.

- [x] 0.1 Copy the 19 legacy HTML files into `qa/reference/` (root `*.html` → `qa/reference/<file>`)
      — done by `scripts/freeze-reference.py`; 4,460,424 bytes, every copy verified byte-for-byte
- [x] 0.2 `scripts/gate.py`: `LEGACY = pathlib.Path('qa/reference')` — the first run MUST be
      19/19, 0 errors (it is a copy, after all)
      — done as `APP / 'qa' / 'reference'` (cwd-independent); first run: **19/19, 0 errors**
- [x] 0.3 Record text hashes + markup signatures in `qa/reference/baseline.json`
- [x] 0.4 Copy the 114 baseline screenshots into `qa/reference/shots/` (from `qa/legacy/`)
- [x] 0.5 commit + `git tag ts-migration-start`
      — `cae65be` (218 files: the port, `qa/reference`, `docs/Go.md`, this log), tag
      `ts-migration-start`; the pre-port `_build/` and root-page edits stayed out of it

### Step 1 — content becomes TypeScript (~2–3h)

- [x] 1.1 `src/lib/content/`: `capabilities.json` → `capabilities.ts` (same values, typed via
      `satisfies`), likewise `products.ts`, `figures.ts`, `pages.ts`
      — generated from the JSON by machine, then compared value-for-value: all 19 routes,
      6 capabilities, 4 products, 9 figures, 42 plate cells, 5 industries, 4 stack groups identical
- [x] 1.2 Update imports; JSON imports and `resolveJsonModule` are no longer needed
      — four consumers read the manifest, so `scripts/manifest.mjs` is the one bridge:
      capture/sync import `PAGES`, gate/freezer ask node for `--json`
- [x] 1.3 One line of comment above every entry — from now on this is where content is edited
- [x] 1.4 Retire the exporters: run each one last, diff its JSON against the new `.ts`, then
      delete them only when identical
      — a fresh export from `_build/` reproduced all four files byte-for-byte (same sha256),
      then `export-*.py` and the JSON were deleted
- [x] 1.5 verify + tsc green; `qa:capture --only home` as a cheap render check
      — verify 19/19 · tsc 0 · home 6 pairs, 0 failures, 0.043% max (the pre-migration figure)

### Step 2 — the design system becomes the source (~2–4h)

- [x] 2.1 CSS: the synced `src/styles/globals.css` is **declared the source** (update the
      header comment); the two transforms (font vars, reveal gate) become permanent in the file
      — header rewritten; `git diff` on the file is 11 insertions / 3 deletions, all banner
- [x] 2.2 Icons: `icons.generated.ts` → `icons.ts` (hand-editable), `IconName` lives there
      — `git mv`; 12 import sites updated; 68 symbols unchanged
- [x] 2.3 Fonts: nothing to do
- [x] 2.4 Drop `sync` from the build script in `package.json`; delete `sync-assets.mjs`
      — `build` is now `next build`; `_redirects` is a static file and the gate fails if a
      manifest route has no rule there (negative test: removing `/erp.html` → 1 error)
- [x] 2.5 **Mandatory:** `git diff` shows globals.css content unchanged + `qa:compare` 114
      pairs, 0 failures
      — diff is the banner only; 114 pairs, **0 failures**, max 0.043%, 74 pixel-identical

### Step 3 — retire `_build/` (~1–2h)

- [x] 3.1 Decision: delete, or move to `legacy/` (**recommended: move** — it is content history)
      — moved to `legacy/_build/` with a `legacy/README.md` that says it is history and must not run
- [x] 3.2 The living site in the root: keep until deployment (step 5)
      — 19 pages, 404, `sitemap.xml`, `robots.txt` untouched
- [x] 3.3 Update the root `README.md`
- [x] 3.4 Prove with the gate: the only source is now `next-app/src`
      — `npm run verify` green **with `_build/` gone**; no script references `_build/` or `legacy/`
      except in comments
- [x] 3.5 A supersede entry in `docs/DECISIONS.md` for D-01/D-02
      — D-13, including why D-01 was right when it was written

### Step 4 — cleanup and CI (~1–3h, recommended)

- [x] 4.1 Delete `scripts/import-page.mjs`
- [x] 4.2 Add ESLint + `npm run lint`, include it in verify
      — flat config on `core-web-vitals`; 9 errors fixed (8 `<a>` → `next/link`, the header's two
      state-setting effects replaced with a derived `open` and `useSyncExternalStore` for the theme)
- [x] 4.3 CI: verify + qa:compare + qa:device on push
      — `verify` and `visual` jobs; the device step is `qa:device:diff` (60 known flags on both
      builds, so a plain `qa:device` could never be green)
- [x] 4.4 Pre-commit hook: typecheck + gate
      — `.githooks/pre-commit`, enabled with `git config core.hooksPath .githooks`
- [x] 4.5 Delete `Undone.md` / `WIP-REDESIGN.md` (superseded)

### Step 5 — deployment (a separate decision)

`next-app/out/` deploys to any static host (Netlify/Cloudflare Pages: `out/_redirects` works
out of the box; Vercel: cleanUrls; nginx: the rule in the root README). Step 3.2's decision
closes here.

## 12. Decision table — these need a human

| Question | Options | Recommendation |
|---|---|---|
| `_build/` | delete / move to `legacy/` | move |
| Content format | `.ts` / keep `.json` | `.ts` |
| The living site in the root | remove now / keep until deploy | keep until deploy |
| CI | yes / no | yes |
| The 60 footer tap-targets | fix now / later | a separate design task |

## 13. Risks

| Risk | Symptom | Prevention |
|---|---|---|
| Losing the reference | the gate stops catching anything | step 0 first, always |
| Character drift while moving content to TS | a text diff in the gate | 1.4: exporter-vs-ts diff |
| CSS changed while being moved | a failed visual diff | 2.5: byte-equal + 114 pairs |
| Two parallel sources | edited in one place, not the other | retire the old path at the end of every step |
| An agent skips the gate and declares "done" | a silent regression | this file's rule: the gate is the judge |

## 14. Command cheatsheet

```powershell
cd next-app
npm run dev            # http://localhost:3000
npm run preview        # http://127.0.0.1:8080   (serves out/, clean URLs)
npm run build          # sync → 20 static pages → out/
npm run verify         # build + gate
npm run qa             # capture → compare → device-pass
npx tsc --noEmit --incremental false
python scripts/gate.py
# the legacy server (for the visual diff, from the repository root):
python -m http.server 8081
```

## 15. Where to read what

| Question | Where |
|---|---|
| How the port works, which file comes from where | `next-app/README.md` |
| Design rules (colour, type, layout) | `docs/DESIGN-SYSTEM.md` |
| Decisions and reasons (brand level) | `docs/DECISIONS.md` |
| What changed, when | `docs/CHANGELOG.md` |
| The purpose of each page | `docs/PAGES.md` |
| Where product claims come from | `docs/PRODUCTS.md` |

---

**Last word:** with the gate green, slow is still progress. With the gate red, fast is still
regression.
