import pathlib
p = pathlib.Path('_build/styles.css')
s = p.read_text(encoding='utf-8')

reps = [
("""body{
  margin:0;
  background:var(--bg);
  color:var(--ink);
  font-family:var(--font-sans);
  font-size:16px;
  line-height:1.65;
  font-weight:400;
  letter-spacing:-.005em;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
  overflow-x:hidden;
}""",
"""body{
  margin:0;
  background:var(--bg);
  color:var(--ink);
  font-family:var(--font-sans);
  font-size:16px;
  line-height:1.65;
  font-weight:400;
  letter-spacing:-.005em;
  font-synthesis:none;
  font-kerning:normal;
  font-variant-ligatures:common-ligatures;
  font-optical-sizing:auto;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  text-rendering:optimizeLegibility;
  overflow-x:hidden;
}
p{text-wrap:pretty;hyphens:none}"""),

(""".display{
  font-size:clamp(2.55rem,5vw,4.05rem);
  line-height:.99;
  letter-spacing:-.038em;
  font-weight:600;
  text-wrap:balance;
}""",
""".display{
  font-size:clamp(2.7rem,5.4vw,4.35rem);
  line-height:.96;
  letter-spacing:-.04em;
  font-weight:600;
  text-wrap:balance;
}"""),

(""".h2{
  font-size:clamp(1.9rem,3.3vw,2.85rem);
  line-height:1.06;
  letter-spacing:-.03em;
  font-weight:600;
  text-wrap:balance;
}""",
""".h2{
  font-size:clamp(1.95rem,3.35vw,2.9rem);
  line-height:1.04;
  letter-spacing:-.032em;
  font-weight:600;
  text-wrap:balance;
}"""),

(""".h3{
  font-size:clamp(1.15rem,1.5vw,1.35rem);
  line-height:1.3;
  letter-spacing:-.018em;
  font-weight:600;
}""",
""".h3{
  font-size:clamp(1.15rem,1.5vw,1.375rem);
  line-height:1.28;
  letter-spacing:-.021em;
  font-weight:600;
}"""),

(""".lead{
  font-size:clamp(1.02rem,1.15vw,1.16rem);
  line-height:1.62;
  letter-spacing:-.008em;
  color:var(--muted);
}
.body{font-size:1rem;line-height:1.66;color:var(--muted)}""",
""".lead{
  font-size:clamp(1.03rem,1.15vw,1.19rem);
  line-height:1.58;
  letter-spacing:-.012em;
  color:var(--muted);
}
.body{font-size:1rem;line-height:1.68;letter-spacing:-.006em;color:var(--muted)}"""),

(""".layer__meta{
  font-family:var(--font-mono);font-size:.5625rem;letter-spacing:.07em;
  text-transform:uppercase;color:var(--muted-2);
}""",
""".layer__meta{
  font-family:var(--font-mono);font-size:.625rem;letter-spacing:.07em;
  text-transform:uppercase;color:var(--muted-2);
}"""),

(""".plate figcaption{
  display:flex;align-items:flex-start;gap:12px;
  margin-top:14px;
  font-family:var(--font-mono);font-size:.625rem;letter-spacing:.07em;""",
""".plate figcaption{
  display:flex;align-items:flex-start;gap:12px;
  margin-top:14px;
  font-family:var(--font-mono);font-size:.6875rem;letter-spacing:.05em;"""),

(""".btn{
  position:relative;
  display:inline-flex;align-items:center;gap:10px;
  padding:13px 20px;
  font-size:.875rem;font-weight:500;letter-spacing:.005em;line-height:1;""",
""".btn{
  position:relative;
  display:inline-flex;align-items:center;gap:10px;
  padding:13px 20px;
  font-size:.875rem;font-weight:500;letter-spacing:.01em;line-height:1;"""),
]
for a,b in reps:
    if a not in s:
        raise SystemExit('MISSING: ' + a[:60])
    s = s.replace(a,b)
p.write_text(s, encoding='utf-8')
print('typography patched', len(s))
