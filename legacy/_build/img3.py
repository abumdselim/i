from PIL import Image
im = Image.open('assets/img/intactic-mark.png').convert('RGB')
print('corner', im.getpixel((10,10)), 'center-ish', im.getpixel((2500,2500)))
from collections import Counter
c = Counter(im.resize((200,200)).getdata())
print(c.most_common(5))
