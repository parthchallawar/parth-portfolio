"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uPixelRatio;
  uniform float uSize;
  attribute float aSeed;
  attribute float aScale;
  varying float vNear;
  varying float vDepth;

  void main() {
    vec3 p = position;
    float t = uTime * 0.07;
    p.x += sin(t + aSeed * 6.2831 + p.y * 0.35) * 0.22;
    p.y += cos(t * 0.9 + aSeed * 4.0 + p.x * 0.3) * 0.16;
    p.z += sin(t * 0.7 + aSeed * 3.0) * 0.25;

    vec2 d = p.xy - uPointer;
    float dist = length(d);
    float f = smoothstep(1.9, 0.0, dist) * uPointerStrength;
    p.xy += normalize(d + vec2(1e-4)) * f * 0.75;
    p.z += f * 0.6;
    vNear = f;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -mv.z) * (1.0 + f * 0.8);
    vDepth = smoothstep(-12.0, -4.0, mv.z);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uAccent;
  uniform float uOpacity;
  varying float vNear;
  varying float vDepth;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.05, d);
    float near = clamp(vNear * 1.8, 0.0, 1.0);
    vec3 col = mix(uBase, uAccent, near);
    gl_FragColor = vec4(col, a * uOpacity * (0.35 + 0.65 * vDepth) * (1.0 + near * 1.2));
  }
`;

function Field({ count, dark }: { count: number; dark: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, gl } = useThree();
  const pointer = useRef({ nx: 0, ny: 0, inside: false });
  const smooth = useRef(new THREE.Vector2(0, 0));

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const scale = new Float32Array(count);
    // Deterministic pseudo-random so the field looks the same each visit.
    let s = 1337;
    const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rnd() - 0.5) * 18;
      pos[i * 3 + 1] = (rnd() - 0.5) * 10;
      pos[i * 3 + 2] = -rnd() * 5 + 1.2;
      seed[i] = rnd();
      scale[i] = 0.5 + Math.pow(rnd(), 3) * 1.6;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uPointerStrength: { value: 0 },
          uPixelRatio: { value: 1 },
          uSize: { value: 26 },
          uBase: { value: new THREE.Color() },
          uAccent: { value: new THREE.Color() },
          uOpacity: { value: 0.6 },
        },
      }),
    [],
  );

  useEffect(() => {
    material.uniforms.uBase.value.set(dark ? "#8a8f98" : "#3a3d44");
    material.uniforms.uAccent.value.set(dark ? "#c6f432" : "#4d7c0f");
    material.uniforms.uOpacity.value = dark ? 0.62 : 0.42;
    material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    material.needsUpdate = true;
  }, [dark, material]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useEffect(() => {
    const canvas = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      pointer.current.inside = inside;
      pointer.current.nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const onLeave = () => {
      pointer.current.inside = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    const p = pointer.current;
    const target = new THREE.Vector2((p.nx * viewport.width) / 2, (p.ny * viewport.height) / 2);
    smooth.current.lerp(target, 1 - Math.exp(-delta * 6));
    u.uPointer.value.copy(smooth.current);
    const strengthTarget = p.inside ? 1 : 0;
    u.uPointerStrength.value += (strengthTarget - u.uPointerStrength.value) * (1 - Math.exp(-delta * 3));
    if (group.current) {
      group.current.rotation.y += (p.nx * 0.06 - group.current.rotation.y) * (1 - Math.exp(-delta * 2));
      group.current.rotation.x += (-p.ny * 0.04 - group.current.rotation.x) * (1 - Math.exp(-delta * 2));
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

export default function HeroField({ active }: { active: boolean }) {
  const { resolvedTheme } = useTheme();
  const count = useMemo(() => (typeof window !== "undefined" && window.innerWidth < 768 ? 1200 : 4000), []);
  return (
    <Canvas
      aria-hidden="true"
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <Field count={count} dark={resolvedTheme !== "light"} />
    </Canvas>
  );
}
