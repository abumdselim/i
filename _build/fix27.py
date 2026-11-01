import pathlib
p = pathlib.Path('_build/pages/contact.html')
s = p.read_text(encoding='utf-8')
s = s.replace('<option>AI automation</option>', '<option>Automation &amp; models</option>')
p.write_text(s, encoding='utf-8')
print('fixed', 'AI automation' in s)
