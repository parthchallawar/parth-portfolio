"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { copyText } from "@/lib/actions";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`mailto:${email}`}
        className="break-all font-mono text-[clamp(0.85rem,1.6vw,1.05rem)] text-fg underline decoration-line-strong underline-offset-[6px] transition-colors hover:decoration-accent"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={async () => setCopied(await copyText(email))}
        className="relative inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-muted transition-colors hover:border-line-strong hover:text-fg"
        aria-label={copied ? "Email copied" : "Copy email address"}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {copied ? (
            <motion.span key="ok" className="inline-flex items-center gap-1.5 text-accent" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <Check className="size-3.5" aria-hidden="true" /> Copied
            </motion.span>
          ) : (
            <motion.span key="copy" className="inline-flex items-center gap-1.5" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <Copy className="size-3.5" aria-hidden="true" /> Copy
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
