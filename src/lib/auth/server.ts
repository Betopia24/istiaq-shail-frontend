import "server-only";
import { cookies } from "next/headers";
import type { AuthRole, SessionUser } from "@/types/auth";
import { SESSION_COOKIE, signSession, verifySession } from "./session-token";

/**
 * Server side of sign-in (BFF). The browser never sees an API token:
 * - `pp_at`  access token (httpOnly, lives as long as the token, ~15 min)
 * - `pp_rt`  refresh token (httpOnly, only sent to /api, 30 days or the browser session)
 * - `pp_session` signed summary for route checks (see session-token.ts)
 */
const ACCESS_COOKIE = "pp_at";
const REFRESH_COOKIE = "pp_rt";
const REFRESH_MAX_AGE = 30 * 24 * 3600;

/** openapi `AuthResult`. */
export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: { id: string; fullName: string; email: string; agencyId: string | null };
  role: AuthRole | null;
}

export function apiUrl(path: string): URL {
  const base = process.env.API_URL;
  if (!base) throw new Error("API_URL is not set (the backend's base URL, e.g. http://localhost:5050)");
  return new URL(`/v1${path}`, base);
}

const secureCookies = () => process.env.NODE_ENV === "production";

export function toSessionUser(result: Pick<AuthResult, "user" | "role">): SessionUser {
  return {
    id: result.user.id,
    name: result.user.fullName,
    email: result.user.email,
    role: result.role,
    agencyId: result.user.agencyId ?? null,
  };
}

/**
 * Stores a fresh sign-in. `remember: false` makes the refresh and session cookies last only until the browser
 * closes ("keep me signed in" unticked).
 */
export async function storeAuth(result: AuthResult, remember = true): Promise<SessionUser> {
  const store = await cookies();
  const user = toSessionUser(result);
  const base = { httpOnly: true, secure: secureCookies(), sameSite: "lax" as const };
  store.set(ACCESS_COOKIE, result.accessToken, { ...base, path: "/api", maxAge: Math.max(60, result.expiresIn) });
  store.set(REFRESH_COOKIE, result.refreshToken, { ...base, path: "/api", ...(remember ? { maxAge: REFRESH_MAX_AGE } : {}) });
  store.set(SESSION_COOKIE, await signSession(user, REFRESH_MAX_AGE), { ...base, path: "/", ...(remember ? { maxAge: REFRESH_MAX_AGE } : {}) });
  store.set("pp_remember", remember ? "1" : "0", { ...base, path: "/api", ...(remember ? { maxAge: REFRESH_MAX_AGE } : {}) });
  return user;
}

export async function clearAuth(): Promise<void> {
  const store = await cookies();
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, "pp_remember"]) store.set(name, "", { path: "/api", maxAge: 0 });
  store.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function readTokens() {
  const store = await cookies();
  return {
    accessToken: store.get(ACCESS_COOKIE)?.value,
    refreshToken: store.get(REFRESH_COOKIE)?.value,
    remember: store.get("pp_remember")?.value !== "0",
  };
}

/** The signed-in user from the session cookie, or null. For layouts and route handlers. */
export async function getSessionUser(): Promise<SessionUser | null> {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

/**
 * The visitor's IP for the backend's per-IP rate limits. Next sits behind a reverse proxy in production, which
 * appends the real client address as the last X-Forwarded-For entry; earlier entries can be forged by the client.
 */
export function clientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",").at(-1)!.trim() || null;
  return headers.get("x-real-ip");
}

/** State-changing requests must come from this site's own pages (defence in depth on top of SameSite cookies). */
export function isSameOrigin(request: Request): boolean {
  if (request.method === "GET" || request.method === "HEAD") return true;
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin" || site === "none";
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// ---------- refresh (rotating refresh tokens) ----------

/**
 * The backend rotates refresh tokens and treats a reused one as theft (it ends every session). Several
 * requests that notice an expired access token at once must therefore share ONE refresh: in-flight refreshes
 * are shared, and a finished one is remembered for 30 seconds for requests that still carry the old cookie.
 */
const inFlight = new Map<string, Promise<AuthResult | null>>();
const recent = new Map<string, { result: AuthResult; at: number }>();
const RECENT_MS = 30_000;

export function refreshTokens(refreshToken: string, ip: string | null): Promise<AuthResult | null> {
  const hit = recent.get(refreshToken);
  if (hit && Date.now() - hit.at < RECENT_MS) return Promise.resolve(hit.result);
  const running = inFlight.get(refreshToken);
  if (running) return running;

  const promise = (async () => {
    try {
      const response = await fetch(apiUrl("/auth/refresh"), {
        method: "POST",
        headers: { "content-type": "application/json", ...(ip ? { "x-forwarded-for": ip } : {}) },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) return null;
      const result = (await response.json()) as AuthResult;
      recent.set(refreshToken, { result, at: Date.now() });
      for (const [key, value] of recent) if (Date.now() - value.at > RECENT_MS) recent.delete(key);
      return result;
    } catch {
      return null;
    } finally {
      inFlight.delete(refreshToken);
    }
  })();
  inFlight.set(refreshToken, promise);
  return promise;
}

/** `exp` from a JWT without verifying it (the backend verifies); used to refresh shortly before expiry. */
export function expiresSoon(jwt: string | undefined, withinSeconds = 30): boolean {
  if (!jwt) return true;
  try {
    const payload = JSON.parse(Buffer.from(jwt.split(".")[1] ?? "", "base64url").toString("utf8")) as { exp?: number };
    return !payload.exp || payload.exp * 1000 - Date.now() < withinSeconds * 1000;
  } catch {
    return true;
  }
}
