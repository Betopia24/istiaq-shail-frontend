"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";
import { useOpenBillingPortalMutation } from "@/redux/api/billing/billingApi";
import { errorText } from "@/lib/auth/client";

/** Opens the Stripe customer portal (card update, cancel) by redirecting the browser to the API's signed url. */
export function useBillingPortal() {
  const [openPortal, { isLoading }] = useOpenBillingPortalMutation();
  const open = useCallback(async () => {
    try {
      const { url } = await openPortal().unwrap();
      window.location.assign(url);
    } catch (err) {
      toast.error(errorText(err));
    }
  }, [openPortal]);
  return { open, isLoading };
}
