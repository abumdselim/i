import pathlib
p = pathlib.Path('_build/styles.css')
s = p.read_text(encoding='utf-8')
start = s.index('.lat{width:100%;height:auto;display:block}')
end = s.index('/* ---------- capability table ---------- */')
new = r'''.plate__body--stack{padding:clamp(12px,1.8vw,18px)}
.layer{padding:clamp(11px,1.5vw,15px) 0;border-bottom:1px solid var(--line)}
.layer:first-child{padding-top:2px}
.layer:last-child{border-bottom:0;padding-bottom:2px}
.layer__head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:clamp(8px,1.2vw,11px)}
.layer__name{
  font-family:var(--font-mono);font-size:.625rem;letter-spacing:.1em;
  text-transform:uppercase;color:var(--ink);
}
.layer__meta{
  font-family:var(--font-mono);font-size:.5625rem;letter-spacing:.07em;
  text-transform:uppercase;color:var(--muted-2);
}
.layer__cells{display:grid;grid-template-columns:repeat(14,minmax(0,1fr));gap:clamp(4px,.7vw,6px)}
.cell{aspect-ratio:1/1;border:1px solid var(--line);background:var(--bg)}
.cell--on{background:var(--accent);border-color:var(--accent)}
.cell--soft{background:var(--accent-tint);border-color:var(--accent-tint)}
.js .layer__cells .cell{
  opacity:0;
  animation:cascadeIn .44s cubic-bezier(.16,1,.3,1) forwards;
  animation-delay:calc(.18s + var(--i,0) * .016s);
}
@keyframes cascadeIn{from{opacity:0;transform:scale(.84)}to{opacity:1;transform:none}}

'''
s = s[:start] + new + s[end:]
p.write_text(s, encoding='utf-8')
print('css patched')
