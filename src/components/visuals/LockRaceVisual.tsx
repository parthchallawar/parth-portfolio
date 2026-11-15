import { VisualStage } from "./VisualStage";
import { Along, Anim, EASE_IN_OUT, EASE_OUT, LINEAR, Move, Show } from "./smil";

const D = 8;
const PATH_A = "M160 80 H200 L236 130 L300 130";
const PATH_B = "M160 180 H200 L230 138";
const LOCK_AT = 0.6135;

/**
 * Wanderlust — two requests race for one booking slot. inst-1 acquires the Redis lock and
 * books; inst-2 finds the lock held and is turned away; the lock is released.
 */
export function LockRaceVisual({ className }: { className?: string }) {
  return (
    <VisualStage
      viewBox="0 0 480 300"
      freezeAt={D * 0.5}
      className={className}
      label="Two booking requests from different server instances race for the same slot. The first acquires a Redis lock and books it; the second finds the lock held and is rejected."
    >
      {/* header */}
      <text x="20" y="26" fontSize="10" letterSpacing="0.8" className="fill-muted">
        LOAD BALANCED · 2 INSTANCES
      </text>
      <text x="460" y="26" fontSize="10" letterSpacing="0.8" textAnchor="end" className="fill-muted">
        ONE SLOT
      </text>

      {/* load balancer + instances */}
      <g>
        <path d="M52 130 C64 130 62 80 74 80" fill="none" className="stroke-line-strong" strokeWidth="1" />
        <path d="M52 130 C64 130 62 180 74 180" fill="none" className="stroke-line-strong" strokeWidth="1" />
        <circle cx="36" cy="130" r="16" className="fill-surface stroke-line-strong" strokeWidth="1" />
        <text x="36" y="133.5" fontSize="9.5" textAnchor="middle" className="fill-muted">
          LB
        </text>
        {[
          { y: 80, label: "inst-1" },
          { y: 180, label: "inst-2" },
        ].map((i) => (
          <g key={i.label}>
            <rect x="74" y={i.y - 14} width="60" height="28" rx="7" className="fill-surface stroke-line-strong" strokeWidth="1" />
            <text x="104" y={i.y + 3.5} fontSize="10" textAnchor="middle" className="fill-fg">
              {i.label}
            </text>
          </g>
        ))}
      </g>

      {/* request tracks */}
      <path d={PATH_A} fill="none" className="stroke-line-strong" strokeWidth="1" strokeDasharray="2 4" />
      <path d={PATH_B} fill="none" className="stroke-line-strong" strokeWidth="1" strokeDasharray="2 4" />

      {/* slot card */}
      <g>
        <rect x="300" y="92" width="160" height="76" rx="12" className="fill-surface stroke-line-strong" strokeWidth="1" />
        <rect x="300" y="92" width="160" height="76" rx="12" fill="none" className="stroke-accent" strokeWidth="1.25" opacity="0">
          <Show a={0.45} b={0.9} dur={D} />
        </rect>
        <text x="316" y="113" fontSize="9.5" letterSpacing="0.8" className="fill-muted">
          SLOT 42
        </text>
        <text x="316" y="135" fontSize="15" className="fill-fg font-sans" letterSpacing="-0.3">
          Jun 12 – 15
        </text>
        <g>
          <circle cx="320" cy="153" r="2.5" className="fill-muted" />
          <text x="328" y="156" fontSize="10" className="fill-muted">
            available
          </text>
          <Anim values={[1, 1, 0, 0, 1, 1]} times={[0, 0.44, 0.46, 0.9, 0.92, 1]} dur={D} />
        </g>
        <g opacity="0">
          <path d="M316 153 l3 3 l6 -6.5" fill="none" className="stroke-accent" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="330" y="156" fontSize="10" className="fill-accent">
            booked · inst-1
          </text>
          <Show a={0.46} b={0.9} dur={D} />
        </g>
      </g>

      {/* lock */}
      <g>
        <circle cx="258" cy="134" r="12" fill="none" className="stroke-accent" strokeWidth="1" opacity="0">
          <Anim attr="r" values={[12, 12, 28, 28]} times={[0, 0.26, 0.37, 1]} dur={D} />
          <Anim values={[0, 0, 0.7, 0, 0]} times={[0, 0.259, 0.265, 0.37, 1]} dur={D} ease={LINEAR} />
        </circle>
        <g>
          <path d="M252 128 v-5 a6 6 0 0 1 12 0 v5" fill="none" className="stroke-fg" strokeWidth="1.6" strokeLinecap="round" />
          <Move
            values={[
              [0, -5],
              [0, -5],
              [0, 0],
              [0, 0],
              [0, -5],
              [0, -5],
            ]}
            times={[0, 0.255, 0.285, 0.62, 0.65, 1]}
            dur={D}
          />
        </g>
        <rect x="248" y="127" width="20" height="16" rx="3.5" className="fill-surface stroke-fg" strokeWidth="1.4" />
        <rect x="248" y="127" width="20" height="16" rx="3.5" className="fill-accent" opacity="0">
          <Show a={0.26} b={0.62} dur={D} f={0.025} />
        </rect>
        <circle cx="258" cy="134.5" r="1.8" className="fill-bg" />
        <text x="258" y="162" fontSize="9" textAnchor="middle" className="fill-muted">
          redis lock
        </text>
      </g>

      {/* request B — turned away */}
      <g opacity="0">
        <Along
          path={PATH_B}
          points={[0, 0, 1, 1, 0.3, 0.3]}
          times={[0, 0.07, 0.35, 0.39, 0.56, 1]}
          dur={D}
          ease={[LINEAR, EASE_IN_OUT, LINEAR, EASE_OUT, LINEAR]}
        />
        <Anim values={[0, 0, 1, 1, 0.5, 0.5, 0, 0]} times={[0, 0.03, 0.05, 0.385, 0.4, 0.5, 0.56, 1]} dur={D} />
        <g>
          <Move
            values={[
              [0, 0],
              [0, 0],
              [-3, 0],
              [3, 0],
              [-2, 0],
              [0, 0],
              [0, 0],
            ]}
            times={[0, 0.39, 0.4, 0.41, 0.42, 0.43, 1]}
            dur={D}
            ease={LINEAR}
          />
          <rect x="-23" y="-9" width="46" height="18" rx="9" className="fill-surface stroke-fg" strokeWidth="1" />
          <text x="0" y="3.3" fontSize="9.5" textAnchor="middle" className="fill-fg">
            REQ B
          </text>
          <g opacity="0">
            <circle cx="22" cy="-9" r="6.5" className="fill-fg" />
            <path d="M19.8 -11.2 l4.4 4.4 M24.2 -11.2 l-4.4 4.4" className="stroke-bg" strokeWidth="1.4" strokeLinecap="round" />
            <Show a={0.39} b={0.52} dur={D} />
          </g>
        </g>
      </g>

      {/* request A — wins the lock */}
      <g opacity="0">
        <Along
          path={PATH_A}
          points={[0, 0, LOCK_AT, LOCK_AT, 1, 1]}
          times={[0, 0.05, 0.26, 0.31, 0.45, 1]}
          dur={D}
          ease={[LINEAR, EASE_IN_OUT, LINEAR, EASE_IN_OUT, LINEAR]}
        />
        <Show a={0.02} b={0.44} dur={D} />
        <rect x="-23" y="-9" width="46" height="18" rx="9" className="fill-surface stroke-fg" strokeWidth="1" />
        <text x="0" y="3.3" fontSize="9.5" textAnchor="middle" className="fill-fg">
          REQ A
        </text>
        <g opacity="0">
          <rect x="-23" y="-9" width="46" height="18" rx="9" className="fill-accent" />
          <text x="0" y="3.3" fontSize="9.5" textAnchor="middle" className="fill-accent-fg">
            REQ A
          </text>
          <Show a={0.265} b={0.44} dur={D} />
        </g>
      </g>

      <text x="200" y="208" fontSize="9.5" className="fill-muted" opacity="0">
        409 · slot held — retry other dates
        <Show a={0.4} b={0.62} dur={D} />
      </text>

      {/* console */}
      <g>
        <rect x="20" y="226" width="440" height="58" rx="10" className="fill-bg stroke-line" strokeWidth="1" />
        <circle cx="34" cy="241" r="2.5" className="fill-accent" />
        <text x="44" y="244" fontSize="9" letterSpacing="0.8" className="fill-muted">
          REDIS
        </text>
        <text x="34" y="262" fontSize="10" className="fill-muted">
          waiting for requests…
          <Anim values={[1, 1, 0, 0, 1, 1]} times={[0, 0.25, 0.27, 0.9, 0.93, 1]} dur={D} />
        </text>
        <text x="34" y="262" fontSize="10" className="fill-fg" opacity="0">
          inst-1 › SET lock:slot:42 NX <tspan className="fill-accent">→ OK</tspan>
          <Show a={0.27} b={0.6} dur={D} />
        </text>
        <text x="34" y="262" fontSize="10" className="fill-fg" opacity="0">
          inst-1 › booking committed · <tspan className="fill-accent">DEL lock</tspan>
          <Show a={0.62} b={0.9} dur={D} />
        </text>
        <text x="34" y="277" fontSize="10" className="fill-muted" opacity="0">
          inst-2 › SET lock:slot:42 NX → (nil) · rejected
          <Show a={0.38} b={0.9} dur={D} />
        </text>
      </g>
    </VisualStage>
  );
}
