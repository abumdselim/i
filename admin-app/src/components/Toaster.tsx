'use client';

import { useSyncExternalStore } from 'react';
import { dismiss, serverSnapshot, snapshot, subscribe } from '@/lib/toast';
import { Icon } from './icons';

export function Toaster() {
  const toasts = useSyncExternalStore(subscribe, snapshot, serverSnapshot);

  if (toasts.length === 0) return null;

  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((item) => (
        <div className={`toast toast--${item.kind}`} key={item.id}>
          <Icon name={item.kind === 'ok' ? 'check' : 'alert'} size={16} />
          <span>{item.text}</span>
          <button type="button" className="toast__close" onClick={() => dismiss(item.id)} aria-label="Dismiss">
            <Icon name="close" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
