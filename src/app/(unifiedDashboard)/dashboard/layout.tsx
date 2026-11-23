"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UnifiedSidebar } from "@/components/ui/dashboard/UnifiedSidebar";
import { DashboardHeader } from "@/components/ui/dashboard/DashboardHeader";
import { ShieldCheck, UserCheck, ArrowRightLeft } from "lucide-react";

export default function UnifiedDashboardLayout({
  children,
  admin,
  agent,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  agent: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user?.user);

  // Check if current user is an Admin
  const isSuperAdmin = user?.role === "super_admin";

  // Allow multi-role admins to toggle between Admin & Agent views on the unified route
  const [activeRoleView, setActiveRoleView] = useState<"admin" | "agent">(
    isSuperAdmin ? "admin" : "agent"
  );

  const currentRole = isSuperAdmin ? activeRoleView : "agent";

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Desktop Sidebar: Unified and dynamic */}
      <div className="hidden md:flex shrink-0">
        <UnifiedSidebar role={currentRole} />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={`relative z-10 w-64 h-full shadow-2xl ${
              currentRole === "admin" ? "bg-[#080F24]" : "bg-[#06143E]"
            }`}
          >
            <UnifiedSidebar
              role={currentRole}
              onClose={() => setMobileOpen(false)}
              isMobile
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Sticky Dashboard Header */}
        <DashboardHeader
          role={currentRole}
          onToggleMobileMenu={() => setMobileOpen(true)}
        />

        {/* Multi-Role Quick Switcher Banner (Visible only for Super Admin role) */}
        {isSuperAdmin && (
          <div className="bg-[#0A1636] border-b border-[#142654] px-4 sm:px-6 lg:px-8 py-2 text-white flex items-center justify-between text-xs shrink-0 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">
                Unified Multi-Role Dashboard:
              </span>
              <span className="text-slate-400 hidden sm:inline">
                Viewing {currentRole === "admin" ? "Super Admin Console" : "Agency Agent Workstation"}
              </span>
            </div>

            <button
              onClick={() =>
                setActiveRoleView(currentRole === "admin" ? "agent" : "admin")
              }
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] font-semibold text-xs transition-all shadow-xs cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Switch to {currentRole === "admin" ? "Agent View" : "Admin View"}</span>
            </button>
          </div>
        )}

        {/* Scrollable Dashboard View rendering the active parallel route slot */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6 pb-12">
            {children}
            {/* Parallel Route Slot Rendering */}
            {currentRole === "admin" ? admin : agent}
          </div>
        </main>
      </div>
    </div>
  );
}
