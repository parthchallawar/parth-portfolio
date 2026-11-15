"use client";

import { AnimatePresence, motion } from "motion/react";
import { FileDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { profile } from "@/content/profile";
import { sections } from "@/content/site";
import { isMac, openCommandMenu } from "@/lib/actions";
import { cn } from "@/lib/cn";
import { EASE_SIGNAL } from "@/lib/motion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useSectionNav } from "@/hooks/useSectionNav";
import { useScrollListener, useSmoothScroll } from "@/components/providers/SmoothScroll";
import { SocialIcon } from "@/components/icons/BrandIcons";
import { ThemeToggle } from "./ThemeToggle";

const navItems = sections.filter((s) => s.nav);

export function Nav() {
  const pathname = usePathname();
  const goSection = useSectionNav();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mod, setMod] = useState("Ctrl");
  const menuRef = useRef<HTMLDivElement>(null);
  const { stop, start } = useSmoothScroll();

  useEffect(() => setMod(isMac() ? "⌘" : "Ctrl"), []);

  useScrollListener(({ scroll, direction }) => {
    setScrolled(scroll > 24);
    if (scroll < 120) setHidden(false);
    else if (direction === 1) setHidden(true);
    else if (direction === -1) setHidden(false);
  });

  // Active section indicator.
  useEffect(() => {
    if (pathname !== "/") {
      setActive(pathname.startsWith("/writing") ? "writing" : pathname.startsWith("/projects") ? "projects" : null);
      return;
    }
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        }
        // The topmost visible section in document order wins.
        const first = sections.find((s) => visible.has(s.id));
        const id = first?.id ?? null;
        const navId = id && navItems.some((n) => n.id === id) ? id : id ? nearestNav(id) : null;
        setActive(navId);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useFocusTrap(menuRef, menuOpen, closeMenu);
  useEffect(() => {
    if (menuOpen) stop();
    else start();
  }, [menuOpen, stop, start]);

  const onAnchor = (e: MouseEvent, id: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    setMenuOpen(false);
    goSection(id);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-3 sm:pt-4"
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-130%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE_SIGNAL }}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "glass gradient-border flex h-12 w-full max-w-[880px] items-center gap-1 rounded-full pl-2 pr-1.5 transition-shadow duration-500",
            scrolled && "shadow-[0_10px_40px_-12px_rgb(0_0_0/0.45)]",
          )}
        >
          <Link
            href="/"
            onClick={(e) => (pathname === "/" ? onAnchor(e, "top") : undefined)}
            className="group flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3"
            aria-label={`${profile.name} — home`}
          >
            <span className="grid size-8 place-items-center rounded-full border border-line-strong font-mono text-[0.7rem] font-medium tracking-tight text-fg transition-colors group-hover:border-accent group-hover:text-accent">
              {profile.initials}
            </span>
            <span className="hidden text-sm font-medium tracking-tight sm:inline">{profile.name}</span>
          </Link>

          <ul className="ml-auto hidden items-center gap-0.5 md:flex">
            {navItems.map((item) => (
              <li key={item.id} className="relative">
                <Link
                  href={`/#${item.id}`}
                  onClick={(e) => onAnchor(e, item.id)}
                  aria-current={active === item.id ? "location" : undefined}
                  className={cn(
                    "relative isolate block rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors",
                    active === item.id ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {active === item.id ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-fg/[0.07]"
                      transition={{ duration: 0.5, ease: EASE_SIGNAL }}
                    />
                  ) : null}
                  {active === item.id ? (
                    <span aria-hidden="true" className="absolute left-1/2 top-1 size-1 -translate-x-1/2 rounded-full bg-accent" />
                  ) : null}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-1 md:ml-2">
            <button
              type="button"
              onClick={openCommandMenu}
              className="hidden h-9 items-center gap-1.5 rounded-full border border-line px-3 font-mono text-[0.6875rem] text-muted transition-colors hover:border-line-strong hover:text-fg sm:flex"
              aria-label="Open command menu"
              aria-keyshortcuts="Control+K Meta+K"
            >
              <span suppressHydrationWarning>{mod}</span>
              <span>K</span>
            </button>
            <a
              href={profile.resume}
              download="Parth-Challawar-Resume.pdf"
              aria-label="Download résumé (PDF)"
              title="Download résumé"
              className="hidden size-9 place-items-center rounded-full text-muted transition-colors hover:bg-fg/[0.06] hover:text-fg md:grid"
            >
              <FileDown className="size-4" aria-hidden="true" />
            </a>
            <ThemeToggle />
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full text-fg hover:bg-fg/[0.06] md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="size-4.5" aria-hidden="true" /> : <Menu className="size-4.5" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[55] flex flex-col bg-bg/95 px-6 pb-8 pt-24 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.3 }}
          >
            <button
              type="button"
              onClick={closeMenu}
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-line"
              aria-label="Close menu"
            >
              <X className="size-4.5" aria-hidden="true" />
            </button>
            <motion.ul
              className="flex flex-col"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } } }}
            >
              {navItems.map((item) => (
                <motion.li
                  key={item.id}
                  className="overflow-hidden border-b border-line"
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_SIGNAL } },
                  }}
                >
                  <Link
                    href={`/#${item.id}`}
                    onClick={(e) => onAnchor(e, item.id)}
                    className="flex items-baseline justify-between py-4"
                  >
                    <span className="text-[2.1rem] font-medium tracking-[-0.04em]">{item.label}</span>
                    <span className="label-mono text-muted">{item.index}</span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              className="mt-auto flex flex-col gap-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.6, ease: EASE_SIGNAL } }}
            >
              <a
                href={profile.resume}
                download="Parth-Challawar-Resume.pdf"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent text-accent-fg"
              >
                <FileDown className="size-4" aria-hidden="true" /> Download résumé
              </a>
              <div className="flex items-center justify-between">
                <a href={`mailto:${profile.email}`} className="truncate font-mono text-xs text-muted">
                  {profile.email}
                </a>
                <div className="flex gap-2">
                  {profile.socials.map((s) => (
                    <a
                      key={s.key}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} (opens in new tab)`}
                      className="grid size-10 place-items-center rounded-full border border-line text-muted"
                    >
                      <SocialIcon name={s.key} className="size-4" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/** Map non-nav sections to the nearest preceding nav item. */
function nearestNav(id: string) {
  const idx = sections.findIndex((s) => s.id === id);
  for (let i = idx; i >= 0; i--) if (sections[i].nav) return sections[i].id;
  return null;
}
