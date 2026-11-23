"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useLogout } from "@/components/auth/SessionBootstrap";
import {
  ChevronRight,
  ChevronDown,
  LogOut,
  Menu,
  User,
  Settings,
  Sparkles,
  Shield,
  ExternalLink,
  Bell,
  CheckCheck,
} from "lucide-react";

interface DashboardHeaderProps {
  role?: "admin" | "agent";
  onToggleMobileMenu?: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "pack" | "credit" | "lead" | "billing" | "team";
}

const defaultNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Property Pack Ready",
    description: "Brochure for 16 Gorse Drive, Chorlton is ready for export.",
    time: "10m ago",
    read: false,
    type: "pack",
  },
  {
    id: "notif-2",
    title: "New Buyer Viewing Lead",
    description: "James Davies requested a viewing for 16 Gorse Drive.",
    time: "45m ago",
    read: false,
    type: "lead",
  },
  {
    id: "notif-3",
    title: "Low Pack Credits Warning",
    description: "14 packs remaining on your Professional Tier monthly quota.",
    time: "3h ago",
    read: false,
    type: "credit",
  },
  {
    id: "notif-4",
    title: "Team Invite Accepted",
    description: "Sarah Jenkins joined Prestige Estates UK as a Valuer.",
    time: "1d ago",
    read: true,
    type: "team",
  },
  {
    id: "notif-5",
    title: "VAT Invoice Ready",
    description: "Invoice #INV-2026-11 (£79.00) is available for download.",
    time: "3d ago",
    read: true,
    type: "billing",
  },
];

const breadcrumbTitles: Record<string, { portal: string; page: string }> = {
  "/agent-dashboard": { portal: "Agent Portal", page: "Overview" },
  "/agent-dashboard/create": { portal: "Agent Portal", page: "Create Pack" },
  "/agent-dashboard/saved-packs": { portal: "Agent Portal", page: "Saved Packs" },
  "/agent-dashboard/leads": { portal: "Agent Portal", page: "Buyer Leads & Viewing" },
  "/agent-dashboard/branding": { portal: "Agent Portal", page: "Agency Branding" },
  "/agent-dashboard/editor": { portal: "Agent Portal", page: "Live Pack Editor" },
  "/agent-dashboard/settings": { portal: "Agent Portal", page: "Settings & Team" },
  "/agent-dashboard/help": { portal: "Agent Portal", page: "Help Centre & Support" },
  "/admin-dashboard": { portal: "Super Admin", page: "Platform Overview" },
  "/admin-dashboard/agencies": { portal: "Super Admin", page: "Agency Teams" },
  "/admin-dashboard/subscriptions": { portal: "Super Admin", page: "Subscriptions & Logs" },
  "/admin-dashboard/settings": { portal: "Super Admin", page: "Security & Access" },
  "/dashboard": { portal: "Unified Portal", page: "Overview" },
};

export function DashboardHeader({
  role = "agent",
  onToggleMobileMenu,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user?.user);
  const signOut = useLogout();

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(defaultNotifications);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    }

    if (profileOpen || notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen, notificationsOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    setProfileOpen(false);
    void signOut();
  };

  const displayName = user?.name || (role === "admin" ? "Super Admin" : "Ishtiaq Sohail");
  const displayEmail = user?.email || (role === "admin" ? "admin@propertypack.ai" : "ishtiaq@prestigeestates.co.uk");
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
      : role === "admin"
      ? "SA"
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
              className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
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

        {/* Right: Notifications & Interactive Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notification Bell Dropdown (S20) */}
          <div className="relative shrink-0" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E8A808] ring-2 ring-white" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-semibold text-sm text-slate-900">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#FEF3C7] text-[#8C6605]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-[11px] text-[#092167] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-[#E8A808]" />
                      <span>Mark all as read</span>
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((n) =>
                            n.id === item.id ? { ...n, read: true } : n,
                          ),
                        )
                      }
                      className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${
                        !item.read ? "bg-amber-50/20" : ""
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          !item.read ? "bg-[#E8A808]" : "bg-transparent"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                          {item.description}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Profile Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50/80 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E8A808]/40"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            {/* Avatar Pill */}
            <div className="w-8 h-8 rounded-lg bg-[#06143E] text-[#E8A808] font-heading font-semibold text-xs flex items-center justify-center shadow-xs shrink-0">
              {initials}
            </div>

            {/* Name & Agency Info */}
            <div className="hidden sm:block text-left min-w-0 max-w-[140px] md:max-w-[180px]">
              <p className="text-xs font-semibold text-slate-900 leading-tight truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                {displayAgency}
              </p>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                profileOpen ? "rotate-180 text-slate-700" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header: User Summary */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#06143E] text-[#E8A808] font-heading font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {displayName}
                    </p>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                    {displayEmail}
                  </p>
                  <span
                    className={`inline-block mt-1 text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                      role === "admin"
                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {role === "admin" ? "Super Admin" : "Agency Agent"}
                  </span>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="py-1 px-1">
                {role === "agent" ? (
                  <>
                    <Link
                      href="/agent-dashboard/create"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
                      <span>Create Property Pack</span>
                    </Link>
                    <Link
                      href="/agent-dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Settings & Billing</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/admin-dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5 text-[#E8A808]" />
                      <span>Platform Overview</span>
                    </Link>
                    <Link
                      href="/admin-dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Security & Access</span>
                    </Link>
                  </>
                )}

                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Public Landing Page</span>
                  </span>
                </Link>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100 my-1" />

              {/* Signout Button */}
              <div className="px-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>{role === "admin" ? "Lock Admin Console" : "Sign Out"}</span>
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}
