"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useLogout } from "@/components/auth/SessionBootstrap";
import { isSuperAdmin } from "@/types/auth";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Sparkles,
  Settings,
  Shield,
  FolderOpen,
} from "lucide-react";
import { scrollToSection } from "@/lib/scrollToSection";

interface NavLinkItem {
  id: string;
  label: string;
}

const navLinks: NavLinkItem[] = [
  { id: "how-it-works", label: "How It Works" },
  { id: "marketing-outputs", label: "10 Marketing Outputs" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const hasToken = useSelector((state: RootState) => !!state.user.user);
  const signOut = useLogout();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    void signOut();
  };

  // Close profile dropdown on outside click or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileDropdownOpen]);

  // Scroll spy to dynamically track active section on homepage
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // Offset for sticky navbar
      const sectionElements = navLinks
        .map((link) => {
          const el = document.getElementById(link.id);
          return el
            ? { id: link.id, top: el.offsetTop, height: el.offsetHeight }
            : null;
        })
        .filter(Boolean) as { id: string; top: number; height: number }[];

      let current = "";
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const sec = sectionElements[i];
        if (scrollPosition >= sec.top - 80) {
          current = sec.id;
          break;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    scrollToSection(sectionId, pathname, router);
    setMobileMenuOpen(false);
  };

  const isAdmin = isSuperAdmin(user);
  const dashboardHref = isAdmin ? "/admin-dashboard" : "/agent-dashboard";
  const displayName = user?.name || (isAdmin ? "Super Admin" : "Ishtiaq Sohail");
  const displayEmail = user?.email || (isAdmin ? "admin@propertypack.ai" : "ishtiaq@prestigeestates.co.uk");
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

  return (
    <header className="sticky top-0 z-50 w-full py-1 bg-[#0A132C]/90 backdrop-blur-md text-white transition-all border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-light.svg"
            alt="Property Pack AI Logo"
            width={160}
            height={50}
            priority
            className="w-[145px] sm:w-[160px] h-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links with Dynamic Active Indicator */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-sans font-medium">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;

            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative py-1 text-sm font-sans font-medium transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "text-[#FFC024]"
                    : "text-white/85 hover:text-[#E8A808]"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8A808] rounded-full shadow-[0_0_8px_rgba(232,168,8,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Auth / CTA / User Dropdown Buttons */}
        <div className="hidden md:flex items-center gap-3 sm:gap-4">
          {hasToken ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Dropdown Trigger */}
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-[#E8A808]/40 hover:bg-white/5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E8A808]/50"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E8A808] text-[#06143E] font-heading font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                  {initials}
                </div>
                <div className="text-left max-w-[130px] lg:max-w-[160px] min-w-0">
                  <p className="text-xs font-semibold text-white leading-tight truncate">
                    {displayName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                    {isAdmin ? "Super Admin" : "Agent Portal"}
                  </p>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                    profileDropdownOpen ? "rotate-180 text-white" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#0B1736] text-white rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Profile Header */}
                  <div className="px-4 py-3 border-b border-white/10 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8A808] text-[#06143E] font-heading font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-white truncate">
                          {displayName}
                        </p>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-300 truncate leading-tight mt-0.5">
                        {displayEmail}
                      </p>
                      <span
                        className={`inline-block mt-1 text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                          isAdmin
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-[#E8A808]/20 text-[#E8A808] border border-[#E8A808]/30"
                        }`}
                      >
                        {isAdmin ? "Super Admin" : "Agency Agent"}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-1 px-1">
                    <Link
                      href={dashboardHref}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#E8A808]" />
                      <span>Open Workstation</span>
                    </Link>

                    {!isAdmin ? (
                      <>
                        <Link
                          href="/agent-dashboard/saved-packs"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span>Saved Property Packs</span>
                        </Link>
                        <Link
                          href="/agent-dashboard/settings"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-400" />
                          <span>Settings & Billing</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/admin-dashboard/agencies"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-slate-400" />
                          <span>Agency Management</span>
                        </Link>
                        <Link
                          href="/admin-dashboard/settings"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-400" />
                          <span>Security & Access</span>
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/10 my-1" />

                  {/* Sign Out Button in Dropdown */}
                  <div className="px-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Log In */}
              <Link
                href="/login"
                className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-lg border border-[#E8A808] text-[#E8A808] hover:bg-[#E8A808]/10 text-xs sm:text-sm font-sans font-medium flex items-center justify-center transition cursor-pointer"
              >
                Log In
              </Link>

              {/* Get Started */}
              <Link
                href="/sign-up"
                className="h-9 sm:h-10 px-4 sm:px-5 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] text-xs sm:text-sm font-sans font-semibold flex items-center justify-center shadow-[0_2px_10px_rgba(232,168,8,0.35)] hover:shadow-[0_4px_16px_rgba(232,168,8,0.45)] active:scale-[0.98] transition cursor-pointer"
              >
                <span>Get Started</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0A132C] px-4 pt-2 pb-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-2 font-sans font-medium text-white/90">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between text-left cursor-pointer ${
                    isActive
                      ? "bg-white/10 text-[#FFC024] font-medium"
                      : "hover:bg-white/5 hover:text-[#E8A808]"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8A808]" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {hasToken ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-[#E8A808] text-[#06143E] font-heading font-bold text-xs flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-[10px] text-slate-300 truncate">
                      {isAdmin ? "Super Admin" : "Agent Portal"}
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-10 rounded-lg bg-[#E8A808] text-[#06143E] text-center flex items-center justify-center font-semibold text-xs sm:text-sm"
                >
                  Open Workstation
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full h-10 rounded-lg border border-white/20 text-white flex items-center justify-center gap-2 font-medium text-xs sm:text-sm hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-10 rounded-lg border border-[#E8A808] text-[#E8A808] flex items-center justify-center font-medium text-xs sm:text-sm"
                >
                  Log In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-10 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] flex items-center justify-center font-semibold text-xs sm:text-sm shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
