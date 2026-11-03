import caseStudiesJson from '../../../data/case-studies.json';
import capabilitiesJson from '../../../data/capabilities.json';
import figuresJson from '../../../data/figures.json';
import pagesJson from '../../../data/pages.json';
import productsJson from '../../../data/products.json';
import { validateCapabilities, validateCaseStudies, validateFigures, validatePages, validateProducts } from './schema';
import type { FigureGeometry, Industry, PlateLayer, StackGroup } from './types';

/**
 * The content layer's front door (admin phase 1, docs/admin.md §6).
 *
 * The source of every value below is `data/*.json` — machine-writable, which is
 * what the admin studio needs. This module imports the JSON, validates it
 * against the runtime schema (schema.ts), and exports exactly the names the
 * typed literals used to export, so no consumer import moved. Validation runs
 * once, at import time: a broken file fails the build with the JSON path in
 * the message.
 *
 * Editing content means changing `data/*.json` — or letting the studio write
 * it, which passes the same schema first. Never edit a compiled artefact.
 */

export const CAPABILITIES = validateCapabilities(capabilitiesJson);
export const PRODUCTS = validateProducts(productsJson);
export const PAGES = validatePages(pagesJson);
export const CASE_STUDIES = validateCaseStudies(caseStudiesJson);

const FIGURES_DATA = validateFigures(figuresJson);

/** The figure names the JSON defines — static, so call sites stay checked. */
export type FigureName = keyof typeof figuresJson.figures;

export const FIGURES: Record<FigureName, FigureGeometry> = FIGURES_DATA.figures;
export const PLATE_LAYERS: PlateLayer[] = FIGURES_DATA.plateLayers;
export const INDUSTRIES: Industry[] = FIGURES_DATA.industries;
export const STACK: StackGroup[] = FIGURES_DATA.stack;

export function figure(name: FigureName): FigureGeometry {
  const geometry = FIGURES[name];
  if (!geometry) throw new Error(`figures: no figure "${name}"`);
  return geometry;
}
