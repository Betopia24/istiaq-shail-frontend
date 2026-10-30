"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/feature/user/userSlice";
import { ChevronRight, LogOut, Menu, Sparkles } from "lucide-react";
import Cookies from "js-cookie";

interface DashboardHeaderProps {
  role?: "admin" | "agent";
  onToggleMobileMenu?: () => void;
}

const breadcrumbTitles: Record<string, { portal: string; page: string }> = {
  "/agent-dashboard": { portal: "Agent Portal", page: "Overview" },
  "/agent-dashboard/create": { portal: "Agent Portal", page: "Create Pack" },
  "/agent-dashboard/saved-packs": { portal: "Agent Portal", page: "Saved Packs" },
  "/agent-dashboard/leads": { portal: "Agent Portal", page: "Buyer Leads & Viewing" },
  "/agent-dashboard/branding": { portal: "Agent Portal", page: "Agency Branding" },
  "/agent-dashboard/editor": { portal: "Agent Portal", page: "Live Pack Editor" },
  "/agent-dashboard/settings": { portal: "Agent Portal", page: "Settings & Team" },
  "/admin-dashboard": { portal: "Super Admin", page: "Platform Overview" },
  "/admin-dashboard/agencies": { portal: "Super Admin", page: "Agency Teams" },
  "/admin-dashboard/subscriptions": { portal: "Super Admin", page: "Subscriptions & Logs" },
  "/admin-dashboard/settings": { portal: "Super Admin", page: "Security & Access" },
  "/dashboard": { portal: "Super Admin", page: "Platform Overview" },
};

export function DashboardHeader({
  role = "agent",
  onToggleMobileMenu,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user?.user);
  const dispatch = useDispatch();

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
  const initials =
    displayName && displayName.trim().length > 0
      ? displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "IS";

  // Dynamic route resolution
  let currentCrumb = {
    portal: role === "admin" ? "Super Admin" : "Agent Portal",
    page: "Overview",
  };

  if (breadcrumbTitles[pathname]) {
    currentCrumb = breadcrumbTitles[pathname];
  } else {
    for (const [route, crumb] of Object.entries(breadcrumbTitles)) {
      if (pathname.startsWith(route)) {
        currentCrumb = crumb;
        break;
      }
    }
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/90 shadow-2xs shrink-0 select-none">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-full flex items-center justify-between">
        {/* Left: Mobile Toggle & Breadcrumbs */}
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

          {/* Portal Badge & Page Name */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-[#06143E] text-[#E8A808] border border-[#162758]">
              {currentCrumb.portal}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline shrink-0" />
            <span className="text-slate-900 font-semibold text-sm sm:text-base tracking-tight truncate">
              {currentCrumb.page}
            </span>
          </div>
        </div>

        {/* Right: Quick Action & Profile Card */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Create Pack Action for Agents */}
          {role === "agent" && (
            <Link
              href="/agent-dashboard/create"
              className="hidden md:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#D49800] text-[#06143E] text-xs font-semibold shadow-xs transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Pack</span>
            </Link>
          )}

          {/* User Profile Card */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-[#06143E] text-[#E8A808] font-heading font-semibold text-xs flex items-center justify-center shadow-xs shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-xs font-semibold text-slate-900 leading-tight truncate">
                {displayName}
              </p>
              <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                {displayAgency}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title={role === "admin" ? "Lock Admin Console" : "Log out"}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0 ml-0.5"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
