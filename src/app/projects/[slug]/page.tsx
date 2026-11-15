import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe } from "lucide-react";
import { getProject, projects } from "@/content/projects";
import { writing } from "@/content/writing";
import { Badge, Tick } from "@/components/primitives/Badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import { SectionLabel } from "@/components/primitives/Section";
import { GitHubIcon } from "@/components/icons/BrandIcons";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { SectionLink } from "@/components/primitives/SectionLink";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const description = `${p.tagline}. ${p.impact}`;
  return {
    title: `${p.title} — case study`,
    description,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.title} — case study`, description, url: `/projects/${p.slug}`, type: "article" },
    twitter: { title: `${p.title} — case study`, description },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];
  const related = writing.filter((w) => w.project === project.slug);

  return (
    <article className="pb-24 pt-28 sm:pt-36">
      <div className="container-x">
        <SectionLink
          section="projects"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          All work
        </SectionLink>

        <header className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel index={project.index}>{project.tagline}</SectionLabel>
            <h1 className="mt-6 text-[clamp(3rem,10vw,8.5rem)] font-medium leading-[0.9] tracking-[-0.05em]">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-[clamp(1.1rem,1.8vw,1.4rem)] leading-snug tracking-[-0.015em] text-fg/90">
              {project.impact}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:col-span-4 lg:justify-end">
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-fg"
              >
                <GitHubIcon className="size-4" /> View on GitHub
                <span className="sr-only">(opens in new tab)</span>
              </a>
            ) : null}
            {project.demo ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                <Globe className="size-4" aria-hidden="true" /> Live demo <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            ) : null}
            {project.related ? (
              <SectionLink
                section={project.related.href.replace(/^\/#/, "")}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                {project.related.label} <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </SectionLink>
            ) : null}
            {project.note ? <p className="w-full font-mono text-xs text-muted lg:text-right">{project.note}</p> : null}
          </div>
        </header>

        <RevealGroup as="ul" className="mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {project.metrics.map((m) => (
            <RevealItem as="li" key={m.label} className="bg-surface px-4 py-6 sm:px-8 sm:py-8">
              <span className="block text-[clamp(1.5rem,4vw,3rem)] font-medium leading-none tracking-[-0.045em]">{m.value}</span>
              <span className="mt-3 block font-mono text-[0.625rem] uppercase tracking-[0.06em] text-muted sm:text-[0.6875rem]">
                {m.label}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tech stack">
          {project.stack.map((s) => (
            <li key={s}>
              <Badge>{s}</Badge>
            </li>
          ))}
        </ul>

        <div className="mt-24 grid gap-16 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <StepLabel n="01" label="Problem" />
            <p className="mt-6 text-pretty text-[1.05rem] leading-relaxed text-fg/90">{project.problem}</p>
          </Reveal>
          <Reveal className="lg:col-span-7 lg:col-start-6" delay={0.06}>
            <StepLabel n="02" label="Approach" />
            <ol className="mt-6 space-y-5">
              {project.approach.map((a, i) => (
                <li key={i} className="grid grid-cols-[2.25rem_1fr] gap-2 border-t border-line pt-5">
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-pretty text-[1.02rem] leading-relaxed text-fg/90">{a}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal className="mt-24">
          <StepLabel n="03" label="Architecture" />
          <figure className="mt-6 overflow-hidden rounded-3xl border border-line bg-surface p-3 sm:p-6">
            <div className="mx-auto max-w-4xl rounded-2xl border border-line bg-bg p-3 sm:p-5">
              <ProjectVisual id={project.visual} />
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-4 px-1 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-muted">
              <span>Live mechanism · loops while visible</span>
              <span className="hidden sm:inline">{project.stack.slice(0, 3).join(" · ")}</span>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal className="mt-24">
          <StepLabel n="04" label="Results" />
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {project.results.map((r, i) => (
              <li key={i} className="flex gap-3 rounded-2xl border border-line bg-surface p-6 text-[0.98rem] leading-relaxed">
                <Tick className="mt-1.5 text-accent" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {related.length ? (
          <Reveal className="mt-24">
            <StepLabel n="05" label="Further reading" />
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {related.map((w) => (
                <li key={w.slug}>
                  <Link href={`/writing/${w.slug}`} className="group flex items-center justify-between gap-6 py-5">
                    <span className="flex items-center gap-3">
                      <Badge tone={w.kind === "paper" ? "accent" : "default"}>{w.kind === "paper" ? "Paper" : "Note"}</Badge>
                      <span className="transition-transform duration-500 group-hover:translate-x-1">{w.title}</span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted transition-colors group-hover:text-accent" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        <Link
          href={`/projects/${next.slug}`}
          data-cursor="Next"
          className="group mt-28 block rounded-3xl border border-line bg-surface p-8 transition-colors hover:border-line-strong sm:p-12"
        >
          <span className="label-mono text-muted">Next project · {next.index}</span>
          <span className="mt-6 flex items-end justify-between gap-6">
            <span>
              <span className="block text-[clamp(2.25rem,6vw,5rem)] font-medium leading-none tracking-[-0.045em]">
                {next.title}
              </span>
              <span className="mt-3 block text-muted">{next.tagline}</span>
            </span>
            <span className="grid size-14 shrink-0 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg">
              <ArrowRight className="size-5 transition-transform duration-500 group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </span>
        </Link>
      </div>
    </article>
  );
}

function StepLabel({ n, label }: { n: string; label: string }) {
  return (
    <h2 className="flex items-center gap-3">
      <span className="label-mono text-accent">{n}</span>
      <span className="label-mono text-muted">/</span>
      <span className="label-mono text-fg">{label}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </h2>
  );
}
