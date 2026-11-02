from PIL import Image
import os
src = {
 'assets/img/intactic-blue.png': [('assets/img/brand-blue-440.png', 440)],
 'assets/img/intactic-white.png': [('assets/img/brand-white-440.png', 440)],
 'assets/img/intactic-mark.png': [('assets/img/brand-icon-512.png', 512), ('assets/img/brand-icon-180.png', 180)],
}
for path, outs in src.items():
    im = Image.open(path).convert('RGBA')
    for out, w in outs:
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(out, optimize=True)
        print(out, w, h, os.path.getsize(out), 'bytes')
