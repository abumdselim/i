import pathlib
b = pathlib.Path('_build/build.py')
s = b.read_text(encoding='utf-8')
s = s.replace("import pathlib, re\nfrom cats import CATS\nfrom catpage import cat_body\n",
"import pathlib, re, sys\nsys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))\nfrom cats import CATS\nfrom catpage import cat_body\n", 1)
b.write_text(s, encoding='utf-8')
