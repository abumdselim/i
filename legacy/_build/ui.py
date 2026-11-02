"""Shared markup helpers.

One icon template, one sprite, no inline variant per page. The build expands
``{{I:name}}`` in every page body, so fragments stay readable.
"""

ICON = '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-%s"></use></svg>'


def icon(name):
    if name.startswith('i-'):
        name = name[2:]
    return ICON % name


def tile(name, size=''):
    """A hairline square holding one icon — the page and card mark."""
    cls = 'tile' + (' tile--' + size if size else '')
    return '<span class="%s">%s</span>' % (cls, icon(name))


# Keys used by the capability and product page heads.
META_ICON = {
    'Domain': 'globe',
    'Status': 'pulse',
    'Platforms': 'mobile',
    'Typical engagement': 'card',
    'Team': 'users',
    'First phase': 'calendar',
    'First release': 'calendar',
}


def meta_icon(key):
    return icon(META_ICON.get(key, 'flag'))


def meta_rail(items, cls='page-head__meta'):
    """Icon + mono label + value, on a hairline grid."""
    cells = []
    for key, value in items:
        cells.append(
            '<div>%s<span class="meta-txt"><span class="mono">%s</span>'
            '<span class="meta-val">%s</span></span></div>' % (meta_icon(key), key, value)
        )
    return '<div class="%s">%s</div>' % (cls, ''.join(cells))
