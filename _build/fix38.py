import pathlib
p = pathlib.Path('_build/pages/index.html')
s = p.read_text(encoding='utf-8')
old = '        <p class="eyebrow" data-reveal>Software engineering studio</p>\n'
print('found:', s.count(old))
s = s.replace(old, '')
s = s.replace('<h1 class="display" id="hero-title" data-reveal style="--d:.06s">', '<h1 class="display" id="hero-title" data-reveal style="--d:.02s">')
p.write_text(s, encoding='utf-8')
