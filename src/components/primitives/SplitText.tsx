"use client";

import { useEffect, useLayoutEffect, useRef, type ElementType } from "react";
import { parseEmphasis } from "@/lib/text";
import { getGsap } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { cn } from "@/lib/cn";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Masked line reveal (own implementation — no GSAP SplitText plugin).
 * Words are wrapped in overflow-hidden masks; after layout, words are grouped into
 * visual lines by offsetTop and each line rises in turn. `*emphasised*` words render in
 * Instrument Serif italic and land last.
 */
export function SplitText({
  text,
  as: Tag = "h1",
  className,
  id,
  trigger = "mount",
  delay = 0.1,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  trigger?: "mount" | "inview";
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const segments = parseEmphasis(text);
  const plain = segments.map((s) => s.text).join("");

  // Keep track of whether a word was preceded by whitespace, so punctuation that follows an
  // emphasised word ("verify.") stays attached instead of gaining a space.
  const words: { word: string; em: boolean; space: boolean }[] = [];
  let pendingSpace = false;
  for (const seg of segments) {
    for (const tok of seg.text.split(/(\s+)/)) {
      if (!tok) continue;
      if (/^\s+$/.test(tok)) {
        pendingSpace = true;
        continue;
      }
      words.push({ word: tok, em: seg.em, space: pendingSpace && words.length > 0 });
      pendingSpace = false;
    }
  }

  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      root.setAttribute("data-split-ready", "");
      return;
    }
    const { gsap, ScrollTrigger } = getGsap();
    const inners = Array.from(root.querySelectorAll<HTMLElement>("[data-split-inner]"));
    gsap.set(inners, { yPercent: 110 });
    root.setAttribute("data-split-ready", "");

    // Group into lines by their mask's offsetTop.
    const lines: HTMLElement[][] = [];
    let lastTop = Number.NaN;
    for (const el of inners) {
      const top = (el.parentElement as HTMLElement).offsetTop;
      if (lines.length === 0 || Math.abs(top - lastTop) > 4) {
        lines.push([]);
        lastTop = top;
      }
      lines[lines.length - 1].push(el);
    }

    const tl = gsap.timeline({ paused: true, delay });
    lines.forEach((line, i) => {
      const plainWords = line.filter((el) => !el.dataset.em);
      if (plainWords.length)
        tl.to(plainWords, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.04 }, i * 0.09);
    });
    const ems = inners.filter((el) => el.dataset.em);
    if (ems.length)
      tl.to(ems, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.12 }, lines.length * 0.09 + 0.25);
    tl.eventCallback("onComplete", () => gsap.set(inners, { clearProps: "transform" }));

    let st: ScrollTrigger | undefined;
    let cancelIntro = () => {};
    if (trigger === "inview") {
      st = ScrollTrigger.create({ trigger: root, start: "top 85%", once: true, onEnter: () => tl.play() });
    } else {
      cancelIntro = onIntroDone(() => tl.play());
    }
    return () => {
      cancelIntro();
      st?.kill();
      tl.kill();
    };
  }, [text, trigger, delay]);

  return (
    <Tag ref={ref} id={id} className={className} data-split="">
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            {w.space ? " " : null}
            <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-top">
              <span
                data-split-inner=""
                data-em={w.em ? "1" : undefined}
                className={cn(
                  "inline-block will-change-transform",
                  w.em && "pr-[0.06em] font-serif font-normal italic tracking-[-0.02em]",
                )}
              >
                {w.word}
              </span>
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
