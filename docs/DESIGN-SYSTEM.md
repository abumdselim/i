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

| Role | Face | Size | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Display | Archivo | `clamp(2.7rem, 5.4vw, 4.35rem)` | 600 | `-.03em` | `.96` |
| H2 | Archivo | `clamp(1.95rem, 3.35vw, 2.9rem)` | 600 | `-.032em` | `1.04` |
| H3 | Archivo | `clamp(1.15rem, 1.5vw, 1.375rem)` | 600 | `-.021em` | `1.28` |
| Lead | Archivo | `clamp(1.03rem, 1.15vw, 1.19rem)` | 400 | `-.012em` | `1.58` |
| Body | Archivo | `1rem` | 400 | `-.006em` | `1.68` |
| Eyebrow | IBM Plex Mono | `.6875rem` | 400 | `.1em` caps | `1` |
| Mono label | IBM Plex Mono | `.625rem` | 400 | `.08–.1em` caps | `1.4` |

Both families are embedded as base64 WOFF2 in `_build/fonts/fonts.css` (Archivo
variable 400–700, Plex Mono 400/500). There is no runtime font request, so text never
shifts after load.

Rules: all-caps always gets positive tracking; display sizes always get negative
tracking; body copy never exceeds `65ch`; paragraphs use `text-wrap: pretty`.

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
