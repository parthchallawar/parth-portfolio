/**
 * Coordinates the first-visit loader with the hero reveal.
 * The loader sets `html.loading` before first paint (inline script in layout);
 * when it finishes it removes that class and dispatches `intro:done`.
 */
export const INTRO_EVENT = "intro:done";
export const INTRO_KEY = "pc-intro-seen";

export function onIntroDone(cb: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  const html = document.documentElement;
  if (!html.classList.contains("loading") || html.dataset.intro === "done") {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(INTRO_EVENT, handler, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, handler);
}

/** Runs before paint. Kept tiny and dependency-free. */
export const bootScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(rm){d.classList.add('reduce-motion')}var seen=false;try{seen=!!sessionStorage.getItem('${INTRO_KEY}')}catch(e){}if(!rm&&!seen){d.classList.add('loading')}}catch(e){}})();`;
