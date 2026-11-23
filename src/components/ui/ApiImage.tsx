/* eslint-disable @next/next/no-img-element -- API photo links are signed, expiring URLs: they must not go through the image optimizer cache */
import React from "react";

/** A photo or logo from the API. Plain <img>: signed links expire, so Next's image cache is the wrong place for them. */
export function ApiImage({ src, alt, className, fallback = null }: { src: string | null | undefined; alt: string; className?: string; fallback?: React.ReactNode }) {
  if (!src) return <>{fallback}</>;
  return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />;
}
