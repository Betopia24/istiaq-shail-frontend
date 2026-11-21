import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Award,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Property Pack AI",
  description:
    "Built in Manchester for UK estate agents. Transforming property instructions into CPR-compliant marketing packs in seconds.",
};

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24 space-y-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] text-[#8C6605] border border-[#FDE68A] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
          <span>UK-First Property PropTech</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-[#06143E] tracking-tight">
          Empowering UK Estate Agents with AI-Driven Precision
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
          Property Pack AI was engineered from the ground up to solve the
          repetitive marketing bottleneck in British estate agency practices. We
          turn raw property specifications into 10 institutional-grade marketing
          deliverables in under 60 seconds.
        </p>
      </div>

      {/* Mission & Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center shadow-xs">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900">
            Speed to Market
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Eliminate hours spent manually drafting Rightmove descriptions,
            social media carousels, and print brochures. Win vendors at the
            valuation table with instant draft packs.
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900">
            UK CPR Compliance
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Designed specifically for the UK regulatory landscape: National
            Trading Standards Material Information (Parts A, B, and C) and
            Consumer Protection Regulations (CPR 2008).
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900">
            Bespoke Brand Identity
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every brochure, window card, and buyer link strictly preserves your
            agency&apos;s distinctive logo, vector colours, and professional
            disclaimers without generic templates.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <h2 className="font-heading font-bold text-2xl text-slate-900">
          Our Story
        </h2>
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            Founded in Greater Manchester, Property Pack AI was conceived by
            experienced property practitioners and technologists who recognised
            that independent estate agents were losing hundreds of hours every
            month on disjointed Canva files, Word templates, and manual portal
            uploads.
          </p>
          <p>
            By combining advanced generative models with structured UK land
            registry data, floor plan analysis, and EPC metrics, we built a
            unified workflow that enables negotiators to deliver high-calibre
            presentation packs that previously required a dedicated in-house
            design department.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-6 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Headquartered in Manchester, UK</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>GDPR &amp; UK Data Protection Registered</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Stripe Verified UK SaaS</span>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-[#06143E] text-white p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-heading font-bold text-2xl text-white">
            Ready to upgrade your agency marketing?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Start creating AI property packs today with your 14-day free trial.
          </p>
        </div>
        <Link
          href="/sign-up"
          className="h-12 px-6 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] font-heading font-semibold text-sm transition shadow-md flex items-center gap-2 shrink-0"
        >
          <span>Get Started Free</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
