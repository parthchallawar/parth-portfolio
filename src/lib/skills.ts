import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import {
  evidenceLevels,
  skillCategories,
  skills,
  type EvidenceLevel,
  type Skill,
  type SkillCategoryId,
} from "@/content/skills";

export type SkillWithEvidence = Skill & {
  level: EvidenceLevel;
  rank: 1 | 2 | 3;
  /** Human-readable places this skill was used. */
  usedIn: string[];
};

type Source = { id: string; name: string; skills: string[]; production: boolean };

const sources: Source[] = [
  ...experience.map((e) => ({ id: e.id, name: e.company, skills: e.skills, production: true })),
  // Tastify also exists as a project card; its evidence is already counted via experience.
  ...projects
    .filter((p) => !experience.some((e) => e.id === p.slug))
    .map((p) => ({ id: p.slug, name: p.title, skills: p.skills, production: false })),
];

export function getSkillsWithEvidence(): SkillWithEvidence[] {
  return skills.map((s) => {
    const used = sources.filter((src) => src.skills.includes(s.id));
    const level: EvidenceLevel = used.some((u) => u.production)
      ? "production"
      : used.length > 0
        ? "shipped"
        : "foundation";
    return { ...s, level, rank: evidenceLevels[level].rank, usedIn: used.map((u) => u.name) };
  });
}

/** Radar: per category, share of experience+projects using it, and share of its skills proven in shipped work. */
export function getRadarData() {
  const total = sources.length;
  const withEvidence = getSkillsWithEvidence();
  return skillCategories.map((c) => {
    const catSkills = skills.filter((s) => s.category === c.id).map((s) => s.id);
    const using = sources.filter((src) => src.skills.some((id) => catSkills.includes(id))).length;
    const proven = withEvidence.filter((s) => s.category === c.id && s.level !== "foundation").length;
    return {
      id: c.id,
      label: c.label,
      short: c.short,
      usage: total ? using / total : 0,
      usingCount: using,
      total,
      proven: catSkills.length ? proven / catSkills.length : 0,
      provenCount: proven,
      skillCount: catSkills.length,
    };
  });
}

/* --------------------------------------------------------------------------
   Constellation layout — deterministic so 3D scene and static SVG agree.
--------------------------------------------------------------------------- */
export type ConstellationNode = {
  id: string;
  name: string;
  category: SkillCategoryId;
  level: EvidenceLevel;
  x: number;
  y: number;
  z: number;
};

export type ConstellationEdge = { a: string; b: string; weight: number };

export function getConstellation() {
  const withEvidence = getSkillsWithEvidence();
  const nodes: ConstellationNode[] = [];
  const n = skillCategories.length;

  skillCategories.forEach((cat, ci) => {
    const theta = (ci / n) * Math.PI * 2 - Math.PI / 2;
    const cx = Math.cos(theta) * 2.3;
    const cy = Math.sin(theta) * 1.45;
    const cz = Math.sin(theta * 2) * 0.5;
    const members = withEvidence.filter((s) => s.category === cat.id);
    members.forEach((s, i) => {
      const a = i * 2.39996 + ci;
      const r = 0.22 + 0.2 * Math.sqrt(i);
      nodes.push({
        id: s.id,
        name: s.name,
        category: s.category,
        level: s.level,
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r * 0.85,
        z: cz + (((i % 3) - 1) * 0.3),
      });
    });
  });

  const edgeMap = new Map<string, ConstellationEdge>();
  for (const src of sources) {
    const ids = src.skills.filter((id) => nodes.some((nd) => nd.id === id));
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const [a, b] = [ids[i], ids[j]].sort();
        const key = `${a}|${b}`;
        const existing = edgeMap.get(key);
        if (existing) existing.weight += 1;
        else edgeMap.set(key, { a, b, weight: 1 });
      }
    }
  }

  const clusterCenters = skillCategories.map((cat, ci) => {
    const theta = (ci / n) * Math.PI * 2 - Math.PI / 2;
    return {
      id: cat.id,
      label: cat.label,
      x: Math.cos(theta) * 2.3,
      y: Math.sin(theta) * 1.45,
      z: Math.sin(theta * 2) * 0.5,
    };
  });

  return { nodes, edges: [...edgeMap.values()], clusterCenters };
}
