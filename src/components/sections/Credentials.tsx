import { ArrowUpRight, Award, Code2, FileText } from "lucide-react";
import { credentials, type CredentialKind } from "@/content/credentials";
import { Section, SectionHeader } from "@/components/primitives/Section";
import { RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import { Badge } from "@/components/primitives/Badge";

const KIND: Record<CredentialKind, { label: string; Icon: typeof Award }> = {
  certification: { label: "Certification", Icon: Award },
  practice: { label: "Practice", Icon: Code2 },
  paper: { label: "Paper", Icon: FileText },
};

export function Credentials() {
  return (
    <Section id="credentials">
      <SectionHeader section="credentials" />
      <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2">
        {credentials.map((c) => {
          const { label, Icon } = KIND[c.kind];
          return (
            <RevealItem as="li" key={c.id}>
              <div className="sweep flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-line-strong sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="relative grid size-12 place-items-center rounded-xl border border-line bg-bg">
                    <Icon className="size-5 text-fg" aria-hidden="true" strokeWidth={1.5} />
                    <span className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full bg-accent" aria-hidden="true">
                      <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
                        <path d="M3 6.2 5 8.1 9 4" className="stroke-accent-fg" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </span>
                  <Badge tone={c.kind === "paper" ? "accent" : "default"}>{label}</Badge>
                </div>
                <h3 className="mt-6 text-lg font-medium leading-snug tracking-tight text-balance">{c.title}</h3>
                <p className="mt-1.5 font-mono text-xs text-muted">{c.issuer}</p>
                {c.detail ? <p className="mt-4 text-sm leading-relaxed text-muted">{c.detail}</p> : null}
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-sm text-fg transition-colors hover:text-accent"
                  >
                    {c.kind === "practice" ? (c.urlLabel ?? "View") : "Verify"}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">— {c.title} (opens in new tab)</span>
                  </a>
                ) : null}
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
