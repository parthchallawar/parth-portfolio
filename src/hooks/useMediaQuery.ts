"use client";

import { useCallback, useSyncExternalStore } from "react";

/** SSR-safe media query. Returns `serverValue` during SSR and hydration, then the live value. */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
