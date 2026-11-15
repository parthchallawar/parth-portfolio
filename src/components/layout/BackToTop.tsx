"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useRef, useState } from "react";
import { useScrollListener, useSmoothScroll } from "@/components/providers/SmoothScroll";
import { Magnetic } from "@/components/primitives/Magnetic";
import { EASE_SIGNAL } from "@/lib/motion";

const R = 21;
const C = 2 * Math.PI * R;

/** Appears after one viewport; ring shows page progress. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  const ring = useRef<SVGCircleElement>(null);
  const { scrollTo } = useSmoothScroll();

  useScrollListener(({ scroll, progress }) => {
    setShow(scroll > window.innerHeight);
    if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - Math.min(1, progress)));
  });

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed bottom-5 right-5 z-[50] sm:bottom-8 sm:right-8"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.4, ease: EASE_SIGNAL }}
        >
          <Magnetic strength={0.35}>
            <button
              type="button"
              onClick={() => {
                scrollTo(0);
                document.getElementById("main")?.focus({ preventScroll: true });
              }}
              aria-label="Back to top"
              className="group relative grid size-12 place-items-center rounded-full border border-line bg-surface/90 text-fg backdrop-blur transition-colors hover:text-accent"
            >
              <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
                <circle cx="24" cy="24" r={R} fill="none" strokeWidth="1.5" className="stroke-line" />
                <circle
                  ref={ring}
                  cx="24"
                  cy="24"
                  r={R}
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="stroke-accent"
                  strokeDasharray={C}
                  strokeDashoffset={C}
                />
              </svg>
              <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
            </button>
          </Magnetic>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
