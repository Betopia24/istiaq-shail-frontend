"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  Share2,
  Sparkles,
  RotateCw,
  Copy,
  Check,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  FileText,
  Video,
} from "lucide-react";

type ActiveTab = "brochure" | "social" | "valuation" | "portal";
type SocialPlatform = "facebook" | "instagram" | "tiktok";

export default function PackEditorPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("brochure");
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>("instagram");
  const [portalPlatform, setPortalPlatform] = useState<"rightmove" | "zoopla">("rightmove");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pricingStrategy, setPricingStrategy] = useState<"realistic" | "premium" | "accelerated">("realistic");

  // Editable brochure copy state
  const [headline, setHeadline] = useState(
    "An Exceptional Four-Bedroom Executive Detached Home in Prime Chorlton"
  );
  const [narrative, setNarrative] = useState(
    "Nestled on the prestigious Gorse Drive, this beautifully extended four-bedroom detached family home offers an extraordinary balance of modern elegance and practical space across 2,150 sq ft.\n\nThe heart of this residence is a magnificent open-plan designer kitchen with underfloor heating, unfolding directly onto a private south-facing garden."
  );
  const [keyFeatures, setKeyFeatures] = useState(
    "• Four generous bedrooms with master en-suite\n• Bespoke German fitted kitchen with premium appliances\n• Private mature south-facing rear garden\n• Detached double garage & private paved driveway\n• Just 5 minutes walk from Chorlton Metrolink"
  );
  const [socialCaption, setSocialCaption] = useState(
    "🏡 NEW TO MARKET | 16 Gorse Drive, Manchester\nStunning 4-bed detached home with open-plan kitchen & sunny garden.\nGuide Price: £750,000 • DM to arrange a private viewing."
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#06143E] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* =========================================================================
          TOP HEADER
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Pack Results & Live Editor
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600">
              Generated Successfully (Claude 3.5)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Download PDF Button */}
          <button
            onClick={() => showToast("Downloading Property Brochure PDF...")}
            className="h-10 px-5 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          {/* Share Link Button */}
          <button
            onClick={() => copyToClipboard(window.location.href, "share-link")}
            className="h-10 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs transition flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <span>Share link</span>
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB NAVIGATION PILLS
      ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        <button
          onClick={() => setActiveTab("brochure")}
          className={`px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm transition-all cursor-pointer shrink-0 ${
            activeTab === "brochure"
              ? "bg-[#06143E] text-white font-semibold shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
          }`}
        >
          Property Brochure
        </button>

        <button
          onClick={() => setActiveTab("social")}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm transition-all cursor-pointer shrink-0 ${
            activeTab === "social"
              ? "bg-[#06143E] text-white font-semibold shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
          <span>Multi-Channel Social</span>
        </button>

        <button
          onClick={() => setActiveTab("valuation")}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm transition-all cursor-pointer shrink-0 ${
            activeTab === "valuation"
              ? "bg-[#06143E] text-white font-semibold shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
          }`}
        >
          <span className="text-xs">📊</span>
          <span>Property Valuation</span>
        </button>

        <button
          onClick={() => setActiveTab("portal")}
          className={`px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm transition-all cursor-pointer shrink-0 ${
            activeTab === "portal"
              ? "bg-[#06143E] text-white font-semibold shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
          }`}
        >
          Portal Specs (Rightmove)
        </button>
      </div>

      {/* =========================================================================
          TAB 1: PROPERTY BROCHURE
      ========================================================================= */}
      {activeTab === "brochure" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left Column: Editable Marketing Copy */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-5 shadow-2xs">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Editable Marketing Copy
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click and edit any section below. The brochure preview updates live.
              </p>
            </div>

            {/* Field: Headline */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                HEADLINE
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-semibold text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
              />
            </div>

            {/* Field: Listing Overview (Narrative) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  LISTING OVERVIEW (NARRATIVE)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setNarrative(
                      "Nestled on prestigious Gorse Drive, this newly extended 4-bed detached home features a bespoke German designer kitchen, underfloor heating, and south-facing private gardens. Within 5 mins of Chorlton Metrolink."
                    );
                    showToast("Narrative regenerated!");
                  }}
                  className="text-xs font-semibold text-[#092167] hover:underline cursor-pointer"
                >
                  Regenerate Section
                </button>
              </div>
              <textarea
                rows={5}
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition resize-y"
              />
            </div>

            {/* Field: Key Property Features */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                KEY PROPERTY FEATURES
              </label>
              <textarea
                rows={5}
                value={keyFeatures}
                onChange={(e) => setKeyFeatures(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition resize-y font-mono"
              />
            </div>

            {/* Field: Social Media Caption */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                SOCIAL MEDIA CAPTION (INSTAGRAM / LINKEDIN)
              </label>
              <textarea
                rows={3}
                value={socialCaption}
                onChange={(e) => setSocialCaption(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition resize-y"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => showToast("Changes saved successfully!")}
                className="h-11 px-6 rounded-xl bg-[#06143E] hover:bg-[#0A2168] text-white font-semibold text-xs sm:text-sm transition cursor-pointer shadow-sm"
              >
                Save Changes to Pack
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast("Regenerating all marketing copy with Claude 3.5...");
                }}
                className="h-11 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Full Regenerate</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Brochure Document Preview */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-5 shadow-sm">
            {/* Agency Brand Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#E8A808] flex items-center justify-center text-[#06143E] font-bold text-xs">
                  P
                </div>
                <div>
                  <p className="font-heading font-bold text-xs text-slate-900 tracking-wide uppercase">
                    PRESTIGE ESTATES
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                    UK PROPERTY SPECIALISTS
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-xs text-slate-900">
                  +44 161 839 2000
                </p>
                <p className="text-[10px] text-slate-400">
                  info@prestigeestates.co.uk
                </p>
              </div>
            </div>

            {/* Hero Photo with Price Tag */}
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <Image
                src="/landing/villa-dusk.jpg"
                alt="16 Gorse Drive"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-3.5 left-3.5 z-10">
                <span className="inline-block px-4 py-1.5 rounded-lg bg-[#06143E] text-[#E8A808] font-heading font-bold text-base shadow-lg">
                  £750,000
                </span>
              </div>
            </div>

            {/* Title & Location */}
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900">
                16 Gorse Drive, Manchester
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chorlton, Manchester, M21 8XQ
              </p>
            </div>

            {/* Specs Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                4 Bedrooms
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                2 Bathrooms
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                2,150 sq ft
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                Double Garage
              </span>
            </div>

            {/* Live Property Overview Paragraph */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Property Overview
              </p>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {narrative}
              </p>
            </div>

            {/* 3 Photos Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-100">
                <Image
                  src="/landing/villa-dusk.jpg"
                  alt="Gallery 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-100">
                <Image
                  src="/landing/townhouse-dusk.jpg"
                  alt="Gallery 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-100">
                <Image
                  src="/landing/semi-detached-wilmslow.jpg"
                  alt="Gallery 3"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="pt-2 border-t border-slate-100 text-[9px] text-slate-400 leading-tight">
              <p className="font-semibold uppercase tracking-wider mb-0.5">
                IMPORTANT NOTICE & DISCLAIMER (CPR 2008 COMPLIANCE)
              </p>
              <p>
                These particulars do not constitute part or all of an offer or contract. Measurements and photos are for guidance only. Prestige Estates UK has not tested any apparatus, fixtures or fittings.
              </p>
            </div>

            {/* Page pill */}
            <div className="bg-slate-50 py-2 rounded-lg text-center text-xs font-medium text-slate-400">
              Page 1 of 2 • Client Print-Ready Preview
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: MULTI-CHANNEL SOCIAL
      ========================================================================= */}
      {activeTab === "social" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left Column: Platform Copies */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-5 shadow-2xs">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Platform-Optimized Social Copies
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Custom-tailored hooks, formats, and structures prepared for high engagement.
              </p>
            </div>

            {/* Sub-platform Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSocialPlatform("facebook")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  socialPlatform === "facebook"
                    ? "bg-[#06143E] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Facebook Post
              </button>

              <button
                onClick={() => setSocialPlatform("instagram")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  socialPlatform === "instagram"
                    ? "bg-[#06143E] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Instagram Caption
              </button>

              <button
                onClick={() => setSocialPlatform("tiktok")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  socialPlatform === "tiktok"
                    ? "bg-[#06143E] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                TikTok / Reels Script
              </button>
            </div>

            {/* Social Copy Card (Yellow highlight matching Figma) */}
            <div className="bg-[#FEFCE8] border border-[#FEF08A] rounded-2xl p-6 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#854D0E] uppercase tracking-wider flex items-center gap-1.5">
                  <span>📸</span>
                  <span>
                    {socialPlatform === "facebook"
                      ? "FACEBOOK FEED POST (Story & Value Angle)"
                      : socialPlatform === "instagram"
                      ? "INSTAGRAM CAPTION (Hook + Carousel Structure)"
                      : "TIKTOK / REELS SCRIPT (15s Video Hook)"}
                  </span>
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      "Stop scrolling: your dream Chorlton home just arrived! 🌿\n\nNestled on prestigious Gorse Drive, this stunning 4-bed detached home features a bespoke German kitchen, underfloor heating, and south-facing private garden.\n\nGuide price £750,000. Swipe left for floor plan & garden view.\n\n#ManchesterProperty #ChorltonLiving #DreamHome #PropertyForSale #PrestigeEstates",
                      "social-copy"
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "social-copy" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                <p className="font-bold text-slate-900">
                  Stop scrolling: your dream Chorlton home just arrived! 🌿
                </p>
                <p>
                  Nestled on prestigious Gorse Drive, this stunning 4-bed detached home features a bespoke German designer kitchen with underfloor heating, seamless open-plan living, and a private south-facing garden.
                </p>
                <p>
                  Guide price £750,000. Swipe left for floor plan & garden tour. Drop a DM to schedule your priority viewing this weekend!
                </p>
                <p className="text-xs text-blue-600 pt-2 font-medium">
                  #ManchesterProperty #ChorltonLiving #DreamHome #PropertyForSale #PrestigeEstates #LuxuryLiving #M21 #ExecutiveHomes
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => showToast("Regenerating copy with new viral hook...")}
                className="h-10 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Regenerate Social Hook</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Brochure Preview */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#E8A808] flex items-center justify-center text-[#06143E] font-bold text-xs">
                  P
                </div>
                <div>
                  <p className="font-heading font-bold text-xs text-slate-900 tracking-wide uppercase">
                    PRESTIGE ESTATES
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                    UK PROPERTY SPECIALISTS
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-xs text-slate-900">
                  +44 161 839 2000
                </p>
                <p className="text-[10px] text-slate-400">
                  info@prestigeestates.co.uk
                </p>
              </div>
            </div>

            <div className="relative aspect-16/10 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <Image
                src="/landing/villa-dusk.jpg"
                alt="16 Gorse Drive"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-3.5 left-3.5 z-10">
                <span className="inline-block px-4 py-1.5 rounded-lg bg-[#06143E] text-[#E8A808] font-heading font-bold text-base shadow-lg">
                  £750,000
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900">
                16 Gorse Drive, Manchester
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chorlton, Manchester, M21 8XQ
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                4 Bedrooms
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                2 Bathrooms
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                2,150 sq ft
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                Double Garage
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-100">
                <Image
                  src="/landing/villa-dusk.jpg"
                  alt="Gallery 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-100">
                <Image
                  src="/landing/townhouse-dusk.jpg"
                  alt="Gallery 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-100">
                <Image
                  src="/landing/semi-detached-wilmslow.jpg"
                  alt="Gallery 3"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="bg-slate-50 py-2 rounded-lg text-center text-xs font-medium text-slate-400">
              Page 1 of 2 • Client Print-Ready Preview
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PROPERTY VALUATION
      ========================================================================= */}
      {activeTab === "valuation" && (
        <div className="space-y-6">
          {/* Top Banner: Valuation Metrics Header */}
          <div className="bg-[#07153B] rounded-2xl p-6 sm:p-7 text-white shadow-md border border-[#162758]/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E8A808]/20 text-[#E8A808] uppercase tracking-wider mb-1">
                AI VALUATION RANGE
              </span>
              <p className="font-heading font-bold text-xl sm:text-2xl text-white">
                £720,000 – £780,000
              </p>
              <p className="text-[11px] text-slate-300 mt-1">
                Estimated Market Value Range based on 12 recent local transactions
              </p>
            </div>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-200 uppercase tracking-wider mb-1">
                RECOMMENDED GUIDE PRICE
              </span>
              <p className="font-heading font-bold text-xl sm:text-2xl text-[#E8A808]">
                £749,000
              </p>
              <p className="text-[11px] text-slate-300 mt-1">
                Aligned for optimal Rightmove portal price search banding
              </p>
            </div>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase tracking-wider mb-1">
                CONFIDENCE SCORE
              </span>
              <p className="font-heading font-bold text-xl sm:text-2xl text-emerald-400">
                94% High
              </p>
              <p className="text-[11px] text-slate-300 mt-1">
                Verified with 7 RICS local comparable sales
              </p>
            </div>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-200 uppercase tracking-wider mb-1">
                AVG TIME TO SALE (M21)
              </span>
              <p className="font-heading font-bold text-xl sm:text-2xl text-white">
                24 Days
              </p>
              <p className="text-[11px] text-emerald-400 mt-1">
                ▲ 12% faster than regional avg
              </p>
            </div>
          </div>

          {/* Two Columns: Comps Table & Vendor Pricing Strategies */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* Left: Recent Comparable Sales (Comps Analysis) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-5 shadow-2xs">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Recent Comparable Sales (Comps Analysis)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified local property sales and market estimates within 0.5 miles
                </p>
              </div>

              <div className="overflow-x-auto -mx-6 sm:mx-0">
                <table className="w-full text-left min-w-[560px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-4 sm:px-2">Comparable Property</th>
                      <th className="py-2.5 px-3">Distance</th>
                      <th className="py-2.5 px-3">Sale Date</th>
                      <th className="py-2.5 px-3">Sold Price</th>
                      <th className="py-2.5 px-4 sm:px-2">£/Sq Ft</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 sm:px-2">
                        <p className="font-semibold text-slate-900">
                          14 Gorse Drive, Chorlton
                        </p>
                        <p className="text-xs text-slate-500">
                          4 Bed • 2 Bath • 2,100 sq ft (Detached)
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                          Direct Neighbour Comp
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">0.02 mi</td>
                      <td className="py-3.5 px-3 text-slate-600">Aug 2026</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900">
                        £755,000
                      </td>
                      <td className="py-3.5 px-4 sm:px-2 font-mono text-slate-700">
                        £359
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 sm:px-2">
                        <p className="font-semibold text-slate-900">
                          19 Beech Avenue, Chorlton
                        </p>
                        <p className="text-xs text-slate-500">
                          4 Bed • 3 Bath • 2,250 sq ft (Detached)
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                          Similar Spec & Garden
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">0.18 mi</td>
                      <td className="py-3.5 px-3 text-slate-600">Jul 2026</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900">
                        £765,000
                      </td>
                      <td className="py-3.5 px-4 sm:px-2 font-mono text-slate-700">
                        £340
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 sm:px-2">
                        <p className="font-semibold text-slate-900">
                          8 Wilbraham Road, Chorlton
                        </p>
                        <p className="text-xs text-slate-500">
                          4 Bed • 2 Bath • 2,040 sq ft (Detached)
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700">
                          Recent Renovation Comp
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">0.35 mi</td>
                      <td className="py-3.5 px-3 text-slate-600">Jun 2026</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900">
                        £740,000
                      </td>
                      <td className="py-3.5 px-4 sm:px-2 font-mono text-slate-700">
                        £362
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Valuation Methodology Note */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-1.5 text-xs text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-800">
                  AI Valuation Methodology & CPR Compliance Note
                </p>
                <p>
                  1. RICS red-book compliant comparable adjustments applied for square footage, condition, and location.
                </p>
                <p>
                  2. Incorporates Land Registry sold price data and active Zoopla/Rightmove competition.
                </p>
                <p>
                  3. Fully compliant with UK Consumer Protection Regulations for CPR-valid guidelines.
                </p>
              </div>
            </div>

            {/* Right: Vendor Pricing Strategies */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-2xs">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Vendor Pricing Strategies
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tailor the proposed asking price before pitching to the vendor.
                </p>
              </div>

              {/* Strategy 1: Realistic Market Guide */}
              <div
                onClick={() => setPricingStrategy("realistic")}
                className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                  pricingStrategy === "realistic"
                    ? "border-emerald-500 bg-emerald-50/20 shadow-xs"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-900">
                    Realistic Market Guide
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    BEST FIT
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Recommended for high winning probability
                </p>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-heading font-bold text-lg text-slate-900">
                    £749,000
                  </span>
                  <span className="text-[11px] text-slate-400">Est. 18-24 days</span>
                </div>
              </div>

              {/* Strategy 2: Premium Testing Guide */}
              <div
                onClick={() => setPricingStrategy("premium")}
                className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                  pricingStrategy === "premium"
                    ? "border-[#06143E] bg-slate-50 shadow-xs"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="font-bold text-sm text-slate-900">
                  Premium Testing Guide
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Test upper boundary of demand
                </p>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-heading font-bold text-lg text-slate-900">
                    £780,000
                  </span>
                  <span className="text-[11px] text-slate-400">Est. 35-45 days</span>
                </div>
              </div>

              {/* Strategy 3: Accelerated Sale Guide */}
              <div
                onClick={() => setPricingStrategy("accelerated")}
                className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                  pricingStrategy === "accelerated"
                    ? "border-[#06143E] bg-slate-50 shadow-xs"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="font-bold text-sm text-slate-900">
                  Accelerated Sale Guide
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Drive competitive bids & quick turnaround
                </p>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-heading font-bold text-lg text-slate-900">
                    £725,000
                  </span>
                  <span className="text-[11px] text-slate-400">Est. 7-14 days</span>
                </div>
              </div>

              {/* Rental Yield Card */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1 text-xs">
                <p className="font-semibold text-slate-800">
                  Projected Letting Potential (AST)
                </p>
                <p className="text-slate-500">
                  Estimated Rental:{" "}
                  <span className="font-semibold text-slate-900">
                    £3,200 – £3,500 / month
                  </span>
                </p>
                <p className="text-slate-500">
                  Estimated Gross Rental Yield:{" "}
                  <span className="font-semibold text-emerald-600">5.3%</span>
                </p>
              </div>

              {/* Apply Button */}
              <button
                type="button"
                onClick={() =>
                  showToast("Saved chosen valuation strategy to Marketing Pack!")
                }
                className="w-full h-11 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-xs sm:text-sm transition cursor-pointer shadow-sm"
              >
                Apply & Save to Marketing Pack
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: PORTAL SPECS (RIGHTMOVE)
      ========================================================================= */}
      {activeTab === "portal" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left Column: Portal Bullets & Description */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-5 shadow-2xs">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Rightmove & Zoopla Portal Specs
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Formatted and ready for copy-paste or automatic portal syndication feeds.
              </p>
            </div>

            {/* Portal Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPortalPlatform("rightmove")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  portalPlatform === "rightmove"
                    ? "bg-[#06143E] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Rightmove Format
              </button>

              <button
                onClick={() => setPortalPlatform("zoopla")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  portalPlatform === "zoopla"
                    ? "bg-[#06143E] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Zoopla Format
              </button>
            </div>

            {/* Card: Key Features Bullets */}
            <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  PORTAL BULLET POINTS (KEY FEATURES)
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      "• Executive Four-Bedroom Detached Residence in Desirable Chorlton\n• Expansive Open-Plan Designer Kitchen & Living Area with Bi-fold Doors\n• Private South-Facing Landscaped Garden with Paved Entertaining Terrace\n• Principal Suite with Luxury Dressing Area & Porcelain Wet Room\n• Integrated Sonos and Underfloor Heating Across Entire Ground Floor\n• Detached Double Garage & Driveway for Multiple Vehicles\n• Prime Catchment for Outstanding Ofsted Primary & Grammar Schools",
                      "bullets"
                    )
                  }
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "bullets" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Bullets</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                <p className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8A808] shrink-0 mt-1.5" />
                  <span>Executive Four-Bedroom Detached Residence in Desirable Chorlton</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8A808] shrink-0 mt-1.5" />
                  <span>Expansive Open-Plan Designer Kitchen & Living Area with Bi-fold Doors</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8A808] shrink-0 mt-1.5" />
                  <span>Private South-Facing Landscaped Garden with Paved Entertaining Terrace</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8A808] shrink-0 mt-1.5" />
                  <span>Principal Suite with Luxury Dressing Area & Porcelain Wet Room</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8A808] shrink-0 mt-1.5" />
                  <span>Integrated Sonos and Underfloor Heating Across Entire Ground Floor</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8A808] shrink-0 mt-1.5" />
                  <span>Detached Double Garage & Driveway for Multiple Vehicles</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8A808] shrink-0 mt-1.5" />
                  <span>Prime Catchment for Outstanding Ofsted Primary & Grammar Schools</span>
                </p>
              </div>
            </div>

            {/* Card: Full Portal Listing Description */}
            <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  FULL PORTAL LISTING DESCRIPTION
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">
                    1,420 / 2,000
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        "SUMMARY:\nPrestige Estates UK proudly introduces 16 Gorse Drive, an exceptional executive detached family home in Chorlton...\n\nGROUND FLOOR ACCOMMODATION:\nWelcoming entrance reception hallway with bespoke herringbone flooring and view of private rear gardens...\n\nFIRST FLOOR ACCOMMODATION:\nFour well-proportioned bedrooms, feature master with en-suite walk-in wet room, bespoke fitted robes...",
                        "description"
                      )
                    }
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "description" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-sans">
                <p className="font-bold text-slate-900">SUMMARY:</p>
                <p>
                  Prestige Estates UK proudly introduces 16 Gorse Drive, an exceptional executive detached family home situated on one of Chorlton&apos;s most sought-after tree-lined residential avenues.
                </p>
                <p className="font-bold text-slate-900 pt-1">
                  GROUND FLOOR ACCOMMODATION:
                </p>
                <p>
                  Welcoming entrance reception hallway with bespoke herringbone flooring, opening through to an expansive full-width kitchen dining and entertaining suite.
                </p>
                <p className="font-bold text-slate-900 pt-1">
                  FIRST FLOOR ACCOMMODATION:
                </p>
                <p>
                  Four well-proportioned bedrooms, feature master suite with private dressing room and luxury en-suite wet room, plus modern family bathroom suite.
                </p>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    "All Rightmove Data for 16 Gorse Drive copied successfully.",
                    "all-rm"
                  )
                }
                className="h-11 px-6 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-xs sm:text-sm transition cursor-pointer shadow-sm"
              >
                Copy All Rightmove Data
              </button>

              <button
                type="button"
                onClick={() => showToast("Exporting BLM / XML portal feed...")}
                className="h-11 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                Export XML / CSV
              </button>
            </div>
          </div>

          {/* Right Column: Portal Readiness & Rightmove Result Card */}
          <div className="lg:col-span-5 space-y-5">
            {/* Readiness Score Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-2xs">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Portal Readiness Score
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ensures maximum Rightmove & Zoopla search ranking
                </p>
              </div>

              {/* 100% Score Box */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-4 text-emerald-800">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-2xl text-emerald-700">
                    100% Score
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-xs text-emerald-700 mt-1 font-medium">
                  Ready for instant syndication • Quality Guaranteed
                </p>
              </div>

              {/* Compliance Checklist */}
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  COMPLIANCE & FEED VERIFICATION
                </p>
                <div className="space-y-2 text-xs text-slate-700">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Postcode & Tenure Specified</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>EPC Rating & Banding Included</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Floor Plan Dimensions Verified</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Minimum 8 High-Res Photos Uploaded</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>UK CPR 2008 Disclaimer Included</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Rightmove Search Result Card Mock */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-2xs">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                RIGHTMOVE RESULT CARD PREVIEW
              </p>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="relative aspect-16/9 bg-slate-900">
                  <Image
                    src="/landing/villa-dusk.jpg"
                    alt="Rightmove Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-semibold">
                    1/12
                  </div>
                </div>
                <div className="p-3.5 space-y-1">
                  <p className="font-heading font-bold text-base text-slate-900">
                    £750,000
                  </p>
                  <p className="text-xs text-slate-600">
                    4 bed detached house for sale • Gorse Drive
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold pt-1">
                    Marketed by Prestige Estates UK
                  </p>
                </div>
              </div>

              {/* Direct Sync Button */}
              <button
                type="button"
                onClick={() => showToast("Direct sync to Rightmove feed scheduled!")}
                className="w-full h-11 rounded-xl bg-[#06143E] hover:bg-[#0A2168] text-white font-semibold text-xs sm:text-sm transition cursor-pointer shadow-sm"
              >
                Direct Sync to Rightmove & Zoopla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
