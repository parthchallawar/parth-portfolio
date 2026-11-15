"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { FINE_POINTER, useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const INTERACTIVE = 'a, button, [role="button"], summary, label, select, [data-cursor]';

/** Dot + trailing ring. Only on (hover: hover) and (pointer: fine); native cursor otherwise. */
export function CustomCursor() {
  const fine = useMediaQuery(FINE_POINTER);
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringSpring = reduce ? { stiffness: 2000, damping: 100 } : { stiffness: 420, damping: 34, mass: 0.6 };
  const rx = useSpring(x, ringSpring);
  const ry = useSpring(y, ringSpring);
  const [mode, setMode] = useState<"idle" | "hover" | "text" | "hidden">("hidden");
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!fine) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      if (!t || !(t instanceof Element)) return;
      if (t.closest("input, textarea, [contenteditable='true']")) {
        setMode("text");
        setLabel(null);
        return;
      }
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      const interactive = t.closest(INTERACTIVE);
      setLabel(labelled?.dataset.cursor || null);
      setMode(interactive ? "hover" : "idle");
    };
    const onLeave = () => setMode("hidden");
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  const ringSize = label ? 76 : mode === "hover" ? 44 : 30;
  const visible = mode !== "hidden" && mode !== "text";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: rx, y: ry }}
      >
        <motion.div
          className="size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/70"
          animate={{
            opacity: visible ? 1 : 0,
            scale: (ringSize / 44) * (down ? 0.85 : 1),
            backgroundColor: label
              ? "color-mix(in oklab, var(--accent) 92%, transparent)"
              : "color-mix(in oklab, var(--accent) 0%, transparent)",
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
        <AnimatePresence>
          {label ? (
            <motion.span
              key={label}
              className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 font-mono text-[0.68rem] font-medium uppercase tracking-wider text-accent-fg"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.div
          className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          animate={{ opacity: visible && !label ? 1 : 0, scale: mode === "hover" ? 0.5 : 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </div>
  );
}
