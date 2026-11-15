"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { Experience } from "@/content/experience";
import { Badge, Tick } from "@/components/primitives/Badge";
import { PrintBridgeDiagram } from "@/components/visuals/PrintBridgeDiagram";
import { EASE_SIGNAL } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function ExperienceCard({ item }: { item: Experience }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <article className="relative rounded-3xl border border-line bg-surface p-6 sm:p-9">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="label-mono text-muted">
            {item.start} — {item.end} · {item.location}
          </p>
          <h3 className="text-h3 mt-4">
            {item.role} <span className="text-muted">@</span> {item.company}
          </h3>
          <p className="mt-2 text-[0.95rem] text-muted">{item.summary}</p>
        </div>
        <span className="label-mono inline-flex items-center gap-2 self-start rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-accent">
          <span className="status-dot relative inline-block size-1.5 rounded-full bg-accent" aria-hidden="true" />
          In production
        </span>
      </div>

      <ul className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
        {item.metrics.map((m) => (
          <li key={m.label} className="bg-bg px-3 py-4 sm:px-5">
            <span className="block text-[clamp(1.35rem,3vw,2rem)] font-medium leading-none tracking-[-0.04em]">
              {m.value}
            </span>
            <span className="mt-2 block font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-muted">
              {m.label}
            </span>
          </li>
        ))}
      </ul>

      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack">
        {item.stack.map((s) => (
          <li key={s}>
            <Badge>{s}</Badge>
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="group mt-8 flex w-full items-center justify-between rounded-xl border border-line px-4 py-3 text-left text-sm transition-colors hover:border-line-strong"
      >
        <span>{open ? "Hide details" : "What I built"}</span>
        <ChevronDown
          className={cn("size-4 text-muted transition-transform duration-500", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_SIGNAL }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 pt-8 lg:grid-cols-2">
              <ul className="space-y-5">
                {item.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-3 text-[0.95rem] leading-relaxed text-fg/90"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: EASE_SIGNAL }}
                  >
                    <Tick className="mt-1.5 text-accent" />
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="rounded-2xl border border-line bg-bg p-4 sm:p-5">
                <PrintBridgeDiagram />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}
