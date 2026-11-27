"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "pp_cookie_notice";

/**
 * Cookie notice (UK PECR / UK GDPR). The site sets only strictly necessary cookies (sign-in, and Stripe's
 * fraud-prevention cookies on payment pages), which need no consent but must be disclosed. If analytics or
 * marketing cookies are ever added, this must become an opt-in choice before they are set.
 */
export function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      setShow(window.localStorage.getItem(KEY) !== "ok");
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;
  const dismiss = () => {
    try {
      window.localStorage.setItem(KEY, "ok");
    } catch {
      // storage blocked: the notice simply shows again next time
    }
    setShow(false);
  };

  return (
    <>
    {/* Room at the end of the page, so the notice never covers the last controls on it. */}
    <div aria-hidden="true" className="h-40 sm:h-28" />
    <div role="region" aria-label="Cookie notice" className="fixed bottom-4 inset-x-4 z-40 flex justify-center pointer-events-none">
      <div className="pointer-events-auto max-w-2xl w-full bg-[#06143E] text-slate-100 rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-xs sm:text-sm leading-relaxed flex-1">
          We use only essential cookies: to keep you signed in, and Stripe&apos;s fraud-prevention cookies when you pay. No advertising or analytics
          cookies.{" "}
          <Link href="/cookies" className="underline text-[#E8A808] hover:no-underline">
            Cookie policy
          </Link>
        </p>
        <button type="button" onClick={dismiss} className="h-9 px-5 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] text-xs font-bold cursor-pointer shrink-0">
          OK
        </button>
      </div>
    </div>
    </>
  );
}

export default CookieNotice;
