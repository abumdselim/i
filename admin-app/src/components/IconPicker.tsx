'use client';

import { useMemo, useRef, useState } from 'react';
import type { SpriteIcon } from '@/lib/types';

function Svg({ icon, size = 18 }: { icon: SpriteIcon; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}

/**
 * The icon picker: the site's own 68 symbols, previewed and filtered.
 *
 * The list is read from `next-app/src/components/icons.ts` by the server page,
 * so choosing a name that the sprite does not define is impossible — and the
 * build would reject it anyway.
 */
export function IconPicker({
  label,
  value,
  icons,
  onChange,
}: {
  label: string;
  value: string;
  icons: SpriteIcon[];
  onChange: (name: string) => void;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  const [query, setQuery] = useState('');
  const current = icons.find((icon) => icon.name === value);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return icons;
    return icons.filter((icon) => icon.name.includes(needle));
  }, [icons, query]);

  function choose(name: string) {
    onChange(name);
    if (details.current) details.current.open = false;
    setQuery('');
  }

  return (
    <div className="field">
      <span className="field__label">{label}</span>
      <details className="picker" ref={details}>
        <summary className="picker__summary">
          <span className="picker__mark">{current ? <Svg icon={current} /> : null}</span>
          <span className="mono">{value}</span>
          <span className="picker__hint">
            {icons.length} icons — change
          </span>
        </summary>
        <div className="picker__panel">
          <input
            className="input"
            type="search"
            placeholder="Filter by name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="picker__grid">
            {filtered.map((icon) => (
              <button
                type="button"
                key={icon.name}
                className={`picker__cell${icon.name === value ? ' is-active' : ''}`}
                title={icon.name}
                aria-label={icon.name}
                aria-pressed={icon.name === value}
                onClick={() => choose(icon.name)}
              >
                <Svg icon={icon} size={20} />
              </button>
            ))}
          </div>
          {filtered.length === 0 ? <p className="empty">No icon matches “{query}”.</p> : null}
        </div>
      </details>
    </div>
  );
}

/** The same list, as a native select — for repeated rows where a grid is noise. */
export function IconSelect({
  value,
  icons,
  onChange,
  label,
}: {
  value: string;
  icons: SpriteIcon[];
  onChange: (name: string) => void;
  label: string;
}) {
  const current = icons.find((icon) => icon.name === value);
  return (
    <span className="icon-select">
      <span className="picker__mark picker__mark--sm">{current ? <Svg icon={current} size={16} /> : null}</span>
      <select className="select" value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        {icons.map((icon) => (
          <option value={icon.name} key={icon.name}>
            {icon.name}
          </option>
        ))}
      </select>
    </span>
  );
}
