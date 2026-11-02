'use client';

import { useEffect, useRef } from 'react';

/**
 * The legacy footer printed the year from the client (app.js, `[data-year]`).
 * A static export bakes the build year into the HTML, so the span carries the
 * build year and is corrected in the browser — same behaviour, no mismatch.
 */
export function Year() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.textContent = String(new Date().getFullYear());
  }, []);

  return (
    <span ref={ref} data-year="" suppressHydrationWarning>
      {new Date().getFullYear()}
    </span>
  );
}
