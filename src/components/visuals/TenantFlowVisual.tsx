import type { ReactNode } from "react";
import { VisualStage } from "./VisualStage";
import { Along, Anim, EASE_IN_OUT, LINEAR, Move, Show } from "./smil";

const D = 9;
const PATH = "M70 118 H295 L353 92 L410 118";
const P = { cart: 110 / 351.2, kitchen: 225 / 351.2, queue: 288.6 / 351.2 };

const KEYS: [number, number][] = [
  [0, 0],
  [0.06, 0],
  [0.16, P.cart],
  [0.27, P.cart],
  [0.36, P.kitchen],
  [0.44, P.kitchen],
  [0.5, P.queue],
  [0.56, P.queue],
  [0.62, 1],
  [1, 1],
];
const EASES = KEYS.slice(1).map((_, i) => (i % 2 === 0 ? LINEAR : EASE_IN_OUT));

function NodeBox({
  x,
  w,
  caption,
  windowA,
  windowB,
  children,
}: {
  x: number;
  w: number;
  caption: string;
  windowA: number;
  windowB: number;
  children: ReactNode;
}) {
  return (
    <g>
      <rect x={x - w / 2} y="92" width={w} height="52" rx="10" className="fill-surface stroke-line-strong" strokeWidth="1" />
      <rect x={x - w / 2} y="92" width={w} height="52" rx="10" className="fill-accent/10 stroke-accent" strokeWidth="1.2" opacity="0">
        <Show a={windowA} b={windowB} dur={D} />
      </rect>
      {children}
      <text x={x} y="162" fontSize="9" textAnchor="middle" className="fill-muted">
        {caption}
      </text>
    </g>
  );
}

/**
 * Tastify — table → cart → kitchen ticket → print queue → printer, inside a tenant boundary
 * enforced by Row-Level Security. A duplicate submit is dropped, and a cross-tenant read from
 * another restaurant is denied at the boundary.
 */
export function TenantFlowVisual({ className }: { className?: string }) {
  return (
    <VisualStage
      viewBox="0 0 480 300"
      freezeAt={D * 0.72}
      className={className}
      label="Inside one restaurant's tenant boundary, an order flows from a table session to the cart, to a kitchen order, through a PostgreSQL job queue to the printer. A duplicate submission is dropped, and a query from another restaurant is denied by Row-Level Security."
    >
      <text x="20" y="26" fontSize="10" letterSpacing="0.8" className="fill-muted">
        REAL-TIME ORDERING
      </text>
      <text x="460" y="26" fontSize="10" letterSpacing="0.8" textAnchor="end" className="fill-muted">
        MULTI-TENANT
      </text>

      {/* tenant A boundary */}
      <rect x="14" y="40" width="452" height="158" rx="14" fill="none" className="stroke-line-strong" strokeWidth="1" strokeDasharray="4 4" />
      <rect x="14" y="40" width="452" height="158" rx="14" fill="none" className="stroke-accent" strokeWidth="1.4" strokeDasharray="4 4" opacity="0">
        <Show a={0.52} b={0.66} dur={D} />
      </rect>
      <text x="28" y="58" fontSize="9.5" className="fill-fg">
        tenant · restaurant_a
      </text>
      <g>
        <rect x="408" y="47" width="46" height="16" rx="8" className="fill-accent/10 stroke-accent/50" strokeWidth="1" />
        <text x="431" y="58.5" fontSize="8.5" textAnchor="middle" className="fill-accent">
          RLS
        </text>
      </g>

      {/* edges */}
      <g className="stroke-line-strong" strokeWidth="1" strokeDasharray="2 4" fill="none">
        <line x1="96" y1="118" x2="148" y2="118" />
        <line x1="212" y1="118" x2="263" y2="118" />
        <path d="M327 118 L353 92 L380 118" />
      </g>

      {/* print queue */}
      <g>
        <text x="353" y="70" fontSize="8" textAnchor="middle" className="fill-muted">
          pg queue
        </text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={340 + i * 9} y="78" width="7" height="12" rx="1.5" className="fill-bg stroke-line-strong" strokeWidth="1" />
        ))}
        <rect x="358" y="78" width="7" height="12" rx="1.5" className="fill-accent" opacity="0">
          <Show a={0.5} b={0.6} dur={D} />
        </rect>
      </g>

      {/* table */}
      <NodeBox x={70} w={52} caption="table session" windowA={0.02} windowB={0.13}>
        <path d="M56 112 h28 M60 112 v14 M80 112 v14" className="stroke-fg" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <text x="70" y="137" fontSize="8.5" textAnchor="middle" className="fill-muted">
          T4
        </text>
      </NodeBox>

      {/* cart */}
      <NodeBox x={180} w={64} caption="cart" windowA={0.16} windowB={0.27}>
        <path d="M166 106 h4 l3 13 h14 l3 -9 h-18" className="stroke-fg" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="175" cy="123" r="1.6" className="fill-fg" />
        <circle cx="186" cy="123" r="1.6" className="fill-fg" />
        <text x="180" y="138" fontSize="8.5" textAnchor="middle" className="fill-muted">
          0 items
          <Anim values={[1, 1, 0, 0, 1, 1]} times={[0, 0.17, 0.18, 0.93, 0.95, 1]} dur={D} />
        </text>
        <text x="180" y="138" fontSize="8.5" textAnchor="middle" className="fill-fg" opacity="0">
          1 item
          <Show a={0.175} b={0.22} dur={D} f={0.008} />
        </text>
        <text x="180" y="138" fontSize="8.5" textAnchor="middle" className="fill-fg" opacity="0">
          2 items
          <Show a={0.225} b={0.93} dur={D} f={0.008} />
        </text>
      </NodeBox>

      {/* kitchen */}
      <NodeBox x={295} w={64} caption="kitchen order" windowA={0.36} windowB={0.45}>
        <rect x="286" y="102" width="18" height="22" rx="2" className="fill-none stroke-fg" strokeWidth="1.3" />
        <path d="M290 109 h10 M290 114 h10 M290 119 h6" className="stroke-fg" strokeWidth="1.1" strokeLinecap="round" />
        <text x="295" y="138" fontSize="8.5" textAnchor="middle" className="fill-muted">
          KOT
        </text>
      </NodeBox>

      {/* printer + ticket */}
      <g>
        <g opacity="0">
          <Show a={0.62} b={0.9} dur={D} f={0.01} />
          <g>
            <Move
              values={[
                [0, 34],
                [0, 34],
                [0, 0],
                [0, 0],
                [0, 34],
                [0, 34],
              ]}
              times={[0, 0.62, 0.72, 0.88, 0.92, 1]}
              dur={D}
            />
            <rect x="396" y="62" width="28" height="34" rx="2" className="fill-fg" />
            <path d="M400 70 h20 M400 76 h20 M400 82 h14" className="stroke-bg" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        </g>
        <NodeBox x={410} w={60} caption="print bridge" windowA={0.62} windowB={0.82}>
          <rect x="398" y="106" width="24" height="14" rx="2.5" className="fill-none stroke-fg" strokeWidth="1.3" />
          <path d="M402 106 v-4 h16 v4" className="stroke-fg" strokeWidth="1.2" fill="none" />
          <circle cx="417" cy="113" r="1.3" className="fill-accent" />
          <text x="410" y="138" fontSize="8.5" textAnchor="middle" className="fill-muted">
            thermal
          </text>
        </NodeBox>
        <g opacity="0">
          <Show a={0.72} b={0.92} dur={D} />
          <text x="410" y="182" fontSize="9" textAnchor="middle" className="fill-accent">
            ✓ printed &lt; 2s
          </text>
        </g>
      </g>

      {/* duplicate submit — dropped */}
      <g opacity="0">
        <Anim values={[0, 0, 0.8, 0.8, 0, 0]} times={[0, 0.29, 0.3, 0.38, 0.44, 1]} dur={D} />
        <g>
          <Move
            values={[
              [180, 118],
              [180, 118],
              [228, 118],
              [228, 118],
            ]}
            times={[0, 0.3, 0.37, 1]}
            dur={D}
          />
          <rect x="-20" y="-8" width="40" height="16" rx="8" fill="none" className="stroke-fg" strokeWidth="1" strokeDasharray="2 2" />
          <text x="0" y="3" fontSize="8.5" textAnchor="middle" className="fill-muted">
            order
          </text>
        </g>
      </g>
      <text x="236" y="84" fontSize="8.5" textAnchor="middle" className="fill-muted" opacity="0">
        duplicate · dropped
        <Show a={0.36} b={0.48} dur={D} />
      </text>

      {/* order token */}
      <g opacity="0">
        <Along path={PATH} points={KEYS.map((k) => k[1])} times={KEYS.map((k) => k[0])} dur={D} ease={EASES} />
        <Show a={0.03} b={0.63} dur={D} />
        <rect x="-20" y="-8" width="40" height="16" rx="8" className="fill-accent" />
        <text x="0" y="3" fontSize="8.5" textAnchor="middle" className="fill-accent-fg">
          order
          <Anim values={[1, 1, 0, 0]} times={[0, 0.44, 0.45, 1]} dur={D} ease={LINEAR} />
        </text>
        <text x="0" y="3" fontSize="8.5" textAnchor="middle" className="fill-accent-fg" opacity="0">
          job
          <Anim values={[0, 0, 1, 1]} times={[0, 0.44, 0.45, 1]} dur={D} ease={LINEAR} />
        </text>
      </g>

      {/* tenant B */}
      <g>
        <rect x="14" y="212" width="452" height="66" rx="14" fill="none" className="stroke-line-strong" strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
        <text x="28" y="230" fontSize="9.5" className="fill-muted">
          tenant · restaurant_b
        </text>
        <g className="fill-surface stroke-line" strokeWidth="1">
          {[70, 180, 295, 410].map((x) => (
            <rect key={x} x={x - 24} y="240" width="48" height="24" rx="7" />
          ))}
        </g>
        <g className="stroke-line" strokeWidth="1" strokeDasharray="2 4">
          <line x1="94" y1="252" x2="156" y2="252" />
          <line x1="204" y1="252" x2="271" y2="252" />
          <line x1="319" y1="252" x2="386" y2="252" />
        </g>
        {/* cross-tenant read attempt */}
        <line x1="240" y1="238" x2="240" y2="238" className="stroke-fg" strokeWidth="1.2" strokeDasharray="3 3">
          <Anim attr="y2" values={[238, 238, 202, 202, 238, 238]} times={[0, 0.45, 0.52, 0.72, 0.78, 1]} dur={D} />
        </line>
        <g opacity="0">
          <Show a={0.52} b={0.74} dur={D} />
          <circle cx="240" cy="198" r="7" className="fill-bg stroke-fg" strokeWidth="1.2" />
          <path d="M237.4 195.4 l5.2 5.2 M242.6 195.4 l-5.2 5.2" className="stroke-fg" strokeWidth="1.3" strokeLinecap="round" />
          <rect x="252" y="217" width="104" height="18" rx="9" className="fill-bg stroke-line-strong" strokeWidth="1" />
          <text x="304" y="229.5" fontSize="8.5" textAnchor="middle" className="fill-fg">
            cross-tenant · denied
          </text>
        </g>
      </g>

      <text x="20" y="294" fontSize="10" className="fill-muted">
        POSTGRES ROW-LEVEL SECURITY
      </text>
      <text x="460" y="294" fontSize="10" textAnchor="end" className="fill-muted">
        3 restaurants · 500+ orders
      </text>
    </VisualStage>
  );
}
