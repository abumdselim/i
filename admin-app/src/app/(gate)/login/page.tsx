import type { Metadata } from 'next';
import { LoginForm } from '@/components/LoginForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign in — Intactic Studio',
  robots: { index: false, follow: false },
};

/** The studio's one public screen (D-22). It renders nothing but the form. */
export default function LoginPage() {
  return <LoginForm />;
}
