"""Pixel-compare the two builds, route by route, width by width, theme by theme.

Reads what `scripts/capture.mjs` wrote and answers one question per pair: does the
ported page render the same pixels as the legacy page? It reports

  - size mismatches (a different page height means something structural moved),
  - the share of pixels that differ beyond a small channel tolerance,
  - a heatmap per failure, so a real difference can be looked at rather than guessed.

Run from next-app/ (after the capture):  python scripts/compare.py
Exit code 1 means at least one pair is outside tolerance.
"""
from __future__ import annotations

import json
import pathlib
import sys

from PIL import Image, ImageChops

OUT = pathlib.Path('qa')
CHANNEL_TOLERANCE = 12      # 0-255; ignores antialiasing and subpixel text noise
PIXEL_TOLERANCE = 0.0015    # 0.15% of the page may differ before it counts as a failure

if not (OUT / 'capture.json').exists():
    sys.exit('compare: qa/capture.json missing — run scripts/capture.mjs first')

shots = json.loads((OUT / 'capture.json').read_text(encoding='utf-8'))
index = {(s['build'], s['route'], s['viewport'], s['theme']): s for s in shots}

diff_dir = OUT / 'diff'
diff_dir.mkdir(exist_ok=True)

rows = []
failures = 0
missing = 0

keys = {(s['route'], s['viewport'], s['theme']) for s in shots}
for route, viewport, theme in sorted(keys):
    legacy = index.get(('legacy', route, viewport, theme))
    port = index.get(('port', route, viewport, theme))
    if not legacy or not port:
        missing += 1
        rows.append((route, viewport, theme, 'MISSING', 0.0, None))
        continue

    left = Image.open(legacy['file']).convert('RGB')
    right = Image.open(port['file']).convert('RGB')

    if left.size != right.size:
        failures += 1
        rows.append((route, viewport, theme, 'SIZE', 1.0, f'{left.size} vs {right.size}'))
        continue

    delta = ImageChops.difference(left, right).convert('L')
    # anything under the channel tolerance is noise, not a difference
    mask = delta.point(lambda value: 255 if value > CHANNEL_TOLERANCE else 0)
    histogram = mask.histogram()
    total = left.size[0] * left.size[1]
    changed = histogram[255] / total

    status = 'ok' if changed <= PIXEL_TOLERANCE else 'DIFF'
    if status == 'DIFF':
        failures += 1
        box = mask.getbbox()
        heat = Image.merge('RGB', (mask, Image.new('L', left.size, 0), Image.new('L', left.size, 0)))
        heat.save(diff_dir / f'{route}@{viewport}-{theme}.png')
        rows.append((route, viewport, theme, status, changed, f'bbox {box}'))
        continue

    rows.append((route, viewport, theme, status, changed, None))

rows.sort(key=lambda row: (-row[4], row[0]))
print(f'{"route":<18}{"width":<7}{"theme":<7}{"status":<8}{"changed":>9}')
for route, viewport, theme, status, changed, note in rows:
    extra = f'  {note}' if note else ''
    print(f'{route:<18}{viewport:<7}{theme:<7}{status:<8}{changed * 100:>8.3f}%{extra}')

print()
print(f'pairs: {len(rows)}  failures: {failures}  missing: {missing}')
if failures:
    print(f'heatmaps: {diff_dir}')
sys.exit(1 if failures else 0)
