"use client";

import { Command } from "cmdk";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Copy,
  CornerDownLeft,
  FileDown,
  Hash,
  Search,
  SunMoon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { sections } from "@/content/site";
import { OPEN_COMMAND_EVENT, copyText } from "@/lib/actions";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useSectionNav } from "@/hooks/useSectionNav";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { SocialIcon } from "@/components/icons/BrandIcons";
import { EASE_SIGNAL } from "@/lib/motion";
import { useThemeSwitch } from "./ThemeToggle";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const goSection = useSectionNav();
  const toggleTheme = useThemeSwitch();
  const { stop, start } = useSmoothScroll();

  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(panelRef, open, close, inputRef);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) stop();
    else start();
  }, [open, stop, start]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  const run = (fn: () => void) => {
    setOpen(false);
    // Let the dialog close (and focus restore) before acting.
    window.setTimeout(fn, 60);
  };

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-bg/60 backdrop-blur-sm" onClick={close} aria-hidden="true" />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              className="glass gradient-border relative w-full max-w-xl overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE_SIGNAL }}
            >
              <Command label="Command menu" loop className="flex max-h-[min(70vh,560px)] flex-col">
                <div className="flex items-center gap-3 border-b border-line px-4">
                  <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
                  <Command.Input
                    ref={inputRef}
                    placeholder="Jump to a section, open a project, run an action…"
                    className="h-14 w-full bg-transparent text-[0.95rem] text-fg outline-none placeholder:text-muted"
                  />
                  <kbd className="label-mono hidden rounded border border-line px-1.5 py-1 text-muted sm:block">
                    esc
                  </kbd>
                </div>
                <Command.List data-lenis-prevent className="overflow-y-auto overscroll-contain p-2">
                  <Command.Empty className="px-3 py-8 text-center text-sm text-muted">
                    No match. Try “projects” or “email”.
                  </Command.Empty>

                  <Group heading="Sections">
                    <Item onSelect={() => run(() => goSection("top"))} icon={<Hash />} label="Home" value="home top hero" />
                    {sections.map((s) => (
                      <Item
                        key={s.id}
                        value={`section ${s.label} ${s.id}`}
                        onSelect={() => run(() => goSection(s.id))}
                        icon={<Hash />}
                        label={s.label}
                        hint={s.index}
                      />
                    ))}
                  </Group>

                  <Group heading="Projects">
                    {projects.map((p) => (
                      <Item
                        key={p.slug}
                        value={`project ${p.title} ${p.tagline}`}
                        onSelect={() => run(() => router.push(`/projects/${p.slug}`))}
                        icon={<ArrowRight />}
                        label={p.title}
                        hint={p.tagline}
                      />
                    ))}
                  </Group>

                  <Group heading="Actions">
                    <Item
                      value="toggle theme dark light mode"
                      onSelect={() => run(() => toggleTheme())}
                      icon={<SunMoon />}
                      label="Toggle theme"
                    />
                    <Item
                      value="copy email address contact"
                      onSelect={() =>
                        run(async () => setToast((await copyText(profile.email)) ? "Email copied" : "Copy failed"))
                      }
                      icon={<Copy />}
                      label="Copy email"
                      hint={profile.email}
                    />
                    <Item
                      value="download resume cv pdf"
                      onSelect={() =>
                        run(() => {
                          const a = document.createElement("a");
                          a.href = profile.resume;
                          a.download = "Parth-Challawar-Resume.pdf";
                          a.click();
                        })
                      }
                      icon={<FileDown />}
                      label="Download résumé"
                      hint="PDF"
                    />
                  </Group>

                  <Group heading="Links">
                    {profile.socials.map((s) => (
                      <Item
                        key={s.key}
                        value={`open ${s.label} ${s.handle}`}
                        onSelect={() => run(() => window.open(s.href, "_blank", "noopener,noreferrer"))}
                        icon={<SocialIcon name={s.key} />}
                        label={`Open ${s.label}`}
                        hint={<ArrowUpRight className="size-3.5" aria-hidden="true" />}
                      />
                    ))}
                  </Group>
                </Command.List>
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-muted">
                  <span className="label-mono">parth · cmd</span>
                  <span className="label-mono flex items-center gap-1.5">
                    <CornerDownLeft className="size-3" aria-hidden="true" /> select
                  </span>
                </div>
              </Command>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[95] flex justify-center">
        <AnimatePresence>
          {toast ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="rounded-full border border-line bg-surface px-4 py-2 font-mono text-xs text-fg shadow-lg"
            >
              <span className="mr-2 text-accent">✓</span>
              {toast}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}

function Group({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="mb-1 [&_[cmdk-group-heading]]:label-mono [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-muted"
    >
      {children}
    </Command.Group>
  );
}

function Item({
  value,
  onSelect,
  icon,
  label,
  hint,
}: {
  value: string;
  onSelect: () => void;
  icon: ReactNode;
  label: string;
  hint?: ReactNode;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-fg/90 outline-none data-[selected=true]:bg-fg/[0.06] data-[selected=true]:text-fg"
    >
      <span className="grid size-7 place-items-center rounded-lg border border-line text-muted group-data-[selected=true]:border-accent/40 group-data-[selected=true]:text-accent [&_svg]:size-3.5">
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {hint ? <span className="truncate font-mono text-[0.7rem] text-muted">{hint}</span> : null}
    </Command.Item>
  );
}
