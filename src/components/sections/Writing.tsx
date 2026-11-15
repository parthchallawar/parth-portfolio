import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { writing } from "@/content/writing";
import { Section, SectionHeader } from "@/components/primitives/Section";
import { WritingList } from "./WritingList";

export function Writing() {
  const latest = writing.slice(0, 3);
  return (
    <Section id="writing">
      <SectionHeader section="writing" />
      <WritingList entries={latest} />
      <div className="mt-10 flex justify-end">
        <Link
          href="/writing"
          className="group inline-flex items-center gap-2 text-sm text-fg transition-colors hover:text-accent"
        >
          All research & notes
          <span className="font-mono text-xs text-muted">({writing.length})</span>
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}
