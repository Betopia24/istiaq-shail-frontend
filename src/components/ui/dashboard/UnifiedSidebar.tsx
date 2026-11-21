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
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  ShieldAlert,
  LifeBuoy,
} from "lucide-react";
import Cookies from "js-cookie";

export interface NavItemConfig {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  matchExact?: boolean;
}

export const agentNavItems: NavItemConfig[] = [
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
  {
    title: "Help & Guides",
    href: "/agent-dashboard/help",
    icon: LifeBuoy,
  },
];

export const adminNavItems: NavItemConfig[] = [
  {
    title: "Platform Overview",
    href: "/admin-dashboard",
    icon: LayoutGrid,
    matchExact: true,
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

export interface UnifiedSidebarProps {
  role?: "admin" | "agent";
  onClose?: () => void;
  isMobile?: boolean;
}

export function UnifiedSidebar({
  role,
  onClose,
  isMobile = false,
}: UnifiedSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user?.user);

  // Auto-detect role if not explicitly provided
  const resolvedRole =
    role ||
    (pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/admin") ||
    user?.role?.toUpperCase() === "ADMIN"
      ? "admin"
      : "agent");

  const isAdmin = resolvedRole === "admin";
  const navItems = isAdmin ? adminNavItems : agentNavItems;
  const isCollapsed = !isMobile && collapsed;

  const handleLogout = () => {
    if (isAdmin) {
      Cookies.remove("adminAuthorized", { path: "/" });
      window.location.reload();
    } else {
      dispatch(logout());
      window.location.href = "/login";
    }
  };

  const displayName =
    user?.name || (isAdmin ? "Super Admin" : "Ishtiaq Sohail");
  const displayAgency = isAdmin
    ? "Master Platform Access"
    : "Prestige Estates UK";
  const initials =
    displayName && displayName.trim().length > 0
      ? displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : isAdmin
        ? "SA"
        : "IS";

  const rootHref = isAdmin ? "/admin-dashboard" : "/agent-dashboard";

  return (
    <aside
      className={`h-screen ${
        isAdmin
          ? "bg-[#080F24] border-[#101D3D]"
          : "bg-[#06143E] border-[#0D1D45]"
      } text-white flex flex-col justify-between transition-all duration-300 relative border-r select-none shrink-0 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header & Brand */}
      <div>
        {isCollapsed ? (
          /* Collapsed Header: Centered stacked logo & expand toggle */
          <div
            className={`py-4 px-2 flex flex-col items-center gap-2.5 border-b ${
              isAdmin ? "border-[#14254D]/40" : "border-[#0D1D45]/70"
            }`}
          >
            <Link
              href={rootHref}
              className={`w-10 h-10 rounded-xl ${
                isAdmin
                  ? "bg-[#14254D] border-[#E8A808]/40 text-[#E8A808]"
                  : "bg-[#0E204E] border-[#E8A808]/30 text-[#E8A808]"
              } border flex items-center justify-center font-heading font-bold text-base shadow-xs transition-transform duration-200 hover:scale-105 active:scale-95`}
              title={
                isAdmin
                  ? "Property Pack AI - Super Admin"
                  : "Property Pack AI - Agent Workstation"
              }
            >
              {isAdmin ? "SA" : "P"}
            </Link>
            <button
              onClick={() => setCollapsed(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Expanded Header: Full Logo, Badge, and Collapse Toggle */
          <div
            className={`h-16 px-5 flex items-center justify-between border-b ${
              isAdmin ? "border-[#14254D]/40" : "border-[#0D1D45]/70"
            }`}
          >
            <Link href={rootHref} className="flex items-center p-1 min-w-0">
              <Image
                src="/logo-light.svg"
                alt="Property Pack AI"
                width={140}
                height={120}
                priority
                className="h-14 w-auto object-contain shrink-0"
              />
            </Link>

            {isMobile ? (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Navigation Items List */}
        <nav className="p-3 space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.matchExact
              ? pathname === item.href
              : pathname === item.href ||
                (pathname.startsWith(item.href) &&
                  pathname.charAt(item.href.length) === "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 group relative border ${
                  isActive
                    ? isAdmin
                      ? "bg-[#14254D] text-white border-[#E8A808]/40 shadow-xs"
                      : "bg-[#0E204E] text-white border-[#E8A808]/30 shadow-xs"
                    : "text-slate-300 border-transparent hover:bg-white/5 hover:text-white"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
                title={isCollapsed ? item.title : undefined}
              >
                {/* Active Indicator Bar on Left */}
                {isActive && (
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full shadow-[0_0_8px_rgba(232,168,8,0.8)] ${
                      isAdmin ? "bg-[#E8A808]" : "bg-[#E8A808]"
                    }`}
                  />
                )}

                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors duration-200 ${
                    isActive
                      ? "text-[#E8A808]"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                />

                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">{item.title}</span>
                    {typeof item.badge === "number" && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? "bg-[#E8A808] text-[#06143E]"
                            : "bg-[#162758] text-slate-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Summary Card */}
      <div
        className={`p-3 border-t ${
          isAdmin ? "border-[#14254D]/40" : "border-[#0D1D45]/70"
        }`}
      >
        {isCollapsed ? (
          /* Collapsed Profile Avatar */
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-xl ${
                isAdmin
                  ? "bg-[#14254D] border-[#E8A808]/30 text-[#E8A808]"
                  : "bg-[#0E204E] border-white/10 text-[#E8A808]"
              } border flex items-center justify-center font-heading font-semibold text-xs shadow-xs`}
              title={`${displayName} (${displayAgency})`}
            >
              {initials}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors duration-200 cursor-pointer"
              title={isAdmin ? "Lock Admin Console" : "Log out"}
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Expanded Profile Card */
          <div
            className={`p-2.5 rounded-xl ${
              isAdmin
                ? "bg-[#101D3D]/60 border-[#14254D]"
                : "bg-[#0B1A4D]/60 border-white/5"
            } border flex items-center justify-between gap-2.5 min-w-0`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl ${
                  isAdmin
                    ? "bg-[#14254D] border-[#E8A808]/30 text-[#E8A808]"
                    : "bg-[#0E204E] border-[#E8A808]/20 text-[#E8A808]"
                } border flex items-center justify-center font-heading font-semibold text-xs shadow-xs shrink-0`}
              >
                {initials}
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="text-xs font-semibold text-white leading-tight truncate">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                  {displayAgency}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title={isAdmin ? "Lock Admin Console" : "Log out"}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors duration-200 cursor-pointer shrink-0"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

// Aliases for seamless backward compatibility
export const AgentSidebar = (props: {
  onClose?: () => void;
  isMobile?: boolean;
}) => <UnifiedSidebar role="agent" {...props} />;

export const AdminSidebar = (props: {
  onClose?: () => void;
  isMobile?: boolean;
}) => <UnifiedSidebar role="admin" {...props} />;
