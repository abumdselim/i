import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, SESSION_MAX_AGE, digestsEqual, mintToken, sha256Hex } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth — the gate's one door (D-22). The presented password is
 * hashed and compared timing-safely against STUDIO_PASSWORD_SHA256; the
 * plaintext is never stored anywhere. On a match the signed cookie is set
 * and the middleware (`src/middleware.ts`) stops asking.
 *
 * Listed in middleware's PUBLIC_PATHS, so this route is reachable while
 * every other API route is not.
 */
export async function POST(request: NextRequest) {
  const hash = process.env.STUDIO_PASSWORD_SHA256;
  const secret = process.env.STUDIO_SESSION_SECRET;
  if (!hash || !secret) {
    return NextResponse.json(
      { ok: false, message: 'The gate is not configured — set STUDIO_PASSWORD_SHA256 and STUDIO_SESSION_SECRET.' },
      { status: 503 },
    );
  }

  let password = '';
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password === 'string') password = body.password;
  } catch {
    // A body that is not JSON is simply a wrong answer.
  }

  const presented = await sha256Hex(password);
  if (!digestsEqual(presented, hash.trim().toLowerCase())) {
    // A fixed pause so guessing costs the same wall-clock as signing in.
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json({ ok: false, message: 'That password does not match.' }, { status: 401 });
  }

  const token = await mintToken(secret);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
