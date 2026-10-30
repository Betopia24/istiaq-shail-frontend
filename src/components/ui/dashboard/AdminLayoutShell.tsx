"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminSidebar } from "./AdminSidebar";
import { Menu } from "lucide-react";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-[#080F24] shadow-2xl">
            <AdminSidebar onClose={() => setMobileOpen(false)} isMobile />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Mobile Header (Hidden on md and up) */}
        <div className="md:hidden flex items-center justify-between px-5 py-3.5 bg-[#080F24] text-white border-b border-[#14254D] shrink-0">
          <div className="flex items-center gap-2.5">
            <Link href="/admin-dashboard" className="flex items-center">
              <Image
                src="/logo-light.svg"
                alt="Property Pack AI Logo"
                width={125}
                height={36}
                className="w-[115px] h-auto object-contain"
              />
            </Link>
            <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-[#14254D] text-[#8E9BB0] border border-[#1E356D] uppercase tracking-wider">
              SUPER ADMIN
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#14254D] transition cursor-pointer"
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
