import { NextResponse } from 'next/server';
import { StudioValidationError } from './rules';
import { StoreConflictError } from './store';

/**
 * One error translator for every studio API route. Validation failures are
 * field issues (400); a conflict means the repository moved under an open
 * editor (409); anything else is the studio's fault (500).
 */
export function apiError(error: unknown) {
  if (error instanceof StudioValidationError) {
    return NextResponse.json({ ok: false, issues: error.issues }, { status: 400 });
  }
  if (error instanceof StoreConflictError) {
    return NextResponse.json({ ok: false, conflict: true, message: error.message }, { status: 409 });
  }
  return NextResponse.json({ ok: false, message: (error as Error).message }, { status: 500 });
}
