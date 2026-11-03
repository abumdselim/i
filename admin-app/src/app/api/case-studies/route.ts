import { NextResponse } from 'next/server';
import { validateCaseStudies } from '@/lib/rules';
import { apiError } from '@/lib/api';
import { readCaseStudies, writeCaseStudies } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The one data file behind the home page's case-study section.
 *
 * The whole collection travels as one document because the section is edited as
 * one screen: the head, the closing card and the ordered case list. Validation
 * runs before a byte is written, so a half-valid file never reaches the build.
 */
function fail(error: unknown) {
  return apiError(error);
}

export async function GET() {
  try {
    return NextResponse.json({ ok: true, data: await readCaseStudies() });
  } catch (error) {
    return fail(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { data?: unknown };
    const data = validateCaseStudies(body.data);
    const saved = await writeCaseStudies(data, 'studio: update case studies');
    return NextResponse.json({ ok: true, commit: saved });
  } catch (error) {
    return fail(error);
  }
}
