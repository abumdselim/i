export default function Loading() {
  return (
    <div className="wrap">
      <div className="skeleton skeleton--eyebrow" />
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--line" />
      <div className="stats" style={{ marginTop: 28 }}>
        {[0, 1, 2, 3].map((index) => (
          <div className="stat" key={index}>
            <div className="skeleton skeleton--label" />
            <div className="skeleton skeleton--value" />
            <div className="skeleton skeleton--line" />
          </div>
        ))}
      </div>
      <div className="skeleton skeleton--block" />
    </div>
  );
}
