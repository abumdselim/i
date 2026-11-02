"""Pixel-compare the port against the approved screenshots.

`scripts/capture.mjs` photographs the current build; this compares each shot with
the baseline image of the same route, width and theme in `qa/reference/shots/`.
That baseline is the site as approved — originally the legacy build, and after an
intentional change, the build that replaced it (`scripts/approve.py --shots`).

Per pair it reports a size mismatch (something structural moved), the share of
pixels past a small channel tolerance, and a heatmap for anything that fails, so a
difference can be looked at rather than guessed.

Run from next-app/ (after the capture):  python scripts/compare.py
Exit code 1 means at least one pair is outside tolerance, or has no baseline.
"""
from __future__ import annotations

import json
import pathlib
import sys

from PIL import Image, ImageChops

OUT = pathlib.Path('qa')
BASELINE = OUT / 'reference' / 'shots'
CHANNEL_TOLERANCE = 12      # 0-255; ignores antialiasing and subpixel text noise
PIXEL_TOLERANCE = 0.0015    # 0.15% of the page may differ before it counts as a failure

if not (OUT / 'capture.json').exists():
    sys.exit('compare: qa/capture.json missing — run scripts/capture.mjs first')
if not BASELINE.exists():
    sys.exit('compare: qa/reference/shots missing — the baseline is part of the repository')

shots = json.loads((OUT / 'capture.json').read_text(encoding='utf-8'))

diff_dir = OUT / 'diff'
diff_dir.mkdir(exist_ok=True)

rows = []
failures = 0
missing = 0

for shot in sorted(shots, key=lambda s: (s['route'], s['viewport'], s['theme'])):
    route, viewport, theme = shot['route'], shot['viewport'], shot['theme']
    current_path = pathlib.Path(shot['file'])
    baseline_path = BASELINE / current_path.name

    if not baseline_path.exists():
        missing += 1
        rows.append((route, viewport, theme, 'NO BASELINE', 0.0, None))
        continue
    if not current_path.exists():
        missing += 1
        rows.append((route, viewport, theme, 'MISSING', 0.0, None))
        continue

    left = Image.open(baseline_path).convert('RGB')
    right = Image.open(current_path).convert('RGB')

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
print(f'{"route":<18}{"width":<7}{"theme":<7}{"status":<12}{"changed":>9}')
for route, viewport, theme, status, changed, note in rows:
    extra = f'  {note}' if note else ''
    print(f'{route:<18}{viewport:<7}{theme:<7}{status:<12}{changed * 100:>8.3f}%{extra}')

print()
print(f'pairs: {len(rows)}  failures: {failures}  missing: {missing}')
if failures:
    print(f'heatmaps: {diff_dir}')
sys.exit(1 if failures or missing else 0)
