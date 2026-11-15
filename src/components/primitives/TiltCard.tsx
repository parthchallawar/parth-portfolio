"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode, type PointerEvent } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FINE_POINTER, useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

/**
 * Pointer-driven tilt (≤ 8°) with a moving specular glare. Children can opt into
 * parallax depth with `TiltLayer depth={n}`. The tilting element itself carries no
 * backdrop-filter (that would flatten preserve-3d) — glass lives on a background layer.
 */
export function TiltCard({
  children,
  className,
  max = 8,
  cursorLabel,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  cursorLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const fine = useMediaQuery(FINE_POINTER);
  const enabled = fine && !reduce;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 160, damping: 20, mass: 0.6 };
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx} ${gy}, color-mix(in oklab, var(--fg) 9%, transparent), transparent 45%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    glareOpacity.set(1);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    glareOpacity.set(0);
  };

  return (
    <div className={cn("[perspective:1400px]", className)} data-cursor={cursorLabel}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={enabled ? { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" } : undefined}
        className="relative h-full rounded-[1.75rem]"
      >
        {children}
        {enabled ? (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] mix-blend-plus-lighter light:mix-blend-normal"
            style={{ background: glare, opacity: glareOpacity }}
          />
        ) : null}
      </motion.div>
    </div>
  );
}

/** A layer inside TiltCard lifted on the Z axis for parallax. */
export function TiltLayer({
  depth = 0,
  className,
  children,
}: {
  depth?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className} style={{ transform: `translateZ(${depth}px)`, transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}
