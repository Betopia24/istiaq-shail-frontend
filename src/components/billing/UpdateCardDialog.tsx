"use client";

import React, { useEffect } from "react";
import { X, CreditCard, Lock, Loader2, ShieldCheck } from "lucide-react";
import { useBillingPortal } from "./useBillingPortal";

interface UpdateCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Card details are entered on Stripe's own page, never in this app. */
export const UpdateCardDialog: React.FC<UpdateCardDialogProps> = ({ isOpen, onClose }) => {
  const { open, isLoading } = useBillingPortal();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-card-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06143E]/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 space-y-6">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#E8A808] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="update-card-title" className="font-heading font-semibold text-lg text-slate-900">
                Update Payment Method
              </h2>
              <p className="text-xs text-slate-500">Securely managed by Stripe</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
          <p className="flex items-center gap-2 font-semibold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>You will be taken to Stripe</span>
          </p>
          <p>
            To protect your card details, they are entered on Stripe&apos;s secure billing page and never pass through
            this app. You will return here once you are done.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto h-10 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={open}
            disabled={isLoading}
            className="w-full sm:w-auto h-10 px-5 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4 text-[#E8A808]" />}
            <span>{isLoading ? "Opening..." : "Continue to Stripe"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCardDialog;
