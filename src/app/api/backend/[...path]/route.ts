import { apiUrl, clearAuth, clientIp, expiresSoon, isSameOrigin, readTokens, refreshTokens, storeAuth } from "@/lib/auth/server";
import { errorResponse } from "@/lib/auth/handlers";

/**
 * Browser → /api/backend/<path> → API /v1/<path>, with the access token from the httpOnly cookie.
 * Refreshes the token when it is about to expire (or the API answers 401) and retries once.
 * The browser never sees a token, and these routes refuse cross-site requests.
 */

/** These return or end tokens, so they have their own routes under /api/auth (or are for Stripe only). */
const BLOCKED = new Set(["auth/login", "auth/signup", "auth/refresh", "auth/logout", "invitations/accept", "billing/webhook"]);

/** Response headers passed back to the browser. */
const PASS_HEADERS = ["content-type", "content-disposition", "retry-after", "location", "cache-control"];

const MAX_BODY_BYTES = 200 * 1024 * 1024; // photo uploads: up to 20 files

type Context = { params: Promise<{ path: string[] }> };

async function handle(request: Request, context: Context) {
  const { path } = await context.params;
  if (!path.length || path.some((segment) => !segment || segment === "." || segment === ".." || /[\\/]/.test(segment))) {
    return errorResponse(400, "bad_path", "Invalid path");
  }
  const joined = path.join("/");
  if (BLOCKED.has(joined)) return errorResponse(404, "not_found", "Not found");
  if (!isSameOrigin(request)) return errorResponse(403, "forbidden", "Cross-site request refused");

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return errorResponse(413, "too_large", "Upload too large");
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();

  const target = apiUrl(`/${path.map(encodeURIComponent).join("/")}`);
  target.search = new URL(request.url).search;
  const ip = clientIp(request.headers);

  const tokens = await readTokens();
  let { accessToken, refreshToken } = tokens;
  const { remember } = tokens;
  const signedIn = !!(accessToken || refreshToken);
  let refreshed = false;

  const refresh = async () => {
    if (!refreshToken || refreshed) return false;
    refreshed = true;
    const result = await refreshTokens(refreshToken, ip);
    if (!result) return false;
    await storeAuth(result, remember);
    accessToken = result.accessToken;
    refreshToken = result.refreshToken;
    return true;
  };

  if (refreshToken && expiresSoon(accessToken)) await refresh();

  const send = () => {
    const headers = new Headers();
    for (const name of ["content-type", "accept", "accept-language"]) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    if (ip) headers.set("x-forwarded-for", ip);
    if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
    return fetch(target, {
      method: request.method,
      headers,
      body,
      redirect: "manual", // the buyer PDF answers 302 to a signed file link: pass it to the browser
      cache: "no-store",
      signal: AbortSignal.timeout(120_000),
    });
  };

  let upstream: Response;
  try {
    upstream = await send();
    if (upstream.status === 401 && (await refresh())) upstream = await send();
  } catch {
    return errorResponse(503, "api_unreachable", "The service is unavailable. Please try again shortly.");
  }

  if (upstream.status === 401 && signedIn) {
    // The refresh token is gone, expired or revoked: end the session here too.
    await clearAuth();
    return errorResponse(401, "session_expired", "Your session has ended. Please sign in again.");
  }

  const headers = new Headers();
  for (const name of PASS_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (!headers.has("cache-control")) headers.set("cache-control", "no-store");
  return new Response(upstream.status === 204 || upstream.status === 304 ? null : upstream.body, { status: upstream.status, headers });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
