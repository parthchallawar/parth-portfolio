const NODES = [
  { x: 60, label: "order", sub: "table session" },
  { x: 205, label: "job queue", sub: "PostgreSQL" },
  { x: 355, label: "print bridge", sub: "Node.js" },
  { x: 500, label: "printer", sub: "KOT · bill" },
];

/** Order → queue → printer, with dashes travelling along the path and an auto-retry loop. */
export function PrintBridgeDiagram() {
  return (
    <svg
      viewBox="0 0 560 150"
      role="img"
      aria-label="Order flow: an order creates a job in a PostgreSQL queue, a Node.js print bridge takes it and prints the KOT or bill on a thermal printer, retrying automatically on failure."
      className="block h-auto w-full font-mono"
    >
      <defs>
        <marker id="pb-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" className="fill-accent" />
        </marker>
      </defs>
      {NODES.slice(0, -1).map((n, i) => {
        const next = NODES[i + 1];
        return (
          <g key={n.label}>
            <line x1={n.x + 52} y1="62" x2={next.x - 54} y2="62" className="stroke-line-strong" strokeWidth="1" />
            <line
              x1={n.x + 52}
              y1="62"
              x2={next.x - 54}
              y2="62"
              className="dash-flow stroke-accent"
              strokeWidth="1.4"
              markerEnd="url(#pb-arrow)"
            />
          </g>
        );
      })}
      {/* retry loop printer → bridge */}
      <path d="M492 88 C 480 128, 372 128, 360 90" fill="none" className="stroke-line-strong" strokeWidth="1" strokeDasharray="3 4" />
      <path d="M492 88 C 480 128, 372 128, 360 90" fill="none" className="dash-flow stroke-muted" strokeWidth="1" markerEnd="url(#pb-arrow)" />
      <text x="426" y="136" fontSize="10" textAnchor="middle" className="fill-muted">
        auto-retry
      </text>

      {NODES.map((n, i) => (
        <g key={n.label}>
          <rect
            x={n.x - 52}
            y="40"
            width="104"
            height="44"
            rx="10"
            className={i === 2 ? "fill-surface stroke-accent/60" : "fill-surface stroke-line-strong"}
            strokeWidth="1"
          />
          <text x={n.x} y="59" fontSize="11.5" textAnchor="middle" className="fill-fg font-sans">
            {n.label}
          </text>
          <text x={n.x} y="74" fontSize="9" textAnchor="middle" className="fill-muted">
            {n.sub}
          </text>
        </g>
      ))}
      <text x="20" y="18" fontSize="10" letterSpacing="0.8" className="fill-muted">
        KOT & BILL PRINTING
      </text>
      <text x="540" y="18" fontSize="10" letterSpacing="0.8" textAnchor="end" className="fill-accent">
        99% &lt; 2s
      </text>
    </svg>
  );
}
