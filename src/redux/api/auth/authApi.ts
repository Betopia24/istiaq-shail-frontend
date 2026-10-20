import {
  IBaseResponse,
  IForgotPasswordPayload,
  IUserResponse,
  IVerifyOTPPayload,
  IResendOTPReqBody,
} from "@/types/global";
import baseApi from "../baseApi";

export type WorkingDay = "M" | "T" | "W" | "TH" | "F" | "S" | "SU";

export type ResourceRegistration = {
  name: string;
  role?: string;
  email: string;
  password?: string;
  companyName?: string;
  location?: string | null;
  expertise?: string[];
  startTime?: string | null;
  endTime?: string | null;
  workingDays?: WorkingDay[];
  notes?: string | null;
  profileImage?: File | null;
};

export type AuthSuccessResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone?: string;
    accessToken?: string;
    [key: string]: unknown;
  };
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  success: boolean;
  message?: string;
  data: {
    result: unknown;
    user: {
      id: string;
      name: string;
      email: string;
      role?: string;
    };
    accessToken: string;
  };
};

export interface ResourceUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  location?: string | null;
  expertise?: { set: string[] } | string[] | null | undefined;
  workingDays?: { set: WorkingDay[] } | WorkingDay[] | null | undefined;
  startTime?: string | null;
  endTime?: string | null;
  notes?: string | null;
  profileImage?: string | null;
}

const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    logIn: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    signUp: builder.mutation<AuthSuccessResponse, ResourceRegistration>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    getAllResource: builder.query<IUserResponse, void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getAllUsers: builder.query<any, void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateUserRole: builder.mutation<any, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    forgotPassword: builder.mutation({
      query: (body: IForgotPasswordPayload) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    resetPassword: builder.mutation<IBaseResponse, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: `/auth/reset-password?token=${token}`,
        method: "POST",
        body: { password },
      }),
      invalidatesTags: ["User"],
    }),

    setUpPassword: builder.mutation({
      query: (body: unknown) => ({
        url: "/auth/set-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    updateProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: "/users/update-profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    verifyOtp: builder.mutation({
      query: (body: IVerifyOTPPayload) => ({
        url: "/otp/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    resendOtp: builder.mutation<IBaseResponse, IResendOTPReqBody>({
      query: (body) => ({
        url: "/otp/resend",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLogInMutation,
  useSignUpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSetUpPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useGetAllResourceQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = authApi;

export default authApi;
