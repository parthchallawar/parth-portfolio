"use client";

import { useMemo } from "react";
import type { ConstellationEdge, ConstellationNode } from "@/lib/skills";
import type { SkillCategoryId } from "@/content/skills";
import { cn } from "@/lib/cn";

const W = 600;
const H = 420;
const px = (x: number) => ((x + 3.3) / 6.6) * (W - 60) + 30;
const py = (y: number) => ((-y + 2.25) / 4.5) * (H - 60) + 30;
const r = { production: 5.5, shipped: 4.2, foundation: 3 } as const;

/**
 * 2D projection of the same layout used by the WebGL constellation. Used below 768px,
 * under reduced motion and on low-end devices. Still interactive (hover/focus sync).
 */
export function ConstellationStatic({
  nodes,
  edges,
  clusters,
  activeSkill,
  activeCategory,
  onHover,
  className,
}: {
  nodes: ConstellationNode[];
  edges: ConstellationEdge[];
  clusters: { id: SkillCategoryId; label: string; x: number; y: number }[];
  activeSkill: string | null;
  activeCategory: SkillCategoryId;
  onHover: (id: string | null) => void;
  className?: string;
}) {
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const neighbours = useMemo(() => {
    const s = new Set<string>();
    if (!activeSkill) return s;
    edges.forEach((e) => {
      if (e.a === activeSkill) s.add(e.b);
      if (e.b === activeSkill) s.add(e.a);
    });
    return s;
  }, [activeSkill, edges]);
  const hovered = activeSkill ? byId.get(activeSkill) : undefined;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("h-full w-full", className)} aria-hidden="true">
      <g>
        {edges.map((e) => {
          const a = byId.get(e.a);
          const b = byId.get(e.b);
          if (!a || !b) return null;
          const hi = activeSkill && (e.a === activeSkill || e.b === activeSkill);
          return (
            <line
              key={`${e.a}-${e.b}`}
              x1={px(a.x)}
              y1={py(a.y)}
              x2={px(b.x)}
              y2={py(b.y)}
              className={cn(
                "transition-[stroke-opacity] duration-300",
                hi ? "stroke-accent" : "stroke-muted",
              )}
              strokeOpacity={hi ? 0.95 : activeSkill ? 0.08 : 0.2}
              strokeWidth={hi ? 1.2 : 0.75}
            />
          );
        })}
      </g>
      {clusters.map((c) => (
        <text
          key={c.id}
          x={px(c.x * 1.34)}
          y={py(c.y * 1.4)}
          textAnchor="middle"
          dominantBaseline="middle"
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.1em]",
            c.id === activeCategory ? "fill-fg" : "fill-muted",
          )}
        >
          {c.label}
        </text>
      ))}
      {nodes.map((n) => {
        const isActive = n.id === activeSkill;
        const near = neighbours.has(n.id);
        const inCat = n.category === activeCategory;
        return (
          <g key={n.id} onPointerEnter={() => onHover(n.id)} onPointerLeave={() => onHover(null)}>
            <circle cx={px(n.x)} cy={py(n.y)} r={14} fill="transparent" />
            <circle
              cx={px(n.x)}
              cy={py(n.y)}
              r={r[n.level] * (isActive ? 1.6 : 1)}
              className={cn(
                "transition-all duration-300",
                isActive || near ? "fill-accent" : inCat ? "fill-fg" : "fill-muted",
              )}
              fillOpacity={activeSkill && !isActive && !near ? 0.4 : 1}
            />
            {isActive ? (
              <circle cx={px(n.x)} cy={py(n.y)} r={r[n.level] * 3} className="fill-none stroke-accent" strokeOpacity={0.4} />
            ) : null}
          </g>
        );
      })}
      {hovered ? (
        <g transform={`translate(${px(hovered.x)} ${py(hovered.y) - 20})`} className="pointer-events-none">
          <text textAnchor="middle" className="fill-fg font-mono text-[11px]">
            {hovered.name}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
