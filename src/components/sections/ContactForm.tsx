"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { EASE_SIGNAL } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "sent" | "mailto" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Please enter a valid email address.";
  if (f.message.trim().length < 10) e.message = "A little more detail, please (10+ characters).";
  else if (f.message.length > 5000) e.message = "Please keep it under 5000 characters.";
  return e;
}

export function ContactForm({ email }: { email: string }) {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const errors = validate(fields);
  const uid = useId();

  const set = (k: keyof Fields) => (v: string) => setFields((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errors).length) {
      const first = (["name", "email", "message"] as const).find((k) => errors[k]);
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    const honeypot = (new FormData(e.currentTarget).get("company") as string | null) ?? "";
    setStatus("sending");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, company: honeypot }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; fallback?: string; error?: string };
      if (res.ok && json.fallback === "mailto") {
        const subject = encodeURIComponent(`Hello from ${fields.name.trim()}`);
        const body = encodeURIComponent(`${fields.message.trim()}\n\n— ${fields.name.trim()} (${fields.email.trim()})`);
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        setStatus("mailto");
        return;
      }
      if (res.ok && json.ok) {
        setStatus("sent");
        setFields({ name: "", email: "", message: "" });
        setTouched({});
        return;
      }
      throw new Error(json.error || "Something went wrong.");
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const done = status === "sent" || status === "mailto";

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-4" aria-describedby={`${uid}-status`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={`${uid}-name`}
          label="Name"
          name="name"
          autoComplete="name"
          value={fields.name}
          onChange={set("name")}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          error={touched.name ? errors.name : undefined}
        />
        <Field
          id={`${uid}-email`}
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={set("email")}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={touched.email ? errors.email : undefined}
        />
      </div>
      <Field
        id={`${uid}-message`}
        label="Message"
        name="message"
        multiline
        value={fields.message}
        onChange={set("message")}
        onBlur={() => setTouched((t) => ({ ...t, message: true }))}
        error={touched.message ? errors.message : undefined}
      />

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input id={`${uid}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-4">
        <motion.button
          layout
          type="submit"
          disabled={status === "sending" || done}
          aria-label={done ? "Message sent" : undefined}
          transition={{ layout: { duration: 0.5, ease: EASE_SIGNAL } }}
          className={cn(
            "relative inline-flex h-12 items-center justify-center overflow-hidden bg-accent font-medium text-accent-fg disabled:cursor-default",
            done ? "w-12 rounded-full" : "rounded-full px-6",
          )}
          style={{ borderRadius: 999 }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {done ? (
              <motion.svg
                key="check"
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                aria-hidden="true"
              >
                <motion.path
                  d="M5 12.5 10 17.5 19 7"
                  className="stroke-accent-fg"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.25, ease: EASE_SIGNAL }}
                />
              </motion.svg>
            ) : (
              <motion.span
                key="label"
                className="inline-flex items-center gap-2 whitespace-nowrap text-[0.9375rem]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Sending…
                  </>
                ) : (
                  <>
                    Send message <ArrowRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <p id={`${uid}-status`} role="status" aria-live="polite" className="text-sm text-muted">
          {status === "sent" && "Sent — thank you. I’ll get back to you soon."}
          {status === "mailto" && "Opening your mail app with the message filled in."}
          {status === "error" && (
            <span className="text-danger">
              {serverError} You can also email{" "}
              <a href={`mailto:${email}`} className="underline underline-offset-4">
                {email}
              </a>
              .
            </span>
          )}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  multiline,
  autoComplete,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const errId = `${id}-error`;
  const common = {
    id,
    name,
    value,
    placeholder: " ",
    onBlur,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errId : undefined,
    className: cn(
      "peer block w-full rounded-xl border bg-bg px-4 pb-2.5 pt-6 text-[0.95rem] text-fg outline-none transition-colors placeholder:text-transparent focus:border-accent",
      error ? "border-danger/70" : "border-line hover:border-line-strong",
      multiline && "min-h-40 resize-y",
    ),
  };
  return (
    <div className="relative">
      {multiline ? (
        <textarea {...common} rows={5} onChange={(e) => onChange(e.target.value)} data-lenis-prevent />
      ) : (
        <input {...common} type={type} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-2.5 origin-left font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted transition-[translate,scale,color] duration-300 ease-[var(--ease-signal)] peer-placeholder-shown:translate-y-[0.6rem] peer-placeholder-shown:scale-[1.3] peer-focus:translate-y-0 peer-focus:scale-100 peer-focus:text-accent"
      >
        {label}
      </label>
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            id={errId}
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 text-xs text-danger"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
