import pathlib
p = pathlib.Path('_build/pages/index.html')
s = p.read_text(encoding='utf-8')
marker = '<section class="section" id="process"'
print('found marker:', marker in s)
s = s.replace(marker, '{{PRODUCTS_HOME}}\n\n' + marker, 1)
p.write_text(s, encoding='utf-8')
