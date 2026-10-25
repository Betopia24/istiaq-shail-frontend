"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";

export default function HomePage() {
  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
      q: "What ten marketing outputs are included in Property Pack AI?",
      a: "The ten agreed marketing outputs are: 1. Professional Valuation Presentation, 2. Full Property Description, 3. Print-Ready PDF Brochure, 4. Portal Specifications (Rightmove & Zoopla), 5. Key Feature Highlights, 6. Multi-Channel Social Content, 7. Video Walkthrough & Reel Scripts, 8. Buyer FAQs & Answers, 9. Email Inquiry Responses, and 10. Instant Digital Shareable Property Pack.",
    },
    {
      q: "Who is Property Pack AI designed for?",
      a: "It is designed specifically for estate agents, letting agents, realtors, and property marketing teams who want to deliver consistent, compliant, and high-converting marketing materials without repetitive manual drafting.",
    },
    {
      q: "Can I edit the AI-generated content before publishing?",
      a: "Yes, absolutely. You retain full editorial control over every generated element. Our built-in review editor lets you adjust valuation figures, polish descriptions, edit room bullet points, and approve all copy before downloading or sharing.",
    },
    {
      q: "Can I download the property pack as a PDF and share via link?",
      a: "Yes. With a single click, you can export a beautifully formatted, print-ready PDF brochure branded with your agency logos and colors, or generate a secure, mobile-friendly digital link to send directly to buyers and vendors via WhatsApp, SMS, or email.",
    },
  ];

  return (
    <div className="w-full bg-white text-slate-900 selection:bg-[#E8A808]/30 selection:text-[#06143E]">
      {/* =========================================================================
          SECTION 1: HERO SECTION (Exact Figma Implementation)
      ========================================================================= */}
      <section className="relative overflow-hidden bg-[#0A132C] text-white pt-10 pb-20 lg:pt-16 lg:pb-28">
        {/* Figma Background Image & Linear Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg-image.svg"
            alt="Property Pack Architecture Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Exact Figma Linear Gradient: Left 80% Black (#000000 80%) to Right Transparent (#000000 0%) */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[540px]">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Main Headline */}
              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-[54px] text-white tracking-tight leading-[1.14]">
                One Property. One Upload.<br className="hidden sm:inline" /> Your Complete Marketing Pack.
              </h1>

              {/* Subheading: Full Value Proposition */}
              <p className="font-sans text-base sm:text-lg text-white/90 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Turn a single property upload into all ten essential marketing outputs — from professional valuation presentations to portal copy and social campaigns. Built for estate and letting agents.
              </p>

              {/* Flexibility Indicators: Complete Pack vs Individual Outputs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs text-white/90 pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15">
                  <Check className="w-3.5 h-3.5 text-[#E8A808] stroke-[3]" />
                  <span className="font-semibold text-white">Complete 10-Output Pack</span>
                </div>
                <span className="text-white/40 hidden sm:inline">•</span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15">
                  <Check className="w-3.5 h-3.5 text-[#E8A808] stroke-[3]" />
                  <span className="font-semibold text-white">Select Individual Outputs</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/sign-up"
                  className="w-full sm:w-auto h-12 px-7 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-sm shadow-[0_4px_16px_rgba(232,168,8,0.4)] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Create Your Property Pack</span>
                  <ArrowRight className="w-4 h-4 text-[#06143E]" />
                </Link>
                <a
                  href="#marketing-outputs"
                  className="w-full sm:w-auto h-12 px-6 rounded-lg border border-white/40 hover:bg-white/10 text-white font-sans font-semibold text-sm transition flex items-center justify-center cursor-pointer"
                >
                  Explore 10 Outputs
                </a>
              </div>
            </div>

            {/* Right Visual: Exact Figma Hero Right Visual SVG */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[568px] drop-shadow-2xl">
                <Image
                  src="/hero-right-image.svg"
                  alt="Property Information and Property Pack AI Transformation"
                  width={568}
                  height={547}
                  priority
                  className="w-full h-auto object-contain select-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THE PROBLEM (Before & With Property Pack AI)
      ========================================================================= */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-semibold text-[#8C6605]">
              <RefreshCw className="w-3.5 h-3.5 text-[#E8A808]" />
              <span className="uppercase tracking-wider">The Problem</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#020618] tracking-tight">
              Property Marketing Takes More Work Than It Should.
            </h2>
            <p className="font-sans text-base text-slate-600">
              Agents often prepare the same property information again and again for different marketing channels.
            </p>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Left Card: Before Property Pack AI */}
            <div className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-xl text-slate-800">
                    Before Property Pack AI
                  </h3>
                </div>

                {/* Workflow Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-medium text-slate-500">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">Manual</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">Repetitive</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 border border-rose-200/60 font-semibold">Time-consuming</span>
                </div>

                {/* Checklist (Negative items) */}
                <ul className="space-y-3.5 text-sm text-slate-600">
                  {[
                    "Writing property descriptions",
                    "Creating brochures",
                    "Preparing social media content",
                    "Writing buyer FAQs",
                    "Preparing email content",
                    "Organising property information",
                    "Creating professional presentations",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Card: With Property Pack AI */}
            <div className="bg-[#091D4E] rounded-2xl p-7 sm:p-8 border border-[#1E3B87] shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8A808]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-xl text-white">
                    With Property Pack AI
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8A808] text-[#06143E] text-xs font-bold">
                    Automated
                  </span>
                </div>

                {/* Workflow Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-medium text-slate-300">
                  <span className="px-2.5 py-1 rounded-md bg-white/10 text-white">AI-assisted</span>
                  <ArrowRight className="w-3 h-3 text-[#E8A808]" />
                  <span className="px-2.5 py-1 rounded-md bg-white/10 text-white">Structured</span>
                  <ArrowRight className="w-3 h-3 text-[#E8A808]" />
                  <span className="px-2.5 py-1 rounded-md bg-[#E8A808]/20 text-[#FFC024] border border-[#E8A808]/40 font-semibold">Ready to use</span>
                </div>

                {/* Checklist (Positive items) */}
                <ul className="space-y-3.5 text-sm text-slate-200">
                  {[
                    "Property description drafted from your details",
                    "Brochure content structured for you",
                    "Social content ready to review",
                    "Buyer FAQs prepared from property information",
                    "Email content ready to edit",
                    "Property information organised in one place",
                    "Presentation materials in one property pack",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md bg-[#E8A808] text-[#06143E] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="font-medium text-slate-100">{item}</span>
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
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-semibold text-[#8C6605]">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
              <span className="uppercase tracking-wider">The Solution</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#020618] tracking-tight">
              One Property. One Intelligent Marketing Pack.
            </h2>
            <p className="font-sans text-base text-slate-600">
              Property Pack AI brings the property marketing workflow together, from first details to a finished pack.
            </p>
          </div>

          {/* 5-Step Process Horizontal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Step 01 */}
            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between">
              <div>
                <span className="font-heading font-extrabold text-xs text-[#E8A808] block mb-2">01</span>
                <h4 className="font-heading font-bold text-sm text-slate-900 mb-1.5">Input Property Info</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Add address, specs, highlights and high-res imagery once.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200 text-[10px] space-y-1 text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">14 Alder Grove</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold uppercase">Demo</span>
                </div>
                <span className="block text-slate-400">£750,000 · 4 Bed Detached</span>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between">
              <div>
                <span className="font-heading font-extrabold text-xs text-[#E8A808] block mb-2">02</span>
                <h4 className="font-heading font-bold text-sm text-slate-900 mb-1.5">Full Pack or Individual</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Generate all 10 marketing outputs together or select specific items.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200 text-[10px] space-y-1 text-slate-500">
                <span className="block text-emerald-600 font-semibold">✓ 10 Outputs in 1 Click</span>
                <span className="block text-blue-600 font-semibold">✓ Or Pick Outputs Only</span>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between">
              <div>
                <span className="font-heading font-extrabold text-xs text-[#E8A808] block mb-2">03</span>
                <h4 className="font-heading font-bold text-sm text-slate-900 mb-1.5">Review & Refine</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Review valuation appraisal, descriptions, and portal specs.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200 text-[10px] space-y-1 text-slate-500 flex items-center justify-between">
                <span className="font-medium text-slate-800">Inline Review Editor</span>
                <Edit3 className="w-3.5 h-3.5 text-[#E8A808]" />
              </div>
            </div>

            {/* Step 04 */}
            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between">
              <div>
                <span className="font-heading font-extrabold text-xs text-[#E8A808] block mb-2">04</span>
                <h4 className="font-heading font-bold text-sm text-slate-900 mb-1.5">Generate Marketing Pack</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Branded valuation report, brochures, and digital presentations.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200 text-[10px] space-y-1 text-slate-500 flex items-center justify-between">
                <span className="font-medium text-slate-800">Agency Branded</span>
                <FileCheck className="w-3.5 h-3.5 text-[#092167]" />
              </div>
            </div>

            {/* Step 05 */}
            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between">
              <div>
                <span className="font-heading font-extrabold text-xs text-[#E8A808] block mb-2">05</span>
                <h4 className="font-heading font-bold text-sm text-slate-900 mb-1.5">Download or Share</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Export PDF brochures, copy portal copy, or share live links.
                </p>
              </div>
              <div className="bg-[#092167] text-white rounded-lg p-2.5 text-[10px] font-semibold text-center flex items-center justify-center gap-1.5 shadow-sm">
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-semibold text-[#8C6605]">
                <Share2 className="w-3.5 h-3.5 text-[#E8A808]" />
                <span className="uppercase tracking-wider">Delivery</span>
              </div>

              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#020618] tracking-tight">
                Ready to Download. Ready to Share.
              </h2>

              <p className="font-sans text-base text-slate-600 leading-relaxed">
                Agents can use the finished property pack when communicating with potential buyers or clients.
              </p>

              {/* 3 Step Cards */}
              <div className="space-y-4 pt-2">
                <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-heading font-extrabold text-sm text-[#E8A808]">01</span>
                    <h4 className="font-heading font-bold text-base text-slate-900">Create</h4>
                  </div>
                  <p className="text-sm text-slate-600 pl-7">
                    Generate the property pack from your property information.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-heading font-extrabold text-sm text-[#E8A808]">02</span>
                    <h4 className="font-heading font-bold text-base text-slate-900">Review</h4>
                  </div>
                  <p className="text-sm text-slate-600 pl-7">
                    Check the content and edit anything you want to change.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-heading font-extrabold text-sm text-[#E8A808]">03</span>
                    <h4 className="font-heading font-bold text-base text-slate-900">Download PDF or Share Link</h4>
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
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#E8A808] text-[#06143E] text-[10px] font-bold tracking-wider uppercase shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#06143E]" />
                    <span>DEMONSTRATION DATA</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  {/* Demo Notice Banner */}
                  <div className="flex items-center justify-between text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 font-medium">
                    <span>Sample Property Pack</span>
                    <span className="text-[10px] text-slate-500 font-normal">Demonstration Only</span>
                  </div>

                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-slate-900">14 Alder Grove</h3>
                      <p className="text-xs text-slate-500">Richmond, Surrey</p>
                    </div>
                    <div className="text-right">
                      <span className="font-heading font-extrabold text-base text-[#092167]">£750,000</span>
                      <span className="block text-[10px] text-slate-400">Guide price (Demo)</span>
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
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Description</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      A bright, extended family home on a quiet residential street, with an open-plan kitchen, landscaped garden and easy access to schools and transport.
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Highlights</span>
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
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-[#092167] text-white -mx-6 -mb-6 p-4">
                    <span className="font-semibold text-white">Your Agency Name</span>
                    <span className="text-slate-300">Agent name</span>
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#E8A808]">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
              <span className="uppercase tracking-wider">AI In Practice</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white tracking-tight">
              AI That Works Around Your Property Workflow.
            </h2>
            <p className="font-sans text-base text-slate-300">
              AI helps reduce repetitive marketing work while you stay in control of what goes out.
            </p>
          </div>

          {/* 6 Feature Grid Cards (2 rows x 3 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#0D2154]/70 border border-[#1E3778] rounded-xl p-7 hover:border-[#E8A808]/50 transition space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8A808]/15 border border-[#E8A808]/30 flex items-center justify-center text-[#E8A808]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white">
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
              <h3 className="font-heading font-bold text-lg text-white">
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
              <h3 className="font-heading font-bold text-lg text-white">
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
              <h3 className="font-heading font-bold text-lg text-white">
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
              <h3 className="font-heading font-bold text-lg text-white">
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
              <h3 className="font-heading font-bold text-lg text-white">
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-semibold text-[#8C6605]">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
              <span className="uppercase tracking-wider">All Ten Marketing Outputs</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#020618] tracking-tight">
              Ten Agreed Marketing Outputs. One Unified System.
            </h2>
            <p className="font-sans text-base text-slate-600 leading-relaxed">
              Generate the complete marketing pack in one click, or select and export individual outputs whenever you need them.
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
                    <h4 className="font-heading font-bold text-sm text-slate-900">
                      Complete 10-Output Pack
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      1-Click
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload property info once and instantly generate all ten outputs simultaneously in under 60 seconds.
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
                    <h4 className="font-heading font-bold text-sm text-slate-900">
                      Select Individual Outputs
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      On-Demand
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Need only a vendor valuation proposal or portal copy? Pick and export individual outputs whenever required.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              FEATURED CORE OUTPUT: PROFESSIONAL VALUATION PRESENTATION (SPOTLIGHT)
          ========================================================================= */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#06143E] via-[#091D4E] to-[#0A132C] text-white p-6 sm:p-9 lg:p-10 border-2 border-[#E8A808] shadow-2xl overflow-hidden">
            {/* Ambient radiant glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#E8A808]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Output #1 Details */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8A808] text-[#06143E] text-xs font-bold uppercase tracking-wider shadow-sm">
                  <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>★ Featured Output 01 · Vendor-Ready Proposal</span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                    Professional Valuation Presentation
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-slate-200 leading-relaxed">
                    Win vendor instructions at market appraisals with an authoritative, data-backed presentation. Features AI-calculated market brackets, local comparable transactions, and three clear vendor pricing strategies.
                  </p>
                </div>

                {/* Feature Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200 pt-1">
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
                    <span>Interactive &ldquo;Present to Vendor&rdquo; mode</span>
                  </div>
                </div>

                {/* Compliance Badge */}
                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Compliant with UK Trading Standards (CPR) &amp; property misdescriptions guidance</span>
                </div>
              </div>

              {/* Right Column: Visual Demonstration Mockup */}
              <div className="lg:col-span-5">
                <div className="bg-[#0B1A42] rounded-2xl p-5 border border-[#1E3778] shadow-xl space-y-4">
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E8A808]" />
                      <span className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                        AI Valuation Appraisal
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8A808]/20 text-[#FFC024] border border-[#E8A808]/40">
                      DEMO DATA
                    </span>
                  </div>

                  {/* Range & Guide Price Box */}
                  <div className="grid grid-cols-2 gap-3 bg-[#071333] p-3.5 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Estimated Range
                      </span>
                      <span className="font-heading font-bold text-sm sm:text-base text-white">
                        £720k – £760k
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider block">
                        Recommended Guide
                      </span>
                      <span className="font-heading font-bold text-sm sm:text-base text-[#E8A808]">
                        £745,000
                      </span>
                    </div>
                  </div>

                  {/* Three Pricing Strategies Preview */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Vendor Pricing Scenarios
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <span className="block text-slate-400 text-[9px]">Accelerated</span>
                        <span className="font-bold text-white">£725,000</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#E8A808]/20 border border-[#E8A808]/60">
                        <span className="block text-amber-300 font-semibold text-[9px]">Realistic</span>
                        <span className="font-bold text-[#FFC024]">£745,000</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <span className="block text-slate-400 text-[9px]">Premium</span>
                        <span className="font-bold text-white">£765,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <div className="flex-1 h-9 rounded-lg bg-[#E8A808] text-[#06143E] font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm">
                      <Download className="w-3.5 h-3.5" />
                      <span>Valuation PDF</span>
                    </div>
                    <div className="flex-1 h-9 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/15">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Present Mode</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              THE REMAINING 9 MARKETING OUTPUTS (Structured Grid)
          ========================================================================= */}
          <div className="space-y-6 pt-4">
            <div className="text-center sm:text-left">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                Outputs 02 through 10
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Every asset needed across portal listings, social media, buyer communications, and print.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Output 2: Full Property Description */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-extrabold text-xs text-[#E8A808]">02</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Full Property Description
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Compelling, professionally drafted listing narrative crafted specifically for UK property buyers, portal overviews, and window display cards.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500 border-t border-slate-200/60">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Listing Narrative</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Window Cards</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Editable</span>
                </div>
              </div>

              {/* Output 3: Print-Ready PDF Brochure */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-extrabold text-xs text-[#E8A808]">03</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Print-Ready PDF Brochure
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A4 multi-page presentation brochure formatted to commercial print specifications, branded with your agency logos, colors, and direct contact details.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500 border-t border-slate-200/60">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">A4 Print Spec</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Agency Branded</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">High Resolution</span>
                </div>
              </div>

              {/* Output 4: Portal Specifications (Rightmove & Zoopla) */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-extrabold text-xs text-[#E8A808]">04</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Portal Specifications (Rightmove &amp; Zoopla)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Platform-compliant summaries, character limits, and bulleted features optimized specifically for Rightmove and Zoopla search algorithms.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500 border-t border-slate-200/60">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Rightmove Format</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Zoopla Format</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">1-Click Copy</span>
                </div>
              </div>

              {/* Output 5: Key Highlights & Features */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-extrabold text-xs text-[#E8A808]">05</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Key Highlights &amp; Features
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Structured room-by-room breakdown, room dimensions, EPC notes, and standout property USPs formatted for rapid scanning by prospective buyers.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500 border-t border-slate-200/60">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Bullet USPs</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Room Specs</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Key Features</span>
                </div>
              </div>

              {/* Output 6: Multi-Channel Social Content */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-extrabold text-xs text-[#E8A808]">06</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Multi-Channel Social Content
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Scroll-stopping property launch copy, carousel text, and curated hashtag sets tailored for Instagram, Facebook, and LinkedIn property marketing.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500 border-t border-slate-200/60">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Instagram Captions</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Facebook Posts</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Hashtag Sets</span>
                </div>
              </div>

              {/* Output 7: Video & Reel Scripts */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                      <Video className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-extrabold text-xs text-[#E8A808]">07</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Video Walkthrough &amp; Reel Scripts
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Scene-by-scene vertical video walkthrough scripts with spoken voiceover cues and hooks for TikTok, Instagram Reels, and YouTube Shorts.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500 border-t border-slate-200/60">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Reels &amp; TikTok</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Timing Cues</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Voiceover Copy</span>
                </div>
              </div>

              {/* Output 8: Buyer FAQs & Answers */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-extrabold text-xs text-[#E8A808]">08</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Buyer FAQs &amp; Answers
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Anticipated buyer questions covering tenure, council tax band, EPC rating, parking, heating, boundaries, and local school catchment areas.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500 border-t border-slate-200/60">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Council Tax &amp; EPC</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Tenure Details</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">School Catchments</span>
                </div>
              </div>

              {/* Output 9: Email Inquiry Responses */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-extrabold text-xs text-[#E8A808]">09</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Email Inquiry Responses
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pre-drafted, professional email response templates ready to send promptly to portal inquiries, viewing requests, and vendor marketing updates.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500 border-t border-slate-200/60">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Lead Follow-Ups</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Viewing Bookings</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Vendor Reports</span>
                </div>
              </div>

              {/* Output 10: Instant Digital Shareable Pack */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <span className="font-heading font-extrabold text-xs text-[#E8A808]">10</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Digital Shareable Property Pack
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Secure, mobile-responsive web link that vendors, buyers, and investors can open instantly on any phone, tablet, or browser with no download required.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500 border-t border-slate-200/60">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Mobile-First Link</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">WhatsApp Ready</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Instant Access</span>
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-semibold text-[#8C6605]">
                <Briefcase className="w-3.5 h-3.5 text-[#E8A808]" />
                <span className="uppercase tracking-wider">Who It Is For</span>
              </div>

              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#020618] tracking-tight">
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
                      <h3 className="font-heading font-bold text-base text-slate-900">Estate Agents</h3>
                      <p className="text-xs text-slate-500">Create polished property marketing faster.</p>
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

                {/* Role Card 2: Realtors */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#092167] text-[#E8A808] flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-slate-900">Realtors</h3>
                      <p className="text-xs text-slate-500">Prepare professional materials for buyers and clients.</p>
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
                    <p className="font-heading font-bold text-sm text-[#092167]">Designed for Modern Agencies</p>
                    <p className="text-xs text-slate-600">Designed specifically to streamline property marketing instructions for modern estate &amp; letting agents.</p>
                    <p className="text-[10px] text-slate-400 mt-1 italic">Demonstration workflow for UK &amp; US property professionals.</p>
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
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-semibold text-[#8C6605]">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
              <span className="uppercase tracking-wider">Pricing</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#020618] tracking-tight">
              Simple Pricing for Your Property Marketing Workflow
            </h2>
            <p className="font-sans text-base text-slate-600">
              Choose the plan that fits how often you create property packs.
            </p>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Plan 1: Starter */}
            <div className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-1">Starter</h3>
                <p className="text-xs text-slate-500 mb-6">For individual agents getting started.</p>

                <div className="mb-2">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">£XX</span>
                  <span className="text-xs text-slate-500 font-medium ml-1.5">/ month</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-6">Pricing TBD · Billing frequency to be confirmed</p>

                <Link
                  href="/sign-up"
                  className="w-full h-11 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm flex items-center justify-center transition mb-7"
                >
                  Get Started
                </Link>

                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>AI-generated property marketing content</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Review and edit generated content</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Professional PDF property pack</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Shareable property pack link</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Usage limits: to be confirmed</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Plan 2: Professional (Featured / Popular) */}
            <div className="bg-[#091D4E] rounded-2xl p-7 sm:p-8 border-2 border-[#E8A808] shadow-2xl text-white flex flex-col justify-between relative transform md:-translate-y-2">
              {/* Popular Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#E8A808] text-[#06143E] text-xs font-bold uppercase tracking-wider shadow-md">
                ★ Popular
              </div>

              <div>
                <h3 className="font-heading font-bold text-xl text-white mb-1">Professional</h3>
                <p className="text-xs text-slate-300 mb-6">For agents who create property packs regularly.</p>

                <div className="mb-2">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-white">£XX</span>
                  <span className="text-xs text-slate-300 font-medium ml-1.5">/ month</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-6">Pricing TBD · Billing frequency to be confirmed</p>

                <Link
                  href="/sign-up"
                  className="w-full h-11 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-bold text-sm flex items-center justify-center transition shadow-[0_2px_12px_rgba(232,168,8,0.35)] mb-7 cursor-pointer"
                >
                  Create Your Property Pack
                </Link>

                <ul className="space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span className="font-semibold text-white">Everything in Starter</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Agent branding on property packs</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Multi-format content for different channels</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Reusable workflow across properties</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Usage limits: to be confirmed</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Plan 3: Team */}
            <div className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-1">Team</h3>
                <p className="text-xs text-slate-500 mb-6">For real estate teams and agencies.</p>

                <div className="mb-2">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">£XX</span>
                  <span className="text-xs text-slate-500 font-medium ml-1.5">/ month</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-6">Pricing TBD · Billing frequency to be confirmed</p>

                <Link
                  href="/sign-up"
                  className="w-full h-11 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm flex items-center justify-center transition mb-7"
                >
                  Get Started
                </Link>

                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span className="font-semibold text-slate-900">Everything in Professional</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Consistent packs across a team</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Team capabilities: to be confirmed</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E8A808] shrink-0" />
                    <span>Usage limits: to be confirmed</span>
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
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Header */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-semibold text-[#8C6605]">
                <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
                <span className="uppercase tracking-wider">FAQ</span>
              </div>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#020618] tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="font-sans text-base text-slate-600 leading-relaxed">
                Practical answers about creating, reviewing and sharing property packs.
              </p>
            </div>

            {/* Right Accordion List */}
            <div className="lg:col-span-7 space-y-3">
              {faqData.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden transition"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    >
                      <span className="font-heading font-semibold text-sm sm:text-base text-slate-900">
                        {item.q}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                        {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: CALL TO ACTION BANNER (Make Every Property Easier to Market.)
      ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-[#091D4E] text-white overflow-hidden p-8 sm:p-12 lg:p-14 border border-[#1E3778] shadow-2xl">
            {/* Background radiant ambient blur */}
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#E8A808]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#092167]/80 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Copy */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#E8A808]">
                  <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
                  <span className="uppercase tracking-wider">Get Started</span>
                </div>

                <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                  One Property. One Upload. Your Complete Marketing Pack.
                </h2>

                <p className="font-sans text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Generate all ten essential marketing outputs simultaneously or select individual materials on demand.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/sign-up"
                    className="w-full sm:w-auto h-12 px-7 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-bold text-sm shadow-[0_4px_16px_rgba(232,168,8,0.35)] hover:shadow-[0_6px_22px_rgba(232,168,8,0.45)] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Create Your Property Pack</span>
                    <ArrowRight className="w-4 h-4 text-[#06143E]" />
                  </Link>
                  <a
                    href="#marketing-outputs"
                    className="w-full sm:w-auto h-12 px-6 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition flex items-center justify-center cursor-pointer"
                  >
                    Explore 10 Outputs
                  </a>
                </div>
              </div>

              {/* Overlapping Property Pack Preview Card */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="w-full max-w-[340px] bg-white rounded-2xl overflow-hidden shadow-2xl text-slate-900 border border-slate-200 transform lg:rotate-1 hover:rotate-0 transition duration-300">
                  <div className="relative h-44 w-full">
                    <Image
                      src="/landing/villa-dusk.jpg"
                      alt="14 Alder Grove - Demonstration Listing"
                      fill
                      sizes="(max-width: 768px) 100vw, 340px"
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-[#E8A808] text-[#06143E] text-[10px] font-bold tracking-wider uppercase shadow-xs">
                      DEMONSTRATION DATA
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-slate-900">14 Alder Grove</h4>
                        <p className="text-[11px] text-slate-500">Richmond, Surrey (Demo)</p>
                      </div>
                      <div className="text-right">
                        <span className="font-heading font-bold text-xs text-[#092167]">£750,000</span>
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
                      <span className="font-semibold text-slate-700">Prestige Estates</span>
                      <span className="text-emerald-600 font-semibold">Ready to share</span>
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
