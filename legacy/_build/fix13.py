import pathlib
c = pathlib.Path('_build/styles.css')
s = c.read_text(encoding='utf-8')
s = s.replace('.eng__link{margin-top:20px;display:inline-flex}', '.eng__link{margin-top:20px;display:inline-flex;align-self:flex-start}')
s = s.replace('  letter-spacing:-.04em;\n  font-weight:600;\n  text-wrap:balance;', '  letter-spacing:-.03em;\n  font-weight:600;\n  text-wrap:balance;')
c.write_text(s, encoding='utf-8')
print('ok')
