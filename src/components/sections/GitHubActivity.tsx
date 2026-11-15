import { ArrowUpRight } from "lucide-react";
import { profile, stats } from "@/content/profile";
import { credentials } from "@/content/credentials";
import { getContributions } from "@/lib/github";
import { Section, SectionHeader } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { GitHubIcon, LeetCodeIcon } from "@/components/icons/BrandIcons";
import { ContributionGrid } from "@/components/charts/ContributionGrid";

const LEGEND = [0, 0.28, 0.5, 0.75, 1];

export async function GitHubActivity() {
  const data = await getContributions(profile.githubUser);
  const github = profile.socials.find((s) => s.key === "github")!;
  const leetcode = profile.socials.find((s) => s.key === "leetcode")!;
  const solved = stats.find((s) => s.id === "leetcode");
  const lcDetail = credentials.find((c) => c.id === "leetcode")?.detail;

  return (
    <Section id="activity">
      <SectionHeader section="activity" />
      <div className="grid gap-4 lg:grid-cols-12">
        <Reveal className="min-w-0 rounded-3xl border border-line bg-surface p-6 sm:p-8 lg:col-span-9">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <a
              href={github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 text-sm"
            >
              <GitHubIcon className="size-4" />
              <span className="font-mono">@{github.handle}</span>
              <ArrowUpRight className="size-3.5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              <span className="sr-only">(opens in new tab)</span>
            </a>
            <span className="label-mono text-muted">last 12 months · refreshed daily</span>
          </div>

          {data ? (
            <>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-5">
                <div>
                  <dt className="label-mono text-muted">Contributions</dt>
                  <dd className="mt-2 text-2xl font-medium tracking-tight">{data.total.toLocaleString("en-US")}</dd>
                </div>
                <div>
                  <dt className="label-mono text-muted">Active days</dt>
                  <dd className="mt-2 text-2xl font-medium tracking-tight">{data.activeDays}</dd>
                </div>
                <div>
                  <dt className="label-mono text-muted">Longest streak</dt>
                  <dd className="mt-2 text-2xl font-medium tracking-tight">
                    {data.longestStreak}
                    <span className="ml-1 text-sm text-muted">d</span>
                  </dd>
                </div>
              </dl>
              <div className="mt-6">
                <ContributionGrid weeks={data.weeks} />
              </div>
              <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[0.625rem] text-muted" aria-hidden="true">
                less
                {LEGEND.map((o, i) => (
                  <span
                    key={i}
                    className={i === 0 ? "size-2.5 rounded-[2px] bg-line" : "size-2.5 rounded-[2px] bg-accent"}
                    style={i === 0 ? undefined : { opacity: o }}
                  />
                ))}
                more
              </div>
            </>
          ) : (
            <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-dashed border-line-strong p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                The contribution calendar couldn&apos;t be loaded right now. The full history is on GitHub.
              </p>
              <a
                href={github.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-line-strong px-4 text-sm hover:border-accent hover:text-accent"
              >
                <GitHubIcon className="size-3.5" /> View profile
              </a>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-3">
          <a
            href={leetcode.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col justify-between gap-10 rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-line-strong sm:p-8"
          >
            <span className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm">
                <LeetCodeIcon className="size-4" /> LeetCode
              </span>
              <ArrowUpRight className="size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[clamp(3rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.05em]">
                {solved ? `${solved.value}${solved.suffix ?? ""}` : null}
              </span>
              <span className="mt-3 block text-sm text-muted">
                problems solved{lcDetail ? ` — ${lcDetail.replace(/\.$/, "").toLowerCase()}` : ""}
              </span>
              <span className="mt-4 block font-mono text-[0.6875rem] text-muted">@{leetcode.handle}</span>
              <span className="sr-only">(opens in new tab)</span>
            </span>
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
