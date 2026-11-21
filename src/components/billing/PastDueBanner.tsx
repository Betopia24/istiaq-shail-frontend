"use client";

import React, { useState } from "react";
import { AlertCircle, CreditCard, ChevronRight, X } from "lucide-react";
import { UpdateCardDialog } from "./UpdateCardDialog";

interface PastDueBannerProps {
  onDismiss?: () => void;
  className?: string;
}

export const PastDueBanner: React.FC<PastDueBannerProps> = ({
  onDismiss,
  className = "",
}) => {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  if (isResolved) return null;

  return (
    <>
      <UpdateCardDialog
        isOpen={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
        onSuccess={() => setIsResolved(true)}
      />

      <div
        role="alert"
        className={`bg-rose-600 text-white px-4 py-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2 duration-200 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold tracking-tight">
              Payment Failed: Your monthly subscription renewal was declined
            </p>
            <p className="text-[11px] text-rose-100 leading-tight">
              Please update your billing card to keep AI brochure generation and digital share links active.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowUpdateDialog(true)}
            className="h-8 px-3 rounded-lg bg-white text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Update Card</span>
          </button>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default PastDueBanner;
