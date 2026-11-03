import { CLOUD } from './mode';
import { githubStore } from './github-store';

/**
 * Read-only view of the repository the studio edits: what is uncommitted, and
 * what the last commits were. No `git add`, no `git commit`, no checkout.
 *
 * In cloud mode (D-19) there is no working tree at all — every save is a
 * commit — so `workingTree` reports clean and history comes from the GitHub
 * API. In local mode the real `git` binary answers, as before; that code
 * lives in local-git.ts behind a dynamic import so the deployed worker never
 * bundles `node:child_process`.
 */

export interface ChangedFile {
  code: string;
  path: string;
  label: string;
  href: string | null;
}

export interface Commit {
  hash: string;
  subject: string;
  date: string;
}

export interface CommitLog {
  commits: Commit[];
  error: string | null;
}

export async function workingTree(): Promise<{ files: ChangedFile[]; error: string | null }> {
  if (CLOUD) return { files: [], error: null };
  const { workingTree } = await import('./local-git');
  return workingTree();
}

export async function recentCommits(limit = 6): Promise<CommitLog> {
  try {
    if (CLOUD) {
      const commits = await githubStore.listCommits(limit);
      return { commits, error: null };
    }
    const { recentCommits } = await import('./local-git');
    return await recentCommits(limit);
  } catch (error) {
    return { commits: [], error: (error as Error).message };
  }
}
