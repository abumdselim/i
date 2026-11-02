import pathlib
s = pathlib.Path('_build/pages/index.html').read_text(encoding='utf-8')
print('U+2019 count:', s.count('\u2019'))
i = s.find('you')
print(repr(s[i-40:i+40]))
for w in ['don\u2019t','doesn\u2019t','you\u2019re','we\u2019re','It\u2019s']:
    print(w, s.count(w))
