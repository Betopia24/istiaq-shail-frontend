"use client";

import React, { use, useEffect } from "react";
import Link from "next/link";
import { Download, Loader2 } from "lucide-react";
import { useBrochureDownload } from "@/components/property/useBrochureDownload";
import { PropertyUnavailable } from "@/components/property/PropertyUnavailable";

/** The brochure is a file made by the API: this page just starts the download flow for anyone who lands here. */
export default function PropertyBrochurePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const { state, start } = useBrochureDownload(token);

  useEffect(() => {
    start();
  }, [start]);

  if (state === "gone") return <PropertyUnavailable />;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
        {state === "error" ? (
          <>
            <p className="text-sm text-slate-700">We could not get the brochure. Please try again.</p>
            <button type="button" onClick={start} className="h-10 px-5 rounded-lg bg-[#06143E] text-white text-sm font-medium cursor-pointer inline-flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Try again</span>
            </button>
          </>
        ) : (
          <>
            <Loader2 className="w-6 h-6 animate-spin text-slate-500 mx-auto" />
            <p className="text-sm text-slate-700">Preparing your brochure…</p>
          </>
        )}
        <Link href={`/property/${token}`} className="block text-xs text-slate-500 hover:text-slate-800 underline">
          Back to the property
        </Link>
      </div>
    </div>
  );
}
