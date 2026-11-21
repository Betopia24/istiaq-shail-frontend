"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  AlertTriangle,
  ArrowDown,
  Check,
  ShieldAlert,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface CancelDowngradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel?: () => void;
  onDowngrade?: (newTier: string) => void;
}

export const CancelDowngradeModal: React.FC<CancelDowngradeModalProps> = ({
  isOpen,
  onClose,
  onConfirmCancel,
  onDowngrade,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedReason, setSelectedReason] = useState<string>("too_expensive");
  const [otherText, setOtherText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isProcessing]);

  if (!isOpen) return null;

  const handleCancel = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Subscription set to cancel at end of billing cycle");
      onConfirmCancel?.();
      onClose();
    }, 1000);
  };

  const handleDowngradeToStarter = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Plan scheduled to downgrade to Starter (£29/mo) next cycle");
      onDowngrade?.("starter");
      onClose();
    }, 1000);
  };

  const reasons = [
    { id: "too_expensive", label: "Price is too high for my current volume" },
    { id: "low_volume", label: "Seasonal slump / not enough listings right now" },
    { id: "missing_features", label: "Missing specific integration or portal feed" },
    { id: "switching_provider", label: "Switching to another property software" },
    { id: "other", label: "Other reason" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06143E]/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="cancel-modal-title"
                className="font-heading font-semibold text-lg sm:text-xl text-slate-900"
              >
                Cancel or Change Subscription
              </h2>
              <p className="text-xs text-slate-500">
                Current Tier: Professional (£79/month • 50 Packs)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Retain Benefits Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
          <p className="font-semibold text-amber-900">
            What happens if you cancel?
          </p>
          <p className="text-amber-800 leading-relaxed">
            Your 50 pack credits, public brochure links, and team seats remain active until <strong>31 December 2026</strong>. You will not be billed again.
          </p>
        </div>

        {/* Alternative: Downgrade Option Card */}
        <div className="p-4.5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm text-[#092167]">
                  Downgrade to Starter Plan Instead?
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#8C6605]">
                  SAVE 63%
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Keep your agency brand setup and 10 packs per month for just <strong>£29/month</strong> instead of losing access.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDowngradeToStarter}
            disabled={isProcessing}
            className="w-full h-10 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition"
          >
            <ArrowDown className="w-4 h-4 text-[#E8A808]" />
            <span>Switch to Starter (£29/mo)</span>
          </button>
        </div>

        {/* Reason Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Please help us improve: Why are you cancelling?
          </label>
          <div className="space-y-2 text-xs">
            {reasons.map((r) => (
              <label
                key={r.id}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition select-none ${
                  selectedReason === r.id
                    ? "bg-slate-50 border-slate-400 font-medium text-slate-900"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                <input
                  type="radio"
                  name="cancelReason"
                  checked={selectedReason === r.id}
                  onChange={() => setSelectedReason(r.id)}
                  className="w-4 h-4 text-[#092167]"
                />
                <span>{r.label}</span>
              </label>
            ))}
          </div>

          {selectedReason === "other" && (
            <textarea
              rows={2}
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="Tell us a bit more..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#092167]"
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto h-10 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Keep My Subscription
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isProcessing}
            className="w-full sm:w-auto h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Confirm Cancellation</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelDowngradeModal;
