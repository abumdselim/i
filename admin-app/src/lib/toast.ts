export type ToastKind = 'ok' | 'bad';

export interface ToastItem {
  id: number;
  kind: ToastKind;
  text: string;
}

/**
 * A module-level toast store: any client component can call `toast('ok', …)`
 * without threading a context through the editors. `Toaster` subscribes with
 * `useSyncExternalStore`.
 */
let items: ToastItem[] = [];
let nextId = 1;
const EMPTY: ToastItem[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function toast(kind: ToastKind, text: string) {
  const item = { id: nextId++, kind, text };
  items = [...items, item];
  emit();
  window.setTimeout(() => dismiss(item.id), kind === 'bad' ? 8000 : 4000);
}

export function dismiss(id: number) {
  items = items.filter((item) => item.id !== id);
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function snapshot() {
  return items;
}

export function serverSnapshot() {
  return EMPTY;
}
