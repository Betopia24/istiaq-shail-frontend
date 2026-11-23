import "server-only";
import { apiUrl, clientIp, isSameOrigin, storeAuth, type AuthResult } from "./server";

const MAX_BODY = 16 * 1024;

export function errorResponse(status: number, code: string, message: string) {
  return Response.json({ code, message }, { status });
}

/**
 * Shared by login, sign-up and invitation accept: forwards the JSON body to the API and, on success, keeps the
 * tokens in httpOnly cookies and returns only `{ user, role }` to the browser.
 */
export async function signInThrough(request: Request, apiPath: string, options: { remember?: (body: Record<string, unknown>) => boolean; status?: number } = {}) {
  if (!isSameOrigin(request)) return errorResponse(403, "forbidden", "Cross-site request refused");
  const raw = await request.text();
  if (raw.length > MAX_BODY) return errorResponse(413, "too_large", "Request too large");

  let body: Record<string, unknown>;
  try {
    body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    return errorResponse(400, "bad_json", "Invalid JSON");
  }

  let response: Response;
  try {
    const ip = clientIp(request.headers);
    response = await fetch(apiUrl(apiPath), {
      method: "POST",
      headers: { "content-type": "application/json", ...(ip ? { "x-forwarded-for": ip } : {}) },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return errorResponse(503, "api_unreachable", "The service is unavailable. Please try again shortly.");
  }

  const data = (await response.json().catch(() => null)) as (AuthResult & Record<string, unknown>) | null;
  if (!response.ok || !data?.accessToken) {
    // Pass the API's own error ({ code, message, fields }) through, minus anything unexpected.
    const error = data && typeof data === "object" ? { code: data.code ?? "error", message: data.message ?? "Request failed", ...(data.fields ? { fields: data.fields } : {}) } : { code: "error", message: "Request failed" };
    const headers = response.headers.get("retry-after") ? { "retry-after": response.headers.get("retry-after")! } : undefined;
    return Response.json(error, { status: response.ok ? 502 : response.status, headers });
  }

  const remember = options.remember ? options.remember(body) : true;
  const user = await storeAuth(data, remember);
  return Response.json({ user, role: data.role }, { status: options.status ?? 200 });
}
