"use client";

import { motion } from "motion/react";
import { EASE_SIGNAL } from "@/lib/motion";

type Axis = {
  id: string;
  label: string;
  short: string;
  usage: number;
  usingCount: number;
  total: number;
  proven: number;
  provenCount: number;
  skillCount: number;
};

const S = 420;
const C = S / 2;
const R = 120;
const MIN = 0.04; // keep zero values visible as a point near the centre

function point(i: number, n: number, v: number) {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
  const r = R * Math.max(MIN, v);
  return [C + Math.cos(a) * r, C + Math.sin(a) * r] as const;
}

function polygon(values: number[]) {
  return values.map((v, i) => point(i, values.length, v).map((n) => n.toFixed(1)).join(",")).join(" ");
}

function pathFrom(values: number[]) {
  const pts = values.map((v, i) => point(i, values.length, v));
  return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} Z`;
}

/**
 * Six axes = skill categories. Solid shape: share of experience + projects that use the
 * category. Dashed shape: share of the category's skills proven in shipped/production work.
 * Both computed from src/content at build time.
 */
export function TechRadar({ axes }: { axes: Axis[] }) {
  const n = axes.length;
  const usage = axes.map((a) => a.usage);
  const proven = axes.map((a) => a.proven);
  const view = { once: true, margin: "0px 0px -15% 0px" } as const;

  return (
    <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <svg
        viewBox={`0 0 ${S} ${S}`}
        className="mx-auto block w-full max-w-[460px] overflow-visible font-mono"
        role="img"
        aria-labelledby="radar-title radar-desc"
      >
        <title id="radar-title">Tech radar</title>
        <desc id="radar-desc">
          {axes
            .map(
              (a) =>
                `${a.label}: used in ${a.usingCount} of ${a.total} roles and projects; ${a.provenCount} of ${a.skillCount} skills proven in shipped work`,
            )
            .join(". ")}
        </desc>
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <polygon
            key={r}
            points={polygon(Array(n).fill(r))}
            fill="none"
            className="stroke-line"
            strokeWidth="1"
          />
        ))}
        {axes.map((a, i) => {
          const [x, y] = point(i, n, 1);
          const [lx, ly] = point(i, n, 1.2);
          const anchor = Math.abs(lx - C) < 8 ? "middle" : lx > C ? "start" : "end";
          return (
            <g key={a.id}>
              <line x1={C} y1={C} x2={x} y2={y} className="stroke-line" strokeWidth="1" />
              <text x={lx} y={ly - 5} textAnchor={anchor} fontSize="11" className="fill-fg font-sans">
                {a.label}
              </text>
              <text x={lx} y={ly + 10} textAnchor={anchor} fontSize="10" className="fill-muted">
                {a.usingCount}/{a.total} · {a.provenCount}/{a.skillCount}
              </text>
            </g>
          );
        })}

        <motion.path
          d={pathFrom(usage)}
          className="fill-accent/10 stroke-accent"
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={{ pathLength: 0, fillOpacity: 0 }}
          whileInView={{ pathLength: 1, fillOpacity: 1 }}
          viewport={view}
          transition={{ pathLength: { duration: 1.4, ease: EASE_SIGNAL }, fillOpacity: { duration: 0.8, delay: 0.9 } }}
        />
        <motion.path
          d={pathFrom(proven)}
          fill="none"
          className="stroke-fg/70"
          strokeWidth="1"
          strokeDasharray="3 4"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={view}
          transition={{ duration: 0.8, delay: 1.1 }}
        />
        {usage.map((v, i) => {
          const [x, y] = point(i, n, v);
          return (
            <motion.circle
              key={axes[i].id}
              cx={x}
              cy={y}
              r="3"
              className="fill-accent"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={view}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.07 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          );
        })}
      </svg>

      <div>
        <p className="label-mono text-muted">How to read it</p>
        <ul className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
          <li className="flex gap-3">
            <span className="mt-2 h-px w-6 shrink-0 bg-accent" aria-hidden="true" />
            <span>
              <span className="text-fg">Solid</span> — share of my role and projects that use the category (
              <span className="font-mono text-xs">n/{axes[0]?.total}</span>).
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-2 h-px w-6 shrink-0 border-t border-dashed border-fg/70" aria-hidden="true" />
            <span>
              <span className="text-fg">Dashed</span> — share of the category&apos;s skills proven in shipped or
              production work.
            </span>
          </li>
        </ul>
        <table className="mt-8 w-full border-t border-line text-left text-sm">
          <caption className="sr-only">Tech radar values by category</caption>
          <thead>
            <tr className="label-mono text-muted">
              <th scope="col" className="py-3 font-normal">Category</th>
              <th scope="col" className="py-3 text-right font-normal">Used in</th>
              <th scope="col" className="py-3 text-right font-normal">Proven</th>
            </tr>
          </thead>
          <tbody>
            {axes.map((a) => (
              <tr key={a.id} className="border-t border-line">
                <th scope="row" className="py-2.5 font-normal text-fg">{a.label}</th>
                <td className="py-2.5 text-right font-mono text-xs text-muted">
                  {a.usingCount}/{a.total}
                </td>
                <td className="py-2.5 text-right font-mono text-xs text-muted">
                  {a.provenCount}/{a.skillCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
