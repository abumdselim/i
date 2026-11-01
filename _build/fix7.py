import pathlib
p = pathlib.Path('_build/styles.css')
s = p.read_text(encoding='utf-8')
reps = [
(""".head{
  position:sticky;top:0;z-index:90;
  background:var(--head-bg);
  -webkit-backdrop-filter:blur(16px) saturate(140%);
  backdrop-filter:blur(16px) saturate(140%);
  border-bottom:1px solid var(--line);
}""",
""".head{
  position:fixed;top:0;left:0;right:0;z-index:90;
  background:var(--bg);
  border-bottom:1px solid var(--line);
}"""),
("""body{
  margin:0;
  background:var(--bg);""",
"""body{
  margin:0;
  padding-top:var(--head-h);
  background:var(--bg);"""),
("""  --head-bg:rgba(255,255,255,.86);""", """  --head-bg:#ffffff;"""),
("""  --head-bg:rgba(7,13,22,.84);""", """  --head-bg:#070d16;"""),
]
for a,b in reps:
    if a not in s: raise SystemExit('MISSING ' + a[:50])
    s = s.replace(a,b)
p.write_text(s, encoding='utf-8')
print('header fixed + opaque')
