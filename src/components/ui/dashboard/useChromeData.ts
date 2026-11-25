"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useGetBrandingQuery } from "@/redux/api/agency/agencyApi";
import { useGetCreditsQuery, useGetSubscriptionQuery } from "@/redux/api/billing/billingApi";
import { useGetLeadsQuery } from "@/redux/api/leads/leadsApi";
import { useListPacksQuery } from "@/redux/api/packs/packsApi";
import { apiErrorInfo } from "@/components/ui/ErrorState";

/**
 * Real numbers for the dashboard chrome (header and sidebar): agency name, credits, saved-packs total, pending leads.
 * Nothing is requested for super admins or while signed out. Every value is null until the API has answered.
 */
export function useChromeData(enabled = true) {
  const user = useSelector((state: RootState) => state.user?.user);
  const agencyUser = !!user && user.role !== "super_admin" && enabled;

  const branding = useGetBrandingQuery(agencyUser ? undefined : skipToken);
  const subscription = useGetSubscriptionQuery(agencyUser ? undefined : skipToken);
  // Credits do not depend on a subscription: pay-as-you-go agencies have packs and no plan.
  const credits = useGetCreditsQuery(agencyUser ? undefined : skipToken);
  const packs = useListPacksQuery(agencyUser ? { pageSize: 1 } : skipToken);
  const leads = useGetLeadsQuery(agencyUser ? { limit: 1 } : skipToken);

  const noSubscription = apiErrorInfo(subscription.error).code === "no_subscription";

  return {
    agencyName: branding.data?.agencyName || null,
    /** Monthly allowance plus pay-as-you-go. null while loading or unavailable. */
    creditsRemaining: credits.data?.total ?? null,
    noSubscription,
    packsTotal: packs.data?.total ?? null,
    pendingLeads: leads.data?.stats?.pending ?? null,
  };
}
