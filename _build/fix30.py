import pathlib
b = pathlib.Path('_build/build.py')
s = b.read_text(encoding='utf-8')

# 1) helpers + imports
s = s.replace("import pathlib, re, sys\n", "import pathlib, re, sys, html\n", 1)
s = s.replace("def read(p):", """def meta_desc_from(text, limit=158):
    t = html.unescape(re.sub('<[^>]+>', '', text)).strip()
    m = re.match(r'(.+?[.!?])(?:\\s|$)', t)
    s = m.group(1) if m else t
    if len(s) > limit:
        s = s[:limit].rsplit(' ', 1)[0].rstrip(' ,;:')
    return s


def read(p):""", 1)

# 2) category desc -> first sentence
s = s.replace("        desc=re.sub('<[^>]+>', '', c['lead'])[:180],", "        desc=meta_desc_from(c['lead']),")

# 3) 404 page entry
s = s.replace("""    dict(
        slug='contact.html', file='contact.html', active='contact',""",
"""    dict(
        slug='404.html', file='404.html', active='',
        title='Page not found — Intactic',
        desc='The page you were looking for does not exist. Everything else on intactic.net is one click away.',
        frag='404.html', cta=False, robots='noindex, follow',
    ),
    dict(
        slug='contact.html', file='contact.html', active='contact',""")

# 4) head: robots + og:image + twitter:image
s = s.replace('''<meta name="twitter:card" content="summary">''',
'''<meta name="robots" content="%(robots)s">
<meta property="og:image" content="https://intactic.net/assets/img/og-1200x630.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Intactic — software engineering studio">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://intactic.net/assets/img/og-1200x630.png">''')

s = s.replace("""        doc = HEAD % dict(title=p['title'], desc=p['desc'], slug=p['slug'],
                          fonts=FONTS, css=CSS, sprite=SPRITE)""",
"""        doc = HEAD % dict(title=p['title'], desc=p['desc'], slug=p['slug'], robots=p.get('robots', 'index, follow'),
                          fonts=FONTS, css=CSS, sprite=SPRITE)""")

# 5) about description wording
s = s.replace("desc='A small software studio: four working principles, a named lead on every build, and boundaries we do not cross.'",
              "desc='A small software engineering studio: four working principles, a named lead on every build, and boundaries we do not cross.'")
b.write_text(s, encoding='utf-8')
print('build.py patched')
