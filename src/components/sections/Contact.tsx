import { profile } from "@/content/profile";
import { headings } from "@/content/site";
import { Section, SectionLabel } from "@/components/primitives/Section";
import { RichText } from "@/components/primitives/RichText";
import { Magnetic } from "@/components/primitives/Magnetic";
import { Reveal } from "@/components/primitives/Reveal";
import { SocialIcon } from "@/components/icons/BrandIcons";
import { ContactForm } from "./ContactForm";
import { CopyEmail } from "./CopyEmail";
import { sectionMeta } from "@/content/site";

export function Contact() {
  const meta = sectionMeta("contact");
  const h = headings.contact;
  return (
    <Section id="contact" className="pb-16 md:pb-24">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <SectionLabel index={meta.index}>{meta.label}</SectionLabel>
          <h2 id="contact-title" className="mt-6 text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-balance">
            <RichText text={h.title} />
          </h2>
          {h.intro ? <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted">{h.intro}</p> : null}

          <div className="mt-10">
            <CopyEmail email={profile.email} />
          </div>

          <ul className="mt-8 flex gap-3" aria-label="Social profiles">
            {profile.socials.map((s) => (
              <li key={s.key}>
                <Magnetic strength={0.4}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} — ${s.handle} (opens in new tab)`}
                    className="grid size-12 place-items-center rounded-full border border-line-strong text-fg transition-colors hover:border-accent hover:text-accent"
                  >
                    <SocialIcon name={s.key} className="size-[18px]" />
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>

        <Reveal className="lg:col-span-6">
          <div className="rounded-3xl border border-line bg-surface p-5 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <span className="label-mono text-muted">New message</span>
              <span className="label-mono flex items-center gap-2 text-muted">
                <span className="status-dot relative inline-block size-1.5 rounded-full bg-accent" aria-hidden="true" />
                {profile.status}
              </span>
            </div>
            <ContactForm email={profile.email} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
