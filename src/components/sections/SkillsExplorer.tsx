"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useId, useState, type KeyboardEvent } from "react";
import type { SkillCategory, SkillCategoryId } from "@/content/skills";
import { evidenceLevels } from "@/content/skills";
import type { ConstellationEdge, ConstellationNode, SkillWithEvidence } from "@/lib/skills";
import { CanvasGate } from "@/components/three/CanvasGate";
import { ConstellationStatic } from "@/components/three/ConstellationStatic";
import { EASE_SIGNAL } from "@/lib/motion";
import { cn } from "@/lib/cn";

const SkillConstellation = dynamic(() => import("@/components/three/SkillConstellation"), { ssr: false });

type Cluster = { id: SkillCategoryId; label: string; x: number; y: number; z: number };

export function SkillsExplorer({
  categories,
  skills,
  nodes,
  edges,
  clusters,
}: {
  categories: SkillCategory[];
  skills: SkillWithEvidence[];
  nodes: ConstellationNode[];
  edges: ConstellationEdge[];
  clusters: Cluster[];
}) {
  const [category, setCategory] = useState<SkillCategoryId>("backend");
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const id = useId();
  const visible = skills.filter((s) => s.category === category);
  const onHover = useCallback((skillId: string | null) => setActiveSkill(skillId), []);

  // Hovering a node in another category switches the tab so its card is visible.
  const onNodeHover = useCallback(
    (skillId: string | null) => {
      setActiveSkill(skillId);
      if (skillId) {
        const s = skills.find((k) => k.id === skillId);
        if (s && s.category !== category) setCategory(s.category);
      }
    },
    [skills, category],
  );

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % categories.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + categories.length) % categories.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = categories.length - 1;
    else return;
    e.preventDefault();
    setCategory(categories[next].id);
    document.getElementById(`${id}-tab-${categories[next].id}`)?.focus();
  };

  const constellationProps = { nodes, edges, clusters, activeSkill, activeCategory: category };

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      <div className="min-w-0 lg:col-span-7">
        <div
          role="tablist"
          aria-label="Skill categories"
          className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c, i) => {
            const selected = c.id === category;
            return (
              <button
                key={c.id}
                id={`${id}-tab-${c.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setCategory(c.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cn(
                  "relative isolate shrink-0 rounded-full px-4 py-2 text-sm transition-colors",
                  selected ? "text-accent-fg" : "text-muted hover:text-fg",
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId={`${id}-pill`}
                    className="absolute inset-0 -z-10 rounded-full bg-accent"
                    transition={{ duration: 0.5, ease: EASE_SIGNAL }}
                  />
                ) : (
                  <span className="absolute inset-0 -z-10 rounded-full border border-line" aria-hidden="true" />
                )}
                <span className="relative">{c.label}</span>
              </button>
            );
          })}
        </div>

        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${category}`} className="mt-8">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.ul
              key={category}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }}
            >
              {visible.map((s) => (
                <motion.li
                  key={s.id}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_SIGNAL } },
                  }}
                >
                  <SkillCard skill={s} active={activeSkill === s.id} onHover={onHover} />
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        <dl className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted">
          {(["production", "shipped", "foundation"] as const).map((lvl) => (
            <div key={lvl} className="flex items-center gap-2.5">
              <dt>
                <Meter rank={evidenceLevels[lvl].rank} />
                <span className="sr-only">{evidenceLevels[lvl].label}</span>
              </dt>
              <dd>
                <span className="text-fg">{evidenceLevels[lvl].label}</span> — {evidenceLevels[lvl].description}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="lg:col-span-5">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <span className="label-mono text-muted">Constellation</span>
            <span className="label-mono text-muted">{nodes.length} nodes · {edges.length} edges</span>
          </div>
          <div aria-hidden="true">
            <CanvasGate
              className="aspect-[6/5] w-full"
              minWidth={768}
              fallback={
                <ConstellationStatic
                  {...constellationProps}
                  onHover={onNodeHover}
                  className="absolute inset-0 p-2"
                />
              }
            >
              {(active) => <SkillConstellation {...constellationProps} onHover={onNodeHover} active={active} />}
            </CanvasGate>
          </div>
          <p className="border-t border-line px-5 py-3.5 text-xs leading-relaxed text-muted">
            One node per skill, clustered by category. Lines join skills used together in the same project or role.
            Hover a card to trace it.
          </p>
        </div>
      </div>
    </div>
  );
}

function Meter({ rank }: { rank: 1 | 2 | 3 }) {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <span key={n} className={cn("h-1.5 w-3 rounded-[1px]", n <= rank ? "bg-accent" : "bg-line-strong")} />
      ))}
    </span>
  );
}

function SkillCard({
  skill,
  active,
  onHover,
}: {
  skill: SkillWithEvidence;
  active: boolean;
  onHover: (id: string | null) => void;
}) {
  const tipId = useId();
  const lvl = evidenceLevels[skill.level];
  const where = skill.usedIn.length ? skill.usedIn.join(" · ") : "Coursework & practice";
  return (
    <div
      tabIndex={0}
      aria-describedby={tipId}
      onMouseEnter={() => onHover(skill.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(skill.id)}
      onBlur={() => onHover(null)}
      className={cn(
        "group relative flex h-full flex-col gap-4 rounded-xl border bg-surface p-4 outline-none transition-colors duration-300 focus-visible:border-accent",
        active ? "border-accent/60" : "border-line hover:border-line-strong",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[0.95rem] leading-snug text-fg">{skill.name}</span>
        <span
          className={cn(
            "mt-1 size-1.5 shrink-0 rounded-full transition-colors",
            active ? "bg-accent" : "bg-line-strong",
          )}
          aria-hidden="true"
        />
      </div>
      <div className="mt-auto flex items-center justify-between gap-3">
        <Meter rank={skill.rank} />
        <span className="label-mono text-muted">{lvl.label}</span>
      </div>
      <div
        id={tipId}
        role="tooltip"
        className="pointer-events-none absolute inset-x-2 bottom-[calc(100%+6px)] z-20 translate-y-1 rounded-lg border border-line-strong bg-bg px-3 py-2 text-xs leading-snug text-fg opacity-0 shadow-xl transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        <span className="text-accent">{lvl.label}</span>
        <span className="text-muted"> · {where}</span>
      </div>
    </div>
  );
}
