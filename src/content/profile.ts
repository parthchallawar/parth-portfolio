export type SocialKey = "github" | "linkedin" | "leetcode";

export type Social = {
  key: SocialKey;
  label: string;
  handle: string;
  href: string;
};

export type Stat = {
  id: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  /** Where the number comes from — printed under every counter. */
  source: string;
};

export type TimelineStop = {
  id: string;
  /** Only stops with a date on the résumé get one. Others show `marker`. */
  date?: string;
  marker: string;
  title: string;
  detail: string;
};

export const profile = {
  name: "Parth Challawar",
  fullName: "Parth Ravindra Challawar",
  initials: "PC",
  title: "Founding Software Engineer",
  location: "Pune, India",
  email: "parthchallawar04@gmail.com",
  status: "available for 2027 roles",
  /** `*word*` renders in Instrument Serif italic. */
  headline: "Founding engineer building *concurrency-safe* backends and AI you can *verify*.",
  /** Short proof points under the hero CTAs. */
  proofPoints: ["3 restaurants live", "500+ orders processed", "Redis distributed locks", "Verified citations"],
  roles: [
    "Founding Software Engineer @ Tastify",
    "Backend & Distributed Systems",
    "RAG & Agentic AI",
  ],
  /** `*phrase*` is a key phrase highlighted as it scrolls into view. */
  summary:
    "Final-year B.Tech CSE (AI & ML) student at VIT Pune and *founding engineer at Tastify*, a restaurant-ordering SaaS live with three partners. I build *backends that stay correct under concurrent load* and *AI systems that show their sources* — RAG pipelines with verified citations, hallucination checks and human-in-the-loop review. 300+ LeetCode problems, two published research papers, at home in Linux and Docker.",
  metaDescription:
    "Parth Challawar — founding software engineer at Tastify (3 restaurants live, 500+ orders). Concurrency-safe backends with PostgreSQL RLS, Redis locks and job queues, and RAG systems with verified citations.",
  resume: "/resume.pdf",
  socials: [
    {
      key: "github",
      label: "GitHub",
      handle: "parthchallawar",
      href: "https://github.com/parthchallawar",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      handle: "parth-challawar",
      href: "https://www.linkedin.com/in/parth-challawar-b10107331",
    },
    {
      key: "leetcode",
      label: "LeetCode",
      handle: "parthc31",
      href: "https://leetcode.com/u/parthc31",
    },
  ] satisfies Social[],
  githubUser: "parthchallawar",
} as const;

export const stats: Stat[] = [
  { id: "cgpa", value: 9.04, decimals: 2, label: "CGPA", source: "VIT Pune · B.Tech" },
  { id: "leetcode", value: 300, suffix: "+", label: "LeetCode solved", source: "leetcode.com/u/parthc31" },
  { id: "orders", value: 500, suffix: "+", label: "Orders processed", source: "Tastify · production" },
  { id: "restaurants", value: 3, label: "Restaurants live", source: "Tastify · partners" },
  { id: "papers", value: 2, label: "Research papers", source: "Published" },
  { id: "print", value: 99, suffix: "%", label: "Print delivery < 2s", source: "Tastify print bridge" },
];

export const aboutTimeline: TimelineStop[] = [
  {
    id: "vit",
    marker: "B.Tech",
    title: "Joined VIT Pune",
    detail:
      "Started B.Tech in Computer Science & Engineering (AI & ML) at Vishwakarma Institute of Technology, Pune.",
  },
  {
    id: "papers",
    marker: "Research",
    title: "Two papers published",
    detail:
      "Sewer pipeline defect detection with temporal event consolidation (computer vision), and ContractAI (hybrid RAG).",
  },
  {
    id: "tastify",
    date: "May 2026",
    marker: "Tastify",
    title: "Founding engineer at Tastify",
    detail:
      "Joined Tastify as founding software engineer and shipped its multi-tenant ordering SaaS — now live with 3 restaurant partners and 500+ orders processed.",
  },
  {
    id: "grad",
    date: "May 2027",
    marker: "Graduation",
    title: "Graduating",
    detail: "B.Tech CSE (AI & ML) expected May 2027, currently at a 9.04/10 CGPA. Available for 2027 roles.",
  },
];
