/** Where the site lives for "view page" links. Client-safe: no fs, no server imports. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
