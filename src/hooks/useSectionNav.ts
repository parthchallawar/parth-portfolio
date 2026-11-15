"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

/** Go to a home-page section: smooth-scroll when already on "/", otherwise navigate to "/#id". */
export function useSectionNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollTo } = useSmoothScroll();

  return useCallback(
    (id: string) => {
      if (pathname === "/") {
        if (id === "top") scrollTo(0);
        else scrollTo(`#${id}`);
        history.replaceState(null, "", id === "top" ? "/" : `/#${id}`);
      } else {
        router.push(id === "top" ? "/" : `/#${id}`);
      }
    },
    [pathname, router, scrollTo],
  );
}
