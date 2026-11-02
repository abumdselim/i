"""Move one page's baseline onto a deliberate change, and record why.

The gate refuses any text or markup difference from `qa/reference/`. That is what
makes it useful — and it means an intentional copy or markup change has to be
approved explicitly instead of quietly re-freezing the whole snapshot. This script
does that for one page: copy the built output into the reference, recompute its
digests, and append an entry to `baseline.json` so the next session can see who
moved the yardstick and why.

Run from next-app/, after `npm run build`:

    python scripts/approve.py contact.html --note "the brief form no longer asks for a budget"
    python scripts/approve.py contact.html --note "…" --shots

`--shots` also copies that page's `qa/port/*.png` captures into `qa/reference/shots/`,
so the visual baseline moves with it. Capture first (`npm run qa:capture -- --only <route>`).
"""
from __future__ import annotations

import argparse
import datetime
import hashlib
import json
import pathlib
import shutil
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from parity import main_text, signature, title_of  # noqa: E402

APP = pathlib.Path(__file__).resolve().parents[1]
OUT = APP / 'out'
REFERENCE = APP / 'qa' / 'reference'
BASELINE = REFERENCE / 'baseline.json'
SHOTS = APP / 'qa' / 'port'
SHOT_TARGET = REFERENCE / 'shots'
VIEWPORTS = ('390', '834', '1440')
THEMES = ('light', 'dark')


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def entry_for(path: pathlib.Path) -> dict:
    text = main_text(path)
    sig = signature(path)
    if text is None or not sig:
        raise SystemExit(f'approve: {path} has no <main> — is the export complete?')
    return {
        'bytes': path.stat().st_size,
        'sha256': sha256(path.read_bytes()),
        'title': title_of(path),
        'text_length': len(text),
        'text_sha256': sha256(text.encode('utf-8')),
        'markup_elements': len(sig),
        'markup_sha256': sha256('\n'.join(sig).encode('utf-8')),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('file', help='page file name, e.g. contact.html')
    parser.add_argument('--note', required=True, help='why the baseline moves')
    parser.add_argument('--shots', action='store_true', help='also refresh this page’s screenshots')
    args = parser.parse_args()

    built = OUT / args.file
    frozen = REFERENCE / args.file
    if not built.exists():
        raise SystemExit(f'approve: {built} does not exist — run `npm run build` first')
    if not frozen.exists() or not BASELINE.exists():
        raise SystemExit('approve: no reference to move — run scripts/freeze-reference.py first')

    baseline = json.loads(BASELINE.read_text(encoding='utf-8'))
    index = next((i for i, page in enumerate(baseline['pages']) if page['file'] == args.file), None)
    if index is None:
        raise SystemExit(f'approve: {args.file} is not in baseline.json')

    before = baseline['pages'][index]
    after = entry_for(built)

    if before['text_sha256'] == after['text_sha256'] and before['markup_sha256'] == after['markup_sha256']:
        raise SystemExit('approve: the built page is identical to the baseline — nothing to approve')

    shutil.copyfile(built, frozen)
    baseline['pages'][index] = {'route': before['route'], 'file': before['file'], **after}
    baseline.setdefault('approvals', []).append({
        'date': datetime.date.today().isoformat(),
        'file': args.file,
        'route': before['route'],
        'note': args.note,
        'previous_sha256': before['sha256'],
        'approved_sha256': after['sha256'],
        'text': f"{before['text_length']} -> {after['text_length']} chars",
        'markup_elements': f"{before['markup_elements']} -> {after['markup_elements']}",
    })
    BASELINE.write_text(json.dumps(baseline, indent=2, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')

    print(f"approved {args.file}: {before['text_length']} -> {after['text_length']} chars, "
          f"{before['markup_elements']} -> {after['markup_elements']} elements")
    print(f"note: {args.note}")

    if args.shots:
        name = 'home' if args.file == 'index.html' else args.file.removesuffix('.html')
        copied = 0
        missing = []
        SHOT_TARGET.mkdir(exist_ok=True)
        for viewport in VIEWPORTS:
            for theme in THEMES:
                source = SHOTS / f'{name}@{viewport}-{theme}.png'
                if not source.exists():
                    missing.append(source.name)
                    continue
                shutil.copyfile(source, SHOT_TARGET / source.name)
                copied += 1
        print(f'shots: {copied} copied into qa/reference/shots'
              + (f', missing {missing}' if missing else ''))
        if missing:
            print('  run: npm run qa:capture -- --only ' + name)
            return 1

    return 0


if __name__ == '__main__':
    sys.exit(main())
