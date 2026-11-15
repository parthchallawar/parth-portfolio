import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getEntry, writing } from "@/content/writing";
import { getProject } from "@/content/projects";
import { profile } from "@/content/profile";
import { Badge } from "@/components/primitives/Badge";
import { Reveal } from "@/components/primitives/Reveal";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return writing.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const w = getEntry(slug);
  if (!w) return {};
  return {
    title: w.title,
    description: w.abstract,
    alternates: { canonical: `/writing/${w.slug}` },
    openGraph: { title: w.title, description: w.abstract, url: `/writing/${w.slug}`, type: "article" },
    twitter: { title: w.title, description: w.abstract },
    // Drafts stay out of search until reviewed.
    robots: w.draft ? { index: false, follow: true } : undefined,
  };
}

export default async function WritingPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();
  const project = entry.project ? getProject(entry.project) : undefined;
  const idx = writing.findIndex((w) => w.slug === slug);
  const next = writing[(idx + 1) % writing.length];

  return (
    <article className="pb-24 pt-28 sm:pt-36">
      <div className="container-x">
        <Link
          href="/writing"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          Research & notes
        </Link>

        <header className="mt-12 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={entry.kind === "paper" ? "accent" : "default"}>{entry.kind === "paper" ? "Paper" : "Note"}</Badge>
            <Badge>{entry.field}</Badge>
            {entry.draft ? <Badge tone="outline">Draft — pending review</Badge> : null}
            {entry.readingMinutes ? (
              <span className="ml-1 font-mono text-[0.6875rem] text-muted">{entry.readingMinutes} min read</span>
            ) : null}
          </div>
          <h1 className="mt-6 text-[clamp(2.25rem,5.5vw,4.5rem)] font-medium leading-[1] tracking-[-0.045em] text-balance">
            {entry.title}
          </h1>
          {entry.body?.length ? (
            <p className="mt-6 text-pretty text-[1.15rem] leading-relaxed text-muted">{entry.abstract}</p>
          ) : null}
          <p className="mt-6 font-mono text-xs text-muted">{profile.name}</p>
        </header>

        <div className="mt-14 grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            {entry.body?.length ? (
              <div className="space-y-6 border-t border-line pt-10 text-[1.075rem] leading-[1.75] text-fg/90">
                {entry.body.map((p, i) => (
                  <p key={i} className="text-pretty">
                    {p}
                  </p>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
                <p className="label-mono text-muted">Abstract</p>
                <p className="mt-4 text-pretty text-[1.05rem] leading-relaxed">{entry.abstract}</p>
                {entry.url ? (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm text-fg hover:text-accent"
                  >
                    Read the paper <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <p className="mt-6 text-sm text-muted">
                    Want the full paper? Email{" "}
                    <a href={`mailto:${profile.email}`} className="text-fg underline underline-offset-4 hover:text-accent">
                      {profile.email}
                    </a>
                    .
                  </p>
                )}
              </div>
            )}
          </Reveal>

          <aside className="lg:col-span-4">
            {project ? (
              <Link
                href={`/projects/${project.slug}`}
                className="group block rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-line-strong"
              >
                <span className="label-mono text-muted">Related project</span>
                <span className="mt-4 block text-xl font-medium tracking-tight">{project.title}</span>
                <span className="mt-2 block text-sm text-muted">{project.impact}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm group-hover:text-accent">
                  Case study <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
              </Link>
            ) : null}
          </aside>
        </div>

        {next && next.slug !== entry.slug ? (
          <Link
            href={`/writing/${next.slug}`}
            className="group mt-24 flex items-center justify-between gap-6 border-y border-line py-8"
          >
            <span>
              <span className="label-mono text-muted">Next</span>
              <span className="mt-3 block text-[clamp(1.25rem,2.6vw,2rem)] font-medium tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-1">
                {next.title}
              </span>
            </span>
            <ArrowRight className="size-5 shrink-0 text-muted transition-colors group-hover:text-accent" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
