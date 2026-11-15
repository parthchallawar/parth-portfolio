import Link from "next/link";
import { FileDown } from "lucide-react";
import { profile } from "@/content/profile";
import { sections } from "@/content/site";
import { SocialIcon } from "@/components/icons/BrandIcons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line">
      <div className="container-x grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full border border-line-strong font-mono text-[0.7rem]">
              {profile.initials}
            </span>
            <span className="font-medium tracking-tight">{profile.name}</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            {profile.title} at Tastify. Concurrency-safe backends and AI you can verify. {profile.location}.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-6 inline-block font-mono text-sm text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent"
          >
            {profile.email}
          </a>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
          <div>
            <p className="label-mono text-muted">Index</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <Link href={`/#${s.id}`} className="text-fg/80 transition-colors hover:text-accent">
                    <span className="mr-2 font-mono text-[0.7rem] text-muted">{s.index}</span>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label-mono text-muted">Elsewhere</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {profile.socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-fg/80 transition-colors hover:text-accent"
                  >
                    <SocialIcon name={s.key} className="size-3.5" />
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/writing" className="text-fg/80 transition-colors hover:text-accent">
                  Research & notes
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="label-mono text-muted">Résumé</p>
            <a
              href={profile.resume}
              download="Parth-Challawar-Resume.pdf"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
            >
              <FileDown className="size-4" aria-hidden="true" /> Download PDF
            </a>
          </div>
        </nav>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-line py-6 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {year} {profile.name}
        </span>
        <span className="flex items-center gap-2">
          <span className="relative inline-block size-1.5 rounded-full bg-accent" aria-hidden="true" />
          All systems nominal · Pune, IN
        </span>
      </div>
    </footer>
  );
}
