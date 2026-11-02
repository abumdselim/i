/**
 * The figure layer's TypeScript face (admin phase 1, docs/admin.md §6).
 *
 * Geometry data lives in `data/figures.json`, validated by `loader.ts`; the
 * types live in `types.ts`. This module keeps the export surface the
 * components already import — `sections/Figure.tsx` and the home sections
 * read from here.
 */
export { FIGURES, INDUSTRIES, PLATE_LAYERS, STACK, figure } from './loader';
export type { FigureName } from './loader';
export type { FigureGeometry, FigurePath, FigureRect, Industry, PlateCell, PlateLayer, StackGroup } from './types';
