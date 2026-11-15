import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/** Glass surface: backdrop blur, 1px gradient border, faint inner highlight. Use sparingly. */
export function GlassCard({ className, ...rest }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("glass gradient-border rounded-3xl", className)} {...rest} />;
}

/** Plain raised surface — the default card everywhere glass isn't used. */
export function Surface({ className, ...rest }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("rounded-2xl border border-line bg-surface", className)} {...rest} />;
}
