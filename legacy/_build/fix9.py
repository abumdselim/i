import pathlib
p = pathlib.Path('_build/build.py')
s = p.read_text(encoding='utf-8')
s = s.replace("""    for (x1, y1, x2, y2) in (connectors or []):
        parts.append('<path class="cell-s" d="M%d %dH%d"/>' % (x1, y1, x2))""",
"""    for (x1, y1, x2) in (connectors or []):
        parts.append('<path class="cell-s" d="M%d %dH%d"/>' % (x1, y1, x2))""")
p.write_text(s, encoding='utf-8')
