import re, base64, urllib.request, textwrap, io, sys
css = open('_build/fonts/gf.css', encoding='utf-8').read()
blocks = re.findall(r'/\*\s*([a-z\-]+)\s*\*/\s*@font-face\s*\{(.*?)\}', css, re.S)
out = []
seen = set()
for subset, body in blocks:
    if subset != 'latin':
        continue
    fam = re.search(r"font-family:\s*'([^']+)'", body).group(1)
    wght = re.search(r"font-weight:\s*([^;]+);", body).group(1).strip()
    url = re.search(r"url\((https://[^)]+)\)", body).group(1)
    key = (fam, wght)
    if key in seen: continue
    seen.add(key)
    req = urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
    data = urllib.request.urlopen(req, timeout=60).read()
    print(fam, wght, len(data), 'bytes')
    b64 = base64.b64encode(data).decode()
    out.append(f"@font-face{{font-family:'{fam}';font-style:normal;font-weight:{wght};font-display:swap;src:url(data:font/woff2;base64,{b64}) format('woff2');}}")
open('_build/fonts/fonts.css','w',encoding='utf-8').write('\n'.join(out))
print('total css bytes', sum(len(x) for x in out))
