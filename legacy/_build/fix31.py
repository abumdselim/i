import pathlib
c = pathlib.Path('_build/styles.css')
s = c.read_text(encoding='utf-8')
add = r'''
/* ---------- products hub ---------- */
.prods{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
.prod{background:var(--surface);padding:clamp(22px,2.6vw,34px);display:flex;flex-direction:column}
.prod__top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px}
.prod__domain{
  font-family:var(--font-mono);font-size:.625rem;letter-spacing:.07em;
  color:var(--accent-ink);border:1px solid var(--line-2);padding:5px 9px;line-height:1;
  white-space:nowrap;
}
.prod h3{margin-bottom:10px}
.prod__line{font-size:1rem;color:var(--ink-2);letter-spacing:-.01em;margin-bottom:12px}
.prod p.desc{font-size:.9375rem;line-height:1.6;color:var(--muted);max-width:52ch}
.prod__links{display:flex;align-items:center;gap:24px;margin-top:auto;padding-top:22px;flex-wrap:wrap}
.prod__fig{margin-top:18px;border-top:1px solid var(--line);padding-top:16px}
.prod__fig svg{width:100%;height:auto}
@media (max-width:860px){.prods{grid-template-columns:1fr}}

/* ---------- industries ---------- */
.inds{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
.ind{background:var(--surface);padding:clamp(20px,2.4vw,28px);display:flex;flex-direction:column;min-height:170px}
.ind .mono{display:block;margin-bottom:14px}
.ind h3{margin-bottom:8px;font-size:1.0625rem}
.ind p{font-size:.875rem;line-height:1.55;color:var(--muted)}
.ind--cta{background:var(--accent);border:0}
.ind--cta .mono{color:rgba(255,255,255,.72)}
.ind--cta h3{color:#fff}
.ind--cta p{color:rgba(255,255,255,.85)}
.ind--cta .linkarrow{color:#fff;border-color:rgba(255,255,255,.5);margin-top:auto;align-self:flex-start}
.ind--cta .linkarrow:hover{border-color:#fff}
@media (max-width:900px){.inds{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:600px){.inds{grid-template-columns:1fr}}

/* ---------- product page head ---------- */
.prod-head__actions{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:26px}
'''
s = s.replace('/* ---------- utility ---------- */', add + '\n/* ---------- utility ---------- */')

# nav padding tighter for 7 items
s = s.replace('.nav__link{\n  position:relative;\n  display:inline-flex;align-items:center;\n  padding:9px 12px;',
              '.nav__link{\n  position:relative;\n  display:inline-flex;align-items:center;\n  padding:9px 9px;')
# footer grid 4 columns
s = s.replace('.foot__grid{display:grid;grid-template-columns:minmax(0,2fr) repeat(3,minmax(0,1fr));gap:clamp(24px,4vw,56px)}',
              '.foot__grid{display:grid;grid-template-columns:minmax(0,1.7fr) repeat(4,minmax(0,1fr));gap:clamp(24px,3.4vw,48px)}')
c.write_text(s, encoding='utf-8')
print('css ok')
