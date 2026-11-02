from PIL import Image, ImageDraw
W, H = 1200, 630
BLUE = (17, 95, 200)
im = Image.new('RGB', (W, H), BLUE)
d = ImageDraw.Draw(im)

# modular lattice, three cascading bands (mirrors the site's system plate)
cols, rows = 11, 3
S, P = 40, 54
X0, Y0 = 592, 241
bands = {0: (2, 5), 1: (4, 6), 2: (6, 5)}
soft = {0: 7, 1: 10, 2: 5}
for r in range(rows):
    for c in range(cols):
        x, y = X0 + c * P, Y0 + r * P
        a, l = bands[r]
        if a <= c < a + l:
            d.rectangle([x, y, x + S - 1, y + S - 1], fill=(255, 255, 255))
        elif c == soft.get(r, -1):
            d.rectangle([x, y, x + S - 1, y + S - 1], fill=(86, 140, 214))
        else:
            d.rectangle([x, y, x + S - 1, y + S - 1], outline=(74, 128, 205), width=1)

# logo, white version, top-left
logo = Image.open('assets/img/logo-white-500.png').convert('RGBA')
lw = 380
lh = round(logo.height * lw / logo.width)
logo = logo.resize((lw, lh), Image.LANCZOS)
im.paste(logo, (80, 92), logo)

# thin rule under the logo
d.rectangle([80, 210, 80 + 64, 212], fill=(255, 255, 255))

im.save('assets/img/og-1200x630.png', optimize=True)
print('ok', im.size)
