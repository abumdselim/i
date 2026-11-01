from PIL import Image
for p in ['assets/img/intactic-blue.png','assets/img/intactic-white.png','assets/img/intactic-mark.png']:
    im=Image.open(p); print(p, im.size, im.mode, im.convert('RGBA').getchannel('A').getbbox())
