import pathlib
c = pathlib.Path('_build/styles.css')
s = c.read_text(encoding='utf-8')

s = s.replace(""".deliv__item{display:grid;grid-template-columns:30px minmax(0,1fr);gap:12px;padding:18px 0;border-bottom:1px solid var(--line)}""",
""".deliv__item{display:grid;grid-template-columns:24px minmax(0,1fr);gap:14px;padding:18px 0;border-bottom:1px solid var(--line)}
.deliv__item .icon{width:18px;height:18px;color:var(--accent);margin-top:1px}""")

s = s.replace("""@media (max-width:680px){
  .caps{grid-template-columns:1fr}
  .cap{min-height:0}
}""",
"""@media (max-width:680px){
  .caps{grid-template-columns:1fr}
  .cap{min-height:0}
}
.caps--2{grid-template-columns:repeat(2,minmax(0,1fr))}
.caps--2 .cap{min-height:300px}
.cap--lg p{max-width:46ch;font-size:1rem;line-height:1.62}
.cap__more{
  display:inline-flex;align-items:center;gap:8px;margin-top:16px;
  font-family:var(--font-mono);font-size:.625rem;letter-spacing:.09em;
  text-transform:uppercase;color:var(--accent-ink);
}
.cap__more .icon{width:13px;height:13px;color:currentColor;transition:transform .2s cubic-bezier(.16,1,.3,1)}
.cap:hover .cap__more .icon{transform:translateX(3px)}
@media (max-width:820px){.caps--2{grid-template-columns:1fr}.caps--2 .cap{min-height:0}}""")

s = s.replace(""".page-head__meta div{display:flex;flex-direction:column;gap:6px}""",
""".page-head__meta div{display:flex;flex-direction:column;gap:5px}
.page-head__meta .meta-val{font-size:.875rem;line-height:1.45;color:var(--ink-2);letter-spacing:-.008em}""")
c.write_text(s, encoding='utf-8')
print('ok')
