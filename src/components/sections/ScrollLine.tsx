"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/** A vertical rule that draws itself as its container scrolls through the viewport (GSAP scrub on scaleY). */
export function ScrollLine({ className }: { className?: string }) {
  const line = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = line.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "scaleY(1)";
      return;
    }
    const { gsap } = getGsap();
    const tween = gsap.fromTo(
      el,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top 70%", end: "bottom 60%", scrub: 0.5 },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);
  return (
    <div aria-hidden="true" className={cn("absolute bottom-0 top-0 w-px bg-line", className)}>
      <div ref={line} className="h-full w-full origin-top bg-accent" style={{ transform: "scaleY(0)" }} />
    </div>
  );
}
