"use client";

import { motion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { EASE_SIGNAL } from "@/lib/motion";

// The very first render (SSR + hydration) is not animated — the loader / hero own that moment.
// Subsequent client navigations get a short fade + rise.
let firstRender = true;

export default function Template({ children }: { children: ReactNode }) {
  const animate = !firstRender;
  useEffect(() => {
    firstRender = false;
  }, []);
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_SIGNAL }}
    >
      {children}
    </motion.div>
  );
}
