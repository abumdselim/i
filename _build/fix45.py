import pathlib, re

# add the three new symbols
symbols = []
for slug in ['vercel', 'prisma', 'javascript']:
    f = pathlib.Path('_build/logos/%s.svg' % slug)
    if not f.exists():
        print('skip', slug); continue
    svg = f.read_text(encoding='utf-8', errors='ignore')
    ds = re.findall(r'<path[^>]*\sd="([^"]+)"', svg)
    body = ''.join('<path d="%s"/>' % d for d in ds)
    symbols.append('<symbol id="s-%s" viewBox="0 0 24 24">%s</symbol>' % (slug, body))

p = pathlib.Path('_build/icons.svg')
s = p.read_text(encoding='utf-8')
s = s.replace('</svg>', '\n'.join(symbols) + '\n</svg>')
p.write_text(s, encoding='utf-8')

# data: every entry carries a logo slug
q = pathlib.Path('_build/products.py')
t = q.read_text(encoding='utf-8')
start = t.index('STACK = [')
new = """STACK = [
    ('Languages', [('TypeScript', 'typescript'), ('Python', 'python'), ('JavaScript', 'javascript'),
                   ('Kotlin', 'kotlin'), ('Swift', 'swift'), ('Dart', 'dart')]),
    ('Frameworks', [('Next.js', 'nextdotjs'), ('React', 'react'), ('Node', 'nodedotjs'),
                    ('Django', 'django'), ('Flutter', 'flutter'), ('React Native', 'react')]),
    ('Data', [('PostgreSQL', 'postgresql'), ('SQLite', 'sqlite'), ('Redis', 'redis'),
              ('Prisma', 'prisma'), ('Cloudflare D1', 'cloudflare'), ('R2', 'cloudflare')]),
    ('Infrastructure', [('Cloudflare Workers', 'cloudflare'), ('Vercel', 'vercel'), ('Docker', 'docker'),
                        ('Temporal', 'temporal'), ('Firebase', 'firebase'), ('GitHub Actions', 'githubactions')]),
]
"""
t = t[:start] + new
q.write_text(t, encoding='utf-8')

# section: render logo + name
r = pathlib.Path('_build/sections.py')
u = r.read_text(encoding='utf-8')
u = u.replace("""        lis = ''.join('<li>%s</li>' % i for i in items)""",
"""        lis = ''.join(
            '<li><svg class="slogo" aria-hidden="true"><use href="#s-%s"></use></svg><span>%s</span></li>' % (slug, name)
            for name, slug in items
        )""")
r.write_text(u, encoding='utf-8')

# css: rows with logos
c = pathlib.Path('_build/styles.css')
v = c.read_text(encoding='utf-8')
v = v.replace(".stackcol li{font-size:.9375rem;line-height:1.4;padding:9px 0;border-bottom:1px solid var(--line);color:var(--ink-2)}",
""".stackcol li{display:flex;align-items:center;gap:11px;font-size:.9375rem;line-height:1.4;padding:9px 0;border-bottom:1px solid var(--line);color:var(--ink-2)}
.slogo{width:18px;height:18px;flex:none;fill:currentColor;color:var(--muted);transition:color .18s ease}
.stackcol li:hover .slogo{color:var(--accent)}""")
c.write_text(v, encoding='utf-8')
print('done')
