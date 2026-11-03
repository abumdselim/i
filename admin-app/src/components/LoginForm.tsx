'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';

/**
 * The gate's one form. A wrong answer costs a fixed delay server-side and
 * says so; a right one mints the signed week-long cookie (lib/session.ts)
 * and the middleware lets every later request through.
 */
export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const requested = params.get('next');
  const target = requested && requested.startsWith('/') && !requested.startsWith('//') ? requested : '/';

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const body = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (response.ok && body?.ok) {
        router.replace(target);
        router.refresh();
        return;
      }
      setError(body?.message ?? 'Sign in failed — try again.');
    } catch {
      setError('Sign in failed — the studio is unreachable.');
    }
    setBusy(false);
  }

  return (
    <div className="login">
      <form className="login__card" onSubmit={onSubmit} noValidate>
        <p className="login__kicker">Intactic Studio</p>
        <h1 className="login__title">Sign in</h1>
        <p className="login__lead">
          The one gate to the site&rsquo;s editor. A save here becomes a commit on the site&rsquo;s repository.
        </p>
        <div className="field">
          <label className="field__label" htmlFor="password">
            Password
          </label>
          <input
            className="input"
            id="password"
            ref={inputRef}
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={error ? true : undefined}
            disabled={busy}
          />
        </div>
        {error ? (
          <p className="field__error" role="alert">
            {error}
          </p>
        ) : null}
        <button className="btn btn--primary login__submit" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
