import baseApi from "../baseApi";
import type { Invitation, Member, MemberRole, TeamList } from "@/types/models";

/** Screens 24, 25. Accepting an invite goes through `authClient.acceptInvite` (it signs the user in). */
const teamApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTeam: builder.query<TeamList, void>({
      query: () => "/team",
      providesTags: ["Team"],
    }),
    /** 402 `seat_limit`, 409 `already_member` / `already_invited`. */
    inviteMember: builder.mutation<Invitation, { email: string; role: Exclude<MemberRole, "owner"> }>({
      query: (body) => ({ url: "/team/invitations", method: "POST", body }),
      invalidatesTags: ["Team"],
    }),
    resendInvitation: builder.mutation<void, string>({
      query: (id) => ({ url: `/team/invitations/${id}/resend`, method: "POST" }),
      invalidatesTags: ["Team"],
    }),
    cancelInvitation: builder.mutation<void, string>({
      query: (id) => ({ url: `/team/invitations/${id}`, method: "DELETE" }),
      invalidatesTags: ["Team"],
    }),
    updateMember: builder.mutation<Member, { id: string; role?: MemberRole; status?: "active" | "deactivated" }>({
      query: ({ id, ...body }) => ({ url: `/team/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Team"],
    }),
    removeMember: builder.mutation<void, string>({
      query: (id) => ({ url: `/team/${id}`, method: "DELETE" }),
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useGetTeamQuery,
  useInviteMemberMutation,
  useResendInvitationMutation,
  useCancelInvitationMutation,
  useUpdateMemberMutation,
  useRemoveMemberMutation,
} = teamApi;
export default teamApi;
