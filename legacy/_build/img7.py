from PIL import Image
import os
im = Image.open('assets/img/intactic-mark.png').convert('RGB')
im = im.resize((1200,1200), Image.LANCZOS)
px = im.load(); w,h = im.size
bg=(236,242,250); fg=(17,95,200)
out = Image.new('RGBA',(w,h)); op = out.load()
for y in range(h):
    for x in range(w):
        p = px[x,y]
        a = 0.0
        for i in range(3):
            d = fg[i]-bg[i]
            if d: a += (p[i]-bg[i])/d
        a = max(0.0,min(1.0,a/3))
        op[x,y] = (fg[0],fg[1],fg[2],int(round(a*255)))
bb = out.getchannel('A').getbbox(); print('bbox',bb)
icon = out.crop(bb)
pad = round(max(icon.size)*0.12)
sq = Image.new('RGBA',(max(icon.size)+pad*2,)*2,(0,0,0,0))
sq.paste(icon, ((sq.width-icon.width)//2,(sq.height-icon.height)//2), icon)
for size,name in [(512,'icon-512.png'),(180,'icon-180.png'),(32,'icon-32.png')]:
    r = sq.resize((size,size), Image.LANCZOS); r.save('assets/img/'+name, optimize=True)
    print(name, os.path.getsize('assets/img/'+name), r.getchannel('A').getextrema())
