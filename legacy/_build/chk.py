import pathlib, re
for f in ['_build/pages/index.html','_build/pages/services.html','_build/pages/about.html','_build/pages/contact.html']:
    s = pathlib.Path(f).read_text(encoding='utf-8')
    hits = re.findall(r"[A-Za-z]'(?:[A-Za-z]| )", s)
    print(f, s.count("'"), hits[:12])
b = pathlib.Path('_build/build.py').read_text(encoding='utf-8')
print('build.py single quotes:', b.count("'"))
