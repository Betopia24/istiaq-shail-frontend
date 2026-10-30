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

export function AdminSidebar({
  onClose,
  isMobile = false,
}: AdminSidebarProps = {}) {
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
      <div>
        {isCollapsed ? (
          /* Collapsed Header */
          <div className="py-4 px-2 flex flex-col items-center gap-2.5 border-b border-[#14254D]/40">
            <Link
              href="/admin-dashboard"
              className="w-10 h-10 rounded-xl bg-[#14254D] border border-[#E8A808]/40 flex items-center justify-center text-[#E8A808] font-heading font-bold text-base shadow-xs transition hover:scale-105 active:scale-95"
              title="Property Pack AI - Super Admin"
            >
              P
            </Link>
            <button
              onClick={() => setCollapsed(false)}
              className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Expanded Header */
          <div className="p-5">
            <div className="flex items-start justify-between">
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
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#14254D] text-[#8E9BB0] text-[9px] font-semibold tracking-wider uppercase border border-[#1E356D]">
                    SUPER ADMIN
                  </span>
                </div>
              </div>

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
                  onClick={() => setCollapsed(true)}
                  className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#14254D] transition mt-1 cursor-pointer"
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className={`space-y-1 mt-3 ${isCollapsed ? "px-2" : "px-3"}`}>
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
                className={`group relative flex items-center rounded-xl border transition-colors duration-150 font-medium ${
                  isCollapsed ? "w-11 h-11 mx-auto justify-center" : "h-11 px-3"
                } ${
                  isActive
                    ? "bg-[#14254D] text-white border-[#E8A808]/30 shadow-xs"
                    : "bg-transparent border-transparent text-[#8E9BB0] hover:text-slate-100 hover:bg-white/[0.05]"
                }`}
                title={isCollapsed ? item.title : undefined}
              >
                {/* Active Indicator Bar (expanded only) */}
                {!isCollapsed && (
                  <span
                    className={`w-1 h-4 rounded-full mr-2.5 shrink-0 transition-colors ${
                      isActive ? "bg-[#E8A808]" : "bg-transparent"
                    }`}
                  />
                )}

                {/* Icon */}
                <Icon
                  className={`shrink-0 transition-colors ${
                    isCollapsed ? "w-5 h-5" : "w-4.5 h-4.5"
                  } ${
                    isActive
                      ? "text-[#E8A808]"
                      : "text-[#7A8A9E] group-hover:text-slate-200"
                  }`}
                />

                {/* Title */}
                {!isCollapsed && (
                  <span
                    className={`ml-2.5 text-xs font-semibold truncate ${
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
      <div className={`mt-auto ${isCollapsed ? "p-2 pb-4" : "p-3 pb-4"}`}>
        {isCollapsed ? (
          /* Collapsed Bottom Profile */
          <div className="flex flex-col items-center gap-2.5">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-xl bg-[#E8A808] text-[#080F24] font-heading font-bold text-xs flex items-center justify-center shadow-xs cursor-default"
                title="Ishtiaq Sohail (Owner Access)"
              >
                IS
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#080F24]" />
            </div>
            <button
              onClick={() => {
                Cookies.remove("adminAuthorized", { path: "/" });
                window.location.reload();
              }}
              title="Lock Admin Console"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              aria-label="Lock Admin Console"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Expanded Bottom Profile */
          <div className="flex items-center justify-between bg-[#122143] rounded-xl p-3 shadow-xs border border-[#1E356D]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-xl bg-[#E8A808] text-[#080F24] font-heading font-bold text-xs flex items-center justify-center shadow-xs">
                  IS
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#122143]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate leading-tight">
                  Ishtiaq Sohail
                </div>
                <div className="text-[10px] text-[#E8A808] font-medium truncate leading-tight mt-0.5">
                  Owner Access
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                Cookies.remove("adminAuthorized", { path: "/" });
                window.location.reload();
              }}
              title="Lock Admin Console"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer shrink-0 ml-1"
              aria-label="Lock Admin Console"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
