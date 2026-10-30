"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/feature/user/userSlice";
import {
  Bell,
  Search,
  LogOut,
  ShieldCheck,
  Menu,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Cookies from "js-cookie";

interface DashboardHeaderProps {
  role?: "admin" | "agent";
  onToggleMobileMenu?: () => void;
}

const breadcrumbTitles: Record<string, { portal: string; page: string }> = {
  "/agent-dashboard": { portal: "Agent Portal", page: "Overview" },
  "/agent-dashboard/create": { portal: "Agent Portal", page: "Create Pack" },
  "/agent-dashboard/saved-packs": { portal: "Agent Portal", page: "Saved Packs" },
  "/agent-dashboard/leads": { portal: "Agent Portal", page: "Leads & Viewing Requests" },
  "/agent-dashboard/branding": { portal: "Agent Portal", page: "Agency Branding" },
  "/agent-dashboard/editor": { portal: "Agent Portal", page: "Live Pack Editor" },
  "/agent-dashboard/settings": { portal: "Agent Portal", page: "Settings & Team" },
  "/admin-dashboard": { portal: "Super Admin", page: "Platform Overview" },
  "/admin-dashboard/agencies": { portal: "Super Admin", page: "Agency Teams" },
  "/admin-dashboard/subscriptions": { portal: "Super Admin", page: "Billing & Logs" },
  "/admin-dashboard/settings": { portal: "Super Admin", page: "Security & Access" },
};

export function DashboardHeader({
  role = "agent",
  onToggleMobileMenu,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user?.user);
  const dispatch = useDispatch();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    if (role === "admin") {
      Cookies.remove("adminAuthorized", { path: "/" });
      window.location.reload();
    } else {
      dispatch(logout());
      window.location.href = "/login";
    }
  };

  const displayName = user?.name || "Ishtiaq Sohail";
  const displayAgency =
    role === "admin" ? "Master Platform Access" : "Prestige Estates UK";
  const currentCrumb =
    breadcrumbTitles[pathname] || {
      portal: role === "admin" ? "Super Admin" : "Agent Portal",
      page: "Dashboard",
    };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs shrink-0">
      {/* Left: Mobile Menu Toggle & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate"
        >
          <span className="text-slate-400 hidden sm:inline">
            {currentCrumb.portal}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline shrink-0" />
          <span className="text-slate-900 font-semibold truncate">
            {currentCrumb.page}
          </span>
        </nav>
      </div>

      {/* Middle: Universal Search (Desktop) */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={
              role === "admin"
                ? "Search agencies, transactions, audit logs..."
                : "Search property address, buyer leads, packs..."
            }
            className="w-full h-9 pl-9 pr-4 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#06143E] transition"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        {/* Credits or Telemetry Badge */}
        {role === "agent" ? (
          <Link
            href="/agent-dashboard/settings?tab=billing"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold hover:bg-amber-100/70 transition"
            title="Manage available pack allowance"
          >
            <span className="w-2 h-2 rounded-full bg-[#E8A808] animate-pulse" />
            <span>78 Packs Ready</span>
          </Link>
        ) : (
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold">Demo Sandbox Active</span>
          </div>
        )}

        {/* View Public Demo Site Button (Quick link) */}
        <Link
          href="/"
          target="_blank"
          className="hidden xl:inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition px-2 py-1 rounded-md hover:bg-slate-100"
          title="Open landing page in new tab"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* Notifications Icon with Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E8A808] ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-semibold text-slate-900">
                <span>Notifications</span>
                <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  2 New
                </span>
              </div>
              <div className="py-2 space-y-2">
                <div className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                  <p className="font-semibold text-slate-800">
                    New Viewing Booked
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    David Harrison requested viewing for 16 Gorse Drive.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                  <p className="font-semibold text-slate-800">Pack Generated</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    42 Brookburn Road valuation report is ready to download.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full text-center py-1.5 text-[11px] text-[#06143E] font-semibold hover:underline border-t border-slate-100 cursor-pointer"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-[#06143E] text-[#E8A808] font-heading font-semibold text-xs flex items-center justify-center shadow-xs shrink-0">
            IS
          </div>
          <div className="hidden md:block text-left min-w-0">
            <p className="text-xs font-semibold text-slate-900 leading-tight truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
              {displayAgency}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title={role === "admin" ? "Lock Admin Console" : "Log out"}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer shrink-0 ml-0.5"
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
