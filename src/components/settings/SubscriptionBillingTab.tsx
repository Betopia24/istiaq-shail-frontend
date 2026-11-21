"use client";

import React, { useState } from "react";
import {
  Download,
  AlertTriangle,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { BuyPacksModal } from "@/components/packs/BuyPacksModal";
import { CancelDowngradeModal } from "@/components/billing/CancelDowngradeModal";
import { UpdateCardDialog } from "@/components/billing/UpdateCardDialog";
import { PastDueBanner } from "@/components/billing/PastDueBanner";
import toast from "react-hot-toast";

interface SubscriptionBillingTabProps {
  initialPastDue?: boolean;
}

export const SubscriptionBillingTab: React.FC<SubscriptionBillingTabProps> = ({
  initialPastDue = false,
}) => {
  const [isBuyPacksOpen, setIsBuyPacksOpen] = useState(false);
  const [isCancelDowngradeOpen, setIsCancelDowngradeOpen] = useState(false);
  const [isUpdateCardOpen, setIsUpdateCardOpen] = useState(false);
  const [isPastDue, setIsPastDue] = useState(initialPastDue);

  const [currentPlan, setCurrentPlan] = useState({
    name: "Professional Agency Plan",
    price: "£79.00",
    interval: "month",
    packsRemaining: 14,
    totalPacks: 50,
    renewsOn: "15 Dec 2026",
    status: "ACTIVE",
  });

  const billingAddress =
    "14 Wilmslow Road, Didsbury, Manchester, M20 2RN, United Kingdom";
  const billingEntity = "Prestige Estates UK Ltd (Ishtiaq Sohail)";
  const vatId = "GB 282 0512 44";

  const [invoices] = useState([
    {
      id: "INV-2026-11",
      date: "15 Nov 2026",
      amount: "£79.00",
      status: "PAID",
      description: "Professional Plan (Monthly)",
    },
    {
      id: "TOPUP-2026-11",
      date: "04 Nov 2026",
      amount: "£99.00",
      status: "PAID",
      description: "Pack Top-up (15 Credits)",
    },
    {
      id: "INV-2026-10",
      date: "15 Oct 2026",
      amount: "£79.00",
      status: "PAID",
      description: "Professional Plan (Monthly)",
    },
    {
      id: "INV-2026-09",
      date: "15 Sep 2026",
      amount: "£79.00",
      status: "PAID",
      description: "Professional Plan (Monthly)",
    },
  ]);

  const handlePacksAdded = (packs: number) => {
    setCurrentPlan((prev) => ({
      ...prev,
      packsRemaining: prev.packsRemaining + packs,
      totalPacks: prev.totalPacks + packs,
    }));
  };

  const handleDowngrade = (tier: string) => {
    if (tier === "starter") {
      setCurrentPlan((prev) => ({
        ...prev,
        name: "Starter Agency Plan",
        price: "£29.00",
        totalPacks: 10,
        packsRemaining: Math.min(prev.packsRemaining, 10),
      }));
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading official UK VAT Invoice #${invoiceId}...`);
  };

  return (
    <div className="space-y-6">
      {/* S13: Past-Due Banner */}
      {isPastDue && (
        <PastDueBanner
          onDismiss={() => setIsPastDue(false)}
          className="mb-6"
        />
      )}

      {/* Modals */}
      <BuyPacksModal
        isOpen={isBuyPacksOpen}
        onClose={() => setIsBuyPacksOpen(false)}
        onSuccess={handlePacksAdded}
      />

      <CancelDowngradeModal
        isOpen={isCancelDowngradeOpen}
        onClose={() => setIsCancelDowngradeOpen(false)}
        onDowngrade={handleDowngrade}
        onConfirmCancel={() => {
          setCurrentPlan((prev) => ({ ...prev, status: "CANCELLED" }));
        }}
      />

      <UpdateCardDialog
        isOpen={isUpdateCardOpen}
        onClose={() => setIsUpdateCardOpen(false)}
        onSuccess={() => {
          setIsPastDue(false);
          toast.success("Default payment card updated via Stripe Elements");
        }}
      />

      {/* Main Billing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column: Active Subscription & Payment Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Active Subscription */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-6 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-medium text-lg text-slate-900">
                  Active Subscription
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your agency is on the Professional Tier billed monthly via
                  Stripe.
                </p>
              </div>

              {/* Reviewer Simulation Toggle */}
              <button
                type="button"
                onClick={() => setIsPastDue((prev) => !prev)}
                className="text-[10px] font-mono px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                title="Toggle Past-Due Banner Simulation for Reviewer"
              >
                {isPastDue ? "Hide Past-Due" : "Simulate Past-Due"}
              </button>
            </div>

            {/* Plan Container */}
            <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h4 className="font-heading font-medium text-base text-slate-900">
                    {currentPlan.name}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      currentPlan.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-rose-100 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {currentPlan.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {currentPlan.price} / {currentPlan.interval} · Renews on{" "}
                  {currentPlan.renewsOn}
                </p>
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsBuyPacksOpen(true)}
                  className="h-9 px-4 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] font-heading font-medium text-xs shadow-2xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Top-up</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCancelDowngradeOpen(true)}
                  className="h-9 px-3.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-medium text-xs transition cursor-pointer"
                >
                  Change Plan
                </button>
              </div>
            </div>

            {/* Pack Credits Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-600">Monthly Pack Allowance</span>
                <span className="text-slate-900 font-medium">
                  {currentPlan.packsRemaining} / {currentPlan.totalPacks} Packs
                  Remaining
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-[#E8A808] rounded-full transition-all"
                  style={{
                    width: `${Math.round(
                      (currentPlan.packsRemaining / currentPlan.totalPacks) * 100,
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Low Credits Warning Banner */}
            {currentPlan.packsRemaining <= 15 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 flex items-center justify-between gap-2.5 text-xs text-amber-900 font-medium">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Low credits alert: You have {currentPlan.packsRemaining}{" "}
                    packs remaining this billing cycle.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBuyPacksOpen(true)}
                  className="text-xs font-semibold text-[#8C6605] underline hover:no-underline cursor-pointer shrink-0"
                >
                  Buy Top-up
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Payment Method & Tax Info */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-6 shadow-2xs">
            <div>
              <h3 className="font-heading font-medium text-lg text-slate-900">
                Payment Method &amp; Tax Info
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Primary card used for recurring automated billing and invoicing.
              </p>
            </div>

            {/* Credit Card Box */}
            <div className="rounded-xl border border-slate-200 p-4 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-7 rounded bg-[#06143E] text-white flex items-center justify-center font-medium text-[10px] tracking-wider shrink-0">
                  VISA
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-900">
                    Visa ending in 4242
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Expires 12/28 · Default Payment Method (Stripe)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsUpdateCardOpen(true)}
                className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition cursor-pointer shadow-2xs"
              >
                Edit
              </button>
            </div>

            {/* Billing Entity & Registered Address */}
            <div className="pt-2 border-t border-slate-100 space-y-4 text-xs">
              <div>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                  BILLING ENTITY &amp; COMPANY
                </span>
                <p className="font-medium text-slate-900 mt-1">{billingEntity}</p>
                <p className="text-slate-500 text-[11px]">
                  UK VAT ID: {vatId}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                  REGISTERED BILLING ADDRESS
                </span>
                <p className="text-slate-700 mt-1 leading-relaxed">
                  {billingAddress}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsUpdateCardOpen(true)}
                  className="h-9 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 font-medium text-xs transition cursor-pointer"
                >
                  Update Billing Address
                </button>

                <button
                  type="button"
                  onClick={() => setIsCancelDowngradeOpen(true)}
                  className="text-xs text-rose-600 hover:text-rose-700 underline font-medium cursor-pointer"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stripe Billing History & VAT Support */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Stripe Billing History */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
            <div>
              <h3 className="font-heading font-medium text-sm text-slate-900">
                Stripe Billing History
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Download official monthly VAT invoices &amp; receipts.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {inv.description}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {inv.date} · {inv.amount}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {inv.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(inv.id)}
                      className="h-7 px-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>PDF</span>
                      <Download className="w-3 h-3 text-slate-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Need Custom VAT Receipts? */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-3 shadow-2xs">
            <h4 className="font-heading font-medium text-sm text-slate-900">
              Need Multi-Branch VAT Split?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              All Stripe receipts include full UK VAT (20%) breakdown. If your
              firm requires split cost centres across multiple regional branch
              offices, our billing team can assist.
            </p>
            <div className="pt-1">
              <a
                href="mailto:billing@propertypack.ai"
                className="text-xs font-medium text-[#092167] hover:text-[#E8A808] transition inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Contact Billing Team</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBillingTab;
