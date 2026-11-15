export type Experience = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  summary: string;
  stack: string[];
  /** Skill ids (src/content/skills.ts) used here — drives "production" evidence. */
  skills: string[];
  metrics: { value: string; label: string }[];
  bullets: string[];
};

export const experience: Experience[] = [
  {
    id: "tastify",
    company: "Tastify",
    role: "Founding Software Engineer",
    start: "May 2026",
    end: "Present",
    location: "Pune",
    summary: "Multi-tenant restaurant ordering SaaS.",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Node.js", "Vercel", "Cloudflare"],
    skills: ["nextjs", "react", "typescript", "sql", "postgresql", "supabase", "nodejs", "vercel", "cloudflare"],
    metrics: [
      { value: "3", label: "restaurants" },
      { value: "500+", label: "orders" },
      { value: "99%", label: "< 2s" },
    ],
    bullets: [
      "Shipped a multi-tenant ordering SaaS now live with 3 restaurant partners and 500+ orders processed.",
      "Designed the real-time ordering flow — table sessions, carts, kitchen orders and billing — on PostgreSQL Row-Level Security for tenant isolation; concurrency-safe session handling eliminated duplicate and stale orders across 200+ concurrent sessions.",
      "Built a Node.js print bridge from a PostgreSQL job queue to thermal printers for KOT and bill printing; auto-retries deliver 99% of tickets in under 2 seconds.",
    ],
  },
];
