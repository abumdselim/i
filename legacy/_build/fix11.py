import pathlib
b = pathlib.Path('_build/build.py')
s = b.read_text(encoding='utf-8')
s = s.replace('<p class="cta__note">No sales sequence. A working conversation.</p>', '<p class="cta__note">No sales sequence</p>')
b.write_text(s, encoding='utf-8')
