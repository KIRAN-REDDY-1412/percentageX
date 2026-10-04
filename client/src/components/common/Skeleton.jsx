export function Skeleton({ width = "100%", height = "20px", borderRadius = "8px", className = "" }) {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card-header">
        <Skeleton width="44px" height="44px" borderRadius="12px" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <Skeleton width="60%" height="16px" />
          <Skeleton width="40%" height="12px" />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
        <Skeleton width="100%" height="12px" />
        <Skeleton width="80%" height="12px" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 4, cols = 5 }) {
  return (
    <div className="skeleton-table-wrapper">
      <div className="skeleton-table-header">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width="70%" height="14px" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="skeleton-table-row">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} width={c === 0 ? "40%" : "65%"} height="13px" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
