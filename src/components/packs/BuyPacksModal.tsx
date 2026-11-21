"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  CreditCard,
  Check,
  CheckCircle2,
  Sparkles,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { getPackBundles } from "@/mocks/packs";
import { PackBundle } from "@/types/packs";
import toast from "react-hot-toast";

interface BuyPacksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (addedPacks: number) => void;
}

export const BuyPacksModal: React.FC<BuyPacksModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const bundles = getPackBundles();
  const [selectedBundleId, setSelectedBundleId] = useState<string>("bundle-15");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const selectedBundle =
    bundles.find((b) => b.id === selectedBundleId) || bundles[1];

  const vat = Math.round(selectedBundle.price * 0.2 * 100) / 100;
  const total = selectedBundle.price + vat;

  const handlePurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success(`${selectedBundle.packs} Property Packs added to your agency balance!`);
      onSuccess?.(selectedBundle.packs);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="buy-packs-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06143E]/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/90 space-y-6 relative"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="buy-packs-title"
                className="font-heading font-semibold text-lg sm:text-xl text-slate-900"
              >
                Buy Property Pack Credits
              </h2>
              <p className="text-xs text-slate-500">
                Top up your allowance anytime. Add-ons never expire.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Overview */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="flex justify-between font-medium">
            <span>Current Monthly Balance:</span>
            <span className="font-semibold text-slate-900">
              64 packs (36/100 used)
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Purchased Add-on Balance:</span>
            <span className="font-semibold text-[#8C6605]">
              14 packs remaining
            </span>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
            Purchased add-on credits never expire and roll over automatically into subsequent months.
          </p>
        </div>

        {/* Bundles Options */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Select a Pack Bundle
          </label>
          <div className="space-y-2.5">
            {bundles.map((bundle: PackBundle) => {
              const isSelected = selectedBundleId === bundle.id;

              return (
                <div
                  key={bundle.id}
                  onClick={() => setSelectedBundleId(bundle.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer select-none ${
                    isSelected
                      ? "border-[#092167] bg-blue-50/40 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "border-[#092167] bg-[#092167] text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-slate-900">
                          {bundle.name}
                        </span>
                        {bundle.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#8C6605] uppercase tracking-wider">
                            {bundle.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        £{bundle.perPackPrice.toFixed(2)} per pack{" "}
                        {bundle.savingsPercent
                          ? `(Save ${bundle.savingsPercent}%)`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <span className="font-heading font-extrabold text-base sm:text-lg text-[#092167]">
                    £{bundle.price}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary calculation */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>£{selectedBundle.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>UK VAT (20%)</span>
            <span>£{vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-slate-900 pt-1.5 border-t border-slate-200">
            <span>Total Due Now</span>
            <span className="text-base text-[#092167]">£{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isProcessing || isSuccess}
            onClick={handlePurchase}
            className="w-full h-11 sm:h-12 bg-[#092167] hover:bg-[#06143E] active:bg-[#040E2C] text-white font-sans font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#E8A808]" />
                <span>Processing £{total.toFixed(2)} with card on file...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Packs Added!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#E8A808]" />
                <span>
                  Confirm & Buy {selectedBundle.packs} Packs • £{total.toFixed(2)}
                </span>
              </>
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Charged to default agency card ending in 4242. VAT invoice sent.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyPacksModal;
