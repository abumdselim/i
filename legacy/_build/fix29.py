import pathlib
c = pathlib.Path('_build/styles.css')
s = c.read_text(encoding='utf-8')
s = s.replace('.map{border:1px solid var(--line-2);background:var(--surface)}', '.map{border:1px solid var(--line-2);background:var(--bg-2)}')
c.write_text(s, encoding='utf-8')
print('map surface set')
