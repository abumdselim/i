import pathlib
c = pathlib.Path('_build/styles.css')
s = c.read_text(encoding='utf-8')
add = r'''
/* ---------- category page: system map ---------- */
.map{border:1px solid var(--line-2);background:var(--surface)}
.map__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line)}
.map__cell{
  background:var(--surface);padding:clamp(10px,1.4vw,14px);
  min-height:clamp(82px,9vw,104px);
  display:flex;flex-direction:column;justify-content:space-between;gap:10px;
}
.map__cell .mono{font-size:.5625rem;color:var(--muted-2)}
.map__cell b{font-size:.8125rem;line-height:1.28;font-weight:400;color:var(--ink-2);letter-spacing:-.008em}
.map__cell--core{background:var(--accent)}
.map__cell--core .mono{color:rgba(255,255,255,.70)}
.map__cell--core b{color:#fff;font-weight:500}
.map__cell--link{background:var(--bg-2)}

/* ---------- deliverables ---------- */
.deliv{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 clamp(28px,4vw,56px);border-top:1px solid var(--line-2)}
.deliv__item{display:grid;grid-template-columns:30px minmax(0,1fr);gap:12px;padding:18px 0;border-bottom:1px solid var(--line)}
.deliv__n{font-family:var(--font-mono);font-size:.625rem;letter-spacing:.08em;color:var(--muted-2);padding-top:3px}
.deliv__item h3{font-size:1rem;line-height:1.35;margin-bottom:5px;letter-spacing:-.012em}
.deliv__item p{font-size:.875rem;line-height:1.55;color:var(--muted);max-width:40ch}
@media (max-width:760px){.deliv{grid-template-columns:1fr}}

/* ---------- fit columns ---------- */
.fit{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 clamp(32px,5vw,64px)}
.fit__title{
  display:flex;align-items:center;gap:10px;
  font-family:var(--font-mono);font-size:.6875rem;letter-spacing:.1em;
  text-transform:uppercase;color:var(--ink);font-weight:400;
  padding-bottom:14px;border-bottom:1px solid var(--line-2);margin-bottom:4px;
}
.dot-mark{width:7px;height:7px;background:var(--accent);flex:none}
.dot-mark--hollow{background:transparent;border:1px solid var(--line-2)}
.fit__col--muted .fit__title{color:var(--muted)}
.fit__list div{display:grid;grid-template-columns:1fr;gap:4px;padding:14px 0;border-bottom:1px solid var(--line)}
.fit__list dt{font-size:.9375rem;font-weight:500;color:var(--ink-2);letter-spacing:-.01em}
.fit__list dd{margin:0;font-size:.875rem;line-height:1.55;color:var(--muted);max-width:44ch}
@media (max-width:820px){.fit{grid-template-columns:1fr;gap:34px}}

/* ---------- three layer cards (dark) ---------- */
.layers{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 clamp(24px,3.4vw,44px);border-top:1px solid var(--on-ink-line)}
.layer-card{padding-top:22px;border-right:1px solid var(--on-ink-line);padding-right:clamp(20px,2.4vw,32px)}
.layer-card:last-child{border-right:0;padding-right:0}
.layer-card__top{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.layer-card__top .mono{color:var(--on-ink-muted)}
.sq{width:12px;height:12px;border:1px solid var(--on-ink);display:block}
.sq--solid{background:var(--on-ink)}
.sq--half{position:relative}
.sq--half::before{content:'';position:absolute;inset:2px 6px 2px 2px;background:var(--on-ink)}
.layer-card h3{color:var(--on-ink);margin-bottom:10px}
.layer-card p{font-size:.9375rem;line-height:1.6;color:var(--on-ink-muted);max-width:38ch}
.layer-card__list{margin-top:18px;border-top:1px solid var(--on-ink-line)}
.layer-card__list li{
  font-family:var(--font-mono);font-size:.625rem;letter-spacing:.07em;text-transform:uppercase;
  color:var(--on-ink-muted);padding:9px 0;border-bottom:1px solid var(--on-ink-line);line-height:1.4;
}
@media (max-width:900px){.layers{grid-template-columns:1fr}
  .layer-card{border-right:0;padding-right:0;padding-bottom:26px;border-bottom:1px solid var(--on-ink-line)}
  .layer-card:last-child{border-bottom:0;padding-bottom:0}}

/* ---------- rules rows ---------- */
.rules{border-top:1px solid var(--line-2)}
.rule{display:grid;grid-template-columns:70px minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(16px,3vw,40px);padding:20px 0;border-bottom:1px solid var(--line);align-items:start}
.rule h3{letter-spacing:-.012em}
.rule p{font-size:.9375rem;line-height:1.6;color:var(--muted);max-width:52ch}
@media (max-width:760px){
  .rule{grid-template-columns:1fr;gap:6px}
  .rule .mono{padding-bottom:2px}
}

/* ---------- related capabilities ---------- */
.related{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(14px,1.6vw,20px)}
.related a{
  display:flex;align-items:center;justify-content:space-between;gap:20px;
  border:1px solid var(--line);background:var(--surface);
  padding:clamp(18px,2.2vw,24px);
  transition:border-color .18s ease,background-color .18s ease;
}
.related a:hover{border-color:var(--line-2);background:var(--bg-2)}
.related .mono{display:block;margin-bottom:8px}
.related strong{font-size:1.0625rem;font-weight:500;letter-spacing:-.015em;display:block}
.related .icon{width:16px;height:16px;color:var(--accent);flex:none}
@media (max-width:640px){.related{grid-template-columns:1fr}}
'''
s = s.replace('/* ---------- utility ---------- */', add + '\n/* ---------- utility ---------- */')
c.write_text(s, encoding='utf-8')
print('css added', len(s))
