import React from "react";
import type { Metadata } from "next";
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
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 p-5 sm:p-7 md:p-8 lg:p-10 pt-20 md:pt-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

