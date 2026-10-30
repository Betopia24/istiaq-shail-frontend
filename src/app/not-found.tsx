"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#06143E] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#FFB800]/30 selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#092167]/80 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-[#FFB800]/12 rounded-full blur-[100px] pointer-events-none" />

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
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-center sm:justify-start">
        <Link href="/" className="inline-flex items-center group">
          <Image
            src="/logo.svg"
            alt="Property Pack AI Logo"
            width={160}
            height={46}
            priority
            className="w-[140px] sm:w-[155px] h-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>
      </header>

      {/* Main Hero Center Content */}
      <main className="relative z-10 max-w-xl mx-auto px-6 py-12 text-center flex flex-col items-center justify-center my-auto">
        {/* Stylized 404 Display */}
        <div className="relative select-none mb-2">
          <h1 className="font-heading font-medium text-8xl sm:text-9xl md:text-[120px] leading-none tracking-tight bg-gradient-to-b from-white via-slate-100 to-white/40 bg-clip-text text-transparent drop-shadow-xl">
            404
          </h1>
          <div className="absolute -top-2 -right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#FFB800] text-[#06143E] font-medium text-base sm:text-lg flex items-center justify-center shadow-md rotate-12">
            ?
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="font-heading font-medium text-2xl sm:text-3xl text-white tracking-tight mt-3">
          Page Not Found
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto mt-2.5 leading-relaxed">
          The page you are looking for doesn&apos;t exist, has been removed, or
          was moved to another location.
        </p>

        {/* Go Back to Previous Location Button */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleGoBack}
            className="h-10 px-6 rounded-lg bg-[#FFB800] hover:bg-[#E8A808] active:bg-[#D49800] text-[#06143E] font-heading font-medium text-sm shadow-[0_2px_12px_rgba(255,184,0,0.3)] transition inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Go Back</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-400 border-t border-white/5">
        <p>© 2026 Property Pack AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
