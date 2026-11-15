import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[80svh] flex-col justify-center pb-16 pt-32">
      <p className="label-mono flex items-center gap-2 text-muted">
        <span className="inline-block size-2 rounded-full bg-danger" aria-hidden="true" />
        404 · route not found
      </p>
      <h1 className="mt-6 text-[clamp(3rem,10vw,8rem)] font-medium leading-[0.9] tracking-[-0.05em]">
        Nothing <em className="font-serif font-normal">verified</em> here.
      </h1>
      <div className="mt-10 max-w-lg rounded-2xl border border-line bg-surface p-5 font-mono text-xs leading-relaxed text-muted">
        <p>
          <span className="text-fg">GET</span> {"<this path>"} <span className="text-fg">→ 404</span>
        </p>
        <p>lookup: no matching page · no cached copy</p>
        <p className="text-accent">suggestion: return to index</p>
      </div>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 items-center gap-2 self-start rounded-full bg-accent px-6 text-[0.9375rem] font-medium text-accent-fg"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back home
      </Link>
    </div>
  );
}
