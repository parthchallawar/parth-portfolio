"use client";

import { animate } from "motion/react";
import { useEffect, useRef } from "react";

function fmt(n: number, decimals: number, prefix: string, suffix: string) {
  return `${prefix}${n.toFixed(decimals)}${suffix}`;
}

/**
 * Counts up once when scrolled into view. Server HTML contains the final value
 * (good for SEO / no-JS); it is reset to zero only if it starts off-screen.
 */
export function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const format = (n: number) => fmt(n, decimals, prefix, suffix);
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;
    if (visible) return;

    el.textContent = format(0);
    let controls: ReturnType<typeof animate> | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        controls = animate(0, value, {
          duration,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (v) => {
            el.textContent = format(v);
          },
        });
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      controls?.stop();
      el.textContent = format(value);
    };
  }, [value, decimals, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {fmt(value, decimals, prefix, suffix)}
    </span>
  );
}
