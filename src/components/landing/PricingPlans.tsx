"use client";

import React from "react";
import Link from "next/link";
import { Check, Layers } from "lucide-react";
import { useGetPlansQuery } from "@/redux/api/billing/billingApi";
import { formatMoney } from "@/lib/format";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardGridSkeleton } from "@/components/ui/skeletons/CardGridSkeleton";

/** Pricing cards for the landing page, loaded from the public GET /plans. */
export function PricingPlans() {
  const { data: plans, isLoading, isError, error, refetch } = useGetPlansQuery();

  if (isLoading) return <CardGridSkeleton count={3} className="max-w-5xl mx-auto" />;
  if (isError) return <ErrorState error={error} onRetry={refetch} className="max-w-xl mx-auto" />;
  if (!plans || plans.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="Pricing is not available right now"
        description="Plans could not be listed at the moment. Please check back shortly."
        primaryAction={{ label: "Reload plans", onClick: () => refetch() }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto items-stretch">
      {plans.map((plan) => {
        const popular = !!plan.isPopular;
        const interval = plan.interval === "year" ? "year" : "month";
        return (
          <div
            key={plan.code}
            className={
              popular
                ? "@container cq-card bg-[#091D4E] rounded-3xl p-7 sm:p-9 border-2 border-[#E8A808] shadow-2xl hover:shadow-[0_20px_50px_rgba(232,168,8,0.25)] text-white flex flex-col justify-between relative transform md:-translate-y-3 hover:-translate-y-4 transition-all duration-300"
                : "@container cq-card bg-white rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            }
          >
            {popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E8A808] text-[#06143E] text-xs font-bold uppercase tracking-wider shadow-md">
                ★ Most Popular
              </div>
            )}

            <div>
              <h3 className={`font-heading font-semibold text-xl sm:text-2xl mb-6 ${popular ? "text-white" : "text-slate-900"}`}>
                {plan.name}
              </h3>

              <div className="mb-2">
                <span className={`font-heading font-bold text-3xl sm:text-4xl ${popular ? "text-white" : "text-slate-900"}`}>
                  {formatMoney(plan.pricePence, plan.currency?.toUpperCase())}
                </span>
                <span className={`text-xs sm:text-sm font-medium ml-1.5 ${popular ? "text-slate-300" : "text-slate-600"}`}>
                  / {interval}
                </span>
              </div>
              <p className={`text-xs mb-6 font-medium ${popular ? "text-amber-300/90" : "text-slate-500"}`}>
                Billed {interval === "year" ? "annually" : "monthly"} · {plan.packAllowance} Property Packs · Up to {plan.seatLimit}{" "}
                {plan.seatLimit === 1 ? "seat" : "seats"}
              </p>

              <Link
                href="/sign-up"
                className={
                  popular
                    ? "w-full h-10 sm:h-12 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:scale-[0.98] text-[#06143E] font-bold text-xs sm:text-sm flex items-center justify-center transition-all shadow-[0_4px_16px_rgba(232,168,8,0.4)] hover:shadow-[0_6px_22px_rgba(232,168,8,0.5)] mb-8 cursor-pointer"
                    : "w-full h-10 sm:h-12 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center transition-all mb-8 shadow-2xs"
                }
              >
                {popular ? "Create Your Property Pack" : "Get Started"}
              </Link>

              <ul className={`space-y-3.5 text-xs sm:text-sm ${popular ? "text-slate-200" : "text-slate-700"}`}>
                {(plan.features ?? []).map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PricingPlans;
