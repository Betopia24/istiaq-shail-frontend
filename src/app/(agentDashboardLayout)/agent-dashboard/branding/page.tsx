"use client";

import React, { useRef, useState } from "react";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import { ApiImage } from "@/components/ui/ApiImage";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { errorText } from "@/lib/auth/client";
import { useAppSelector } from "@/redux/hook";
import {
  useGetBrandingQuery,
  useUpdateBrandingMutation,
  useUploadLogoMutation,
} from "@/redux/api/agency/agencyApi";

const UK_DISCLAIMER =
  "These particulars do not constitute any part of an offer or contract. All measurements, fixtures, and room layouts are approximate and verified independently.";
const US_DISCLAIMER =
  "Information is deemed reliable but not guaranteed. All properties are subject to prior sale, change, or withdrawal. Neither listing broker nor Property Pack AI shall be responsible for any typographical errors or misinformation.";

const MAX_LOGO_BYTES = 15 * 1024 * 1024;

interface BrandingForm {
  agencyName: string;
  tradingRegion: string;
  licenceNumber: string;
  phone: string;
  publicEmail: string;
  registeredAddress: string;
  primaryColour: string;
  accentColour: string;
  market: "UK" | "US";
  disclaimerText: string;
}

function BrandingSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-6 animate-pulse">
      <div className="h-5 w-64 bg-slate-200 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-11 bg-slate-100 rounded-lg" />
        ))}
      </div>
      <div className="h-24 bg-slate-100 rounded-lg" />
    </div>
  );
}

export default function AgencyBrandingPage() {
  const role = useAppSelector((st) => st.user.user?.role);
  const canEdit = role === "owner" || role === "administrator";

  const branding = useGetBrandingQuery();
  const [updateBranding, { isLoading: isSaving }] = useUpdateBrandingMutation();
  const [uploadLogo, { isLoading: isUploading }] = useUploadLogoMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<BrandingForm | null>(null);
  const [seededFrom, setSeededFrom] = useState<unknown>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (branding.data && seededFrom !== branding.data) {
    setSeededFrom(branding.data);
    const b = branding.data;
    setForm({
      agencyName: b.agencyName ?? "",
      tradingRegion: b.tradingRegion ?? "",
      licenceNumber: b.licenceNumber ?? "",
      phone: b.phone ?? "",
      publicEmail: b.publicEmail ?? "",
      registeredAddress: b.registeredAddress ?? "",
      primaryColour: b.primaryColour || "#0B1736",
      accentColour: b.accentColour || "#FFB800",
      market: b.market ?? "UK",
      disclaimerText: b.disclaimerText ?? "",
    });
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Logo must be a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      toast.error("Logo must be 15 MB or smaller.");
      return;
    }
    try {
      await uploadLogo(file).unwrap();
      toast.success("Logo uploaded successfully!");
    } catch (err) {
      toast.error(errorText(err));
    }
  };

  const handleMarketChange = (market: "UK" | "US") => {
    setForm((prev) => {
      if (!prev) return prev;
      const text = prev.disclaimerText.trim();
      // Offer the other market's standard wording only if the user hasn't written their own.
      const isPreset = text === "" || text === UK_DISCLAIMER || text === US_DISCLAIMER;
      return { ...prev, market, disclaimerText: isPreset ? (market === "UK" ? UK_DISCLAIMER : US_DISCLAIMER) : prev.disclaimerText };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setFieldErrors({});
    try {
      await updateBranding(form).unwrap();
      toast.success("Agency branding & localization settings saved successfully!");
    } catch (err) {
      const info = apiErrorInfo(err);
      if (info.status === 422) setFieldErrors(info.fields);
      toast.error(errorText(err));
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          PAGE HEADER
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">
            Agency Branding &amp; Localization
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Single consolidated form to configure firm assets, primary currency, and legal defaults
          </p>
        </div>
      </div>

      {/* =========================================================================
          MAIN FORM CONTAINER CARD
      ========================================================================= */}
      {branding.isLoading && <BrandingSkeleton />}
      {branding.error && <ErrorState error={branding.error} onRetry={() => branding.refetch()} />}
      {form && (
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-8"
      >
        {!canEdit && (
          <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            Only owners and administrators can change agency branding.
          </p>
        )}
        <fieldset disabled={!canEdit} className="contents">
        {/* =======================================================================
            SECTION 1: AGENCY PROFILE & REGULATORY CREDENTIALS
        ======================================================================= */}
        <div className="space-y-6">
          <div>
            <h2 className="font-heading font-medium text-base sm:text-lg text-slate-900">
              1. Agency Profile &amp; Regulatory Credentials
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Applied directly to PDF brochure covers, public links, and
              regulatory compliance notices
            </p>
          </div>

          {/* Logo Uploader */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#071330] border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden shadow-xs relative">
              <ApiImage
                src={branding.data?.logoUrl}
                alt="Agency Logo"
                className="absolute inset-0 w-full h-full object-contain p-1"
                fallback={
                  <div className="w-8 h-8 rounded-lg bg-[#FFB800] flex items-center justify-center shadow-xs">
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[11px] border-b-[#071330] mb-0.5" />
                  </div>
                }
              />
            </div>

            <div className="space-y-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="h-9 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-medium text-xs flex items-center gap-2 cursor-pointer transition shadow-2xs"
              >
                {isUploading ? "Uploading..." : "Upload Logo"}
              </button>
              <p className="text-[11px] text-slate-400">
                JPG, PNG or WebP, up to 15 MB
              </p>
            </div>
          </div>

          {/* Inputs Grid (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {/* Field 1: Commercial Name */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 uppercase tracking-wider mb-1.5">
                Agency Commercial Name
              </label>
              <input
                type="text"
                value={form.agencyName}
                onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
                placeholder="Your agency name"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/10 transition"
              />
              {fieldErrors.agencyName && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.agencyName}</p>}
            </div>

            {/* Field 2: Trading Region */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 uppercase tracking-wider mb-1.5">
                Trading Region / Sub-Territory
              </label>
              <input
                type="text"
                value={form.tradingRegion}
                onChange={(e) => setForm({ ...form, tradingRegion: e.target.value })}
                placeholder="e.g. Greater Manchester"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/10 transition"
              />
              {fieldErrors.tradingRegion && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.tradingRegion}</p>}
            </div>

            {/* Field 3: Regulatory License */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 uppercase tracking-wider mb-1.5">
                Regulatory License / Company Reg. No. (CRN / DRE / TPO)
              </label>
              <input
                type="text"
                value={form.licenceNumber}
                onChange={(e) => setForm({ ...form, licenceNumber: e.target.value })}
                placeholder="Company registration or licence number"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/10 transition"
              />
              {fieldErrors.licenceNumber && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.licenceNumber}</p>}
            </div>

            {/* Field 4: Office Telephone */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 uppercase tracking-wider mb-1.5">
                Office Telephone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Office telephone"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/10 transition"
              />
              {fieldErrors.phone && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.phone}</p>}
            </div>

            {/* Field 5: Public Inquiry Email */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 uppercase tracking-wider mb-1.5">
                Public Inquiry Email
              </label>
              <input
                type="email"
                value={form.publicEmail}
                onChange={(e) => setForm({ ...form, publicEmail: e.target.value })}
                placeholder="contact@youragency.co.uk"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/10 transition"
              />
              {fieldErrors.publicEmail && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.publicEmail}</p>}
            </div>

            {/* Field 6: Registered Office Address */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Office Address
              </label>
              <input
                type="text"
                value={form.registeredAddress}
                onChange={(e) => setForm({ ...form, registeredAddress: e.target.value })}
                placeholder="Registered office address"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/10 transition"
              />
              {fieldErrors.registeredAddress && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.registeredAddress}</p>}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* =======================================================================
            SECTION 2: PALETTE & BROCHURE ACCENT COLORS
        ======================================================================= */}
        <div className="space-y-4">
          <div>
            <h2 className="font-heading font-medium text-base sm:text-lg text-slate-900">
              2. Palette &amp; Brochure Accent Colors
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Defines styling for brochures, viewing buttons, and interactive
              cards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Primary Navy Color */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between gap-3.5 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-9 h-9 rounded-lg shrink-0 border border-black/10 shadow-2xs"
                  style={{ backgroundColor: form.primaryColour }}
                />
                <div className="min-w-0">
                  <p className="font-medium text-xs sm:text-sm text-slate-900">
                    Primary Navy Color
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {form.primaryColour} (Used for headers, text, and structure)
                  </p>
                </div>
              </div>
              <input
                type="color"
                value={form.primaryColour}
                onChange={(e) => setForm({ ...form, primaryColour: e.target.value.toUpperCase() })}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                title="Select Primary Color"
              />
              {fieldErrors.primaryColour && (
                <p className="text-[11px] text-rose-600">{fieldErrors.primaryColour}</p>
              )}
            </div>

            {/* Accent Gold Color */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between gap-3.5 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-9 h-9 rounded-lg shrink-0 border border-amber-600/20 shadow-2xs"
                  style={{ backgroundColor: form.accentColour }}
                />
                <div className="min-w-0">
                  <p className="font-medium text-xs sm:text-sm text-slate-900">
                    Accent Gold Color
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {form.accentColour} (Used for CTAs, highlights, and badges)
                  </p>
                </div>
              </div>
              <input
                type="color"
                value={form.accentColour}
                onChange={(e) => setForm({ ...form, accentColour: e.target.value.toUpperCase() })}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                title="Select Accent Color"
              />
              {fieldErrors.accentColour && (
                <p className="text-[11px] text-rose-600">{fieldErrors.accentColour}</p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* =======================================================================
            SECTION 3: OPERATING MARKET, CURRENCY & LEGAL COMPLIANCE
        ======================================================================= */}
        <div className="space-y-4">
          <div>
            <h2 className="font-heading font-medium text-base sm:text-lg text-slate-900">
              3. Operating Market, Currency &amp; Legal Compliance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Determines default currency symbols, spelling rules, and
              disclaimer notices across all generated assets
            </p>
          </div>

          {/* Market Selection Cards (UK vs US) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* UK Market Card */}
            <div
              onClick={() => handleMarketChange("UK")}
              className={`rounded-xl p-4 flex items-center justify-between cursor-pointer transition select-none ${
                form.market === "UK"
                  ? "border-2 border-[#FFB800] bg-amber-50/10 shadow-2xs"
                  : "border border-slate-200 bg-white hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#06143E] text-white font-medium text-sm flex items-center justify-center shrink-0 shadow-2xs">
                  £
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-xs sm:text-sm text-slate-900">
                    United Kingdom (UK)
                  </p>
                  <p className="text-[11px] text-[#B58306] font-medium mt-0.5">
                    Currency: GBP (£) • Guide Price, Freehold, EPC, UK CPR 2008
                  </p>
                </div>
              </div>

              {/* Radio Indicator */}
              <div className="shrink-0 ml-3">
                {form.market === "UK" ? (
                  <div className="w-5 h-5 rounded-full bg-[#FFB800] text-[#06143E] flex items-center justify-center shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300" />
                )}
              </div>
            </div>

            {/* US Market Card */}
            <div
              onClick={() => handleMarketChange("US")}
              className={`rounded-xl p-4 flex items-center justify-between cursor-pointer transition select-none ${
                form.market === "US"
                  ? "border-2 border-[#FFB800] bg-amber-50/10 shadow-2xs"
                  : "border border-slate-200 bg-white hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-medium text-sm flex items-center justify-center shrink-0">
                  $
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-xs sm:text-sm text-slate-700">
                    United States (US)
                  </p>
                  <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                    Currency: USD ($) • Listing Price, HOA, Standard Disclosures
                  </p>
                </div>
              </div>

              {/* Radio Indicator */}
              <div className="shrink-0 ml-3">
                {form.market === "US" ? (
                  <div className="w-5 h-5 rounded-full bg-[#FFB800] text-[#06143E] flex items-center justify-center shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300" />
                )}
              </div>
            </div>
          </div>

          {/* Mandatory Legal Disclaimer */}
          <div className="pt-2">
            <label className="block text-[11px] font-medium text-slate-700 uppercase tracking-wider mb-2">
              Mandatory Legal Disclaimer (Printed on PDF &amp; Web Footers)
            </label>
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-1">
              <p className="font-mono font-medium text-xs text-slate-900 uppercase">
                Compliance Notice (
                {form.market === "UK"
                  ? "UK CPR 2008"
                  : "US Standard Disclosures"}
                ):
              </p>
              <textarea
                rows={2}
                value={form.disclaimerText}
                onChange={(e) => setForm({ ...form, disclaimerText: e.target.value })}
                className="w-full bg-transparent text-xs text-slate-600 leading-relaxed resize-none focus:outline-none border-0 p-0"
              />
              {fieldErrors.disclaimerText && <p className="text-[11px] text-rose-600">{fieldErrors.disclaimerText}</p>}
            </div>
          </div>
        </div>

        </fieldset>
        {/* =======================================================================
            FOOTER ACTIONS
        ======================================================================= */}
        {canEdit && (
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSaving}
            className="h-11 px-7 rounded-lg bg-[#FFB800] hover:bg-[#E8A808] active:bg-[#D49800] text-[#06143E] font-heading font-medium text-sm shadow-[0_2px_10px_rgba(255,184,0,0.3)] transition cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto disabled:opacity-75"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-[#06143E] border-t-transparent rounded-full animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <span>Save Agency Settings</span>
            )}
          </button>
          <p className="text-xs text-slate-500">
            Changes take effect globally across all active packs, PDFs, and team
            links.
          </p>
        </div>
        )}
      </form>
      )}
    </div>
  );
}
