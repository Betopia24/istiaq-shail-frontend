"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useGetBrandingQuery } from "@/redux/api/agency/agencyApi";
import { useGetSubscriptionQuery } from "@/redux/api/billing/billingApi";
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
  const packs = useListPacksQuery(agencyUser ? { pageSize: 1 } : skipToken);
  const leads = useGetLeadsQuery(agencyUser ? { limit: 1 } : skipToken);

  const noSubscription = apiErrorInfo(subscription.error).code === "no_subscription";

  return {
    agencyName: branding.data?.agencyName || null,
    /** null while loading or unavailable; 0 when the agency has no subscription yet. */
    creditsRemaining: noSubscription ? 0 : (subscription.data?.creditsRemaining ?? null),
    noSubscription,
    packsTotal: packs.data?.total ?? null,
    pendingLeads: leads.data?.stats?.pending ?? null,
  };
}
