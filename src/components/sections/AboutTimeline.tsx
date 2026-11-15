"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type KeyboardEvent } from "react";
import type { TimelineStop } from "@/content/profile";
import { EASE_SIGNAL } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Dot position along the rail: first/last stops sit at the edges, the rest are column-centred. */
function railPos(i: number, n: number) {
  if (n <= 1 || i === n - 1) return 1;
  if (i === 0) return 0;
  return (i + 0.5) / n;
}

/** Four-stop horizontal timeline. Hover, click or arrow keys swap the detail panel. */
export function AboutTimeline({ stops }: { stops: TimelineStop[] }) {
  const [active, setActive] = useState(stops.length - 2);
  const id = useId();
  const current = stops[active];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % stops.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + stops.length) % stops.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = stops.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <div className="mt-20 md:mt-28">
      <div className="relative">
        {/* rail */}
        <div aria-hidden="true" className="absolute left-0 right-0 top-[7px] h-px bg-line" />
        <motion.div
          aria-hidden="true"
          className="absolute left-0 top-[7px] h-px origin-left bg-accent"
          style={{ width: "100%" }}
          initial={false}
          animate={{ scaleX: railPos(active, stops.length) }}
          transition={{ duration: 0.7, ease: EASE_SIGNAL }}
        />
        <div role="tablist" aria-label="Milestones" className="relative grid grid-cols-4">
          {stops.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.id}
                id={`${id}-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`${id}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "group relative flex flex-col items-start gap-3 pb-1 text-left outline-offset-8",
                  i === stops.length - 1 && "items-end text-right",
                  i > 0 && i < stops.length - 1 && "items-center text-center",
                )}
              >
                <span
                  className={cn(
                    "relative grid size-[15px] place-items-center rounded-full border bg-bg transition-colors duration-300",
                    i <= active ? "border-accent" : "border-line-strong group-hover:border-fg/50",
                  )}
                >
                  <span
                    className={cn(
                      "size-[5px] rounded-full transition-colors duration-300",
                      isActive ? "bg-accent" : i < active ? "bg-accent/60" : "bg-transparent",
                    )}
                  />
                </span>
                <span className="label-mono text-muted">{s.date ?? s.marker}</span>
                <span
                  className={cn(
                    "relative hidden text-sm transition-colors sm:block",
                    isActive ? "text-fg" : "text-muted group-hover:text-fg",
                  )}
                >
                  {s.title}
                  {isActive ? (
                    <motion.span
                      layoutId={`${id}-underline`}
                      className="absolute -bottom-1.5 left-0 right-0 h-px bg-accent"
                      transition={{ duration: 0.5, ease: EASE_SIGNAL }}
                    />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        className="relative mt-10 min-h-[7.5rem] overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE_SIGNAL }}
            className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-8"
          >
            <p className="label-mono pt-1 text-accent">
              {current.date ? current.date : current.marker}
            </p>
            <div>
              <h3 className="text-lg font-medium tracking-tight">{current.title}</h3>
              <p className="mt-2 max-w-2xl text-pretty text-[0.95rem] leading-relaxed text-muted">{current.detail}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
