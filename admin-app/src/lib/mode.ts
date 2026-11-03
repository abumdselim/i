/**
 * Where the studio's reads and writes go.
 *
 * `local` — the original mode: this process owns a checkout of the repository
 * and writes the sibling `next-app/data` folder directly. The default.
 *
 * `cloud` — the deployed mode (D-19): there is no filesystem, so the repository
 * itself is the store. Saves become commits through the GitHub API and the
 * site is rebuilt and deployed by CI. Set by providing GITHUB_TOKEN.
 */
export const CLOUD = typeof process !== 'undefined' && !!process.env.GITHUB_TOKEN;

export type StudioMode = 'local' | 'cloud';

export const MODE: StudioMode = CLOUD ? 'cloud' : 'local';

/** Where a save goes, for the UI. In cloud mode every save is a commit. */
export const SAVE_TARGET = CLOUD ? 'a commit on main' : 'next-app/data';
