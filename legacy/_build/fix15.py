import pathlib

# CSS fixes
c = pathlib.Path('_build/styles.css')
s = c.read_text(encoding='utf-8')
s = s.replace(""".section--flush-top{padding-top:0}""",
""".section--flush-top{padding-top:0}
.page-head + .section{padding-top:clamp(40px,4.6vw,72px)}""")
s = s.replace("""@media (max-width:900px){
  .svc-layout{grid-template-columns:1fr}
  .svc-nav{position:static;display:none}
  .svc__head{grid-template-columns:1fr}
  .svc__icon{justify-content:flex-start}
  .svc__cols{grid-template-columns:1fr}
}""",
"""@media (max-width:900px){
  .svc-layout{grid-template-columns:1fr}
  .svc-nav{position:static;display:none}
  .svc__head{grid-template-columns:minmax(0,1fr) auto;gap:16px}
  .svc__icon{justify-content:flex-end}
  .svc__icon .icon{width:26px;height:26px}
  .svc__cols{grid-template-columns:1fr}
}""")
c.write_text(s, encoding='utf-8')

# typographic apostrophes at assembly time
b = pathlib.Path('_build/build.py')
t = b.read_text(encoding='utf-8')
t = t.replace("""        doc += TAIL % dict(js=JS)
        (OUT / p['file']).write_text(doc, encoding='utf-8')""",
"""        doc += TAIL % dict(js=JS)
        head, rest = doc.split('</style>', 1)
        body, tail = rest.split('<script>', 1)
        body = re.sub(r"(?<=[A-Za-z])'(?=[A-Za-z])", "\\u2019", body)
        doc = head + '</style>' + body + '<script>' + tail
        (OUT / p['file']).write_text(doc, encoding='utf-8')""")
b.write_text(t, encoding='utf-8')
print('patched')
