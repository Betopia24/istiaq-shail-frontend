import React from "react";
import type { Metadata } from "next";
import { AgentLayoutShell } from "@/components/ui/dashboard/AgentLayoutShell";

// Opt out of instant-navigation validation — this layout wraps a fully
// interactive client shell (sidebar, header, mobile overlay) that isn't
// compatible with static-shell analysis. Navigation still works normally.
export const instant = false;

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
