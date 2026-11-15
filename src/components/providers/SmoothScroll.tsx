"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { getGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type ScrollState = {
  scroll: number;
  limit: number;
  progress: number;
  direction: 1 | -1 | 0;
};

type Listener = (s: ScrollState) => void;

type Ctx = {
  scrollTo: (target: string | number | HTMLElement, opts?: { immediate?: boolean; offset?: number }) => void;
  subscribe: (fn: Listener) => () => void;
  stop: () => void;
  start: () => void;
};

const ScrollContext = createContext<Ctx | null>(null);

export function useSmoothScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used inside <SmoothScroll>");
  return ctx;
}

/** Subscribe to scroll updates (from Lenis when active, native scroll otherwise). */
export function useScrollListener(fn: Listener) {
  const { subscribe } = useSmoothScroll();
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  });
  useEffect(() => subscribe((s) => ref.current(s)), [subscribe]);
}

/**
 * The one scroll source. Lenis drives ScrollTrigger through gsap.ticker; nothing else
 * reads raw scroll for scrubbed animation. Under reduced motion Lenis is not created.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const listeners = useRef(new Set<Listener>());
  const lastScroll = useRef(0);
  const pathname = usePathname();

  const emit = useCallback((scroll: number, limit: number) => {
    const direction: ScrollState["direction"] =
      scroll > lastScroll.current ? 1 : scroll < lastScroll.current ? -1 : 0;
    lastScroll.current = scroll;
    const state: ScrollState = { scroll, limit, progress: limit > 0 ? scroll / limit : 0, direction };
    listeners.current.forEach((l) => l(state));
  }, []);

  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();

    if (reduce) {
      const onScroll = () => {
        const limit = document.documentElement.scrollHeight - window.innerHeight;
        emit(window.scrollY, limit);
        ScrollTrigger.update();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", (l: Lenis) => {
      ScrollTrigger.update();
      emit(l.scroll, l.limit);
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (document.documentElement.classList.contains("loading")) lenis.stop();
    const onIntro = () => lenis.start();
    window.addEventListener("intro:done", onIntro);

    emit(lenis.scroll, lenis.limit);

    return () => {
      window.removeEventListener("intro:done", onIntro);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduce, emit]);

  // New route: jump to top (or to the hash target) and refresh triggers.
  useEffect(() => {
    const { ScrollTrigger } = getGsap();
    const hash = window.location.hash;
    const target = hash ? document.querySelector<HTMLElement>(hash) : null;
    if (target) {
      requestAnimationFrame(() => {
        if (lenisRef.current) lenisRef.current.scrollTo(target, { immediate: true, offset: -24 });
        else target.scrollIntoView();
      });
    } else if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  const value = useMemo<Ctx>(
    () => ({
      scrollTo: (target, opts) => {
        const el =
          typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
        if (el === null) return;
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(el, { offset: opts?.offset ?? -24, immediate: opts?.immediate });
        } else if (typeof el === "number") {
          window.scrollTo({ top: el });
        } else {
          el.scrollIntoView({ block: "start" });
        }
        if (typeof el !== "number") {
          // Move focus for keyboard and screen-reader users without a second jump.
          const focusTarget = el;
          if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
          focusTarget.focus({ preventScroll: true });
        }
      },
      subscribe: (fn) => {
        listeners.current.add(fn);
        return () => listeners.current.delete(fn);
      },
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
    }),
    [],
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}
