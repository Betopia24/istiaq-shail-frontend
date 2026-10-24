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
  Plus,
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
    icon: Plus,
  },
  {
    title: "Saved Packs",
    href: "/agent-dashboard/saved-packs",
    icon: FolderOpen,
    badge: 6,
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
        <div className="h-20 flex items-center justify-between px-5">
          {!isCollapsed ? (
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.svg"
                alt="Property Pack AI Logo"
                width={150}
                height={46}
                priority
                className="w-[145px] h-auto object-contain"
              />
            </Link>
          ) : (
            <Link
              href="/"
              className="mx-auto w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-[#E8A808] font-bold text-lg"
              title="Property Pack AI"
            >
              P
            </Link>
          )}

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
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0D1E4A] transition cursor-pointer"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
        <nav className="p-3.5 space-y-1.5 mt-2">
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
                className={`relative flex items-center justify-between px-4 py-3 rounded-lg font-sans transition-all group ${
                  isActive
                    ? "bg-[#092167] text-white font-semibold shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-[#092167]/40 font-medium"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
                title={isCollapsed ? item.title : undefined}
              >
                {/* Active Left Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#FFB800] rounded-full" />
                )}

                <div className="flex items-center gap-3.5 min-w-0">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive
                        ? "text-[#FFB800]"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate text-[15px]">{item.title}</span>
                  )}
                </div>

                {!isCollapsed && item.badge !== undefined && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                      isActive
                        ? "bg-[#FFB800] text-[#06143E]"
                        : "bg-[#0B1A42] text-slate-300"
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
      <div className="p-3.5">
        <div
          className={`bg-[#092167] rounded-lg p-2.5 flex items-center justify-between ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar Pill */}
            <div className="w-9 h-9 rounded-full bg-[#E8A808] text-[#06143E] font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              {initials}
            </div>

            {!isCollapsed && (
              <div className="min-w-0 leading-tight">
                <p className="text-sm font-semibold text-white truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {displayAgency}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
