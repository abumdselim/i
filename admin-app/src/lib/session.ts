/**
 * The studio's one-login session, shared by the login route and middleware.
 *
 * A signed timestamp, nothing more: the cookie carries `<expiry>.<hmac>` where
 * the HMAC is over a fixed context plus the expiry, so a token minted for one
 * expiry cannot be re-signed for another, and there is no session store to
 * keep in sync. Web Crypto only — the same code runs in the Node runtime
 * (login route) and the Edge runtime (middleware).
 */

export const SESSION_COOKIE = 'studio_session';
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // one week, seconds

const encoder = new TextEncoder();

function hex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function key(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

/** Seconds since the epoch, when the token stops being valid. */
function expiryOf(maxAgeSeconds: number): number {
  return Math.floor(Date.now() / 1000) + maxAgeSeconds;
}

export async function mintToken(secret: string, maxAgeSeconds = SESSION_MAX_AGE): Promise<string> {
  const exp = expiryOf(maxAgeSeconds);
  const signature = await crypto.subtle.sign('HMAC', await key(secret), encoder.encode(`studio:${exp}`));
  return `${exp}.${hex(signature)}`;
}

/** Timing-safe string compare for equal-length hex strings. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const [exp, signature] = token.split('.');
  if (!exp || !signature) return false;
  const expiry = Number(exp);
  if (!Number.isFinite(expiry) || expiry * 1000 < Date.now()) return false;

  const expected = await crypto.subtle.sign('HMAC', await key(secret), encoder.encode(`studio:${exp}`));
  return constantTimeEqual(signature, hex(expected));
}

/** Timing-safe compare of two hex digests (e.g. password hashes). */
export function digestsEqual(a: string, b: string): boolean {
  return constantTimeEqual(a, b);
}

export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(text));
  return hex(digest);
}
