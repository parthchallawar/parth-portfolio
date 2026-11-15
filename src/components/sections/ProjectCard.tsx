import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe } from "lucide-react";
import type { Project } from "@/content/projects";
import { TiltCard, TiltLayer } from "@/components/primitives/TiltCard";
import { Badge } from "@/components/primitives/Badge";
import { GitHubIcon } from "@/components/icons/BrandIcons";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { SectionLink } from "@/components/primitives/SectionLink";

export function ProjectCard({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;
  return (
    <TiltCard cursorLabel="View" className="h-full">
      <article className="group/card relative flex h-full flex-col rounded-[1.75rem] [transform-style:preserve-3d]" aria-labelledby={`p-${project.slug}`}>
        <div aria-hidden="true" className="glass gradient-border absolute inset-0 rounded-[inherit]" />

        <TiltLayer depth={18} className="relative p-3">
          <Link
            href={href}
            tabIndex={-1}
            aria-hidden="true"
            className="block overflow-hidden rounded-[1.25rem] border border-line bg-bg/80 p-2 sm:p-3"
          >
            <ProjectVisual id={project.visual} />
          </Link>
        </TiltLayer>

        <TiltLayer depth={34} className="relative flex flex-1 flex-col px-6 pb-6 pt-3 sm:px-7 sm:pb-7">
          <div className="flex items-center justify-between gap-4">
            <span className="label-mono text-muted">
              <span className="text-accent">{project.index}</span> · {project.tagline}
            </span>
          </div>
          <h3 id={`p-${project.slug}`} className="text-h3 mt-4">
            <Link href={href} className="outline-none after:absolute after:inset-0 after:rounded-[1.75rem] after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-accent">
              {project.title}
            </Link>
          </h3>
          <p className="mt-3 max-w-prose text-pretty text-[0.95rem] leading-relaxed text-muted">{project.impact}</p>

          <ul className="mt-6 grid grid-cols-3 gap-2">
            {project.metrics.map((m) => (
              <li key={m.label} className="rounded-xl border border-line bg-bg/60 px-3 py-2.5">
                <span className="block text-base font-medium leading-tight tracking-tight">{m.value}</span>
                <span className="mt-1 block font-mono text-[0.625rem] uppercase leading-tight tracking-[0.05em] text-muted">
                  {m.label}
                </span>
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {project.stack.map((s) => (
              <li key={s}>
                <Badge>{s}</Badge>
              </li>
            ))}
          </ul>

          <div className="relative z-10 mt-auto flex flex-wrap items-center gap-2 pt-7">
            <Link
              href={href}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-fg"
            >
              Case study
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/card:translate-x-0.5" aria-hidden="true" />
            </Link>
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                <GitHubIcon className="size-3.5" />
                GitHub
                <span className="sr-only">(opens in new tab)</span>
              </a>
            ) : null}
            {project.demo ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                <Globe className="size-3.5" aria-hidden="true" />
                Live demo
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </a>
            ) : null}
            {project.related ? (
              <SectionLink
                section={project.related.href.replace(/^\/#/, "")}
                className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm text-muted transition-colors hover:text-fg"
              >
                {project.related.label}
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </SectionLink>
            ) : null}
          </div>
        </TiltLayer>
      </article>
    </TiltCard>
  );
}
