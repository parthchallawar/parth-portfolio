import { VisualStage } from "./VisualStage";
import { Anim, EASE_IN_OUT, LINEAR, Move, Show } from "./smil";

const D = 10;

// Document clauses (left).
const CLAUSES = [
  { id: "2.1", y: 66, w: [150, 118] },
  { id: "4.2", y: 100, w: [156, 96] },
  { id: "5.4", y: 134, w: [142, 124] },
  { id: "7.1", y: 168, w: [152, 108] },
  { id: "9.2", y: 202, w: [138, 128] },
  { id: "11.3", y: 236, w: [148, 90] },
];

// Claims in the answer (right). `clause` = where the quote is found; undefined = not in source.
const CLAIMS = [
  { quote: "“terminate on 30 days’ notice”", clause: 1, t: 0.06 },
  { quote: "“liability capped at $250,000”", clause: 3, t: 0.24, figure: true },
  { quote: "“governing law: Delaware”", clause: 5, t: 0.42 },
  { quote: "“auto-renews every 24 months”", clause: undefined, t: 0.6 },
] as const;

const ROW_Y = [62, 112, 162, 212];
const SCAN_TOP = 50;

/**
 * ContractAI — an answer's quotes are checked against the contract one by one. Matches get
 * a verified tick and a citation link to the clause; a claim that isn't in the source is removed.
 */
export function CitationCheckVisual({ className }: { className?: string }) {
  // Scan line keyframes: sweep down to each clause (or the whole page for the miss).
  const scanTimes: number[] = [0];
  const scanY: [number, number][] = [[0, 0]];
  const scanOpacityT: number[] = [0];
  const scanOpacityV: number[] = [0];
  CLAIMS.forEach((c) => {
    const target = c.clause !== undefined ? CLAUSES[c.clause].y + 10 : 262;
    const travel = c.clause !== undefined ? 0.06 + c.clause * 0.006 : 0.12;
    scanTimes.push(c.t, c.t + travel);
    scanY.push([0, 0], [0, target - SCAN_TOP]);
    scanOpacityT.push(c.t - 0.005, c.t, c.t + travel, c.t + travel + 0.03);
    scanOpacityV.push(0, 1, 1, 0);
  });
  scanTimes.push(1);
  scanY.push([0, 0]);
  scanOpacityT.push(1);
  scanOpacityV.push(0);

  return (
    <VisualStage
      viewBox="0 0 480 300"
      freezeAt={D * 0.86}
      className={className}
      label="An AI answer about a contract. Each quoted clause and figure is checked against the source document: three quotes are found and get a verified citation, one claim is not in the contract and is removed."
    >
      <text x="20" y="26" fontSize="10" letterSpacing="0.8" className="fill-muted">
        SOURCE · MSA.pdf
      </text>
      <text x="460" y="26" fontSize="10" letterSpacing="0.8" textAnchor="end" className="fill-muted">
        ANSWER · LEGAL VIEW
      </text>

      {/* document */}
      <rect x="20" y="40" width="196" height="234" rx="10" className="fill-surface stroke-line-strong" strokeWidth="1" />
      {CLAUSES.map((c, i) => {
        const claim = CLAIMS.find((k) => k.clause === i);
        return (
          <g key={c.id}>
            {claim ? (
              <rect x="26" y={c.y - 10} width="184" height="34" rx="5" className="fill-accent/10" opacity="0">
                <Show a={claim.t + 0.07 + i * 0.006} b={0.94} dur={D} />
              </rect>
            ) : null}
            {claim ? (
              <rect x="26" y={c.y - 10} width="2" height="34" className="fill-accent" opacity="0">
                <Show a={claim.t + 0.07 + i * 0.006} b={0.94} dur={D} />
              </rect>
            ) : null}
            <text x="34" y={c.y} fontSize="8.5" className="fill-muted">
              §{c.id}
            </text>
            <rect x="34" y={c.y + 5} width={c.w[0]} height="4.5" rx="2.25" className="fill-line-strong" />
            <rect x="34" y={c.y + 14} width={c.w[1]} height="4.5" rx="2.25" className="fill-line-strong" />
          </g>
        );
      })}

      {/* scan line */}
      <g opacity="0">
        <Anim values={scanOpacityV} times={scanOpacityT} dur={D} ease={LINEAR} />
        <g>
          <Move values={scanY} times={scanTimes} dur={D} ease={EASE_IN_OUT} />
          <rect x="22" y={SCAN_TOP - 10} width="192" height="10" className="fill-accent/15" />
          <line x1="22" y1={SCAN_TOP} x2="214" y2={SCAN_TOP} className="stroke-accent" strokeWidth="1" />
        </g>
      </g>

      {/* answer */}
      <rect x="244" y="40" width="216" height="234" rx="10" className="fill-surface stroke-line-strong" strokeWidth="1" />
      {CLAIMS.map((c, i) => {
        const y = ROW_Y[i];
        const done = c.t + (c.clause !== undefined ? 0.1 : 0.15);
        const verified = c.clause !== undefined;
        return (
          <g key={c.quote}>
            {/* citation link */}
            {verified ? (
              <path
                d={`M244 ${y + 17} C 230 ${y + 17}, 230 ${CLAUSES[c.clause].y + 7}, 216 ${CLAUSES[c.clause].y + 7}`}
                fill="none"
                className="stroke-accent"
                strokeWidth="1"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset="1"
              >
                <Anim
                  attr="stroke-dashoffset"
                  values={[1, 1, 0, 0, 1, 1]}
                  times={[0, done - 0.03, done, 0.94, 0.96, 1]}
                  dur={D}
                />
              </path>
            ) : null}

            <g>
              {!verified ? (
                <Anim values={[1, 1, 0.35, 0.35, 1, 1]} times={[0, done, done + 0.03, 0.94, 0.96, 1]} dur={D} />
              ) : null}
              <rect x="252" y={y} width="200" height="40" rx="7" className="fill-bg stroke-line" strokeWidth="1" />
              <text x="262" y={y + 16} fontSize="9.5" className="fill-fg">
                {c.quote}
              </text>
              {!verified ? (
                <line x1="262" y1={y + 13} x2="262" y2={y + 13} className="stroke-fg" strokeWidth="1">
                  <Anim attr="x2" values={[262, 262, 428, 428, 262, 262]} times={[0, done, done + 0.04, 0.94, 0.95, 1]} dur={D} />
                </line>
              ) : null}

              {/* status: checking → verified / removed */}
              <text x="262" y={y + 31} fontSize="8.5" className="fill-muted">
                pending
                <Anim values={[1, 1, 0, 0, 1, 1]} times={[0, c.t - 0.01, c.t, 0.94, 0.96, 1]} dur={D} />
              </text>
              <text x="262" y={y + 31} fontSize="8.5" className="fill-muted" opacity="0">
                checking source…
                <Show a={c.t} b={done - 0.01} dur={D} f={0.01} />
              </text>
              {verified ? (
                <g opacity="0">
                  <Show a={done} b={0.94} dur={D} />
                  <circle cx="266" cy={y + 28} r="5" className="fill-accent" />
                  <path
                    d={`M263.6 ${y + 28} l1.7 1.7 l3.1 -3.3`}
                    fill="none"
                    className="stroke-accent-fg"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text x="276" y={y + 31} fontSize="8.5" className="fill-accent">
                    {"figure" in c && c.figure ? "figure matches" : "exact match"} · §{CLAUSES[c.clause].id}
                  </text>
                </g>
              ) : (
                <g opacity="0">
                  <Show a={done} b={0.94} dur={D} />
                  <text x="262" y={y + 31} fontSize="8.5" className="fill-fg">
                    ✕ not in source · removed
                  </text>
                </g>
              )}
            </g>
          </g>
        );
      })}

      {/* summary */}
      <g opacity="0">
        <Show a={0.8} b={0.94} dur={D} />
        <line x1="252" y1="262" x2="452" y2="262" className="stroke-line" strokeWidth="1" />
      </g>
      <text x="252" y="292" fontSize="10" className="fill-muted">
        hallucination check
        <Anim values={[1, 1, 0, 0, 1, 1]} times={[0, 0.79, 0.8, 0.94, 0.96, 1]} dur={D} />
      </text>
      <text x="252" y="292" fontSize="10" className="fill-accent" opacity="0">
        3 quotes verified · 1 claim removed
        <Show a={0.8} b={0.94} dur={D} />
      </text>
      <text x="20" y="292" fontSize="10" className="fill-muted">
        BM25 + MiniLM · RRF
      </text>
    </VisualStage>
  );
}
