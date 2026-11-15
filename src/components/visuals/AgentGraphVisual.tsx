import { VisualStage } from "./VisualStage";
import { Along, Anim, EASE_IN_OUT, LINEAR, Show } from "./smil";

const D = 12;
const PATH = "M30 70 H340 V170 H223 V250 H207 V170 H30";
const L = 880;
const P = {
  router: 70 / L,
  mediation: 180 / L,
  human: 310 / L,
  evidence: 410 / L,
  judge: 527 / L,
  cojudge: 615 / L,
  judge2: 703 / L,
  bias: 815 / L,
};

// [time, point] — moves alternate with dwells at nodes.
const KEYS: [number, number][] = [
  [0, 0],
  [0.03, 0],
  [0.08, P.router],
  [0.11, P.router],
  [0.16, P.mediation],
  [0.19, P.mediation],
  [0.24, P.human],
  [0.46, P.human],
  [0.52, P.evidence],
  [0.56, P.evidence],
  [0.61, P.judge],
  [0.64, P.judge],
  [0.68, P.cojudge],
  [0.71, P.cojudge],
  [0.75, P.judge2],
  [0.77, P.judge2],
  [0.83, P.bias],
  [0.86, P.bias],
  [0.91, 1],
  [1, 1],
];
const EASES = KEYS.slice(1).map((_, i) => (i % 2 === 0 ? LINEAR : EASE_IN_OUT));

type Node = { id: string; label: string; x: number; y: number; w: number; windows: [number, number][] };

const NODES: Node[] = [
  { id: "router", label: "router", x: 100, y: 70, w: 76, windows: [[0.08, 0.11]] },
  { id: "mediation", label: "mediation", x: 210, y: 70, w: 76, windows: [[0.16, 0.19]] },
  { id: "evidence", label: "evidence check", x: 340, y: 170, w: 88, windows: [[0.52, 0.56]] },
  { id: "judge", label: "judge", x: 215, y: 170, w: 72, windows: [[0.61, 0.64], [0.75, 0.77]] },
  { id: "cojudge", label: "co-judge", x: 215, y: 250, w: 72, windows: [[0.68, 0.71]] },
  { id: "bias", label: "bias audit", x: 95, y: 170, w: 76, windows: [[0.83, 0.86]] },
];

function activeAnim(windows: [number, number][]) {
  const values: number[] = [0];
  const times: number[] = [0];
  for (const [a, b] of windows) {
    values.push(0, 1, 1, 0);
    times.push(a - 0.008, a, b, b + 0.02);
  }
  values.push(0);
  times.push(1);
  return <Anim values={values} times={times} dur={D} />;
}

const STATUS: { text: string; a: number; b: number; accent?: boolean }[] = [
  { text: "⏸ interrupt → checkpoint saved", a: 0.24, b: 0.305 },
  { text: "↻ server restart · state persisted", a: 0.31, b: 0.375 },
  { text: "▸ mediator replied · resume from checkpoint", a: 0.38, b: 0.46 },
  { text: "▸ corrective RAG over evidence · cited", a: 0.47, b: 0.585 },
  { text: "▸ judge ⇄ co-judge review", a: 0.59, b: 0.8 },
  { text: "▸ bias audit", a: 0.81, b: 0.89 },
  { text: "✓ decision issued with citations", a: 0.9, b: 0.965, accent: true },
];

/**
 * Legal AI Judge — the LangGraph node graph with a token moving through it. It pauses at the
 * human node (checkpoint saved, survives a restart), then continues through evidence check,
 * the judge / co-judge loop and the bias audit.
 */
export function AgentGraphVisual({ className }: { className?: string }) {
  return (
    <VisualStage
      viewBox="0 0 480 300"
      freezeAt={D * 0.36}
      className={className}
      label="A LangGraph agent graph: router, mediation, a human-in-the-loop pause saved as a checkpoint that survives a server restart, evidence check, a judge and co-judge review loop, and a bias audit before the decision."
    >
      <defs>
        <marker id="ag-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" className="fill-line-strong" />
        </marker>
      </defs>

      <text x="20" y="26" fontSize="10" letterSpacing="0.8" className="fill-muted">
        AGENT GRAPH
      </text>
      <text x="460" y="26" fontSize="10" letterSpacing="0.8" textAnchor="end" className="fill-muted">
        HITL · CHECKPOINTED
      </text>

      {/* graph — dims during the simulated restart */}
      <g>
        <Anim values={[1, 1, 0.22, 0.22, 1, 1]} times={[0, 0.31, 0.322, 0.355, 0.37, 1]} dur={D} />

        {/* edges */}
        <g className="stroke-line-strong" strokeWidth="1" fill="none">
          <line x1="38" y1="70" x2="61" y2="70" markerEnd="url(#ag-arrow)" />
          <line x1="138" y1="70" x2="171" y2="70" markerEnd="url(#ag-arrow)" />
          <line x1="248" y1="70" x2="293" y2="70" markerEnd="url(#ag-arrow)" />
          <line x1="340" y1="86" x2="340" y2="156" markerEnd="url(#ag-arrow)" />
          <line x1="296" y1="170" x2="252" y2="170" markerEnd="url(#ag-arrow)" />
          <line x1="223" y1="184" x2="223" y2="236" markerEnd="url(#ag-arrow)" />
          <line x1="207" y1="236" x2="207" y2="184" markerEnd="url(#ag-arrow)" />
          <line x1="178" y1="170" x2="134" y2="170" markerEnd="url(#ag-arrow)" />
          <line x1="57" y1="170" x2="39" y2="170" markerEnd="url(#ag-arrow)" />
        </g>
        <text x="231" y="214" fontSize="8.5" className="fill-muted">
          review
        </text>

        {/* start / end */}
        <circle cx="30" cy="70" r="7" className="fill-surface stroke-line-strong" strokeWidth="1" />
        <circle cx="30" cy="70" r="2.5" className="fill-muted" />
        <text x="30" y="96" fontSize="8.5" textAnchor="middle" className="fill-muted">
          start
        </text>
        <circle cx="30" cy="170" r="8" className="fill-surface stroke-line-strong" strokeWidth="1" />
        <circle cx="30" cy="170" r="8" className="fill-accent" opacity="0">
          <Show a={0.91} b={0.96} dur={D} />
        </circle>
        <text x="30" y="196" fontSize="8.5" textAnchor="middle" className="fill-muted">
          verdict
        </text>

        {NODES.map((n) => {
          const x = n.x - n.w / 2;
          const last = n.windows[n.windows.length - 1][1];
          return (
            <g key={n.id}>
              <rect x={x} y={n.y - 13} width={n.w} height="26" rx="7" className="fill-surface stroke-line-strong" strokeWidth="1" />
              <rect x={x} y={n.y - 13} width={n.w} height="26" rx="7" className="fill-accent/10 stroke-accent" strokeWidth="1.2" opacity="0">
                {activeAnim(n.windows)}
              </rect>
              <text x={n.x} y={n.y + 3.5} fontSize="10" textAnchor="middle" className="fill-fg">
                {n.label}
              </text>
              {/* visited tick */}
              <g opacity="0">
                <circle cx={x + n.w} cy={n.y - 13} r="5.5" className="fill-accent" />
                <path
                  d={`M${x + n.w - 2.6} ${n.y - 13} l1.8 1.8 l3.4 -3.6`}
                  fill="none"
                  className="stroke-accent-fg"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Show a={last + 0.01} b={0.95} dur={D} />
              </g>
            </g>
          );
        })}

        {/* human node */}
        <g>
          <rect x="294" y="55" width="92" height="30" rx="8" className="fill-surface stroke-fg" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="294" y="55" width="92" height="30" rx="8" className="fill-accent/10 stroke-accent" strokeWidth="1.2" opacity="0">
            <Show a={0.235} b={0.46} dur={D} />
          </rect>
          <rect x="306" y="64.5" width="2.6" height="11" rx="1" className="fill-fg" />
          <rect x="311.5" y="64.5" width="2.6" height="11" rx="1" className="fill-fg" />
          <text x="348" y="73.5" fontSize="10" textAnchor="middle" className="fill-fg">
            human
          </text>
          {/* waiting pulse */}
          <g transform="translate(340 70)" opacity="0">
            <Show a={0.24} b={0.38} dur={D} />
            <rect x="-46" y="-15" width="92" height="30" rx="8" fill="none" className="stroke-accent" strokeWidth="1">
              <animateTransform attributeName="transform" type="scale" values="1;1.22" dur="1.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="1.4s" repeatCount="indefinite" />
            </rect>
          </g>
          <g opacity="0">
            <circle cx="386" cy="55" r="5.5" className="fill-accent" />
            <path d="M383.4 55 l1.8 1.8 l3.4 -3.6" fill="none" className="stroke-accent-fg" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <Show a={0.47} b={0.95} dur={D} />
          </g>
        </g>

        {/* evidence sources */}
        <g opacity="0">
          <Show a={0.5} b={0.95} dur={D} />
          <path d="M384 170 C392 170 392 158 400 158" fill="none" className="stroke-accent" strokeWidth="1" />
          <path d="M384 170 C392 170 392 184 400 184" fill="none" className="stroke-accent" strokeWidth="1" />
          <rect x="400" y="150" width="40" height="16" rx="4" className="fill-surface stroke-line-strong" strokeWidth="1" />
          <text x="420" y="161.5" fontSize="8.5" textAnchor="middle" className="fill-fg">
            PDF [1]
          </text>
          <rect x="400" y="176" width="40" height="16" rx="4" className="fill-surface stroke-line-strong" strokeWidth="1" />
          <text x="420" y="187.5" fontSize="8.5" textAnchor="middle" className="fill-fg">
            IMG [2]
          </text>
        </g>
      </g>

      {/* checkpoint badge — persists through the restart */}
      <g opacity="0">
        <Show a={0.25} b={0.95} dur={D} />
        <rect x="390" y="40" width="82" height="20" rx="10" className="fill-bg stroke-accent" strokeWidth="1" />
        <rect x="398" y="45" width="10" height="10" rx="2" fill="none" className="stroke-accent" strokeWidth="1.1" />
        <rect x="400.5" y="45" width="5" height="3.5" className="fill-accent" />
        <text x="413" y="53.5" fontSize="8.5" className="fill-accent">
          checkpoint
        </text>
      </g>

      {/* mediator reply */}
      <g opacity="0">
        <Show a={0.39} b={0.46} dur={D} />
        <rect x="396" y="88" width="70" height="20" rx="10" className="fill-surface stroke-line-strong" strokeWidth="1" />
        <text x="431" y="101.5" fontSize="8.5" textAnchor="middle" className="fill-fg">
          mediator ✓
        </text>
        <path d="M396 98 C 384 98 380 90 384 86" fill="none" className="stroke-line-strong" strokeWidth="1" />
      </g>

      {/* restart flash label */}
      <g opacity="0">
        <Show a={0.31} b={0.37} dur={D} f={0.008} />
        <rect x="170" y="120" width="140" height="26" rx="13" className="fill-bg stroke-fg" strokeWidth="1" />
        <text x="240" y="137" fontSize="10" textAnchor="middle" className="fill-fg">
          ↻ server restart
        </text>
      </g>

      {/* token */}
      <g opacity="0">
        <Along path={PATH} points={KEYS.map((k) => k[1])} times={KEYS.map((k) => k[0])} dur={D} ease={EASES} />
        <Show a={0.02} b={0.95} dur={D} />
        <circle r="9" className="fill-accent" opacity="0.18" />
        <circle r="4.5" className="fill-accent" />
      </g>

      {/* status line */}
      <g>
        <line x1="20" y1="276" x2="160" y2="276" className="stroke-line" strokeWidth="1" />
        <text x="20" y="292" fontSize="10" className="fill-muted">
          ▸ dispute filed · routing
          <Anim values={[1, 1, 0, 0, 1, 1]} times={[0, 0.225, 0.24, 0.965, 0.985, 1]} dur={D} />
        </text>
        {STATUS.map((s) => (
          <text key={s.text} x="20" y="292" fontSize="10" className={s.accent ? "fill-accent" : "fill-fg"} opacity="0">
            {s.text}
            <Show a={s.a} b={s.b} dur={D} f={0.012} />
          </text>
        ))}
      </g>
    </VisualStage>
  );
}
