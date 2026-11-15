import type { SVGProps } from "react";
import type { SocialKey } from "@/content/profile";

type P = SVGProps<SVGSVGElement>;

export function GitHubIcon(props: P) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function LinkedInIcon(props: P) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.63 0H2.37A2.37 2.37 0 0 0 0 2.37v11.26A2.37 2.37 0 0 0 2.37 16h11.26A2.37 2.37 0 0 0 16 13.63V2.37A2.37 2.37 0 0 0 13.63 0ZM4.9 13.3H2.6V6.1h2.3v7.2ZM3.75 5.1a1.33 1.33 0 1 1 0-2.66 1.33 1.33 0 0 1 0 2.66Zm9.6 8.2h-2.3V9.8c0-.83-.02-1.9-1.16-1.9-1.16 0-1.34.9-1.34 1.84v3.56h-2.3V6.1h2.2v.98h.03c.31-.58 1.06-1.2 2.18-1.2 2.33 0 2.76 1.54 2.76 3.53v3.89Z" />
    </svg>
  );
}

/** Simplified LeetCode-style glyph (bracket + bar), drawn for this site. */
export function LeetCodeIcon(props: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M9.6 1.6 4.2 7.2a1.2 1.2 0 0 0 0 1.66l3.9 4.06a1.2 1.2 0 0 0 1.73 0l1.5-1.56" />
      <path d="M6.6 8.05h6.6" />
      <path d="M11.3 4.6 9.7 3" />
    </svg>
  );
}

export function SocialIcon({ name, ...props }: P & { name: SocialKey }) {
  if (name === "github") return <GitHubIcon {...props} />;
  if (name === "linkedin") return <LinkedInIcon {...props} />;
  return <LeetCodeIcon {...props} />;
}
