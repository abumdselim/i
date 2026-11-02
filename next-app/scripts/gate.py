"""Parity gate for the TypeScript port.

Compares the Next.js export in `out/` against the frozen legacy snapshot in
`qa/reference/`, route by route, and refuses to call a page done when its text,
structure or design tokens drifted. Routes that are not ported yet are reported,
not failed — the gate has to be usable while the migration is half finished.

Run from next-app/:  python scripts/gate.py
Exit code 1 means a ported route regressed.
"""
from __future__ import annotations

import json
import pathlib
import re
import subprocess
import sys
from collections import Counter

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from parity import file_digest, main_text, signature, title_of  # noqa: E402

APP = pathlib.Path('.').resolve()
OUT = APP / 'out'
# Step 0 of docs/Go.md froze the legacy build here. Comparing against the living
# root HTML would blind the gate the moment `_build/` retires.
LEGACY = APP / 'qa' / 'reference'
BASELINE = LEGACY / 'baseline.json'


def read_manifest() -> dict:
    """The route manifest is TypeScript now (src/lib/content/pages.ts).

    Node strips the types and hands back the same literals the app renders, so
    there is still exactly one list of routes and the gate cannot disagree with
    the build about what should exist.
    """
    result = subprocess.run(
        ['node', 'scripts/manifest.mjs', '--json'],
        cwd=APP, capture_output=True, text=True, encoding='utf-8',
    )
    if result.returncode != 0:
        sys.exit(f'gate: could not read the route manifest\n{result.stderr}')
    return json.loads(result.stdout)


MANIFEST = read_manifest()

PORTED_EXCLUDE = {'_not-found.html'}


errors: list[str] = []
warnings: list[str] = []
report: list[tuple[str, str, int, int]] = []

# ---------------------------------------------------------------- inventory
exported = {p.name for p in OUT.glob('*.html')} - PORTED_EXCLUDE
expected = {page['file'] for page in MANIFEST['pages']}
extra = exported - expected
missing = expected - exported
if extra:
    errors.append(f'export produced unexpected pages: {sorted(extra)}')
if '404.html' not in exported:
    errors.append('404.html is not exported')

# ------------------------------------------------- frozen reference integrity
# The reference is the judge's yardstick; if it can drift, a green gate means
# nothing. baseline.json is written by scripts/freeze-reference.py.
if not BASELINE.exists():
    errors.append('qa/reference/baseline.json is missing — run scripts/freeze-reference.py')
else:
    for entry in json.loads(BASELINE.read_text(encoding='utf-8'))['pages']:
        frozen_path = LEGACY / entry['file']
        if not frozen_path.exists():
            errors.append(f"{entry['file']}: frozen reference is missing")
        elif file_digest(frozen_path) != entry['sha256']:
            errors.append(f"{entry['file']}: frozen reference drifted from baseline.json")

# ----------------------------------------------------------------- per page
for page in MANIFEST['pages']:
    legacy_path = LEGACY / page['file']
    out_path = OUT / page['file']
    if not out_path.exists():
        warnings.append(f"{page['route']:<18} not ported yet ({page['file']})")
        continue
    if not legacy_path.exists():
        errors.append(f"{page['file']}: no legacy source to compare against")
        continue

    src = out_path.read_text(encoding='utf-8')

    # structure: placeholders, sprite targets, duplicate ids, orphan anchors
    if '{{' in src:
        errors.append(f"{page['file']}: unresolved placeholder")
    symbols = set(re.findall(r'<symbol id="([a-z0-9-]+)"', src))
    for ref in set(re.findall(r'<use href="#([a-z0-9-]+)"', src)):
        if ref not in symbols:
            errors.append(f"{page['file']}: icon #{ref} missing from the sprite")
    ids = re.findall(r'\sid="([^"]+)"', src)
    dupes = [i for i, n in Counter(ids).items() if n > 1]
    if dupes:
        errors.append(f"{page['file']}: duplicate id {dupes[:4]}")
    for anchor in set(re.findall(r'href="#([^"]+)"', src)):
        if anchor and anchor not in ids and not anchor.startswith('i-') and anchor != 'top':
            errors.append(f"{page['file']}: anchor #{anchor} has no target")

    # the bootstrap must run before the header and before any page content;
    # React inserts one empty hidden div first, which is harmless
    gate_at = src.find("classList.add('reveal-ready')")
    header_at = src.find('<header')
    if gate_at < 0 or header_at < 0 or gate_at > header_at:
        errors.append(f"{page['file']}: theme/reveal bootstrap does not run before the header")

    # text parity
    legacy_text = main_text(legacy_path)
    port_text = main_text(out_path)
    if legacy_text is None or port_text is None:
        errors.append(f"{page['file']}: could not extract <main> text from one side")
        continue
    if legacy_text != port_text:
        # locate the first divergence so the report is actionable
        at = next(
            (i for i, (a, b) in enumerate(zip(legacy_text, port_text)) if a != b),
            min(len(legacy_text), len(port_text)),
        )
        errors.append(
            f"{page['file']}: text differs at char {at} "
            f"(legacy {len(legacy_text)} vs port {len(port_text)}): "
            f"...{legacy_text[max(0, at - 40):at + 40]!r} != ...{port_text[max(0, at - 40):at + 40]!r}"
        )

    # metadata parity
    if title_of(legacy_path) != title_of(out_path):
        errors.append(f"{page['file']}: <title> differs: {title_of(out_path)!r}")

    # markup parity: same elements, same classes, same order
    legacy_sig = signature(legacy_path)
    port_sig = signature(out_path)
    if legacy_sig != port_sig:
        at = next(
            (i for i, (a, b) in enumerate(zip(legacy_sig, port_sig)) if a != b),
            min(len(legacy_sig), len(port_sig)),
        )
        errors.append(
            f"{page['file']}: markup differs at element {at} "
            f"(legacy {len(legacy_sig)} vs port {len(port_sig)}): "
            f"{legacy_sig[at:at + 3]} != {port_sig[at:at + 3]}"
        )

    report.append((page['route'], page['file'], len(legacy_text), len(port_text)))

# ------------------------------------------------- design tokens in the CSS
css_files = sorted((OUT / '_next/static').rglob('*.css'))
if not css_files:
    errors.append('no CSS emitted')
else:
    css = '\n'.join(f.read_text(encoding='utf-8') for f in css_files)
    probes = {
        '.reveal-ready [data-reveal]': True,
        '.js [data-reveal]': False,
        '.js .layer__cells .cell': True,
        '--font-barlow': True,
        '--font-titillium': True,
        '--accent:#115fc8': True,
        '--head-h:74px': True,
    }
    for probe, want in probes.items():
        if (probe in css) is not want:
            errors.append(f"globals.css: expected {'to contain' if want else 'to omit'} {probe!r}")

# ------------------------------------------------------------- static files
if not (OUT / '_redirects').exists():
    errors.append('public/_redirects was not exported')

# ------------------------------------------------------------------ report
print(f"{'route':<20}{'file':<24}{'legacy':>8}{'port':>8}")
for route, file, a, b in report:
    print(f'{route:<20}{file:<24}{a:>8}{b:>8}')
print()
print(f'ported: {len(report)}/{len(expected)}   warnings: {len(warnings)}   errors: {len(errors)}')
for w in warnings:
    print('  warn ', w)
for e in errors:
    print('  ERR  ', e)

sys.exit(1 if errors else 0)
