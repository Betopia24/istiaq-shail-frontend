"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AgentSidebar } from "./AgentSidebar";
import { Menu } from "lucide-react";

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
        {/* Mobile Header (Hidden on md and up) */}
        <div className="md:hidden flex items-center justify-between px-5 py-3.5 bg-[#06143E] text-white border-b border-slate-800 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-light.svg"
              alt="Property Pack AI Logo"
              width={140}
              height={40}
              className="w-[130px] h-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Dashboard View */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
