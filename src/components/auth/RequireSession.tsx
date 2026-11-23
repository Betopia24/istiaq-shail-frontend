import "server-only";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/server";
import { homeFor } from "@/lib/auth/session-token";

/**
 * Server-side gate for a dashboard area (the Data Access Layer check behind proxy.ts). Renders inside a
 * <Suspense> boundary, as Cache Components requires for session reads.
 *
 * - `area="admin"`: super admins only.
 * - `area="agency"`: signed-in agency users (super admins are sent to the admin console).
 */
export async function RequireSession({ area, children }: { area: "admin" | "agency"; children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect(`/login?redirect=${area === "admin" ? "/admin-dashboard" : "/agent-dashboard"}`);
  if (area === "admin" && user.role !== "super_admin") redirect(homeFor(user));
  if (area === "agency" && user.role === "super_admin") redirect("/admin-dashboard");
  return <>{children}</>;
}

export function GateFallback({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${dark ? "bg-[#070F26]" : "bg-[#F8FAFC]"}`}>
      <div className="w-8 h-8 rounded-full border-2 border-[#E8A808] border-t-transparent animate-spin" aria-label="Loading" />
    </div>
  );
}
