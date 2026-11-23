import { signInThrough } from "@/lib/auth/handlers";

/** Invite page. Body: { token, fullName?, password }. Joins the agency and signs in. */
export async function POST(request: Request) {
  return signInThrough(request, "/invitations/accept");
}
