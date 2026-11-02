import ui

GROUP_ICON = {
    'Languages': 'i-custom',
    'Frameworks &amp; runtimes': 'i-layers',
    'Data &amp; storage': 'i-database',
    'Infrastructure': 'i-plug',
}


def industries_section(industries, tint=False):
    cells = ''.join(
        '<div class="ind"><div class="ind__top">%s<span class="mono">%s</span></div>'
        '<h3>%s</h3><p>%s</p></div>' % (ui.icon(ic), n, t_, d)
        for n, ic, t_, d in industries
    )
    cells += ('<div class="ind ind--cta">'
              '<div class="ind__top">%s</div>'
              '<h3>Is your industry here?</h3>'
              '<p>If the problem is operational, it can be scoped. Tell us where the work piles up.</p>'
              '<a class="linkarrow" href="contact.html">Start a conversation'
              '<svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></a></div>'
              % ui.icon('i-help'))
    return """<section class="section%(tint)s" id="industries" data-od-id="industries">
  <div class="shell">
    <div class="sec-head">
      <div>
        <p class="eyebrow eyebrow--i" data-reveal>%(i_building)s Industries</p>
        <h2 class="h2" data-reveal style="--d:.05s">Where our work sits today.</h2>
      </div>
      <div class="sec-head__aside" data-reveal style="--d:.1s">
        <p class="lead">The sector changes the vocabulary and the regulation, not the engineering. These are the places our products and builds already run.</p>
      </div>
    </div>
    <div class="inds" data-reveal>%(cells)s</div>
  </div>
</section>""" % dict(tint=' section--tint' if tint else '', cells=cells, i_building=ui.icon('building'))


def stack_section(groups, tint=False):
    blocks = []
    for name, items in groups:
        cells = ''.join(
            '<div class="stackcell"><svg class="slogo" aria-hidden="true"><use href="#s-%s"></use></svg>'
            '<span>%s</span></div>' % (slug, label)
            for label, slug in items
        )
        blocks.append(
            '<div class="stackgroup"><h3 class="stackgroup__label">%s%s</h3>'
            '<div class="stackgrid">%s</div></div>'
            % (ui.icon(GROUP_ICON.get(name, 'i-layers')), name, cells)
        )
    return """<section class="section%(tint)s" id="stack" data-od-id="stack">
  <div class="shell">
    <div class="sec-head">
      <div>
        <p class="eyebrow eyebrow--i" data-reveal>%(i_db)s Stack</p>
        <h2 class="h2" data-reveal style="--d:.05s">The tools we reach for.</h2>
      </div>
      <div class="sec-head__aside" data-reveal style="--d:.1s">
        <p class="lead">A stack is a consequence of the problem, not an identity. We pick the smallest set of tools that can carry the system for the next five years, and we work in yours when it already fits.</p>
        <a class="linkarrow" href="approach.html">Why architecture comes first
          <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>
        </a>
      </div>
    </div>
    <div class="stackgroups" data-reveal>%(blocks)s</div>
  </div>
</section>""" % dict(tint=' section--tint' if tint else '', blocks=''.join(blocks), i_db=ui.icon('database'))
