import pathlib
p = pathlib.Path('_build/prodpage.py')
s = p.read_text(encoding='utf-8')
s += r'''

def prods_hub(products, industries):
    cards = []
    for p in products:
        tags = ''.join('<span class="tag">%s</span>' % t for _, t, _ in p['features'][:3])
        cards.append(
            '<article class="prod" data-reveal>'
            '<div class="prod__top"><span class="mono">P/%s</span><span class="prod__domain">%s</span></div>'
            '<h3 class="h3">%s</h3>'
            '<p class="prod__line">%s</p>'
            '<div class="svc__stack" style="margin-top:6px">%s</div>'
            '<div class="prod__links">'
            '<a class="linkarrow" href="%s.html">Read more<svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></a>'
            '<a class="linkarrow" href="https://%s" target="_blank" rel="noopener">Visit %s<svg class="icon" aria-hidden="true"><use href="#i-arrow-ur"></use></svg></a>'
            '</div></article>' % (p['num'], p['domain'], p['name'], p['card'], tags, p['slug'], p['domain'], p['domain'])
        )

    inds = ''.join(
        '<div class="ind"><span class="mono">%s</span><h3>%s</h3><p>%s</p></div>' % (n, t_, d)
        for n, t_, d in industries
    )
    inds += ('<div class="ind ind--cta"><span class="mono">Your sector</span>'
             '<h3>Somewhere else?</h3>'
             '<p>If the problem is operational, it can be scoped. Tell us where the work piles up.</p>'
             '<a class="linkarrow" href="contact.html">Start a conversation'
             '<svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></a></div>')

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

<section class="section section--tint" data-od-id="industries">
  <div class="shell">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-reveal>Industries</p>
        <h2 class="h2" data-reveal style="--d:.05s">Where they sit today.</h2>
      </div>
      <div class="sec-head__aside" data-reveal style="--d:.1s">
        <p class="lead">The same four products are used across counters, dispensaries, chambers and back offices. The sector changes the vocabulary, not the engineering.</p>
      </div>
    </div>
    <div class="inds" data-reveal>%(inds)s</div>
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
</section>""" % dict(cards=''.join(cards), inds=inds)
'''
p.write_text(s, encoding='utf-8')
print('hub fn added')
