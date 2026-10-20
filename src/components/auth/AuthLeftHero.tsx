"use client";

import React from "react";
import Image from "next/image";

export function AuthLeftHero() {
  return (
    <div className="flex flex-col items-center lg:items-start justify-center w-full max-w-[540px] px-4 sm:px-6 lg:px-0">
      {/* Brand Logo */}
      <div className="mb-6 sm:mb-8 lg:mb-10 transition-transform duration-300 hover:scale-[1.02]">
        <Image
          src="/auth-logo.svg"
          alt="Property Pack AI Logo"
          width={220}
          height={108}
          priority
          className="w-[190px] sm:w-[215px] h-auto object-contain select-none"
        />
      </div>

      {/* Visual Architectural Preview & Floating Pack Card */}
      <div className="relative w-full max-w-[480px] sm:max-w-[513px] aspect-[513/678] filter drop-shadow-2xl transition-all duration-500 hover:drop-shadow-[0_25px_35px_rgba(11,23,54,0.18)]">
        <Image
          src="/auth-left-image.svg"
          alt="Property Marketing Pack Visual Preview"
          fill
          priority
          className="object-contain select-none"
        />
      </div>
    </div>
  );
}
