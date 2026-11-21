"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { OnboardingStepProgress } from "@/components/onboarding/OnboardingStepProgress";
import { getPlans } from "@/mocks/onboarding";
import { BillingCycle, PlanTier } from "@/types/onboarding";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

function PlanSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const plans = getPlans();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("professional");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const handleContinue = () => {
    const params = new URLSearchParams();
    params.set("plan", selectedPlanId);
    params.set("billing", billingCycle);
    if (emailParam) params.set("email", emailParam);
    router.push(`/onboarding/payment?${params.toString()}`);
  };

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[1];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 3-Step Progress Bar */}
      <OnboardingStepProgress currentStep={2} />

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="font-heading font-semibold text-3xl sm:text-4xl text-[#06143E] tracking-tight mb-3">
          Choose the right plan for your agency
        </h1>
        <p className="font-sans text-base text-slate-600 leading-relaxed">
          Transform your property marketing with high-speed AI brochure packs. Change or cancel your subscription at any time.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-white/80 border border-slate-300 shadow-xs">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-[#092167] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Monthly billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
              billingCycle === "annual"
                ? "bg-[#092167] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Annual billing</span>
            <span className="bg-[#FEF3C7] text-[#8C6605] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div
        role="radiogroup"
        aria-label="Subscription Plans"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-10"
      >
        {plans.map((plan: PlanTier) => {
          const isSelected = selectedPlanId === plan.id;
          const displayPrice =
            billingCycle === "annual" ? plan.priceAnnualMonthly : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => setSelectedPlanId(plan.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedPlanId(plan.id);
                }
              }}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 cursor-pointer outline-none ${
                plan.isPopular
                  ? isSelected
                    ? "bg-gradient-to-br from-[#06143E] via-[#091D4E] to-[#0A132C] text-white border-2 border-[#E8A808] shadow-[0_16px_40px_rgba(232,168,8,0.25)] ring-4 ring-[#E8A808]/20 -translate-y-1"
                    : "bg-[#091D4E] text-white border-2 border-[#1E3B87] shadow-xl hover:-translate-y-1"
                  : isSelected
                  ? "bg-white text-slate-900 border-2 border-[#092167] shadow-xl ring-4 ring-[#092167]/10 -translate-y-1"
                  : "bg-white/90 text-slate-900 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {/* Badge if Popular */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-[#E8A808] text-[#06143E] font-heading font-bold text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>{plan.badge}</span>
                  </span>
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h2 className="font-heading font-bold text-xl sm:text-2xl">
                    {plan.name}
                  </h2>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? plan.isPopular
                          ? "bg-[#E8A808] border-[#E8A808] text-[#06143E]"
                          : "bg-[#092167] border-[#092167] text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <p
                  className={`text-xs sm:text-sm mb-6 ${
                    plan.isPopular ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {plan.tagline}
                </p>

                {/* Pricing Box */}
                <div className="mb-6 pb-6 border-b border-slate-200/40">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-heading font-extrabold text-4xl sm:text-5xl tracking-tight">
                      £{displayPrice}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        plan.isPopular ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      / month
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1.5 font-medium ${
                      plan.isPopular ? "text-[#E8A808]" : "text-slate-500"
                    }`}
                  >
                    {billingCycle === "annual"
                      ? "Billed annually (2 months free included)"
                      : "Billed monthly, cancel anytime"}
                  </p>
                </div>

                {/* Key Capacity Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  <div
                    className={`p-3 rounded-2xl ${
                      plan.isPopular ? "bg-white/10" : "bg-slate-50 border border-slate-100"
                    }`}
                  >
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Allowance
                    </span>
                    <span className="font-heading font-bold text-base sm:text-lg">
                      {plan.packsPerMonth} Packs
                    </span>
                    <span className="block text-[10px] text-slate-400">per month</span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${
                      plan.isPopular ? "bg-white/10" : "bg-slate-50 border border-slate-100"
                    }`}
                  >
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Seats
                    </span>
                    <span className="font-heading font-bold text-base sm:text-lg">
                      {plan.seats} {plan.seats === 1 ? "Seat" : "Seats"}
                    </span>
                    <span className="block text-[10px] text-slate-400">team members</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-6 text-xs sm:text-sm">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.isPopular
                            ? "text-[#E8A808] bg-[#E8A808]/15"
                            : "text-[#092167] bg-[#092167]/10"
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className={plan.isPopular ? "text-slate-200" : "text-slate-700"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Selection Button */}
              <div className="pt-4 border-t border-slate-200/30">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlanId(plan.id);
                  }}
                  className={`w-full py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? plan.isPopular
                        ? "bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] shadow-md font-bold"
                        : "bg-[#092167] hover:bg-[#06143E] text-white shadow-md"
                      : plan.isPopular
                      ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Plan Selected</span>
                    </>
                  ) : (
                    <span>Select {plan.name}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Selected Tier
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h3 className="font-heading font-bold text-2xl text-[#06143E]">
              {selectedPlan.name} Plan
            </h3>
            <span className="font-semibold text-slate-600">
              • £{billingCycle === "annual" ? selectedPlan.priceAnnualMonthly : selectedPlan.priceMonthly} / month
            </span>
            <Badge variant="brand">
              {selectedPlan.packsPerMonth} Packs & {selectedPlan.seats} Seats
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {billingCycle === "annual"
              ? "Billed annually. 14-day money-back satisfaction guarantee."
              : "Billed monthly. Cancel or change tier at any time."}
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="primary"
            onClick={handleContinue}
            className="w-full sm:w-auto px-8 py-3.5 text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PlanSelectionPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-12 text-center text-slate-500 shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#092167] mx-auto mb-4" />
          <p className="text-sm">Loading available plans...</p>
        </div>
      }
    >
      <PlanSelectionContent />
    </Suspense>
  );
}
