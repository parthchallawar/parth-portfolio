"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSectionNav } from "@/hooks/useSectionNav";

/** Link to a home-page section that smooth-scrolls through Lenis when already on "/". */
export function SectionLink({
  section,
  className,
  children,
  cursor,
}: {
  section: string;
  className?: string;
  children: ReactNode;
  cursor?: string;
}) {
  const go = useSectionNav();
  return (
    <Link
      href={`/#${section}`}
      className={className}
      data-cursor={cursor}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(section);
      }}
    >
      {children}
    </Link>
  );
}
