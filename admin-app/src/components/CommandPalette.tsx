'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './icons';

export interface PalettePage {
  param: string;
  route: string;
  title: string;
  kind: string;
}

interface Item {
  id: string;
  label: string;
  hint: string;
  href: string;
  group: 'Go to' | 'Pages';
}

const ACTIONS: Omit<Item, 'id'>[] = [
  { label: 'Dashboard', hint: 'Counts, attention, every page', href: '/', group: 'Go to' },
  { label: 'Pages', hint: 'Meta and sections, route by route', href: '/pages', group: 'Go to' },
  { label: 'Navigation', hint: 'The seven primary links', href: '/navigation', group: 'Go to' },
  { label: 'Footer', hint: 'Brand block and four columns', href: '/footer', group: 'Go to' },
  { label: 'Capabilities & products', hint: 'The ten templated pages', href: '/content', group: 'Go to' },
  { label: 'Changes', hint: 'Working tree and recent commits', href: '/changes', group: 'Go to' },
];

/**
 * ⌘K / Ctrl-K palette.
 *
 * It searches the six screens and all nineteen pages, opens with the keyboard,
 * and keeps the focus inside itself until it closes. The page list arrives from
 * the server layout, so opening it costs nothing and cannot disagree with the
 * sidebar.
 */
export function CommandPalette({
  pages,
  open,
  onClose,
}: {
  pages: PalettePage[];
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const items = useMemo<Item[]>(() => {
    const actions = ACTIONS.map((item) => ({ ...item, id: item.href }));
    const pageItems: Item[] = pages.map((page) => ({
      id: `/pages/${page.param}`,
      label: page.route === '/' ? 'Home' : page.route,
      hint: page.title,
      href: `/pages/${page.param}`,
      group: 'Pages',
    }));
    return [...actions, ...pageItems];
  }, [pages]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      `${item.label} ${item.hint} ${item.href}`.toLowerCase().includes(needle),
    );
  }, [items, query]);

  useEffect(() => {
    if (!open) return undefined;

    restoreTo.current = document.activeElement as HTMLElement | null;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focus = window.setTimeout(() => inputRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focus);
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
      restoreTo.current?.focus?.();
    };
  }, [open, onClose]);

  /** The highlighted row, clamped so filtering can never point past the end. */
  const activeIndex = Math.min(active, Math.max(0, filtered.length - 1));

  if (!open) return null;

  function go(item: Item) {
    onClose();
    router.push(item.href);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = filtered[activeIndex];
      if (item) go(item);
    } else if (event.key === 'Tab') {
      // Keep the dialog modal without a full trap library.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'input, button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  let lastGroup: string | null = null;

  return (
    <div className="cmdk" role="presentation" onKeyDown={onKeyDown}>
      <button type="button" className="cmdk__backdrop" aria-label="Close search" onClick={onClose} tabIndex={-1} />
      <div className="cmdk__panel" role="dialog" aria-modal="true" aria-label="Search the studio" ref={panelRef}>
        <div className="cmdk__field">
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            className="cmdk__input"
            value={query}
            placeholder="Search pages, screens, routes…"
            aria-label="Search pages and screens"
            onChange={(event) => setQuery(event.target.value)}
          />
          <kbd className="kbd">esc</kbd>
        </div>

        <div className="cmdk__list" role="listbox" aria-label="Results">
          {filtered.length === 0 ? (
            <p className="cmdk__empty">Nothing matches “{query}”.</p>
          ) : (
            filtered.map((item, index) => {
              const header = item.group !== lastGroup ? item.group : null;
              lastGroup = item.group;
              return (
                <div key={item.id}>
                  {header ? <p className="cmdk__group">{header}</p> : null}
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    className={`cmdk__item${index === activeIndex ? ' is-active' : ''}`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(item)}
                  >
                    <span className="cmdk__label">{item.label}</span>
                    <span className="cmdk__hint">{item.hint}</span>
                    <Icon name="chevron" size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="cmdk__foot">
          <span>
            <kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> to move
          </span>
          <span>
            <kbd className="kbd">↵</kbd> to open
          </span>
          <span style={{ marginLeft: 'auto' }}>{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
}
