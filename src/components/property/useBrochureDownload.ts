"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type BrochureState = "idle" | "preparing" | "gone" | "error";

/**
 * Buyer brochure download. `/api/backend/public/<token>/pdf` answers 302 (file is ready: the browser then follows it)
 * or 202 `{status:"preparing", retryAfter}` while the PDF is being made, so we poll until it is ready.
 */
export function useBrochureDownload(token: string) {
  const [state, setState] = useState<BrochureState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);
  const url = `/api/backend/public/${token}/pdf`;

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const attemptRef = useRef<() => Promise<void>>(async () => {});
  const attempt = useCallback(async () => {
    try {
      const res = await fetch(url, { redirect: "manual", cache: "no-store" });
      if (!alive.current) return;
      if (res.type === "opaqueredirect" || res.status === 302) {
        setState("idle");
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- file download via the API proxy, not a page
        window.location.href = url;
        return;
      }
      if (res.status === 202) {
        const body = (await res.json().catch(() => ({}))) as { retryAfter?: number };
        const wait = Math.min(Math.max(Number(body.retryAfter) || 5, 1), 30);
        setState("preparing");
        timer.current = setTimeout(() => void attemptRef.current(), wait * 1000);
        return;
      }
      if (res.status === 410) {
        setState("gone");
        return;
      }
      if (res.ok) {
        // Served directly as a file.
        setState("idle");
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- file download via the API proxy, not a page
        window.location.href = url;
        return;
      }
      setState("error");
    } catch {
      if (alive.current) setState("error");
    }
  }, [url]);

  useEffect(() => {
    attemptRef.current = attempt;
  }, [attempt]);

  const start = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setState("preparing");
    void attempt();
  }, [attempt]);

  return { state, start };
}
