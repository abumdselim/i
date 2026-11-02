import re, base64, urllib.request
css = open('_build/fonts/geist.css', encoding='utf-8').read()
blocks = re.findall(r'/\*\s*([a-z\-]+)\s*\*/\s*@font-face\s*\{(.*?)\}', css, re.S)
out = []
for subset, body in blocks:
    if subset != 'latin':
        continue
    fam = re.search(r"font-family:\s*'([^']+)'", body).group(1)
    wght = re.search(r"font-weight:\s*([^;]+);", body).group(1).strip()
    url = re.search(r"url\((https://[^)]+)\)", body).group(1)
    data = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'}), timeout=60).read()
    print(fam, wght, len(data), 'bytes')
    out.append("@font-face{font-family:'%s';font-style:normal;font-weight:%s;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2');}" % (fam, wght, base64.b64encode(data).decode()))

# keep the two IBM Plex Mono faces from the existing file
old = open('_build/fonts/fonts.css', encoding='utf-8').read()
for line in old.split('\n'):
    if 'IBM Plex Mono' in line:
        out.append(line)

open('_build/fonts/fonts.css', 'w', encoding='utf-8').write('\n'.join(out))
print('total', sum(len(x) for x in out))
