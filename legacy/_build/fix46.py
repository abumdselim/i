import pathlib

# 1) section: tile grid, no lecture note
p = pathlib.Path('_build/sections.py')
s = p.read_text(encoding='utf-8')
start = s.index('def stack_section(groups, tint=False):')
new = r'''def stack_section(groups, tint=False):
    blocks = []
    for name, items in groups:
        cells = ''.join(
            '<div class="stackcell"><svg class="slogo" aria-hidden="true"><use href="#s-%s"></use></svg>'
            '<span>%s</span></div>' % (slug, label)
            for label, slug in items
        )
        blocks.append(
            '<div class="stackgroup"><h3 class="stackgroup__label">%s</h3>'
            '<div class="stackgrid">%s</div></div>' % (name, cells)
        )
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
    <div class="stackgroups" data-reveal>%(blocks)s</div>
  </div>
</section>""" % dict(tint=' section--tint' if tint else '', blocks=''.join(blocks))
'''
s = s[:start] + new
p.write_text(s, encoding='utf-8')

# 2) css: replace list styles with tile grid
c = pathlib.Path('_build/styles.css')
t = c.read_text(encoding='utf-8')
old_start = t.index('/* ---------- stack section ---------- */')
old_end = t.index('/* ---------- product page head ---------- */')
new_css = '''/* ---------- stack section ---------- */
.stackgroups{display:flex;flex-direction:column;gap:clamp(22px,2.6vw,32px)}
.stackgroup__label{
  font-family:var(--font-mono);font-size:.625rem;letter-spacing:.1em;text-transform:uppercase;
  color:var(--muted-2);font-weight:400;margin-bottom:10px;
}
.stackgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
.stackcell{
  background:var(--surface);display:flex;align-items:center;gap:12px;
  padding:clamp(12px,1.4vw,16px) clamp(14px,1.6vw,18px);
  transition:background-color .18s ease;
}
.stackcell:hover{background:var(--bg-2)}
.stackcell .slogo{width:20px;height:20px;flex:none;fill:currentColor;color:var(--muted);transition:color .18s ease}
.stackcell:hover .slogo{color:var(--accent)}
.stackcell span{font-size:.9375rem;line-height:1.3;letter-spacing:-.006em;color:var(--ink-2)}
@media (max-width:680px){.stackgrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:400px){.stackgrid{grid-template-columns:1fr}}

'''
t = t[:old_start] + new_css + t[old_end:]
c.write_text(t, encoding='utf-8')
print('stack redesigned')
