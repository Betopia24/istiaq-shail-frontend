import React from "react";
import type { Metadata } from "next";
import { AgentLayoutShell } from "@/components/ui/dashboard/AgentLayoutShell";

export const metadata: Metadata = {
  title: "Agent Overview | Property Pack AI",
  description: "Manage your property marketing collateral & PDF reports.",
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
  return <AgentLayoutShell>{children}</AgentLayoutShell>;
}
