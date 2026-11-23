import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { sessionExpired } from "@/feature/user/userSlice";

/**
 * Every API call goes through this app's own server (`/api/backend/...`), which adds the access token from an
 * httpOnly cookie and refreshes it when needed. No token is ever handled in the browser.
 */
const rawBaseQuery = fetchBaseQuery({ baseUrl: "/api/backend" });

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extra) => {
  const result = await rawBaseQuery(args, api, extra);
  const error = result.error as { status?: number; data?: { code?: string } } | undefined;
  if (error?.status === 401 && error.data?.code === "session_expired") api.dispatch(sessionExpired());
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ["User", "Pack", "Share", "Pdf", "Valuation", "Subscription", "Lead", "Team", "Branding", "Compliance", "Analytics", "AdminUser", "AdminSubscription"],
});

export default baseApi;
