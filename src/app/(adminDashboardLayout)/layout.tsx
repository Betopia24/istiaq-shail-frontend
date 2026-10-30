import React from "react";
import type { Metadata } from "next";
import { AdminAuthGuard } from "@/components/auth/AdminAuthGuard";
import { AdminLayoutShell } from "@/components/ui/dashboard/AdminLayoutShell";

// Opt out of instant-navigation validation — this layout wraps a client-side
// auth guard + interactive shell that isn't compatible with static-shell analysis.
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
  return (
    <AdminAuthGuard>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AdminAuthGuard>
  );
}
