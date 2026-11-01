def industries_section(industries, tint=False):
    cells = ''.join(
        '<div class="ind"><span class="mono">%s</span><h3>%s</h3><p>%s</p></div>' % (n, t_, d)
        for n, t_, d in industries
    )
    cells += ('<div class="ind ind--cta"><span class="mono">Your sector</span>'
              '<h3>Is your industry here?</h3>'
              '<p>If the problem is operational, it can be scoped. Tell us where the work piles up.</p>'
              '<a class="linkarrow" href="contact.html">Start a conversation'
              '<svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></a></div>')
    return """<section class="section%(tint)s" id="industries" data-od-id="industries">
  <div class="shell">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-reveal>Industries</p>
        <h2 class="h2" data-reveal style="--d:.05s">Where our work sits today.</h2>
      </div>
      <div class="sec-head__aside" data-reveal style="--d:.1s">
        <p class="lead">The sector changes the vocabulary and the regulation, not the engineering. These are the places our products and builds already run.</p>
      </div>
    </div>
    <div class="inds" data-reveal>%(cells)s</div>
  </div>
</section>""" % dict(tint=' section--tint' if tint else '', cells=cells)


def stack_section(groups, tint=False):
    cols = []
    for name, items in groups:
        lis = ''.join('<li>%s</li>' % i for i in items)
        cols.append('<div class="stackcol"><h3>%s</h3><ul>%s</ul></div>' % (name, lis))
    return """<section class="section%(tint)s" id="stack" data-od-id="stack">
  <div class="shell">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-reveal>Stack</p>
        <h2 class="h2" data-reveal style="--d:.05s">The tools we reach for.</h2>
      </div>
      <div class="sec-head__aside" data-reveal style="--d:.1s">
        <p class="lead">A stack is a consequence of the problem, not an identity. We pick the smallest set of tools that can carry the system for the next five years, and we work in yours when it already fits.</p>
        <a class="linkarrow" href="approach.html">Why architecture comes first
          <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>
        </a>
      </div>
    </div>
    <div class="stacksec" data-reveal>%(cols)s</div>
    <p class="stacknote" data-reveal style="--d:.06s">If your team already runs .NET, Java or PHP, we work in that instead. Retraining a team to satisfy a preference is not engineering.</p>
  </div>
</section>""" % dict(tint=' section--tint' if tint else '', cols=''.join(cols))
