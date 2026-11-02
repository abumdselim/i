import pathlib, re
banned = ['seamless','cutting-edge','cutting edge','leverage','unlock','empower','transform','revolution','next-gen','next generation','supercharge','state-of-the-art','game-chang','world-class','best-in-class','synerg','disrupt','elevate','harness','robust','holistic','paradigm','journey','solutions']
files = sorted(pathlib.Path('.').glob('*.html'))
issues = {}
for f in files:
    h = f.read_text(encoding='utf-8')
    text = re.sub(r'<script.*?</script>', ' ', h, flags=re.S)
    text = re.sub(r'<style.*?</style>', ' ', text, flags=re.S)
    text = re.sub(r'<[^>]+>', ' ', text)
    low = text.lower()
    hits = [w for w in banned if w in low]
    ai = len(re.findall(r'\bAI\b', text))
    dbl = text.count('&amp;amp;')
    if hits or ai or dbl:
        issues[f.name] = dict(banned=hits, AI=ai, double=dbl)
print('files:', len(files))
for k, v in issues.items():
    print(k, v)
