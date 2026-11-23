import baseApi from "../baseApi";
import type { Branding, Compliance, NotificationSettings, Profile } from "@/types/models";

export type ProfileWithNotifications = Profile & { notifications: NotificationSettings };

/** Agency branding, compliance and the signed-in user's profile (screens 21, 22, 32). */
const agencyApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBranding: builder.query<Branding, void>({
      query: () => "/agency/branding",
      providesTags: ["Branding"],
    }),
    updateBranding: builder.mutation<Branding, Partial<Branding>>({
      query: (body) => ({ url: "/agency/branding", method: "PUT", body }),
      invalidatesTags: ["Branding"],
    }),
    /** multipart `file`: JPG, PNG or WebP. Returns the signed logo URL. */
    uploadLogo: builder.mutation<{ url: string }, File>({
      query: (file) => {
        const body = new FormData();
        body.append("file", file);
        return { url: "/agency/branding/logo", method: "POST", body };
      },
      invalidatesTags: ["Branding"],
    }),
    getCompliance: builder.query<Compliance, void>({
      query: () => "/agency/compliance",
      providesTags: ["Compliance"],
    }),
    updateCompliance: builder.mutation<Compliance, Partial<Compliance>>({
      query: (body) => ({ url: "/agency/compliance", method: "PUT", body }),
      invalidatesTags: ["Compliance"],
    }),
    getProfile: builder.query<ProfileWithNotifications, void>({
      query: () => "/me/profile",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<ProfileWithNotifications, Partial<Profile>>({
      query: (body) => ({ url: "/me/profile", method: "PUT", body }),
      invalidatesTags: ["User"],
    }),
    /** 400 when the current password is wrong. Other sessions are signed out. */
    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: "/me/password", method: "PUT", body }),
    }),
    updateNotifications: builder.mutation<NotificationSettings, Partial<NotificationSettings>>({
      query: (body) => ({ url: "/me/notifications", method: "PUT", body }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetBrandingQuery,
  useUpdateBrandingMutation,
  useUploadLogoMutation,
  useGetComplianceQuery,
  useUpdateComplianceMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUpdateNotificationsMutation,
} = agencyApi;
export default agencyApi;
