"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useTheme } from "next-themes";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ConstellationEdge, ConstellationNode } from "@/lib/skills";
import type { SkillCategoryId } from "@/content/skills";

type Props = {
  nodes: ConstellationNode[];
  edges: ConstellationEdge[];
  clusters: { id: SkillCategoryId; label: string; x: number; y: number; z: number }[];
  activeSkill: string | null;
  activeCategory: SkillCategoryId;
  onHover: (id: string | null) => void;
  active: boolean;
};

const palette = {
  dark: { fg: "#edeef0", muted: "#5b606a", dim: "#2a2e36", accent: "#c6f432" },
  light: { fg: "#111214", muted: "#8f939b", dim: "#d6d3cc", accent: "#4d7c0f" },
};

const radius = { production: 0.085, shipped: 0.065, foundation: 0.045 } as const;

function Scene({ nodes, edges, clusters, activeSkill, activeCategory, onHover, dark }: Omit<Props, "active"> & { dark: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const c = dark ? palette.dark : palette.light;
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const neighbours = useMemo(() => {
    const set = new Set<string>();
    if (!activeSkill) return set;
    for (const e of edges) {
      if (e.a === activeSkill) set.add(e.b);
      if (e.b === activeSkill) set.add(e.a);
    }
    return set;
  }, [activeSkill, edges]);

  const baseGeom = useMemo(() => {
    const arr: number[] = [];
    for (const e of edges) {
      const a = byId.get(e.a);
      const b = byId.get(e.b);
      if (!a || !b) continue;
      arr.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    return g;
  }, [edges, byId]);

  const hiGeom = useMemo(() => {
    const arr: number[] = [];
    if (activeSkill) {
      for (const e of edges) {
        if (e.a !== activeSkill && e.b !== activeSkill) continue;
        const a = byId.get(e.a);
        const b = byId.get(e.b);
        if (!a || !b) continue;
        arr.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    return g;
  }, [activeSkill, edges, byId]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.05;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.05;
    const k = 1 - Math.exp(-delta * 2.5);
    const targetY = Math.sin(t * 0.12) * 0.22 + pointer.current.x * 0.18;
    const targetX = -pointer.current.y * 0.18;
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
  });

  const hovered = activeSkill ? byId.get(activeSkill) : undefined;

  return (
    <group ref={group}>
      <lineSegments geometry={baseGeom}>
        <lineBasicMaterial color={c.muted} transparent opacity={activeSkill ? 0.12 : 0.28} depthWrite={false} />
      </lineSegments>
      <lineSegments geometry={hiGeom}>
        <lineBasicMaterial color={c.accent} transparent opacity={0.9} depthWrite={false} />
      </lineSegments>

      {nodes.map((n) => {
        const isActive = n.id === activeSkill;
        const isNeighbour = neighbours.has(n.id);
        const inCategory = n.category === activeCategory;
        const color = isActive || isNeighbour ? c.accent : inCategory ? c.fg : c.muted;
        const scale = isActive ? 1.7 : isNeighbour ? 1.2 : 1;
        return (
          <group key={n.id} position={[n.x, n.y, n.z]}>
            <mesh scale={scale}>
              <sphereGeometry args={[radius[n.level], 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={activeSkill && !isActive && !isNeighbour ? 0.45 : 1} />
            </mesh>
            {/* Larger invisible hit area */}
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                onHover(n.id);
              }}
              onPointerOut={() => onHover(null)}
            >
              <sphereGeometry args={[0.16, 8, 8]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        );
      })}

      {clusters.map((cl) => (
        <Html key={cl.id} position={[cl.x * 1.2, cl.y * 1.3, cl.z]} center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
          <span
            className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] ${
              cl.id === activeCategory ? "text-fg" : "text-muted"
            }`}
          >
            {cl.label}
          </span>
        </Html>
      ))}

      {hovered ? (
        <Html position={[hovered.x, hovered.y + 0.22, hovered.z]} center zIndexRange={[20, 10]} style={{ pointerEvents: "none" }}>
          <span className="whitespace-nowrap rounded-full border border-accent/40 bg-surface px-2.5 py-1 font-mono text-[11px] text-fg shadow-lg">
            {hovered.name}
          </span>
        </Html>
      ) : null}
    </group>
  );
}

export default function SkillConstellation(props: Props) {
  const { resolvedTheme } = useTheme();
  const { active, ...rest } = props;
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onPointerMissed={() => props.onHover(null)}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene {...rest} dark={resolvedTheme !== "light"} />
    </Canvas>
  );
}
