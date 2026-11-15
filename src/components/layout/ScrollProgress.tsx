"use client";

import { useRef } from "react";
import { useScrollListener } from "@/components/providers/SmoothScroll";

/** 2px accent bar; scaleX follows Lenis progress (native scroll under reduced motion). */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useScrollListener(({ progress }) => {
    if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  });
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5">
      <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
