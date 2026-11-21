"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  CreditCard,
  Lock,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Building,
} from "lucide-react";
import toast from "react-hot-toast";

interface UpdateCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UpdateCardDialog: React.FC<UpdateCardDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [cardholderName, setCardholderName] = useState("Ishtiaq Sohail");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [expiry, setExpiry] = useState("10 / 28");
  const [cvc, setCvc] = useState("•••");
  const [addressLine, setAddressLine] = useState("14 Gorse Gate, Chorlton");
  const [city, setCity] = useState("Manchester");
  const [postcode, setPostcode] = useState("M21 2FA");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isSubmitting]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Payment method updated and pending balance cleared!");
      onSuccess?.();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    }, 1100);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-card-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06143E]/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 space-y-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="update-card-title"
                className="font-heading font-semibold text-lg sm:text-xl text-slate-900"
              >
                Update Payment Method
              </h2>
              <p className="text-xs text-slate-500">
                Processed directly through Stripe Elements
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Payment Method Verified!
            </h3>
            <p className="text-xs text-slate-500">
              Your default card has been updated. Past-due alerts have been resolved.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Name on Card
              </label>
              <input
                type="text"
                required
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
              />
            </div>

            {/* Labeled Stripe Element Placeholder */}
            <div className="p-3.5 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">
                  Card Details
                </span>
                <span className="text-[9px] font-mono uppercase bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                  Stripe Elements
                </span>
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card Number"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-mono text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM / YY"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-mono text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                />
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="CVC"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-mono text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                />
              </div>
            </div>

            {/* Billing Postcode */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Postcode
                </label>
                <input
                  type="text"
                  required
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 uppercase focus:outline-none focus:border-[#092167]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md transition disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E8A808]" />
                    <span>Verifying with Stripe...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[#E8A808]" />
                    <span>Save Card &amp; Retry Payment</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>256-bit SSL encrypted • Card data never touches our server</span>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateCardDialog;
