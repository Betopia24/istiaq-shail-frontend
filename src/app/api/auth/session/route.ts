import { getSessionUser } from "@/lib/auth/server";

/** Who is signed in, for the browser: { user } or { user: null }. Never returns tokens. */
export async function GET() {
  const user = await getSessionUser();
  return Response.json({ user }, { headers: { "cache-control": "no-store" } });
}
