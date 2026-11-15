/**
 * Tiny helpers for synchronised SMIL animation. Every animation in a visual shares one
 * loop duration, so they stay in lock-step and can be paused / seeked together via
 * SVGSVGElement.pauseAnimations() / setCurrentTime().
 */

export const EASE_OUT = "0.16 1 0.3 1";
export const EASE_IN_OUT = "0.65 0 0.35 1";
export const LINEAR = "0 0 1 1";

const r = (n: number) => Math.round(n * 10000) / 10000;

function splines(n: number, ease: string | string[]) {
  if (Array.isArray(ease)) return ease.join(";");
  return Array.from({ length: n }, () => ease).join(";");
}

function check(times: number[]) {
  if (process.env.NODE_ENV !== "production") {
    if (times[0] !== 0 || times[times.length - 1] !== 1)
      throw new Error(`keyTimes must start at 0 and end at 1: ${times.join(",")}`);
    for (let i = 1; i < times.length; i++)
      if (times[i] < times[i - 1]) throw new Error(`keyTimes must be increasing: ${times.join(",")}`);
  }
}

/** Animate a numeric attribute (usually opacity). */
export function Anim({
  attr = "opacity",
  values,
  times,
  dur,
  ease = EASE_OUT,
}: {
  attr?: string;
  values: (number | string)[];
  times: number[];
  dur: number;
  ease?: string | string[];
}) {
  check(times);
  return (
    <animate
      attributeName={attr}
      values={values.join(";")}
      keyTimes={times.map(r).join(";")}
      keySplines={splines(times.length - 1, ease)}
      calcMode="spline"
      dur={`${dur}s`}
      repeatCount="indefinite"
    />
  );
}

/** Animate a translate transform. */
export function Move({
  values,
  times,
  dur,
  ease = EASE_OUT,
}: {
  values: [number, number][];
  times: number[];
  dur: number;
  ease?: string | string[];
}) {
  check(times);
  return (
    <animateTransform
      attributeName="transform"
      type="translate"
      values={values.map(([x, y]) => `${x} ${y}`).join(";")}
      keyTimes={times.map(r).join(";")}
      keySplines={splines(times.length - 1, ease)}
      calcMode="spline"
      dur={`${dur}s`}
      repeatCount="indefinite"
    />
  );
}

/** Move an element's origin along a path; `points` are 0..1 distances along it. */
export function Along({
  path,
  points,
  times,
  dur,
  ease = EASE_IN_OUT,
}: {
  path: string;
  points: number[];
  times: number[];
  dur: number;
  ease?: string | string[];
}) {
  check(times);
  return (
    <animateMotion
      path={path}
      keyPoints={points.map(r).join(";")}
      keyTimes={times.map(r).join(";")}
      keySplines={splines(times.length - 1, ease)}
      calcMode="spline"
      dur={`${dur}s`}
      repeatCount="indefinite"
    />
  );
}

/** Opacity window: hidden → visible at `a` → hidden at `b`. */
export function Show({
  a,
  b,
  dur,
  f = 0.018,
  from = 0,
  to = 1,
}: {
  a: number;
  b: number;
  dur: number;
  f?: number;
  from?: number;
  to?: number;
}) {
  const t1 = Math.max(0.0001, a);
  const t2 = Math.min(0.9998, a + f);
  const t3 = Math.max(t2, Math.min(0.9998, b));
  const t4 = Math.min(0.9999, Math.max(t3, b + f));
  return <Anim values={[from, from, to, to, from, from]} times={[0, t1, t2, t3, t4, 1]} dur={dur} />;
}
