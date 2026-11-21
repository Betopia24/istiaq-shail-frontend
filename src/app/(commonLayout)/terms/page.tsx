import React from "react";
import type { Metadata } from "next";
import { Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Property Pack AI",
  description:
    "Subscription terms, acceptable use, and service level agreements for Property Pack AI estate agency subscribers.",
};

export default function TermsOfServicePage() {
  return (
    <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-3 pb-8 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#092167] text-xs font-semibold">
          <Scale className="w-3.5 h-3.5 text-[#E8A808]" />
          <span>UK Legal Terms &amp; Conditions</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#06143E] tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last Updated: 15 November 2026 • Governed by the Laws of England and
          Wales
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            1. Agreement to Terms
          </h2>
          <p>
            By subscribing to, accessing, or creating an account on Property
            Pack AI (&quot;the Service&quot;), your estate agency firm agrees to be legally
            bound by these Terms of Service. If you are entering into this
            agreement on behalf of an agency entity, you confirm that you hold
            legal authority to bind that entity.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            2. Service Scope &amp; AI Deliverables
          </h2>
          <p>
            Property Pack AI provides automated property marketing pack
            generation, including PDF brochure layouts, Rightmove/Zoopla portal
            specifications, social media assets, and digital presentation links.
            While our AI models are trained on UK property practices, the
            subscribing agency retains full editorial responsibility for verifying
            all dimensions, tenure disclosures, and property particulars before
            public distribution.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            3. Regulatory Compliance &amp; CPR Obligations
          </h2>
          <p>
            Under the Consumer Protection from Unfair Trading Regulations 2008
            (CPR) and National Trading Standards Material Information guidance,
            estate agents are strictly prohibited from omitting material
            information or making misleading statements. Property Pack AI
            provides standard disclaimers, but each agency must ensure that all
            factual details (such as tenure, service charges, and council tax)
            are accurate before publishing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            4. Subscription Tiers, Billing &amp; VAT
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Monthly Plans:</strong> Subscriptions are billed monthly
              in advance via Stripe. All quoted prices exclude UK VAT (20%) which
              is itemised on each monthly tax invoice.
            </li>
            <li>
              <strong>Pack Allowances:</strong> Monthly pack credits reset at
              the start of each billing cycle. Top-up pack bundles purchased
              separately never expire and roll over automatically.
            </li>
            <li>
              <strong>Cancellation:</strong> You may cancel or downgrade your
              subscription at any time from your Settings dashboard. Access
              remains active until the end of your prepaid billing period.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            5. Intellectual Property
          </h2>
          <p>
            You retain all intellectual property rights and copyright to your
            uploaded agency logos, photography, floor plans, and vendor
            particulars. Property Pack AI grants you an exclusive, worldwide,
            royalty-free licence to use and distribute all PDF brochures,
            marketing descriptions, and digital packs generated through the
            Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            6. Governing Law &amp; Jurisdiction
          </h2>
          <p>
            These terms are governed by and construed in accordance with the laws
            of England and Wales. Any disputes arising in connection with these
            terms shall be subject to the exclusive jurisdiction of the Courts
            of England and Wales.
          </p>
        </section>
      </div>
    </div>
  );
}
