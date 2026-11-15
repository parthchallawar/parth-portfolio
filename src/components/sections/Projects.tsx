import { projects } from "@/content/projects";
import { Section, SectionHeader } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeader section="projects" />
      <ul className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {projects.map((p, i) => (
          <li key={p.slug} className="h-full">
            <Reveal delay={(i % 2) * 0.08} className="h-full">
              <ProjectCard project={p} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
