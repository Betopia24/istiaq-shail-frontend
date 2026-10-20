import React from "react";
import type { Metadata } from "next";
import { DashboardHeader } from "@/components/ui/dashboard/DashboardHeader";
import { AdminSidebar } from "@/components/ui/dashboard/AdminSidebar";

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
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader role="admin" />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
