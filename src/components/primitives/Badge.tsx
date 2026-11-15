import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "accent" | "outline";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[0.6875rem] leading-none tracking-wide",
        tone === "default" && "border border-line bg-surface-2 text-muted",
        tone === "accent" && "border border-accent/30 bg-accent/10 text-accent",
        tone === "outline" && "border border-line-strong text-fg",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** The small "verified" tick used across the site. */
export function Tick({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className={cn("size-3 shrink-0", className)} fill="none">
      <circle cx="6" cy="6" r="5.25" className="stroke-current" strokeWidth="1" opacity="0.5" />
      <path d="M3.6 6.1 5.3 7.7 8.5 4.4" className="stroke-current" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
