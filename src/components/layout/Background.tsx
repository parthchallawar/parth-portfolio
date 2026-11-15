/** Fixed, pure-CSS background: two slow radial drifts, a faint dot grid and SVG noise. */
export function Background() {
  return (
    <div className="bg-field" aria-hidden="true">
      <div className="bg-grid" />
      <div className="bg-noise" />
    </div>
  );
}

export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-[300] -translate-y-24 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-transform focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}
