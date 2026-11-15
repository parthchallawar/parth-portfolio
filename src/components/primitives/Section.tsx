import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { headings, sectionMeta, type SectionId } from "@/content/site";
import { RichText } from "./RichText";

export function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("relative scroll-mt-24 py-24 md:py-32 lg:py-40", className)}
    >
      <div className="container-x">{children}</div>
    </section>
  );
}

/** Numbered like a log line: `01 / ABOUT`. */
export function SectionLabel({
  index,
  children,
  className,
}: {
  index: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 text-muted", className)}>
      <span className="label-mono text-accent">{index}</span>
      <span className="label-mono" aria-hidden="true">
        /
      </span>
      <span className="label-mono">{children}</span>
      <span aria-hidden="true" className="h-px w-12 bg-line-strong sm:w-20" />
    </div>
  );
}

/** Standard section header, driven by src/content/site.ts. */
export function SectionHeader({
  section,
  className,
  aside,
}: {
  section: SectionId;
  className?: string;
  aside?: ReactNode;
}) {
  const meta = sectionMeta(section);
  const h = headings[section];
  return (
    <header className={cn("mb-14 grid gap-6 md:mb-20 lg:grid-cols-12 lg:items-end", className)}>
      <div className="lg:col-span-7">
        <SectionLabel index={meta.index}>{meta.label}</SectionLabel>
        <h2 id={`${section}-title`} className="text-h2 mt-6 text-balance">
          <RichText text={h.title} />
        </h2>
      </div>
      {h.intro || aside ? (
        <div className="max-w-md text-pretty text-[0.95rem] leading-relaxed text-muted lg:col-span-5 lg:justify-self-end">
          {h.intro ? <p>{h.intro}</p> : null}
          {aside}
        </div>
      ) : null}
    </header>
  );
}

export function Em({ children }: { children: ReactNode }) {
  return <em className="font-serif font-normal tracking-[-0.02em]">{children}</em>;
}
