"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, LifeBuoy } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors for operational tracking
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
        {/* Error Badge */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto shadow-2xs">
          <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Messaging in UK English */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
            SYSTEM ERROR 500
          </span>
          <h1 className="font-heading font-bold text-2xl text-slate-900 tracking-tight">
            Something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            An unexpected error occurred while preparing your property data. Our
            technical team has been automatically notified.
          </p>
        </div>

        {/* Error Digest for Support Reference */}
        {error.digest && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500">
            Error Ref: {error.digest}
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto h-11 px-5 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white font-heading font-semibold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#E8A808]" />
            <span>Try Again</span>
          </button>

          <Link
            href="/agent-dashboard"
            className="w-full sm:w-auto h-11 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Agent Dashboard</span>
          </Link>
        </div>

        {/* Support Note */}
        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>
            Need urgent assistance?{" "}
            <a
              href="mailto:support@propertypack.ai"
              className="text-[#092167] font-semibold underline"
            >
              support@propertypack.ai
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
