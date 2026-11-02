/**
 * The unsaved-changes guard, shared by every editor and the shell.
 *
 * A module store rather than context: the editors are scattered across routes
 * and the one component that needs to intercept navigation is the shell.
 */
let dirty = false;
let message = 'You have unsaved changes.';

const listeners = new Set<() => void>();

export function setDirty(value: boolean, text?: string) {
  dirty = value;
  if (text) message = text;
  for (const listener of listeners) listener();
}

export function isDirty() {
  return dirty;
}

export function dirtyMessage() {
  return message;
}

export function subscribeDirty(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** True when it is safe to leave; asks first when there is unsaved work. */
export function confirmLeave(): boolean {
  if (!dirty) return true;
  return window.confirm(`${message}\n\nLeave this page and lose the changes?`);
}
