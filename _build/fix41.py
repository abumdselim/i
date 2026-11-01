import pathlib

# 1) design system: font swap + new rule
p = pathlib.Path('docs/DESIGN-SYSTEM.md')
s = p.read_text(encoding='utf-8')
s = s.replace('| Display | Archivo |', '| Display | Geist |')
s = s.replace('| H2 | Archivo |', '| H2 | Geist |')
s = s.replace('| H3 | Archivo |', '| H3 | Geist |')
s = s.replace('| Lead | Archivo |', '| Lead | Geist |')
s = s.replace('| Body | Archivo |', '| Body | Geist |')
s = s.replace('`-.03em` | `.96`', '`-.025em` | `.96`')
s = s.replace('`-.032em` | `1.04`', '`-.024em` | `1.04`')
s = s.replace('`-.021em` | `1.28`', '`-.016em` | `1.28`')
s = s.replace('`-.012em` | `1.58`', '`-.008em` | `1.58`')
s = s.replace('`-.006em` | `1.68`', '`-.003em` | `1.68`')
s = s.replace('Both families are embedded as base64 WOFF2 in `_build/fonts/fonts.css` (Archivo\nvariable 400–700, Plex Mono 400/500).',
              'Both families are embedded as base64 WOFF2 in `_build/fonts/fonts.css` (Geist\nvariable 400–700, Plex Mono 400/500).')
s = s.replace('Rules: all-caps always gets positive tracking; display sizes always get negative\ntracking; body copy never exceeds `65ch`; paragraphs use `text-wrap: pretty`.',
              'Rules: all-caps always gets positive tracking; display sizes always get negative\ntracking; body copy never exceeds `65ch`; paragraphs use `text-wrap: pretty`.\nDisplay headings use the word "and" rather than "&": the ampersand is allowed only in\nsmall labels and footer links, where it reads as a sign, not a glyph.')
p.write_text(s, encoding='utf-8')

# 2) project readme: font name
r = pathlib.Path('docs/README.md')
t = r.read_text(encoding='utf-8').replace('Archivo + IBM Plex Mono, base64 embedded', 'Geist + IBM Plex Mono, base64 embedded')
r.write_text(t, encoding='utf-8')

# 3) pages: home + products rows
q = pathlib.Path('docs/PAGES.md')
u = q.read_text(encoding='utf-8')
u = u.replace('| Hero + plate, Capabilities, Intelligence (dark), Products, Process, Engagements + standards |',
              '| Hero + plate, Capabilities, Intelligence (dark), Products, Industries, Stack, Process, Engagements + standards |')
u = u.replace('| Hub for the four products + industries | Four product cards, industries band, one-standard section |',
              '| Hub for the four products | Four product cards, one-standard section |')
q.write_text(u, encoding='utf-8')

# 4) changelog entry
c = pathlib.Path('docs/CHANGELOG.md')
v = c.read_text(encoding='utf-8')
entry = """## 2026-11-01 — Typeface, hero, industries and stack

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

"""
v = v.replace('## 2026-11-01 — Products, documentation and repository', entry + '## 2026-11-01 — Products, documentation and repository', 1)
c.write_text(v, encoding='utf-8')
print('docs updated')
