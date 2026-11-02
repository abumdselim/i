import pathlib
p = pathlib.Path('_build/styles.css')
s = p.read_text(encoding='utf-8')
old = """.brand .logo--white{display:none}
html[data-theme="dark"] .brand .logo--blue{display:none}
html[data-theme="dark"] .brand .logo--white{display:block}"""
new = """.logo--white{display:none}
html[data-theme="dark"] .logo--blue{display:none}
html[data-theme="dark"] .logo--white{display:block}"""
print('found:', old in s)
s = s.replace(old, new)
# footer-specific leftovers that assumed the old scope
s = s.replace("html[data-theme=\"dark\"] .foot__brand img.logo--blue{display:none}\n", "")
p.write_text(s, encoding='utf-8')
