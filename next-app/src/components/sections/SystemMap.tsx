import { css } from '@/lib/css';

/**
 * The nine-cell system map. Four nodes, the core, four more — the same 3x3 grid
 * as the legacy `catpage.py` / `prodpage.py` templates, so the core always sits
 * at the centre of the picture it belongs to.
 */
export function SystemMap({ core, nodes, foot }: { core: string; nodes: string[]; foot: string }) {
  const order: (string | null)[] = [nodes[0], nodes[1], nodes[2], nodes[3], null, nodes[4], nodes[5], nodes[6], nodes[7]];

  let counter = 0;
  const cells = order.map((item, index) => {
    if (item === null) {
      return (
        <div className="map__cell map__cell--core" key={`core-${index}`}>
          <span className="mono">Core</span>
          <b>{core}</b>
        </div>
      );
    }
    counter += 1;
    return (
      <div className="map__cell" key={`${item}-${index}`}>
        <span className="mono">{String(counter).padStart(2, '0')}</span>
        <b>{item}</b>
      </div>
    );
  });

  return (
    <div className="map" data-reveal style={css({ '--d': '.08s' })}>
      <div className="plate__bar">
        <span>System map</span>
        <span>Fig.</span>
      </div>
      <div className="map__grid">{cells}</div>
      <div className="plate__foot">
        <span>{core} at the centre</span>
        <span>{foot}</span>
      </div>
    </div>
  );
}
