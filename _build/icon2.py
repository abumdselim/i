from PIL import Image
import os
Image.MAX_IMAGE_PIXELS = None
im = Image.open('assets/img/brand-icon-source.png').convert('RGBA')
bb = im.getchannel('A').getbbox()
icon = im.crop(bb)
side = max(icon.size)
pad = round(side * 0.08)
sq = Image.new('RGBA', (side + pad*2, side + pad*2), (0,0,0,0))
sq.paste(icon, ((sq.width-icon.width)//2, (sq.height-icon.height)//2), icon)
for size, name in [(512,'icon-512.png'),(180,'icon-180.png'),(64,'icon-64.png'),(32,'icon-32.png')]:
    r = sq.resize((size,size), Image.LANCZOS)
    r.save('assets/img/'+name, optimize=True)
    print(name, r.size, os.path.getsize('assets/img/'+name), 'bytes')
