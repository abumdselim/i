'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { NAV, navKeyFor } from '@/lib/pages';
import { Icon } from './Icon';

const THEME_KEY = 'intactic-theme';
type Theme = 'light' | 'dark';

/**
 * The theme lives in the DOM (`<html data-theme>`), set by the inline bootstrap
 * before the first paint so there is no flash. Reading it as an external store is
 * what keeps the toggle honest without a state-setting effect: the server snapshot
 * is 'light', and after hydration the real value takes over without a mismatch.
 */
function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function themeFromDom(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/**
 * Header + full-screen menu.
 *
 * Three things here are load-bearing and easy to lose in a port:
 *   - `aria-current` comes from the manifest's `active` column, not from a
 *     prefix match: ten of the nineteen routes are siblings with no shared
 *     prefix, so startsWith would highlight nothing.
 *   - the scroll lock is restored by the effect cleanup, and the menu closes on
 *     `pathname`: the layout never unmounts, so a stale "open" would leave <body>
 *     locked at overflow:hidden on the next page. That is derived from the route
 *     rather than reset in an effect (see `open`).
 *   - focus leaves the panel before it becomes aria-hidden, so Chrome does not
 *     block the attribute ("Blocked aria-hidden on an element because its
 *     descendant retained focus").
 */
export function SiteHeader() {
  const pathname = usePathname() || '/';
  const current = navKeyFor(pathname);

  const theme = useSyncExternalStore(subscribeTheme, themeFromDom, () => 'light' as Theme);
  /**
   * The menu belongs to the route it was opened on. Keeping the pathname instead
   * of a boolean closes it on navigation without an effect: `open` is false the
   * moment the route changes, before the next paint.
   */
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;

  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        restoreFocus.current = true;
        setOpenedAt(null);
      }
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
    if (open || !restoreFocus.current) return;
    restoreFocus.current = false;
    const button = burgerRef.current;
    if (button && document.contains(button) && button.offsetParent !== null) button.focus();
  }, [open]);

  function close({ restore }: { restore: boolean }) {
    const active = document.activeElement as HTMLElement | null;
    if (active && menuRef.current?.contains(active)) active.blur();
    restoreFocus.current = restore;
    setOpenedAt(null);
  }

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* private mode: the theme still applies for this page */
    }
  }

  return (
    <>
      <header className="head">
        <div className="shell head__in">
          <Link className="brand" href="/" aria-label="Intactic — home">
            {/* Both logos stay mounted; data-theme swaps them in CSS.
                next/image would wrap them in a span and disturb the flex row. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo--blue" src="/assets/img/logo-blue-500.png" alt="Intactic" width={125} height={19} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo--white" src="/assets/img/logo-white-500.png" alt="" width={125} height={19} />
          </Link>

          <nav className="nav" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                className="nav__link"
                href={item.href}
                aria-current={current === item.key ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="head__actions">
            <button
              className="iconbtn theme-btn"
              type="button"
              data-theme-toggle=""
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'dark'}
            >
              <Icon name="i-moon" className="icon icon-moon" />
              <Icon name="i-sun" className="icon icon-sun" />
            </button>

            <Link className="btn btn--primary" href="/contact">
              Start a project
              <Icon name="i-arrow" />
            </Link>

            <button
              ref={burgerRef}
              className="iconbtn burger"
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label="Open menu"
              onClick={() => setOpenedAt(pathname)}
            >
              <Icon name="i-menu" />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        className="menu"
        id="site-menu"
        data-menu="true"
        data-open={open ? 'true' : 'false'}
        aria-hidden={open ? undefined : true}
      >
        <div className="menu__top">
          <Link className="brand" href="/" aria-label="Intactic — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo--blue" src="/assets/img/logo-blue-500.png" alt="Intactic" width={125} height={19} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo--white" src="/assets/img/logo-white-500.png" alt="" width={125} height={19} />
          </Link>
          <button
            className="iconbtn"
            type="button"
            aria-label="Close menu"
            onClick={() => close({ restore: true })}
          >
            <Icon name="i-close" />
          </button>
        </div>

        <nav aria-label="Mobile">
          <ul className="menu__list">
            {NAV.map((item, index) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  ref={index === 0 ? firstLinkRef : undefined}
                  onClick={() => close({ restore: false })}
                >
                  <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu__foot">
          <Link className="btn btn--primary" href="/contact" onClick={() => close({ restore: false })}>
            Start a project
            <Icon name="i-arrow" />
          </Link>
          <a className="mono" href="mailto:hello@intactic.net">
            hello@intactic.net
          </a>
        </div>
      </div>
    </>
  );
}
