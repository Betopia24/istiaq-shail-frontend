"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/feature/user/userSlice";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const hasToken = useSelector((state: RootState) => !!state.user.accessToken);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-50 w-full py-1 bg-[#0A132C]/90 backdrop-blur-md text-white transition-all">
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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-sans font-medium text-white/85">
          <Link href="#how-it-works" className="hover:text-[#E8A808] transition-colors">
            How It Works
          </Link>
          <Link href="#marketing-outputs" className="hover:text-[#E8A808] transition-colors">
            10 Marketing Outputs
          </Link>
          <Link href="#pricing" className="hover:text-[#E8A808] transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="hover:text-[#E8A808] transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Auth / CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">

          {hasToken ? (
            <div className="flex items-center gap-3">
              <Link
                href={user?.role?.toUpperCase() === "ADMIN" ? "/admin-dashboard" : "/agent-dashboard"}
                className="h-10 px-4 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] text-sm font-semibold flex items-center gap-2 shadow-sm transition"
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
              {/* Log In (Figma outline button) */}
              <Link
                href="/login"
                className="h-9 px-4 rounded-lg border border-[#E8A808] text-[#E8A808] hover:bg-[#E8A808]/10 text-sm font-sans font-semibold flex items-center justify-center transition cursor-pointer"
              >
                Log In
              </Link>

              {/* Get Started (Figma solid gold button) */}
              <Link
                href="/sign-up"
                className="h-9 px-5 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] text-sm font-sans font-bold flex items-center justify-center shadow-[0_2px_10px_rgba(232,168,8,0.35)] hover:shadow-[0_4px_16px_rgba(232,168,8,0.45)] active:scale-[0.98] transition cursor-pointer"
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
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0A132C] px-4 pt-2 pb-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 font-sans font-medium text-white/90">
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-[#E8A808] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#marketing-outputs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-[#E8A808] font-semibold"
            >
              10 Marketing Outputs
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-[#E8A808] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-[#E8A808] transition-colors"
            >
              FAQ
            </Link>
          </nav>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {hasToken ? (
              <>
                <Link
                  href={user?.role?.toUpperCase() === "ADMIN" ? "/admin-dashboard" : "/agent-dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 rounded-lg bg-[#E8A808] text-[#06143E] text-center flex items-center justify-center font-bold"
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
                  className="w-full h-11 rounded-lg border border-[#E8A808] text-[#E8A808] flex items-center justify-center font-semibold"
                >
                  Log In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] flex items-center justify-center font-bold shadow-md"
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
