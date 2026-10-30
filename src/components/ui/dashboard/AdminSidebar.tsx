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
  X,
  Lock,
} from "lucide-react";
import Cookies from "js-cookie";

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

interface AdminSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export function AdminSidebar({ onClose, isMobile = false }: AdminSidebarProps = {}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isCollapsed = !isMobile && collapsed;

  return (
    <aside
      className={`h-screen bg-[#080F24] text-white flex flex-col justify-between transition-all duration-300 relative border-r border-[#101D3D] select-none shrink-0 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section */}
      <div className="p-5">
        {/* Header & Logo */}
        <div className="flex items-start justify-between">
          {!isCollapsed ? (
            <div className="flex flex-col">
              <Link
                href="/admin-dashboard"
                className="block"
                onClick={isMobile ? onClose : undefined}
              >
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
                <span className="inline-block px-2.5 py-0.5 rounded bg-[#14254D] text-[#8E9BB0] text-[9px] font-medium tracking-wider uppercase border border-[#1E356D]">
                  SUPER ADMIN
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex flex-col items-center">
              <div className="w-9 h-9 rounded-xl bg-[#14254D] border border-[#E8A808]/40 flex items-center justify-center text-[#E8A808] font-medium text-sm shadow-inner">
                P
              </div>
            </div>
          )}

          {/* Toggle or Close Button */}
          {isMobile ? (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#14254D] transition cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#14254D] transition mt-1 cursor-pointer"
              aria-label="Toggle sidebar collapse"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
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
                onClick={isMobile ? onClose : undefined}
                className={`group relative flex items-center h-11 rounded-lg transition-all duration-150 ${
                  isActive
                    ? "bg-[#14254D] text-white shadow-sm"
                    : "bg-transparent text-[#8E9BB0] hover:text-slate-100 hover:bg-[#14254D]/50"
                } ${isCollapsed ? "justify-center px-0" : "px-3"}`}
                title={isCollapsed ? item.title : undefined}
              >
                {/* Active Left Gold Vertical Pill Indicator */}
                {!isCollapsed && (
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
                {!isCollapsed && (
                  <span
                    className={`ml-2.5 text-xs font-medium truncate ${
                      isActive
                        ? "text-white"
                        : "text-[#8E9BB0] group-hover:text-white"
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

      {/* Bottom Profile Section with Lock Admin Console action */}
      <div className="p-4">
        <div
          className={`flex items-center justify-between bg-[#14254D] rounded-lg p-3 shadow-sm ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#E8A808] text-[#080F24] font-medium text-xs flex items-center justify-center shrink-0 shadow-sm">
              IS
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="text-xs font-medium text-white truncate leading-tight">
                  Ishtiaq Sohail
                </div>
                <div className="text-[10px] text-[#E8A808] font-medium truncate leading-tight mt-0.5">
                  Owner Access
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => {
                Cookies.remove("adminAuthorized", { path: "/" });
                window.location.reload();
              }}
              title="Lock Admin Console"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#1E356D] rounded-md transition cursor-pointer shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
