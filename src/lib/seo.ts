import { profile } from "@/content/profile";
import { education } from "@/content/credentials";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const siteTitle = `${profile.name} — ${profile.title}`;
export const siteDescription = profile.metaDescription;

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.fullName,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    jobTitle: profile.title,
    worksFor: { "@type": "Organization", name: "Tastify" },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education.institution,
      address: { "@type": "PostalAddress", addressLocality: "Pune", addressCountry: "IN" },
    },
    address: { "@type": "PostalAddress", addressLocality: "Pune", addressCountry: "IN" },
    knowsAbout: [
      "Distributed systems",
      "PostgreSQL Row-Level Security",
      "Redis",
      "Retrieval-Augmented Generation",
      "LangGraph",
      "Next.js",
    ],
    sameAs: profile.socials.map((s) => s.href),
  };
}
