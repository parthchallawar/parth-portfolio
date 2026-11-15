import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { Section, SectionHeader } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { ExperienceCard } from "./ExperienceCard";
import { ScrollLine } from "./ScrollLine";

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeader section="experience" />
      <div className="relative pl-8 sm:pl-14">
        <ScrollLine className="left-[7px] sm:left-[11px]" />
        <ol className="relative">
          {experience.map((item) => (
            <li key={item.id} className="relative pb-4">
              <span
                aria-hidden="true"
                className="absolute -left-8 top-9 grid size-[15px] place-items-center rounded-full border border-accent bg-bg sm:-left-14 sm:top-10 sm:size-[23px]"
              >
                <span className="size-[5px] rounded-full bg-accent sm:size-[7px]" />
              </span>
              <Reveal>
                <ExperienceCard item={item} />
              </Reveal>
            </li>
          ))}
          <li className="relative pt-6">
            <span
              aria-hidden="true"
              className="absolute -left-8 top-6 size-[15px] rounded-full border border-dashed border-line-strong bg-bg sm:-left-14 sm:size-[23px]"
            />
            <p className="label-mono pt-1.5 text-muted">Next · {profile.status}</p>
          </li>
        </ol>
      </div>
    </Section>
  );
}
