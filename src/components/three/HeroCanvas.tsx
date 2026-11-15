"use client";

import dynamic from "next/dynamic";
import { CanvasGate } from "./CanvasGate";

const HeroField = dynamic(() => import("./HeroField"), { ssr: false });

function Fallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(60% 50% at 70% 40%, color-mix(in oklab, var(--glow) 9%, transparent), transparent 70%), radial-gradient(40% 40% at 20% 70%, color-mix(in oklab, var(--accent) 6%, transparent), transparent 70%)",
      }}
    />
  );
}

export function HeroCanvas() {
  return (
    <CanvasGate className="absolute inset-0" fallback={<Fallback />} rootMargin="0px">
      {(active) => (
        <div aria-hidden="true" className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_85%)]">
          <HeroField active={active} />
        </div>
      )}
    </CanvasGate>
  );
}
