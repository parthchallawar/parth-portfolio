import { aboutTimeline, profile, stats } from "@/content/profile";
import { Section, SectionHeader } from "@/components/primitives/Section";
import { Counter } from "@/components/primitives/Counter";
import { RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import { ScrollHighlightText } from "./ScrollHighlightText";
import { AboutTimeline } from "./AboutTimeline";

export function About() {
  return (
    <Section id="about">
      <SectionHeader section="about" />
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <ScrollHighlightText
            text={profile.summary}
            className="text-[clamp(1.25rem,2.3vw,1.9rem)] leading-[1.38] tracking-[-0.02em] text-fg"
          />
        </div>
        <RevealGroup as="ul" className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-2xl border border-line bg-line lg:col-span-5">
          {stats.map((s) => (
            <RevealItem as="li" key={s.id} className="flex flex-col justify-between gap-6 bg-surface p-5 sm:p-6">
              <span className="text-[clamp(2rem,4vw,2.75rem)] font-medium leading-none tracking-[-0.04em]">
                <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="text-sm text-fg">{s.label}</span>
                <span className="font-mono text-[0.6875rem] text-muted">
                  <span className="text-accent" aria-hidden="true">
                    ↳{" "}
                  </span>
                  <span className="sr-only">Source: </span>
                  {s.source}
                </span>
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
      <AboutTimeline stops={aboutTimeline} />
    </Section>
  );
}
