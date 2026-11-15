import { ArrowDownRight, FileDown } from "lucide-react";
import { profile, stats } from "@/content/profile";
import { SplitText } from "@/components/primitives/SplitText";
import { Magnetic } from "@/components/primitives/Magnetic";
import { ButtonA, buttonClass } from "@/components/primitives/Button";
import { SectionLink } from "@/components/primitives/SectionLink";
import { Tick } from "@/components/primitives/Badge";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { Portrait } from "./Portrait";
import { RoleRotator } from "./RoleRotator";

function statText(s: (typeof stats)[number]) {
  return `${s.prefix ?? ""}${s.decimals ? s.value.toFixed(s.decimals) : s.value}${s.suffix ?? ""}`;
}

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <HeroCanvas />

      <div className="container-x relative z-10 flex flex-1 flex-col pb-10 pt-24 sm:pt-28">
        {/* telemetry row */}
        <div className="flex items-center justify-between gap-4">
          <p className="label-mono flex items-center gap-2.5 text-fg">
            <span className="status-dot relative inline-block size-2 rounded-full bg-accent" aria-hidden="true" />
            {profile.status}
          </p>
          <p className="label-mono hidden text-muted sm:block">{profile.location} · IST (UTC+5:30)</p>
          <Portrait size={64} className="sm:hidden" />
        </div>

        <div className="mt-10 grid flex-1 items-center gap-12 lg:mt-6 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <p className="font-mono text-[0.8125rem] text-muted">
              <span className="text-fg">{profile.name}</span>
              <span className="mx-2 hidden text-line-strong sm:inline" aria-hidden="true">
                /
              </span>
              <RoleRotator roles={profile.roles} className="block text-fg sm:inline" />
            </p>

            <SplitText
              id="hero-title"
              text={profile.headline}
              as="h1"
              className="mt-6 max-w-[15ch] text-balance text-[clamp(2.6rem,7.4vw,8rem)] font-medium leading-[0.94] tracking-[-0.045em]"
            />

            <div className="mt-10 flex flex-wrap items-center gap-3 sm:mt-12">
              <Magnetic>
                <SectionLink section="projects" className={buttonClass("accent")}>
                  View work
                  <ArrowDownRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:translate-y-0.5" aria-hidden="true" />
                </SectionLink>
              </Magnetic>
              <ButtonA href={profile.resume} download="Parth-Challawar-Resume.pdf" variant="ghost">
                <FileDown className="size-4" aria-hidden="true" />
                Download résumé
              </ButtonA>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-muted">
              {profile.proofPoints.map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Tick className="text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden justify-self-end lg:col-span-3 lg:block">
            <Portrait size={300} />
          </div>
        </div>

        <div className="mt-10 hidden items-center gap-3 text-muted sm:flex" aria-hidden="true">
          <span className="relative h-10 w-px overflow-hidden bg-line">
            <span className="scroll-cue-dot absolute inset-x-0 top-0 h-1/3 bg-accent" />
          </span>
          <span className="label-mono">scroll</span>
        </div>
      </div>

      {/* stats marquee */}
      <div className="marquee relative z-10 border-y border-line bg-bg/60 backdrop-blur-sm">
        <p className="sr-only">
          {stats.map((s) => `${statText(s)} ${s.label}`).join(", ")}
        </p>
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]" aria-hidden="true">
          <div className="marquee-track flex shrink-0 items-center">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center">
                {stats.map((s) => (
                  <li key={`${copy}-${s.id}`} className="flex items-center gap-3 whitespace-nowrap px-7 py-4 font-mono text-xs uppercase tracking-[0.08em]">
                    <span className="text-fg">{statText(s)}</span>
                    <span className="text-muted">{s.label}</span>
                    <span className="ml-7 text-line-strong">✦</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
