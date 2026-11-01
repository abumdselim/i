import pathlib
b = pathlib.Path('_build/build.py')
s = b.read_text(encoding='utf-8')
s = s.replace('<p>AI-first software engineering. Custom platforms, commerce, ERP and product interfaces, built to hold up.</p>',
              '<p>A software engineering studio. Custom platforms, commerce, ERP and product interfaces, built to be run by the teams that own them.</p>')
s = s.replace('<p class="mono">AI-first software studio</p>', '<p class="mono">Software engineering studio</p>')
s = s.replace('<li><a href="automation.html">AI automation</a></li>', '<li><a href="automation.html">Automation &amp; models</a></li>')
s = s.replace('desc=\'Intactic designs and builds custom software, multi-vendor commerce, ERP, web and mobile products where AI is part of the architecture.\'',
              'desc=\'Intactic designs and builds custom platforms, multi-vendor commerce, ERP and product interfaces for companies that have outgrown off-the-shelf software.\'')
b.write_text(s, encoding='utf-8')
print(s.count('AI-first'))
