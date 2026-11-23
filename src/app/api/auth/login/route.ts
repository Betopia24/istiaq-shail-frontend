import { signInThrough } from "@/lib/auth/handlers";

/** Screen 3. Body: { email, password, rememberMe }. Sets httpOnly cookies; returns { user, role }. */
export async function POST(request: Request) {
  return signInThrough(request, "/auth/login", { remember: (body) => body.rememberMe !== false });
}
