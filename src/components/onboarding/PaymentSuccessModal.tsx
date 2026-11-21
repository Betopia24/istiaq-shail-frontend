"use client";

import React, { useEffect, useRef } from "react";
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { PlanTier, BillingCycle } from "@/types/onboarding";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose?: () => void;
  plan: PlanTier;
  billingCycle: BillingCycle;
  totalPaid: number;
  email: string;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose,
  plan,
  billingCycle,
  totalPaid,
  email,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06143E]/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden"
      >
        {/* Subtle celebration gradient header */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#E8A808] via-[#16A34A] to-[#092167]" />

        {/* Icon & Celebration Badge */}
        <div className="text-center pt-2 mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
          </div>
          <Badge variant="success" size="lg" className="mb-2">
            Payment Authorised & Confirmed
          </Badge>
          <h2
            id="success-title"
            className="font-heading font-bold text-2xl sm:text-3xl text-[#06143E] tracking-tight"
          >
            Welcome to Property Pack AI!
          </h2>
          <p className="font-sans text-xs sm:text-sm text-slate-500 mt-1.5">
            Your agency workstation has been activated. A VAT invoice has been dispatched to{" "}
            <span className="font-semibold text-slate-700">{email}</span>.
          </p>
        </div>

        {/* Receipt & Plan Overview */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs sm:text-sm">
            <span className="text-slate-500">Subscription Tier</span>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-[#06143E]">
                {plan.name} Plan
              </span>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500">Credited Balance</span>
            <span className="font-semibold text-[#092167]">
              {plan.packsPerMonth} AI Property Packs
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500">Team Seats</span>
            <span className="font-semibold text-slate-800">
              {plan.seats} {plan.seats === 1 ? "Seat" : "Seats"} Included
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500">Billing Cycle</span>
            <span className="font-semibold capitalize text-slate-800">
              {billingCycle}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs sm:text-sm font-semibold">
            <span className="text-slate-700">Total Paid (inc. 20% VAT)</span>
            <span className="font-heading font-bold text-base text-[#06143E]">
              £{totalPaid.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Quick Next Steps */}
        <div className="space-y-3">
          <Button
            href="/agent-dashboard"
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Go to Agent Dashboard
          </Button>

          <Button
            href="/agent-dashboard/create"
            variant="outline"
            size="md"
            className="w-full flex items-center justify-center gap-2 text-slate-700"
            icon={<Sparkles className="w-4 h-4 text-[#E8A808]" />}
          >
            Create Your First Pack
          </Button>
        </div>

        <div className="mt-5 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>UK Estate Agent Regulations Compliant • Secure Subscription</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
