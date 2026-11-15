import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { WritingEntry } from "@/content/writing";
import { Badge } from "@/components/primitives/Badge";
import { RevealGroup, RevealItem } from "@/components/primitives/Reveal";

/** Rows: hover reveals an arrow and shifts the title. Shared by the home section and /writing. */
export function WritingList({ entries }: { entries: WritingEntry[] }) {
  return (
    <RevealGroup as="ul" className="border-t border-line">
      {entries.map((w) => (
        <RevealItem as="li" key={w.slug} className="border-b border-line">
          <Link
            href={`/writing/${w.slug}`}
            className="group grid gap-3 py-7 outline-offset-4 sm:grid-cols-[9rem_1fr_auto] sm:items-baseline sm:gap-8 sm:py-8"
          >
            <span className="flex items-center gap-2">
              <Badge tone={w.kind === "paper" ? "accent" : "default"}>{w.kind === "paper" ? "Paper" : "Note"}</Badge>
              {w.draft ? <Badge tone="outline">Draft</Badge> : null}
            </span>
            <span className="min-w-0">
              <span className="block text-[clamp(1.15rem,2vw,1.5rem)] font-medium leading-snug tracking-[-0.025em] text-balance transition-transform duration-500 ease-[var(--ease-signal)] group-hover:translate-x-2 group-focus-visible:translate-x-2">
                {w.title}
              </span>
              <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-muted">{w.abstract}</span>
            </span>
            <span className="flex items-center gap-3 sm:justify-end">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-muted">{w.field}</span>
              <span className="grid size-9 place-items-center rounded-full border border-line opacity-0 transition-all duration-500 ease-[var(--ease-signal)] group-hover:border-accent group-hover:text-accent group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:opacity-100">
                <ArrowRight className="size-4 -translate-x-1 transition-transform duration-500 group-hover:translate-x-0" aria-hidden="true" />
              </span>
            </span>
          </Link>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
