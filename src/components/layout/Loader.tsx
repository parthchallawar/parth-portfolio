"use client";

import { useEffect, useRef } from "react";
import { INTRO_EVENT, INTRO_KEY } from "@/lib/intro";

/**
 * First-visit loader (≤ 1.2s): mono counter 0→100 with the PC mark, then a curtain wipe.
 * Visibility is controlled by `html.loading`, which an inline script sets before paint only
 * when this session hasn't seen it and reduced motion is off — so there is no flash and no
 * hydration mismatch.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("loading")) return;
    const el = root.current;
    if (!el) return;

    let raf = 0;
    let wipe: Animation | undefined;
    const COUNT_MS = 760;
    const WIPE_MS = 420;
    const start = performance.now();

    let announced = false;
    let finished = false;
    const announce = () => {
      if (announced) return;
      announced = true;
      html.dataset.intro = "done";
      window.dispatchEvent(new Event(INTRO_EVENT));
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(failsafe);
      announce();
      html.classList.remove("loading");
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {}
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      const n = Math.round(eased * 100);
      if (count.current) count.current.textContent = String(n).padStart(3, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${eased})`;
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        wipe = el.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], {
          duration: WIPE_MS,
          easing: "cubic-bezier(0.7, 0, 0.2, 1)",
          fill: "forwards",
        });
        // Start the hero reveal while the curtain is still lifting.
        window.setTimeout(announce, WIPE_MS * 0.35);
        wipe.onfinish = finish;
      }
    };
    // Safety net: never block the page for long.
    const failsafe = window.setTimeout(() => finish(), 2500);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      wipe?.cancel();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <div
      ref={root}
      className="loader fixed inset-0 z-[200] flex-col items-center justify-center bg-bg will-change-transform"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-6">
        <span className="grid size-16 place-items-center rounded-full border border-line-strong font-mono text-sm tracking-tight text-fg">
          PC
        </span>
        <div className="flex w-44 flex-col gap-2.5">
          <div className="flex items-baseline justify-between font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted">
            <span>verifying signal</span>
            <span className="text-fg tabular-nums">
              <span ref={count}>000</span>
            </span>
          </div>
          <span className="block h-px w-full bg-line">
            <span ref={bar} className="block h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
          </span>
        </div>
      </div>
    </div>
  );
}
