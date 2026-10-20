"use client";

import React from "react";
import { AuthLeftHero } from "./AuthLeftHero";
import { SignupCard } from "./SignupCard";

export function AuthLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#DFE6EF] via-[#D5DEEA] to-[#CBD5E2] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Subtle Ambient Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#092167]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1220px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-14 items-center justify-items-center">
        {/* Left Visual Hero */}
        <AuthLeftHero />

        {/* Right Form Card */}
        {children || <SignupCard />}
      </div>
    </div>
  );
}
