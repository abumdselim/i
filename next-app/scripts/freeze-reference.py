"""Freeze the legacy build into `qa/reference/` — step 0 of docs/Go.md.

The gate's job is to prove the port says and does the same thing as the site it
replaces. While that comparison points at the repository root, the baseline is
whatever `_build/` last wrote there: regenerating the legacy site, or editing a
root page, would move the target and the gate would keep saying "fine". This
script takes the snapshot once, records a digest for every page, and copies the
screenshots the visual diff compares against.

Run from next-app/:  python scripts/freeze-reference.py
                    python scripts/freeze-reference.py --refresh-shots

Re-running is safe: HTML is only written when the bytes differ. Screenshots are
only copied when missing — `--refresh-shots` is the explicit way to overwrite the
visual baseline, so a re-capture can never quietly move it.
"""
from __future__ import annotations

import json
import pathlib
import shutil
import subprocess
import sys
from datetime import date

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from parity import bytes_digest, main_text, signature, title_of  # noqa: E402

APP = pathlib.Path(__file__).resolve().parents[1]
ROOT = APP.parent
REFERENCE = APP / 'qa' / 'reference'
SHOTS = APP / 'qa' / 'legacy'


def read_manifest() -> dict:
    """Route data lives in data/pages.json; manifest.mjs hands it back as JSON."""
    result = subprocess.run(
        ['node', 'scripts/manifest.mjs', '--json'],
        cwd=APP, capture_output=True, text=True, encoding='utf-8',
    )
    if result.returncode != 0:
        sys.exit(f'freeze-reference: could not read the route manifest\n{result.stderr}')
    return json.loads(result.stdout)


MANIFEST = read_manifest()


def sha256(data: bytes) -> str:
    """Same normalisation the gate digests with — see parity.bytes_digest."""
    return bytes_digest(data)


def main() -> int:
    refresh_shots = '--refresh-shots' in sys.argv
    REFERENCE.mkdir(parents=True, exist_ok=True)

    pages = []
    copied = 0

    for page in MANIFEST['pages']:
        source = ROOT / page['file']
        target = REFERENCE / page['file']
        if not source.exists():
            # Pages added after the legacy build (case studies) have no root
            # counterpart. The frozen copy is then the only source of truth and
            # is kept as it is; the alternative — refusing to re-freeze — would
            # leave the whole baseline unrepairable.
            if target.exists():
                source = target
            else:
                print(f'  MISSING SOURCE  {page["file"]}')
                return 1

        data = source.read_bytes()
        if not target.exists() or target.read_bytes() != data:
            target.write_bytes(data)
            copied += 1
        if target.read_bytes() != data:
            print(f'  COPY MISMATCH  {page["file"]}')
            return 1

        text = main_text(target)
        sig = signature(target)
        if text is None or not sig:
            print(f'  NO <main> IN  {page["file"]}')
            return 1

        pages.append({
            'route': page['route'],
            'file': page['file'],
            'bytes': len(data),
            'sha256': sha256(data),
            'title': title_of(target),
            'text_length': len(text),
            'text_sha256': sha256(text.encode('utf-8')),
            'markup_elements': len(sig),
            'markup_sha256': sha256('\n'.join(sig).encode('utf-8')),
        })

    baseline = {
        'created': date.today().isoformat(),
        'source': 'repository root, as written by _build/build.py',
        'note': 'Digests are over the frozen copies; scripts/gate.py checks them before every run.',
        'pages': pages,
    }
    (REFERENCE / 'baseline.json').write_text(
        json.dumps(baseline, indent=2, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n'
    )

    shots = sorted(SHOTS.glob('*.png'))
    shot_target = REFERENCE / 'shots'
    if shots:
        shot_target.mkdir(exist_ok=True)
        added = 0
        for shot in shots:
            destination = shot_target / shot.name
            if refresh_shots or not destination.exists():
                shutil.copyfile(shot, destination)
                added += 1
        frozen_shots = sorted(shot_target.glob('*.png'))
        print(f'shots  : {len(frozen_shots)} frozen in qa/reference/shots ({added} written, {len(frozen_shots) - added} kept)')
        if len(frozen_shots) != len(shots):
            print(f'  ERR  {len(shots) - len(frozen_shots)} screenshots did not copy')
            return 1
    else:
        print('shots  : none in qa/legacy yet — skipped (visual diff has no baseline)')

    print(f'pages  : {len(pages)} frozen in qa/reference   ({copied} written, {len(pages) - copied} already current)')
    print(f'total  : {sum(p["bytes"] for p in pages):,} bytes')
    for page in pages:
        print(f'  {page["file"]:<24}{page["text_length"]:>6} chars  {page["markup_elements"]:>5} elements  {page["sha256"][:12]}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
