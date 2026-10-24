"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  LayoutDashboard,
  FolderOpen,
  Plus,
  Home,
  Search,
  Compass,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06143E] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#FFB800]/30 selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#092167]/80 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-[#FFB800]/12 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top Header / Brand Logo */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <Image
            src="/logo.svg"
            alt="Property Pack AI Logo"
            width={160}
            height={46}
            priority
            className="w-[140px] sm:w-[155px] h-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>

        <Link
          href="/"
          className="h-9 px-4 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white/90 text-xs font-semibold flex items-center gap-2 transition backdrop-blur-xs"
        >
          <Home className="w-3.5 h-3.5 text-[#FFB800]" />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </header>

      {/* Main Hero Center Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12 text-center flex flex-col items-center justify-center my-auto">
        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] text-xs font-semibold tracking-wide uppercase mb-6 shadow-xs animate-in fade-in duration-500">
          <Compass className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Error 404 • Page Not Found</span>
        </div>

        {/* Big Stylized 404 Text */}
        <div className="relative select-none my-2">
          <h1 className="font-heading font-extrabold text-7xl sm:text-9xl md:text-[130px] leading-none tracking-tight bg-gradient-to-b from-white via-slate-100 to-white/40 bg-clip-text text-transparent drop-shadow-2xl">
            404
          </h1>
          <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#FFB800] to-[#E8A808] text-[#06143E] font-extrabold text-lg sm:text-xl flex items-center justify-center shadow-lg rotate-12">
            ?
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mt-4">
          Lost in the Property Market?
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-3 leading-relaxed">
          The page, property pack, or listing collateral you are looking for has been moved, renamed, or does not exist on this workstation.
        </p>

        {/* Main Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          <Link
            href="/agent-dashboard"
            className="w-full sm:w-auto h-11 px-6 rounded-lg bg-[#FFB800] hover:bg-[#E8A808] active:bg-[#D49800] text-[#06143E] font-heading font-bold text-sm shadow-[0_2px_14px_rgba(255,184,0,0.35)] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 stroke-[2.5]" />
            <span>Go to Agent Dashboard</span>
          </Link>

          <Link
            href="/agent-dashboard/saved-packs"
            className="w-full sm:w-auto h-11 px-6 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 active:bg-white/15 text-white font-heading font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs"
          >
            <FolderOpen className="w-4 h-4 text-[#FFB800]" />
            <span>Browse Saved Packs</span>
          </Link>
        </div>

        {/* Quick Navigation Links */}
        <div className="mt-12 pt-8 border-t border-white/10 w-full max-w-lg">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick Navigation Shortcuts
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <Link
              href="/agent-dashboard/create"
              className="p-3 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition flex items-center gap-2 text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#FFB800]/15 text-[#FFB800] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                Create Pack
              </span>
            </Link>

            <Link
              href="/agent-dashboard/branding"
              className="p-3 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition flex items-center gap-2 text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Search className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                Branding
              </span>
            </Link>

            <Link
              href="/"
              className="p-3 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition flex items-center gap-2 text-left group col-span-2 sm:col-span-1"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Home className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                Homepage
              </span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-400 border-t border-white/5">
        <p>© 2026 Property Pack AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
