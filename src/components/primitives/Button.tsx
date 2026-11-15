import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "accent" | "ghost" | "icon" | "link";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,border-color,color,box-shadow] duration-300 ease-[var(--ease-signal)] focus-visible:outline-2 focus-visible:outline-offset-3 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  accent:
    "h-12 rounded-full bg-accent px-6 text-[0.9375rem] text-accent-fg shadow-[0_0_0_1px_var(--accent),0_8px_30px_-8px_color-mix(in_oklab,var(--accent)_55%,transparent)] hover:shadow-[0_0_0_1px_var(--accent),0_12px_40px_-6px_color-mix(in_oklab,var(--accent)_70%,transparent)]",
  ghost:
    "h-12 rounded-full border border-line-strong bg-transparent px-6 text-[0.9375rem] text-fg hover:border-fg/40 hover:bg-fg/[0.04]",
  icon: "size-11 rounded-full border border-line-strong text-fg hover:border-accent hover:text-accent",
  link: "h-auto rounded-sm px-0 text-sm text-fg underline-offset-4 hover:text-accent",
};

export function buttonClass(variant: Variant = "accent", className?: string) {
  return cn(base, variants[variant], className);
}

type CommonProps = { variant?: Variant; className?: string; children: ReactNode };

/** Internal route or same-page anchor. */
export function ButtonLink({
  href,
  variant = "accent",
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children">) {
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

/** External or file link. */
export function ButtonA({
  variant = "accent",
  className,
  children,
  external,
  ...rest
}: CommonProps & Omit<ComponentPropsWithoutRef<"a">, "className" | "children"> & { external?: boolean }) {
  return (
    <a
      className={buttonClass(variant, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

export function Button({
  variant = "accent",
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">) {
  return (
    <button type={type} className={buttonClass(variant, className)} {...rest}>
      {children}
    </button>
  );
}
