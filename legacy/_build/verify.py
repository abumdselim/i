"""Structural checks on the built pages.

Not a test suite: a gate that catches the mistakes this build can actually make —
an unresolved placeholder, an icon that is not in the sprite, an anchor that points
at no id, a duplicated id, a missing meta rail on a data page.
"""
import pathlib
import re
import sys
from collections import Counter

from lxml import html as LH

ROOT = pathlib.Path('.')
PAGES = sorted(ROOT.glob('*.html'))
SPRITE = (pathlib.Path('_build') / 'icons.svg').read_text(encoding='utf-8')
SYMBOLS = set(re.findall(r'<symbol id="([a-z0-9-]+)"', SPRITE))


def cls(name):
    return '//*[contains(concat(" ", normalize-space(@class), " "), " %s ")]' % name


def svg_uses(node):
    return node.xpath('.//*[local-name()="use"]')


errors = []
warnings = []

DATA_PAGES = {
    'custom-software.html', 'ecommerce.html', 'erp.html', 'web-platforms.html',
    'mobile-apps.html', 'automation.html', 'shamlai.html', 'pharmasys.html',
    'pdfing-pro.html', 'icounsel.html',
}

for page in PAGES:
    src = page.read_text(encoding='utf-8')
    name = page.name

    if '{{' in src:
        errors.append('%s: unresolved placeholder %s' % (name, re.findall(r'\{\{[^}]*\}\}', src)[:3]))

    for ref in set(re.findall(r'<use href="#([a-z0-9-]+)"', src)):
        if ref not in SYMBOLS:
            errors.append('%s: icon #%s missing from sprite' % (name, ref))

    ids = re.findall(r'\sid="([^"]+)"', src)
    dupes = [i for i, n in Counter(ids).items() if n > 1]
    if dupes:
        errors.append('%s: duplicate id %s' % (name, dupes[:5]))

    for a in set(re.findall(r'href="#([^"]+)"', src)):
        if a and a not in ids and a != 'top':
            errors.append('%s: anchor #%s has no target' % (name, a))

    try:
        doc = LH.fromstring(src)
    except Exception as exc:  # noqa: BLE001
        errors.append('%s: parse failed %s' % (name, exc))
        continue

    for li in doc.xpath(cls('speclist') + '//li'):
        if len(svg_uses(li)) != 1:
            errors.append('%s: speclist row without exactly one icon' % name)

    for link in doc.xpath(cls('page-index') + '//a'):
        target = (link.get('href') or '')[1:]
        if target and target not in ids:
            errors.append('%s: page index target #%s missing' % (name, target))

    if page.name in DATA_PAGES:
        if not doc.xpath(cls('page-head__meta') + '//*[contains(@class,"meta-txt")]'):
            errors.append('%s: page head meta rail missing values' % name)
        if len(doc.xpath(cls('rule__id'))) != len(doc.xpath(cls('rule'))):
            errors.append('%s: rule rows without an icon id' % name)

    for eb in doc.xpath(cls('eyebrow--i')):
        if not eb.xpath('.//*[local-name()="svg"]'):
            warnings.append('%s: eyebrow--i without icon (%s)' % (name, eb.text_content().strip()[:40]))

    icon_count = len(doc.xpath('//main//*[local-name()="svg" and contains(@class,"icon")]'))
    print('%-22s ids %-3d icons %-3d index %d' % (
        name, len(ids), icon_count, len(doc.xpath(cls('page-index') + '//a'))))

print()
print('pages:', len(PAGES), ' symbols:', len(SYMBOLS))
if warnings:
    print('warnings:', len(warnings))
    for w in warnings[:10]:
        print('  ', w)
if errors:
    print('ERRORS:', len(errors))
    for e in errors:
        print('  ', e)
    sys.exit(1)
print('OK - no structural errors')
