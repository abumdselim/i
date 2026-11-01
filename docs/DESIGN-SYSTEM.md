# Design system

The visual language is drawn from the brand mark: a plus built from offset squares.
That module — one square, repeated at a fixed pitch — is the organising idea for
layout, diagrams and motion. Everything else stays quiet.

## Principles

1. **One blue, one ink, paper.** The palette is deliberately narrow; weight comes from
   scale, spacing and hairlines, not from colour variety.
2. **Structure is drawn, not decorated.** Rules, ticks, mono labels and module grids
   carry information. Nothing is ornament for its own sake.
3. **Flat surfaces.** No gradients, no glows, no shadows. Depth comes from tonal steps.
4. **Typography does the talking.** Two typefaces, three weights, deliberate tracking.
5. **One bold move per screen.** Usually the plate or the dark band; everything around
   it is disciplined.

## Colour tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#ffffff` | `#070d16` | page surface |
| `--bg-2` | `#f3f6fa` | `#0b1420` | tinted band, page head, footer |
| `--bg-3` | `#e8eef6` | `#101b29` | inset figure grounds |
| `--surface` | `#ffffff` | `#0a121e` | cards, plates |
| `--ink` | `#0a1626` | `#edf2f9` | primary text |
| `--ink-2` | `#17293e` | `#d2deec` | strong secondary text |
| `--muted` | `#54677e` | `#9babc0` | body secondary text |
| `--muted-2` | `#5f7189` | `#8496ab` | mono labels, metadata |
| `--line` | `#e2e8f0` | `rgba(255,255,255,.10)` | hairline |
| `--line-2` | `#c9d4e2` | `rgba(255,255,255,.22)` | strong hairline |
| `--accent` | `#115fc8` | `#2c74ce` | brand blue, primary action |
| `--accent-ink` | `#0c4a9e` | `#82b6f2` | blue text on light surfaces |
| `--accent-tint` | `#e9f1fb` | `rgba(44,116,206,.16)` | soft brand wash |
| `--ink-surface` | `#0a1626` | `#0d1826` | the dark band |

Contrast: body text on its surface is ≥ 6:1; large display text ≥ 7:1; blue on white
6.0:1. Never place `--muted-2` below 10px.

**Surface rhythm.** No two adjacent sections share a surface. The sequence alternates
paper → mist → ink. Cards and plates are always white, and always sit on a tinted band.

## Typography

Governed by [`TYPOGRAPHY-SPEC.md`](TYPOGRAPHY-SPEC.md) — that file wins over anything
here. Two families, five Latin files, no italics.

| Role | Family | Size | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Display / H1 | Titillium Web | `--text-h1` (36→64px) | 700 | `-.01em` | `1.1` |
| H2 | Titillium Web | `--text-h2` (30→48px) | 700 | `-.01em` | `1.15` |
| H3 | Titillium Web | `--text-h3` (24→32px) | 600 | `0` | `1.2` |
| H4 | Titillium Web | `--text-h4` (20→24px) | 600 | `0` | `1.25` |
| Lead | Barlow | `--text-lead` (18→22px) | 400 | `0` | `1.5` |
| Body | Barlow | `--text-base` (17→18px) | 400 | `0` | `1.55` |
| Small / labels | Barlow · system mono | `--text-sm` (14→15px) | 400–500 | `.1em` caps | `1.4–1.6` |

Barlow 400/500/600 and Titillium Web 600/700 are embedded as base64 WOFF2 — five files,
no runtime request, no layout shift. Mono is the system stack, so it costs nothing.
Bengali text is safe by construction: `:lang(bn)` resets tracking to `0` and opens the
leading to `1.75`; the Bengali font itself is not shipped until a Bengali page exists.

Rules: all-caps always gets positive tracking; display sizes get `-.01em` and no more;
body copy never exceeds `68ch`; paragraphs use `text-wrap: pretty`; body never below 17px,
captions never below 14px. The word "and" replaces "&" in display headings.

## Layout

- Shell: `max-width: 1320px`, gutter `clamp(20px, 4vw, 56px)`.
- Section padding: `clamp(72px, 8.4vw, 124px)`; tighter after a page head.
- Fixed header: 74px, opaque, one hairline, no blur.
- Breakpoints: 1080 (navigation), 980 (hero), 900 (splits), 860 (cards), 760, 680, 560.
- Radius: `2px` on inputs; everything else is square.

## Components

| Component | Class | Notes |
|---|---|---|
| Primary button | `.btn--primary` | filled blue, clipped top-right corner (12px) |
| Ghost / white / on-ink buttons | `.btn--ghost`, `.btn--white`, `.btn--onink` | hairline borders |
| Text link | `.linkarrow` | 1px underline that turns blue on hover |
| Plate | `.plate` | drawing frame: bar, body, foot |
| System map | `.map` | 3×3 module grid, blue core, mono labels |
| Capability card | `.cap` | hairline table cell, icon top-right, tags bottom |
| Deliverable list | `.deliv` | two-column list with 18px icons |
| Rule table | `.rules` | mono id, title, explanation |
| Engagement card | `.eng` | figure, title, spec table |
| FAQ | `.faq__item` | native `details` with a drawn +/− |
| Form | `.field` | mono labels, 1px inputs, blue focus ring |
| Footer | `.foot` | tinted band, five columns |

## Icons

37 monoline symbols in `_build/icons.svg`, drawn on a 24px grid with a 1.5 stroke,
`butt` caps and `miter` joins. Used at 13–34px. Named by concept, never by shape:
`i-custom`, `i-commerce`, `i-erp`, `i-web`, `i-mobile`, `i-ai`, `i-doc`, `i-ledger`,
`i-payout`, `i-cube`, `i-search`, `i-shield`, `i-sync`, `i-plug`, `i-approval`,
`i-chart`, `i-gauge`, `i-clock`, `i-users`, `i-link`, `i-pulse`, `i-upload`, `i-card`,
`i-target`, `i-workflow`, `i-database`, `i-flag`, `i-key`, `i-layers`, plus arrows,
check, mail, sun, moon, menu and close.

Rules: no emoji, no icon fonts, no filled decorative glyphs. An icon must mean the
thing next to it.

## Motion

One orchestrated moment per page load (the plate assembling, staggered 16ms per cell),
plus 180–250ms hover transitions and a 700ms scroll reveal at 8% threshold.
`prefers-reduced-motion` removes all of it, including the plate animation.

## Accessibility baseline

- Skip link, visible `:focus-visible` rings, semantic landmarks.
- Every icon-only control has an `aria-label`; decorative SVG is `aria-hidden`.
- The mobile menu traps nothing but restores focus and closes on Escape.
- Contrast checked per token pair; the smallest type is 10px mono metadata.
- Tables of content are real lists; FAQs are native `details` so they work without JS.

## Brand assets

Recorded here so the marks never have to be reconstructed from memory.

| File | Role | Notes |
|---|---|---|
| `assets/img/logo-blue-500.png` | wordmark, light surfaces | cropped to content, 527×80, ~10 KB |
| `assets/img/logo-white-500.png` | wordmark, dark surfaces | same bounds, ~6 KB |
| `assets/img/icon-512.png` | app icon / social | transparent, blue mark only |
| `assets/img/icon-180.png` | apple-touch-icon | transparent |
| `assets/img/icon-32.png` | favicon | transparent |
| `assets/img/og-1200x630.png` | social preview | blue field, white mark, white lattice |

**The mark** is a plus built from offset squares: a central block with four arms, the
top-right and bottom-left arms detached as separate blocks, and the inner corners
rounded. It is drawn in brand blue `#115FC8`; the supplied app icon sat on a flat
`#ECF2FA` field, which was keyed out to produce the transparent variants.

**The wordmark** is "INTACTIC" in a bold geometric sans, all caps, tight tracking, with a
thin vertical rule separating the mark from the letters. It must always come from the
supplied PNGs — never re-set in a webfont, never recoloured, never redrawn.

Display height in the header and footer is 19 px (125 px wide). The white variant is used
automatically in dark mode; exactly one variant is visible at a time (`.logo--white` is
hidden in light mode).
