"use client";

import { useMediaQuery } from "./useMediaQuery";

/** True when the user prefers reduced motion. `false` during SSR/hydration. */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
