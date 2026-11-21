"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Lock, LogIn, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-expired-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06143E]/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center relative animate-in zoom-in-95 duration-150 space-y-4">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-slate-100 border-4 border-slate-200 text-slate-700 flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-7 h-7 text-[#092167]" />
        </div>

        <div>
          <span className="inline-block px-3 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px] mb-2">
            SECURITY TIMEOUT
          </span>
          <h2
            id="session-expired-title"
            className="font-heading font-bold text-2xl text-slate-900"
          >
            Your Session Has Expired
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            For institutional data security and CPR compliance, inactive agency sessions are automatically signed out. Please sign in to resume your workstation.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="w-full h-11 sm:h-12 rounded-xl bg-[#06143E] hover:bg-[#092167] text-white font-heading font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition"
          >
            <LogIn className="w-4 h-4 text-[#E8A808]" />
            <span>Sign In to Continue</span>
          </Link>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-slate-400 hover:text-slate-600 underline pt-1 cursor-pointer"
          >
            Dismiss (Reviewer demo mode)
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionExpiredModal;
