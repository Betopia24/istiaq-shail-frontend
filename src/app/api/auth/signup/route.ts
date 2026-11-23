import { signInThrough } from "@/lib/auth/handlers";

/** Screen 2. Body: { fullName, company, email, password, acceptTerms }. Signs the new owner in. */
export async function POST(request: Request) {
  return signInThrough(request, "/auth/signup", { status: 201 });
}
