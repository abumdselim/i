import pathlib, re
f = pathlib.Path('_build/logos/sentry.svg')
if f.exists():
    svg = f.read_text(encoding='utf-8', errors='ignore')
    ds = re.findall(r'<path[^>]*\sd="([^"]+)"', svg)
    sym = '<symbol id="s-sentry" viewBox="0 0 24 24">%s</symbol>' % ''.join('<path d="%s"/>' % d for d in ds)
    p = pathlib.Path('_build/icons.svg')
    s = p.read_text(encoding='utf-8')
    if 'id="s-sentry"' not in s:
        s = s.replace('</svg>', sym + '\n</svg>')
        p.write_text(s, encoding='utf-8')
    print('symbol added', 's-sentry' in s)

q = pathlib.Path('_build/products.py')
t = q.read_text(encoding='utf-8')
start = t.index('STACK = [')
new = """STACK = [
    ('Languages', [('TypeScript', 'typescript'), ('Python', 'python'), ('JavaScript', 'javascript'),
                   ('Kotlin', 'kotlin'), ('Swift', 'swift'), ('Dart', 'dart')]),
    ('Frameworks &amp; runtimes', [('Next.js', 'nextdotjs'), ('React', 'react'), ('Node.js', 'nodedotjs'),
                                   ('Django', 'django'), ('Flutter', 'flutter'), ('React Native', 'react')]),
    ('Data &amp; storage', [('PostgreSQL', 'postgresql'), ('SQLite', 'sqlite'), ('Redis', 'redis'),
                            ('Prisma', 'prisma'), ('Cloudflare D1', 'cloudflare'), ('R2', 'cloudflare')]),
    ('Infrastructure', [('Cloudflare Workers', 'cloudflare'), ('Vercel', 'vercel'), ('Docker', 'docker'),
                        ('Temporal', 'temporal'), ('Sentry', 'sentry'), ('GitHub Actions', 'githubactions')]),
]
"""
t = t[:start] + new
q.write_text(t, encoding='utf-8')
print('stack data updated')
