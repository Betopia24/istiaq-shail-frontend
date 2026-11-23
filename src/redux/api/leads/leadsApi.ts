import baseApi from "../baseApi";
import type { LeadDetail, LeadList, LeadStatus } from "@/types/models";

export interface LeadsQuery {
  status?: LeadStatus;
  packId?: string;
  q?: string;
  page?: number;
  limit?: number;
}

/** Screen 20. The CSV export is a plain link: `/api/backend/leads/export?status=...` (cookies are sent). */
const leadsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getLeads: builder.query<LeadList, LeadsQuery | void>({
      query: (params) => ({ url: "/leads", params: params ?? undefined }),
      providesTags: ["Lead"],
    }),
    getLead: builder.query<LeadDetail, string>({
      query: (id) => `/leads/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Lead", id }],
    }),
    updateLeadStatus: builder.mutation<LeadDetail, { id: string; status: LeadStatus }>({
      query: ({ id, status }) => ({ url: `/leads/${id}`, method: "PATCH", body: { status } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Lead", id }, "Lead"],
    }),
    /** Anonymises: personal data erased, the row stays for the stats. */
    deleteLead: builder.mutation<void, string>({
      query: (id) => ({ url: `/leads/${id}`, method: "DELETE" }),
      invalidatesTags: ["Lead"],
    }),
  }),
});

export const { useGetLeadsQuery, useGetLeadQuery, useUpdateLeadStatusMutation, useDeleteLeadMutation } = leadsApi;
export default leadsApi;
