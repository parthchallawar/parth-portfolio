export type ProjectVisual = "lock-race" | "agent-graph" | "citation-check" | "tenant-flow";

export type Project = {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  /** One-line impact shown on the card. */
  impact: string;
  stack: string[];
  /** Skill ids (src/content/skills.ts) — drives "shipped" evidence and constellation edges. */
  skills: string[];
  visual: ProjectVisual;
  /** Telemetry chips. Only facts from the résumé. */
  metrics: { value: string; label: string }[];
  problem: string;
  approach: string[];
  results: string[];
  /** Optional links: buttons render only when present. */
  repo?: string;
  demo?: string;
  image?: string;
  /** Internal link to a related section (e.g. Tastify → experience). */
  related?: { label: string; href: string };
  note?: string;
};

export const projects: Project[] = [
  {
    slug: "wanderlust",
    index: "01",
    title: "Wanderlust",
    tagline: "Distributed vacation rental platform",
    impact: "Redis distributed locks eliminate double-booking across load-balanced instances.",
    stack: ["Node.js", "REST", "Redis", "MongoDB", "Cassandra", "Socket.IO", "BullMQ", "Docker"],
    skills: ["nodejs", "javascript", "rest", "redis", "mongodb", "cassandra", "docker"],
    visual: "lock-race",
    metrics: [
      { value: "0", label: "double-bookings" },
      { value: "10k+", label: "users · design target" },
      { value: "< 20ms", label: "latency · design target" },
    ],
    problem:
      "A rental platform behind a load balancer runs many instances at once. When two guests try to book the same dates at the same moment, each instance can check availability, see the slot free, and confirm it — and the same stay gets sold twice.",
    approach: [
      "Redis distributed locking around every booking, so exactly one instance can commit a given slot while others are turned away.",
      "Cache-aside reads and rate limiting to keep hot paths fast under load.",
      "Real-time chat over Socket.IO with Redis Pub/Sub, so a message reaches users connected to any instance.",
      "Asynchronous notifications through a BullMQ job queue.",
      "An append-only Cassandra store for chat messages.",
    ],
    results: [
      "Double-booking eliminated across load-balanced instances.",
      "Designed for 10k+ concurrent users at sub-20ms latency.",
      "Chat and notifications kept off the request path.",
    ],
  },
  {
    slug: "legal-ai-judge",
    index: "02",
    title: "Legal AI Judge",
    tagline: "Online dispute resolution",
    impact: "An agentic LangGraph workflow that pauses for a human and cites its evidence.",
    stack: ["LangGraph", "Gemini", "RAG", "Prisma", "SQLite"],
    skills: ["langgraph", "rag", "llm", "genai"],
    visual: "agent-graph",
    metrics: [
      { value: "HITL", label: "restart-safe" },
      { value: "Co-judge", label: "review loop" },
      { value: "Cited", label: "evidence" },
    ],
    problem:
      "A dispute can't be settled by a single unchecked model call. Decisions need evidence behind them, a second reviewer, a person who can step in — and a check that the outcome isn't biased.",
    approach: [
      "An agentic graph with routing, mediation, evidence-check, judge and bias-audit nodes.",
      "A judge / co-judge review loop before any decision leaves the graph.",
      "Human-in-the-loop mediation built on LangGraph checkpoints, so a paused case survives server restarts.",
      "Corrective RAG with Gemini embeddings over PDF and image evidence, returning verified citations.",
    ],
    results: [
      "Paused mediations resume where they left off, even after a server restart.",
      "Every decision passes a judge / co-judge review and a bias audit.",
      "Answers carry verified citations back to the submitted evidence.",
    ],
    repo: "https://github.com/parthchallawar/Legal-AI-Judge-Despute-resolver-",
  },
  {
    slug: "contract-ai",
    index: "03",
    title: "ContractAI",
    tagline: "Contract analysis platform",
    impact: "Hybrid RAG that checks every quoted clause and figure against the source.",
    stack: ["Hybrid RAG", "BM25", "MiniLM", "Reciprocal Rank Fusion", "Prisma"],
    skills: ["rag", "llm", "genai"],
    visual: "citation-check",
    metrics: [
      { value: "4", label: "role views" },
      { value: "100%", label: "quotes checked" },
      { value: "1", label: "research paper" },
    ],
    problem:
      "A contract answer is only useful if it is exactly right. A model that misquotes a clause or invents a monetary figure is worse than no answer at all.",
    approach: [
      "Hybrid retrieval: BM25 keyword search plus MiniLM embeddings, merged with Reciprocal Rank Fusion.",
      "Role-based analysis for Investor, Legal, PM and Partner perspectives.",
      "Hallucination checks that verify every quoted clause and monetary figure against the source document.",
      "A streaming chatbot with memory, clickable citations and LLM-provider fallback.",
    ],
    results: [
      "Every quoted clause and monetary figure is checked against the source before it is shown.",
      "Four role-based analysis views over the same contract.",
      "Published as a research paper.",
    ],
    repo: "https://github.com/parthchallawar/contract_AI",
  },
  {
    slug: "tastify",
    index: "04",
    title: "Tastify",
    tagline: "Multi-tenant restaurant ordering SaaS",
    impact: "In production with 3 restaurant partners and 500+ orders processed.",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Node.js", "Vercel", "Cloudflare"],
    skills: ["nextjs", "react", "typescript", "sql", "postgresql", "supabase", "nodejs", "vercel", "cloudflare"],
    visual: "tenant-flow",
    metrics: [
      { value: "3", label: "restaurants live" },
      { value: "500+", label: "orders" },
      { value: "99%", label: "tickets < 2s" },
    ],
    problem:
      "Several restaurants share one platform, but their data must never mix. And in a busy dining room many table sessions order at once — without careful session handling, duplicate or stale orders reach the kitchen.",
    approach: [
      "A real-time ordering flow — table sessions, carts, kitchen orders and billing — built on PostgreSQL Row-Level Security for tenant isolation.",
      "Concurrency-safe session handling so each table's order is written once, from current state.",
      "A Node.js print bridge that takes jobs from a PostgreSQL queue and prints KOTs and bills on thermal printers, with automatic retries.",
    ],
    results: [
      "Live with 3 restaurant partners and 500+ orders processed.",
      "Duplicate and stale orders eliminated across 200+ concurrent sessions.",
      "99% of tickets printed in under 2 seconds.",
    ],
    related: { label: "See the role", href: "/#experience" },
    note: "Production codebase — no public repository.",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
