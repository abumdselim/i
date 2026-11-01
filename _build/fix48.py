import pathlib, re
f = pathlib.Path('_build/logos/meilisearch.svg')
if f.exists():
    svg = f.read_text(encoding='utf-8', errors='ignore')
    ds = re.findall(r'<path[^>]*\sd="([^"]+)"', svg)
    sym = '<symbol id="s-meilisearch" viewBox="0 0 24 24">%s</symbol>' % ''.join('<path d="%s"/>' % d for d in ds)
    p = pathlib.Path('_build/icons.svg'); s = p.read_text(encoding='utf-8')
    if 'id="s-meilisearch"' not in s:
        s = s.replace('</svg>', sym + '\n</svg>'); p.write_text(s, encoding='utf-8')
    print('symbol ok')

q = pathlib.Path('_build/products.py'); t = q.read_text(encoding='utf-8')
t = t.replace("""    ('Data &amp; storage', [('PostgreSQL', 'postgresql'), ('SQLite', 'sqlite'), ('Redis', 'redis'),
                            ('Prisma', 'prisma'), ('Cloudflare D1', 'cloudflare'), ('R2', 'cloudflare')]),""",
"""    ('Data &amp; storage', [('PostgreSQL', 'postgresql'), ('SQLite', 'sqlite'), ('Redis', 'redis'),
                            ('Prisma', 'prisma'), ('Meilisearch', 'meilisearch')]),""")
q.write_text(t, encoding='utf-8')

# tiles as bordered cards; no shared hairline background, so a short row leaves no hole
c = pathlib.Path('_build/styles.css'); v = c.read_text(encoding='utf-8')
v = v.replace(".stackgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}",
              ".stackgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}")
v = v.replace(""".stackcell{
  background:var(--surface);display:flex;align-items:center;gap:12px;
  padding:clamp(12px,1.4vw,16px) clamp(14px,1.6vw,18px);
  transition:background-color .18s ease;
}
.stackcell:hover{background:var(--bg-2)}""",
""".stackcell{
  background:var(--surface);border:1px solid var(--line);
  display:flex;align-items:center;gap:12px;
  padding:clamp(12px,1.4vw,16px) clamp(14px,1.6vw,18px);
  transition:border-color .18s ease;
}
.stackcell:hover{border-color:var(--line-2)}""")
c.write_text(v, encoding='utf-8')
print('stack trimmed')
