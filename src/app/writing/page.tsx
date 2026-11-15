import type { Metadata } from "next";
import { writing } from "@/content/writing";
import { headings, sectionMeta } from "@/content/site";
import { SectionLabel } from "@/components/primitives/Section";
import { RichText } from "@/components/primitives/RichText";
import { WritingList } from "@/components/sections/WritingList";

export const metadata: Metadata = {
  title: "Research & notes",
  description: "Published research papers and short engineering notes by Parth Challawar.",
  alternates: { canonical: "/writing" },
  openGraph: { title: "Research & notes", url: "/writing" },
};

export default function WritingIndex() {
  const papers = writing.filter((w) => w.kind === "paper");
  const notes = writing.filter((w) => w.kind === "note");
  const meta = sectionMeta("writing");
  return (
    <div className="pb-24 pt-28 sm:pt-36">
      <div className="container-x">
        <SectionLabel index={meta.index}>{meta.label}</SectionLabel>
        <h1 className="mt-6 text-[clamp(2.75rem,8vw,7rem)] font-medium leading-[0.95] tracking-[-0.05em]">
          <RichText text={headings.writing.title} />
        </h1>
        {headings.writing.intro ? (
          <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted">{headings.writing.intro}</p>
        ) : null}

        <section aria-labelledby="papers" className="mt-20">
          <h2 id="papers" className="label-mono mb-6 text-muted">
            Papers <span className="text-fg">({papers.length})</span>
          </h2>
          <WritingList entries={papers} />
        </section>

        <section aria-labelledby="notes" className="mt-20">
          <h2 id="notes" className="label-mono mb-6 text-muted">
            Notes <span className="text-fg">({notes.length})</span>
          </h2>
          <WritingList entries={notes} />
        </section>
      </div>
    </div>
  );
}
