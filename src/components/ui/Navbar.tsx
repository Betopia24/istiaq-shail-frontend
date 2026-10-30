"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/feature/user/userSlice";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";

interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  isSpecial?: boolean;
}

const navLinks: NavLinkItem[] = [
  { id: "how-it-works", label: "How It Works", href: "/#how-it-works" },
  {
    id: "marketing-outputs",
    label: "10 Marketing Outputs",
    href: "/#marketing-outputs",
  },
  { id: "pricing", label: "Pricing", href: "/#pricing" },
  { id: "faq", label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user.user);
  const hasToken = useSelector((state: RootState) => !!state.user.accessToken);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

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

    // Listen for hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) setActiveSection(hash);
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

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

            if (link.isSpecial) {
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setActiveSection(link.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#E8A808] text-[#06143E] shadow-[0_2px_12px_rgba(232,168,8,0.35)] ring-2 ring-[#FFB800]/50"
                      : "bg-[#E8A808]/15 text-[#FFC024] hover:bg-[#E8A808]/25 hover:text-white border border-[#E8A808]/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? "bg-[#06143E]" : "bg-[#E8A808] animate-pulse"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setActiveSection(link.id)}
                className={`relative py-1 transition-colors duration-200 text-sm ${
                  isActive
                    ? "text-[#FFC024] font-medium"
                    : "text-white/85 hover:text-[#E8A808]"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8A808] rounded-full shadow-[0_0_8px_rgba(232,168,8,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth / CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {hasToken ? (
            <div className="flex items-center gap-3">
              <Link
                href={
                  user?.role?.toUpperCase() === "ADMIN"
                    ? "/admin-dashboard"
                    : "/agent-dashboard"
                }
                className="h-10 px-4 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] text-sm font-medium flex items-center gap-2 shadow-sm transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Workstation</span>
              </Link>
              <button
                onClick={handleLogout}
                className="h-10 px-3 rounded-lg border border-white/20 hover:bg-white/10 text-white text-sm font-medium flex items-center gap-1.5 transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Log In */}
              <Link
                href="/login"
                className="h-9 px-4 rounded-lg border border-[#E8A808] text-[#E8A808] hover:bg-[#E8A808]/10 text-sm font-sans font-medium flex items-center justify-center transition cursor-pointer"
              >
                Log In
              </Link>

              {/* Get Started */}
              <Link
                href="/sign-up"
                className="h-9 px-5 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] text-sm font-sans font-medium flex items-center justify-center shadow-[0_2px_10px_rgba(232,168,8,0.35)] hover:shadow-[0_4px_16px_rgba(232,168,8,0.45)] active:scale-[0.98] transition cursor-pointer"
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

              if (link.isSpecial) {
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => {
                      setActiveSection(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
                      isActive
                        ? "bg-[#E8A808] text-[#06143E]"
                        : "bg-[#E8A808]/15 text-[#FFC024]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? "bg-[#06143E]" : "bg-[#E8A808]"
                      }`}
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => {
                    setActiveSection(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                    isActive
                      ? "bg-white/10 text-[#FFC024] font-medium"
                      : "hover:bg-white/5 hover:text-[#E8A808]"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8A808]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {hasToken ? (
              <>
                <Link
                  href={
                    user?.role?.toUpperCase() === "ADMIN"
                      ? "/admin-dashboard"
                      : "/agent-dashboard"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 rounded-lg bg-[#E8A808] text-[#06143E] text-center flex items-center justify-center font-medium"
                >
                  Go to Workstation
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full h-11 rounded-lg border border-white/20 text-white flex items-center justify-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 rounded-lg border border-[#E8A808] text-[#E8A808] flex items-center justify-center font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] flex items-center justify-center font-medium shadow-md"
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
