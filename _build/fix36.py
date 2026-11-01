import pathlib
p = pathlib.Path('_build/products.py')
s = p.read_text(encoding='utf-8')
old = "map_core='Case file',"
print('found:', s.count(old))
s = s.replace(old, "map_core='Legal OS',")
p.write_text(s, encoding='utf-8')
