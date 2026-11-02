import pathlib, re
b = pathlib.Path('_build/build.py')
s = b.read_text(encoding='utf-8')

old_nav = s[s.index('NAV = ['):s.index(']\n\n', s.index('NAV = ['))+2]
new_nav = """NAV = [
    ('Capabilities', 'services.html', 'capabilities'),
    ('Approach', 'approach.html', 'approach'),
    ('Engagements', 'engagements.html', 'engagements'),
    ('Process', 'process.html', 'process'),
    ('Studio', 'about.html', 'studio'),
    ('Contact', 'contact.html', 'contact'),
]
"""
s = s.replace(old_nav, new_nav)

# footer studio column
s = s.replace("""        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="index.html#approach">Approach</a></li>
          <li><a href="index.html#engagements">Engagements</a></li>
          <li><a href="index.html#process">Process</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>""",
"""        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="approach.html">Approach</a></li>
          <li><a href="engagements.html">Engagements</a></li>
          <li><a href="process.html">Process</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>""")

# pages list
start = s.index('PAGES = [')
end = s.index('def build():')
new_pages = """PAGES = [
    dict(
        slug='', file='index.html', active='',
        title='Intactic — software engineering studio',
        desc='Intactic designs and builds custom platforms, multi-vendor commerce, ERP and product interfaces for companies that have outgrown off-the-shelf software.',
        frag='index.html', cta=True,
    ),
    dict(
        slug='services.html', file='services.html', active='capabilities',
        title='Capabilities — Intactic',
        desc='Custom software, multi-vendor commerce, ERP and operations, web platforms, mobile products, and automation with model-assisted workflows.',
        frag='services.html', cta=True,
    ),
    dict(
        slug='approach.html', file='approach.html', active='approach',
        title='Approach — Intactic',
        desc='How Intactic decides what to build: the system first, three layers of intelligence, five rules and the work we decline.',
        frag='approach.html', cta=True,
    ),
    dict(
        slug='engagements.html', file='engagements.html', active='engagements',
        title='Engagements — Intactic',
        desc='Three ways to work with Intactic: platform build, embedded team, and a fixed-scope assessment of a system that already runs.',
        frag='engagements.html', cta=True,
    ),
    dict(
        slug='process.html', file='process.html', active='process',
        title='Process — Intactic',
        desc='Four phases from first call to production, with a written output at the end of each and a fixed-scope discovery.',
        frag='process.html', cta=True,
    ),
    dict(
        slug='about.html', file='about.html', active='studio',
        title='Studio — Intactic',
        desc='A small software studio: four working principles, a named lead on every build, and boundaries we do not cross.',
        frag='about.html', cta=True,
    ),
    dict(
        slug='contact.html', file='contact.html', active='contact',
        title='Contact — Intactic',
        desc='Tell Intactic what you are building. A short brief is enough; you get a reply within two working days.',
        frag='contact.html', cta=False,
    ),
]

"""
s = s[:start] + new_pages + s[end:]
b.write_text(s, encoding='utf-8')
print('nav + pages updated')
