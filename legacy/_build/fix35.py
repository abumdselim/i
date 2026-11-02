import pathlib
b = pathlib.Path('_build/build.py')
s = b.read_text(encoding='utf-8')
s = s.replace("title='%s — %s' % (p['name'], p['domain']),", "title='%s — Intactic' % p['name'],")
b.write_text(s, encoding='utf-8')

sm = pathlib.Path('sitemap.xml')
x = sm.read_text(encoding='utf-8')
add = """  <url><loc>https://intactic.net/products.html</loc><lastmod>2026-11-01</lastmod><priority>0.9</priority></url>
  <url><loc>https://intactic.net/shamlai.html</loc><lastmod>2026-11-01</lastmod><priority>0.8</priority></url>
  <url><loc>https://intactic.net/pharmasys.html</loc><lastmod>2026-11-01</lastmod><priority>0.8</priority></url>
  <url><loc>https://intactic.net/pdfing-pro.html</loc><lastmod>2026-11-01</lastmod><priority>0.8</priority></url>
  <url><loc>https://intactic.net/icounsel.html</loc><lastmod>2026-11-01</lastmod><priority>0.8</priority></url>
</urlset>"""
x = x.replace('</urlset>', add)
sm.write_text(x, encoding='utf-8')
print('ok')
