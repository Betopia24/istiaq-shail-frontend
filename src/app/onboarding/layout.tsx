import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";
import { CopyrightYear } from "@/components/ui/CopyrightYear";

export const metadata = {
  title: "Agency Onboarding | Property Pack AI",
  description: "Select your subscription tier and activate your institutional workstation.",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#E2E8F0] via-[#D7E0EB] to-[#CBD5E1] text-slate-900 flex flex-col relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-white/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#092167]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-slate-300/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-heading font-semibold text-xl text-[#06143E] hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-[#06143E] flex items-center justify-center text-[#E8A808] shadow-sm">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <span>
              Property Pack <span className="text-[#E8A808]">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600">
            <div className="hidden sm:flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">SSL Encrypted Checkout</span>
            </div>
            <Link
              href="/login"
              className="font-medium text-slate-700 hover:text-[#092167] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>

      {/* Clean Footer */}
      <footer className="relative z-10 w-full border-t border-slate-300/50 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© <CopyrightYear /> Property Pack AI. Built for UK Estate Agents.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
