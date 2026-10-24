"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AgentSidebar } from "./AgentSidebar";
import { Menu, X } from "lucide-react";

export function AgentLayoutShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6F9]">
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
        <div className="md:hidden flex items-center justify-between px-5 py-3.5 bg-[#06143E] text-white border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
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
        <main className="flex-1 p-5 sm:p-7 md:p-8 lg:p-9 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
