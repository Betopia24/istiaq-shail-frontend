"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/feature/user/userSlice";
import { Bell, Search, LogOut, ShieldCheck, UserCheck } from "lucide-react";

interface DashboardHeaderProps {
  role?: "admin" | "agent";
}

export function DashboardHeader({ role = "agent" }: DashboardHeaderProps) {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  const displayName = user?.name || (role === "admin" ? "Admin Workstation" : "Eleanor Vance");
  const displayRole = user?.role || (role === "admin" ? "Super Administrator" : "Senior Property Agent");

  return (
    <header className="sticky top-0 z-30 h-18 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between">
      {/* Search Input */}
      <div className="relative w-72 sm:w-80">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search property packs, valuations..."
          className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#092167] focus:bg-white transition"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Role Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {role === "admin" ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#092167]" />
              <span>Admin Access</span>
            </>
          ) : (
            <>
              <UserCheck className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Agent License Active</span>
            </>
          )}
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D97706]" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#092167] to-[#1E3A8A] text-white font-heading font-semibold text-sm flex items-center justify-center shadow-sm">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              {displayName}
            </p>
            <p className="text-xs text-slate-500">{displayRole}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
