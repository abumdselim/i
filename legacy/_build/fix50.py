import pathlib
p = pathlib.Path('docs/DESIGN-SYSTEM.md')
s = p.read_text(encoding='utf-8')
add = """

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
"""
if 'Brand assets' not in s:
    s = s.rstrip() + add
p.write_text(s, encoding='utf-8')
print('brand section added')
