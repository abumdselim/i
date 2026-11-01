import pathlib, re, sys, html
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from cats import CATS
from catpage import cat_body
from products import PRODUCTS, INDUSTRIES, STACK
from prodpage import prod_body, prods_hub, prods_strip
from sections import industries_section, stack_section

B = pathlib.Path('_build')
OUT = pathlib.Path('.')

def meta_desc_from(text, limit=158):
    t = html.unescape(re.sub('<[^>]+>', '', text)).strip()
    m = re.match(r'(.+?[.!?])(?:\s|$)', t)
    s = m.group(1) if m else t
    if len(s) > limit:
        s = s[:limit].rsplit(' ', 1)[0].rstrip(' ,;:')
    return s


def read(p):
    return (B / p).read_text(encoding='utf-8')

CSS = read('styles.css')
FONTS = read('fonts/fonts.css')
JS = read('app.js')
SPRITE = read('icons.svg')

NAV = [
    ('Capabilities', 'services.html', 'capabilities'),
    ('Products', 'products.html', 'products'),
    ('Approach', 'approach.html', 'approach'),
    ('Engagements', 'engagements.html', 'engagements'),
    ('Process', 'process.html', 'process'),
    ('Studio', 'about.html', 'studio'),
    ('Contact', 'contact.html', 'contact'),
]

# ---------------------------------------------------------------- lattice
LAYERS = [
    ("Interface", "Human-checked", 2, 5, 7),
    ("Intelligence", "With an exit", 4, 6, 10),
    ("Data", "Reconciled", 7, 7, 6),
]

def plate():
    rows = []
    for li, (name, meta, start, length, soft) in enumerate(LAYERS):
        cells = []
        for c in range(14):
            cls = "cell"
            if start <= c < start + length:
                cls += " cell--on"
            elif c == soft:
                cls += " cell--soft"
            cells.append('<i class="%s" style="--i:%d"></i>' % (cls, li * 14 + c))
        rows.append(
            '<div class="layer">'
            '<div class="layer__head"><span class="layer__name">%s</span><span class="layer__meta">%s</span></div>'
            '<div class="layer__cells" aria-hidden="true">%s</div>'
            '</div>' % (name, meta, ''.join(cells))
        )
    return '<div class="plate__body plate__body--stack">%s</div>' % ''.join(rows)

# ---------------------------------------------------------------- figures
def fig_modules(on, soft=(), dashed=None, connectors=None):
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
    for (x1, y1, x2) in (connectors or []):
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

def cta_deco():
    cells = []
    for c in range(6):
        for r in range(5):
            x, y = c * 26, r * 26
            cells.append('<rect x="%d.5" y="%d.5" width="19" height="19"/>' % (x, y))
    return ('<svg class="cta__deco" viewBox="0 0 152 124" aria-hidden="true" focusable="false">'
            + ''.join(cells) + '</svg>')

# ---------------------------------------------------------------- chrome
def header(active):
    def link(label, href, key):
        cur = ' aria-current="page"' if key == active else ''
        return '<a class="nav__link" href="%s"%s>%s</a>' % (href, cur, label)
    nav = ''.join(link(l, h, k) for l, h, k in NAV)
    menu = ''.join(
        '<li><a href="%s"><span class="mono">%02d</span>%s</a></li>' % (h, i + 1, l)
        for i, (l, h, k) in enumerate(NAV)
    )
    return '''
<header class="head">
  <div class="shell head__in">
    <a class="brand" href="index.html" aria-label="Intactic — home">
      <img class="logo--blue" src="assets/img/logo-blue-500.png" alt="Intactic" width="125" height="19">
      <img class="logo--white" src="assets/img/logo-white-500.png" alt="" width="125" height="19">
    </a>
    <nav class="nav" aria-label="Primary">%s</nav>
    <div class="head__actions">
      <button class="iconbtn theme-btn" type="button" data-theme-toggle aria-label="Switch to dark mode" aria-pressed="false">
        <svg class="icon icon-moon" aria-hidden="true"><use href="#i-moon"></use></svg>
        <svg class="icon icon-sun" aria-hidden="true"><use href="#i-sun"></use></svg>
      </button>
      <a class="btn btn--primary" href="contact.html">Start a project
        <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>
      </a>
      <button class="iconbtn burger" type="button" data-menu-open aria-expanded="false" aria-controls="site-menu" aria-label="Open menu">
        <svg class="icon" aria-hidden="true"><use href="#i-menu"></use></svg>
      </button>
    </div>
  </div>
</header>

<div class="menu" id="site-menu" data-menu data-open="false" aria-hidden="true">
  <div class="menu__top">
    <a class="brand" href="index.html" aria-label="Intactic — home">
      <img class="logo--blue" src="assets/img/logo-blue-500.png" alt="Intactic" width="125" height="19">
      <img class="logo--white" src="assets/img/logo-white-500.png" alt="" width="125" height="19">
    </a>
    <button class="iconbtn" type="button" data-menu-close aria-label="Close menu">
      <svg class="icon" aria-hidden="true"><use href="#i-close"></use></svg>
    </button>
  </div>
  <nav aria-label="Mobile"><ul class="menu__list">%s</ul></nav>
  <div class="menu__foot">
    <a class="btn btn--primary" href="contact.html">Start a project
      <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>
    </a>
    <a class="mono" href="mailto:hello@intactic.net">hello@intactic.net</a>
  </div>
</div>''' % (nav, menu)

CTA = '''
<section class="cta-wrap" data-od-id="cta" aria-labelledby="cta-title">
  <div class="shell">
    <div class="cta">
      <div class="cta__grid">
        <div class="cta__copy">
          <p class="eyebrow">Next step</p>
          <h2 class="h2" id="cta-title">Tell us what you're building.</h2>
          <p>Send a short brief. You get the questions that matter, a rough shape of the work and a straight answer on fit.</p>
        </div>
        <div class="cta__actions">
          <a class="btn btn--white btn--lg" href="contact.html">Start a project
            <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>
          </a>
          <a class="cta__mail" href="mailto:hello@intactic.net">hello@intactic.net</a>
          <p class="cta__note">No sales sequence</p>
        </div>
      </div>
    </div>
  </div>
</section>'''

FOOTER = '''
<footer class="foot" data-od-id="footer">
  <div class="shell">
    <div class="foot__grid">
      <div class="foot__brand">
        <a href="index.html" aria-label="Intactic — home">
          <img class="logo--blue" src="assets/img/logo-blue-500.png" alt="Intactic" width="125" height="19">
          <img class="logo--white" src="assets/img/logo-white-500.png" alt="" width="125" height="19">
        </a>
        <p>A software engineering studio. Custom platforms, commerce, ERP and product interfaces, built to be run by the teams that own them.</p>
        <a class="linkarrow" href="mailto:hello@intactic.net">hello@intactic.net</a>
      </div>
      <div class="foot__col">
        <h4>Capabilities</h4>
        <ul>
          <li><a href="custom-software.html">Custom software</a></li>
          <li><a href="ecommerce.html">Multi-vendor commerce</a></li>
          <li><a href="erp.html">ERP &amp; operations</a></li>
          <li><a href="web-platforms.html">Web platforms</a></li>
          <li><a href="mobile-apps.html">Mobile products</a></li>
          <li><a href="automation.html">Automation &amp; models</a></li>
        </ul>
      </div>
      <div class="foot__col">
        <h4>Products</h4>
        <ul>
          <li><a href="shamlai.html">Shamlai</a></li>
          <li><a href="pharmasys.html">Pharmasys</a></li>
          <li><a href="pdfing-pro.html">Pdfing Pro</a></li>
          <li><a href="icounsel.html">iCounsel</a></li>
          <li><a href="products.html">All products</a></li>
        </ul>
      </div>
      <div class="foot__col">
        <h4>Studio</h4>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="approach.html">Approach</a></li>
          <li><a href="engagements.html">Engagements</a></li>
          <li><a href="process.html">Process</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="foot__col">
        <h4>Direct</h4>
        <ul>
          <li><a href="mailto:hello@intactic.net">hello@intactic.net</a></li>
          <li><a href="https://intactic.net">intactic.net</a></li>
          <li><a href="contact.html">Start a project</a></li>
        </ul>
      </div>
    </div>
    <div class="foot__bar">
      <p class="mono">&copy; <span data-year>2026</span> Intactic</p>
      <p class="mono">Software engineering studio</p>
      <a class="mono" href="#top">Back to top</a>
    </div>
  </div>
</footer>'''

HEAD = '''<!DOCTYPE html>
<html lang="en" data-theme="light" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(title)s</title>
<meta name="description" content="%(desc)s">
<meta name="theme-color" content="#115fc8">
<link rel="icon" type="image/png" sizes="32x32" href="assets/img/icon-32.png">
<link rel="apple-touch-icon" href="assets/img/icon-180.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Intactic">
<meta property="og:title" content="%(title)s">
<meta property="og:description" content="%(desc)s">
<meta property="og:url" content="https://intactic.net/%(slug)s">
<meta name="robots" content="%(robots)s">
<meta property="og:image" content="https://intactic.net/assets/img/og-1200x630.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Intactic — software engineering studio">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://intactic.net/assets/img/og-1200x630.png">
<script>(function(){var d=document.documentElement;d.classList.remove('no-js');d.classList.add('js');try{var t=localStorage.getItem('intactic-theme');if(t==='dark'||t==='light'){d.setAttribute('data-theme',t);}}catch(e){}})();</script>
<style>
%(fonts)s
%(css)s
</style>
</head>
<body id="top">
%(sprite)s
<a class="skip" href="#main">Skip to content</a>
'''

TAIL = '''
<script>
%(js)s
</script>
</body>
</html>
'''

PAGES = [
    dict(
        slug='', file='index.html', active='',
        title='Intactic — software engineering studio',
        desc='Intactic designs and builds custom platforms, multi-vendor commerce, ERP and product interfaces for companies that have outgrown off-the-shelf software.',
        frag='index.html', cta=True,
    ),
    dict(
        slug='services.html', file='services.html', active='capabilities',
        title='Capabilities — Intactic',
        desc='Custom software, multi-vendor commerce, ERP and operations, web platforms, mobile products, and automation with model-assisted workflows.',
        frag='services.html', cta=True,
    ),
    dict(
        slug='approach.html', file='approach.html', active='approach',
        title='Approach — Intactic',
        desc='How Intactic decides what to build: the system first, three layers of intelligence, five rules and the work we decline.',
        frag='approach.html', cta=True,
    ),
    dict(
        slug='engagements.html', file='engagements.html', active='engagements',
        title='Engagements — Intactic',
        desc='Three ways to work with Intactic: platform build, embedded team, and a fixed-scope assessment of a system that already runs.',
        frag='engagements.html', cta=True,
    ),
    dict(
        slug='process.html', file='process.html', active='process',
        title='Process — Intactic',
        desc='Four phases from first call to production, with a written output at the end of each and a fixed-scope discovery.',
        frag='process.html', cta=True,
    ),
    dict(
        slug='about.html', file='about.html', active='studio',
        title='Studio — Intactic',
        desc='A small software engineering studio: four working principles, a named lead on every build, and boundaries we do not cross.',
        frag='about.html', cta=True,
    ),
    dict(
        slug='404.html', file='404.html', active='',
        title='Page not found — Intactic',
        desc='The page you were looking for does not exist. Everything else on intactic.net is one click away.',
        frag='404.html', cta=False, robots='noindex, follow',
    ),
    dict(
        slug='contact.html', file='contact.html', active='contact',
        title='Contact — Intactic',
        desc='Tell Intactic what you are building. A short brief is enough; you get a reply within two working days.',
        frag='contact.html', cta=False,
    ),
    dict(
        slug='products.html', file='products.html', active='products', hub=True,
        title='Products — Intactic',
        desc='Four products built and run in-house: Shamlai for retail, Pharmasys for pharmacies, Pdfing Pro for documents, iCounsel for legal chambers.',
        frag='products.html', cta=True,
    ),
]

for c in CATS:
    PAGES.append(dict(
        slug=c['slug'] + '.html', file=c['slug'] + '.html', active='capabilities',
        title='%s — Intactic' % re.sub('<[^>]+>', '', c['nav']),
        desc=meta_desc_from(c['lead']),
        cat=c, cta=True,
    ))


for p in PRODUCTS:
    PAGES.append(dict(
        slug=p['slug'] + '.html', file=p['slug'] + '.html', active='products', prod=p,
        title='%s — Intactic' % p['name'],
        desc=p['card'],
        cta=True,
    ))


def build():
    pl = plate()
    for p in PAGES:
        if p.get('prod'):
            body = prod_body(p['prod'])
        elif p.get('hub'):
            body = prods_hub(PRODUCTS)
        elif p.get('cat'):
            body = cat_body(p['cat'])
        else:
            body = read('pages/' + p['frag'])
        body = body.replace('{{PRODUCTS_HOME}}', prods_strip(PRODUCTS))
        body = body.replace('{{INDUSTRIES_HOME}}', industries_section(INDUSTRIES))
        body = body.replace('{{STACK_HOME}}', stack_section(STACK, tint=True))
        body = (body.replace('{{PLATE}}', pl)
                    .replace('{{FIG_PLATFORM}}', FIG_PLATFORM)
                    .replace('{{FIG_EMBEDDED}}', FIG_EMBEDDED)
                    .replace('{{FIG_AI}}', FIG_AI))
        doc = HEAD % dict(title=p['title'], desc=p['desc'], slug=p['slug'], robots=p.get('robots', 'index, follow'),
                          fonts=FONTS, css=CSS, sprite=SPRITE)
        doc += header(p['active'])
        doc += '\n<main id="main">\n' + body + '\n</main>\n'
        if p['cta']:
            doc += CTA
        doc += FOOTER
        doc += TAIL % dict(js=JS)
        head, rest = doc.split('</style>', 1)
        body, tail = rest.split('<script>', 1)
        body = re.sub(r"(?<=[A-Za-z])'(?=[A-Za-z])", "\u2019", body)
        doc = head + '</style>' + body + '<script>' + tail
        (OUT / p['file']).write_text(doc, encoding='utf-8')
        print('%s  %.0f KB' % (p['file'], len(doc.encode('utf-8')) / 1024))

if __name__ == '__main__':
    build()
