import pathlib, re

# 1) home + services: capability index badges
for f in ['_build/pages/index.html', '_build/pages/services.html']:
    p = pathlib.Path(f); s = p.read_text(encoding='utf-8')
    s = re.sub(r'\s*<span class="cap__idx">[^<]*</span>', '', s)
    p.write_text(s, encoding='utf-8')

# 2) home: engagement MODEL labels
p = pathlib.Path('_build/pages/index.html'); s = p.read_text(encoding='utf-8')
s = re.sub(r'\s*<span class="mono">Model \d\d</span>', '', s)
p.write_text(s, encoding='utf-8')

# 3) product cards: P/xx badges (strip + hub)
p = pathlib.Path('_build/prodpage.py'); s = p.read_text(encoding='utf-8')
s = s.replace("'<div class=\"prod__top\"><span class=\"mono\">P/%s</span><span class=\"prod__domain\">%s</span></div>'", "'<div class=\"prod__top\"><span class=\"prod__domain\">%s</span></div>'")
s = s.replace("% (p['num'], p['domain'], p['name'], p['card'], tags, p['slug'], p['domain'], p['domain'])", "% (p['domain'], p['name'], p['card'], tags, p['slug'], p['domain'], p['domain'])")
s = s.replace("% (prod['slug'], prod['num'], prod['domain'], prod['name'], prod['card'])", "% (prod['slug'], prod['domain'], prod['name'], prod['card'])")
# page head eyebrow + map bar
s = s.replace('<p class="eyebrow" data-reveal>Product P/%(num)s</p>', '<p class="eyebrow" data-reveal>Product</p>')
s = s.replace('<div class="plate__bar"><span>System map</span><span>P/%(num)s</span></div>', '<div class="plate__bar"><span>System map</span><span>Fig.</span></div>')
p.write_text(s, encoding='utf-8')

# 4) capability template: eyebrow + map bar
c = pathlib.Path('_build/catpage.py'); t = c.read_text(encoding='utf-8')
t = t.replace('<p class="eyebrow" data-reveal>Capability C/%(num)s</p>', '<p class="eyebrow" data-reveal>Capability</p>')
t = t.replace('<div class="plate__bar"><span>System map</span><span>C/%(num)s</span></div>', '<div class="plate__bar"><span>System map</span><span>Fig.</span></div>')
c.write_text(t, encoding='utf-8')

# 5) industries: drop the 01..05 numbers
sec = pathlib.Path('_build/sections.py'); u = sec.read_text(encoding='utf-8')
u = u.replace("""        '<div class="ind"><span class="mono">%s</span><h3>%s</h3><p>%s</p></div>' % (n, t_, d)""",
              """        '<div class="ind"><h3>%s</h3><p>%s</p></div>' % (t_, d)""")
u = u.replace("""'<div class="ind ind--cta"><span class="mono">Your sector</span>'""", """'<div class="ind ind--cta">'""")
sec.write_text(u, encoding='utf-8')

# 6) CSS: card tops now hold only the icon/domain
st = pathlib.Path('_build/styles.css'); v = st.read_text(encoding='utf-8')
v = v.replace('.cap__top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px}',
              '.cap__top{display:flex;align-items:flex-start;justify-content:flex-end;margin-bottom:28px}')
v = v.replace('.prod__top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px}',
              '.prod__top{display:flex;align-items:center;justify-content:flex-end;gap:16px;margin-bottom:22px}')
st.write_text(v, encoding='utf-8')
print('badges removed')
