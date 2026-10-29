"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

export const adminNavItems = [
  {
    title: "Platform Overview",
    href: "/admin-dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Agencies & Users",
    href: "/admin-dashboard/agencies",
    icon: Users,
  },
  {
    title: "Subscriptions & Logs",
    href: "/admin-dashboard/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/admin-dashboard/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#080F24] z-40 px-4 flex items-center justify-between border-b border-[#14254D]">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo-light.svg"
            alt="Property Pack AI"
            width={125}
            height={36}
            className="w-[115px] h-auto object-contain"
          />
          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#14254D] text-[#8E9BB0] border border-[#1E356D] uppercase tracking-wider">
            SUPER ADMIN
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-[#14254D] transition"
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 bg-[#080F24] text-white flex flex-col justify-between transition-all duration-300 border-r border-[#101D3D] ${
          collapsed ? "md:w-20" : "md:w-60"
        } ${mobileOpen ? "w-60 translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Top Section */}
        <div className="p-5">
          {/* Header & Logo */}
          <div className="flex items-start justify-between">
            {!collapsed ? (
              <div className="flex flex-col">
                <Link href="/admin-dashboard" className="block">
                  <Image
                    src="/logo-light.svg"
                    alt="Property Pack AI"
                    width={155}
                    height={44}
                    priority
                    className="w-[145px] h-auto object-contain"
                  />
                </Link>
                {/* Super Admin Pill Badge */}
                <div className="mt-2.5">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#14254D] text-[#8E9BB0] text-[9px] font-bold tracking-wider uppercase border border-[#1E356D]">
                    SUPER ADMIN
                  </span>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-[#14254D] border border-[#E8A808]/40 flex items-center justify-center text-[#E8A808] font-bold text-sm shadow-inner">
                  P
                </div>
              </div>
            )}

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1 rounded-md text-slate-400 hover:text-white transition mt-1"
              aria-label="Toggle sidebar collapse"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="mt-8 space-y-1.5">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin-dashboard"
                  ? pathname === "/admin-dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group relative flex items-center h-11 rounded-lg transition-all duration-150 ${
                    isActive
                      ? "bg-[#14254D] text-white shadow-sm"
                      : "bg-transparent text-[#8E9BB0] hover:text-slate-100 hover:bg-[#14254D]/50"
                  } ${collapsed ? "justify-center px-0" : "px-3"}`}
                  title={collapsed ? item.title : undefined}
                >
                  {/* Active Left Gold Vertical Pill Indicator */}
                  {!collapsed && (
                    <div
                      className={`w-[3px] h-4 rounded-full mr-2.5 shrink-0 transition-colors ${
                        isActive ? "bg-[#E8A808]" : "bg-transparent"
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? "text-[#E8A808]"
                        : "text-[#7A8A9E] group-hover:text-slate-200"
                    }`}
                  />

                  {/* Title */}
                  {!collapsed && (
                    <span
                      className={`ml-2.5 text-xs font-semibold truncate ${
                        isActive ? "text-white" : "text-[#8E9BB0] group-hover:text-white"
                      }`}
                    >
                      {item.title}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Section (Floating Rounded Card like Figma) */}
        <div className="p-4">
          <div
            className={`flex items-center gap-3 bg-[#14254D] rounded-lg p-3 shadow-sm ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#E8A808] text-[#080F24] font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              IS
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate leading-tight">
                  Ishtiaq Sohail
                </div>
                <div className="text-[10px] text-[#E8A808] font-medium truncate leading-tight mt-0.5">
                  Owner Access
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

