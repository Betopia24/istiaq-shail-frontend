"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock, ArrowLeft } from "lucide-react";

const REASONS: Record<string, { badge: string; title: string; body: string }> = {
  invite_expired: {
    badge: "INVITATION EXPIRED",
    title: "This Invitation Link Has Expired",
    body: "For security, team invitation links expire after a short time. Please ask your agency administrator or owner to send a new invitation from their Team Settings.",
  },
  invite_used: {
    badge: "INVITATION ALREADY USED",
    title: "This Invitation Has Already Been Used",
    body: "This invitation was already accepted. Try signing in with your email and password, or ask your agency administrator to send a new invitation.",
  },
  invite_revoked: {
    badge: "INVITATION CANCELLED",
    title: "This Invitation Was Cancelled",
    body: "The agency cancelled this invitation. Please ask your agency administrator to send a new invitation.",
  },
  not_found: {
    badge: "INVITATION NOT FOUND",
    title: "We Couldn't Find This Invitation",
    body: "The link may be incomplete or mistyped. Please ask your agency administrator to send a new invitation.",
  },
};

function ExpiredContent() {
  const reason = useSearchParams().get("reason") ?? "invite_expired";
  const content = REASONS[reason] ?? REASONS.invite_expired;

  return (
    <div className="w-full max-w-[520px] bg-white rounded-[28px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(11,23,54,0.08),0_4px_16px_rgba(11,23,54,0.02)] border border-slate-100/80 text-center relative">
      {/* Expired Clock Icon */}
      <div className="w-16 h-16 rounded-full bg-amber-50 border-4 border-amber-100 flex items-center justify-center text-[#8C6605] mx-auto mb-4 shadow-sm">
        <Clock className="w-8 h-8 stroke-[1.8]" />
      </div>

      <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-[#8C6605] text-[11px] font-bold uppercase tracking-wider mb-2">
        {content.badge}
      </span>

      <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mb-2">
        {content.title}
      </h1>

      <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto mb-6">
        {content.body}
      </p>

      {/* Actions */}
      <div className="space-y-3">
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

export default function InviteExpiredPage() {
  return (
    <Suspense fallback={null}>
      <ExpiredContent />
    </Suspense>
  );
}
