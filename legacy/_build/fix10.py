import pathlib, re

# --- FAQ summaries: add pm span ---
p = pathlib.Path('_build/pages/index.html')
s = p.read_text(encoding='utf-8')
s = re.sub(r'<summary>(.*?)</summary>', lambda m: '<summary>%s<span class="pm" aria-hidden="true"></span></summary>' % m.group(1), s)
p.write_text(s, encoding='utf-8')
print('faq summaries:', s.count('class="pm"'))

# --- CTA markup in build.py ---
b = pathlib.Path('_build/build.py')
t = b.read_text(encoding='utf-8')
start = t.index("CTA = '''")
end = t.index("FOOTER = '''")
new = """CTA = '''
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
          <p class="cta__note">No sales sequence. A working conversation.</p>
        </div>
      </div>
    </div>
  </div>
</section>'''

"""
t = t[:start] + new + t[end:]
b.write_text(t, encoding='utf-8')

# --- CSS ---
c = pathlib.Path('_build/styles.css')
u = c.read_text(encoding='utf-8')
u = u.replace(""".eng__fig{border-bottom:1px solid var(--line);background:var(--bg-2);padding:18px 18px 0}""",
""".eng__fig{border-bottom:1px solid var(--line);background:var(--bg-3);padding:22px 16px 10px}""")

u = u.replace(""".faq__item summary{
  position:relative;
  display:block;
  padding:20px 40px 20px 0;cursor:pointer;list-style:none;
  font-size:1.0625rem;line-height:1.45;letter-spacing:-.012em;font-weight:500;
}
.faq__item summary::-webkit-details-marker{display:none}
.faq__item summary::before,
.faq__item summary::after{
  content:'';position:absolute;right:0;top:28px;background:var(--ink);
  transition:transform .25s ease,opacity .25s ease;
}
.faq__item summary::before{width:1px;height:11px;margin-right:5px}
.faq__item summary::after{width:11px;height:1px}
.faq__item[open] summary::before{transform:scaleY(0)}
.faq__item[open] summary::after{transform:rotate(180deg)}""",
""".faq__item summary{
  display:flex;align-items:center;justify-content:space-between;gap:24px;
  padding:20px 0;cursor:pointer;list-style:none;
  font-size:1.0625rem;line-height:1.45;letter-spacing:-.012em;font-weight:500;
}
.faq__item summary::-webkit-details-marker{display:none}
.faq__item summary .pm{position:relative;width:12px;height:12px;flex:none}
.faq__item summary .pm::before,
.faq__item summary .pm::after{
  content:'';position:absolute;top:50%;left:50%;background:var(--ink);
  transform:translate(-50%,-50%);
}
.faq__item summary .pm::before{width:12px;height:1px}
.faq__item summary .pm::after{width:1px;height:12px;transition:transform .25s ease}
.faq__item[open] summary .pm::after{transform:translate(-50%,-50%) scaleY(0)}""")

u = u.replace(""".cta__deco{position:absolute;right:-10px;top:-10px;width:min(46%,420px);opacity:.5;pointer-events:none}
.cta__grid{
  position:relative;
  display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.72fr);
  gap:clamp(28px,4vw,64px);align-items:end;
}""",
""".cta__grid{
  position:relative;
  display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.6fr);
  gap:clamp(28px,4vw,64px);align-items:end;
}
.cta__copy h2{margin-bottom:16px}
.cta__copy p{max-width:46ch}""")

u = u.replace(""".cta__actions{display:flex;flex-direction:column;align-items:flex-start;gap:16px}""",
""".cta__actions{display:flex;flex-direction:column;align-items:flex-start;gap:16px;justify-self:end}""")

u = u.replace(""".cta__deco rect{fill:none;stroke:rgba(255,255,255,.40);stroke-width:1}
""", "")
c.write_text(u, encoding='utf-8')
print('cta + faq + fig css updated')
