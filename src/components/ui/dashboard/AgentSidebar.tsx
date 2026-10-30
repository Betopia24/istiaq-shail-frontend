"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/feature/user/userSlice";
import {
  LayoutGrid,
  Sparkles,
  FolderOpen,
  PenLine,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";

interface AgentSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/agent-dashboard",
    icon: LayoutGrid,
    matchExact: true,
  },
  {
    title: "Create Pack",
    href: "/agent-dashboard/create",
    icon: Sparkles,
  },
  {
    title: "Saved Packs",
    href: "/agent-dashboard/saved-packs",
    icon: FolderOpen,
    badge: 18,
  },
  {
    title: "Leads & Inquiries",
    href: "/agent-dashboard/leads",
    icon: Users,
    badge: 4,
  },
  {
    title: "Agency Branding",
    href: "/agent-dashboard/branding",
    icon: PenLine,
  },
  {
    title: "Settings & Billing",
    href: "/agent-dashboard/settings",
    icon: Settings,
  },
];

export function AgentSidebar({ onClose, isMobile = false }: AgentSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user?.user);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  const displayName = user?.name || "Ishtiaq Sohail";
  const displayAgency = "Prestige Estates UK";
  const initials =
    displayName && displayName.trim().length > 0
      ? displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "IS";

  const isCollapsed = !isMobile && collapsed;

  return (
    <aside
      className={`h-screen bg-[#06143E] text-white flex flex-col justify-between transition-all duration-300 relative border-r border-[#0D1D45] select-none shrink-0 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header & Brand */}
      <div>
        {isCollapsed ? (
          /* Collapsed Header: Centered stacked logo & expand toggle */
          <div className="py-4 px-2 flex flex-col items-center gap-2.5 border-b border-[#0D1D45]/70">
            <Link
              href="/"
              className="w-10 h-10 rounded-xl bg-[#0E2052] border border-[#E8A808]/40 flex items-center justify-center text-[#E8A808] font-heading font-bold text-base shadow-xs transition hover:scale-105 active:scale-95"
              title="Property Pack AI"
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
          <div className="h-20 flex items-center justify-between px-5">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo-light.svg"
                alt="Property Pack AI Logo"
                width={150}
                height={46}
                priority
                className="w-[145px] h-auto object-contain"
              />
            </Link>

            {isMobile ? (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0D1E4A] transition cursor-pointer"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Navigation Items */}
        <nav
          className={`space-y-1 mt-3 ${
            isCollapsed ? "px-2" : "px-3"
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.matchExact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                className={`group relative flex items-center rounded-xl border transition-colors duration-150 font-medium ${
                  isCollapsed
                    ? "w-11 h-11 mx-auto justify-center"
                    : "h-11 px-3 justify-between"
                } ${
                  isActive
                    ? "bg-[#102253] text-white border-[#E8A808]/30 shadow-xs"
                    : "border-transparent text-slate-300 hover:text-white hover:bg-white/[0.06]"
                }`}
                title={isCollapsed ? item.title : undefined}
              >
                {/* Left Content */}
                <div
                  className={`flex items-center min-w-0 ${
                    isCollapsed ? "justify-center" : "gap-2.5"
                  }`}
                >
                  {/* Active Indicator Bar (Expanded mode — always in DOM to prevent layout shift) */}
                  {!isCollapsed && (
                    <span
                      className={`w-1 h-4 rounded-full shrink-0 transition-colors duration-150 ${
                        isActive ? "bg-[#E8A808]" : "bg-transparent"
                      }`}
                    />
                  )}

                  <Icon
                    className={`shrink-0 transition-colors ${
                      isCollapsed ? "w-5 h-5" : "w-4.5 h-4.5"
                    } ${
                      isActive
                        ? "text-[#E8A808]"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="truncate text-xs font-semibold tracking-tight">
                      {item.title}
                    </span>
                  )}
                </div>

                {/* Badge (Expanded mode) */}
                {!isCollapsed && item.badge !== undefined && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                      isActive
                        ? "bg-[#E8A808]/20 text-[#E8A808] border border-[#E8A808]/35"
                        : "bg-white/[0.08] text-slate-300 border border-white/10"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div className={`mt-auto ${isCollapsed ? "p-2 pb-4" : "p-3 pb-4"}`}>
        {isCollapsed ? (
          /* Collapsed Bottom Profile */
          <div className="flex flex-col items-center gap-2.5">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-xl bg-[#E8A808] text-[#06143E] font-heading font-bold text-xs flex items-center justify-center shadow-xs cursor-default"
                title={`${displayName} (${displayAgency})`}
              >
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#06143E]" />
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Expanded Bottom Profile */
          <div className="bg-[#0C1B42] rounded-xl p-3 flex items-center justify-between border border-[#172D6B]/70 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-xl bg-[#E8A808] text-[#06143E] font-heading font-bold text-xs flex items-center justify-center shadow-xs">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0C1B42]" />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-semibold text-white truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {displayAgency}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer shrink-0 ml-1"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
