import React from "react";
import type { Metadata } from "next";
import { DashboardHeader } from "@/components/ui/dashboard/DashboardHeader";
import { AgentSidebar } from "@/components/ui/dashboard/AgentSidebar";

export const metadata: Metadata = {
  title: "Agent Workstation | Property Pack AI",
  description: "Generate high-converting valuation reports and property marketing packs.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AgentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AgentSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader role="agent" />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
