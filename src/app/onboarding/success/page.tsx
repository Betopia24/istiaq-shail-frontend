"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { getPlanById } from "@/mocks/onboarding";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

function SuccessContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "professional";
  const plan = getPlanById(planId);

  return (
    <div className="w-full max-w-xl mx-auto py-8">
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/90 text-center relative overflow-hidden">
        {/* Top celebration stripe */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#E8A808] via-[#16A34A] to-[#092167]" />

        <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4 mt-2 shadow-sm">
          <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
        </div>

        <Badge variant="success" size="lg" className="mb-3">
          Subscription Active
        </Badge>

        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#06143E] tracking-tight mb-2">
          Welcome to Property Pack AI
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Your agency subscription has been confirmed and your workstation is ready to generate property brochures.
        </p>

        {/* Plan Summary Card */}
        <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-200 text-left space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Selected Tier</span>
            <span className="font-heading font-bold text-sm text-[#06143E]">
              {plan.name} (£{plan.priceMonthly}/mo)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500">Available Pack Balance</span>
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

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs sm:text-sm font-semibold">
            <span className="text-slate-700">Account Status</span>
            <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-xs">
              Live & Verified
            </span>
          </div>
        </div>

        {/* CTAs */}
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

        <div className="mt-6 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>UK Estate Agent Regulations Compliant</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto bg-white rounded-3xl p-12 text-center text-slate-500 shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#092167] mx-auto mb-4" />
          <p className="text-sm">Loading confirmation...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
