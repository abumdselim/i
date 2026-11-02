import pathlib, re
root = pathlib.Path('.')
files = sorted(root.glob('*.html'))
missing = []
for f in files:
    html = f.read_text(encoding='utf-8')
    for m in re.finditer(r'(?:href|src)="([^"]+)"', html):
        u = m.group(1)
        if u.startswith(('http', 'mailto:', '#')):
            continue
        target = u.split('#')[0]
        if not target:
            continue
        if not (root / target).exists():
            missing.append((f.name, u))
print('pages:', len(files))
print('missing:', missing[:20])
# count unique hrefs per page
h = (root/'index.html').read_text(encoding='utf-8')
print('nav items:', len(re.findall(r'class="nav__link"', h)))
print('icons used:', len(set(re.findall(r'<use href="#([a-z-]+)"', h))))
