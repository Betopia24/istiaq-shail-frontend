import baseApi from "../baseApi";
import type { AdminAgencyCredits, AdminAgencyList, AdminOverview, AdminSubscriptionList, AdminUser, AdminUserList, AuditList } from "@/types/models";

export interface AdminUsersQuery {
  q?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}
export interface AdminSubscriptionsQuery {
  plan?: string;
  state?: string;
  q?: string;
  page?: number;
  limit?: number;
}

/** Super admin console (screens 29 to 32). The billing CSV is a link: `/api/backend/admin/billing/export?from=...`. */
const adminApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAdminOverview: builder.query<AdminOverview, { fresh?: boolean } | void>({
      query: (params) => ({ url: "/admin/overview", params: params ?? undefined }),
      providesTags: ["Analytics"],
    }),
    getAdminUsers: builder.query<AdminUserList, AdminUsersQuery | void>({
      query: (params) => ({ url: "/admin/users", params: params ?? undefined }),
      providesTags: ["AdminUser"],
    }),
    setUserStatus: builder.mutation<AdminUser, { id: string; status: "active" | "suspended"; reason?: string }>({
      query: ({ id, ...body }) => ({ url: `/admin/users/${id}`, method: "PATCH", body }),
      invalidatesTags: ["AdminUser", "Analytics"],
    }),
    getAdminSubscriptions: builder.query<AdminSubscriptionList, AdminSubscriptionsQuery | void>({
      query: (params) => ({ url: "/admin/subscriptions", params: params ?? undefined }),
      providesTags: ["AdminSubscription"],
    }),
    /** 402 `payment_failed` (card declined again), 409 `nothing_to_retry`. */
    retrySubscription: builder.mutation<{ stripeInvoiceId: string; status: string | null; amountPence: number }, string>({
      query: (id) => ({ url: `/admin/subscriptions/${id}/retry`, method: "POST" }),
      invalidatesTags: ["AdminSubscription", "Analytics"],
    }),
    /** Every agency with its monthly-allowance and pay-as-you-go packs. */
    getAdminAgencies: builder.query<AdminAgencyList, { q?: string; page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/admin/agencies", params: params ?? undefined }),
      providesTags: ["AdminCredits"],
    }),
    getAdminAgencyCredits: builder.query<AdminAgencyCredits, string>({
      query: (id) => `/admin/agencies/${id}/credits`,
      providesTags: ["AdminCredits"],
    }),
    /** Positive adds packs, negative removes them from that pool. 402 `insufficient_credits` if the pool holds less. */
    adjustAgencyCredits: builder.mutation<AdminAgencyCredits, { id: string; pool: "allowance" | "payg"; amount: number; note: string }>({
      query: ({ id, ...body }) => ({ url: `/admin/agencies/${id}/credits`, method: "POST", body }),
      invalidatesTags: ["AdminCredits", "Analytics"],
    }),
    /** `allowance: null` goes back to the plan's own. 409 `no_subscription`. */
    setAgencyAllowance: builder.mutation<AdminAgencyCredits, { id: string; allowance: number | null; applyNow?: boolean }>({
      query: ({ id, ...body }) => ({ url: `/admin/agencies/${id}/allowance`, method: "PATCH", body }),
      invalidatesTags: ["AdminCredits"],
    }),
    getAuditLog: builder.query<AuditList, { action?: string; actorId?: string; targetId?: string; page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/admin/audit-log", params: params ?? undefined }),
    }),
  }),
});

export const {
  useGetAdminOverviewQuery,
  useGetAdminUsersQuery,
  useSetUserStatusMutation,
  useGetAdminSubscriptionsQuery,
  useRetrySubscriptionMutation,
  useGetAuditLogQuery,
  useGetAdminAgenciesQuery,
  useGetAdminAgencyCreditsQuery,
  useAdjustAgencyCreditsMutation,
  useSetAgencyAllowanceMutation,
} = adminApi;
export default adminApi;
