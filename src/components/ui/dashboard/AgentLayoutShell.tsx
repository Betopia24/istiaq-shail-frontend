"use client";

import React, { useState } from "react";
import { AgentSidebar } from "./AgentSidebar";
import { DashboardHeader } from "./DashboardHeader";

export function AgentLayoutShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <AgentSidebar />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-[#06143E] shadow-2xl">
            <AgentSidebar onClose={() => setMobileOpen(false)} isMobile />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Sticky Dashboard Header */}
        <DashboardHeader
          role="agent"
          onToggleMobileMenu={() => setMobileOpen(true)}
        />

        {/* Scrollable Dashboard View */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
