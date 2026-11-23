import baseApi from "../baseApi";
import type { AdminOverview, AdminSubscriptionList, AdminUser, AdminUserList, AuditList } from "@/types/models";

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
} = adminApi;
export default adminApi;
