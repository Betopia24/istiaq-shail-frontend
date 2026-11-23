import { SignJWT, jwtVerify } from "jose";
import type { AuthRole, SessionUser } from "@/types/auth";

/**
 * The `pp_session` cookie: a small signed summary of who is signed in (id, role, agency), used for quick
 * route checks in proxy.ts and the server layouts. It holds no API token and grants nothing by itself:
 * every API call is still checked by the backend with the httpOnly access token.
 *
 * No `server-only` import here: proxy.ts uses this too.
 */
export const SESSION_COOKIE = "pp_session";

const ROLES: ReadonlySet<string> = new Set(["owner", "administrator", "valuer", "negotiator", "super_admin"]);

function secret(): Uint8Array {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters (openssl rand -base64 48)");
  }
  return new TextEncoder().encode(value);
}

export async function signSession(user: SessionUser, maxAgeSeconds: number): Promise<string> {
  return new SignJWT({ name: user.name, email: user.email, role: user.role, agencyId: user.agencyId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAgeSeconds)
    .sign(secret());
}

/** The signed-in user, or null for a missing, forged, expired or malformed cookie. */
export async function verifySession(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    const role = typeof payload.role === "string" && ROLES.has(payload.role) ? (payload.role as AuthRole) : null;
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      name: typeof payload.name === "string" ? payload.name : "",
      email: typeof payload.email === "string" ? payload.email : "",
      role,
      agencyId: typeof payload.agencyId === "string" ? payload.agencyId : null,
    };
  } catch {
    return null;
  }
}

/** Where a signed-in user belongs by default. */
export function homeFor(user: Pick<SessionUser, "role">): string {
  return user.role === "super_admin" ? "/admin-dashboard" : "/agent-dashboard";
}

/** Only same-site paths: `?redirect=https://evil.example` or `//evil.example` must not leave the app. */
export function safeRedirect(value: string | null | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null;
  return value;
}
