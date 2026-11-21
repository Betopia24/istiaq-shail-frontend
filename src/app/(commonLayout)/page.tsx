"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  Check,
  X,
  Clock,
  Layout,
  Layers,
  RefreshCw,
  FileText,
  Edit3,
  Download,
  Share2,
  Building,
  Briefcase,
  Plus,
  Minus,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  Globe,
  Video,
  Mail,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  SlidersHorizontal,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import PropertyPackHeroDemo from "@/components/ui/PropertyPackHeroDemo";

export default function HomePage() {
  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Smooth scroll handler for ?section= query param or hash on initial load
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const target = params.get("section") || window.location.hash.replace("#", "");
    if (target) {
      const timer = setTimeout(() => {
        const el = document.getElementById(target);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, []);

  const faqData = [
    {
      q: "What is Property Pack AI?",
      a: "Property Pack AI is an AI-powered property marketing platform built specifically for estate and letting agents. From a single property upload, it produces all ten essential marketing outputs — from vendor-ready valuation presentations to portal copy and digital brochures.",
    },
    {
      q: "Can I generate the complete pack or select individual outputs?",
      a: "Both! You can generate the entire 10-output marketing pack with one click, or select and export individual outputs whenever you need them — such as just a valuation proposal, Rightmove description, or social media scripts.",
    },
    {
      q: "What ten marketing outputs does Property Pack AI include?",
      a: "The ten outputs are: Professional Valuation Presentation, Full Property Description, Print-Ready PDF Brochure, Portal Specifications (Rightmove & Zoopla), Key Feature Highlights, Multi-Channel Social Content, Video Walkthrough & Reel Scripts, Buyer FAQs & Answers, Email Inquiry Responses, and an Instant Digital Shareable Property Pack.",
    },
    {
      q: "Can I customize packs with my agency branding?",
      a: "Yes, completely. Every deliverable inherits your agency logo, brand colours, negotiator contact details, and compliance disclaimers. Your brand stays front-and-centre on every output.",
    },
    {
      q: "Can I edit the AI-generated content before publishing?",
      a: "Yes. You retain full editorial control over every element. The built-in review editor lets you adjust valuation figures, polish descriptions, edit bullet points, and approve all copy before downloading or sharing.",
    },
    {
      q: "Can I download the property pack as a PDF and share via link?",
      a: "Yes. With one click you can export a print-ready, branded PDF brochure, or generate a secure mobile-friendly digital link to send directly to buyers and vendors via WhatsApp, SMS, or email.",
    },
  ];

  return (
    <div className="w-full bg-white text-slate-900 selection:bg-[#E8A808]/30 selection:text-[#06143E] min-h-screen">
      {/* =========================================================================
          SECTION 1: HERO SECTION (Exact Figma Implementation)
      ========================================================================= */}
      <section className="relative overflow-hidden bg-[#0A132C] text-white min-h-[calc(100vh-88px)] min-h-[calc(100dvh-88px)] flex items-center py-6 sm:py-8 lg:py-10 section-breathable">
        {/* Figma Background Image & Multi-Breakpoint Gradient Overlay for 100% Readability on All Screens */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg-image.svg"
            alt="Property Pack Architecture Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Base darkening tint to guarantee text contrast on all devices */}
          <div className="absolute inset-0 z-5 bg-[#0A132C]/45 pointer-events-none" />

          {/* Mobile & Tablet (< lg): Deep directional gradient ensuring zero contrast loss over bright photos */}
          <div
            className="block lg:hidden absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(10, 19, 44, 0.96) 0%, rgba(10, 19, 44, 0.90) 50%, rgba(10, 19, 44, 0.78) 100%)",
            }}
          />

          {/* Desktop (lg+): Rich horizontal gradient with deep left backing for text and crisp artwork on right */}
          <div
            className="hidden lg:block absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(10, 19, 44, 0.98) 0%, rgba(10, 19, 44, 0.93) 42%, rgba(10, 19, 44, 0.65) 65%, rgba(10, 19, 44, 0.25) 85%, rgba(10, 19, 44, 0.05) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1340px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center min-h-0">
            {/* Left Copy */}
            <div className="lg:col-span-7 min-w-0 space-y-6 text-center lg:text-left">
              {/* Prominent Flagship Positioning Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8A808]/15 border border-[#E8A808]/45 text-[#FFC024] text-xs font-medium shadow-xs backdrop-blur-xs hover:border-[#E8A808] transition-colors">
                <TrendingUp className="w-4 h-4 text-[#E8A808] shrink-0" />
                <span>
                  ★ Key Positioning: Professional Valuation Presentations to Win
                  Vendor Instructions
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] text-white tracking-tight leading-[1.14] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                One Property. One Upload.
                <br className="hidden sm:inline" /> Your Complete Marketing
                Pack.
              </h1>

              {/* Subheading: Full Value Proposition highlighting Valuation Presentation */}
              <p className="font-sans text-sm sm:text-base lg:text-[17px] text-slate-100 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal drop-shadow-sm">
                Turn a single property upload into all ten essential marketing
                outputs — anchored by our flagship{" "}
                <strong className="text-[#FFC024] font-medium">
                  Professional Valuation Presentation
                </strong>{" "}
                for vendor appraisals, plus portal copy, digital brochures, and
                social campaigns.
              </p>

              {/* Flexibility Indicators: Valuation Presentation & Complete Pack */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs text-white/95 pt-1">
                <a
                  href="#valuation-presentation"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E8A808]/20 border border-[#E8A808]/60 text-[#FFC024] hover:bg-[#E8A808]/30 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
                  <span className="font-medium">
                    Output 01: Valuation Proposal
                  </span>
                </a>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xs hover:bg-white/15 transition-colors">
                  <Check className="w-3.5 h-3.5 text-[#E8A808] stroke-[3]" />
                  <span className="font-medium text-white">
                    Complete 10-Output Pack
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xs hover:bg-white/15 transition-colors">
                  <Check className="w-3.5 h-3.5 text-[#E8A808] stroke-[3]" />
                  <span className="font-medium text-white">
                    Select Individual Outputs
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
                <Link
                  href="/sign-up"
                  className="w-full sm:w-auto h-10 sm:h-12 px-5 sm:px-7 rounded-lg sm:rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-medium text-xs sm:text-sm shadow-[0_4px_16px_rgba(232,168,8,0.4)] hover:shadow-[0_6px_24px_rgba(232,168,8,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Create Your Property Pack</span>
                  <ArrowRight className="w-4 h-4 text-[#06143E]" />
                </Link>
                <a
                  href="#valuation-presentation"
                  className="w-full sm:w-auto h-10 sm:h-12 px-4 sm:px-6 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-sans font-medium text-xs sm:text-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs"
                >
                  <TrendingUp className="w-4 h-4 text-[#E8A808]" />
                  <span>Explore Valuation Feature</span>
                </a>
              </div>
            </div>

            {/* Right Visual: Animated PropertyPackHeroDemo */}
            <div className="@container lg:col-span-5 min-w-0 flex justify-center lg:justify-end w-full">
              <div className="relative w-full">
                <PropertyPackHeroDemo />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THE PROBLEM (Before & With Property Pack AI)
      ========================================================================= */}
      <section className="py-24 lg:py-32 bg-slate-50 border-y border-slate-200/80 section-breathable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-medium text-[#8C6605]">
              <RefreshCw className="w-3.5 h-3.5 text-[#E8A808]" />
              <span className="uppercase tracking-wider">The Problem</span>
            </div>
            <h2 className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl text-[#020618] tracking-tight">
              Property Marketing Takes More Work Than It Should.
            </h2>
            <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Agents often prepare the same property information again and again
              for different marketing channels.
            </p>
          </div>

          {/* Comparison Cards Grid with Container Queries & Micro-interactions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto items-stretch">
            {/* Left Card: Before Property Pack AI */}
            <div className="@container cq-card bg-white rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-medium text-xl sm:text-2xl text-slate-800">
                    Before Property Pack AI
                  </h3>
                </div>

                {/* Workflow Tags with Container Query Fluidity */}
                <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-medium text-slate-500">
                  <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-600">
                    Manual
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-600">
                    Repetitive
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="px-3 py-1 rounded-md bg-rose-50 text-rose-600 border border-rose-200/60 font-medium">
                    Time-consuming
                  </span>
                </div>

                {/* Checklist (Negative items) */}
                <ul className="space-y-4 text-sm text-slate-600">
                  {[
                    "Writing property descriptions",
                    "Creating brochures",
                    "Preparing social media content",
                    "Writing buyer FAQs",
                    "Preparing email content",
                    "Organising property information",
                    "Creating professional presentations",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 group">
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-rose-100 group-hover:text-rose-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Card: With Property Pack AI */}
            <div className="@container cq-card bg-[#091D4E] rounded-3xl p-7 sm:p-9 border border-[#1E3B87] shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:border-[#E8A808]/60 transition-all duration-300 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#E8A808]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-medium text-xl sm:text-2xl text-white">
                    With Property Pack AI
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-[#E8A808] text-[#06143E] text-xs font-medium shadow-xs">
                    Automated
                  </span>
                </div>

                {/* Workflow Tags with Container Query Fluidity */}
                <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-medium text-slate-300">
                  <span className="px-3 py-1 rounded-md bg-white/10 text-white">
                    AI-assisted
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#E8A808]" />
                  <span className="px-3 py-1 rounded-md bg-white/10 text-white">
                    Structured
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#E8A808]" />
                  <span className="px-3 py-1 rounded-md bg-[#E8A808]/20 text-[#FFC024] border border-[#E8A808]/40 font-medium">
                    Ready to use
                  </span>
                </div>

                {/* Checklist (Positive items) */}
                <ul className="space-y-4 text-sm text-slate-200">
                  {[
                    "Property description drafted from your details",
                    "Brochure content structured for you",
                    "Social content ready to review",
                    "Buyer FAQs prepared from property information",
                    "Email content ready to edit",
                    "Property information organised in one place",
                    "Presentation materials in one property pack",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 group">
                      <div className="w-5 h-5 rounded-md bg-[#E8A808] text-[#06143E] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="font-medium text-slate-100 leading-snug">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE SOLUTION (One Property. One Intelligent Marketing Pack.)
      ========================================================================= */}
      <section
        id="how-it-works"
        className="py-24 lg:py-32 bg-white section-breathable"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-medium text-[#8C6605]">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
              <span className="uppercase tracking-wider">The Solution</span>
            </div>
            <h2 className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl text-[#020618] tracking-tight">
              One Property. One Intelligent Marketing Pack.
            </h2>
            <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Property Pack AI brings the property marketing workflow together,
              from first details to a finished pack.
            </p>
          </div>

          {/* 5-Step Process Horizontal Cards with Container Queries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Step 01 */}
            <div className="@container cq-card bg-slate-50/90 rounded-2xl p-6 border border-slate-200/90 hover:border-[#E8A808]/70 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <span className="font-heading font-semibold text-xs text-[#8C6605] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A] inline-block mb-3 group-hover:scale-105 transition-transform">
                  01
                </span>
                <h4 className="font-heading font-medium text-sm text-slate-900 mb-2">
                  Input Property Info
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Add address, specs, highlights and high-res imagery once.
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-slate-200 text-[10px] space-y-1.5 text-slate-500 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    14 Alder Grove
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium uppercase">
                    Demo
                  </span>
                </div>
                <span className="block text-slate-400">
                  £750,000 · 4 Bed Detached
                </span>
              </div>
            </div>

            {/* Step 02 */}
            <div className="@container cq-card bg-slate-50/90 rounded-2xl p-6 border border-slate-200/90 hover:border-[#E8A808]/70 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <span className="font-heading font-semibold text-xs text-[#8C6605] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A] inline-block mb-3 group-hover:scale-105 transition-transform">
                  02
                </span>
                <h4 className="font-heading font-medium text-sm text-slate-900 mb-2">
                  Full Pack or Individual
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Generate all 10 marketing outputs together or select specific
                  items.
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-slate-200 text-[10px] space-y-1.5 text-slate-500 shadow-2xs">
                <span className="block text-emerald-600 font-medium">
                  ✓ 10 Outputs in 1 Click
                </span>
                <span className="block text-blue-600 font-medium">
                  ✓ Or Pick Outputs Only
                </span>
              </div>
            </div>

            {/* Step 03 */}
            <div className="@container cq-card bg-slate-50/90 rounded-2xl p-6 border border-slate-200/90 hover:border-[#E8A808]/70 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <span className="font-heading font-semibold text-xs text-[#8C6605] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A] inline-block mb-3 group-hover:scale-105 transition-transform">
                  03
                </span>
                <h4 className="font-heading font-medium text-sm text-slate-900 mb-2">
                  Review & Refine
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Review valuation appraisal, descriptions, and portal specs.
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-slate-200 text-[10px] space-y-1 text-slate-500 flex items-center justify-between shadow-2xs">
                <span className="font-medium text-slate-800">
                  Inline Review Editor
                </span>
                <Edit3 className="w-3.5 h-3.5 text-[#E8A808]" />
              </div>
            </div>

            {/* Step 04 */}
            <div className="@container cq-card bg-slate-50/90 rounded-2xl p-6 border border-slate-200/90 hover:border-[#E8A808]/70 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <span className="font-heading font-semibold text-xs text-[#8C6605] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A] inline-block mb-3 group-hover:scale-105 transition-transform">
                  04
                </span>
                <h4 className="font-heading font-medium text-sm text-slate-900 mb-2">
                  Generate Marketing Pack
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Branded valuation report, brochures, and digital
                  presentations.
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-slate-200 text-[10px] space-y-1 text-slate-500 flex items-center justify-between shadow-2xs">
                <span className="font-medium text-slate-800">
                  Agency Branded
                </span>
                <FileCheck className="w-3.5 h-3.5 text-[#092167]" />
              </div>
            </div>

            {/* Step 05 */}
            <div className="@container cq-card bg-slate-50/90 rounded-2xl p-6 border border-slate-200/90 hover:border-[#E8A808]/70 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <span className="font-heading font-semibold text-xs text-[#8C6605] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A] inline-block mb-3 group-hover:scale-105 transition-transform">
                  05
                </span>
                <h4 className="font-heading font-medium text-sm text-slate-900 mb-2">
                  Download or Share
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Export PDF brochures, copy portal copy, or share live links.
                </p>
              </div>
              <div className="bg-[#092167] text-white rounded-xl p-2.5 text-[10px] font-medium text-center flex items-center justify-center gap-1.5 shadow-sm group-hover:bg-[#0c2d8c] transition-colors">
                <Download className="w-3 h-3 text-[#E8A808]" />
                <span>PDF, Copy & Link</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: DELIVERY (Ready to Download. Ready to Share.)
      ========================================================================= */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Steps */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-medium text-[#8C6605]">
                <Share2 className="w-3.5 h-3.5 text-[#E8A808]" />
                <span className="uppercase tracking-wider">Delivery</span>
              </div>

              <h2 className="font-heading font-medium text-3xl sm:text-4xl text-[#020618] tracking-tight">
                Ready to Download. Ready to Share.
              </h2>

              <p className="font-sans text-base text-slate-600 leading-relaxed">
                Agents can use the finished property pack when communicating
                with potential buyers or clients.
              </p>

              {/* 3 Step Cards */}
              <div className="space-y-4 pt-2">
                <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-heading font-medium text-sm text-[#E8A808]">
                      01
                    </span>
                    <h4 className="font-heading font-medium text-base text-slate-900">
                      Create
                    </h4>
                  </div>
                  <p className="text-sm text-slate-600 pl-7">
                    Generate the property pack from your property information.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-heading font-medium text-sm text-[#E8A808]">
                      02
                    </span>
                    <h4 className="font-heading font-medium text-base text-slate-900">
                      Review
                    </h4>
                  </div>
                  <p className="text-sm text-slate-600 pl-7">
                    Check the content and edit anything you want to change.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-heading font-medium text-sm text-[#E8A808]">
                      03
                    </span>
                    <h4 className="font-heading font-medium text-base text-slate-900">
                      Download PDF or Share Link
                    </h4>
                  </div>
                  <p className="text-sm text-slate-600 pl-7">
                    Send the finished pack to buyers or clients.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card: Full Property Pack Preview */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[420px] bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                {/* Property Photo */}
                <div className="relative h-56 w-full">
                  <Image
                    src="/landing/villa-dusk.jpg"
                    alt="14 Alder Grove - Demonstration Listing"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#E8A808] text-[#06143E] text-[10px] font-medium tracking-wider uppercase shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#06143E]" />
                    <span>DEMONSTRATION DATA</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  {/* Demo Notice Banner */}
                  <div className="flex items-center justify-between text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 font-medium">
                    <span>Sample Property Pack</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Demonstration Only
                    </span>
                  </div>

                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-heading font-medium text-lg text-slate-900">
                        14 Alder Grove
                      </h3>
                      <p className="text-xs text-slate-500">Richmond, Surrey</p>
                    </div>
                    <div className="text-right">
                      <span className="font-heading font-medium text-base text-[#092167]">
                        £750,000
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        Guide price (Demo)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
                    <span>4 bed</span>
                    <span>·</span>
                    <span>3 bath</span>
                    <span>·</span>
                    <span>1,850 sq ft</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-slate-700 uppercase tracking-wider block">
                      Description
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      A bright, extended family home on a quiet residential
                      street, with an open-plan kitchen, landscaped garden and
                      easy access to schools and transport.
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-medium text-slate-700 uppercase tracking-wider block">
                      Highlights
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#E8A808]" />
                        <span>Open-plan kitchen and dining</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#E8A808]" />
                        <span>South-facing landscaped garden</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#E8A808]" />
                        <span>Short walk to the station</span>
                      </li>
                    </ul>
                  </div>

                  {/* Card Agency Footer Strip */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-500 bg-[#092167] text-white -mx-6 -mb-6 p-4">
                    <span className="font-medium text-white">
                      Property Pack AI
                    </span>
                    <span className="text-slate-300">Property Pack AI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: AI IN PRACTICE (Dark Navy Section)
      ========================================================================= */}
      <section className="py-20 bg-[#08173E] text-white border-t border-[#1C2E63]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-[#E8A808]">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
              <span className="uppercase tracking-wider">AI In Practice</span>
            </div>
            <h2 className="font-heading font-medium text-3xl sm:text-4xl text-white tracking-tight">
              AI That Works Around Your Property Workflow.
            </h2>
            <p className="font-sans text-base text-slate-300">
              AI helps reduce repetitive marketing work while you stay in
              control of what goes out.
            </p>
          </div>

          {/* 6 Feature Grid Cards (2 rows x 3 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#0D2154]/70 border border-[#1E3778] rounded-xl p-7 hover:border-[#E8A808]/50 transition space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8A808]/15 border border-[#E8A808]/30 flex items-center justify-center text-[#E8A808]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-medium text-lg text-white">
                Faster content creation
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Turn property details into first drafts in a single workflow.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0D2154]/70 border border-[#1E3778] rounded-xl p-7 hover:border-[#E8A808]/50 transition space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8A808]/15 border border-[#E8A808]/30 flex items-center justify-center text-[#E8A808]">
                <Layout className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-medium text-lg text-white">
                Consistent property presentation
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Every pack follows the same structure and branding.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0D2154]/70 border border-[#1E3778] rounded-xl p-7 hover:border-[#E8A808]/50 transition space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8A808]/15 border border-[#E8A808]/30 flex items-center justify-center text-[#E8A808]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-medium text-lg text-white">
                Structured marketing outputs
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Description, highlights, FAQs and more, organised together.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0D2154]/70 border border-[#1E3778] rounded-xl p-7 hover:border-[#E8A808]/50 transition space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8A808]/15 border border-[#E8A808]/30 flex items-center justify-center text-[#E8A808]">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-medium text-lg text-white">
                Less repetitive work
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Stop rewriting the same property information for every channel.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-[#0D2154]/70 border border-[#1E3778] rounded-xl p-7 hover:border-[#E8A808]/50 transition space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8A808]/15 border border-[#E8A808]/30 flex items-center justify-center text-[#E8A808]">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-medium text-lg text-white">
                Professional presentation
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Polished layouts ready for buyers and clients.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-[#0D2154]/70 border border-[#1E3778] rounded-xl p-7 hover:border-[#E8A808]/50 transition space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8A808]/15 border border-[#E8A808]/30 flex items-center justify-center text-[#E8A808]">
                <Edit3 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-medium text-lg text-white">
                Human review and refinement
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                You review, edit and approve everything before it is shared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: ALL TEN MARKETING OUTPUTS (The Complete Marketing Suite)
      ========================================================================= */}
      <section id="marketing-outputs" className="py-20 bg-white scroll-mt-20">
        {/* Hidden anchor for legacy #features link compatibility */}
        <div id="features" className="sr-only" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-medium text-[#8C6605]">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
              <span className="uppercase tracking-wider">
                All Ten Marketing Outputs
              </span>
            </div>
            <h2 className="font-heading font-medium text-3xl sm:text-4xl text-[#020618] tracking-tight">
              Ten Agreed Marketing Outputs. One Unified System.
            </h2>
            <p className="font-sans text-base text-slate-600 leading-relaxed">
              Generate the complete marketing pack in one click, or select and
              export individual outputs whenever you need them.
            </p>
          </div>

          {/* Flexibility Banner: Complete Pack vs Individual Outputs */}
          <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Complete Pack */}
              <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 flex items-start gap-3.5 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-[#092167] text-[#E8A808] flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-medium text-sm text-slate-900">
                      Complete 10-Output Pack
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
                      1-Click
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload property info once and instantly generate all ten
                    outputs simultaneously in under 60 seconds.
                  </p>
                </div>
              </div>

              {/* Option B: Individual Outputs */}
              <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 flex items-start gap-3.5 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-[#E8A808]/15 text-[#092167] flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-5 h-5 text-[#8C6605]" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-medium text-sm text-slate-900">
                      Select Individual Outputs
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                      On-Demand
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Need only a vendor valuation proposal or portal copy? Pick
                    and export individual outputs whenever required.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              FEATURED CORE OUTPUT: PROFESSIONAL VALUATION PRESENTATION (SPOTLIGHT)
          ========================================================================= */}
          <div
            id="valuation-presentation"
            className="@container cq-panel scroll-mt-28 relative rounded-3xl bg-gradient-to-br from-[#06143E] via-[#091D4E] to-[#0A132C] text-white p-7 sm:p-10 lg:p-12 border-2 border-[#E8A808] shadow-[0_12px_40px_rgba(232,168,8,0.25)] hover:shadow-[0_16px_48px_rgba(232,168,8,0.35)] transition-all duration-300 overflow-hidden"
          >
            {/* Ambient radiant glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#E8A808]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Output #1 Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8A808] text-[#06143E] text-xs font-medium uppercase tracking-wider shadow-sm">
                    <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>
                      ★ Core Flagship Feature · Vendor Instruction Winner
                    </span>
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/10 text-slate-200 border border-white/15">
                    Output 01 of 10
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-heading font-medium text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                    Professional Valuation Presentation
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                    Win instructions on market appraisals by providing vendors
                    with an authoritative, data-backed presentation. Features
                    calculated valuation brackets, verified local comparable
                    sales, and 3 clear vendor pricing strategies designed to
                    convert valuation meetings into signed sole-agency
                    agreements.
                  </p>
                </div>

                {/* Feature Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-200 pt-1">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Estimated market value price range</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Recommended guide price rationale</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Recent local comparable transactions</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Three vendor pricing strategy pathways</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Printable Valuation PDF brochure</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>
                      Interactive &ldquo;Present to Vendor&rdquo; mode
                    </span>
                  </div>
                </div>

                {/* Compliance Badge */}
                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Compliant with UK Trading Standards (CPR) &amp; property
                    misdescriptions guidance
                  </span>
                </div>
              </div>

              {/* Right Column: Visual Demonstration Mockup */}
              <div className="lg:col-span-5">
                <div className="bg-[#0B1A42] rounded-2xl p-6 border border-[#1E3778] shadow-xl space-y-5">
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E8A808] animate-pulse" />
                      <span className="font-heading font-medium text-xs text-white uppercase tracking-wider">
                        AI Valuation Appraisal
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-medium bg-[#E8A808]/20 text-[#FFC024] border border-[#E8A808]/40">
                      DEMO DATA
                    </span>
                  </div>

                  {/* Range & Guide Price Box */}
                  <div className="grid grid-cols-2 gap-3 bg-[#071333] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                        Estimated Range
                      </span>
                      <span className="font-heading font-medium text-sm sm:text-base text-white">
                        £720k – £760k
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-amber-300 uppercase tracking-wider block">
                        Recommended Guide
                      </span>
                      <span className="font-heading font-medium text-sm sm:text-base text-[#E8A808]">
                        £745,000
                      </span>
                    </div>
                  </div>

                  {/* Three Pricing Strategies Preview */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                      Vendor Pricing Scenarios
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition">
                        <span className="block text-slate-400 text-[9px]">
                          Accelerated
                        </span>
                        <span className="font-medium text-white">£725,000</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#E8A808]/20 border border-[#E8A808]/60 shadow-xs">
                        <span className="block text-amber-300 font-medium text-[9px]">
                          Realistic
                        </span>
                        <span className="font-medium text-[#FFC024]">
                          £745,000
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition">
                        <span className="block text-slate-400 text-[9px]">
                          Premium
                        </span>
                        <span className="font-medium text-white">£765,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Dual Action Buttons with Micro-interactions */}
                  <div className="pt-2 flex items-center gap-2.5">
                    <div className="flex-1 h-10 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:scale-[0.98] text-[#06143E] font-heading font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer">
                      <Download className="w-3.5 h-3.5" />
                      <span>Valuation PDF</span>
                    </div>
                    <div className="flex-1 h-10 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-white/15 transition-all cursor-pointer">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Present Mode</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              THE REMAINING 9 MARKETING OUTPUTS (Structured Grid with Container Queries)
          ========================================================================= */}
          <div className="space-y-8 pt-6">
            <div className="text-center sm:text-left">
              <h3 className="font-heading font-medium text-xl sm:text-2xl text-slate-900 tracking-tight">
                Outputs 02 through 10
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Every asset needed across portal listings, social media, buyer
                communications, and print.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Output 2: Full Property Description */}
              <div className="@container cq-card bg-slate-50/90 rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-[#E8A808]/70 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5 group">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0c2d8c] transition-all duration-300 shadow-2xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-semibold text-xs text-[#8C6605] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A]">
                      02
                    </span>
                  </div>
                  <h4 className="font-heading font-medium text-base sm:text-lg text-slate-900">
                    Full Property Description
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Compelling, professionally drafted listing narrative crafted
                    specifically for UK property buyers, portal overviews, and
                    window display cards.
                  </p>
                </div>
                <div className="pt-3 flex flex-wrap gap-2 text-[10px] font-medium text-slate-500 border-t border-slate-200/60">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Listing Narrative
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Window Cards
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Editable
                  </span>
                </div>
              </div>

              {/* Output 3: Print-Ready PDF Brochure */}
              <div className="@container cq-card bg-slate-50/90 rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-[#E8A808]/70 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5 group">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0c2d8c] transition-all duration-300 shadow-2xs">
                      <Download className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-semibold text-xs text-[#8C6605] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A]">
                      03
                    </span>
                  </div>
                  <h4 className="font-heading font-medium text-base sm:text-lg text-slate-900">
                    Print-Ready PDF Brochure
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    A4 multi-page presentation brochure formatted to commercial
                    print specifications, branded with your agency logos,
                    colors, and direct contact details.
                  </p>
                </div>
                <div className="pt-3 flex flex-wrap gap-2 text-[10px] font-medium text-slate-500 border-t border-slate-200/60">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    A4 Print Spec
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Agency Branded
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    High Resolution
                  </span>
                </div>
              </div>

              {/* Output 4: Portal Specifications (Rightmove & Zoopla) */}
              <div className="@container cq-card bg-slate-50/90 rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-[#E8A808]/70 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5 group">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0c2d8c] transition-all duration-300 shadow-2xs">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-semibold text-xs text-[#8C6605] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A]">
                      04
                    </span>
                  </div>
                  <h4 className="font-heading font-medium text-base sm:text-lg text-slate-900">
                    Portal Specifications (Rightmove &amp; Zoopla)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Platform-compliant summaries, character limits, and bulleted
                    features optimized specifically for Rightmove and Zoopla
                    search algorithms.
                  </p>
                </div>
                <div className="pt-3 flex flex-wrap gap-2 text-[10px] font-medium text-slate-500 border-t border-slate-200/60">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Rightmove Format
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Zoopla Format
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    1-Click Copy
                  </span>
                </div>
              </div>

              {/* Output 5: Key Highlights & Features */}
              <div className="@container cq-card bg-slate-50/90 rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-[#E8A808]/70 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5 group">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0c2d8c] transition-all duration-300 shadow-2xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-semibold text-xs text-[#8C6605] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A]">
                      05
                    </span>
                  </div>
                  <h4 className="font-heading font-medium text-base sm:text-lg text-slate-900">
                    Key Highlights &amp; Features
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Structured room-by-room breakdown, room dimensions, EPC
                    notes, and standout property USPs formatted for rapid
                    scanning by prospective buyers.
                  </p>
                </div>
                <div className="pt-3 flex flex-wrap gap-2 text-[10px] font-medium text-slate-500 border-t border-slate-200/60">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Bullet USPs
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Room Specs
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Key Features
                  </span>
                </div>
              </div>

              {/* Output 6: Multi-Channel Social Content */}
              <div className="@container cq-card bg-slate-50/90 rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-[#E8A808]/70 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5 group">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0c2d8c] transition-all duration-300 shadow-2xs">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-semibold text-xs text-[#8C6605] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A]">
                      06
                    </span>
                  </div>
                  <h4 className="font-heading font-medium text-base sm:text-lg text-slate-900">
                    Multi-Channel Social Content
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Scroll-stopping property launch copy, carousel text, and
                    curated hashtag sets tailored for Instagram, Facebook, and
                    LinkedIn property marketing.
                  </p>
                </div>
                <div className="pt-3 flex flex-wrap gap-2 text-[10px] font-medium text-slate-500 border-t border-slate-200/60">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Instagram Captions
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Facebook Posts
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Hashtag Sets
                  </span>
                </div>
              </div>

              {/* Output 7: Video & Reel Scripts */}
              <div className="@container cq-card bg-slate-50/90 rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-[#E8A808]/70 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5 group">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0c2d8c] transition-all duration-300 shadow-2xs">
                      <Video className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-semibold text-xs text-[#8C6605] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A]">
                      07
                    </span>
                  </div>
                  <h4 className="font-heading font-medium text-base sm:text-lg text-slate-900">
                    Video Walkthrough &amp; Reel Scripts
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Scene-by-scene vertical video walkthrough scripts with
                    spoken voiceover cues and hooks for TikTok, Instagram Reels,
                    and YouTube Shorts.
                  </p>
                </div>
                <div className="pt-3 flex flex-wrap gap-2 text-[10px] font-medium text-slate-500 border-t border-slate-200/60">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Reels &amp; TikTok
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Timing Cues
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Voiceover Copy
                  </span>
                </div>
              </div>

              {/* Output 8: Buyer FAQs & Answers */}
              <div className="@container cq-card bg-slate-50/90 rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-[#E8A808]/70 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5 group">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0c2d8c] transition-all duration-300 shadow-2xs">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-semibold text-xs text-[#8C6605] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A]">
                      08
                    </span>
                  </div>
                  <h4 className="font-heading font-medium text-base sm:text-lg text-slate-900">
                    Buyer FAQs &amp; Answers
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Anticipated buyer questions covering tenure, council tax
                    band, EPC rating, parking, heating, boundaries, and local
                    school catchment areas.
                  </p>
                </div>
                <div className="pt-3 flex flex-wrap gap-2 text-[10px] font-medium text-slate-500 border-t border-slate-200/60">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Council Tax &amp; EPC
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Tenure Details
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    School Catchments
                  </span>
                </div>
              </div>

              {/* Output 9: Email Inquiry Responses */}
              <div className="@container cq-card bg-slate-50/90 rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-[#E8A808]/70 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5 group">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0c2d8c] transition-all duration-300 shadow-2xs">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-semibold text-xs text-[#8C6605] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A]">
                      09
                    </span>
                  </div>
                  <h4 className="font-heading font-medium text-base sm:text-lg text-slate-900">
                    Email Inquiry Responses
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Pre-drafted, professional email response templates ready to
                    send promptly to portal inquiries, viewing requests, and
                    vendor marketing updates.
                  </p>
                </div>
                <div className="pt-3 flex flex-wrap gap-2 text-[10px] font-medium text-slate-500 border-t border-slate-200/60">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Lead Follow-Ups
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Viewing Bookings
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Vendor Reports
                  </span>
                </div>
              </div>

              {/* Output 10: Instant Digital Shareable Pack */}
              <div className="@container cq-card bg-slate-50/90 rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-[#E8A808]/70 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5 group">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0c2d8c] transition-all duration-300 shadow-2xs">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-semibold text-xs text-[#8C6605] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A]">
                      10
                    </span>
                  </div>
                  <h4 className="font-heading font-medium text-base sm:text-lg text-slate-900">
                    Digital Shareable Property Pack
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Secure, mobile-responsive web link that vendors, buyers, and
                    investors can open instantly on any phone, tablet, or
                    browser with no download required.
                  </p>
                </div>
                <div className="pt-3 flex flex-wrap gap-2 text-[10px] font-medium text-slate-500 border-t border-slate-200/60">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Mobile-First Link
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    WhatsApp Ready
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                    Instant Access
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: WHO IT IS FOR (Built for Real Estate Professionals)
      ========================================================================= */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-medium text-[#8C6605]">
                <Briefcase className="w-3.5 h-3.5 text-[#E8A808]" />
                <span className="uppercase tracking-wider">Who It Is For</span>
              </div>

              <h2 className="font-heading font-medium text-3xl sm:text-4xl text-[#020618] tracking-tight">
                Built for Real Estate Professionals.
              </h2>

              <div className="space-y-4 pt-2">
                {/* Role Card 1: Estate Agents */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#092167] text-[#E8A808] flex items-center justify-center">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-medium text-base text-slate-900">
                        Estate Agents
                      </h3>
                      <p className="text-xs text-slate-500">
                        Create polished property marketing faster.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 pl-1">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E8A808]" />
                      <span>Property descriptions and highlights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E8A808]" />
                      <span>Branded property packs</span>
                    </li>
                  </ul>
                </div>

                {/* Role Card 2: Estate Agents */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#092167] text-[#E8A808] flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-medium text-base text-slate-900">
                        Estate Agents
                      </h3>
                      <p className="text-xs text-slate-500">
                        Prepare professional materials for buyers and clients.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 pl-1">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E8A808]" />
                      <span>Buyer FAQs and email content</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#E8A808]" />
                      <span>Shareable, presentation-ready packs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Side: Professional Photo with Keys */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[460px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                <div className="relative aspect-square w-full">
                  <Image
                    src="/landing/agent-keys.jpg"
                    alt="Real Estate Agent Holding Keys"
                    fill
                    sizes="(max-width: 768px) 100vw, 460px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06143E]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg text-slate-900">
                    <p className="font-heading font-medium text-sm text-[#092167]">
                      Designed for Modern Agencies
                    </p>
                    <p className="text-xs text-slate-600">
                      Designed specifically to streamline property marketing
                      instructions for modern estate &amp; letting agents.
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 italic">
                      Demonstration workflow for UK &amp; US property
                      professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: PRICING (Simple Pricing for Your Property Marketing Workflow)
      ========================================================================= */}
      <section
        id="pricing"
        className="py-24 lg:py-32 bg-white section-breathable"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-medium text-[#8C6605]">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
              <span className="uppercase tracking-wider">Pricing</span>
            </div>
            <h2 className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl text-[#020618] tracking-tight">
              Simple Pricing for Your Property Marketing Workflow
            </h2>
            <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Choose the plan that fits how often you create property packs.
            </p>
          </div>

          {/* 3 Pricing Cards with Container Queries & Micro-interactions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto items-stretch">
            {/* Plan 1: Starter */}
            <div className="@container cq-card bg-white rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900 mb-1">
                  Starter
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6">
                  For individual agents getting started.
                </p>

                <div className="mb-2">
                  <span className="font-heading font-bold text-3xl sm:text-4xl text-slate-900">
                    £39
                  </span>
                  <span className="text-xs sm:text-sm text-slate-600 font-medium ml-1.5">
                    / month
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-6 font-medium">
                  Billed monthly · 5 Property Packs included
                </p>

                <Link
                  href="/sign-up"
                  className="w-full h-10 sm:h-12 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center transition-all mb-8 shadow-2xs"
                >
                  Get Started
                </Link>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span>5 AI Property Marketing Packs / mo</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span>Valuation proposals & portal descriptions</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span>Live inline review & content editor</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span>Print-ready A4 PDF brochure export</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span>Instant shareable client web link</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Plan 2: Professional (Featured / Popular) */}
            <div className="@container cq-card bg-[#091D4E] rounded-3xl p-7 sm:p-9 border-2 border-[#E8A808] shadow-2xl hover:shadow-[0_20px_50px_rgba(232,168,8,0.25)] text-white flex flex-col justify-between relative transform md:-translate-y-3 hover:-translate-y-4 transition-all duration-300">
              {/* Popular Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E8A808] text-[#06143E] text-xs font-bold uppercase tracking-wider shadow-md">
                ★ Most Popular
              </div>

              <div>
                <h3 className="font-heading font-semibold text-xl sm:text-2xl text-white mb-1">
                  Professional
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6">
                  For active estate & letting agents.
                </p>

                <div className="mb-2">
                  <span className="font-heading font-bold text-3xl sm:text-4xl text-white">
                    £79
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 font-medium ml-1.5">
                    / month
                  </span>
                </div>
                <p className="text-xs text-amber-300/90 mb-6 font-medium">
                  Billed monthly · 25 Property Packs included
                </p>

                <Link
                  href="/sign-up"
                  className="w-full h-10 sm:h-12 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:scale-[0.98] text-[#06143E] font-bold text-xs sm:text-sm flex items-center justify-center transition-all shadow-[0_4px_16px_rgba(232,168,8,0.4)] hover:shadow-[0_6px_22px_rgba(232,168,8,0.5)] mb-8 cursor-pointer"
                >
                  Create Your Property Pack
                </Link>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span className="font-semibold text-white">
                      Everything in Starter
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span>25 AI Property Marketing Packs / mo</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span>Full agency logo, colors & disclaimers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span>All 10 deliverables (video reel scripts & socials)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span>Priority rendering & email support</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Plan 3: Team */}
            <div className="@container cq-card bg-white rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900 mb-1">
                  Team
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6">
                  For real estate branches & teams.
                </p>

                <div className="mb-2">
                  <span className="font-heading font-bold text-3xl sm:text-4xl text-slate-900">
                    £149
                  </span>
                  <span className="text-xs sm:text-sm text-slate-600 font-medium ml-1.5">
                    / month
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-6 font-medium">
                  Billed monthly · 60 Packs · Up to 5 seats
                </p>

                <Link
                  href="/sign-up"
                  className="w-full h-10 sm:h-12 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center transition-all mb-8 shadow-2xs"
                >
                  Start Team Trial
                </Link>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span className="font-semibold text-slate-900">
                      Everything in Professional
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span>60 Property Packs / mo (pooled team quota)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span>Up to 5 negotiator team seats</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span>Multi-branch branding presets</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0 stroke-[2.5]" />
                    <span>Dedicated account onboarding manager</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: FAQ (Frequently Asked Questions)
      ========================================================================= */}
      <section
        id="faq"
        className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200/80"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-medium text-[#8C6605]">
              <HelpCircle className="w-3.5 h-3.5 text-[#E8A808]" />
              <span className="uppercase tracking-wider">FAQ</span>
            </div>
            <h2 className="font-heading font-medium text-3xl sm:text-4xl text-[#06143E] tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
              Practical answers about creating, reviewing and sharing property packs.
            </p>
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {faqData.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-[#E8A808] shadow-md ring-1 ring-[#E8A808]/20"
                      : "border-slate-200/90 hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading font-medium text-sm sm:text-base text-slate-900 leading-snug">
                      {item.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? "bg-[#06143E] text-[#E8A808]"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 sm:px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: CALL TO ACTION BANNER (Make Every Property Easier to Market.)
      ========================================================================= */}
      <section className="py-24 sm:py-32 bg-white section-breathable">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-[#091D4E] text-white overflow-hidden p-8 sm:p-12 lg:p-16 border border-[#1E3778] shadow-2xl">
            {/* Background radiant ambient blur */}
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#E8A808]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#092167]/80 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Copy */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-[#E8A808]">
                  <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
                  <span className="uppercase tracking-wider">Get Started</span>
                </div>

                <h2 className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                  One Property. One Upload. Your Complete Marketing Pack.
                </h2>

                <p className="font-sans text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Generate all ten essential marketing outputs simultaneously or
                  select individual materials on demand.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/sign-up"
                    className="w-full sm:w-auto h-10 sm:h-12 px-5 sm:px-8 rounded-lg sm:rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-medium text-xs sm:text-sm shadow-[0_4px_16px_rgba(232,168,8,0.35)] hover:shadow-[0_6px_24px_rgba(232,168,8,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Create Your Property Pack</span>
                    <ArrowRight className="w-4 h-4 text-[#06143E]" />
                  </Link>
                  <a
                    href="#marketing-outputs"
                    className="w-full sm:w-auto h-10 sm:h-12 px-4 sm:px-6 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm border border-white/20 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
                  >
                    Explore 10 Outputs
                  </a>
                </div>
              </div>

              {/* Overlapping Property Pack Preview Card with Container Query */}
              <div className="@container lg:col-span-5 flex justify-center lg:justify-end">
                <div className="w-full max-w-[340px] bg-white rounded-2xl overflow-hidden shadow-2xl text-slate-900 border border-slate-200 transform lg:rotate-1 hover:rotate-0 hover:scale-[1.02] transition-all duration-300">
                  <div className="relative h-44 w-full">
                    <Image
                      src="/landing/villa-dusk.jpg"
                      alt="14 Alder Grove - Demonstration Listing"
                      fill
                      sizes="(max-width: 768px) 100vw, 340px"
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-[#E8A808] text-[#06143E] text-[10px] font-medium tracking-wider uppercase shadow-xs">
                      DEMONSTRATION DATA
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-heading font-medium text-sm text-slate-900">
                          14 Alder Grove
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Richmond, Surrey (Demo)
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-heading font-medium text-xs text-[#092167]">
                          £750,000
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-600 font-medium">
                      <span>4 bed</span>
                      <span>·</span>
                      <span>3 bath</span>
                      <span>·</span>
                      <span>1,850 sq ft</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span className="font-medium text-slate-700">
                        Prestige Estates
                      </span>
                      <span className="text-emerald-600 font-medium">
                        Ready to share
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
