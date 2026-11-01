import pathlib
c = pathlib.Path('_build/styles.css')
s = c.read_text(encoding='utf-8')
s = s.replace(".btn--white{background:#fff;color:var(--ink);border-color:#fff}", ".btn--white{background:#fff;color:#0a1626;border-color:#fff}")
s = s.replace("html{-webkit-text-size-adjust:100%;scroll-behavior:smooth;scroll-padding-top:calc(var(--head-h) + 24px)}",
"html{-webkit-text-size-adjust:100%;scroll-behavior:smooth;scroll-padding-top:calc(var(--head-h) + 24px);color-scheme:light}")
s = s.replace('html[data-theme="dark"]{\n  --bg:#070d16;', 'html[data-theme="dark"]{\n  color-scheme:dark;\n  --bg:#070d16;')
c.write_text(s, encoding='utf-8')
print('ok')
