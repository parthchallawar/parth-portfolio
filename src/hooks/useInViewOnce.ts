"use client";

import { useEffect, useState, type RefObject } from "react";

/** Becomes true the first time the element intersects, then stays true. */
export function useInViewOnce<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = "0px 0px -10% 0px", threshold = 0 }: { rootMargin?: string; threshold?: number } = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold, inView]);
  return inView;
}

/** Live in-view state (true while intersecting). */
export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = "0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setInView(entries[0]?.isIntersecting ?? false), {
      rootMargin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
