import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

/** Resolved at build time: drop a file at public/profile.jpg and the hero uses it. */
function hasProfilePhoto() {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "profile.jpg"));
  } catch {
    return false;
  }
}

const TICKS = Array.from({ length: 72 }, (_, i) => i);

export function Portrait({ size = 320, className }: { size?: number; className?: string }) {
  const photo = hasProfilePhoto();
  return (
    <div
      className={cn("relative isolate shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden={photo ? undefined : true}
    >
      {/* glow */}
      <div
        className="absolute inset-[12%] -z-10 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)" }}
      />
      {/* orbiting ticks */}
      <svg viewBox="0 0 200 200" className="spin-slower absolute inset-0 size-full" aria-hidden="true">
        {TICKS.map((i) => {
          const long = i % 6 === 0;
          return (
            <line
              key={i}
              x1="100"
              y1="2"
              x2="100"
              y2={long ? 9 : 5.5}
              transform={`rotate(${i * 5} 100 100)`}
              className={i === 0 ? "stroke-accent" : "stroke-line-strong"}
              strokeWidth={i === 0 ? 1.6 : 0.8}
            />
          );
        })}
      </svg>
      {/* rotating conic border */}
      <div className="absolute inset-[9%] rounded-full p-px">
        <div
          className="spin-slow absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, var(--accent) 50deg, transparent 120deg, color-mix(in oklab, var(--glow) 60%, transparent) 220deg, transparent 300deg)",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
          }}
        />
        <div className="absolute inset-[1.5px] overflow-hidden rounded-full border border-line bg-surface">
          {photo ? (
            <Image
              src="/profile.jpg"
              alt={`Portrait of ${profile.name}`}
              fill
              sizes={`${size}px`}
              priority
              className="object-cover"
            />
          ) : (
            <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_50%_35%,color-mix(in_oklab,var(--fg)_6%,transparent),transparent_65%)]">
              <span
                className="font-serif italic leading-none tracking-[-0.04em] text-fg"
                style={{
                  fontSize: size * 0.3,
                  textShadow: "0 0 40px color-mix(in oklab, var(--accent) 45%, transparent)",
                }}
              >
                {profile.initials}
              </span>
            </div>
          )}
        </div>
      </div>
      {size >= 200 ? (
        <span className="label-mono absolute bottom-[3%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-bg px-2.5 py-1.5 text-muted">
          <span className="text-accent">●</span> {profile.location}
        </span>
      ) : null}
    </div>
  );
}
