def prod_body(p):
    meta = ''.join('<div><span class="mono">%s</span><span class="meta-val">%s</span></div>' % (k, v) for k, v in p['meta'])

    nodes = p['map_nodes']
    order = [nodes[0], nodes[1], nodes[2], nodes[3], None, nodes[4], nodes[5], nodes[6], nodes[7]]
    cells = []
    n = 0
    for item in order:
        if item is None:
            cells.append('<div class="map__cell map__cell--core"><span class="mono">Core</span><b>%s</b></div>' % p['map_core'])
        else:
            n += 1
            cells.append('<div class="map__cell"><span class="mono">%02d</span><b>%s</b></div>' % (n, item))

    feats = ''.join(
        '<div class="deliv__item"><svg class="icon" aria-hidden="true"><use href="#%s"></use></svg>'
        '<div><h3>%s</h3><p>%s</p></div></div>' % (i, t_, d) for i, t_, d in p['features']
    )

    rules = ''.join(
        '<div class="rule"><span class="mono">D/%02d</span><h3 class="h4">%s</h3><p>%s</p></div>' % (i + 1, t_, d)
        for i, (t_, d) in enumerate(p['rules'])
    )

    stack = ''.join('<span class="tag">%s</span>' % x for x in p['stack'])
    built = ''.join('<li><svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg><span>%s</span></li>' % x for x in p['built_for'])

    related = ''.join(
        '<a href="%s"><div><span class="mono">%s</span><strong>%s</strong></div>'
        '<svg class="icon" aria-hidden="true"><use href="#i-arrow-ur"></use></svg></a>' % (h, num, label)
        for h, label, num in p['related']
    )

    problem = ''.join('<p class="body" style="margin-bottom:16px">%s</p>' % x for x in p['problem'])

    return """<section class="page-head" data-od-id="page-head" aria-labelledby="prod-title">
  <div class="shell">
    <div class="page-head__grid">
      <div>
        <p class="eyebrow" data-reveal>Product</p>
        <h1 class="display" id="prod-title" data-reveal style="--d:.05s">%(h1)s</h1>
      </div>
      <div data-reveal style="--d:.1s">
        <p class="lead">%(lead)s</p>
        <div class="page-head__meta">%(meta)s</div>
        <div class="prod-head__actions">
          <a class="btn btn--primary" href="https://%(domain)s" target="_blank" rel="noopener">Visit %(domain)s
            <svg class="icon" aria-hidden="true"><use href="#i-arrow-ur"></use></svg>
          </a>
          <a class="linkarrow" href="products.html">All products
            <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow" style="margin-bottom:20px">The problem</p>
        <h2 class="h2" style="margin-bottom:22px">%(problem_head)s</h2>
        %(problem)s
      </div>
      <div class="map" data-reveal style="--d:.08s">
        <div class="plate__bar"><span>System map</span><span>Fig.</span></div>
        <div class="map__grid">%(cells)s</div>
        <div class="plate__foot"><span>%(map_core)s at the centre</span><span>%(domain)s</span></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="shell">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-reveal>Capability</p>
        <h2 class="h2" data-reveal style="--d:.05s">What it does.</h2>
      </div>
      <div class="sec-head__aside" data-reveal style="--d:.1s">
        <p class="lead">Six parts of the product that do the daily work. Everything else supports these.</p>
      </div>
    </div>
    <div class="deliv" data-reveal>%(feats)s</div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-reveal>Engineering</p>
        <h2 class="h2" data-reveal style="--d:.05s">How it is built.</h2>
      </div>
      <div class="sec-head__aside" data-reveal style="--d:.1s">
        <p class="lead">Three decisions that shape the product, and the stack that carries them.</p>
      </div>
    </div>
    <div class="rules" data-reveal>%(rules)s</div>
    <div class="split" style="margin-top:clamp(40px,5vw,64px)">
      <div data-reveal>
        <h3 class="svc__label">Stack</h3>
        <div class="svc__stack">%(stack)s</div>
        <p class="svc__note">%(stack_note)s</p>
      </div>
      <div data-reveal style="--d:.06s">
        <h3 class="svc__label">Built for</h3>
        <ul class="svc__list">%(built)s</ul>
      </div>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="shell">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-reveal>More products</p>
        <h2 class="h2" data-reveal style="--d:.05s">Built by the same team.</h2>
      </div>
      <div class="sec-head__aside" data-reveal style="--d:.1s">
        <p class="lead">Different problems, one engineering standard. Each product runs in production today.</p>
      </div>
    </div>
    <div class="related" data-reveal>%(related)s</div>
  </div>
</section>""" % dict(
        num=p['num'], h1=p['h1'], lead=p['lead'], meta=meta, domain=p['domain'],
        problem_head=p['problem_head'], problem=problem,
        cells=''.join(cells), map_core=p['map_core'],
        feats=feats, rules=rules, stack=stack, stack_note=p['stack_note'],
        built=built, related=related,
    )


def prods_hub(products):
    cards = []
    for p in products:
        tags = ''.join('<span class="tag">%s</span>' % t for _, t, _ in p['features'][:3])
        cards.append(
            '<article class="prod" data-reveal>'
            '<div class="prod__top"><span class="prod__domain">%s</span></div>'
            '<h3 class="h3">%s</h3>'
            '<p class="prod__line">%s</p>'
            '<div class="svc__stack" style="margin-top:6px">%s</div>'
            '<div class="prod__links">'
            '<a class="linkarrow" href="%s.html">Read more<svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></a>'
            '<a class="linkarrow" href="https://%s" target="_blank" rel="noopener">Visit %s<svg class="icon" aria-hidden="true"><use href="#i-arrow-ur"></use></svg></a>'
            '</div></article>' % (p['domain'], p['name'], p['card'], tags, p['slug'], p['domain'], p['domain'])
        )

    return """<section class="page-head" data-od-id="page-head" aria-labelledby="prods-title">
  <div class="shell">
    <div class="page-head__grid">
      <div>
        <p class="eyebrow" data-reveal>Products</p>
        <h1 class="display" id="prods-title" data-reveal style="--d:.05s">Four products, built and run in-house.</h1>
      </div>
      <div data-reveal style="--d:.1s">
        <p class="lead">Each one started as a specific operational problem: a counter that cannot go offline, a pharmacy that needs the generic, a chamber that cannot miss a date, a document that must not leave the building.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="prods">%(cards)s</div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow" style="margin-bottom:20px">One standard</p>
        <h2 class="h2" style="margin-bottom:22px">Products and client work share the same rules.</h2>
        <p class="body" style="margin-bottom:16px">A product is not a side project here. It is the same discipline applied to a problem we own: a written architecture, a fixed scope, and a system that has to survive its first thousand users without a rewrite.</p>
        <p class="body">That is also why the products are honest about their limits. Each one does a narrow set of things properly, and says so on its own page.</p>
      </div>
      <div class="contact-card" data-reveal style="--d:.08s">
        <h2 class="h2" style="font-size:1.0625rem;letter-spacing:-.012em;margin-bottom:14px">What every product has in common</h2>
        <ul class="donts" style="border-top:0">
          <li style="padding-top:0">Owner-operated infrastructure, with the data in our own accounts.</li>
          <li>Offline or degraded-network behaviour designed in, not bolted on.</li>
          <li>A published domain and a real support address.</li>
          <li>No feature that cannot be explained in one sentence.</li>
        </ul>
        <p style="margin-top:22px"><a class="linkarrow" href="approach.html">Read the approach
          <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></a></p>
      </div>
    </div>
  </div>
</section>""" % dict(cards=''.join(cards))


def prods_strip(products):
    cards = []
    for prod in products:
        cards.append(
            '<a class="prod" href="%s.html" data-reveal>'
            '<div class="prod__top"><span class="prod__domain">%s</span></div>'
            '<h3 class="h3">%s</h3>'
            '<p class="prod__line">%s</p>'
            '<span class="cap__more" style="margin-top:18px">Read more<svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></span>'
            '</a>' % (prod['slug'], prod['domain'], prod['name'], prod['card'])
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
