"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { getAgencyContact } from "@/mocks/buyer";

export default function PropertyUnavailablePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const contact = getAgencyContact(resolvedParams.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DFE6EF] via-[#D5DEEA] to-[#CBD5E2] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-slate-200/90 text-center relative overflow-hidden">
        {/* Subtle decorative header bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#092167] via-[#E8A808] to-[#092167]" />

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center text-slate-500 mx-auto mb-4 mt-2 shadow-xs">
          <Clock className="w-8 h-8 text-slate-600" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs mb-3 border border-slate-200">
          BROCHURE ARCHIVED / 410 GONE
        </span>

        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mb-2">
          This Property Brochure is No Longer Available
        </h1>

        <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto mb-6">
          The estate agent has expired or disabled public access to this digital listing. The property may have been sold, let, or withdrawn from marketing.
        </p>

        {/* Agency Contact Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 mb-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-[#092167] text-[#E8A808] flex items-center justify-center font-bold text-sm shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-slate-900 leading-tight">
                {contact.agencyName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Marketed by {contact.agentName} ({contact.role})
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-slate-700">
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2.5 hover:text-[#092167] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#092167] shrink-0" />
              <span>{contact.phone}</span>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2.5 hover:text-[#092167] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#092167] shrink-0" />
              <span className="truncate">{contact.email}</span>
            </a>
            <div className="flex items-center gap-2.5 text-slate-500 text-xs">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{contact.address}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <a
            href={`tel:${contact.phone}`}
            className="w-full h-11 rounded-xl bg-[#06143E] hover:bg-[#092167] text-white font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Phone className="w-4 h-4 text-[#E8A808]" />
            <span>Call Listing Agency</span>
          </a>

          <Link
            href="/"
            className="w-full h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-xs flex items-center justify-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Property Pack AI</span>
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>UK Trading Standards Compliant Consumer Notice</span>
          </p>
        </div>
      </div>
    </div>
  );
}
