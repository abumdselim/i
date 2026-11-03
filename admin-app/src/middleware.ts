import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifyToken } from '@/lib/session';

/**
 * The studio's only gate. Deployed (D-19) it sits in front of everything —
 * pages and API routes alike — because an editor that can commit to the site's
 * repository is exactly as sensitive as the repository. Locally, where the
 * secrets are absent and the panel binds to 127.0.0.1, the gate stands open
 * and the studio behaves exactly as it did before (D-15).
 *
 * The token is a signed timestamp (lib/session.ts): no session store, nothing
 * to revoke server-side beyond rotating the secret.
 */

const PUBLIC_PATHS = new Set(['/login', '/api/auth']);

export async function middleware(request: NextRequest) {
  const secret = process.env.STUDIO_SESSION_SECRET;
  if (!secret) {
    // Local mode: no secret configured, nothing to enforce.
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (await verifyToken(token, secret)) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ ok: false, message: 'Sign in to use the studio.' }, { status: 401 });
  }

  const login = new URL('/login', request.url);
  if (pathname !== '/') login.searchParams.set('next', pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
