import pathlib
p = pathlib.Path('_build/build.py')
s = p.read_text(encoding='utf-8')
start = s.index('def lattice():')
end = s.index('# ---------------------------------------------------------------- figures')
new = r'''LAYERS = [
    ("Interface", "Human-checked", 2, 5, 7),
    ("Intelligence", "With an exit", 4, 6, 10),
    ("Data", "Reconciled", 7, 7, 6),
]

def plate():
    rows = []
    for li, (name, meta, start, length, soft) in enumerate(LAYERS):
        cells = []
        for c in range(14):
            cls = "cell"
            if start <= c < start + length:
                cls += " cell--on"
            elif c == soft:
                cls += " cell--soft"
            cells.append('<i class="%s" style="--i:%d"></i>' % (cls, li * 14 + c))
        rows.append(
            '<div class="layer">'
            '<div class="layer__head"><span class="layer__name">%s</span><span class="layer__meta">%s</span></div>'
            '<div class="layer__cells" aria-hidden="true">%s</div>'
            '</div>' % (name, meta, ''.join(cells))
        )
    return '<div class="plate__body plate__body--stack">%s</div>' % ''.join(rows)

'''
s = s[:start] + new + s[end:]
s = s.replace('    lat = lattice()\n', '    pl = plate()\n')
s = s.replace(".replace('{{LATTICE}}', lat)", ".replace('{{PLATE}}', pl)")
p.write_text(s, encoding='utf-8')
print('build.py patched')
