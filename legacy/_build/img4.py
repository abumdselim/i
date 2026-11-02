from PIL import Image
import os

def trim_save(src, out, target_h, pad=0):
    im = Image.open(src).convert('RGBA')
    bb = im.getchannel('A').getbbox()
    im = im.crop(bb)
    w = round(im.width * target_h / im.height)
    im = im.resize((w, target_h), Image.LANCZOS)
    im.save(out, optimize=True)
    print(out, im.size, os.path.getsize(out))

trim_save('assets/img/intactic-blue.png', 'assets/img/logo-blue-500.png', 80)
trim_save('assets/img/intactic-white.png', 'assets/img/logo-white-500.png', 80)

# transparent icon from the flat-background mark
im = Image.open('assets/img/intactic-mark.png').convert('RGB')
bg = (236, 242, 250); fg = (17, 95, 200)
px = im.load()
w, h = im.size
out = Image.new('RGBA', (w, h))
op = out.load()
for y in range(h):
    for x in range(w):
        p = px[x, y]
        # alpha from the blue/background blend
        a = 0.0
        for i in range(3):
            d = fg[i] - bg[i]
            if d:
                a += (bg[i] - p[i]) / d
        a = max(0.0, min(1.0, a / 3))
        rr = 17; gg = 95; bb_ = 200
        op[x, y] = (rr, gg, bb_, int(round(a * 255)))
bb = out.getchannel('A').getbbox()
icon = out.crop(bb)
pad = round(max(icon.size) * 0.10)
sq = Image.new('RGBA', (max(icon.size) + pad * 2, max(icon.size) + pad * 2), (0, 0, 0, 0))
sq.paste(icon, ((sq.width - icon.width) // 2, (sq.height - icon.height) // 2), icon)
for size, name in [(512, 'icon-512.png'), (180, 'icon-180.png'), (32, 'icon-32.png')]:
    r = sq.resize((size, size), Image.LANCZOS)
    r.save('assets/img/' + name, optimize=True)
    print(name, r.size, os.path.getsize('assets/img/' + name))
