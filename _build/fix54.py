import pathlib, re

# ---------- 1) spec: record the adaptation + measured budget ----------
p = pathlib.Path('docs/TYPOGRAPHY-SPEC.md')
s = p.read_text(encoding='utf-8')

s = s.replace("""## 2. Assumptions about the stack""", """## 2. Assumptions about the stack

> **This repository:** the company site is a static generator (`_build/build.py`), not
> Next.js. The guarantees in Section 1 are met with base64-embedded `@font-face`: exactly
> five Latin files, no runtime request to any font host. The `next/font` mechanics
> (4.1, 4.2, 8.2, 8.3) do not apply; their intent is preserved. See Section 9 for the
> measured files and Section 11 for the record.
""", 1)

s = s.replace("""| Barlow 400 / 500 / 600 (woff2, latin) | *measure* |
| Titillium Web 600 / 700 (woff2, latin) | *measure* |
| Noto Sans Bengali (chosen variant) | *measure* |
| Total Latin font transfer | *measure* |""",
"""| Barlow 400 / 500 / 600 (woff2, latin) | 22,196 + 22,008 + 22,772 = 66,976 B (65.4 KiB) |
| Titillium Web 600 / 700 (woff2, latin) | 12,116 + 11,732 = 23,848 B (23.3 KiB) |
| Noto Sans Bengali (chosen variant) | not embedded — the site carries no Bengali glyphs; add it with the first Bengali page |
| Total Latin font transfer | 90,824 B (88.7 KiB) base64-inlined; ≈ 68 KiB over the wire after gzip |""", 1)

s = s.replace("""| 2026-11-01 | Initial spec: Barlow 400/500/600, Titillium Web 600/700, Noto Sans Bengali fallback | Initial typography system | Company |""",
"""| 2026-11-01 | Initial spec: Barlow 400/500/600, Titillium Web 600/700, Noto Sans Bengali fallback | Initial typography system | Company |
| 2026-11-01 | Implemented on the static site: 5 Latin faces base64-embedded, mono switched to the system stack, fluid scale applied via `--text-*` tokens, Bengali rules shipped without the Bengali file | Deliver the same typographic system without Next.js | Company |""", 1)
p.write_text(s, encoding='utf-8')

# ---------- 2) tokens_doc: new tokens + spec-aligned type table ----------
t = pathlib.Path('_build/tokens_doc.py')
d = t.read_text(encoding='utf-8')
d = d.replace("""    '--font-sans': 'display and body family',
    '--font-mono': 'labels, metadata, diagram annotation',""",
"""    '--font-sans': 'body and UI family (Barlow)',
    '--font-display': 'headings and buttons (Titillium Web)',
    '--font-mono': 'labels, metadata (system monospace stack)',
    '--text-sm': 'small text, captions, labels (14–15px)',
    '--text-base': 'body copy (17–18px)',
    '--text-lead': 'introduction paragraphs (18–22px)',
    '--text-h4': 'H4 (20–24px)',
    '--text-h3': 'H3 (24–32px)',
    '--text-h2': 'H2 (30–48px)',
    '--text-h1': 'H1 / display (36–64px)',""")
d = d.replace("""    ('Type', ['--font-sans', '--font-mono']),""",
"""    ('Type', ['--font-sans', '--font-display', '--font-mono']),
    ('Type scale', ['--text-sm', '--text-base', '--text-lead', '--text-h4', '--text-h3', '--text-h2', '--text-h1']),""")
d = d.replace("""| Role | Family | Size | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Display | `--font-sans` | `clamp(2.7rem, 5.4vw, 4.35rem)` | 600 | `-.025em` | `.96` |
| H2 | `--font-sans` | `clamp(1.95rem, 3.35vw, 2.9rem)` | 600 | `-.024em` | `1.04` |
| H3 | `--font-sans` | `clamp(1.15rem, 1.5vw, 1.375rem)` | 600 | `-.016em` | `1.28` |
| Lead | `--font-sans` | `clamp(1.03rem, 1.15vw, 1.19rem)` | 400 | `-.008em` | `1.58` |
| Body | `--font-sans` | `1rem` | 400 | `-.003em` | `1.68` |
| Small | `--font-sans` | `.875rem` | 400 | `0` | `1.6` |
| Eyebrow / label | `--font-mono` | `.6875rem` / `.625rem` | 400 | `.1em` caps | `1–1.4` |

Weights are limited to 400 (read), 500 (emphasise) and 600 (announce). Fonts are embedded
as base64 WOFF2 — there is no runtime font request.""",
"""Authoritative source: [`TYPOGRAPHY-SPEC.md`](TYPOGRAPHY-SPEC.md). Two families only.

| Role | Family | Token | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Display / H1 | Titillium Web | `--text-h1` (36→64px) | 700 | `-.01em` | `1.1` |
| H2 | Titillium Web | `--text-h2` (30→48px) | 700 | `-.01em` | `1.15` |
| H3 | Titillium Web | `--text-h3` (24→32px) | 600 | `0` | `1.2` |
| H4 | Titillium Web | `--text-h4` (20→24px) | 600 | `0` | `1.25` |
| Buttons | Titillium Web | `--text-base` | 600 | `+.01em` | `1` |
| Lead | Barlow | `--text-lead` (18→22px) | 400 | `0` | `1.5` |
| Body | Barlow | `--text-base` (17→18px) | 400 | `0` | `1.55` |
| Small / label | Barlow · system mono | `--text-sm` (14→15px) | 400/500 | `.1em` (caps, mono only) | `1.4–1.6` |

Weight budget: Barlow 400/500/600, Titillium Web 600/700 — five Latin files, no italics,
no other subsets. Mono is the system stack (`ui-monospace … Consolas`), so it adds no
download. Body copy never drops below 17px; captions never below 14px.""")
t.write_text(d, encoding='utf-8')

# ---------- 3) design system: typography section ----------
q = pathlib.Path('docs/DESIGN-SYSTEM.md')
u = q.read_text(encoding='utf-8')
start = u.index('## Typography')
end = u.index('## Layout')
new_type = """## Typography

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

"""
u = u[:start] + new_type + u[end:]
q.write_text(u, encoding='utf-8')

# ---------- 4) project docs ----------
r = pathlib.Path('docs/README.md')
v = r.read_text(encoding='utf-8')
v = v.replace("- **Design tokens:** [docs/TOKENS.md](docs/TOKENS.md) · [tokens.json](docs/tokens.json)",
              "- **Design tokens:** [docs/TOKENS.md](docs/TOKENS.md) · [tokens.json](docs/tokens.json)\n"
              "- **Typography (authoritative):** [docs/TYPOGRAPHY-SPEC.md](docs/TYPOGRAPHY-SPEC.md)")
v = v.replace("  fonts/fonts.css   Geist + IBM Plex Mono, base64 embedded",
              "  fonts/fonts.css   Barlow 400/500/600 + Titillium Web 600/700, base64")
r.write_text(v, encoding='utf-8')

c = pathlib.Path('docs/CHANGELOG.md')
w = c.read_text(encoding='utf-8')
entry = """## 2026-11-01 — Adopt the Barlow + Titillium Web type system

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

"""
w = w.replace('## 2026-11-01 — Design tokens extracted and documented', entry + '## 2026-11-01 — Design tokens extracted and documented', 1)
c.write_text(w, encoding='utf-8')
print('docs updated')
