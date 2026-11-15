import { GraduationCap } from "lucide-react";
import { education } from "@/content/credentials";
import { Section, SectionHeader } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { CgpaRing } from "./CgpaRing";

export function Education() {
  return (
    <Section id="education">
      <SectionHeader section="education" />
      <Reveal>
        <article className="relative overflow-hidden rounded-3xl border border-line bg-surface">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--glow) 12%, transparent), transparent 70%)" }}
          />
          <div className="relative grid items-center gap-10 p-6 sm:p-10 md:grid-cols-[1fr_auto] md:gap-16 md:p-14">
            <div>
              <span className="grid size-12 place-items-center rounded-xl border border-line bg-bg">
                <GraduationCap className="size-5" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="mt-8 text-[clamp(1.6rem,3.4vw,2.6rem)] font-medium leading-[1.05] tracking-[-0.035em] text-balance">
                {education.institution}
              </h3>
              <p className="mt-3 text-[0.95rem] text-muted">{education.degree}</p>
              <dl className="mt-10 grid max-w-md grid-cols-2 gap-6 border-t border-line pt-6">
                <div>
                  <dt className="label-mono text-muted">Location</dt>
                  <dd className="mt-2 text-sm">{education.location}</dd>
                </div>
                <div>
                  <dt className="label-mono text-muted">Expected</dt>
                  <dd className="mt-2 text-sm">{education.expected}</dd>
                </div>
              </dl>
            </div>
            <div className="justify-self-center md:justify-self-end">
              <CgpaRing value={education.cgpa} scale={education.cgpaScale} />
            </div>
          </div>
        </article>
      </Reveal>
    </Section>
  );
}
