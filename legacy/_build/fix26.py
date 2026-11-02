import pathlib
c = pathlib.Path('_build/styles.css')
s = c.read_text(encoding='utf-8')
s = s.replace(""".hero__meta{
  display:flex;gap:20px;margin-top:26px;""",
""".hero__meta{
  display:flex;flex-wrap:wrap;gap:10px 20px;margin-top:26px;""")
s = s.replace(""".hero__meta span{display:flex;align-items:center;gap:8px}""",
""".hero__meta span{display:flex;align-items:center;gap:8px;white-space:nowrap}""")
c.write_text(s, encoding='utf-8')
print('ok')
