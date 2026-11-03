/**
 * The storage contract behind every read and write the studio makes.
 *
 * Two implementations, chosen once per environment (mode.ts): FsStore for the
 * local checkout, GitHubStore for the deployed studio where the repository
 * itself is the database. Routes validate against `rules.ts` first and then
 * hand whole files to `commit` — the store never sees anything unvalidated.
 */

export type DataFile =
  | 'pages.json'
  | 'sections.json'
  | 'site-config.json'
  | 'capabilities.json'
  | 'products.json'
  | 'case-studies.json';

export interface CommitFile {
  file: DataFile;
  /** A JSON value; the store serialises and formats it. */
  value: unknown;
}

export interface CommitInfo {
  hash: string;
  subject: string;
  date: string;
}

export interface StoreCommit {
  /** Short hash; empty when the mode has no commits (FsStore). */
  hash: string;
  /** Link to inspect the commit; null when there is nothing to link. */
  url: string | null;
}

/** The ref moved between read and write — someone else saved first. */
export class StoreConflictError extends Error {
  constructor() {
    super('The repository moved while this editor was open — reload, re-apply and save again.');
    this.name = 'StoreConflictError';
  }
}

export interface ContentStore {
  readonly mode: 'local' | 'cloud';

  /** Raw JSON text of a data file, as the site's build would read it. */
  readJsonText(file: DataFile): Promise<string>;

  /**
   * Persist one or more whole data files. Local mode writes each file
   * atomically; cloud mode creates a single commit containing all of them,
   * so a save that spans two files (page meta + section arrangement) can
   * never land half-applied.
   */
  commit(files: CommitFile[], message: string): Promise<StoreCommit>;

  listCommits(limit: number): Promise<CommitInfo[]>;

  /** The text of `next-app/src/components/icons.ts`, for the icon picker. */
  readIconsSource(): Promise<string>;
}
