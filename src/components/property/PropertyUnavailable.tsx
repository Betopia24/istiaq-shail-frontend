import React from "react";
import Link from "next/link";
import { Clock, ArrowLeft, ShieldCheck } from "lucide-react";

/** Shown for a 410: the agency disabled the link, it expired, or the property was withdrawn. */
export function PropertyUnavailable() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DFE6EF] via-[#D5DEEA] to-[#CBD5E2] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-slate-200/90 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#092167] via-[#E8A808] to-[#092167]" />

        <div className="w-16 h-16 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center text-slate-500 mx-auto mb-4 mt-2 shadow-xs">
          <Clock className="w-8 h-8 text-slate-600" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs mb-3 border border-slate-200">
          BROCHURE ARCHIVED / 410 GONE
        </span>

        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mb-2">
          This Property Brochure is No Longer Available
        </h1>

        <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto mb-6">
          The estate agent has expired or disabled public access to this digital listing. The property may have been sold, let, or withdrawn from marketing.
        </p>

        <div className="space-y-2.5">
          <Link
            href="/"
            className="w-full h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-xs flex items-center justify-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Property Pack AI</span>
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>UK Trading Standards Compliant Consumer Notice</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PropertyUnavailable;
