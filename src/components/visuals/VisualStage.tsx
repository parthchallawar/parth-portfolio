"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Hosts a SMIL-animated SVG. Animations start from t=0 the first time the visual is seen,
 * pause while off-screen or when the tab is hidden, and under reduced motion freeze on
 * a representative frame (`freezeAt`, seconds).
 */
export function VisualStage({
  viewBox,
  label,
  freezeAt,
  children,
  className,
}: {
  viewBox: string;
  label: string;
  freezeAt: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || typeof svg.pauseAnimations !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    let started = false;
    let inView = false;

    const sync = () => {
      if (mq.matches) {
        svg.pauseAnimations();
        svg.setCurrentTime(freezeAt);
        return;
      }
      if (inView && document.visibilityState === "visible") {
        if (!started) {
          started = true;
          svg.setCurrentTime(0);
        }
        svg.unpauseAnimations();
      } else {
        svg.pauseAnimations();
      }
    };

    svg.pauseAnimations();
    sync();
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting);
        sync();
      },
      { threshold: 0.2 },
    );
    io.observe(svg);
    document.addEventListener("visibilitychange", sync);
    mq.addEventListener("change", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      mq.removeEventListener("change", sync);
    };
  }, [freezeAt]);

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      role="img"
      aria-label={label}
      className={cn("block h-auto w-full select-none font-mono", className)}
    >
      {children}
    </svg>
  );
}
