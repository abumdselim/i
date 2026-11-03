'use client';

import type { ReactNode } from 'react';
import { Icon } from './icons';

/**
 * The field kit every editor is built from (admin phase 6, docs/admin.md §6.1).
 *
 * One text field, one textarea field, one repeatable string list, and the
 * move/remove control each row uses. They carry the studio's form rules in one
 * place: labels above inputs, a counter where a field has a limit, the error
 * message under the field that caused it, and buttons that say what they do to
 * a screen reader.
 *
 * The editors compose these; a new content type gets the same behaviour by
 * using the same components, not by re-implementing a form.
 */

export function Text({
  label,
  value,
  onChange,
  error,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
}) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        className="input"
        value={value}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className="field__error">{error}</span> : hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}

export function Area({
  label,
  value,
  onChange,
  error,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  rows?: number;
}) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <textarea
        className="textarea"
        rows={rows}
        value={value}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}

export function RowTools({
  index,
  total,
  onMove,
  onRemove,
  label,
}: {
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  label: string;
}) {
  return (
    <div className="row__actions">
      <button
        type="button"
        className="iconbtn iconbtn--bare"
        onClick={() => onMove(-1)}
        disabled={index === 0}
        aria-label={`Move ${label} up`}
      >
        <Icon name="up" size={15} />
      </button>
      <button
        type="button"
        className="iconbtn iconbtn--bare"
        onClick={() => onMove(1)}
        disabled={index === total - 1}
        aria-label={`Move ${label} down`}
      >
        <Icon name="down" size={15} />
      </button>
      <button type="button" className="iconbtn iconbtn--bare" onClick={onRemove} aria-label={`Remove ${label}`}>
        <Icon name="trash" size={15} />
      </button>
    </div>
  );
}

export function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function StringRows({
  label,
  values,
  onChange,
  addLabel,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  addLabel: string;
  placeholder?: string;
}): ReactNode {
  return (
    <div className="field">
      <span className="field__label">
        {label} <span className="field__count">{values.length}</span>
      </span>
      <div className="rows">
        {values.map((value, index) => (
          <div className="link-row link-row--single" key={index}>
            <input
              className="input"
              value={value}
              placeholder={placeholder}
              aria-label={`${label} ${index + 1}`}
              onChange={(event) => onChange(values.map((row, i) => (i === index ? event.target.value : row)))}
            />
            <RowTools
              index={index}
              total={values.length}
              label={`${label} ${index + 1}`}
              onMove={(direction) => onChange(moveItem(values, index, direction))}
              onRemove={() => onChange(values.filter((_, i) => i !== index))}
            />
          </div>
        ))}
      </div>
      <button type="button" className="btn btn--sm" onClick={() => onChange([...values, ''])}>
        <Icon name="plus" size={14} /> {addLabel}
      </button>
    </div>
  );
}
