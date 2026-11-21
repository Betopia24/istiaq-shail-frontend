"use client";

/** Current year for footers. A client component, so server layouts can prerender without reading the clock. */
export function CopyrightYear() {
  return <>{new Date().getFullYear()}</>;
}
