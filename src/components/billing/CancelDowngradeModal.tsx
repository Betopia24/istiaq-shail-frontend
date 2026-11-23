"use client";

import React, { useEffect } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import { useBillingPortal } from "./useBillingPortal";

interface CancelDowngradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Current plan name and period end, from GET /billing/subscription. */
  planName?: string;
  periodEnd?: string;
}

/** Cancelling is done in the Stripe customer portal: this dialog explains and sends the owner there. */
export const CancelDowngradeModal: React.FC<CancelDowngradeModalProps> = ({ isOpen, onClose, planName, periodEnd }) => {
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
      aria-labelledby="cancel-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06143E]/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto space-y-6">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="cancel-modal-title" className="font-heading font-semibold text-lg sm:text-xl text-slate-900">
                Cancel Subscription
              </h2>
              {planName && <p className="text-xs text-slate-500">Current plan: {planName}</p>}
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

        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
          <p className="font-semibold text-amber-900">What happens if you cancel?</p>
          <p className="text-amber-800 leading-relaxed">
            You will be taken to Stripe&apos;s billing portal to confirm.{" "}
            {periodEnd ? (
              <>
                Your plan stays active until <strong>{formatDate(periodEnd)}</strong>.
              </>
            ) : (
              "Your plan stays active until the end of the current billing period."
            )}{" "}
            To switch to a different plan instead, close this dialog and use Change Plan.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto h-10 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Keep My Subscription
          </button>
          <button
            type="button"
            onClick={open}
            disabled={isLoading}
            className="w-full sm:w-auto h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Opening...</span>
              </>
            ) : (
              <span>Continue to Cancel</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelDowngradeModal;
