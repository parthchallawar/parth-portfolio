export type SkillCategoryId = "languages" | "core" | "backend" | "frontend" | "cloud" | "ai";

export type SkillCategory = {
  id: SkillCategoryId;
  label: string;
  short: string;
};

export type Skill = {
  id: string;
  name: string;
  category: SkillCategoryId;
};

export type EvidenceLevel = "production" | "shipped" | "foundation";

export const evidenceLevels: Record<EvidenceLevel, { rank: 1 | 2 | 3; label: string; description: string }> = {
  production: { rank: 3, label: "Production", description: "Running in production at Tastify" },
  shipped: { rank: 2, label: "Shipped", description: "Used to build a shipped project" },
  foundation: { rank: 1, label: "Foundation", description: "Coursework, DSA practice and self-study" },
};

export const skillCategories: SkillCategory[] = [
  { id: "languages", label: "Languages", short: "LANG" },
  { id: "core", label: "Core CS", short: "CORE" },
  { id: "backend", label: "Backend & Data", short: "BACK" },
  { id: "frontend", label: "Frontend", short: "FRONT" },
  { id: "cloud", label: "Cloud & DevOps", short: "OPS" },
  { id: "ai", label: "AI / ML", short: "AI" },
];

/**
 * Skill list from the résumé. Evidence levels are NOT stored here — they are
 * derived from which experience/project lists the skill (see src/lib/skills.ts).
 */
export const skills: Skill[] = [
  // Languages
  { id: "java", name: "Java", category: "languages" },
  { id: "c", name: "C", category: "languages" },
  { id: "cpp", name: "C++", category: "languages" },
  { id: "python", name: "Python", category: "languages" },
  { id: "javascript", name: "JavaScript", category: "languages" },
  { id: "typescript", name: "TypeScript", category: "languages" },
  { id: "sql", name: "SQL", category: "languages" },
  // Core CS
  { id: "dsa", name: "Data Structures", category: "core" },
  { id: "algorithms", name: "Algorithms", category: "core" },
  { id: "oop", name: "OOP", category: "core" },
  { id: "dbms", name: "DBMS", category: "core" },
  { id: "os", name: "Operating Systems", category: "core" },
  // Backend & Data
  { id: "nodejs", name: "Node.js", category: "backend" },
  { id: "express", name: "Express.js", category: "backend" },
  { id: "rest", name: "REST APIs", category: "backend" },
  { id: "postgresql", name: "PostgreSQL", category: "backend" },
  { id: "supabase", name: "Supabase", category: "backend" },
  { id: "mysql", name: "MySQL", category: "backend" },
  { id: "mongodb", name: "MongoDB", category: "backend" },
  { id: "redis", name: "Redis", category: "backend" },
  { id: "cassandra", name: "Cassandra", category: "backend" },
  // Frontend
  { id: "react", name: "React.js", category: "frontend" },
  { id: "nextjs", name: "Next.js", category: "frontend" },
  // Cloud & DevOps
  { id: "vercel", name: "Vercel", category: "cloud" },
  { id: "cloudflare", name: "Cloudflare", category: "cloud" },
  { id: "linux", name: "Linux", category: "cloud" },
  { id: "docker", name: "Docker", category: "cloud" },
  { id: "git", name: "Git", category: "cloud" },
  { id: "github", name: "GitHub", category: "cloud" },
  // AI / ML
  { id: "genai", name: "Generative AI", category: "ai" },
  { id: "rag", name: "RAG", category: "ai" },
  { id: "langgraph", name: "Agentic Workflows (LangGraph)", category: "ai" },
  { id: "prompting", name: "Prompt Engineering", category: "ai" },
  { id: "llm", name: "LLM Integration", category: "ai" },
];
