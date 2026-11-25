import baseApi from "../baseApi";
import type { Address, CreditBalances, Invoice, PackBundle, Plan, Subscription } from "@/types/models";

export interface CheckoutResult {
  clientSecret: string;
  subscriptionId: string;
  publishableKey: string | null;
  plan: Plan;
}

/** Plans, checkout, subscription, portal, invoices, top-up (openapi: Billing). Card data goes to Stripe only. */
const billingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    /** Public. */
    getPlans: builder.query<Plan[], void>({ query: () => "/plans" }),

    /** Public. Pay-as-you-go bundles (1 pack, 3 packs). */
    getBundles: builder.query<PackBundle[], void>({ query: () => "/bundles" }),

    /** Monthly allowance and pay-as-you-go packs, separately. Works with no subscription. */
    getCredits: builder.query<CreditBalances, void>({
      query: () => "/billing/credits",
      providesTags: ["Subscription"],
    }),

    startCheckout: builder.mutation<CheckoutResult, { planCode: string; billingAddress?: Address }>({
      query: (body) => ({ url: "/billing/checkout", method: "POST", body }),
    }),

    /** 404 `no_subscription` before the first payment. */
    getSubscription: builder.query<Subscription, void>({
      query: () => "/billing/subscription",
      providesTags: ["Subscription"],
    }),

    updateSubscription: builder.mutation<
      Subscription & { pendingPlanCode?: string | null },
      { planCode?: string; billingEntity?: string; vatId?: string; billingAddress?: Address }
    >({
      query: (body) => ({ url: "/billing/subscription", method: "PATCH", body }),
      invalidatesTags: ["Subscription"],
    }),

    /** Stripe customer portal (card update, cancel). Redirect the browser to `url`. */
    openBillingPortal: builder.mutation<{ url: string }, void>({
      query: () => ({ url: "/billing/portal", method: "POST" }),
    }),

    getInvoices: builder.query<Invoice[], void>({
      query: () => "/billing/invoices",
      providesTags: ["Subscription"],
    }),

    /** Pay-as-you-go purchase (no subscription needed). Packs arrive after Stripe confirms (webhook): refetch credits afterwards. */
    topUp: builder.mutation<{ clientSecret: string; amountPence: number; packs: number; bundleCode: string }, { bundleCode: string }>({
      query: (body) => ({ url: "/billing/top-up", method: "POST", body }),
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetBundlesQuery,
  useGetCreditsQuery,
  useStartCheckoutMutation,
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
  useOpenBillingPortalMutation,
  useGetInvoicesQuery,
  useTopUpMutation,
} = billingApi;
export default billingApi;
