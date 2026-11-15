"use client";

import { useEffect, useRef } from "react";
import { parseEmphasis } from "@/lib/text";
import { getGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * Words brighten as the paragraph scrolls through the viewport (GSAP scrub on opacity);
 * `*key phrases*` also draw an accent underline as they reach the centre.
 */
export function ScrollHighlightText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const segments = parseEmphasis(text);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      const words = root.querySelectorAll<HTMLElement>("[data-w]");
      gsap.fromTo(
        words,
        { opacity: 0.18 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: "top 78%", end: "bottom 52%", scrub: 0.6 },
        },
      );
      root.querySelectorAll<HTMLElement>("[data-key]").forEach((key) => {
        gsap.fromTo(
          key,
          { "--hl": "0%" },
          {
            "--hl": "100%",
            ease: "none",
            scrollTrigger: { trigger: key, start: "top 62%", end: "bottom 46%", scrub: 0.6 },
          },
        );
      });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [text]);

  return (
    <p ref={ref} className={cn("text-pretty", className)}>
      {segments.map((seg, si) => {
        const words = seg.text.split(/(\s+)/);
        const content = words.map((w, wi) =>
          /^\s+$/.test(w) || w === "" ? (
            w
          ) : (
            <span key={wi} data-w="" className="inline">
              {w}
            </span>
          ),
        );
        return seg.em ? (
          <span
            key={si}
            data-key=""
            className="text-fg"
            style={{
              backgroundImage: "linear-gradient(var(--accent), var(--accent))",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "0 100%",
              backgroundSize: "var(--hl, 100%) 1.5px",
              paddingBottom: "0.08em",
            }}
          >
            {content}
          </span>
        ) : (
          <span key={si}>{content}</span>
        );
      })}
    </p>
  );
}
