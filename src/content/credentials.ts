export type CredentialKind = "certification" | "practice" | "paper";

export type Credential = {
  id: string;
  kind: CredentialKind;
  title: string;
  issuer: string;
  detail?: string;
  /** "Verify ↗" renders only when this exists. */
  url?: string;
  urlLabel?: string;
};

export const credentials: Credential[] = [
  {
    id: "aws-educate",
    kind: "certification",
    title: "AWS Educate Cloud Certification",
    issuer: "Amazon Web Services",
  },
  {
    id: "leetcode",
    kind: "practice",
    title: "300+ LeetCode problems",
    issuer: "LeetCode",
    detail: "Arrays, graphs, trees, dynamic programming and greedy.",
    url: "https://leetcode.com/u/parthc31",
    urlLabel: "Profile",
  },
  {
    id: "paper-sewer",
    kind: "paper",
    title: "Sewer Pipeline Defect Detection with Temporal Event Consolidation",
    issuer: "Research paper · Computer Vision",
    detail: "Computer-vision defect detection for sewer pipeline inspection, with temporal event consolidation.",
  },
  {
    id: "paper-contractai",
    kind: "paper",
    title: "ContractAI",
    issuer: "Research paper · Hybrid RAG",
    detail: "Hybrid-retrieval contract analysis with verified quotes and figures.",
  },
];

export const education = {
  institution: "Vishwakarma Institute of Technology",
  shortName: "VIT Pune",
  location: "Pune",
  degree: "B.Tech, Computer Science & Engineering (AI & ML)",
  expected: "May 2027",
  cgpa: 9.04,
  cgpaScale: 10,
};
