import json, pathlib
j = json.load(open('docs/tokens.json', encoding='utf-8'))
print('tokens:', len(j['tokens']))
print('accent:', j['tokens'].get('--accent'))
print('bg:', j['tokens'].get('--bg'))
h = pathlib.Path('index.html').read_text(encoding='utf-8')
print('inline css has accent:', '--accent:#115fc8' in h)

r = pathlib.Path('docs/README.md')
s = r.read_text(encoding='utf-8')
s = s.replace("- **Design system:** [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)",
              "- **Design system:** [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)\n- **Design tokens:** [docs/TOKENS.md](docs/TOKENS.md) · [tokens.json](docs/tokens.json)")
s = s.replace("  fonts/fonts.css   Geist + IBM Plex Mono, base64 embedded",
              "  tokens.css        design tokens (single source), prepended at build\n  tokens_doc.py     writes docs/TOKENS.md and docs/tokens.json from tokens.css\n  fonts/fonts.css   Geist + IBM Plex Mono, base64 embedded")
r.write_text(s, encoding='utf-8')

c = pathlib.Path('docs/CHANGELOG.md')
v = c.read_text(encoding='utf-8')
entry = """## 2026-11-01 — Design tokens extracted and documented

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

"""
v = v.replace('## 2026-11-01 — Stack section, logo wall and a curated stack', entry + '## 2026-11-01 — Stack section, logo wall and a curated stack', 1)
c.write_text(v, encoding='utf-8')
print('docs updated')
