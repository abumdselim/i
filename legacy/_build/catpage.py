import ui


def cat_body(c):
    meta = ui.meta_rail(c['meta'])

    nodes = c['map_nodes']
    order = [nodes[0], nodes[1], nodes[2], nodes[3], None, nodes[4], nodes[5], nodes[6], nodes[7]]
    cells = []
    n = 0
    for item in order:
        if item is None:
            cells.append('<div class="map__cell map__cell--core"><span class="mono">Core</span><b>%s</b></div>' % c['map_core'])
        else:
            n += 1
            cells.append('<div class="map__cell"><span class="mono">%02d</span><b>%s</b></div>' % (n, item))

    deliv = ''.join(
        '<div class="deliv__item"><span class="deliv__mark">%s</span>'
        '<div><h3>%s</h3><p>%s</p></div></div>' % (ui.icon(i), t_, d) for i, t_, d in c['deliv']
    )

    rules = ''.join(
        '<div class="rule"><div class="rule__id">%s<span class="mono">A/%02d</span></div>'
        '<h3 class="h4">%s</h3><p>%s</p></div>' % (ui.icon(i), n + 1, t_, d)
        for n, (i, t_, d) in enumerate(c['rules'])
    )

    stack = ''.join('<span class="tag">%s</span>' % x for x in c['stack'])

    related = ''.join(
        '<a href="%s"><div><span class="mono">%s</span><strong>%s</strong></div>'
        '<svg class="icon" aria-hidden="true"><use href="#i-arrow-ur"></use></svg></a>' % (h, num, label)
        for h, label, num in c['related']
    )

    problem = ''.join('<p class="body" style="margin-bottom:16px">%s</p>' % x for x in c['problem'])

    return """<section class="page-head" data-od-id="page-head" aria-labelledby="cat-title">
  <div class="shell">
    <div class="page-head__grid">
      <div>
        <div class="page-head__mark">%(mark)s</div>
        <p class="eyebrow eyebrow--i" data-reveal>%(icon)s Capability <span class="eyebrow__tag">C/%(num)s</span></p>
        <h1 class="display" id="cat-title" data-reveal style="--d:.05s">%(h1)s</h1>
      </div>
      <div data-reveal style="--d:.1s">
        <p class="lead">%(lead)s</p>
        %(meta)s
        <p style="margin-top:26px"><a class="linkarrow" href="services.html">All capabilities
          <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></a></p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow eyebrow--i" style="margin-bottom:20px">%(i_target)s The problem</p>
        <h2 class="h2" style="margin-bottom:22px">%(problem_head)s</h2>
        %(problem)s
      </div>
      <div class="map" data-reveal style="--d:.08s">
        <div class="plate__bar"><span>System map</span><span>Fig.</span></div>
        <div class="map__grid">%(cells)s</div>
        <div class="plate__foot"><span>%(map_core)s at the centre</span><span>%(slug)s</span></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="shell">
    <div class="sec-head">
      <div>
        <p class="eyebrow eyebrow--i" data-reveal>%(i_check)s Deliverables</p>
        <h2 class="h2" data-reveal style="--d:.05s">What we build.</h2>
      </div>
      <div class="sec-head__aside" data-reveal style="--d:.1s">
        <p class="lead">Six pieces of work, scoped in discovery and delivered in two-week increments. Anything that does not earn its place is cut before the build starts.</p>
      </div>
    </div>
    <div class="deliv" data-reveal>%(deliv)s</div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="sec-head">
      <div>
        <p class="eyebrow eyebrow--i" data-reveal>%(i_compass)s Approach</p>
        <h2 class="h2" data-reveal style="--d:.05s">How we work on it.</h2>
      </div>
      <div class="sec-head__aside" data-reveal style="--d:.1s">
        <p class="lead">Three working rules that shape the build, and the stack we usually reach for.</p>
      </div>
    </div>
    <div class="rules" data-reveal>%(rules)s</div>
    <div class="split" style="margin-top:clamp(40px,5vw,64px)">
      <div data-reveal>
        <h3 class="svc__label">%(i_layers)s Typical stack</h3>
        <div class="svc__stack">%(stack)s</div>
        <p class="svc__note">%(stack_note)s</p>
      </div>
      <div data-reveal style="--d:.06s">
        <h3 class="svc__label">%(i_start)s How it starts</h3>
        <p class="body" style="margin-bottom:22px">%(start)s</p>
        <a class="linkarrow" href="contact.html">Scope this work
          <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></a>
      </div>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="shell">
    <div class="sec-head">
      <div>
        <p class="eyebrow eyebrow--i" data-reveal>%(i_plug)s Related</p>
        <h2 class="h2" data-reveal style="--d:.05s">Usually built alongside.</h2>
      </div>
      <div class="sec-head__aside" data-reveal style="--d:.1s">
        <p class="lead">Most engagements combine two or three capabilities. These are the pairs we see most often.</p>
      </div>
    </div>
    <div class="related" data-reveal>%(related)s</div>
  </div>
</section>""" % dict(
        num=c['num'], h1=c['h1'], lead=c['lead'], meta=meta,
        mark=ui.icon(c['icon']), icon=ui.icon(c['icon']),
        problem_head=c['problem_head'], problem=problem,
        cells=''.join(cells), map_core=c['map_core'], slug=c['slug'],
        deliv=deliv, rules=rules, stack=stack, stack_note=c['stack_note'],
        start=c['start'], related=related,
        i_target=ui.icon('target'), i_check=ui.icon('check'), i_compass=ui.icon('compass'),
        i_layers=ui.icon('layers'), i_start=ui.icon('calendar'), i_plug=ui.icon('plug'),
    )
