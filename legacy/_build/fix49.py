import pathlib
h = pathlib.Path('index.html').read_text(encoding='utf-8')
for k in ['Cloudflare D1', '>R2<', 'Meilisearch', 'Frameworks &amp; runtimes', 'stackcell']:
    print(k, h.count(k))

c = pathlib.Path('docs/CHANGELOG.md')
v = c.read_text(encoding='utf-8')
entry = """## 2026-11-01 — Stack section, logo wall and a curated stack

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

"""
v = v.replace('## 2026-11-01 — Typeface, hero, industries and stack', entry + '## 2026-11-01 — Typeface, hero, industries and stack', 1)
c.write_text(v, encoding='utf-8')
print('changelog updated')
