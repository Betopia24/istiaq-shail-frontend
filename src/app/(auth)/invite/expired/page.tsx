"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowLeft, Mail, ShieldAlert } from "lucide-react";

export default function InviteExpiredPage() {
  return (
    <div className="w-full max-w-[520px] bg-white rounded-[28px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(11,23,54,0.08),0_4px_16px_rgba(11,23,54,0.02)] border border-slate-100/80 text-center relative">
      {/* Expired Clock Icon */}
      <div className="w-16 h-16 rounded-full bg-amber-50 border-4 border-amber-100 flex items-center justify-center text-[#8C6605] mx-auto mb-4 shadow-sm">
        <Clock className="w-8 h-8 stroke-[1.8]" />
      </div>

      <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-[#8C6605] text-[11px] font-bold uppercase tracking-wider mb-2">
        INVITATION EXPIRED OR INVALID
      </span>

      <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mb-2">
        This Invitation Link Has Expired
      </h1>

      <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto mb-6">
        For security compliance, agency team invitation links expire after 7 days. Please ask your agency administrator or owner to dispatch a fresh invite from their Team Settings.
      </p>

      {/* Admin Information Box */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 mb-6 space-y-1.5">
        <div className="flex justify-between font-medium">
          <span className="text-slate-500">Agency:</span>
          <span className="font-semibold text-slate-900">
            Vance Prestige Properties
          </span>
        </div>
        <div className="flex justify-between font-medium">
          <span className="text-slate-500">Administrator:</span>
          <span className="font-semibold text-slate-900">
            Eleanor Vance (Owner)
          </span>
        </div>
        <div className="flex justify-between font-medium pt-1 border-t border-slate-200">
          <span className="text-slate-500">Direct Contact:</span>
          <a
            href="mailto:eleanor@vanceprestige.com"
            className="text-[#092167] font-semibold hover:underline"
          >
            eleanor@vanceprestige.com
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <a
          href="mailto:eleanor@vanceprestige.com?subject=Requesting%20new%20Property%20Pack%20AI%20invitation"
          className="w-full h-11 sm:h-12 bg-[#092167] hover:bg-[#06143E] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Mail className="w-4 h-4 text-[#E8A808]" />
          <span>Email Administrator for New Link</span>
        </a>

        <Link
          href="/login"
          className="w-full h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
