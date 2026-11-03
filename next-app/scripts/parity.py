"""Parity primitives — the single definition of "the same page".

The gate compares the export in `out/` against the frozen legacy snapshot in
`qa/reference/`. The freezer recorded that snapshot's digests with the same
normalisation. If the two disagreed about what counts as equal text, the
baseline would certify nothing, so both import this module instead of carrying
a copy.
"""
from __future__ import annotations

import hashlib
import html
import pathlib
import re
import unicodedata

from lxml import html as LH


def words(text: str) -> str:
    """Visible text, normalised just enough to survive JSX/HTML differences."""
    text = html.unescape(html.unescape(text))
    text = unicodedata.normalize('NFKC', text)
    text = text.replace('\u2019', "'").replace('\u2018', "'")
    text = text.replace('\u2013', '-').replace('\u2014', '-').replace('\u00a0', ' ')
    return re.sub(r'\s+', ' ', text).strip()


def main_text(path: pathlib.Path) -> str | None:
    try:
        doc = LH.fromstring(path.read_text(encoding='utf-8'))
    except Exception:
        return None
    main = doc.xpath('//main[@id="main"]')
    if not main:
        return None
    return words(' '.join(main[0].itertext()))


def title_of(path: pathlib.Path) -> str:
    doc = LH.fromstring(path.read_text(encoding='utf-8'))
    titles = doc.xpath('//title/text()')
    return words(titles[0]) if titles else ''


def signature(path: pathlib.Path) -> list[str]:
    """Every element under <main>, as `tag.class…` in document order.

    Text parity catches lost copy; this catches a lost wrapper, a renamed class or
    a section that was reordered. Together they make a markup refactor provable
    rather than hopeful.
    """
    doc = LH.fromstring(path.read_text(encoding='utf-8'))
    main = doc.xpath('//main[@id="main"]')
    if not main:
        return []
    sig = []
    for el in main[0].iter():
        if not isinstance(el.tag, str):
            continue
        cls = ' '.join((el.get('class') or '').split())
        sig.append(f'{el.tag}.{cls}' if cls else el.tag)
    return sig


def digest(value: str) -> str:
    return hashlib.sha256(value.encode('utf-8')).hexdigest()


def bytes_digest(data: bytes) -> str:
    """Digest of a file's bytes with CRLF normalised to LF.

    The frozen reference is committed with the CRLF the legacy builder wrote,
    but a Linux CI checkout materialises it as LF. Hashing raw bytes would
    make baseline.json certify one platform's checkout instead of the file,
    so both the freezer and the gate digest the normalised stream.
    """
    return hashlib.sha256(data.replace(b'\r\n', b'\n')).hexdigest()


def file_digest(path: pathlib.Path) -> str:
    return bytes_digest(path.read_bytes())
