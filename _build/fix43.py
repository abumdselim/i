import pathlib
p = pathlib.Path('_build/styles.css')
s = p.read_text(encoding='utf-8')
s = s.replace('.cap__idx{font-family:var(--font-mono);font-size:.6875rem;letter-spacing:.09em;color:var(--muted-2);font-variant-numeric:tabular-nums}\n', '')
p.write_text(s, encoding='utf-8')
print('dead css removed:', 'cap__idx' not in s)
