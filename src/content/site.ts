/** Section ids, numbering and nav labels. Section copy lives in the other content files. */
export const sections = [
  { id: "about", index: "01", label: "About", nav: true },
  { id: "skills", index: "02", label: "Skills", nav: true },
  { id: "experience", index: "03", label: "Experience", nav: true },
  { id: "projects", index: "04", label: "Work", nav: true },
  { id: "activity", index: "05", label: "Activity", nav: false },
  { id: "credentials", index: "06", label: "Credentials", nav: false },
  { id: "education", index: "07", label: "Education", nav: false },
  { id: "writing", index: "08", label: "Writing", nav: true },
  { id: "contact", index: "09", label: "Contact", nav: true },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export function sectionMeta(id: SectionId) {
  const s = sections.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown section ${id}`);
  return s;
}

/** Section headings. `*word*` renders in serif italic. */
export const headings: Record<SectionId, { title: string; intro?: string }> = {
  about: {
    title: "Correct first, *then* fast.",
  },
  skills: {
    title: "Tools, with the *evidence*.",
    intro:
      "No percentages. Each skill shows where it has actually been used: running in production, shipped in a project, or built through coursework and practice.",
  },
  experience: {
    title: "Shipping to *real* restaurants.",
  },
  projects: {
    title: "Systems that *check* themselves.",
    intro:
      "No screenshots — each card shows the mechanism instead. Watch what the system actually does: a lock, a pause for a human, a verified quote, a tenant boundary.",
  },
  activity: {
    title: "Commits, *counted*.",
    intro: "Public contribution activity from GitHub over the last year, refreshed daily.",
  },
  credentials: {
    title: "Certified & *published*.",
  },
  education: {
    title: "The *foundation*.",
  },
  writing: {
    title: "Research & *notes*.",
    intro: "Two published papers, and short engineering notes on the problems behind the projects.",
  },
  contact: {
    title: "Let's build something that *holds up*.",
    intro: "Hiring for 2027, or building something that has to stay correct under load? Send a note.",
  },
};
