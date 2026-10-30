import React from "react";
import type { Metadata } from "next";
import { AdminAuthGuard } from "@/components/auth/AdminAuthGuard";
import { AdminLayoutShell } from "@/components/ui/dashboard/AdminLayoutShell";

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
