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
      a: "Property Pack AI is an AI-powered property marketing platform for real estate professionals. It turns property information into marketing content and a professional property pack that you can download as a PDF or share through a link.",
    },
    {
      q: "Who is Property Pack AI for?",
      a: "It is designed specifically for estate agents, realtors, property brokers, and marketing teams who want to produce consistent, high-converting property presentations, brochures, and portal descriptions without spending hours on repetitive writing.",
    },
    {
      q: "What can I create with Property Pack AI?",
      a: "You can generate comprehensive property packs including valuation briefs, full property descriptions, key highlight bullets, room-by-room features, buyer FAQs, email inquiry responses, and print-ready PDF brochures.",
    },
    {
      q: "Can I edit the AI-generated content?",
      a: "Yes, absolutely. You retain full control over all generated content. Our built-in review editor lets you modify, polish, rephrase, or approve every section before downloading or sharing.",
    },
    {
      q: "Can I download the property pack as a PDF?",
      a: "Yes. With a single click, you can export a beautifully formatted, print-ready PDF brochure branded with your agency logos, colors, and property specifications.",
    },
    {
      q: "Can I share a property pack with a link?",
      a: "Yes. Every property pack generates a secure, shareable digital link that you can send directly to buyers, investors, or vendors via email, WhatsApp, or SMS.",
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
            {/* Left Copy: Exactly as in Figma */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Main Headline */}
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-[56px] text-white tracking-tight leading-[1.12]">
                Turn Property Info<br />
                Into Marketing.
              </h1>

              {/* Subheading */}
              <p className="font-sans text-base sm:text-lg text-white/90 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Property Pack AI helps real estate professionals turn property information into polished marketing materials and professional property packs using AI.
              </p>

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
                  href="#how-it-works"
                  className="w-full sm:w-auto h-12 px-6 rounded-lg border border-white/40 hover:bg-white/10 text-white font-sans font-semibold text-sm transition flex items-center justify-center cursor-pointer"
                >
                  See How It Works
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
                  Add address, key specifications, highlights and photos.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200 text-[10px] space-y-1 text-slate-500">
                <span className="block font-medium text-slate-800">14 Alder Grove</span>
                <span className="block text-slate-400">£750,000 · 4 Bed</span>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between">
              <div>
                <span className="font-heading font-extrabold text-xs text-[#E8A808] block mb-2">02</span>
                <h4 className="font-heading font-bold text-sm text-slate-900 mb-1.5">Let AI Build the Marketing</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  AI transforms the information into structured marketing content.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200 text-[10px] space-y-1 text-slate-500">
                <span className="block text-emerald-600 font-semibold">✓ Description Drafted</span>
                <span className="block text-emerald-600 font-semibold">✓ Social Content Ready</span>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between">
              <div>
                <span className="font-heading font-extrabold text-xs text-[#E8A808] block mb-2">03</span>
                <h4 className="font-heading font-bold text-sm text-slate-900 mb-1.5">Review & Refine</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Review generated content and make adjustments easily.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200 text-[10px] space-y-1 text-slate-500 flex items-center justify-between">
                <span className="font-medium text-slate-800">Inline Editor</span>
                <Edit3 className="w-3.5 h-3.5 text-[#E8A808]" />
              </div>
            </div>

            {/* Step 04 */}
            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between">
              <div>
                <span className="font-heading font-extrabold text-xs text-[#E8A808] block mb-2">04</span>
                <h4 className="font-heading font-bold text-sm text-slate-900 mb-1.5">Create Your Property Pack</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Generate a polished, professional marketing package.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200 text-[10px] space-y-1 text-slate-500 flex items-center justify-between">
                <span className="font-medium text-slate-800">Brochure Pack</span>
                <FileCheck className="w-3.5 h-3.5 text-[#092167]" />
              </div>
            </div>

            {/* Step 05 */}
            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/90 hover:border-[#E8A808]/60 transition flex flex-col justify-between">
              <div>
                <span className="font-heading font-extrabold text-xs text-[#E8A808] block mb-2">05</span>
                <h4 className="font-heading font-bold text-sm text-slate-900 mb-1.5">Download or Share</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Download the final PDF or share it through a link.
                </p>
              </div>
              <div className="bg-[#092167] text-white rounded-lg p-2.5 text-[10px] font-semibold text-center flex items-center justify-center gap-1.5 shadow-sm">
                <Download className="w-3 h-3 text-[#E8A808]" />
                <span>PDF & Link</span>
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
                    alt="14 Alder Grove"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#E8A808] text-[#06143E] text-xs font-bold tracking-wider uppercase">
                    Property Pack
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-slate-900">14 Alder Grove</h3>
                      <p className="text-xs text-slate-500">Richmond, Surrey</p>
                    </div>
                    <div className="text-right">
                      <span className="font-heading font-extrabold text-base text-[#092167]">£750,000</span>
                      <span className="block text-[10px] text-slate-400">Guide price</span>
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
          SECTION 6: FEATURES (Everything Built Around the Property Pack)
      ========================================================================= */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-semibold text-[#8C6605]">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
              <span className="uppercase tracking-wider">Features</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#020618] tracking-tight">
              Everything Built Around the Property Pack.
            </h2>
          </div>

          {/* 4x2 Grid (Text cards + Image cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Row 1, Card 1: AI Property Marketing */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:shadow-sm transition space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 mb-1">
                  AI Property Marketing
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Turn property information into structured marketing content.
                </p>
              </div>
            </div>

            {/* Row 1, Card 2: Photo Card 1 (Villa at dusk) */}
            <div className="relative rounded-2xl overflow-hidden min-h-[160px] shadow-sm border border-slate-200">
              <Image
                src="/landing/villa-dusk.jpg"
                alt="Modern Villa Architecture"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition duration-500"
              />
            </div>

            {/* Row 1, Card 3: Professional Property Packs */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:shadow-sm transition space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 mb-1">
                  Professional Property Packs
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate polished, buyer-ready presentation materials.
                </p>
              </div>
            </div>

            {/* Row 1, Card 4: PDF Export */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:shadow-sm transition space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 mb-1">
                  PDF Export
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Download a professional PDF.
                </p>
              </div>
            </div>

            {/* Row 2, Card 5: Shareable Links */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:shadow-sm transition space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 mb-1">
                  Shareable Links
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Share the property pack digitally.
                </p>
              </div>
            </div>

            {/* Row 2, Card 6: Review & Edit */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:shadow-sm transition space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 mb-1">
                  Review & Edit
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Keep control over AI-generated content.
                </p>
              </div>
            </div>

            {/* Row 2, Card 7: Reusable Workflow */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:shadow-sm transition space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 mb-1">
                  Reusable Workflow
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Create consistent marketing packs across properties.
                </p>
              </div>
            </div>

            {/* Row 2, Card 8: Photo Card 2 (Townhouses at dusk) */}
            <div className="relative rounded-2xl overflow-hidden min-h-[160px] shadow-sm border border-slate-200">
              <Image
                src="/landing/townhouse-dusk.jpg"
                alt="Contemporary Townhouses Architecture"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition duration-500"
              />
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
                    <p className="text-xs text-slate-600">Save 4+ hours per property instructions with automated packs.</p>
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
                  Make Every Property Easier to Market.
                </h2>

                <p className="font-sans text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Turn property information into polished, professional marketing materials with AI.
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
                    href="#how-it-works"
                    className="w-full sm:w-auto h-12 px-6 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition flex items-center justify-center cursor-pointer"
                  >
                    See How It Works
                  </a>
                </div>
              </div>

              {/* Overlapping Property Pack Preview Card */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="w-full max-w-[340px] bg-white rounded-2xl overflow-hidden shadow-2xl text-slate-900 border border-slate-200 transform lg:rotate-1 hover:rotate-0 transition duration-300">
                  <div className="relative h-44 w-full">
                    <Image
                      src="/landing/villa-dusk.jpg"
                      alt="14 Alder Grove"
                      fill
                      sizes="(max-width: 768px) 100vw, 340px"
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#E8A808] text-[#06143E] text-[10px] font-bold tracking-wider uppercase">
                      Property Pack
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-slate-900">14 Alder Grove</h4>
                        <p className="text-[11px] text-slate-500">Richmond, Surrey</p>
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
