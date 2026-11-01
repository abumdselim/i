import pathlib
c = pathlib.Path('_build/styles.css')
s = c.read_text(encoding='utf-8')
s = s.replace('  --bg-2:#f5f7fa;\n  --bg-3:#edf1f7;', '  --bg-2:#f3f6fa;\n  --bg-3:#e8eef6;')
s = s.replace('.hero{position:relative;border-bottom:1px solid var(--line)}',
              '.hero{position:relative;background:var(--bg-2);border-bottom:1px solid var(--line)}')
s = s.replace('.page-head{padding-top:clamp(48px,5vw,76px);padding-bottom:clamp(36px,4vw,56px);border-bottom:1px solid var(--line)}',
              '.page-head{padding-top:clamp(48px,5vw,76px);padding-bottom:clamp(36px,4vw,56px);background:var(--bg-2);border-bottom:1px solid var(--line)}')
s = s.replace('.foot{border-top:1px solid var(--line);padding-top:clamp(40px,5vw,64px);padding-bottom:28px}',
              '.foot{background:var(--bg-2);border-top:1px solid var(--line);padding-top:clamp(40px,5vw,64px);padding-bottom:28px}')
c.write_text(s, encoding='utf-8')
print('surfaces updated')
