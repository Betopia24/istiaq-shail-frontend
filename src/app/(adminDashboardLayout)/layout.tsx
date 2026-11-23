import React, { Suspense } from "react";
import type { Metadata } from "next";
import { GateFallback, RequireSession } from "@/components/auth/RequireSession";
import { AdminLayoutShell } from "@/components/ui/dashboard/AdminLayoutShell";

// Opt out of instant-navigation validation: the session is read at request time.
export const instant = false;

export const metadata: Metadata = {
  title: "Admin Console | Property Pack AI",
  description: "Enterprise administration, agency management, and system analytics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Super admins only, checked on the server (proxy.ts redirects earlier; the API enforces it on every call).
  return (
    <Suspense fallback={<GateFallback dark />}>
      <RequireSession area="admin">
        <AdminLayoutShell>{children}</AdminLayoutShell>
      </RequireSession>
    </Suspense>
  );
}
