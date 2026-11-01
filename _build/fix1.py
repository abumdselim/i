import pathlib
p = pathlib.Path('_build/pages/index.html')
s = p.read_text(encoding='utf-8')
old = '<span class="eng__link linkarrow">Discuss this model'
new = '<a class="eng__link linkarrow" href="contact.html">Discuss this model'
print('eng spans:', s.count(old))
s = s.replace(old, new)
s = s.replace('''            <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>
          </span>''', '''            <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>
          </a>''')
old2 = 'Write to <a href="mailto:hello@intactic.net" style="color:var(--accent-ink);border-bottom:1px solid var(--accent-ink)">hello@intactic.net</a>'
new2 = 'Write to <a class="textlink" href="mailto:hello@intactic.net">hello@intactic.net</a>'
print('textlinks:', s.count(old2))
s = s.replace(old2, new2)
p.write_text(s, encoding='utf-8')
print('remaining </span> after linkarrow:', s.count('</span>'))
