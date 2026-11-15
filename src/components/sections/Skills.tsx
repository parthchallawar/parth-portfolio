import { skillCategories } from "@/content/skills";
import { getConstellation, getRadarData, getSkillsWithEvidence } from "@/lib/skills";
import { Section, SectionHeader } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { TechRadar } from "@/components/charts/TechRadar";
import { SkillsExplorer } from "./SkillsExplorer";

export function Skills() {
  const skills = getSkillsWithEvidence();
  const { nodes, edges, clusterCenters } = getConstellation();
  const radar = getRadarData();
  return (
    <Section id="skills">
      <SectionHeader section="skills" />
      <SkillsExplorer
        categories={skillCategories}
        skills={skills}
        nodes={nodes}
        edges={edges}
        clusters={clusterCenters}
      />
      <Reveal className="mt-24 rounded-3xl border border-line bg-surface p-6 sm:p-10 md:mt-32">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-h3">Tech radar</h3>
          <span className="label-mono text-muted">computed from content</span>
        </div>
        <TechRadar axes={radar} />
      </Reveal>
    </Section>
  );
}
