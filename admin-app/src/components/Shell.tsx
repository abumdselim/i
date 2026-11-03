'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { confirmLeave, isDirty } from '@/lib/dirty';
import { SITE_URL } from '@/lib/urls';
import { CommandPalette, type PalettePage } from './CommandPalette';
import { Icon, type IconName } from './icons';

type Theme = 'light' | 'dark';

const THEME_KEY = 'intactic-studio-theme';

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function themeFromDom(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

interface Link {
  href: string;
  label: string;
  icon: IconName;
  num: string;
}

const GROUPS: { label: string; links: Link[] }[] = [
  {
    label: 'Overview',
    links: [
      { href: '/', label: 'Dashboard', icon: 'dashboard', num: '01' },
      { href: '/changes', label: 'Changes', icon: 'changes', num: '02' },
    ],
  },
  {
    label: 'Site',
    links: [
      { href: '/pages', label: 'Pages', icon: 'pages', num: '03' },
      { href: '/navigation', label: 'Navigation', icon: 'nav', num: '04' },
      { href: '/footer', label: 'Footer', icon: 'footer', num: '05' },
    ],
  },
  {
    label: 'Content',
    links: [
      { href: '/content', label: 'Capabilities & products', icon: 'content', num: '06' },
      { href: '/content/case-studies', label: 'Case studies', icon: 'content', num: '07' },
    ],
  },
];

const CRUMB_NAMES: Record<string, string> = {
  pages: 'Pages',
  navigation: 'Navigation',
  footer: 'Footer',
  content: 'Content',
  'case-studies': 'Case studies',
  changes: 'Changes',
};

function crumbsFor(pathname: string): { label: string; href?: string }[] {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return [{ label: 'Dashboard' }];

  const crumbs: { label: string; href?: string }[] = [];
  let path = '';
  parts.forEach((part, index) => {
    path += `/${part}`;
    let label = CRUMB_NAMES[part] ?? part;
    if (index === 1) {
      if (parts[0] === 'pages') label = part;
      if (parts[0] === 'content') {
        label = part === 'capability' ? 'Capabilities' : part === 'product' ? 'Products' : 'Case studies';
      }
    }
    if (index === 2 && parts[0] === 'content') label = part;
    crumbs.push({ label, href: index === parts.length - 1 ? undefined : path });
  });
  return crumbs;
}

function isCurrent(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Shell({ pages, children }: { pages: PalettePage[]; children: ReactNode }) {
  const pathname = usePathname() || '/';
  const crumbs = crumbsFor(pathname);
  const theme = useSyncExternalStore(subscribeTheme, themeFromDom, () => 'light' as Theme);

  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  /** The drawer belongs to the route it was opened on; navigation closes it. */
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenedAt(null);
    };
    const onResize = () => {
      if (window.innerWidth > 1080) setOpenedAt(null);
    };

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty()) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* private mode: the theme still applies for this session */
    }
  }

  return (
    <div className="app">
      <aside className="side" id="studio-nav" data-open={open ? 'true' : 'false'}>
        <div className="side__brand">
          <Link href="/" aria-label="Intactic Studio — dashboard">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo--blue" src="/logo-blue-500.png" alt="Intactic" width={104} height={16} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo--white" src="/logo-white-500.png" alt="" width={104} height={16} />
          </Link>
          <span className="side__tag">Studio</span>
          <button
            type="button"
            className="iconbtn side__close"
            aria-label="Close menu"
            onClick={() => setOpenedAt(null)}
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <nav className="side__nav" aria-label="Studio sections">
          {GROUPS.map((group) => (
            <div key={group.label}>
              <p className="side__label">{group.label}</p>
              <div style={{ display: 'grid', gap: 2 }}>
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    className="side__link"
                    href={link.href}
                    aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
                    onClick={(event) => {
                      if (!confirmLeave()) event.preventDefault();
                      else setOpenedAt(null);
                    }}
                  >
                    <Icon name={link.icon} className="ico" />
                    <span>{link.label}</span>
                    <span className="num" style={{ marginLeft: 'auto' }}>
                      {link.num}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="side__foot">
          <p className="side__meta">
            <span className="dot dot--ok" /> Local · 127.0.0.1:3001
          </p>
          <a className="side__meta" href={SITE_URL} target="_blank" rel="noreferrer">
            Open the site <Icon name="external" size={13} />
          </a>
        </div>
      </aside>

      <button
        type="button"
        className="scrim"
        data-open={open ? 'true' : 'false'}
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={() => setOpenedAt(null)}
      />

      <div className="main">
        <header className="top">
          <button
            type="button"
            className="iconbtn burger"
            aria-expanded={open}
            aria-controls="studio-nav"
            aria-label="Open menu"
            onClick={() => setOpenedAt(pathname)}
          >
            <Icon name="menu" />
          </button>

          <div className="top__crumb">
            {crumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} style={{ display: 'contents' }}>
                {index > 0 ? <span className="crumb-sep">/</span> : null}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    onClick={(event) => {
                      if (!confirmLeave()) event.preventDefault();
                    }}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <b>{crumb.label}</b>
                )}
              </span>
            ))}
          </div>

          <div className="top__actions">
            <button
              type="button"
              className="searchbtn"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search the studio (Control K)"
            >
              <Icon name="search" size={15} />
              <span className="searchbtn__label">Search</span>
              <kbd className="kbd searchbtn__kbd">Ctrl K</kbd>
            </button>
            <a
              className="btn btn--sm top__site"
              href={SITE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="View the site"
            >
              <span className="hide-sm">View site</span> <Icon name="external" size={14} />
            </a>
            <button
              type="button"
              className="iconbtn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'dark'}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            </button>
          </div>
        </header>

        <div id="main">{children}</div>
      </div>

      <CommandPalette key={paletteOpen ? 'open' : 'closed'} pages={pages} open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
