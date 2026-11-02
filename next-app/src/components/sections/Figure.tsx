import { PLATE_LAYERS, figure, type FigureName } from '@/lib/content/figures';
import { css } from '@/lib/css';

/**
 * One module-lattice figure. The geometry is data in `content/figures.ts`,
 * transcribed from the exact strings `_build/build.py` produced — so the drawing
 * stays identical while the coordinates live in data instead of five hundred
 * lines of JSX.
 */
export function Figure({ name }: { name: FigureName }) {
  const geometry = figure(name);
  return (
    <svg className="fig" viewBox={geometry.viewBox} aria-hidden="true">
      {geometry.rects.map((rect, index) => (
        <rect className={rect.cls} x={rect.x} y={rect.y} width={rect.w} height={rect.h} key={index} />
      ))}
      {geometry.paths.map((path, index) => (
        <path className={path.cls} d={path.d} key={index} />
      ))}
    </svg>
  );
}

/**
 * The hero plate: three layers of fourteen cells, one cell lit per layer, drawn
 * from the same `LAYERS` table the legacy generator used.
 */
export function Plate() {
  return (
    <div className="plate__body plate__body--stack">
      {PLATE_LAYERS.map((layer) => (
        <div className="layer" key={layer.name}>
          <div className="layer__head">
            <span className="layer__name">{layer.name}</span>
            <span className="layer__meta">{layer.meta}</span>
          </div>
          <div className="layer__cells" aria-hidden="true">
            {layer.cells.map((cell) => (
              <i className={cell.cls} style={css({ '--i': String(cell.index) })} key={cell.index} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
