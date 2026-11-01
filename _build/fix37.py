import pathlib
c = pathlib.Path('_build/styles.css')
s = c.read_text(encoding='utf-8')
s = s.replace("--font-sans:'Archivo','Segoe UI',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;",
              "--font-sans:'Geist','Segoe UI',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;")
# tracking for Geist
s = s.replace("  letter-spacing:-.03em;\n  font-weight:600;\n  text-wrap:balance;", "  letter-spacing:-.025em;\n  font-weight:600;\n  text-wrap:balance;")
s = s.replace("  letter-spacing:-.032em;\n  font-weight:600;\n  text-wrap:balance;", "  letter-spacing:-.024em;\n  font-weight:600;\n  text-wrap:balance;")
s = s.replace("  letter-spacing:-.021em;\n  font-weight:600;\n}", "  letter-spacing:-.016em;\n  font-weight:600;\n}")
s = s.replace("  letter-spacing:-.012em;\n  color:var(--muted);\n}", "  letter-spacing:-.008em;\n  color:var(--muted);\n}")
s = s.replace(".body{font-size:1rem;line-height:1.68;letter-spacing:-.006em;color:var(--muted)}",
              ".body{font-size:1rem;line-height:1.68;letter-spacing:-.003em;color:var(--muted)}")
c.write_text(s, encoding='utf-8')

for f in ['_build/pages/index.html', '_build/pages/services.html']:
    p = pathlib.Path(f)
    t = p.read_text(encoding='utf-8')
    for a, b in [('ERP &amp; operations</h3>', 'ERP and operations</h3>'),
                 ('Assessment &amp; augmentation</h3>', 'Assessment and augmentation</h3>'),
                 ('Automation &amp; models</h3>', 'Automation and models</h3>')]:
        t = t.replace(a, b)
    p.write_text(t, encoding='utf-8')
print('done')
