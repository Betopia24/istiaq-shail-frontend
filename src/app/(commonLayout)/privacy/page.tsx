import React from "react";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Property Pack AI",
  description:
    "UK GDPR and Data Protection Act 2018 compliant privacy policy for Property Pack AI users and agency clients.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-3 pb-8 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#092167] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E8A808]" />
          <span>UK GDPR &amp; DPA 2018 Compliant</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#06143E] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last Updated: 15 November 2026 • Effective Date: 1 January 2026
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            1. Overview &amp; Data Controller
          </h2>
          <p>
            Property Pack AI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the Property Pack AI
            software-as-a-service platform for estate agents and property
            professionals. We are registered in England and Wales. Under the UK
            General Data Protection Regulation (UK GDPR) and the Data Protection
            Act 2018, Property Pack AI acts as a Data Controller for agency user
            account information and as a Data Processor for property owner and
            buyer lead data ingested by subscriber agencies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Agency Account Data:</strong> Name, work email address,
              business mobile number, agency name, registered office address,
              and VAT registration details.
            </li>
            <li>
              <strong>Property Marketing Content:</strong> Property addresses,
              asking prices, tenure, EPC ratings, floor plans, room dimensions,
              and marketing photographs uploaded for brochure generation.
            </li>
            <li>
              <strong>Buyer Viewing Inquiries:</strong> Contact information
              submitted via public digital brochure links (name, email,
              telephone, and requested viewing dates/times).
            </li>
            <li>
              <strong>Payment Data:</strong> All financial and subscription
              card processing is securely handled by Stripe Payments UK Ltd. We
              never store raw credit card numbers or CVC codes on our servers.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            3. Legal Basis for Processing
          </h2>
          <p>
            We process your personal information under the following legal bases:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Contractual Necessity:</strong> To generate property packs,
              deliver brochure downloads, and maintain your agency subscription.
            </li>
            <li>
              <strong>Legitimate Interests:</strong> To protect platform
              security, prevent fraud, and optimize AI brochure rendering models.
            </li>
            <li>
              <strong>Legal Compliance:</strong> To satisfy UK VAT accounting,
              HMRC anti-money laundering records, and company audit regulations.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            4. Third-Party Sub-Processors
          </h2>
          <p>
            We maintain strict data processing agreements with our infrastructure
            partners. Data is hosted within UK / EU data regions:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Stripe UK (Payment processing and billing management)</li>
            <li>Cloudflare Inc. (DDoS protection, CDN, and SSL transport)</li>
            <li>AWS Europe / London Region (Encrypted asset storage)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            5. Your Rights Under UK GDPR
          </h2>
          <p>
            You have the right to request access to your personal data, rectify
            inaccurate information, request erasure (&quot;right to be forgotten&quot;),
            or restrict processing. To exercise these rights, please contact our
            Data Protection Officer at{" "}
            <a
              href="mailto:dpo@propertypack.ai"
              className="text-[#092167] font-semibold underline"
            >
              dpo@propertypack.ai
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            6. Contact Our Data Protection Team
          </h2>
          <p>
            If you have questions about this policy or our data practices, please
            write to:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <p className="font-semibold text-slate-900">
              Property Pack AI Data Protection Officer
            </p>
            <p className="text-slate-600 mt-1">
              14 Wilmslow Road, Didsbury, Manchester, M20 2RN, United Kingdom
            </p>
            <p className="text-slate-600">Email: dpo@propertypack.ai</p>
          </div>
        </section>
      </div>
    </div>
  );
}
