import { apiUrl, clearAuth, isSameOrigin, readTokens } from "@/lib/auth/server";
import { errorResponse } from "@/lib/auth/handlers";

/** Ends this device's session on the API, then clears the cookies whatever the API said. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return errorResponse(403, "forbidden", "Cross-site request refused");
  const { accessToken, refreshToken } = await readTokens();
  if (accessToken && refreshToken) {
    await fetch(apiUrl("/auth/logout"), {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    }).catch(() => undefined);
  }
  await clearAuth();
  return new Response(null, { status: 204 });
}
