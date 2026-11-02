import pathlib
for f in ['_build/pages/about.html','_build/pages/approach.html','_build/pages/process.html','_build/pages/contact.html','_build/prodpage.py','_build/pages/products.html']:
    p = pathlib.Path(f)
    if not p.exists(): continue
    s = p.read_text(encoding='utf-8')
    s = s.replace('font-size:1.0625rem;letter-spacing:-.012em', 'font-size:var(--text-h4);letter-spacing:0')
    s = s.replace('class="body" style="font-size:.9375rem"', 'class="body"')
    p.write_text(s, encoding='utf-8')
print('inline sizes removed')
