import pathlib
c = pathlib.Path('_build/styles.css')
s = c.read_text(encoding='utf-8')
s = s.replace("""@media (max-width:820px){
  .cta__grid{grid-template-columns:1fr}""",
"""@media (max-width:820px){
  .cta__grid{grid-template-columns:1fr}
  .cta__actions{justify-self:start}""")
c.write_text(s, encoding='utf-8')
print('cta mobile fixed')
