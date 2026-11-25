"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { PaymentSuccessModal } from "@/components/onboarding/PaymentSuccessModal";
import { useGetSubscriptionQuery } from "@/redux/api/billing/billingApi";
import { formatMoney, formatSeats } from "@/lib/format";

const POLL_MS = 2000;
const GIVE_UP_MS = 60_000;

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectStatus = searchParams.get("redirect_status");
  const failed = redirectStatus === "failed";

  const [timedOut, setTimedOut] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  const { data: sub, error, isLoading, refetch } = useGetSubscriptionQuery(undefined, {
    skip: failed,
    pollingInterval: timedOut ? 0 : POLL_MS,
    refetchOnMountOrArgChange: true,
  });

  const active = sub?.state === "active";
  const noSubscriptionYet = !sub && apiErrorInfo(error).status === 404;
  const realError = !!error && !noSubscriptionYet;

  // Stripe sent the customer back with a failed payment: return to the payment step with the reason.
  useEffect(() => {
    if (failed) {
      router.replace(
        `/onboarding/payment?error=${encodeURIComponent("Your payment did not go through. Please check your card details or try another card.")}`,
      );
    }
  }, [failed, router]);

  // Stop polling after about a minute without an active subscription.
  useEffect(() => {
    if (failed || active) return;
    const t = setTimeout(() => setTimedOut(true), GIVE_UP_MS);
    return () => clearTimeout(t);
  }, [failed, active]);

  const handleRefresh = () => {
    setTimedOut(false);
    refetch();
  };

  if (failed) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-12 text-center text-slate-500 shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#092167] mx-auto mb-4" />
        <p className="text-sm">Returning to payment...</p>
      </div>
    );
  }

  if (realError) {
    return (
      <div className="w-full max-w-xl mx-auto py-8">
        <ErrorState error={error} onRetry={handleRefresh} />
      </div>
    );
  }

  if (!active || !sub) {
    return (
      <div className="w-full max-w-xl mx-auto py-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/90 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 border-4 border-amber-100 flex items-center justify-center text-[#E8A808] mx-auto mb-4">
            {timedOut ? <Clock className="w-8 h-8" /> : <Loader2 className="w-8 h-8 animate-spin" />}
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#06143E] tracking-tight mb-2">
            {timedOut ? "Payment received, your plan is being activated" : "Confirming your payment..."}
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            {timedOut
              ? "Your payment went through and we are still waiting for the bank confirmation to activate your subscription. This usually takes a moment."
              : isLoading || noSubscriptionYet || sub
                ? "Waiting for Stripe to confirm your subscription. Please do not close this page."
                : ""}
          </p>
          {timedOut && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleRefresh}
                className="w-full h-12 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white font-heading font-semibold text-sm cursor-pointer"
              >
                Refresh
              </button>
              <Button href="/agent-dashboard" variant="outline" size="md" className="w-full text-slate-700">
                Go to Agent Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const plan = sub.plan ?? {};
  return (
    <div className="w-full max-w-xl mx-auto py-8">
      {sub.plan && (
        <PaymentSuccessModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          plan={sub.plan}
          packsGranted={sub.creditsRemaining ?? 0}
        />
      )}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/90 text-center relative overflow-hidden">
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

        <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-200 text-left space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Selected Tier</span>
            <span className="font-heading font-bold text-sm text-[#06143E]">
              {plan.name} ({formatMoney(plan.pricePence, plan.currency?.toUpperCase())}/{plan.interval === "year" ? "yr" : "mo"})
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500">Available Pack Balance</span>
            <span className="font-semibold text-[#092167]">{sub.creditsRemaining ?? 0} AI Property Packs</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500">Team Seats</span>
            <span className="font-semibold text-slate-800">
              {formatSeats(plan.seatLimit)} Included
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs sm:text-sm font-semibold">
            <span className="text-slate-700">Account Status</span>
            <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-xs">Active</span>
          </div>
        </div>

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
