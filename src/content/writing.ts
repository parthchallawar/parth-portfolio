export type WritingKind = "paper" | "note";

export type WritingEntry = {
  slug: string;
  kind: WritingKind;
  title: string;
  field: string;
  /** One line, from résumé facts only. */
  abstract: string;
  /** Paragraphs. Notes only. */
  body?: string[];
  /** External link (e.g. the published paper). Rendered only when present. */
  url?: string;
  /** Related project slug. */
  project?: string;
  /** Drafts are shown with a badge, excluded from the sitemap and marked noindex until reviewed. */
  draft?: boolean;
  readingMinutes?: number;
};

export const writing: WritingEntry[] = [
  {
    slug: "contractai-paper",
    kind: "paper",
    title: "ContractAI",
    field: "Hybrid RAG",
    abstract:
      "Contract analysis with hybrid retrieval — BM25 and MiniLM fused by Reciprocal Rank Fusion — and checks that verify every quoted clause and monetary figure against the source.",
    project: "contract-ai",
  },
  {
    slug: "sewer-pipeline-defect-detection",
    kind: "paper",
    title: "Sewer Pipeline Defect Detection with Temporal Event Consolidation",
    field: "Computer Vision",
    abstract:
      "A computer-vision approach to sewer pipeline defect detection, using temporal event consolidation.",
  },
  {
    slug: "stopping-double-bookings-with-redis-locks",
    kind: "note",
    title: "Stopping double-bookings with Redis locks",
    field: "Distributed systems",
    abstract:
      "Why a booking check that is correct on one server breaks on several — and how a shared lock in Redis fixes it.",
    project: "wanderlust",
    draft: true,
    readingMinutes: 2,
    body: [
      "On a single server, preventing a double-booking looks easy: check whether the dates are free, then write the booking. Wanderlust, the vacation-rental platform I built, doesn't run on a single server. It runs as several Node.js instances behind a load balancer, and that changes the problem.",
      "Two guests can ask for the same dates at the same moment. Their requests land on different instances. Each instance checks availability, each sees the slot free, and each writes a booking. Every individual check was correct; the system as a whole still sold the same stay twice. The gap is the moment between reading and writing — and with several instances, nothing local can close it.",
      "The fix is to move the decision somewhere every instance shares. Before a booking is written, the instance has to acquire a lock for that slot in Redis. Only one instance can hold it. The holder checks availability and commits; any other request for the same slot is turned away instead of racing. Once the booking is written, the lock is released.",
      "The important shift is in where correctness lives. It no longer depends on which instance a request happens to reach, or how fast each one runs. One shared, atomic gate decides — which is how Wanderlust eliminates double-booking across load-balanced instances while still being designed for 10k+ concurrent users.",
    ],
  },
  {
    slug: "pausing-an-ai-workflow-for-a-human",
    kind: "note",
    title: "Pausing an AI workflow for a human",
    field: "Agentic AI",
    abstract:
      "Building human-in-the-loop mediation on LangGraph checkpoints so a paused case survives a server restart.",
    project: "legal-ai-judge",
    draft: true,
    readingMinutes: 2,
    body: [
      "Legal AI Judge is an online dispute-resolution system built as a LangGraph agent graph. A case moves through routing, mediation, evidence-check, judge and bias-audit nodes, and a judge / co-judge loop reviews a decision before it leaves the graph.",
      "Some steps shouldn't be automated. Mediation is the clearest one: there are moments where the workflow has to stop and wait for a person. The naive version keeps that waiting state in memory — which works until the server restarts, and every case that was waiting for a human is lost.",
      "So the pause is built on LangGraph checkpoints. When the graph reaches the human step, its state is saved as a checkpoint and execution stops. Nothing has to stay alive in the meantime. When the human responds — minutes or days later, before or after a restart — the graph is resumed from that checkpoint and carries on exactly where it stopped.",
      "This turns human-in-the-loop from a demo feature into something dependable. The person is a real node in the workflow, not an interruption to it, and the system can be redeployed without abandoning cases that were mid-mediation. Combined with corrective RAG over the submitted evidence and verified citations, every step a case takes is one that can be checked.",
    ],
  },
  {
    slug: "making-a-rag-system-prove-its-quotes",
    kind: "note",
    title: "Making a RAG system prove its quotes",
    field: "Retrieval",
    abstract:
      "Hybrid retrieval finds the right clauses; verification checks that every quote and figure in the answer really is in the contract.",
    project: "contract-ai",
    draft: true,
    readingMinutes: 2,
    body: [
      "ContractAI answers questions about contracts. In that setting a fluent answer isn't enough: if a model misquotes a clause or gets a monetary figure wrong, the answer is worse than useless, because it sounds right.",
      "The first half of the problem is finding the right text. ContractAI uses hybrid retrieval: BM25 catches exact terms — defined words, clause names, numbers — while MiniLM embeddings catch passages that mean the same thing in different words. Reciprocal Rank Fusion merges the two rankings into one list, so a passage that either method rates highly can surface.",
      "The second half is not trusting the generation. Every quoted clause and every monetary figure in an answer is checked against the source document before it is shown. If a quote or a number can't be found there, it doesn't pass. What reaches the user carries clickable citations back to the place in the contract it came from.",
      "On top of that sit role-based views — Investor, Legal, PM and Partner — a streaming chatbot with memory, and fallback between LLM providers. But the core idea is the verification step: the system has to prove its quotes. The work was published as a research paper.",
    ],
  },
];

export function getEntry(slug: string) {
  return writing.find((w) => w.slug === slug);
}
