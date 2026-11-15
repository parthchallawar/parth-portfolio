"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks the pointer in a ref (no re-renders). Values are viewport pixels and
 * normalised device coords (-1..1). `active` is false until the first move.
 */
export function useMousePosition() {
  const pos = useRef({ x: 0, y: 0, nx: 0, ny: 0, active: false });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const p = pos.current;
      p.x = e.clientX;
      p.y = e.clientY;
      p.nx = (e.clientX / window.innerWidth) * 2 - 1;
      p.ny = -((e.clientY / window.innerHeight) * 2 - 1);
      p.active = true;
    };
    const onLeave = () => {
      pos.current.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return pos;
}
