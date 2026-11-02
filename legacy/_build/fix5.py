import pathlib
p = pathlib.Path('_build/pages/index.html')
s = p.read_text(encoding='utf-8')
old = '''          <div class="plate__bar">
            <span>System lattice</span>
            <span>Fig. 01</span>
          </div>
          <div class="plate__body">
            {{LATTICE}}
          </div>'''
new = '''          <div class="plate__bar">
            <span>System plate</span>
            <span>Fig. 01</span>
          </div>
          {{PLATE}}'''
print('found:', s.count(old))
s = s.replace(old, new)
s = s.replace('<figcaption>The same square builds the mark, the interface and the system underneath it.</figcaption>',
              '<figcaption>One module, three layers. The same square draws the interface, the model and the data beneath it.</figcaption>')
p.write_text(s, encoding='utf-8')
print('ok', s.count('{{PLATE}}'))
