import baseApi from "../baseApi";
import type { Pack, PdfStatus, Valuation } from "@/types/models";

export interface ComparableInput {
  address: string;
  pricePence: number;
  /** YYYY-MM or YYYY-MM-DD */
  soldOn?: string;
  sizeSqFt?: number;
  distanceMiles?: number;
  propertyType?: string;
  bedrooms?: number;
}

/** Screen 17. 422 `valuation_incomplete` names the missing details in `fields`. */
const valuationApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getValuation: builder.query<Valuation, string>({
      query: (packId) => `/packs/${packId}/valuation`,
      providesTags: (_r, _e, id) => [{ type: "Valuation", id }],
    }),
    addComparable: builder.mutation<Valuation, { packId: string; body: ComparableInput }>({
      query: ({ packId, body }) => ({ url: `/packs/${packId}/valuation/comparables`, method: "POST", body }),
      invalidatesTags: (_r, _e, { packId }) => [{ type: "Valuation", id: packId }],
    }),
    removeComparable: builder.mutation<Valuation, { packId: string; comparableId: string }>({
      query: ({ packId, comparableId }) => ({ url: `/packs/${packId}/valuation/comparables/${comparableId}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { packId }) => [{ type: "Valuation", id: packId }],
    }),
    /** Sets the pack's guide price (or rent). */
    applyValuation: builder.mutation<Pack, { packId: string; strategy: "realistic" | "premium" | "accelerated" | "custom"; pricePence?: number }>({
      query: ({ packId, ...body }) => ({ url: `/packs/${packId}/valuation/apply`, method: "POST", body }),
      invalidatesTags: (_r, _e, { packId }) => [{ type: "Valuation", id: packId }, { type: "Pack", id: packId }, "Pack"],
    }),
    requestValuationPdf: builder.mutation<{ renderId: string; status: string }, string>({
      query: (packId) => ({ url: `/packs/${packId}/valuation/pdf`, method: "POST" }),
    }),
    getValuationPdfStatus: builder.query<PdfStatus, string>({
      query: (packId) => `/packs/${packId}/valuation/pdf`,
    }),
  }),
});

export const {
  useGetValuationQuery,
  useAddComparableMutation,
  useRemoveComparableMutation,
  useApplyValuationMutation,
  useRequestValuationPdfMutation,
  useGetValuationPdfStatusQuery,
} = valuationApi;
export default valuationApi;
