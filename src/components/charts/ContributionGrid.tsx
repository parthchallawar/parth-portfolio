"use client";

import { useRef } from "react";
import type { ContributionDay } from "@/lib/github";
import { useInViewOnce } from "@/hooks/useInViewOnce";

const CELL = 11;
const GAP = 3;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LEVEL_OPACITY = [0, 0.28, 0.5, 0.75, 1];

function label(d: ContributionDay) {
  const date = new Date(`${d.date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${d.count} contribution${d.count === 1 ? "" : "s"} on ${date}`;
}

/** Year of contributions; columns fade in left-to-right once visible. Scrolls horizontally inside its own box on small screens. */
export function ContributionGrid({ weeks }: { weeks: (ContributionDay | null)[][] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(ref);
  const width = weeks.length * (CELL + GAP);
  const height = 7 * (CELL + GAP) + 18;

  const monthLabels: { x: number; text: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((w, i) => {
    const first = w.find((d) => d);
    if (!first) return;
    const m = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (m !== lastMonth) {
      if (i < weeks.length - 2) monthLabels.push({ x: i * (CELL + GAP), text: MONTHS[m] });
      lastMonth = m;
    }
  });

  return (
    <div
      ref={ref}
      data-lenis-prevent-horizontal
      className="overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:thin]"
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={inView ? "contrib-on block font-mono" : "block font-mono"}
        role="img"
        aria-label="GitHub contribution calendar for the last year"
      >
        {monthLabels.map((m, i) =>
          i > 0 && m.x - monthLabels[i - 1].x < 28 ? null : (
            <text key={`${m.text}-${m.x}`} x={m.x} y="10" fontSize="9" className="fill-muted">
              {m.text}
            </text>
          ),
        )}
        {weeks.map((week, wi) => (
          <g
            key={wi}
            className="contrib-col"
            style={{ animationDelay: `${wi * 14}ms` }}
            transform={`translate(${wi * (CELL + GAP)} 18)`}
          >
            {week.map((d, di) =>
              d ? (
                <rect
                  key={d.date}
                  y={di * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx="2.5"
                  className={d.level === 0 ? "fill-line" : "fill-accent"}
                  fillOpacity={d.level === 0 ? 1 : LEVEL_OPACITY[d.level]}
                >
                  <title>{label(d)}</title>
                </rect>
              ) : null,
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
