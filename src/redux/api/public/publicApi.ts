import baseApi from "../baseApi";
import type { InvitationLookup, PublicPack } from "@/types/models";

export interface InquiryInput {
  fullName: string;
  email: string;
  phone?: string;
  /** ISO date-time */
  preferredAt?: string;
  consent: true;
  captchaToken?: string;
  /** Honeypot: leave empty. */
  website?: string;
}

/** Buyer side, no sign-in: 404 unknown link, 410 `link_unavailable` (disabled, expired or withdrawn). */
const publicApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPublicPack: builder.query<PublicPack, string>({
      query: (token) => `/public/${token}`,
    }),
    sendInquiry: builder.mutation<{ status: "received" }, { token: string; body: InquiryInput }>({
      query: ({ token, body }) => ({ url: `/public/${token}/inquiries`, method: "POST", body }),
    }),
    /** What the invite page shows before sign-up or sign-in. 410 `invite_expired` / `invite_used` / `invite_revoked`. */
    lookupInvitation: builder.query<InvitationLookup, string>({
      query: (token) => `/invitations/${token}`,
    }),
  }),
});

export const { useGetPublicPackQuery, useSendInquiryMutation, useLookupInvitationQuery } = publicApi;
export default publicApi;
