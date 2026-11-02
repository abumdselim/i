import pathlib, re, html

logos = {
 'typescript':'typescript','python':'python','kotlin':'kotlin','swift':'swift','dart':'dart',
 'sqlite':'sqlite','nextdotjs':'nextdotjs','react':'react','nodedotjs':'nodedotjs','django':'django',
 'flutter':'flutter','postgresql':'postgresql','redis':'redis','cloudflare':'cloudflare',
 'docker':'docker','temporal':'temporal','firebase':'firebase','githubactions':'githubactions','aws':'aws',
}
symbols = []
for slug, fname in logos.items():
    f = pathlib.Path('_build/logos/%s.svg' % fname)
    if not f.exists():
        print('skip', slug); continue
    svg = f.read_text(encoding='utf-8', errors='ignore')
    ds = re.findall(r'<path[^>]*\sd="([^"]+)"', svg)
    if not ds:
        print('no path', slug); continue
    body = ''.join('<path d="%s"/>' % d for d in ds)
    symbols.append('<symbol id="s-%s" viewBox="0 0 24 24">%s</symbol>' % (slug, body))

p = pathlib.Path('_build/icons.svg')
s = p.read_text(encoding='utf-8')
# drop any previous brand symbols
s = re.sub(r'<symbol id="s-[a-z0-9]+".*?</symbol>', '', s, flags=re.S)
s = s.replace('</svg>', '\n'.join(symbols) + '\n</svg>')
p.write_text(s, encoding='utf-8')
print('brand symbols:', len(symbols), 'sprite bytes:', len(s))
