"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type GateState = { capable: boolean; mounted: boolean; active: boolean };

/**
 * Decides whether a WebGL canvas may exist at all, and whether it should be rendering.
 * - Skipped under reduced motion or on low-end devices (hardwareConcurrency ≤ 4): `fallback` renders.
 * - Mounts only once the container first comes near the viewport.
 * - `active` is false while off-screen or while the tab is hidden → pass to `frameloop`.
 */
export function CanvasGate({
  children,
  fallback,
  className,
  rootMargin = "200px",
  minWidth,
}: {
  children: (active: boolean) => ReactNode;
  fallback: ReactNode;
  className?: string;
  rootMargin?: string;
  /** Below this viewport width the fallback is used. */
  minWidth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<GateState>({ capable: false, mounted: false, active: false });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = minWidth ? window.matchMedia(`(max-width: ${minWidth - 0.02}px)`) : null;
    const cores = navigator.hardwareConcurrency ?? 8;
    const hasWebGL = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    })();
    const evaluate = () =>
      setState((s) => ({ ...s, capable: !reduce.matches && cores > 4 && hasWebGL && !(narrow?.matches ?? false) }));
    evaluate();
    reduce.addEventListener("change", evaluate);
    narrow?.addEventListener("change", evaluate);
    return () => {
      reduce.removeEventListener("change", evaluate);
      narrow?.removeEventListener("change", evaluate);
    };
  }, [minWidth]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !state.capable) return;
    let inView = false;
    const update = () =>
      setState((s) => {
        const active = inView && document.visibilityState === "visible";
        return { ...s, mounted: s.mounted || inView, active };
      });
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting);
        update();
      },
      { rootMargin },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [state.capable, rootMargin]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {state.capable && state.mounted ? children(state.active) : fallback}
    </div>
  );
}
