"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Programmatically scrolls smoothly to a target section on the landing page.
 * If currently on the homepage, executes smooth window scrolling without page jump.
 * If on another page, navigates to homepage with section param and handles scroll after mount.
 */
export function scrollToSection(
  sectionId: string,
  pathname: string,
  router?: AppRouterInstance
) {
  if (typeof window === "undefined") return;

  if (pathname === "/") {
    const el = document.getElementById(sectionId);
    if (el) {
      const targetTop = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
      // Optionally update url hash cleanly without jump
      window.history.replaceState(null, "", `#${sectionId}`);
      return;
    }
  }

  // Navigate to root with section query
  const targetUrl = `/?section=${encodeURIComponent(sectionId)}`;
  if (router) {
    router.push(targetUrl);
  } else {
    window.location.href = targetUrl;
  }
}
