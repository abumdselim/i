from PIL import Image
Image.MAX_IMAGE_PIXELS = None
im = Image.open('assets/img/brand-icon-source.png')
print(im.size, im.mode)
im = im.convert('RGBA')
print('alpha', im.getchannel('A').getextrema(), 'bbox', im.getchannel('A').getbbox())
im.resize((256,256), Image.LANCZOS).save('_build/icon-preview.png')
