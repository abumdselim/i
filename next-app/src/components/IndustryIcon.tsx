import type { CSSProperties } from 'react';

/**
 * The five sector marks.
 *
 * Drawn for this section rather than borrowed from the sprite: each is a single
 * silhouette in the same square-module language as the plate and the capability
 * figures, at a stroke weight that survives a 26px render. They are deliberately
 * literal — a shopfront, a capsule, a balance, a parcel, a filing cabinet —
 * because a sector card has to be recognised before it is read.
 */
export type IndustryMark = 'store' | 'capsule' | 'balance' | 'parcel' | 'archive';

const PATHS: Record<IndustryMark, React.ReactNode> = {
  store: (
    <>
      <path d="M4 12h24" />
      <path d="M6 12 8.5 6h15L26 12" />
      <path d="M7 12v14h18V12" />
      <path d="M13 26v-7h6v7" />
    </>
  ),
  capsule: (
    <>
      <g transform="rotate(45 16 16)">
        <rect x="10" y="4.5" width="12" height="23" rx="6" />
        <path d="M10 16h12" />
      </g>
    </>
  ),
  balance: (
    <>
      <path d="M16 6v20" />
      <path d="M8 26h16" />
      <path d="M6 11h20" />
      <path d="M6 11l-3 6h6z" />
      <path d="M26 11l-3 6h6z" />
    </>
  ),
  parcel: (
    <>
      <path d="M16 5 27 11v10l-11 6-11-6V11z" />
      <path d="M5 11l11 6 11-6" />
      <path d="M16 17v10" />
      <path d="M11 8l11 6" />
    </>
  ),
  archive: (
    <>
      <rect x="6" y="5" width="20" height="22" />
      <path d="M6 12h20" />
      <path d="M6 19h20" />
      <path d="M14 8.5h4" />
      <path d="M14 15.5h4" />
      <path d="M14 22.5h4" />
    </>
  ),
};

export function IndustryIcon({ name, style }: { name: IndustryMark; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      style={style}
    >
      {PATHS[name]}
    </svg>
  );
}
