"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/feature/user/userSlice";
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  BarChart3,
  FileText,
  Share2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
} from "lucide-react";

const agentNavItems = [
  { title: "Workstation Overview", href: "/agent-dashboard", icon: LayoutDashboard },
  { title: "My Property Packs", href: "/agent-dashboard/packs", icon: FolderOpen },
  { title: "Generate New Pack", href: "/agent-dashboard/generator", icon: Sparkles, highlight: true },
  { title: "Valuation & ROI Insights", href: "/agent-dashboard/valuations", icon: BarChart3 },
  { title: "Brochures & Print Export", href: "/agent-dashboard/brochures", icon: FileText },
  { title: "Social Teasers & Copy", href: "/agent-dashboard/social", icon: Share2 },
  { title: "Agency Settings", href: "/agent-dashboard/settings", icon: Settings },
];

export function AgentSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <aside
      className={`h-screen bg-[#06143E] text-white flex flex-col justify-between transition-all duration-300 relative border-r border-slate-800/80 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header / Logo */}
      <div>
        <div className="h-18 flex items-center justify-between px-5 border-b border-slate-800">
          {!collapsed ? (
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/auth-logo.svg"
                alt="Property Pack AI"
                width={160}
                height={40}
                className="w-[145px] h-auto object-contain brightness-0 invert"
              />
            </Link>
          ) : (
            <div className="mx-auto w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#E8A808] font-bold">
              P
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Workstation Tag */}
        {!collapsed && (
          <div className="px-5 py-2.5 bg-[#040E2C] text-xs font-semibold text-[#E8A808] flex items-center gap-2 border-b border-slate-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AGENT WORKSTATION v2.4</span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {agentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#092167] text-white shadow-sm font-semibold border border-blue-500/20"
                    : item.highlight
                    ? "bg-[#E8A808]/10 text-[#E8A808] hover:bg-[#E8A808]/20 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.title : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${item.highlight ? "text-[#E8A808]" : isActive ? "text-[#E8A808]" : ""}`} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Logout */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer ${
            collapsed ? "justify-center" : ""
          }`}
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
