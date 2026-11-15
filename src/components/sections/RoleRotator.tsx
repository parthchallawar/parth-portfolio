"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { EASE_SIGNAL } from "@/lib/motion";

/** Cycles through role lines. Screen readers get the full list once, not the rotation. */
export function RoleRotator({ roles, className }: { roles: readonly string[]; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % roles.length), 2800);
    return () => window.clearInterval(id);
  }, [roles.length]);

  return (
    <span className={className}>
      <span className="sr-only">{roles.join(" · ")}</span>
      <span aria-hidden="true" className="relative inline-grid overflow-hidden align-bottom">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={roles[i]}
            className="col-start-1 row-start-1 whitespace-nowrap"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_SIGNAL }}
          >
            {roles[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
