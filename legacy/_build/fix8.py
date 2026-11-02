import pathlib

# ---------- build.py: modular figures ----------
p = pathlib.Path('_build/build.py')
s = p.read_text(encoding='utf-8')
start = s.index("FIG_PLATFORM = '''")
end = s.index("def cta_deco():")
new = r'''def fig_modules(on, soft=(), dashed=None, connectors=None):
    W, H, P, S, X0, Y0 = 12, 4, 18, 12, 42, 22
    parts = []
    if dashed:
        c0, r0, c1, r1 = dashed
        parts.append('<rect class="dash" x="%d" y="%d" width="%d" height="%d"/>'
                     % (X0 + c0 * P - 4, Y0 + r0 * P - 4, (c1 - c0) * P + S + 8, (r1 - r0) * P + S + 8))
    for r in range(H):
        for c in range(W):
            cls = 'cell-s'
            if (c, r) in on:
                cls = 'cell-a'
            elif (c, r) in soft:
                cls = 'cell-soft'
            parts.append('<rect class="%s" x="%d" y="%d" width="%d" height="%d"/>'
                         % (cls, X0 + c * P, Y0 + r * P, S, S))
    for (x1, y1, x2, y2) in (connectors or []):
        parts.append('<path class="cell-s" d="M%d %dH%d"/>' % (x1, y1, x2))
    return '<svg class="fig" viewBox="0 0 300 116" aria-hidden="true" focusable="false">%s</svg>' % ''.join(parts)

PLATFORM_ON = {(c, r) for c in range(0, 6) for r in range(0, 3)}
PLATFORM_ON |= {(10, 0), (10, 1), (10, 2)}
EMBED_ON = {(c, r) for c in range(4, 8) for r in range(1, 3)}
AI_ON = {(c, r) for c in range(5, 8) for r in range(1, 3)}

FIG_PLATFORM = fig_modules(
    PLATFORM_ON,
    connectors=[(42 + 5 * 18 + 12, 22 + 18 + 6, 42 + 10 * 18)],
)
FIG_EMBEDDED = fig_modules(EMBED_ON, dashed=(2, 0, 8, 3))
FIG_AI = fig_modules(AI_ON, soft={(8, 1), (8, 2)})

'''
s = s[:start] + new + s[end:]
p.write_text(s, encoding='utf-8')

# ---------- styles: figure cell classes, remove ink ::after, align step meta ----------
c = pathlib.Path('_build/styles.css')
t = c.read_text(encoding='utf-8')
t = t.replace(""".fig{width:100%;height:auto}
.fig .s{stroke:var(--line-2);fill:none}
.fig .s2{stroke:var(--line);fill:none}
.fig .a{fill:var(--accent);stroke:none}""",
""".fig{width:100%;height:auto}
.fig .cell-s{stroke:var(--line-2);fill:none}
.fig .cell-a{fill:var(--accent);stroke:none}
.fig .cell-soft{fill:var(--accent-tint);stroke:none}
.fig .dash{stroke:var(--line-2);fill:none;stroke-dasharray:3 4}""")

t = t.replace(""".ink-block::after{
  content:'';position:absolute;right:-80px;top:-80px;
  width:320px;height:320px;
  border:1px solid var(--on-ink-line);
  opacity:.5;pointer-events:none;
}
""", "")

t = t.replace(""".step{
  position:relative;
  padding:26px 30px 0 0;
  border-right:1px solid var(--line);
}""",
""".step{
  position:relative;
  display:flex;flex-direction:column;
  padding:26px 30px 0 0;
  border-right:1px solid var(--line);
}""")

t = t.replace(""".step__meta{
  display:inline-block;margin-top:18px;""",
""".step__meta{
  display:inline-block;margin-top:auto;padding-top:18px;align-self:flex-start;""")
c.write_text(t, encoding='utf-8')
print('done')
