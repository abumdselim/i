import pathlib
# 1) split tokens out of styles.css
p = pathlib.Path('_build/styles.css')
s = p.read_text(encoding='utf-8')
start = s.index(':root{')
end = s.index('/* ---------- reset ---------- */')
tokens = s[start:end].rstrip() + '\n'
rest = s[:start] + s[end:]
header = """/* ============================================================
   INTACTIC — design tokens (single source of truth)
   Consumed by styles.css at build time. Documented in docs/TOKENS.md
   and exported to docs/tokens.json.
   ============================================================ */

"""
pathlib.Path('_build/tokens.css').write_text(header + tokens, encoding='utf-8')
p.write_text(rest, encoding='utf-8')
print('tokens.css', len(tokens), 'bytes; styles.css', len(rest))

# 2) build.py wiring
b = pathlib.Path('_build/build.py')
t = b.read_text(encoding='utf-8')
t = t.replace("CSS = read('styles.css')", "CSS = read('tokens.css') + '\\n' + read('styles.css')")
t = t.replace("from sections import industries_section, stack_section",
              "from sections import industries_section, stack_section\nfrom tokens_doc import write_token_docs")
t = t.replace("if __name__ == '__main__':\n    build()",
              "if __name__ == '__main__':\n    build()\n    n = write_token_docs()\n    print('tokens documented:', n)")
b.write_text(t, encoding='utf-8')
print('build wired')
