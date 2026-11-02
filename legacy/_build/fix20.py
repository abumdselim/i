import pathlib
b = pathlib.Path('_build/build.py')
s = b.read_text(encoding='utf-8')
s = s.replace("import pathlib, re\n", "import pathlib, re\nfrom cats import CATS\nfrom catpage import cat_body\n", 1)
s = s.replace("""]

def build():""", """]

for c in CATS:
    PAGES.append(dict(
        slug=c['slug'] + '.html', file=c['slug'] + '.html', active='capabilities',
        title='%s — Intactic' % re.sub('<[^>]+>', '', c['nav']),
        desc=re.sub('<[^>]+>', '', c['lead'])[:180],
        cat=c, cta=True,
    ))


def build():""", 1)
s = s.replace("        body = read('pages/' + p['frag'])", "        body = cat_body(p['cat']) if p.get('cat') else read('pages/' + p['frag'])", 1)
b.write_text(s, encoding='utf-8')

c = pathlib.Path('_build/cats.py')
t = c.read_text(encoding='utf-8').replace("'Authentic-ation'", "'Sign-in'")
c.write_text(t, encoding='utf-8')
print('ok')
