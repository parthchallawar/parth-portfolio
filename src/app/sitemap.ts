import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { writing } from "@/content/writing";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/writing"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...projects.map((p) => ({
      url: absoluteUrl(`/projects/${p.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // Draft notes are excluded until reviewed.
    ...writing
      .filter((w) => !w.draft)
      .map((w) => ({
        url: absoluteUrl(`/writing/${w.slug}`),
        lastModified: now,
        changeFrequency: "yearly" as const,
        priority: 0.5,
      })),
  ];
}
