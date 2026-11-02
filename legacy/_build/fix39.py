import pathlib, re

# 1) data: five industries + stack groups
p = pathlib.Path('_build/products.py')
s = p.read_text(encoding='utf-8')
start = s.index('INDUSTRIES = [')
new_ind = """INDUSTRIES = [
    ('01', 'Retail &amp; wholesale', 'Counters, stock, supplier dues and a daily profit figure, with or without a connection.'),
    ('02', 'Pharmacy &amp; healthcare', 'Generic alternatives, DGDA checks and stock counted down to the piece.'),
    ('03', 'Legal practice', 'Cause lists, limitation dates and judgment summaries for chambers.'),
    ('04', 'Commerce &amp; marketplaces', 'Vendors, commissions, payouts and fulfilment that reconcile before the storefront is drawn.'),
    ('05', 'Professional offices', 'Contracts, filings and archives that must not leave the building.'),
]

STACK = [
    ('Languages', ['TypeScript', 'Python', 'Kotlin', 'Swift', 'Dart', 'SQL']),
    ('Frameworks', ['Next.js', 'React', 'Node', 'Django', 'Flutter', 'React Native']),
    ('Data', ['PostgreSQL', 'SQLite', 'Redis', 'pgvector', 'Cloudflare D1', 'R2']),
    ('Infrastructure', ['Cloudflare Workers', 'AWS', 'Docker', 'Temporal', 'Firebase', 'GitHub Actions']),
]
"""
s = s[:start] + new_ind
p.write_text(s, encoding='utf-8')

# 2) hub: drop the industries band (now on home)
q = pathlib.Path('_build/prodpage.py')
t = q.read_text(encoding='utf-8')
t = t.replace("def prods_hub(products, industries):", "def prods_hub(products):")
start = t.index("    inds = ''.join(")
end = t.index("    return \"\"\"<section class=\"page-head\"")
t = t[:start] + t[end:]
# remove the industries section block from the template
start = t.index('<section class="section section--tint" data-od-id="industries">')
end = t.index('<section class="section">\n  <div class="shell">\n    <div class="split">')
t = t[:start] + t[end:]
t = t.replace('""" % dict(cards=\'\'.join(cards), inds=inds)', '""" % dict(cards=\'\'.join(cards))')
q.write_text(t, encoding='utf-8')

# 3) build.py wiring
b = pathlib.Path('_build/build.py')
u = b.read_text(encoding='utf-8')
u = u.replace("from products import PRODUCTS, INDUSTRIES", "from products import PRODUCTS, INDUSTRIES, STACK")
u = u.replace("from prodpage import prod_body, prods_hub, prods_strip",
              "from prodpage import prod_body, prods_hub, prods_strip\nfrom sections import industries_section, stack_section")
u = u.replace("body = prods_hub(PRODUCTS, INDUSTRIES)", "body = prods_hub(PRODUCTS)")
u = u.replace("        body = body.replace('{{PRODUCTS_HOME}}', prods_strip(PRODUCTS))",
"""        body = body.replace('{{PRODUCTS_HOME}}', prods_strip(PRODUCTS))
        body = body.replace('{{INDUSTRIES_HOME}}', industries_section(INDUSTRIES))
        body = body.replace('{{STACK_HOME}}', stack_section(STACK, tint=True))""")
b.write_text(u, encoding='utf-8')

# 4) index placeholders
i = pathlib.Path('_build/pages/index.html')
v = i.read_text(encoding='utf-8')
v = v.replace('{{PRODUCTS_HOME}}', '{{PRODUCTS_HOME}}\n\n{{INDUSTRIES_HOME}}\n\n{{STACK_HOME}}')
i.write_text(v, encoding='utf-8')

# 5) css
c = pathlib.Path('_build/styles.css')
w = c.read_text(encoding='utf-8')
w = w.replace('/* ---------- product page head ---------- */', """/* ---------- stack section ---------- */
.stacksec{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0 clamp(24px,3vw,40px);border-top:1px solid var(--line-2)}
.stackcol{padding-top:20px}
.stackcol h3{
  font-family:var(--font-mono);font-size:.625rem;letter-spacing:.1em;text-transform:uppercase;
  color:var(--muted-2);font-weight:400;padding-bottom:12px;border-bottom:1px solid var(--line);margin-bottom:2px;
}
.stackcol li{font-size:.9375rem;line-height:1.4;padding:9px 0;border-bottom:1px solid var(--line);color:var(--ink-2)}
.stacknote{margin-top:26px;font-size:.875rem;line-height:1.6;color:var(--muted);max-width:70ch}
@media (max-width:900px){.stacksec{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:30px}}
@media (max-width:520px){.stacksec{grid-template-columns:1fr;row-gap:24px}}

/* ---------- product page head ---------- */""")
c.write_text(w, encoding='utf-8')
print('patched')
