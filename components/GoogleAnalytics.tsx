"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      
      window.gtag("config", "G-D5902DZPG6", {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
