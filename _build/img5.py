from PIL import Image
im = Image.open('assets/img/icon-512.png')
print(im.mode, im.size, im.getextrema())
print('bbox', im.getchannel('A').getbbox())
print('center', im.getpixel((256,256)))
print('bg sample', im.getpixel((5,5)))
