from PIL import Image
im = Image.open('assets/img/intactic-mark.png').convert('RGB').resize((100,100), Image.LANCZOS)
px = im.load(); w,h = im.size
bg=(236,242,250); fg=(17,95,200)
vals=[]
for y in range(h):
    for x in range(w):
        p=px[x,y]
        a=0.0
        for i in range(3):
            d=fg[i]-bg[i]
            if d: a += (bg[i]-p[i])/d
        a=max(0.0,min(1.0,a/3))
        vals.append(a)
print('max', max(vals), 'count>0.5', sum(1 for v in vals if v>0.5), 'center', vals[50*100+50], 'px', px[50,50])
