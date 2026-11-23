import baseApi from "../baseApi";
import type { Address, Invoice, Plan, Subscription } from "@/types/models";

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

    /** Credits arrive after Stripe confirms the payment (webhook): refetch the subscription afterwards. */
    topUp: builder.mutation<{ clientSecret: string; amountPence: number; packs: number }, { packs: number }>({
      query: (body) => ({ url: "/billing/top-up", method: "POST", body }),
    }),
  }),
});

export const {
  useGetPlansQuery,
  useStartCheckoutMutation,
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
  useOpenBillingPortalMutation,
  useGetInvoicesQuery,
  useTopUpMutation,
} = billingApi;
export default billingApi;
