"use client";

import type { ApiErrorBody, AuthRole, SessionUser } from "@/types/auth";

/** An API error with the server's `code`, `message` and per-field messages. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields: Record<string, string> = {},
  ) {
    super(message);
  }
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "same-origin",
    });
  } catch {
    throw new ApiError(0, "network_error", "Can't reach the server. Check your connection and try again.");
  }
  if (response.status === 204) return undefined as T;
  const data = (await response.json().catch(() => null)) as (T & Partial<ApiErrorBody>) | null;
  if (!response.ok) {
    throw new ApiError(response.status, data?.code ?? "error", data?.message ?? "Something went wrong. Please try again.", data?.fields ?? {});
  }
  return data as T;
}

type SignedIn = { user: SessionUser; role: AuthRole | null };

/** Sign-in and sign-up go to this app's server, which keeps the tokens in httpOnly cookies. */
export const authClient = {
  login: (input: { email: string; password: string; rememberMe: boolean }) => post<SignedIn>("/api/auth/login", input),
  signup: (input: { fullName: string; company?: string; email: string; password: string; acceptTerms: boolean }) =>
    post<SignedIn>("/api/auth/signup", input),
  acceptInvite: (input: { token: string; fullName?: string; password: string }) => post<SignedIn>("/api/auth/accept-invite", input),
  logout: () => post<void>("/api/auth/logout"),
  async session(): Promise<SessionUser | null> {
    const response = await fetch("/api/auth/session", { credentials: "same-origin", cache: "no-store" });
    if (!response.ok) return null;
    return ((await response.json()) as { user: SessionUser | null }).user;
  },
};

/** First message to show for an API error: a field message if there is one, else the general message. */
export function errorText(error: unknown): string {
  if (error instanceof ApiError) return Object.values(error.fields)[0] ?? error.message;
  const data = (error as { data?: Partial<ApiErrorBody> })?.data;
  if (data?.fields) return Object.values(data.fields)[0] ?? data.message ?? "Something went wrong.";
  return data?.message ?? "Something went wrong. Please try again.";
}
