import baseApi from "../baseApi";

/**
 * Account endpoints that don't return tokens (openapi.yaml, Auth). Sign-in, sign-up, invitation accept and
 * sign-out go through `authClient` (src/lib/auth/client.ts) instead, so tokens stay in httpOnly cookies.
 */
const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    /** Screen 4. Always 202, whether or not the email has an account. */
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (body) => ({ url: "/auth/forgot", method: "POST", body }),
    }),

    /** Screen 5. `password_reset` returns a short-lived resetToken; `email_verify` returns { verified: true }. */
    verifyOtp: builder.mutation<
      { resetToken?: string; verified?: boolean },
      { email: string; code: string; purpose?: "password_reset" | "email_verify" }
    >({
      query: (body) => ({ url: "/auth/verify-otp", method: "POST", body }),
    }),

    /** Screen 6. Sets the new password and signs out every session. */
    resetPassword: builder.mutation<void, { resetToken: string; password: string }>({
      query: (body) => ({ url: "/auth/reset", method: "POST", body }),
    }),

    /** New email-verification code for the signed-in user. */
    resendVerification: builder.mutation<void, void>({
      query: () => ({ url: "/auth/resend-verification", method: "POST" }),
    }),

    getProfile: builder.query<Record<string, unknown>, void>({
      query: () => "/me/profile",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useResendVerificationMutation,
  useGetProfileQuery,
} = authApi;

export default authApi;
