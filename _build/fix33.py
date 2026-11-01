import pathlib

# --- prods_strip (home band) ---
p = pathlib.Path('_build/prodpage.py')
s = p.read_text(encoding='utf-8')
s += r'''

def prods_strip(products):
    cards = []
    for prod in products:
        cards.append(
            '<a class="prod" href="%s.html" data-reveal>'
            '<div class="prod__top"><span class="mono">P/%s</span><span class="prod__domain">%s</span></div>'
            '<h3 class="h3">%s</h3>'
            '<p class="prod__line">%s</p>'
            '<span class="cap__more" style="margin-top:18px">Read more<svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></span>'
            '</a>' % (prod['slug'], prod['num'], prod['domain'], prod['name'], prod['card'])
        )
    return """<section class="section section--tint" id="products" data-od-id="products">
  <div class="shell">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-reveal>Products</p>
        <h2 class="h2" data-reveal style="--d:.05s">Four products we build, run and own.</h2>
      </div>
      <div class="sec-head__aside" data-reveal style="--d:.1s">
        <p class="lead">Each one started as a specific operational problem and now runs in production. They keep the studio honest about what software has to survive.</p>
        <a class="linkarrow" href="products.html">See all products
          <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>
        </a>
      </div>
    </div>
    <div class="prods">%(cards)s</div>
  </div>
</section>""" % dict(cards=''.join(cards))
'''
p.write_text(s, encoding='utf-8')

# --- build.py ---
b = pathlib.Path('_build/build.py')
t = b.read_text(encoding='utf-8')
t = t.replace("from cats import CATS\nfrom catpage import cat_body\n",
              "from cats import CATS\nfrom catpage import cat_body\nfrom products import PRODUCTS, INDUSTRIES\nfrom prodpage import prod_body, prods_hub, prods_strip\n", 1)

t = t.replace("    ('Capabilities', 'services.html', 'capabilities'),",
              "    ('Capabilities', 'services.html', 'capabilities'),\n    ('Products', 'products.html', 'products'),", 1)

# pages: hub + products
t = t.replace("""]

for c in CATS:""", """    dict(
        slug='products.html', file='products.html', active='products', hub=True,
        title='Products — Intactic',
        desc='Four products built and run in-house: Shamlai for retail, Pharmasys for pharmacies, Pdfing Pro for documents, iCounsel for legal chambers.',
        frag='products.html', cta=True,
    ),
]

for c in CATS:""", 1)

t = t.replace("""def build():""", """for p in PRODUCTS:
    PAGES.append(dict(
        slug=p['slug'] + '.html', file=p['slug'] + '.html', active='products', prod=p,
        title='%s — %s' % (p['name'], p['domain']),
        desc=p['card'],
        cta=True,
    ))


def build():""", 1)

t = t.replace("        body = cat_body(p['cat']) if p.get('cat') else read('pages/' + p['frag'])",
"""        if p.get('prod'):
            body = prod_body(p['prod'])
        elif p.get('hub'):
            body = prods_hub(PRODUCTS, INDUSTRIES)
        elif p.get('cat'):
            body = cat_body(p['cat'])
        else:
            body = read('pages/' + p['frag'])
        body = body.replace('{{PRODUCTS_HOME}}', prods_strip(PRODUCTS))""", 1)

# footer: add products column
t = t.replace("""      <div class="foot__col">
        <h4>Studio</h4>""", """      <div class="foot__col">
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
        <h4>Studio</h4>""", 1)
b.write_text(t, encoding='utf-8')
print('build patched')
