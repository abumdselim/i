import pathlib, re
p = pathlib.Path('_build/build.py')
s = p.read_text(encoding='utf-8')
start = s.index('def lattice():')
end = s.index('# ---------------------------------------------------------------- figures')
new = r'''def lattice():
    P, S = 30, 24
    X0, Y0 = 12, 10
    COLS, ROWS = 15, 13
    W, H = COLS * P, ROWS * P

    filled = set()
    for c in range(6, 9):
        for r in range(5, 8):
            filled.add((c, r))
    filled.update({(7, 2), (7, 3), (7, 4), (7, 8), (7, 9), (7, 10),
                   (3, 6), (4, 6), (5, 6), (9, 6), (10, 6), (11, 6)})
    filled.update({(c, r) for c in (10, 11) for r in (2, 3)})
    filled.update({(c, r) for c in (3, 4) for r in (9, 10)})
    soft = {(12, 4), (13, 6), (2, 7), (12, 10)}

    out = []
    out.append('<svg class="lat" viewBox="0 0 468 420" aria-hidden="true" focusable="false">')
    out.append('<defs><pattern id="latGrid" width="%d" height="%d" patternUnits="userSpaceOnUse" x="%d" y="%d">'
               '<rect class="cell-line" x="0.5" y="0.5" width="%d" height="%d"/></pattern></defs>'
               % (P, P, X0, Y0, S - 1, S - 1))
    out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="url(#latGrid)"/>' % (X0, Y0, W, H))

    for c, r in sorted(soft, key=lambda q: (q[1], q[0])):
        out.append('<rect class="cell-soft" x="%d" y="%d" width="%d" height="%d"/>'
                   % (X0 + c * P, Y0 + r * P, S, S))

    for c, r in sorted(filled, key=lambda q: (q[1], q[0])):
        d = 0.12 + (c + r) * 0.024
        out.append('<rect class="cell-on" style="--d:%.2fs" x="%d" y="%d" width="%d" height="%d"/>'
                   % (d, X0 + c * P, Y0 + r * P, S, S))

    ticks = ''.join('<path class="tick" d="M%d 408v7"/>' % (X0 + i * P) for i in range(COLS))
    out.append(ticks)
    out.append('<path class="tick" d="M%d 408h%d"/>' % (X0, (COLS - 1) * P))
    out.append('</svg>')
    return '\n'.join(out)

'''
s = s[:start] + new + s[end:]
p.write_text(s, encoding='utf-8')
print('patched')
