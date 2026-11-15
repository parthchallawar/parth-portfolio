"use client";

import { motion } from "motion/react";
import { Counter } from "@/components/primitives/Counter";
import { EASE_SIGNAL } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const R = 64;
const C = 2 * Math.PI * R;

/** SVG arc animating to value/scale once in view. */
export function CgpaRing({ value, scale }: { value: number; scale: number }) {
  const ratio = Math.min(1, value / scale);
  const reduce = useReducedMotion();
  return (
    <div className="relative size-44 shrink-0 sm:size-52">
      <svg viewBox="0 0 160 160" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="80" cy="80" r={R} fill="none" strokeWidth="6" className="stroke-line" />
        {Array.from({ length: 40 }, (_, i) => (
          <line
            key={i}
            x1="80"
            y1="4"
            x2="80"
            y2={i % 5 === 0 ? 10 : 7}
            transform={`rotate(${i * 9} 80 80)`}
            className="stroke-line-strong"
            strokeWidth="1"
          />
        ))}
        <motion.circle
          cx="80"
          cy="80"
          r={R}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className="stroke-accent"
          strokeDasharray={C}
          initial={{ strokeDashoffset: reduce ? C * (1 - ratio) : C }}
          whileInView={{ strokeDashoffset: C * (1 - ratio) }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.6, ease: EASE_SIGNAL }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <span className="block text-4xl font-medium leading-none tracking-[-0.04em] sm:text-5xl">
            <Counter value={value} decimals={2} />
          </span>
          <span className="mt-2 block font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted">
            CGPA / {scale}
          </span>
        </div>
      </div>
    </div>
  );
}
