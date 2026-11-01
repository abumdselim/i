import base64, pathlib, re, urllib.request

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'}
url = 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Titillium+Web:wght@600;700&display=swap'
css = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read().decode()

blocks = re.findall(r'/\*\s*([a-z\-]+)\s*\*/\s*@font-face\s*\{(.*?)\}', css, re.S)
faces = []
for subset, body in blocks:
    if subset != 'latin':
        continue
    fam = re.search(r"font-family:\s*'([^']+)'", body).group(1)
    wght = re.search(r'font-weight:\s*([^;]+);', body).group(1).strip()
    u = re.search(r'url\((https://[^)]+)\)', body).group(1)
    data = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60).read()
    faces.append((fam, wght, data))
    print(fam, wght, len(data), 'bytes')

assert len(faces) == 5, 'expected exactly 5 latin faces, got %d' % len(faces)

out = []
total = 0
for fam, wght, data in faces:
    total += len(data)
    out.append("@font-face{font-family:'%s';font-style:normal;font-weight:%s;font-display:swap;"
               "src:url(data:font/woff2;base64,%s) format('woff2');}" % (fam, wght, base64.b64encode(data).decode()))
pathlib.Path('_build/fonts/fonts.css').write_text('\n'.join(out), encoding='utf-8')
print('latin transfer total:', total, 'bytes; faces:', len(out))

# ---- tokens.css: swap font tokens, add the fluid scale ----
t = pathlib.Path('_build/tokens.css')
s = t.read_text(encoding='utf-8')
s = re.sub(r'  --font-sans:[^;]+;',
           "  --font-sans:'Barlow','Segoe UI',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;", s)
s = re.sub(r'  --font-mono:[^;]+;',
           "  --font-display:'Titillium Web','Barlow','Segoe UI','Helvetica Neue',Arial,sans-serif;\n"
           "  --font-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace;", s)
anchor = "  --r:2px;"
scale = ("  --r:2px;\n\n  /* type scale (fluid, rem + vw; see docs/TYPOGRAPHY-SPEC.md 4.4) */\n"
         "  --text-sm:clamp(.875rem,.850rem + .109vw,.9375rem);\n"
         "  --text-base:clamp(1.0625rem,1.038rem + .109vw,1.125rem);\n"
         "  --text-lead:clamp(1.125rem,1.027rem + .435vw,1.375rem);\n"
         "  --text-h4:clamp(1.25rem,1.152rem + .435vw,1.5rem);\n"
         "  --text-h3:clamp(1.5rem,1.304rem + .870vw,2rem);\n"
         "  --text-h2:clamp(1.875rem,1.435rem + 1.957vw,3rem);\n"
         "  --text-h1:clamp(2.25rem,1.565rem + 3.043vw,4rem);")
assert anchor in s
s = s.replace(anchor, scale, 1)
t.write_text(s, encoding='utf-8')
print('tokens updated')

# ---- styles.css: rewire the type classes to the spec ----
c = pathlib.Path('_build/styles.css')
v = c.read_text(encoding='utf-8')
reps = [
# body
("""  font-family:var(--font-sans);
  font-size:16px;
  line-height:1.65;
  font-weight:400;
  letter-spacing:-.005em;""",
 """  font-family:var(--font-sans);
  font-size:var(--text-base);
  line-height:1.55;
  font-weight:400;"""),
# display / h2 / h3 / h4
(""".display{
  font-size:clamp(2.7rem,5.4vw,4.35rem);
  line-height:.96;
  letter-spacing:-.025em;
  font-weight:600;
  text-wrap:balance;
}""",
 """.display{
  font-family:var(--font-display);
  font-size:var(--text-h1);
  line-height:1.1;
  letter-spacing:-.01em;
  font-weight:700;
  text-wrap:balance;
}"""),
(""".h2{
  font-size:clamp(1.95rem,3.35vw,2.9rem);
  line-height:1.04;
  letter-spacing:-.024em;
  font-weight:600;
  text-wrap:balance;
}""",
 """.h2{
  font-family:var(--font-display);
  font-size:var(--text-h2);
  line-height:1.15;
  letter-spacing:-.01em;
  font-weight:700;
  text-wrap:balance;
}"""),
(""".h3{
  font-size:clamp(1.15rem,1.5vw,1.375rem);
  line-height:1.28;
  letter-spacing:-.016em;
  font-weight:600;
}""",
 """.h3{
  font-family:var(--font-display);
  font-size:var(--text-h3);
  line-height:1.2;
  letter-spacing:0;
  font-weight:600;
}"""),
(".h4{font-size:1.0625rem;line-height:1.4;letter-spacing:-.012em;font-weight:600}",
 ".h4{font-family:var(--font-display);font-size:var(--text-h4);line-height:1.25;letter-spacing:0;font-weight:600}"),
# lead / body / small
(""".lead{
  font-size:clamp(1.03rem,1.15vw,1.19rem);
  line-height:1.58;
  letter-spacing:-.008em;
  color:var(--muted);
}""",
 """.lead{
  font-size:var(--text-lead);
  line-height:1.5;
  color:var(--muted);
}"""),
(".body{font-size:1rem;line-height:1.68;letter-spacing:-.003em;color:var(--muted)}",
 ".body{font-size:var(--text-base);line-height:1.55;color:var(--muted)}"),
(".small{font-size:.875rem;line-height:1.6;color:var(--muted)}",
 ".small{font-size:var(--text-sm);line-height:1.6;color:var(--muted)}"),
# buttons: display family, 600, base size, +.01em
(""".btn{
  position:relative;
  display:inline-flex;align-items:center;gap:10px;
  padding:13px 20px;
  font-size:.875rem;font-weight:500;letter-spacing:.01em;line-height:1;""",
 """.btn{
  position:relative;
  display:inline-flex;align-items:center;gap:10px;
  padding:14px 22px;
  font-family:var(--font-display);
  font-size:var(--text-base);font-weight:600;letter-spacing:.01em;line-height:1;"""),
(".btn--lg{padding:15px 24px;font-size:.9375rem}", ".btn--lg{padding:16px 26px}"),
# nav + ui weight
("  font-size:.875rem;font-weight:400;color:var(--muted);\n  transition:color .16s ease;",
 "  font-size:var(--text-sm);font-weight:500;color:var(--muted);\n  transition:color .16s ease;"),
# icon button tap target
(""".iconbtn{
  display:grid;place-items:center;
  width:36px;height:36px;""",
 """.iconbtn{
  display:grid;place-items:center;
  width:44px;height:44px;"""),
]
for a, b in reps:
    if a not in v:
        raise SystemExit('MISSING: ' + a[:70])
    v = v.replace(a, b, 1)

# small-text floor: labels, captions and chips go to --text-sm
floor = [
    ('.eyebrow{\n  display:flex;align-items:center;gap:12px;\n  font-family:var(--font-mono);\n  font-size:.6875rem;',
     '.eyebrow{\n  display:flex;align-items:center;gap:12px;\n  font-family:var(--font-mono);\n  font-size:var(--text-sm);'),
    ('.mono{\n  font-family:var(--font-mono);\n  font-size:.6875rem;', '.mono{\n  font-family:var(--font-mono);\n  font-size:var(--text-sm);'),
    ('.tag{\n  font-family:var(--font-mono);font-size:.625rem;', '.tag{\n  font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.plate__bar{\n  display:flex;align-items:center;justify-content:space-between;gap:12px;\n  padding:11px 14px;\n  border-bottom:1px solid var(--line);\n  font-family:var(--font-mono);font-size:.625rem;',
     '.plate__bar{\n  display:flex;align-items:center;justify-content:space-between;gap:12px;\n  padding:11px 14px;\n  border-bottom:1px solid var(--line);\n  font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.plate__foot{\n  display:flex;align-items:center;justify-content:space-between;gap:16px;\n  padding:10px 14px;border-top:1px solid var(--line);\n  font-family:var(--font-mono);font-size:.625rem;',
     '.plate__foot{\n  display:flex;align-items:center;justify-content:space-between;gap:16px;\n  padding:10px 14px;border-top:1px solid var(--line);\n  font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.plate figcaption{\n  display:flex;align-items:flex-start;gap:12px;\n  margin-top:14px;\n  font-family:var(--font-mono);font-size:.6875rem;',
     '.plate figcaption{\n  display:flex;align-items:flex-start;gap:12px;\n  margin-top:14px;\n  font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.layer__name{\n  font-family:var(--font-mono);font-size:.625rem;', '.layer__name{\n  font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.layer__meta{\n  font-family:var(--font-mono);font-size:.625rem;', '.layer__meta{\n  font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.layer-card__list li{\n  font-family:var(--font-mono);font-size:.625rem;', '.layer-card__list li{\n  font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.svc__label{font-family:var(--font-mono);font-size:.625rem;', '.svc__label{font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.step__n{font-family:var(--font-mono);font-size:.6875rem;', '.step__n{font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.step__meta{\n  display:inline-block;margin-top:auto;padding-top:18px;align-self:flex-start;\n  font-family:var(--font-mono);font-size:.625rem;',
     '.step__meta{\n  display:inline-block;margin-top:auto;padding-top:18px;align-self:flex-start;\n  font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.deliv__n{font-family:var(--font-mono);font-size:.625rem;', '.deliv__n{font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.eng__spec dt{font-family:var(--font-mono);font-size:.625rem;', '.eng__spec dt{font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.prod__domain{\n  font-family:var(--font-mono);font-size:.625rem;', '.prod__domain{\n  font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.cta__note{font-family:var(--font-mono);font-size:.625rem;', '.cta__note{font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.foot__col h4{\n  font-family:var(--font-mono);font-size:.625rem;', '.foot__col h4{\n  font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.stackgroup__label{\n  font-family:var(--font-mono);font-size:.625rem;', '.stackgroup__label{\n  font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.field label{font-family:var(--font-mono);font-size:.625rem;', '.field label{font-family:var(--font-mono);font-size:var(--text-sm);font-weight:500;'),
    ('.contact-lines dt{font-family:var(--font-mono);font-size:.625rem;', '.contact-lines dt{font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.next h3{font-size:.8125rem;', '.next h3{font-size:var(--text-sm);'),
    ('.next li::before{content:counter(n,decimal-leading-zero);font-family:var(--font-mono);font-size:.625rem;',
     '.next li::before{content:counter(n,decimal-leading-zero);font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.hero__meta{\n  display:flex;flex-wrap:wrap;gap:10px 20px;margin-top:26px;\n  font-family:var(--font-mono);font-size:.6875rem;',
     '.hero__meta{\n  display:flex;flex-wrap:wrap;gap:10px 20px;margin-top:26px;\n  font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.fit__title{\n  display:flex;align-items:center;gap:10px;\n  font-family:var(--font-mono);font-size:.6875rem;',
     '.fit__title{\n  display:flex;align-items:center;gap:10px;\n  font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.cta__mail{\n  font-family:var(--font-mono);font-size:.8125rem;', '.cta__mail{\n  font-family:var(--font-mono);font-size:var(--text-sm);'),
    ('.eng__spec dd{margin:0;font-size:.8125rem;', '.eng__spec dd{margin:0;font-size:var(--text-sm);'),
    ('.form__note{font-size:.75rem;', '.form__note{font-size:var(--text-sm);'),
    ('.contact-lines dd{margin:0;font-size:.875rem;', '.contact-lines dd{margin:0;font-size:var(--text-sm);'),
    # paragraphs to the base size (floor 17px)
    ('font-size:.9375rem;', 'font-size:var(--text-base);'),
    ('.prod__line{font-size:1rem;', '.prod__line{font-size:var(--text-base);'),
    ('.foot__brand p{font-size:.875rem;', '.foot__brand p{font-size:var(--text-base);'),
    ('.ind p{font-size:.875rem;', '.ind p{font-size:var(--text-base);'),
    ('.std p{font-size:.875rem;', '.std p{font-size:var(--text-base);'),
    ('.ai-list p{font-size:.875rem;', '.ai-list p{font-size:var(--text-base);'),
    ('.deliv__item p{font-size:.875rem;', '.deliv__item p{font-size:var(--text-base);'),
    ('.fit__list dd{margin:0;font-size:.875rem;', '.fit__list dd{margin:0;font-size:var(--text-base);'),
    ('.svc__note{margin-top:18px;font-size:.875rem;', '.svc__note{margin-top:18px;font-size:var(--text-base);'),
    ('.next li{counter-increment:n;display:flex;gap:14px;padding:8px 0;font-size:.875rem;',
     '.next li{counter-increment:n;display:flex;gap:14px;padding:8px 0;font-size:var(--text-base);'),
    # strong
    ('/* ---------- reset ---------- */', 'strong,b{font-weight:600}\n\n/* ---------- reset ---------- */'),
]
for a, b in floor:
    if a in v:
        v = v.replace(a, b)
    else:
        print('FLOOR SKIP:', a[:60].replace('\n', ' '))

# Bengali-safe rules, appended
v = v.replace('.nowrap{white-space:nowrap}', """.nowrap{white-space:nowrap}

/* ---------- Bengali (docs/TYPOGRAPHY-SPEC.md 4.4) ---------- */
:lang(bn) body,body:lang(bn){line-height:1.75}
:lang(bn) h1,:lang(bn) h2,:lang(bn) h3,:lang(bn) h4{line-height:1.35;letter-spacing:0}
:lang(bn) button,:lang(bn) .btn{letter-spacing:0}""")
c.write_text(v, encoding='utf-8')
print('styles rewired')
